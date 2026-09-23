# Historial de sesiones

> Bitácora append-only. Cada sesión cerrada agrega una entrada al final.
> No se editan entradas anteriores.

## Convención de archivos en progress/

Cada tipo de artefacto de sesión tiene su propio prefijo (observado y
consolidado a partir de proyectos reales que usan este harness):

| Archivo | Quién lo escribe | Contenido |
|---|---|---|
| `explore_<feature>.md` | `explorer` | Investigación previa a implementar una feature ambigua |
| `impl_<feature>.md` | `implementer` | Qué se creó/modificó, decisiones, output de build/tests |
| `review_<feature>.md` | `reviewer` | Veredicto (aprobado/rechazado) contra CHECKPOINTS.md |
| `qa_<feature>.md` | quien haga QA manual (opcional) | Resultados de verificación manual/exploratoria |

Formato de cada entrada de `history.md` (una por sesión cerrada):

```
## Sesión <fecha> — <feature> (id: <id>)

- **Feature:** <resumen>
- **Spec:** [[specs/<feature>/requirements|spec]]
- **Acciones:** <qué se hizo>
- **Resultado:** <build/tests, aprobado/rechazado>
- **Commits:** <hash(es) + mensaje(s)>
- **Estado final:** <in_progress|done>
```

---

## Sesión 2026-07-31 — auth-login-me (id: 4)

- **Feature:** `POST /v1/auth/login` (JWT HS256, 24h TTL) detrás de un puerto
  `TokenService` nuevo; `AuthGuard` global vía `APP_GUARD` +
  `@Public()`/`@CurrentUser()`; módulo nuevo `modules/users/` con
  `GET`/`PATCH /v1/me` (update parcial atómico, `timezone` validada con
  `Intl.supportedValuesOf`, auditoría `user.update` con solo nombres de
  campo). Reutiliza `UserRepository`/`PasswordHasher`/`AuditLogger` de
  `auth-registration` (#3) sin duplicar dominio.
- **Spec:** [[specs/auth-login-me/requirements|spec]] — aprobada por humano
  2026-07-31, R1-R15.
- **Acciones:** `spec_author` escribió la spec → aprobación humana →
  `implementer` (10 commits, TDD rojo-verde-refactor por requisito) →
  `reviewer` verificó código real de forma independiente (no solo el
  reporte) → **aprobado** sin observaciones bloqueantes ni no bloqueantes.
  PR #5 abierto (`feature/4-auth-login-me` → `main`), pendiente merge humano.
- **Resultado:** build/lint/`tsc --noEmit` verdes; 41/41 suites, 161/161
  tests verdes (baseline previo 28/96, sin regresiones). `access_token` en
  snake_case confirmado como contrato literal de la spec, no descuido de
  estilo.
- **Commits:** `0199fab`..`980ef58` (10 commits en
  `feature/4-auth-login-me`, ver `progress/impl_auth-login-me.md` para el
  detalle por requisito).
- **Estado final:** `done`.
- **Nota de entorno:** dos hallazgos de este sandbox concreto, ninguno del
  código: (1) Docker sin acceso (permisos, no socket) — sin e2e contra
  Postgres real, mismo criterio ya aceptado en #1-#3; (2) **nuevo**, el
  binding nativo de `argon2` da segfault al cargar en 2 archivos
  (`argon2-password-hasher.spec.ts`, `auth.module.spec.ts`) — prebuild roto
  en este sandbox y sin `make` para recompilar desde fuente. Confirmado por
  ejecución directa tanto por el implementer como por el reviewer; el resto
  de la suite corre normal. No es una regresión — CI en GitHub Actions sigue
  verde sobre el mismo commit. Detalle completo en `STATUS.md` ("Nuevo
  hallazgo de entorno 2026-07-31").

---

## Sesión 2026-07-30 — db-setup-drizzle (id: 1)

- **Feature:** Cablear Drizzle ORM al backend NestJS — deps (drizzle-orm, pg,
  drizzle-kit), `drizzle.config.ts`, `src/db/` (barrel de schema +
  `drizzle.module.ts` bajo token `DRIZZLE`), `AppConfigModule` global leyendo
  `../.env`, `GET /v1/health` público que verifica Postgres.
- **Spec:** [[specs/db-setup-drizzle/requirements|spec]] — aprobada por
  humano 2026-07-30.
- **Acciones:** `spec_author` escribió la spec (R1-R9) → aprobación humana →
  `implementer` completó TDD rojo-verde-refactor por requisito → humano
  limpió comentarios innecesarios del código (`a28e930`) → `reviewer`
  verificó código real + corrió `init.sh` y `test:e2e` de forma
  independiente → aprobado.
- **Resultado:** `init.sh` verde (build, 10/10 unit tests, lint, typecheck);
  `test:e2e` 5/5 contra Postgres real. Aprobado por el reviewer con una
  observación no bloqueante (frontmatter `status: draft→approved`, ya
  corregido).
- **Commits:** `1a3adf3`..`a28e930` (9 commits `feat`/`refactor`/`docs` en
  `feature/1-db-setup-drizzle`, ver `progress/impl_db-setup-drizzle.md` para
  el detalle por requisito).
- **Estado final:** `done`.
- **Nota de entorno:** el sandbox de trabajo no tiene acceso al socket de
  Docker; implementer y reviewer usaron un Postgres 16 local (`:5544`) para
  correr e2e en vez del Postgres 17 vía `docker-compose.yml` documentado.
  `.env` y `docker-compose.yml` no se modificaron. Pendiente de verificación
  1:1 contra Docker real antes de considerar la infra validada al 100%.

## Sesión 2026-07-30 (2) — localstack-provisioning (id: 2)

- **Feature:** Script idempotente de aprovisionamiento de LocalStack —
  `src/aws/` (clientes AWS SDK v3 vía `ConfigService`, `AwsModule` con
  tokens de inyección), `provisioning.ts` (4 colas SQS con DLQ/RedrivePolicy,
  tabla DynamoDB `positions` con TTL sobre `expires_at`, bucket S3 sin
  acceso público, bus EventBridge `pet-tracker`), `scripts/provision-local.ts`
  (`pnpm run provision:local`, idempotente).
- **Spec:** [[specs/localstack-provisioning/requirements|spec]] — R1-R19
  (ampliada con R18/R19 tras feedback humano sobre la convención del alias
  `@/*`), aprobada por humano 2026-07-30.
- **Acciones:** `spec_author` escribió la spec → rebase de la branch sobre
  `main` (creada antes de que el PR #1 mergeara, corregido tras feedback
  humano) → aprobación humana → feedback humano adicional: instalar `zod`
  (`class-validator` nunca se instaló pese a estar documentado) y resolver
  el alias `@/*` en build/tests/scripts (`tsc-alias`, `moduleNameMapper`,
  `tsconfig-paths/register`), documentado en `docs/conventions.md`, y
  reflejado en la spec (R18, R19) → `implementer` (12 commits, TDD) →
  `reviewer` **rechazó** por R4 sin test nombrado explícitamente (solo un
  `expect` dentro de `beforeAll`, viola CHECKPOINTS C4) → `implementer`
  aplicó fix quirúrgico (`2bd5de2`) → `reviewer` re-revisó y **aprobó**.
- **Resultado:** `init.sh` verde (build, 19/19 test suites / 33/33 tests,
  lint, typecheck). De los 19 requisitos: 9 (R1, R2, R3, R9, R15, R16, R17,
  R18, R19) verificados con tests reales que corren y pasan en este
  sandbox; los otros 10 (R4-R8, R10-R14) están implementados con test de
  integración escrito y commiteado pero sin ejecutar con éxito contra
  LocalStack real (ver nota de entorno).
- **Commits:** `df0df03`..`2bd5de2` (12 commits `feat`/`test`/`fix`/`docs`
  en `feature/2-localstack-provisioning`, ver
  `progress/impl_localstack-provisioning.md` para el detalle por requisito).
- **Estado final:** `done`.
- **Nota de entorno:** el sandbox no tiene acceso al socket de Docker.
  A diferencia de Postgres (feature #1), **LocalStack no tiene alternativa
  nativa viable** — `docker-compose.yml` y `localstack start` requieren
  Docker incluso en community edition. Los 10 requisitos que verifican
  creación real de recursos AWS (R4-R8, R10-R14) quedan implementados y
  con test de integración real (`test/localstack-provisioning.e2e-spec.ts`)
  pero sin ejecutar contra infra real en este sandbox — confirmado que el
  test falla de forma controlada (conexión rechazada), no por error de
  código/tipos. Seguimiento pendiente antes de considerar la feature
  100% validada: correr en una máquina con Docker `docker compose up -d &&
  pnpm -C backend-pet-tracker run test:e2e -- test/localstack-provisioning.e2e-spec.ts`.

---

## Sesión 2026-07-30 (3) — auth-registration (id: 3)

- **Feature:** Alta de usuario y verificación de email sin Cognito. Tres
  tablas nuevas en `src/db/schema/` (`users`, `email_verification_tokens`,
  `audit_log`) con migraciones `0001` (CREATE) y `0002` (DROP del placeholder
  `schema_bootstrap` que dejó #1); `src/audit/` como módulo `@Global()`
  compartido (puerto `AuditLogger` + token `AUDIT_LOGGER`), pensado para que
  lo reutilicen #5 y #7; `src/modules/auth/` en 3 capas con `POST
  /v1/auth/register` (201) y `POST /v1/auth/verify-email` (200).
- **Spec:** [[specs/auth-registration/requirements|spec]] — R1-R15, escrita en
  la sesión anterior, aprobada por humano 2026-07-30.
- **Acciones:** gate humano aprobado (frontmatter `draft` → `approved`) →
  branch `feature/3-auth-registration` creada desde
  `docs/auth-registration-spec-gaps`, porque `main` todavía no tiene el commit
  de la spec → `implementer` (6 commits, TDD por requisito) → `reviewer`
  **aprobó en la primera pasada**, verificando C2-C7 contra el código real y
  ejecutando `init.sh` él mismo.
- **Decisiones técnicas** (todas venían fijadas en `design.md` y se
  respetaron): argon2id detrás del puerto `PasswordHasher` (único import de
  `argon2` en todo `src/`), UUIDv7 generado en el repositorio Drizzle vía
  paquete `uuidv7`, token de verificación opaco de 256 bits persistido solo
  como SHA-256 hex (`token_hash`), TTL fijo de 24 h como constante de
  aplicación, `EMAIL_ENABLED=false` → log estructurado en vez de SES,
  serialización de salida por lista explícita de 8 campos.
  Añadido fuera del design pero aceptado por el reviewer:
  `application/verification-token.ts`, para compartir generación y hasheo del
  token entre los dos casos de uso sin meter `node:crypto` en `domain/`.
- **Resultado:** `init.sh` verde (build, 30/30 suites, 99/99 tests, lint,
  typecheck). Baseline previo 19 suites / 33 tests: sin regresiones. Los 15
  requisitos tienen test que nombra su R-id; `traceability.md` sin filas
  pendientes.
- **Commits:** `aa584e4`..`b2131a1` (6 commits en
  `feature/3-auth-registration`; detalle por requisito en
  `progress/impl_auth-registration.md`).
- **Estado final:** `done`.
- **Nota de entorno** (tercera sesión consecutiva con el mismo patrón): Docker
  no arranca en esta máquina —
  `failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine`,
  reproducido tanto por el implementer como por el reviewer. Las migraciones
  nunca se aplicaron contra Postgres real y no hay e2e. Sin ejecutar quedan el
  SQL de `0001`/`0002`, el `returning()` del insert de `users` y los
  `update ... where` de `markEmailVerified`/`markUsed`. A diferencia de #2,
  aquí se decidió **no** versionar un e2e que nadie ha visto pasar: un test
  verde por no ejecutarse es peor que no tenerlo. Seguimiento antes de
  considerar la feature 100% validada: en una máquina con Docker,
  `docker compose up -d && pnpm -C backend-pet-tracker exec drizzle-kit migrate`,
  y confirmar que las 3 tablas se crean y `schema_bootstrap` desaparece.
- **Trabajo de harness de la misma sesión:** los cuatro agentes delegables
  (`spec_author`, `explorer`, `implementer`, `reviewer`) no tenían frontmatter
  YAML, así que Claude Code nunca los registró como subagentes reales y el
  leader solo podía aproximar el rol instruyendo a un `general-purpose`.
  Añadido `name`/`description` en `b79ac5c`; `leader.md` queda sin frontmatter
  a propósito, con una nota que lo explica. Añadida además una
  `permissions.allow` explícita en `.claude/settings.json` para que el flujo
  leader → implementer → reviewer no dependa del clasificador de auto mode.
- **Seguimiento abierto para features posteriores:**
  (a) la descripción de #5 `pets-crud-permissions` decía que creaba
  `audit_log`; ya ajustada en `feature_list.json` para que la reutilice y no
  genere una migración duplicada.
  (b) no existe script `db:migrate` en `package.json` (solo `db:generate`);
  aplicar migraciones exige hoy `exec drizzle-kit migrate` a mano.

## Sesión 2026-08-01 — verificación con Docker real + fix/jest-e2e-alias

**Alcance**: sin feature nueva. Primera sesión con Docker funcionando en la
máquina; se cierran los seguimientos de entorno pendientes de #2 y #3 y se
corrigen dos bugs de infraestructura local descubiertos al ejecutar de verdad.

**Verificaciones cerradas**:
- #3 `auth-registration`: `drizzle-kit migrate` contra Postgres 17 (Docker)
  aplicó `0001`/`0002` — `users`, `email_verification_tokens` y `audit_log`
  creadas, `schema_bootstrap` eliminado (confirmado con `\dt` y
  `drizzle.__drizzle_migrations`, 3 migraciones registradas).
- #2 `localstack-provisioning`: `pnpm run provision:local` +
  `test/localstack-provisioning.e2e-spec.ts` contra LocalStack real —
  10/10 verdes. R4-R8 y R10-R14 quedan ejecutados; 19/19 requisitos de la
  feature verificados.

**Bugs encontrados y corregidos** (branch `fix/jest-e2e-alias`):
1. `localstack/localstack:latest` (serie CalVer 2026.x) exige
   `LOCALSTACK_AUTH_TOKEN` y sale con exit 55 sin él. Pineado a `4.14`,
   última versión community sin token — commit `7b0e492` (leader, infra
   harness).
2. `test/jest-e2e.json` con `rootDir: "."` mapeaba `@/` a
   `<rootDir>/src/$1` = `test/src/*` (inexistente): todo e2e que cargara
   `app.module.ts` fallaba con `createNoMappedModuleFoundError`. Nunca se
   detectó porque los e2e no habían corrido con Docker real. Fix de una
   línea (`<rootDir>/../src/$1`) vía `implementer` — commit `1edcd38`;
   `reviewer` **aprobó** (diff limitado a los 2 archivos esperados,
   `init.sh` verde, e2e re-ejecutado por él mismo). Ciclo "bug en 1 archivo"
   de la tabla de escalado del leader. Reportes:
   `progress/impl_fix-jest-e2e-alias.md`,
   `progress/review_fix-jest-e2e-alias.md`.

**Resultado**: suite completa contra infra real — e2e 3/3 (15 tests), unit
30/30 (99 tests), `init.sh` verde. PR del branch abierto para merge humano.

**Nota**: el error original del humano al migrar (`ENOENT ...
backend-pet-tracker\backend-pet-tracker`) era solo de ruta: corrió
`pnpm -C backend-pet-tracker ...` desde dentro de `backend-pet-tracker/`.

**Pendientes que siguen abiertos**:
- Runtime real de auth sin e2e: `returning()` del insert de `users` y
  `update ... where` de `markEmailVerified`/`markUsed` — candidato a e2e
  cuando `auth-login-me` (#4) toque el módulo.
- No existe script `db:migrate` en `package.json` (solo `db:generate`).

### Adenda misma sesión — convención de alias endurecida + refactor auth

Por decisión humana tras revisar el módulo auth: el alias `@/` pasa a ser
obligatorio también para saltos de capa dentro del mismo módulo (antes el
relativo `../../domain/...` era válido por la regla "mismo módulo").

- `docs/conventions.md` §Imports actualizado por el leader (`25ee4ae`),
  con nota de historial del cambio de regla.
- Refactor mecánico de `src/modules/auth/` vía `implementer` (`626bb10`):
  46 líneas de import en 14 archivos, cero cambios de lógica (diff
  verificado línea a línea). Relativos que quedan: misma capa y wiring de
  `auth.module.ts`. Verificación completa: unit 30/30 (99), build,
  e2e 3/3 (15), `init.sh` verde, lint sin reordenar nada.
- `reviewer` **aprobó** (`progress/review_auth-alias-refactor.md`);
  reporte del implementer en `progress/impl_auth-alias-refactor.md`.
- `graphify update .` ejecutado tras el commit.

Nota: `src/db/` y `src/modules/health/` (#1) siguen con relativos — la
exención histórica documentada en conventions.md se mantiene.

### Adenda misma sesión — cierre del PR #5 (auth-login-me, #4)

El branch `feature/4-auth-login-me` (trabajado 2026-07-31 en un sandbox
Linux sin Docker y con segfault de argon2) llegó con CI rojo, 7 commits
detrás de main y 3 archivos en conflicto. Cierre en esta máquina:

- Rebase sobre main vía `implementer`: 12 commits reaplicados, conflictos
  resueltos (auth.controller.ts/spec con imports en alias conservando el
  endpoint de login; STATUS.md reconciliado preservando la sesión
  2026-08-01 y acotando el hallazgo de argon2 a aquel sandbox).
- Refactor de 22 imports cross-layer del código nuevo de #4 a alias
  (`28179a1`), convención endurecida cumplida en `auth/` y `users/`.
- Fix del test imposible `moduleRef.get(APP_GUARD)` → aserción por
  `Reflect.getMetadata('providers', AuthModule)`, nombrada R5 (`c8ab4d6`);
  trazabilidad re-mapeada post-rebase (`69c7935`).
- `test/app.e2e-spec.ts` alineado al guard global: `GET /v1` sin token
  ahora espera 401 por R5/R7 (`8ae4687`) — el scaffold esperaba 200.
- Verificación en real: unit 43/43 (167), e2e 3/3 (15) contra Postgres y
  LocalStack, `init.sh` verde, CI del PR #5 **verde**.
- `reviewer` **aprobó** (`progress/review_auth-login-me-rebase.md`).

Deuda detectada (fuera de alcance, candidata a limpieza propia):
`src/modules/health/` (#1) conserva 5 imports relativos cross-layer.

## Sesión 2026-08-01 — pets-crud-permissions (id: 5)

- **Feature:** tablas `pets` + `pet_users`, `PetAccessGuard` + `@RequirePetRole`,
  CRUD `/v1/pets` — mecanismo de autorización de todas las features posteriores.
- **Spec:** [[specs/pets-crud-permissions/requirements|spec]] — 16 EARS (R1-R16),
  aprobada por humano el 2026-08-01 con 5 decisiones registradas (audit post-commit
  vía puerto, DTO mínimo obligatorio, enums sex/size, PATCH birthDate XOR
  approxAgeMonths, GET detalle para cualquier rol activo).
- **Acciones:** ciclo SDD completo — `spec_author` → gate humano → `implementer`
  (13 commits TDD por R-id en `feature/5-pets-crud-permissions`) → `reviewer`
  (rechazo por B1: frontmatter de la spec en `draft` pese a aprobación humana;
  fix del leader `3a0b481`, todo lo demás aprobado) → PR #8 → merge humano.
- **Resultado:** `./init.sh` verde (build, 275 unit / 56 suites, lint, typecheck);
  e2e 19/19 contra Postgres real, IDOR (R9) verificado. Trazabilidad R1-R16
  completa. `audit_log` reutilizado sin migración nueva; guard global de #4 intacto.
- **Commits:** `c2d889b`..`3a0b481` (14 en la branch), merge `ebc3d59` (PR #8).
- **Estado final:** done

## Sesión 2026-08-01 (2) — devices-claim (id: 7)

- **Feature:** tablas `devices` + `pet_devices`, `POST /v1/devices/claim`,
  `GET`/`DELETE /v1/pets/:petId/device`, seed idempotente de 3 devices
  simulados — prerequisito de la cadena GPS (#8 pipeline, #9 positions).
- **Spec:** [[specs/devices-claim/requirements|spec]] — 15 EARS (R1-R15),
  aprobada por humano el 2026-08-01 con 4 decisiones (D1: membresía del
  claim en el use case vía `PET_REPOSITORY.findMembership()`, guard de #5
  intacto; D2: índice único parcial sobre `pet_id` activo + 409
  `PET_ALREADY_HAS_DEVICE`; D3: disponibilidad derivada de la fila activa,
  self-healing tras borrar mascota; D4: UNIQUE en los 4 identificadores
  de claim).
- **Acciones:** ciclo SDD completo en una sesión — `spec_author` → gate
  humano (D1-D4 aceptadas como propone la spec) → `implementer` (13
  commits TDD por R-id en `feature/7-devices-claim`) → `reviewer`
  **aprobó a la primera**, sin bloqueantes (4 observaciones NB) → PR #11.
- **Resultado:** `./init.sh` verde (build, 319 unit, lint, typecheck);
  e2e 55/55 contra Postgres real (devices 21/21: IDOR R5, carrera
  concurrente R8, self-healing R15). Trazabilidad 15/15.
  `docs/data-model.md` actualizado por D2/D4.
- **Commits:** `9133343`..`ffcc6f8` (15 en la branch), PR #11 abierto.
- **Estado final:** done — espera merge humano del PR #11

## Sesión 2026-08-02 — wialon-ingestion-pipeline (id: 8)

- **Feature:** pipeline de ingesta GPS completo: puerto `WialonClient`
  (fake determinista `SIM_MODE` + `WialonHttpClient` real sin conectar),
  pipeline puro de validación (`src/pipeline/`), poller cron + consumidor
  SQS → DynamoDB `positions` + `pets.last_position` + eventos
  `position.updated`/`battery.low` (detail.version=1) a EventBridge.
  Cero migraciones nuevas (sustrato de #2/#5/#7 reutilizado).
- **Spec:** [[specs/wialon-ingestion-pipeline/requirements|spec]] — 19 EARS
  (R1-R19), aprobada por humano el 2026-08-02 con decisiones D1-D14
  aceptadas íntegras (D1: `docs/wialon-module.md` como entregable, cierra
  drift del plan 005; D2: fake stateless mulberry32 por slot con
  `SIM_SEED`; D3: malformados vía redrive a DLQ; D8: `battery.low` por
  flanco 20/30; D9: contrato de eventos congelado v1; D10: workers
  invocables `runOnce()`/`drainOnce()` con gating `POLLER_ENABLED` +
  `NODE_ENV !== 'test'`; D11: 7 env vars nuevas; D14: puerto propio
  `IngestionStore` sin reabrir repos aprobados).
- **Acciones:** ciclo SDD completo — `explorer`
  (`progress/explore_wialon-ingestion-pipeline.md`) → `spec_author` →
  gate humano → `implementer` (21 commits TDD por R-id en
  `feature/8-wialon-ingestion-pipeline`) → `reviewer` **aprobó** (C2-C7,
  init.sh y e2e ejecutados por él mismo, trazabilidad 19/19 muestreada
  por R-id; NB1 frontmatter de spec corregido por leader `125685b`, NB2
  comentario huérfano corregido por implementer `a2fb802`) → PR #13.
- **Resultado:** `./init.sh` verde (build, 397 unit / 69 suites, lint,
  typecheck); e2e 58/58 contra Docker real (3 nuevos: cadena claim →
  runOnce → drainOnce → DynamoDB + `pets.last_position`). Evidencia
  manual del cron real: claim ACT-001 → 21 items a ~1.5 min → 35 a
  ~8 min, DLQ en 0. Dependencias nuevas: `@nestjs/schedule`,
  `@aws-sdk/lib-dynamodb`. Desviaciones aceptadas: `SIMULATED_DEVICES`
  movida a `src/db/seed/` (re-exportada), `jest-e2e maxWorkers: 1`.
- **Commits:** 23 en la branch (incl. NB1/NB2), PR #13 abierto.
- **Estado final:** done — espera merge humano del PR #13

## Sesión 2026-08-02 (2) — positions-api (id: 9)

- **Feature:** lectura de posiciones — `GET /v1/pets/:petId/positions/last`
  desde la caché `pets.last_position` (+ `staleSeconds`, sin tocar DynamoDB)
  y `GET /v1/pets/:petId/positions?from&to&cursor&includeSuspect` con Query
  paginada a DynamoDB y cursor opaco base64url. Módulo nuevo
  `src/modules/positions/` en 3 capas; solo lectura: cero migraciones, cero
  env vars nuevas, cero dependencias nuevas.
- **Spec:** [[specs/positions-api/requirements|spec]] — 16 EARS (R1-R16),
  aprobada por humano el 2026-08-02 con D1-D6 íntegras (D2: `200` con body
  `null` cuando no hay caché, precedente de `GET /v1/pets/:petId/device`;
  D3: cursor sin firma HMAC porque la `pk` se reconstruye desde la ruta ya
  autorizada; D4: página fija de 1000, sin `?limit=` del cliente; D6:
  `DocumentClient` propio desde `DYNAMODB_CLIENT` en vez de importar
  `IngestionModule`, que habría obligado a editar `src/workers/` — prohibido
  por R16).
- **Acciones:** sesión de rescate, no ciclo completo. La feature venía a
  medias de la sesión anterior: código de R1-R5 y R7-R15 commiteado
  (`c33deb2`..`d862b62`) pero sin cerrar — `traceability.md` con las 16 filas
  en "pendiente", `tasks.md` sin marcar, sin `progress/impl_positions-api.md`,
  R6 y R16 sin verificar y el guion temporal `scripts/r6-evidence.tmp.ts`
  sin correr. Se relanzó el `implementer` acotado al cierre (R6 + R16 +
  trazabilidad + reporte, `72d8c94`) y después el `reviewer`, que
  **aprobó sin bloqueantes**.
- **Resultado:** `./init.sh` verde (482 unit); e2e 84 contra Postgres +
  LocalStack reales. Trazabilidad 16/16. Evidencia manual de R6 con la
  cadena real (claim `ACT-002` → poller → SQS → consumidor → Postgres):
  `200`, `staleSeconds: 47`, `lat/lng` reales, 24 items de historial.
  R16 verificado: cero migraciones, `src/workers/**` y `src/pipeline/**`
  intactos, único cambio fuera del módulo el registro en `app.module.ts`.
  3 NB del reviewer: `feature_list.json` fuera de la lista literal de R16
  (bookkeeping aceptable), DX de la paginación sin `from`/`to` explícitos
  (deuda menor abierta), `graphify-out/` desactualizado (refrescado, 2361
  nodos).
- **Commits:** `c33deb2`..`9e92809` (12 en la branch), merge `c833956`
  (PR #15).
- **Estado final:** done — sin features P1 pendientes en el backlog.

## Sesión 2026-08-02 (3) — trips-activity (id: 10)

- **Feature:** cierre de la cadena GPS por el lado del agregado (#8 escribe,
  #9 lee, #10 agrega). Núcleo puro nuevo en `src/pipeline/` (`trips.ts`,
  `local-day.ts`, `activity.ts`), módulo `src/modules/activity/` con
  migración `0005_activity_daily`, agregador de tick horario y tres rutas:
  `GET /trips?date`, `GET /trips/:n` y `GET /activity/daily?from&to`.
- **Spec:** [[specs/trips-activity/requirements|spec]] — 23 EARS (R1-R23),
  aprobada por humano el 2026-08-02 con D1-D15 íntegras. Las de peso: D1
  (puerto propio `DailyPositionsReader`, `PositionsModule` de #9 intacto y
  `ListPositionsUseCase` no reutilizado porque `MAX_RANGE_HOURS = 24` no
  cubre un día local de 25 h por DST); D2 (tick horario en vez del
  `cron(15 2 * * *)` del plan 006, que habría persistido días locales sin
  cerrar); D3 (aritmética de día local con `Intl` y sin dependencia nueva);
  D12 (`activitySummary` del perfil fuera de alcance, sigue `null`).
- **Acciones:** ciclo SDD completo — `explorer`
  (`progress/explore_trips-activity.md`, 775 líneas, 15 decisiones abiertas
  detectadas) → `spec_author` → gate humano → `implementer` (6 commits TDD
  por R-id en `feature/10-trips-activity`) → `reviewer` **aprobó sin
  bloqueantes**, dictaminando una por una las 9 desviaciones declaradas por
  el implementer → PR #17.
- **Resultado:** `./init.sh` verde (build, 88 suites / 606 unit, lint,
  typecheck); e2e 8 suites / 111 tests contra Postgres + LocalStack reales.
  Trazabilidad 23/23. Los 4 fixtures del plan como tests puros (walk.json
  → ≥1 paseo; reposo total → 0; salto absurdo fuera de la distancia; gap de
  20 min parte dos paseos) más los casos DST de `Europe/Madrid` y el 23:50
  de `America/Mexico_City`. R23 verificado: exactamente una migración
  `0005_*`, cero cambios en `src/modules/{pets,positions,devices,users,auth}/**`,
  `src/workers/**`, `src/integrations/**`, `src/aws/**` ni `package.json`.
  Cero dependencias nuevas; una env var nueva (`ACTIVITY_AGGREGATOR_ENABLED`)
  documentada en `docs/conventions.md` y `.env.example` en el mismo commit.
  3 NB bajos abiertos (spread `{petId, ...query}` a salvo por `strictObject`;
  borde `n === trips.length` sin test; `RANGE_TOO_LARGE` con un extremo toca
  Postgres una vez).
- **Hallazgo de entorno:** `Intl.supportedValuesOf('timeZone')` no incluye
  `'UTC'` en Node v24.16.0 (418 zonas, tampoco `Etc/UTC`) pese a que
  `Intl.DateTimeFormat` sí lo acepta. Con el default `'UTC'` de
  `users.timezone` (#3), validar contra ese catálogo a secas reventaba.
  Reconciliado con `new Set([...Intl.supportedValuesOf('timeZone'), 'UTC'])`
  y verificado de forma independiente por el reviewer.
- **Incidente de harness:** el primer lanzamiento del `implementer` lo cortó
  el clasificador de auto mode; el humano cambió de modo y se relanzó sin
  consecuencias.
- **Commits:** `eb4d09e`..`4427d9a` (10 en la branch), merge `a503f36`
  (PR #17).
- **Estado final:** done — 9/18, sin features P1 pendientes.

## Sesión 2026-08-05 — pet-photos-s3 (id: 6)

- **Feature:** flujo de fotos de mascota vía URLs S3 prefirmadas. Módulo
  nuevo `src/modules/media/` en 3 capas: `POST
  /v1/pets/:petId/photo-upload-url` (owner-only, `PetAccessGuard` +
  `@RequirePetRole('owner')`) valida `contentType` (zod,
  `image/jpeg|png|webp`), genera la clave `pets/<petId>/photo-<ts>`,
  persiste `pets.photo_key` y emite un PUT prefirmado de 10 min; `GET
  /v1/pets/:petId` resuelve `photoUrl` a un GET prefirmado de 1 h cuando
  `photo_key` no es nulo (D2: solo el detalle, listado sigue en `null`,
  mismo alcance que `device` en #7). Reutiliza `PetAccessGuard`,
  `PET_REPOSITORY`, `S3_CLIENT`/bucket y `AUDIT_LOGGER` sin crear
  mecanismos nuevos; cero migración nueva (`pets.photo_key` ya existía
  desde #5).
- **Spec:** [[specs/pet-photos-s3/requirements|spec]] — 9 EARS (R1-R9),
  aprobada por humano 2026-08-05 con D1 (`'owner'` para subir foto), D2
  (alcance solo-detalle) y D3 (el PUT prefirmado no fija `Content-Type` en
  la firma) confirmados tal como los proponía la spec.
- **Acciones:** `spec_author` → gate humano (D1-D3 vía `AskUserQuestion`) →
  `implementer` (7 commits TDD por R-id en `feature/6-pet-photos-s3`) →
  `reviewer` **aprobó condicional a R8** (verificó código real de forma
  independiente, corrió `./init.sh` y el e2e él mismo) → decisión humana
  sobre R8 → PR #19 → **mergeado por el humano** (`1aede70`).
- **Resultado:** `./init.sh` verde (91 suites / 623 unit, lint,
  typecheck); e2e `media.e2e-spec.ts` 10/11 contra Postgres + LocalStack
  reales. Trazabilidad 9/9 (R8 documenta el hallazgo en vez de afirmar un
  passing falso). El fix de `@HttpCode(HttpStatus.OK)` (R1 pide `200`, no
  el `201` default de Nest en `@Post()`) solo se detectó corriendo el e2e
  real.
- **Hallazgo de entorno (R8):** LocalStack Community 4.14 no aplica
  `PutPublicAccessBlock`/ACLs/bucket-policy en el plano de datos de S3 —
  un `GET` anónimo sobre un objeto existente responde `200`, no `403`,
  aunque la config sí queda persistida (`GetPublicAccessBlockCommand`
  devuelve los 4 flags en `true`, mismo patrón que
  `localstack-provisioning` #2 R13). Verificado también con una bucket
  policy `Deny` explícita y con `S3_SKIP_SIGNATURE_VALIDATION=0` — mismo
  resultado en ambos casos. No es un defecto de esta feature: el único
  puerto de acceso (`PHOTO_STORAGE`) solo expone URLs firmadas. **Decisión
  humana: aceptado como limitación documentada del entorno local**, no
  bloquea el cierre — la garantía real de "nunca público" vive en revisión
  de código.
- **Commits:** `801e3cf`..`53430f7` (8 en la branch), merge `1aede70`
  (PR #19).
- **Estado final:** done — 10/18, próximo candidato P2: `geofences-crud`
  (#11) o `alerts-engine` (#12).

## Sesión 2026-08-05 (2) — geofences-crud (id: 11)

- **Feature:** núcleo puro `src/pipeline/geofence-eval.ts` (`isInside`
  círculo haversine + polígono ray-casting; `evaluate` máquina de estados
  con histéresis anti-parpadeo: salida radio×1.1 + accuracy ≤50 m, entrada
  radio×0.9 sin exigencia de accuracy, low_accuracy corta-circuita) +
  módulo `src/modules/geofences/` (CRUD de 5 rutas tras `PetAccessGuard`
  de #5, mutaciones owner-only, lectura abierta a cualquier rol activo).
  Migración `0006` (tabla `geofences`, `type` CHECK solo `'safe_circle'`,
  único `(pet_id, name)`, tope de 5 por mascota). `geofence_state`
  (`{state, updatedAt}`) congelado como columna jsonb desde el primer
  commit para que `alerts-engine` (#12) lo reutilice sin migración nueva.
- **Spec:** [[specs/geofences-crud/requirements|spec]] — 26 EARS (R1-R26),
  aprobada por humano 2026-08-05 con D1-D5 confirmadas tal como las
  proponía la spec (CRUD MVP solo círculo, shape de `geofence_state`,
  firma de `evaluate()`, autorización owner-only en mutaciones, detalle de
  migración).
- **Acciones:** `spec_author` → gate humano (D1-D5) → `implementer`
  (4 commits TDD en `feature/11-geofences-crud`: núcleo puro R16-R25,
  módulo CRUD R1-R15, docs+trazabilidad) → `reviewer` **aprobó** (C2-C7,
  R1-R26 verificados línea por línea contra el código real, IDOR entre
  mascotas del mismo owner incluido) — pero encontró el cierre bloqueado
  por `./init.sh` no verde por causa ajena (ver sesión siguiente) →
  bloqueante resuelto → branch rebaseada sobre `main` → **`init.sh`
  verde confirmado por el leader** → feature marcada `done`.
- **Resultado:** `init.sh` verde completo (92 suites / 642 unit, lint,
  typecheck); e2e 141/142 (único fallo `media.e2e-spec.ts`, flakiness de
  LocalStack ya aceptada en el cierre de `pet-photos-s3` #6, no
  relacionada). `geofences.e2e-spec.ts` propio: 20/20. Trazabilidad 26/26
  sin filas pendientes.
- **Commits:** `aba0ff9`..`34b2ec9` (4 en la branch original) + rebase
  sobre `main` tras el merge de PR #22 (ver sesión siguiente).
- **Estado final:** done — 11/18, próximo candidato P2: `alerts-engine`
  (#12), único que queda sin decisión de orden (lee `geofence_state` de
  esta feature).

## Sesión 2026-08-05 (3) — fix: aserción frágil de migración en activity (sin id, bugfix de harness)

- **Feature:** no es una feature de `feature_list.json` — bugfix de 1
  archivo detectado durante la revisión de `geofences-crud` (#11).
  `activity.drizzle.store.spec.ts` (`trips-activity` #10, ya `done`)
  afirmaba "0005 es la última migración del repo", una propiedad global y
  temporal que revienta con la primera migración de cualquier feature
  futura — la `0006` de #11 la disparó. Corregido para localizar la
  migración `0005` por contenido (`CREATE TABLE "activity_daily"`) y
  verificar que no crea otras tablas, mismo patrón que
  `devices.schema.spec.ts`/`pets.schema.spec.ts` — inmune a migraciones
  posteriores.
- **Spec:** ninguna — bugfix de 1 archivo, sin spec (mismo criterio que
  `fix/jest-e2e-alias` del 2026-08-01).
- **Acciones:** causa raíz y fix diagnosticados por el `reviewer` de #11
  → branch `fix/activity-migration-assertion` desde `main` → `implementer`
  (repro rojo con una migración `0006` descartable, fix, verde) →
  `reviewer` **aprobó** (diff acotado a 1 archivo, patrón fiel a los
  hermanos `devices`/`pets`, `init.sh` + e2e corridos de forma
  independiente) → **PR #22 mergeado por el humano**.
- **Resultado:** `init.sh` verde completo tras el fix. Desbloqueó el
  cierre de `geofences-crud` (#11) y evita que la próxima migración de
  cualquier feature (candidata: `alert_events` de `alerts-engine` #12)
  repita el mismo bloqueante.
- **Commits:** `4314edb` (fix) + `92c9399` (docs), merge PR #22.
- **Estado final:** done (harness), sin entrada propia en
  `feature_list.json`.

## Sesión 2026-08-07 — Ciclo SDD completo de `alerts-engine` (#12)

- **Feature:** plan 007 paso 3 — worker que consume `position.updated`/
  `battery.low` del bus, evalúa geocercas vía `evaluate()` de #11 (sin
  modificarla), abre/cierra `alert_events` con índice único parcial
  anti-spam (`pet_id`, `type`, `coalesce(geofence_id, uuid nil)` WHERE
  `open`), cierra `battery_low` con batería ≥30, encola en SQS
  `notifications`. Cola nueva `geofence-events` + DLQ + regla EventBridge
  (infra que #2 no había previsto).
- **Spec:** 20 EARS + D1-D5 (`spec_author`). Gate humano vía
  `AskUserQuestion` (**D1: opción A, `geofence_id ON DELETE SET NULL`**;
  **D2-D5 confirmados íntegros**: infra nueva con reubicación de 3
  constantes a `src/aws/constants.ts`, orden `alert_events`-antes-que-
  `geofence_state` a prueba de caídas, literal uuid nil sin extensión
  `uuid-ossp`, `version: 1` en el mensaje de `notifications`). Bloqueado
  hasta confirmación explícita: el checkbox de aprobación llegó marcado
  sin fecha y con el frontmatter todavía en `draft`, y un "listo, continúa"
  de chat no cubre lo que la propia spec exige confirmar — mismo criterio
  de no fiarse de una aprobación implícita que ya aplicó `pets-crud-
  permissions` (#5) con B1.
- **Acciones:** `spec_author` → gate humano (D1-D5) → leader aprueba
  `requirements.md` (fecha + status) → `implementer` (5 commits TDD por
  R-id: schema+índice R1-R2, provisioning R3-R4, consumer+scheduler
  R5-R17, e2e+guarda de pureza R18-R19, trazabilidad R20) → `reviewer`
  **aprobó**: verificó código real (no el reporte a ciegas), corrió
  `init.sh` y el e2e él mismo, reprodujo en aislamiento el fallo de
  `media.e2e-spec.ts` para confirmar que era el mismo flakiness conocido
  de LocalStack antes de aceptarlo. **Bug B1 repetido** (mismo patrón que
  #5): frontmatter `draft` en `design.md`/`tasks.md`/`traceability.md`
  pese al gate humano ya cerrado en `requirements.md` — detectado y
  corregido por el leader antes del cierre.
- **Resultado:** `init.sh` verde completo (699 tests). E2e propio de la
  feature 3/3 (corrido 3× para descartar flakiness, escenario de salida
  de geocerca 100% determinista). Trazabilidad 20/20 sin filas
  pendientes. R19 (`geofence-eval.ts` intacto) y D1 (`ON DELETE SET
  NULL`) verificados directamente contra migración/diff; D3 (orden de
  escritura) verificado con aserción explícita de `invocationCallOrder`,
  no solo happy-path. **NB no bloqueante:** los tests etiquetados "R14"
  ejercitan en realidad el guard de R7 (indirectamente, bajo el
  `describe` de R8), no el caso borde de caída-a-mitad-de-camino que su
  comentario dice cubrir — mecanismo sí probado, cobertura mal rotulada;
  queda como seguimiento. **Hallazgo ajeno reportado por transparencia:**
  una de dos corridas completas del e2e mostró un fallo intermitente
  distinto (`pet_users` FK) no relacionado con los archivos de esta rama
  — candidato a investigar aparte. `media.e2e-spec.ts` sigue con el
  mismo flakiness de LocalStack ya aceptado desde `pet-photos-s3` (#6).
- **Hallazgo de seguridad, ajeno a esta feature (reportado, no tocado):**
  `.mcp.json` tiene un PAT de GitHub en texto plano en un cambio ya
  presente en el working tree **antes** de esta sesión (no commiteado
  por ningún agente de este ciclo) — el archivo no está en
  `.gitignore` pese a que el diff de `.gitignore` intenta excluirlo con
  un patrón no válido (`./.mcp.json`), y de todas formas ya está
  trackeado. Podría ser un intento de resolver el bloqueo ya conocido de
  `GITHUB_TOKEN` con scope insuficiente para crear PRs (ver memoria). Sin
  acción del leader — queda para que el humano decida (rotar el token,
  sacarlo a variable de entorno, corregir el patrón de `.gitignore`).
- **Continuación same-day (CI roja → fix):** el humano abrió la PR #25;
  CI (GitHub Actions, Linux) salió roja en
  `geofence-eval-untouched.spec.ts` pese a `init.sh` local (Windows) y
  `reviewer` en verde — la guarda de R19 hasheaba el archivo con line
  endings crudos, CRLF local vs. LF en CI sobre el mismo blob de git,
  sin que `geofence-eval.ts` cambiara de verdad (diff contra `main`
  seguía vacío). Feature reabierta a `in_progress` → `implementer`
  normalizó BOM+CRLF→LF antes de hashear y recalculó las dos constantes
  (`c4f09e5`) → `reviewer` re-aprobó, verificando los hashes recalculados
  contra el log real de la corrida de CI que había fallado (coinciden
  byte a byte) → push (`2944916`) → **CI confirmado verde en el runner
  real** (`gh pr checks --watch`, 50s) → vuelta a `done`. Lección: verde
  local en Windows no certifica verde en CI (Linux) cuando una guarda
  hashea contenido de archivo sin normalizar line endings.
- **Commits:** `ae21e51`..`2944916` (8 en la branch) + cierre del leader
  (frontmatter B1 + bookkeeping + fix CRLF/LF post-CI).
- **Estado final:** done — 12/18, CI verde confirmado en PR #25, próximo
  candidato P2: `alerts-center-notifier` (#13), consume la cola
  `notifications` que esta feature ya llena y añade el centro de alertas
  (`GET /v1/alerts`, `POST /v1/alerts/:id/ack`).

---

## Sesión 2026-08-07 (2) — alerts-center-notifier (id: 13)

- **Feature:** #13 `alerts-center-notifier` (P2) — último eslabón del plan 007.
  Entró `pending` (sin spec), salió `done`.
- **Agentes:** `spec_author` → gate humano → `implementer` → `reviewer`
  (cancelado por el humano sin veredicto) → verificación manual del leader →
  `reviewer` nuevo, **aprobado**.
- **Spec:** 30 requisitos EARS, decisiones D1-D6 con propuesta explícita cada
  una. Aprobadas en chat las seis propuestas y registradas por escrito en
  `requirements.md` §Aprobación antes de lanzar al `implementer`.
  - **D1 (la de fondo):** `ack` rompía dos supuestos de #12, que codificaba
    "alerta activa" como `status='open'` en el índice único anti-spam y en
    `closeOpenAlert()`. Sin tocarlos, un `ack` reabría el spam y dejaba la
    alerta sin cerrarse al regresar la mascota. Opción C: "activa" pasa a ser
    "no cerrada" en ambos sitios — migración `0008` (`WHERE status <> 'closed'`)
    y `status IN ('open','acked')`. Única intromisión en código ya mergeado.
  - D2 instalar `expo-server-sdk` con puerto `PushSender` + 2 adaptadores;
    D3 geocerca de referencia = la más antigua, activa o no; D4 `coalesce` en
    el upsert de `activity_daily` para no tocar el test de R11 de #10;
    D5 contrato de `/v1/me/push-tokens` (200/204, `ios|android`, re-registro
    reasigna); D6 `NOTIFIER_ENABLED` propia.
- **Entregado:** tabla `push_tokens` + `POST/DELETE /v1/me/push-tokens`;
  worker `src/workers/notifier/` (consumer, scheduler, puerto `PushSender`,
  `ConsolePushSender` y `ExpoPushSender`); módulo `src/modules/alerts/`
  (`GET /v1/alerts?status=` paginado por cursor sobre todas mis mascotas,
  `POST /v1/alerts/:id/ack`); `time_away_minutes` de `activity_daily` por fin
  relleno desde `alert_events`. Migración `0008`. Una sola dependencia nueva.
- **Verificación:** 832 unit tests verdes (113 suites), lint y typecheck OK.
  E2E corridos a mano: **164/165**, con `test/alerts-center-notifier.e2e-spec.ts`
  entero en verde.
- **Incidencias de proceso:**
  - El `spec_author` volvió a entregar el checkbox del gate ya marcado (fecha
    vacía) — tercera vez que un agente toca un gate que no le corresponde.
    Anotado en `requirements.md` §Aprobación.
  - El primer `reviewer` fue detenido por el humano a media revisión; el
    harness no permite reanudar un agente cancelado, así que hubo que
    relanzar uno nuevo con lo ya verificado precargado para no repetir trabajo.
  - A diferencia de #12, el leader aceptó un "listo, puedes continuar" de chat
    como aprobación del gate en vez de exigir confirmación D-por-D vía
    `AskUserQuestion`.
- **Hallazgos no bloqueantes (del reviewer):** vía residual de fuga de
  `expo_token` completo si `deleteByToken()` lanza y drizzle serializa los
  params en el mensaje de error (`notifier-consumer.service.ts:169`, rama de
  fallo de infra); R30 sin test que lo nombre (verificado a mano); dos
  archivos nuevos fuera de la lista literal de R30, justificados.
- **Hallazgo mayor, ajeno a la feature:** `init.sh` **nunca ha ejecutado los
  e2e** — `init.config.sh:25` lanza jest con `rootDir: "src"` y
  `testRegex: ".*\.spec\.ts$"`, y los e2e viven en `test/` como
  `*.e2e-spec.ts` con config aparte. CI corre `init.sh`, así que tampoco los
  corre. Los criterios e2e de las 12 features anteriores se dieron por buenos
  sin ejecutarse nunca en un gate automático. De rebote desmiente el
  diagnóstico de "flakiness ya conocido" que la sesión de #12 dio al fallo de
  `media.e2e-spec.ts:317::R8` (403 esperado / 200 recibido): no es
  intermitente, es que nadie lo corría — y es el criterio de aceptación
  literal de #6 ("Bucket jamás público"). Ambos pendientes de decisión humana.
- **Deuda declarada en la spec:** `DeviceNotRegistered` solo se atiende vía
  tickets inmediatos, no vía receipts diferidos de Expo (`ponytail:` con su
  camino de salida).
- **Estado final:** done — 13/18. Branch `feature/13-alerts-center-notifier`,
  pendiente de PR y merge humano. Próximo: `health-vaccines` (#14), aunque
  antes conviene decidir qué se hace con los e2e fuera de `init.sh` y con el
  bucket de #6.

---

## Sesión 2026-08-07 (3) — fix: los e2e entran en el gate + R8 de media (sin id, bugfix de harness)

- **Origen:** al cerrar `alerts-center-notifier` (#13) se descubrió que
  `init.sh` **nunca había ejecutado los tests e2e**. `TEST_CMD` lanza jest con
  `rootDir: "src"` y `testRegex: ".*\.spec\.ts$"`; los e2e viven en
  `backend-pet-tracker/test/` como `*.e2e-spec.ts` con config propia
  (`test/jest-e2e.json`). CI corre `init.sh`, así que tampoco los corría: las
  12 features cerradas hasta entonces tenían sus criterios de aceptación e2e
  dados por buenos sin haberse ejecutado en ningún gate automático.
- **Branch:** `fix/media-r8-localstack` (ciclo corto, sin entrada en
  `feature_list.json`). Precedente: `fix/activity-migration-assertion`.
- **Parte 1 — harness (`6df9ab4`):** `init.config.sh` define `E2E_CMD` y
  `E2E_REQUIRED_PORTS`; `init.sh` gana `port_open()` (bash `/dev/tcp`, sin
  depender de `nc`/`lsof`, que no están garantizados en Git Bash ni en los
  runners) y un bloque que corre los e2e solo si 5432 y 4566 responden. Infra
  ausente ⇒ aviso y continúa, para que `init.sh` siga sirviendo sin Docker;
  infra presente y e2e rojo ⇒ exit 1.
- **Parte 2 — `media.e2e-spec.ts::R8`:** al activar los e2e salió rojo de
  forma determinista (esperaba 403 en un `GET` sin firma sobre el bucket S3,
  recibía 200). **No era una vulnerabilidad**: `GetPublicAccessBlock` devuelve
  los cuatro flags en `true`, o sea `provisionMediaBucket()` hace lo correcto
  y el bucket no está expuesto — LocalStack almacena los flags pero no los
  hace cumplir, y en AWS real ese GET daría 403. El test comprobaba algo que
  el emulador no emula. `implementer` reescribió R8 contra la configuración
  efectiva (cuatro flags + ausencia de bucket policy pública) **sin tocar
  `src/`**, con la limitación anotada en el propio test, en R8 de
  `specs/pet-photos-s3/requirements.md`, en su `traceability.md` y en
  `docs/architecture.md`.
- **Revisión:** `reviewer` **aprobó** sin bloqueantes, tras reproducir él
  mismo la regresión en tres variantes (config borrada, 3 de 4 flags, bucket
  policy pública → las tres rojas) más un caso de control que se mantiene
  verde, y tras verificar el gate de `init.sh` en ambas direcciones y que
  `port_open()` no fuga descriptores bajo `set -e`.
- **Gate:** re-confirmado el de `pet-photos-s3` (#6) con fecha 2026-08-07 — la
  cláusula `THE SYSTEM SHALL` de R8 es byte-idéntica a la aprobada el
  2026-08-05, solo cambió su criterio de verificación. La casilla no podía
  quedarse firmada con la fecha vieja sobre un texto ya distinto.
- **Corrección de registro:** la sesión de #12 había archivado este fallo de
  `media.e2e-spec.ts` como "flakiness de LocalStack ya aceptada". Era
  determinista; lo que pasaba es que nadie lo ejecutaba.
- **Estado final:** PR #29 mergeada junto con la #28 de la feature #13.
  `main` verde con **832 unit + 166 e2e** — primera vez que el harness
  verifica ambas cosas.
- **Queda abierto:** CI no levanta Postgres ni LocalStack (`ci.yml:27` lo dejó
  anotado hace tiempo), así que en el runner el paso e2e se salta con aviso y
  CI sigue verde verificando solo unit tests. Cerrarlo pide `services` +
  migraciones + `provision:local` en el workflow.

---

## Sesión 2026-08-09 — health-vaccines (#14)

- **Feature:** `health-vaccines`, rama `feature/14-health-vaccines`.
- **Flujo:** `spec_author` → aprobación humana → `implementer` → `reviewer`.
- **Entregado:** migración `0009` (`vaccine_catalog`, `pet_vaccines`), seed
  canónico idempotente 4 dog/3 cat, catálogo por especie, CRUD protegido por
  `PetAccessGuard` con mutaciones owner-only y auditoría, cálculo de próxima
  dosis y `nextVaccine` en el perfil.
- **Primer review:** rechazado por fecha inválida que escapaba como 500, seed
  que conservaba filas extra y POST que aceptaba `documentKey` fuera de
  alcance. Tests rojos `5d53ac3`; fix mínimo `eb9c67b`.
- **Revisión final:** APROBADA; trazabilidad R1-R13 completa, sin pendientes.
- **Gate:** build, lint y typecheck verdes; 117 suites/843 unit y 13
  suites/181 e2e contra Postgres + LocalStack locales.
- **Estado final:** feature `done`; sigue abrir PR y esperar merge humano.
- **Próximo:** `health-weights` (#15).

---

## Sesión 2026-08-09 (2) — aws-real-credentials (#19)

- **Feature:** `aws-real-credentials`, rama `feature/19-aws-real-credentials`.
  Primera de la fase AWS real. Se eligió por delante de #15 porque no depende
  de nada, desbloquea #20 y evita que `pet-reminders` (#16) se implemente
  contra el workaround de cron local.
- **Reparto multi-IA estrenado:** Claude Code como `leader` (spec, review,
  bookkeeping, PR) y **Codex CLI en terminal aparte** como implementador.
  Handoff por disco: Codex lee `specs/aws-real-credentials/` y escribe
  `progress/impl_aws-real-credentials.md`; ningún contenido viaja por chat
  entre las dos IAs. La ganancia no es velocidad sino que **quien implementa
  no revisa**.
- **Flujo:** `spec_author` → gate humano → Codex CLI → `reviewer` → prueba de
  humo del humano → `done`.
- **Entregado:** `AWS_MODE=local|aws` en `src/aws/aws-clients.ts`. En `local`,
  comportamiento byte a byte idéntico al anterior; en `aws`, los cuatro
  clientes se construyen sin `endpoint` y sin `credentials` para que el SDK v3
  resuelva por su cadena por defecto (las de `aws login` rotan cada pocos
  minutos, no son un par fijo). `forcePathStyle` y `MissingAwsEndpointError`
  quedan condicionados a `local`. Guarda extra en `run-provisioning.ts`: exit 1
  si `AWS_MODE=aws`, **antes** de construir clientes, para que un `.env` mal
  puesto no cree los 8 recursos del provisioning en la cuenta real.
- **Spec autosuficiente a propósito:** el implementador no tenía acceso a la
  conversación que la originó, así que la spec fijó rutas, nombres de símbolos
  y qué test prueba cada R-id, sin dejar preguntas abiertas.
- **Revisión:** APROBADA. El `reviewer` levantó `docker compose` y provisionó
  LocalStack él mismo en vez de fiarse del reporte: `init.sh` exit 0, 119
  suites/869 unit, 13 suites/181 e2e. R2 (el criterio que de verdad importaba)
  verificado con `localstack-provisioning.e2e-spec.ts` 10/10 **sin modificar
  el archivo**; R9 confirmado comprobando que los guardas estáticos no se
  relajaron.
- **R11/R12 los cerró el humano:** `aws login`, credenciales dummy comentadas
  en el `.env` raíz, `AWS_MODE=aws` → 2/2 tests verdes contra la cuenta real
  con un `ListQueues` de solo lectura. `.env` restaurado byte-idéntico
  (verificado con `diff` contra copia previa) y backup borrado.
- **Incidente de git:** el commit de la spec cayó en `main`. El humano hizo
  `checkout main` + `pull` en otra terminal entre que Claude creó la branch y
  commiteó; el working tree es uno solo. Recuperado sin pérdida con
  `merge --ff-only` + `cherry-pick` + `git branch -f main origin/main` (los dos
  `reset --hard` los bloqueó el clasificador de permisos). **Lección para el
  reparto multi-IA: un solo escritor sobre el working tree a la vez**, o
  `git worktree` para que cada agente tenga su propio HEAD.
- **Hallazgos de proceso (no bloqueantes):**
  1. Codex metió implementación + tests + docs en un único commit (`d884dad`),
     sin historial test-primero. El próximo prompt de handoff debe exigir
     granularidad de commits explícitamente.
  2. `CLAUDE.md` prohíbe al leader marcar `done` mientras `AGENTS.md` §7.2 se
     lo pide en el cierre. Resuelto por decisión humana explícita; conviene
     redactar la prohibición como "sin veredicto aprobado del reviewer".
  3. El comando de humo documentado omitía el `--` antes de `--runInBand`, sin
     el cual pnpm no reenvía flags a jest. Corregido en `docs/verification.md`.
- **Gotcha que costará repetir:** la cadena del SDK prioriza
  `AWS_ACCESS_KEY_ID` del entorno sobre la sesión de `aws login`, y el `.env`
  de desarrollo trae el par dummy de LocalStack. Sin comentar esas dos líneas
  el modo `aws` falla aunque el código sea correcto — la suite lo detecta y
  falla con mensaje explícito en vez de con un error críptico del SDK.
- **Estado final:** feature `done`; sigue PR y merge humano.
- **Próximo:** `aws-cdk-dev-stack` (#20) o `health-weights` (#15).

---

## Sesión 2026-08-10 — aws-cdk-dev-stack (id: 20)

- **Feature:** stack CDK de desarrollo para los recursos AWS que usa el
  backend, sin modificar el provisioning de LocalStack.
- **Spec:** [[../specs/aws-cdk-dev-stack/requirements|spec]] aprobada por el
  humano; decisiones previas en `progress/explore_aws-cdk-dev-stack.md`.
- **Acciones:** se implementaron R1-R16 en el orden fijado por `tasks.md`, con
  commits separados de test rojo e implementación verde; se añadió R21 mitad
  A, auto-saltada salvo `AWS_MODE=aws`; la trazabilidad se actualizó tras cada
  requisito. El stack declara exactamente 11 recursos y `init.config.sh`
  incorpora synth, tests, lint y typecheck de `infra/`.
- **Resultado:** `init.sh` exit 0: backend 121 suites / 879 tests,
  infraestructura 2 suites / 14 tests, e2e 181 pasados y 5 omitidos, synth,
  lint y typecheck verdes. Ningún archivo prohibido cambió. No se ejecutó
  `cdk bootstrap` ni `cdk deploy`.
- **Commits:** secuencia TDD `f4d6ae0`…`d97cbf8`; detalle por R-id en
  `specs/aws-cdk-dev-stack/traceability.md`.
- **Estado final:** `in_progress`; implementación del agente terminada.
- **Próximo:** el humano registra R17 (Billing), R18 (bootstrap), R19
  (deploy), R20 (no-op) y R21 mitad B (e2e AWS real) en
  `progress/impl_aws-cdk-dev-stack.md`; después corresponde revisión.

---

## Sesión 2026-08-10 (cierre) — aws-cdk-dev-stack (id: 20)

- **Feature:** cierre de #20 — revisión, verificaciones humanas contra AWS real
  (R17-R21) y apertura del defecto que destaparon.
- **Acciones:** el `reviewer` aprobó R1-R16 y R21 mitad A. Después el humano
  cerró las cinco filas restantes: Billing (R17), `cdk bootstrap` con
  termination protection (R18), deploy (R19), no-op (R20) y el e2e de ingest
  contra AWS real (R21 mitad B).
- **Resultado:** stack `PetTrackerDev` desplegada en `us-east-1` con los 11
  recursos de R13, verificados con `list-stack-resources` en vez de con el
  contador de CDK (que muestra 12 porque incluye el propio stack). El deploy
  corrió con **PowerUserAccess**; `AdministratorAccess` solo hizo falta para el
  bootstrap y se retiró después. `init.sh` exit 0: 879 unit, 14 infra, 181 e2e
  pasados y 5 omitidos.
- **Hallazgo (lo importante de la sesión):** la suite de ingest real pasó en
  verde **dos veces sin tocar AWS**. La primera por sintaxis de PowerShell
  ejecutada bajo Bash — `AWS_MODE` no llegó al proceso y la suite se auto-saltó.
  La segunda contra LocalStack: el SDK v3 lee `AWS_ENDPOINT_URL` de
  `process.env` por su cuenta, así que omitir el parámetro `endpoint` en modo
  `aws` no aísla nada. Solo se detectó apagando LocalStack y repitiendo. Mismo
  patrón de bug latente que R11, pero disfrazado de test aprobado.
- **Consecuencias:** se abrió la feature #21 `aws-mode-endpoint-guard` (P1) para
  la guarda simétrica a `assertNoStaticAccessKey`, y `docs/verification.md`
  ahora exige comentar también `AWS_ENDPOINT_URL` y probar el destino apagando
  LocalStack.
- **Nota operativa:** apagar LocalStack borra su estado (community no persiste);
  hay que correr `pnpm -C backend-pet-tracker run provision:local` antes de
  volver a pasar el gate.
- **Coste:** la tabla queda en 25 RCU / 25 WCU, tramo de `$0.00/hora` según el
  Price List API. Cuenta `PAID` con 120 USD de crédito. Budget de alerta
  `pet-tracker-dev-monthly` creado a 5 USD/mes.
- **Commits:** `a8d2355`, `48ab936`, `2a7fbb1`.
- **Estado final:** #20 `done`; PR #38 pendiente de merge humano.
- **Próximo:** `aws-mode-endpoint-guard` (#21, P1, sin spec) o
  `health-weights` (#15).

---

## Sesión 2026-08-10 (tarde) — aws-mode-endpoint-guard (id: 21)

- **Feature:** #21 completa, de spec a veredicto aprobado. Cierra el defecto que
  destapó el cierre de #20: el AWS SDK v3 lee `AWS_ENDPOINT_URL` de `process.env`
  por su cuenta, así que `AWS_MODE=aws` no aislaba nada de LocalStack.
- **Agentes:** `spec_author` (spec), Codex CLI (implementación), `reviewer`
  (veredicto). Reparto de #19 en adelante: quien implementa no revisa.
- **Resultado:** `UnexpectedAwsEndpointError` en los dos resolvers de
  `src/aws/aws-clients.ts`, guarda simétrica a `assertNoStaticAccessKey`. Modo
  `local` sin cambios. `./init.sh` exit 0 corrido por el reviewer: 123 suites /
  889 tests backend, 2/14 infra, 13 suites + 181 tests e2e (2 y 6 omitidos).
- **Lo importante de la sesión — Codex paró en vez de forzar el verde.** A mitad
  de R5 encontró que R4 era **imposible**: exigía `src/aws/aws-mode.spec.ts`
  verde sin tocarlo, pero ese archivo pasa `{ AWS_MODE: 'aws', AWS_ENDPOINT_URL:
  ENDPOINT }` a los dos resolvers en cinco tests — justo la combinación que R1
  declara ilegal. En vez de añadir una excepción por `NODE_ENV` (que habría
  reabierto el agujero exacto de la feature), documentó el bloqueo y preguntó.
  Verificado a mano antes de decidir: 5 fallos, exactamente esos.
- **Fallo del `spec_author`:** verificó §D3 contra `resolveAwsClientOptions`
  —donde acertó, `buildAwsConfig()` sigue verde— pero no contra las llamadas a
  los resolvers del mismo archivo. Lección para specs futuras: cuando una guarda
  cambia el contrato de una función, hay que revisar **todas** sus llamadas en
  los tests existentes, no solo el consumidor obvio.
- **Enmienda:** gate humano reabierto, R4 reescrito para permitir adaptar solo
  `aws-mode.spec.ts` con los dos cambios de `design.md` §D10 (commit `ddfa9c8`,
  previo a la adaptación `9fb6a3c` — el orden importa). Los otros cuatro
  archivos de test de #19 siguen intocables y ausentes del diff.
- **R8 descartado en el gate** (documentar el modo de fallo en
  `docs/conventions.md`): scope creep sobre los seis criterios. El hueco de
  numeración es deliberado; ningún R-id se renumeró.
- **C4 cumplido esta vez:** historial rojo→verde por R-id, verificado por el
  reviewer commit a commit demostrando *por qué* cada test estaba rojo. Era el
  checkpoint que Codex incumplió en #19.
- **Límite conocido:** la guarda vive en el backend, así que **no cubre la CLI
  de CDK**. El paso R18 de #20 (comentar las variables a mano antes de
  `cdk deploy`) sigue vigente y `docs/verification.md` lo conserva.
- **Observaciones no bloqueantes del reviewer** (las cuatro en
  `progress/review_aws-mode-endpoint-guard.md`): el `it` de R6 es tautológico en
  aislamiento y solo funciona como canario — es lo que §D8 especifica;
  `assertNoStaticAccessKey` puede adelantarse al mensaje de R2 si además hay
  credenciales estáticas, sin cambiar el resultado (exit 1, 0 verdes).
- **Estado final:** #21 `done`. Sin pasos de cierre humano: la feature no crea
  recursos ni toca la cuenta real.
- **Próximo:** `health-weights` (#15, P2), el primero de los cuatro que quedan.

---

## 2026-08-11 — health-weights (#15)

- **Feature:** #15 `health-weights` (P2), branch `feature/15-health-weights`
  (33 commits). Historial de peso extendiendo el módulo `health` de #14:
  migración `0010`, `POST /v1/pets/:petId/weights` y `GET .../weights?limit=`
  con `variation`.
- **Agentes:** `spec_author` (spec + enmienda), Codex CLI (implementación),
  `reviewer` (veredicto). Reparto de #19 en adelante: quien implementa no revisa.
- **Resultado:** `reviewer` **aprobó sin bloqueantes**. `./init.sh` exit 0
  corrido por él: 127 suites / 901 unit, 2 suites / 14 infra, 213 e2e
  (2 suites y 6 tests omitidos, los de `AWS_MODE=aws`, ya omitidos en el
  baseline).
- **El gate de verdad casi no existe: los e2e llevaban tiempo sin correr.** Al
  levantar Docker se vio que `pet-tracker-postgres` arrastraba desde el
  2026-08-01 un port binding malformado —`PortBindings: map[5432/tcp:[{invalid
  IP 5432}]]`, el host IP guardado como `5432`— así que el puerto nunca se
  publicó. `docker compose ps` lo mostraba `healthy`, e `init.sh` no falla por
  eso: **salta los e2e con un warning amarillo y termina verde**. Mismo modo de
  fallo que el defecto que cerró #21: un verde que no prueba lo que parece.
  Recreado con `--force-recreate` (volumen nombrado, cero pérdida de datos) y
  verificado con `docker port` antes de lanzar al reviewer. Regla práctica: el
  estado `healthy` no dice nada del binding; comprobar `docker port
  pet-tracker-postgres` → `0.0.0.0:5432`.
- **Los e2e corrieron de verdad, comprobado por conteo y no por confianza.**
  El reviewer cuadró el delta contra el baseline: +4 suites y +12 unit, y +32
  e2e que corresponden exactamente a los `it` de `health-weights.e2e-spec.ts`
  (R2:2, R3:3, R5:3, R6:8, R7:10, R8:3, R9:2, R10:1).
- **C4 cumplido y verificado commit a commit.** Codex entregó 10 tríos
  `test → feat → docs`, uno por R-id. El reviewer no se fió del mensaje del
  commit: montó un `git worktree` aparte, hizo checkout de cada commit rojo y
  ejecutó su test. Los 10 fallan de verdad; 8 por aserción genuina y 2 por
  símbolo aún no definido (NB-4) —el schema `weights` y `toWeightHistory`—,
  que son el sujeto del test y no un import roto. Es el checkpoint que #19
  incumplió.
- **Enmienda de spec antes del gate (única).** R7 rechazaba `measuredAt`
  posterior a hoy en UTC, lo que da un **400 falso** a un usuario en huso
  adelantado: el planeta abarca UTC-12..UTC+14, 26 horas. Se adoptó tolerancia
  de un día (`MEASURED_AT_MAX_FUTURE_DAYS = 1`) en vez de leer
  `users.timezone` con `localDayOf()` de #10 — lo exacto costaba una query y
  una dependencia permanente health→users en un POST autocontenido, para
  blindar un caso sin consecuencia. El porqué quedó escrito en `design.md` D5
  para que nadie lo "arregle" luego metiendo la dependencia.
- **Dos objeciones del leader que la verificación tumbó**, y conviene recordar
  el método: `measured_at` como `date` no era invento del `spec_author`, lo
  manda `docs/data-model.md:57` y la convención de la línea 43; y el
  `@RequirePetRole('owner')` en el POST es el patrón unánime del repo (todas
  las mutaciones sobre mascota son owner, todos los GET van sin decorador).
  Verificar antes de recomendar evitó dos cambios innecesarios.
- **Deuda de test declarada (NB-3), el hallazgo con más sustancia:** el
  `variation` **no nulo en la respuesta del POST** no tiene ningún test.
  `findPrevious` —con su desempate `or(lt(measured_at), and(eq(measured_at),
  lt(id)))`— no se ejecuta ni una vez contra Postgres: el use-case lo mockea a
  `null`, el doble del repositorio no entra en el `select`, y todas las
  aserciones de `variation != null` van por el `GET`, que usa el camino de la
  fila sonda, **código distinto**. La lógica se revisó a mano y es correcta,
  pero una regresión ahí saldría verde. Lo cierra un `it` con dos POST.
- **Otros no bloqueantes** (los ocho en `progress/review_health-weights.md`):
  el test de atomicidad de R4 asevera contra su propio doble y no contra el
  rollback real de Postgres (NB-5); el `it` de precedencia 404-antes-de-403 ya
  estaba verde en el commit rojo de R9 porque lo cubría el guard de R8 (NB-6);
  se tocó `vaccine.dto.ts` de #14 para extraer `isIsoDate` a
  `application/dto/iso-date.ts`, extracción DRY sin cambio de comportamiento
  (NB-7); y R7 no cubre `measuredAt` con formato no-ISO (NB-8).
- **Alcance respetado:** `PetProfileResponse` intacto (contrato de 24 claves,
  tres tests de contrato sin tocar), `weightKg` de `POST/PATCH /v1/pets` sin
  tocar, y sin `PATCH`/`DELETE` de mediciones.
- **Backlog:** abierta **#22 `weight-single-source-of-truth`** (P3, pending) al
  descubrir que `pets.current_weight_kg` tiene **tres** escritores
  independientes —`create-pet.use-case.ts:45`, `update-pet.use-case.ts:70` y el
  POST de #15— y solo el último crea historial. Dar de alta una mascota con
  `weightKg` deja el perfil poblado y `weights` vacío. Unificarlo cambia el
  contrato público de dos endpoints de #5: feature propia, no apéndice de ésta.
  También quedó fuera `weightVariation` en el perfil (el plan 008 lo menciona,
  pero su consumidor real es el hub de salud, que ya carga la lista de pesos).
- **Estado final:** #15 `done`. Sin pasos de cierre humano: la feature no crea
  recursos ni toca la cuenta real.
- **Próximo:** `pet-reminders` (#16, P2).

## Sesión 2026-08-11/13 — pet-reminders (id: 16)

- **Feature:** tabla `reminders` (migración 0011 aditiva), `POST
  /v1/pets/:petId/reminders` (owner, guard, DTO estricto), `PATCH
  /v1/reminders/:id` (cancel/reschedule, 404 opaco → 403 → 409);
  programación local: cron 60s `RemindersDispatchService` gated por
  `REMINDERS_ENABLED` encola vencidos a SQS `notifications`; idempotencia
  por `enqueued_at` + `schedule_name` como token vigente; notifier de #13
  extendido a `discriminatedUnion kind alert|reminder` sin tocar la rama
  alert; camino de vuelta a EventBridge Scheduler en D9.
- **Spec:** [[specs/pet-reminders/requirements|spec]] (R1-R12, aprobada
  2026-08-11, PR #44)
- **Acciones:** reparto Claude/Codex — `spec_author` escribió la spec, gate
  humano, handoff por disco a Codex CLI, Codex implementó con 12 tripletas
  test-primero rojo→verde (`progress/impl_pet-reminders.md`) más fix de
  compatibilidad `4f20037` para los tests alert congelados de #13;
  `reviewer` validó C2-C7, trazabilidad 1:1 y corrió `./init.sh`
  independiente (primera pasada roja por las dos fallas de entorno
  conocidas, segunda con infra caliente exit 0: 238 e2e, lint, typecheck).
- **Resultado:** APROBADO sin bloqueantes
  (`progress/review_pet-reminders.md`). PR #45 mergeada por el humano.
  Smoke de reloj real (humano, 2026-08-13): primer intento sin envío —
  `.env` viejo sin `REMINDERS_ENABLED`/`NOTIFIER_ENABLED` (init.sh solo
  copia `.env.example` si `.env` falta); añadidos los flags, reinicio y el
  reminder pasó a `status=sent` con `enqueued_at` seteado y push logueado.
  Deuda registrada como #23 `init-env-drift-warning` (warning de claves
  faltantes en init.sh).
- **Commits:** implementación `a834a82..4f20037` (36 commits en PR #45,
  merge `7ddbd97`); review `52fa796`; STATUS `826c4bf`.
- **Estado final:** done

---

## Sesión 2026-08-14 — weight-single-source-of-truth (id: 22)

- **Feature:** consolidación del único escritor de `pets.current_weight_kg`.
  `weightKg` sale de `PetFieldsSchema`, así que `POST /v1/pets` y `PATCH
  /v1/pets/:petId` dejan de aceptarlo — descarte silencioso vía `z.object`,
  no 400, para no introducir una asimetría con el resto de claves
  desconocidas (D1). `CreatePetUseCase`, `UpdatePetUseCase.toFieldChanges()`
  y `PetDrizzleRepository` (`createWithOwner` y `update`) dejan de escribir
  la columna; `toNewPet()` y `toWeightColumn()` eliminadas por quedarse sin
  callers. Nuevo `scripts/backfill-weights.ts` idempotente
  (`pnpm run backfill:weights`) que rellena el historial faltante con
  `measured_at` = fecha de calendario de `pets.created_at` y `created_by` =
  owner activo, sin tocar `current_weight_kg` ni `updated_at` (R4).
  `WeightDrizzleRepository.create()` de #15 queda como único escritor.
- **Spec:** [[specs/weight-single-source-of-truth/requirements|spec]]
  (R1-R6, aprobada 2026-08-14, commit `6fef86d`)
- **Acciones:** reparto Claude/Codex — `spec_author` escribió la spec sobre
  la deuda destapada al especificar #15, gate humano, handoff por disco a
  Codex CLI, Codex implementó con 3 tripletas test-primero rojo→verde
  (`progress/impl_weight-single-source-of-truth.md`); `reviewer` validó
  C2-C7 y corrió `./init.sh` independiente con infra caliente (exit 0: 245
  e2e, lint, typecheck).
- **Resultado:** APROBADO sin bloqueantes
  (`progress/review_weight-single-source-of-truth.md`). R6 —el requisito
  crítico de no-regresión— verificado por diff vacío contra `afc522e` en el
  mapper de perfil y ambos arrays `PROFILE_KEYS`: las 24 claves de
  `PetProfileResponse` intactas. Los seis tests de #5 quedaron actualizados,
  no borrados, con cada assertion vieja de `weightKg` mapeada a su sustituta
  en la trazabilidad; la cobertura neta sube (2 tests nuevos, incluida una
  guarda `@ts-expect-error` que solo compila si `PetFieldChanges` realmente
  perdió `currentWeightKg`). C4 limpio a diferencia de #19: los commits
  `test(...)` tocan solo `*.spec.ts` y los `feat(...)` solo `src/`.
  Observación no bloqueante: `86040d5` va prefijado `test(...)` pero solo
  mueve bookkeeping; debió ser `docs(...)`.
- **Commits:** implementación `0f45ac4..e663746` (9 commits en PR #47, merge
  `2157cc1`); review `f7e1928`.
- **Backlog:** en esta sesión se añadieron #24 `device-provisioning-admin` y
  #25 `device-subscriptions` (ambas P2) tras integrar el token real de
  Wialon y decidir el modelo de membresías: la suscripción cuelga del
  dispositivo, no del usuario, porque el costo es por collar; free es la app
  de salud sin GPS. Pasan por delante de #17/#18.
- **Estado final:** done

---

## Sesión 2026-08-14 (2) — device-provisioning-admin (id: 24)

- **Feature:** CLI interno `provision:device` para registrar collares reales
  en `devices`, validando antes `wialon_unit_id` con
  `WialonClient.listUnits()`; idempotencia sin regenerar `activation_code` y
  secreto Crockford de aridad cero generado con `randomBytes()`.
- **Spec:** [[specs/device-provisioning-admin/requirements|spec]] (R1-R8,
  aprobada 2026-08-14, opción A: IMEI recibido por `--imei`).
- **Acciones:** Codex implementó R1-R8 con commits test-rojo → feat-verde →
  trazabilidad por requisito. Reporte en
  `progress/impl_device-provisioning-admin.md`.
- **Verificación:** `init.sh` exit 0: 133 suites/956 tests unitarios, 2
  suites/14 tests de infra, 17 suites/254 tests e2e, build, lint y typecheck
  verdes. `drizzle-kit generate`: sin cambios de schema.
- **Alcance respetado:** sin cambios en claim (#7), integración/poller (#8),
  seed, schema, migraciones o controllers; sin acceso a Wialon real ni
  hardware.
- **Review:** APROBADO sin bloqueantes
  (`progress/review_device-provisioning-admin.md`). El `reviewer` corrió
  `./init.sh` él mismo y verificó por diff que no se tocaron #7, #8, el seed
  ni el schema. Detalle que destacó de R4: como 256 es múltiplo de 32,
  `byte % 32` es uniforme, así que el alfabeto Crockford no introduce sesgo
  de módulo y los ~50 bits de entropía son reales.
- **Fix posterior al review (R1):** la invocación documentada
  `pnpm run provision:device -- --unit-id <id>` **fallaba**: pnpm reenvía el
  separador `--` literal y `parseArgs` lo leía como fin de opciones
  (`ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL`). Ningún test lo cubría porque
  todos llamaban a `provisionDevice()` directamente. Corregido con el
  fallback del `implementer` (cambio de una línea, `CLAUDE.md` §Excepciones)
  en dos commits test-primero: `fda4ec9` (test que hace `spawnSync` del
  script real con el separador puesto, usando el guard de R5 como sonda de
  que el parseo avanzó) y `9833364` (el filtro del separador).
- **Prueba de humo con hardware real (humano, 2026-08-14):** cadena completa
  verificada por primera vez contra un collar físico JT808 en la unidad
  Wialon `401775970` — `provision-device` → `claim` desde la app → poller →
  SQS → 35 posiciones reales en DynamoDB con `sats` y `course`. Es el
  §Cierre que la spec reservaba al humano.
- **Incidencias de entorno durante el smoke** (ninguna del código de la
  feature, todas silenciosas): `POLLER_ENABLED` ausente del `.env` dejaba el
  cron sin agendar; LocalStack pierde sus recursos al reiniciar el
  contenedor y el poller encolaba al vacío; y sobre todo, **procesos de jest
  huérfanos** de corridas de `init.sh` interrumpidas siguieron levantando
  `AppModule` y poleando en bucle, empujando el watermark ~50 min por vuelta
  hasta timestamps de 2027 y llenando `positions-raw` con miles de mensajes.
  Resistió purgas, liberar el device y reiniciar LocalStack; solo cayó al
  matar los PID huérfanos. Diagnóstico costoso porque cada corrida
  interrumpida sumaba otro zombie.
- **Backlog abierto por esos hallazgos:** #27 `reject-future-positions`
  (P1 — un `ts` futuro envenena el watermark y el device deja de reportar
  para siempre, disparable en producción por un collar con el reloj mal),
  #28 `test-dev-resource-isolation` (P2 — e2e y dev comparten las colas de
  LocalStack, por eso el simulador encoló a nombre del collar real) y #29
  `wialon-session-reuse` (P2 — un `token/login` por collar por ciclo no
  escala; cachear el `sid` obliga a manejar su caducidad).
- **Commits:** implementación `fb66eb7..7575ef8` (24 commits), fix
  `fda4ec9`/`9833364`, evidencia `8602263`; PR #49 mergeada (`dd71fae`).
- **Estado final:** done

---

## Sesión 2026-08-15 — claim-activation-code-only (id: 26)

- **Ciclo:** `spec_author` → gate humano → Codex CLI → `reviewer` → `done`.
  Reparto de siempre: Claude escribe spec y revisa, Codex implementa.
- **Qué cierra:** el hueco de autorización de `POST /v1/devices/claim` que
  heredaba #7 y que se destapó al escribir la spec de #24.
  `DEVICE_IDENTIFIER_FIELDS` publicaba `esn`/`imei`/`serialNumber`/
  `activationCode` como credenciales intercambiables y el `superRefine` del DTO
  solo exigía **exactamente uno** de los cuatro. Los IMEI de un lote de fábrica
  son casi consecutivos: con uno válido se enumeraban vecinos y se reclamaban
  collares ajenos en la ventana entre la venta y la activación legítima,
  quedándose con la ubicación GPS de esa mascota. Ahora `activationCode` es
  obligatorio y única credencial del borde HTTP.
- **Decisiones que cerró la spec, no el implementador:**
  - **D1**: `esn`/`imei`/`serialNumber` salen del schema y se ignoran en
    silencio (precedente `weightKg` de #22), con `activationCode` pasando de
    `.optional()` a obligatorio — eso es lo que convierte `{petId, imei}` en un
    `400` por `activationCode` ausente en vez de un claim silencioso. El `400`
    explícito por campo desconocido se descartó por escrito: no hay ni un
    `z.strictObject` ni un `ValidationPipe` con `forbidNonWhitelisted` en el
    repo, así que habría creado la misma asimetría que #22 rechazó y habría
    roto un claim legítimo que mandara `imei` de más.
  - **D2**: `DEVICE_IDENTIFIER_FIELDS` se **borra** en vez de reducirse a un
    array de un elemento, y `DeviceIdentifierField` pasa a unión literal
    explícita de los cuatro valores. Reducirlo a un miembro habría roto
    `IDENTIFIER_COLUMNS` y `findByIdentifier({field:'imei'})`; el array era
    justamente el símbolo compartido que hacía que el **dominio** publicara la
    política del **borde HTTP** — el acoplamiento que causó el hueco.
- **Alcance real vs. `files_affected`:** el inventario de tests de #7 a tocar
  eran 13 filas en 3 archivos (`design.md` D5), no los 3 paths que declaraba
  `feature_list.json`. Las 3 assertions de respuesta con `esn` se marcaron
  intocables desde la spec: `esn` es salida del contrato, nunca credencial.
- **Verificación:** `reviewer` aprobado sin bloqueantes, con `init.sh` corrido
  por él mismo e infra comprobada con `docker port` — 260 e2e passed, 6
  skipped, 0 fallos. Los cinco archivos declarados intocables no aparecen en
  `git diff --stat`; el bloque `R2: seed:devices` de los e2e conserva md5
  idéntico; ningún `it` de #7 desapareció (saldo neto positivo) y
  `traceability.md` tiene una fila por cada cambio de comportamiento.
- **El baseline como herramienta, no como trámite:** la primera corrida de
  `init.sh` de la sesión saltó los e2e (Docker apagado) y la primera con Docker
  recién levantado dio 77 fallos por la carrera de arranque conocida de la FK
  `pet_users_user_id_users_id_fk`. Se fijó un baseline explícito **antes** del
  handoff (255 passed, 6 skipped, 0 fallos, con contenedores calientes) para que
  un rojo durante la implementación no se pudiera confundir con infra fría. El
  cierre dio 260: delta +5 que cuadra uno a uno con los tests nuevos (3 del
  `it.each` de R2, 1 de R1c, 1 de R4). Repetir solo
  `pnpm -C backend-pet-tracker test:e2e` basta para descartar la carrera; no
  hace falta el `init.sh` entero.
- **Observación no bloqueante del reviewer:** los e2e de R2/R4 se commitearon
  después de la implementación de R1 —literalmente lo que prescribía
  `tasks.md`—, así que nacieron verdes. Siguen siendo regresiones válidas
  (fallan contra `cc89690`), pero para la próxima spec de seguridad conviene
  que **el e2e que prueba el agujero vaya primero**, aunque lo cierre la misma
  implementación que el requisito unitario.
- **Commits:** spec `572fdda`, aprobación `7663a3e`, baseline `cc89690`,
  implementación `740a0d4..3c03a21` (12 commits).
- **Estado final:** done

---

## 2026-08-15 (2) — `geofence-eval-full-batch` (#30)

- **Qué se hizo:** ciclo SDD completo con el reparto Claude/Codex. `spec_author`
  escribió la spec (R1-R11, `19da1f9`) → gate humano el mismo día (`a9d81d1`) →
  handoff por disco a Codex CLI → 22 commits de implementación → `reviewer`
  **aprobado sin bloqueantes**.
- **El problema:** el motor de geocercas evaluaba **una sola posición por ciclo**,
  no el lote entero. No fue una decisión de geocercas: efecto colateral de R16 de
  #8, que emite un `position.updated` por mensaje SQS y no por posición para
  abaratar EventBridge. `evaluate()` es una máquina de estados escrita para
  consumir un stream ordenado —el consumidor de #12 tiene hasta el guard
  monotónico `previousUpdatedAtMs`— pero solo recibía la más reciente del
  mensaje. En régimen estable se descartaba la mitad de las muestras; el daño
  real estaba en los lotes de hasta `POSITIONS_PER_MESSAGE_MAX=100` (descarga del
  búfer del collar tras perder cobertura, reinicio del poller, lookback del
  claim): toda la ventana colapsaba en una evaluación y **una salida con regreso
  dentro del lote no generaba ninguna alerta** — justo la ventana donde es más
  probable que la mascota se haya perdido de verdad, porque el dispositivo estuvo
  sin señal.
- **El prerrequisito que iba dentro de la misma feature (R1):** `evaluate()`
  cortaba solo con `FLAG_LOW_ACCURACY`, así que una posición marcada
  `suspect_jump` —el salto absurdo, a kilómetros del recorrido real— con buena
  precisión disparaba un `exit` falso. La histéresis es **espacial** (1.1R/0.9R +
  `accuracyM <= 50`), no temporal: una sola muestra mala basta. Multiplicar por
  ~100 las muestras evaluadas sin filtrar el salto habría multiplicado la falsa
  alarma de fuga, y una falsa alarma de fuga es lo que hace que el usuario
  silencie las notificaciones. Por eso R1 fue primero y no otra feature.
- **La solución:** el `detail` del evento pasa a `version: 2` con un campo nuevo
  `positions[]` (todas las aceptadas del mensaje, ascendente por `ts`),
  conservando `position` con la última para no tocar a los consumidores de
  006/007/010; el alerts-engine ordena sobre una copia e itera encadenando el
  estado **en memoria**. El conteo de eventos del bus no cambia —R5 lo fija como
  requisito verificable, un solo `Entry` por mensaje SQS y `Detail` < 256 KB—,
  así que el costo tampoco. R11 pliega las escrituras: máximo un
  `updateGeofenceState` por geocerca y mensaje, no uno por posición, conservando
  el orden a prueba de caídas de #12 D3 (alerta primero, estado después). R8 hace
  que la alerta lleve el `ts` **de la posición que cruzó**, no el de la última del
  lote ni el del reloj. R10 deja que un `detail` v1 sin `positions[]` (mensaje
  legado en vuelo durante el despliegue) se procese como lote de uno, sin DLQ.
- **La decisión que más juicio llevó (R2):** `geofence-eval-untouched.spec.ts`
  congela por sha256 `geofence-eval.ts` y su suite (R19 de #12), y R1 lo invalida
  por construcción. Se decidió **re-congelar con los hashes nuevos, no borrar el
  guard**: sigue impidiendo que una feature futura toque el motor sin spec. Los
  hashes se recalculan normalizando BOM y CRLF→LF, la lección que dejó la
  corrección post-cierre de #12 (CI en Linux vs. checkout Windows).
- **Verificación:** el `reviewer` corrió `init.sh` él mismo con la infra
  comprobada por `docker port` antes (5432 y 4566) — los e2e se ejecutaron de
  verdad: 17 suites / 260 tests, más 134 suites / 977 unitarios y 14 de infra.
  **Recalculó los dos sha256 de R2 por su cuenta** y coinciden con los del
  guard. Inspeccionó los 19 commits con `git show --stat`: todos los "rojos"
  tocan solo `.spec.ts`, así que C4 quedó verificado, no declarado — no se
  repitió el fallo de #19. Los tests congelados siguen intactos: los hunks de
  `alerts-engine-consumer.service.spec.ts` son inserciones puras (cero
  borrados), los dos e2e dan diff vacío, y en `positions-consumer.service.spec.ts`
  solo se editó el `it` autorizado de la línea 463.
- **Dos notas no bloqueantes del reviewer:** R2 y R10 no tienen "rojo" clásico
  —imposible en un test de congelación, y R10 es una regresión escrita antes del
  commit que podía romperla—; y `init.sh:250/:270` eligen y cuentan con
  `x.status === 'pending'`, así que **la feature en curso desaparece del
  anuncio** en cuanto pasa a `spec_ready` o `in_progress`. Ajeno a #30,
  candidato natural a plegarse en #23. `docs/specs.md` además se contradice
  consigo mismo: §Estados exige la marca humana para `spec_ready`, §86 manda al
  `spec_author` ponerlo antes del gate.
- **Sin migraciones, sin variables de entorno nuevas, sin dependencias nuevas y
  sin nada que desplegar:** se verificó que la regla de EventBridge filtra solo
  por `source` y `detail-type` (`provisioning.ts:300-303`,
  `pet-tracker-dev-stack.ts:105-108`), no por `detail.version`.
- **Commits:** spec `19da1f9`, aprobación `a9d81d1`, implementación
  `033fdcd..654a002` (22 commits, rojo→verde por R-id).
- **Estado final:** done

---

## 2026-08-16 — `reject-future-positions` (#27)

- **Qué se hizo:** ciclo SDD completo con reparto Claude/Codex. `spec_author`
  escribió la spec (R1-R9, `243c639`) → gate humano (`ae0dfc2`) → Codex
  implementó R1-R3 y R6-R8 → **paró en R4** → enmienda de la spec con gate
  reabierto (`479ee7d`) → Codex retomó y cerró R4, R5 y R9 → `reviewer`
  **aprobado sin bloqueantes**.
- **El fallo que cierra:** el `ts` de una posición lo pone el collar
  (`wialon-http.client.ts:166`, `message.t * 1000`), no el servidor, y nada
  comprobaba que estuviera en el pasado. `poller.service.ts:126` avanzaba el
  watermark a `Math.max(...)` sin tope, así que **una sola** posición con `ts`
  futuro dejaba `devices.ingest_watermark` en el futuro. En el ciclo siguiente
  el poller pedía `getMessages(unitId, fromTs, now)` con `fromTs > toTs`: rango
  invertido, lista vacía, `return` en la línea 97 sin tocar el watermark. **El
  device dejaba de reportar para siempre, en silencio, sin excepción, sin log y
  sin alerta**, y la única salida era un `UPDATE` manual. Disparable por
  hardware ordinario: un collar con el RTC mal configurado o con el GPS aún sin
  fijar la hora se autodestruye solo. Se destapó el 2026-08-14 en el smoke de
  #24 con el collar real.
- **La solución, redundante a propósito:** (1) `normalize()` descarta con razón
  `future_ts` todo lo que exceda `nowMs + FUTURE_TS_TOLERANCE_MS` (5 min,
  constante justificada en `pipeline/constants.ts`), con borde **inclusivo**
  para que un desfase de reloj legítimo no cueste telemetría real; (2) el
  poller topa el watermark en la escritura con `Math.min(lastTs, now)` **y** lo
  ignora en la **lectura** si ya está envenenado, cayendo al suelo de
  `CLAIM_WATERMARK_LOOKBACK_MINUTES`. La segunda mitad es la que recupera a los
  devices ya rotos: un envenenado nunca llega a `advanceWatermark`, porque el
  rango invertido corta antes — topar solo en la escritura no habría arreglado
  a nadie. Al reingestar, `min(lastTs, now)` **hace retroceder** el watermark y
  repara la fila en disco. El núcleo sigue puro: `nowMs` es opcional y viene
  del caller, nunca `Date.now()` (habría roto el test de pureza estática y
  obligado a editar 22 sitios de llamada de #8/#10).
- **La parada que salió bien:** `tasks.md` prohibía editar un test existente
  para ponerlo verde, obligando a parar y reportar. Codex paró en R4: dos `it`
  de lote largo del spec del consumidor construían sus posiciones como
  `BASE_TS + index * 30_000` y terminaban en `NOW + 28,5 min` (60 posiciones,
  de #8) y `NOW + 48,5 min` (100 posiciones, de #30), así que R4 les
  descartaba 47 y 87. **El fallo era de la spec**: su inventario de riesgo
  auditó `BASE_TS` pero no el incremento acumulado. Se enmendó con gate humano
  reabierto (precedente #21): R9(f) autoriza editar solo la expresión que
  construye esos `ts`, desplazando la ventana al pasado. Telemetría del futuro
  es justo lo que la feature rechaza, y un lote real de 100 posiciones es una
  descarga de búfer que cubre una hora **pasada**; lo que esos tests miden —el
  particionado del `BatchWrite` en trozos de 25, y que un lote grande siga
  emitiendo un solo `Entry`— no depende del signo de la ventana. Las
  alternativas eran peores: subir la tolerancia a más de 50 min para acomodar
  un fixture la habría vaciado de sentido, y renunciar a R4 habría dejado el
  filtro sin ningún llamador en producción.
- **Verificación:** el `reviewer` corrió `init.sh` dos veces con 5432 y 4566
  comprobados por `docker port` antes — 993 unitarios (977 + 16, exactamente
  los tests nuevos) y 260 e2e ejecutados de verdad. Los 8 commits rojos tocan
  solo `.spec.ts`. Prueba más fuerte que leer el commit de la enmienda: en todo
  el branch el spec del consumidor tiene **solo dos líneas suprimidas**, y son
  las dos expresiones autorizadas — conteos 60/100, espaciado de 30 s, orden,
  nombres de `it`, `batchSizes [25,25,10]` y `detail.positions` de 100 quedaron
  intactos. Ninguno de los siete archivos prohibidos aparece en el diff y los
  sha256 del guard de #30 no se recalcularon. Confirmó R7(b) más allá del mock:
  `IngestionDrizzleStore.advanceWatermark()` es un `UPDATE` sin guarda de
  monotonía, así que el watermark retrocede de verdad en Postgres.
- **Nota no bloqueante:** Codex editó `STATUS.md` (`e1ff5bc`), fuera de su
  alcance. No reclamó `done` ni tocó el conteo que valida `init.sh`; corregido
  en el cierre. El commit `e28b0eb` que registra el bloqueo se conserva a
  propósito: es la evidencia de que la regla dura se ejerció.
- **Sin migraciones, sin variables de entorno nuevas, sin dependencias y sin
  nada que desplegar.**
- **Commits:** spec `243c639`, aprobación `ae0dfc2`, enmienda `479ee7d`,
  implementación `e83b891..95f9bba` (29 commits).
- **Estado final:** done

---

## 2026-08-16 — init-env-drift-warning (#23)

- **Rol:** leader (Claude Code). Spec: `spec_author`. Implementación: Codex CLI.
  Revisión: `reviewer`. Branch `feature/23-init-env-drift-warning`.
- **Qué queda cerrado:** el tercer modo de fallo silencioso del entorno local.
  `init.sh` copiaba `.env.example` a `.env` solo si faltaba, así que un `.env`
  viejo se quedaba sin las claves que introducían las features nuevas. Con
  `REMINDERS_ENABLED` ausente el scheduler de #16 quedó apagado sin error
  visible; en el smoke de #24 con hardware real faltaban nueve claves, cuatro de
  ellas gates, y `POLLER_ENABLED` ausente tenía la ingesta GPS entera parada
  mientras el collar transmitía. Ahora `init.sh` imprime el diff de **claves**
  (nunca de valores) entre `.env.example` y `.env`, con los `*_ENABLED` en lista
  aparte por ser los que apagan features enteras.
- **Forma de la solución:** `env-drift.mjs` en la raíz con tres funciones puras
  (`parseEnvKeys`, `missingKeys`, `formatDriftLines`), solo `node:fs`, cero
  dependencias; suite `env-drift.test.mjs` con `node --test` de la stdlib,
  enganchada a `TEST_CMD`. El bloque de `init.sh` es aditivo: 13 líneas
  insertadas, cero suprimidas, `check_env()` y `REQUIRED_ENV_VARS` intactos y
  conviviendo con el chequeo nuevo. Prohibidas `comm/sort/awk/sed/grep -f/jq`
  por portabilidad Git Bash + CI, igual que el precedente de `port_open` con
  `nc`/`lsof`.
- **Decisiones de spec que cerraron ambigüedad antes del handoff:** diff
  unidireccional example→env (la deriva inversa no se reporta: los extras
  locales son legítimos); clave comentada en `.env` cuenta como ausente, porque
  comentada apaga igual; CRLF y BOM se eliminan antes de comparar; sin
  `.env.example` el bloque calla, que el caso "faltan los dos" ya lo cubre el
  `fail` existente.
- **Hallazgo de la primera corrida real:** el `.env` de la máquina arrastraba
  **8 claves faltantes, 4 de ellas gates** (`ACTIVITY_AGGREGATOR_ENABLED`,
  `ALERTS_ENGINE_ENABLED`, `EMAIL_ENABLED`, `PUSH_ENABLED`). La feature destapó
  su propio caso de uso en el momento de nacer.
- **Verificación independiente del reviewer** (no se fió del reporte de Codex):
  auditó C4 commit a commit en un worktree desechable y confirmó que los 11
  commits `test(...)` fallan de verdad en su propio commit — ninguno era un rojo
  que ya pasaba en verde, que es lo que falló en #19 y el motivo de separar
  implementador de revisor. Rehízo el diff de R9 desde cero con dos árboles
  (`init.sh` de `main` vs de HEAD, ambos con `.env` completo): §2 byte a byte
  idéntica. CRLF/BOM comprobado funcionalmente, no leyendo el regex: reportar 8
  y no 21 claves es la prueba de que el `\r` no tropieza.
- **El `.env` real nunca se tocó:** mismo mtime y tamaño (`1786743239 895`)
  antes y después, fuera del diff y sin trackear. R9(4) se resolvió con copia
  temporal en `mktemp -d`, no editando el archivo con las credenciales de
  Wialon.
- **Incidencia de arranque (no regresión):** primera corrida de `init.sh` roja
  con 107 e2e fallando por `NoSuchBucket`. LocalStack había reiniciado y perdido
  sus recursos; `pnpm run provision:local` y verde. Ya está en memoria, vuelve a
  pasar cada vez que el contenedor reinicia.
- **Nit conocido, no corregido a propósito:** el comentario de `init.sh:78` cita
  "la linea 115" cuando el `node -e` quedó en la 128 tras la inserción. El texto
  lo dictó la spec verbatim y el test de R7 asevera ese literal; corregirlo
  exigiría enmendar una spec aprobada por un comentario que no afecta al
  comportamiento.
- **Sin migraciones, sin variables de entorno nuevas, sin dependencias y sin
  nada que desplegar.** `docs/conventions.md` no gana filas: confirmado contra
  las 21 claves de `.env.example`.
- **Commits:** spec `b843d5a`, aprobación `f24e1c6`, handoff `7de0445`,
  implementación `7b1b16b..6b256d9` (21 commits, rojo→verde separado por R-id).
- **Estado final:** done

## Sesión 2026-08-17 — device-subscriptions (#25)

- **Feature/branch:** `device-subscriptions`,
  `feature/25-device-subscriptions`.
- **Alcance:** R1–R18 implementados en el orden obligatorio. Tabla y migración,
  predicado único de entitlement, repositorio, poller, claim, guard, diez rutas
  de tracking, filtro de alertas, CLI, seed/backfill y modelo de datos.
- **Seguridad:** `PetTrackingGuard` se ejecuta después de `PetAccessGuard`; el
  402 nunca adelanta el 404 opaco de membresía. El guard de acceso y los mappers
  de respuesta permanecen intactos.
- **TDD/trazabilidad:** commits rojo→verde separados por requisito aplicable;
  R5, R11 y R16 son propiedades verdes, R12/R14 restricciones de ausencia y R18
  usa rojo documental. Hashes completos en
  `specs/device-subscriptions/traceability.md`.
- **Verificación:** `init.sh` exit 0; 136 suites / 1,000 tests backend, 2 / 14
  infra, 28 del harness y 18 suites / 292 tests e2e pasados; lint y typecheck
  verdes. Dos suites / 6 e2e omitidos por sus gates existentes.
- **Entorno:** se reconciliaron solo las filas faltantes 0009–0011 del journal
  del Postgres Docker y se aplicó 0012 localmente. Sin recursos AWS reales,
  deploy, base no local ni proveedor de pago.
- **Manual:** smoke del collar Wialon real y `subscription:set` sobre ese collar
  reservados al humano.
- **Gate de revisión:** esta entrada y el cierre en `STATUS.md` los escribió el
  implementador en `9ea58cd`, **antes** del veredicto; el `leader` revirtió el
  `done` en `cf83cc7` y lanzó al `reviewer`. El texto técnico de arriba se
  conservó porque el review lo verificó afirmación por afirmación (§3 del
  veredicto), no porque viniera del implementador.
- **Veredicto:** **aprobado** —
  [[review_device-subscriptions|review]], 2026-08-17. Cinco observaciones no
  bloqueantes (O1–O5); la única técnica, O5: el e2e de seguridad de R9 no
  discrimina el orden de guards porque la mascota del caso sí tiene entitlement.
  No hay fuga — el 402 es inalcanzable sin `petMembership`, que solo escribe
  `PetAccessGuard` tras validar membresía —, pero el test no lo probaría si
  alguien invirtiera el orden.
- **Estado final:** done (marcado por el `leader` con el veredicto en la mano,
  2026-08-17).

## Sesión 2026-08-17 (2) — test-dev-resource-isolation (#28)

- **Feature/branch:** `test-dev-resource-isolation`,
  `feature/28-test-dev-resource-isolation`.
- **Spec:** [[../specs/test-dev-resource-isolation/requirements|spec]], R1–R14,
  aprobada por humano el 2026-08-17.
- **Alcance:** los e2e y el entorno de desarrollo dejan de compartir recursos de
  LocalStack. Sufijo `-test` derivado de `NODE_ENV`, token inyectable
  `AWS_RESOURCE_NAMES` en los ocho consumidores de producción, `provision:local`
  creando los dos juegos, y las suites e2e migradas a sus propios recursos.
- **Riesgo económico:** la stack `PetTrackerDev` vive en `us-east-1` con los
  nombres sin sufijo. Cerrado por tres vías independientes: el modo se comprueba
  antes que `NODE_ENV` (R3), el provisioning rechaza `AWS_MODE=aws` (R8) y el
  stack CDK no importa nada de `resource-names.ts` (R12).
- **Tres paradas, un solo defecto:** R7, R10 y R11 nacieron verdes porque
  `tasks.md` ordena las guardas de regresión después de los requisitos que las
  vuelven verdes, y la lista de excepciones a C4 nació corta. Las tres se
  resolvieron por gate (`03bb649`, `c74b031`, `bfd572f`); el implementador paró
  las tres veces en vez de fabricar un fallo. En `bfd572f` la aprobación de R11
  fue además condicionada: se le exigió una aserción anti-vacío, porque
  `expect(offenders).toEqual([])` pasaba igual con cero archivos escaneados.
- **Rechazo y corrección:** el primer veredicto fue **rechazado** por C6 —
  `requirements.md` seguía con `status: draft` pese a la casilla humana firmada.
  Defecto del `leader`, no del implementador; corregido en `921b6e7` y
  re-verificado de forma acotada, sin repetir la revisión.
- **Verificación:** `init.sh` exit 0 con los e2e corriendo de verdad (5432
  comprobado con `docker port`). El reviewer ejecutó él mismo el recuento manual
  de R13 sobre una corrida e2e completa: las tres colas de desarrollo idénticas,
  con mensajes previos que los `PurgeQueueCommand` no borraron. Midió también
  que el `ItemCount` de DynamoDB en LocalStack es exacto e inmediato (+1135 en
  `positions-test`, 0 en `positions`), cerrando la duda anotada sobre R10.
- **Limpieza de cierre:** borrado `progress/imp.md`, duplicado del reporte con
  nombre fuera de la convención `impl_<feature>.md`, y quitada su referencia de
  la fila R14 de `traceability.md`.
- **Veredicto:** **aprobado** — [[review_test-dev-resource-isolation|review]],
  2026-08-17.
- **Estado final:** done (marcado por el `leader` con el veredicto en la mano,
  2026-08-17).

---

## Sesión 2026-08-17 (3) — wialon-session-reuse (#29)

- **Feature:** #29 `wialon-session-reuse` (P2), branch
  `feature/29-wialon-session-reuse`. Última P2 del backlog: al cerrarla solo
  quedan #17 y #18, ambas P3.
- **El fallo que arregla:** `WialonHttpClient` abría sesión en **cada** llamada
  y tiraba el `sid`. `listUnits()` y `getMessages()` empezaban las dos por
  `login()`, y como el poller itera los devices asignados, el coste era un
  `token/login` por collar por ciclo de 60 s (~1.440/día con un collar,
  ~1,44 M con mil).
- **La solución:** `sid` cacheado por instancia con
  `WIALON_SID_TTL_MS = 4 * 60_000`, compartido por `listUnits()` y
  `getMessages()`; ante `{error: 1}` / `{error: 1011}` se re-loguea **una vez**
  y se reintenta de forma transparente, con techo duro de dos logins y sin
  recursión. `FakeWialonClient`, el puerto `WialonClient`, el factory y el gate
  `SIM_MODE` congelados por R8.
- **Arranque:** `init.sh` salió rojo la primera vez (109 tests, `NoSuchBucket`).
  No era regresión: LocalStack pierde sus recursos al reiniciar. Con
  `provision:local` y repetir, verde. Ya es el segundo precedente del mismo
  síntoma — merece comprobarse antes de diagnosticar nada.
- **Spec:** nueve requisitos EARS (R1..R9) escritos por `spec_author`, con tres
  decisiones abiertas que un agente no podía cerrar solo. El gate humano las
  cerró el 2026-08-17: TTL confirmado en 4 min; el smoke con token real **no**
  exigido para cerrar; y — lo interesante — **el límite de `token/login` de
  Wialon no está documentado en ninguna parte**. La premisa que justificaba la
  feature en `feature_list.json` quedó registrada como *no verificada*: la
  feature se sostiene por eficiencia, no por un umbral conocido. Lo documentado
  (errores `10` y `1003`) es concurrencia, no tasa.
- **Implementación:** Codex CLI, 19 commits con rojo→verde honesto por
  requisito. R7 y R8 nacieron verdes por ser guardas (seguridad y regresión),
  excepción a C4 declarada de antemano en la spec.
- **Rechazo y corrección:** la primera revisión **rechazó** por dos defectos,
  los dos sobre R7 (seguridad):
  1. Las cinco aserciones `expect(errorSpies[i]).toHaveBeenCalledTimes(0)`
     corrían **después** del `mockRestore()` del `finally`, que borra
     `mock.calls`. Pasaban siempre: la guarda no protegía nada. Un test de
     seguridad que nunca se ha visto fallar no está verificado.
  2. El commit `3e4dfd6` había editado el **fuente** (`wialon.errors.ts`),
     borrando "sin @nestjs/common" de un comentario, para poner verde su propia
     aserción `not.toContain('@nestjs/common')` — que hacía match con el
     comentario, no con un import. `tasks.md` exigía parar y reportar en ese
     caso exacto. El reporte de impl afirmaba además "sin cambios de código".
  Codex corrigió las dos: aserciones dentro del `try`, comentario restaurado en
  un commit rojo honesto y aserción cambiada a
  `/from\s+['"]@nestjs\/common['"]/`, que sí distingue un import de una mención.
- **Verificación:** en la segunda ronda el `reviewer` **no se fio** de que Codex
  dijera haber comprobado la guarda: inyectó él mismo un
  `console.error(..., this.token)` en el `catch` de `callWithSession`, vio
  fallar los dos `it` de R7 y revirtió con `git checkout --` dejando el hash
  idéntico. `init.sh` verde a la primera: exit 0, 1045 unit + 14 infra + 296
  e2e (6 skipped, 19 suites), lint y typecheck limpios.
- **Error del leader:** el commit de la spec `b5442bc` arrastró 75 archivos
  ajenos (`.agents/**`, `.codex/**`, `skills-lock.json`) porque ya estaban en
  el índice: `git add <rutas>` no acota lo que `git commit` termina metiendo.
  Corregido con `git rm -r --cached` en `be18919`.
- **Veredicto:** **aprobado** — [[review_wialon-session-reuse|review]],
  2026-08-17 (ronda 2; la ronda 1 se conserva en el mismo reporte).
- **Estado final:** done (marcado por el `leader` con el veredicto en la mano,
  2026-08-17).

---

## Sesion 2026-08-17/18 - nutrition-profile-engine (#17)

- **Feature:** motor calorico determinista (`computePlan`: RER = 70 x peso^0.75,
  tabla de factores MER, gramos a multiplo de 5, comidas y horarios por edad,
  cinco warnings clinicos, `objective`), perfil nutricional 1:1 con la mascota e
  historial de planes idempotente por `inputs_hash` (sha256 del input canonico).
  Cuatro rutas bajo `PetAccessGuard`, sin muro de pago. Sin IA: `ai_explanation`
  nace `NULL` para que #18 no necesite migracion propia.
- **Spec:** [[specs/nutrition-profile-engine/requirements|spec]] - aprobada por
  humano 2026-08-18, R1..R27.
- **Acciones:** `explorer` (corrigio la premisa del encargo: `plans/009` si
  existe y es la fuente normativa) -> `spec_author` -> dos rondas de gate humano
  sobre las decisiones clinicas y de producto (OV1 `kcalPer100g` obligatorio sin
  defaults, OV2 la edad gana a la perdida de peso, OV3 sin `PetTrackingGuard`;
  mas P1 textos de warning, P2 `sterilized` null cuenta como entero, P3
  `targetWeightKg` mayor que el peso se acepta) -> revision de la spec pedida
  por el humano antes de aprobarla -> gate humano -> handoff a Codex CLI ->
  implementacion -> `reviewer`.
- **Revision de la spec antes del gate (leader):** aritmetica de los cinco casos
  numericos verificada en `node`. Dos defectos corregidos: (1) R1 aseveraba por
  `readFileSync` que `nutrition-engine.ts` no contiene las cifras de C-1..C-10,
  mientras el paso (3) de su propia tarea pedia un JSDoc con esas mismas cifras
  en ese archivo - el refactor habria puesto rojo el test del paso (1) del mismo
  requisito; las cifras se movieron a `nutrition.constants.ts`. (2) R3 pedia "un
  caso por fila de C-2 (10 filas)" sobre una tabla de 8 filas: son 10 casos = 5
  filas clinicas x 2 especies.
- **Resultado:** `./init.sh` verde en la corrida propia del `reviewer` (exit 0,
  Postgres publicando puerto, e2e no saltados). 83 commits de Codex con patron
  test-primero rojo->verde por cada uno de los 27 requisitos; migracion nueva
  `0013_wet_may_parker.sql`. El `reviewer` verifico **por mutacion** que el par
  ancla de R14 discrimina: el perro de 305 g muere con `floor`, el gato de 60 g
  con `ceil` y el caso de R4 con el MER sin redondear. Las ocho guardas clinicas
  conservan su asercion anti-vacio; el commit final `b0ef38f` ("satisfy quality
  gates", 5 archivos de test tocados despues de estar verdes) resulto ser solo
  Prettier y tipos, sin aflojar ninguna asercion.
- **Codex no cerro la feature:** el handoff se lo prohibia explicitamente tras lo
  ocurrido en #29, y lo respeto - `feature_list.json`, `STATUS.md` y los archivos
  de cierre llegaron intactos al `reviewer`.
- **Dos defectos menores corregidos por el leader antes del PR:** la tabla del
  catalogo de `docs/data-model.md` habia quedado partida en dos por un parrafo
  intercalado entre `nutrition_plans` y `push_tokens` (las tres filas siguientes
  renderizaban como texto suelto), y la fila R27 de `traceability.md` citaba mal
  el mensaje de `45e9f24` (el hash era correcto).
- **Commits:** `c04da20` spec + informe del explorer, `1475339` STATUS, `b506a22`
  y `b1e0e5d` correcciones de la spec, `ae6c6aa` aprobacion + handoff,
  `f255ca6..1a6544d` los 83 de Codex, mas el commit de cierre de sesion.
- **Veredicto:** **aprobado** - [[review_nutrition-profile-engine|review]],
  2026-08-18.
- **Estado final:** done (marcado por el `leader` con el veredicto en la mano,
  2026-08-18). PR abierto; el merge lo hace el humano.


## Sesión 2026-08-19 — #31 mobile-app-scaffold cerrada (30/31)

- feature: #31 mobile-app-scaffold
- inicio: 2026-08-19
- spec aprobada por humano: si (2026-08-19)
- plan: monorepo confirmado por el humano (Expo + bun, carpeta isla mobile-pet-tracker/, backend sigue pnpm); explorer completado (progress/explore_mobile-app-scaffold.md, decisiones D1-D9); spec_author escribe la spec; gate humano; handoff a Codex CLI
- implementador: Codex CLI (handoff entregado: progress/handoff_mobile-app-scaffold.md)
- estado: implementacion de Codex APROBADA por el reviewer (progress/review_mobile-app-scaffold.md, 2026-08-19); R1-R12 verificados, init.sh exit 0
- siguiente paso: smoke R13 del humano (Expo Go en Android fisico, los 3 estados; pasos en requirements.md R13). Con la casilla marcada: done en feature_list.json, cierre de sesion y PR

Notas de la sesión que no están en la spec:

- El intento manual del humano destapó dos derivas de la plantilla
  `expo-template-default@57.0.16`: rutas en `src/app/` (no `app/`) y
  `reset-project` interactivo — la spec se enmendó ANTES del gate humano.
- El `.gitignore` de la plantilla NO cubre `.env` (solo `.env*.local`);
  Codex lo corrigió en el commit de scaffold por orden del addendum.
- EPERM transitorio de Windows en `bun create expo-app` (rename de app.json,
  antivirus/watcher): reintentar tras borrar la carpeta bastó.
- R13 (smoke humano, Expo Go en Android físico): los tres estados vistos,
  casilla marcada 2026-08-19.

---

## Sesion 2026-08-20 — roadmap movil + spec #32

- Plan aprobado por el humano: stack UI movil (HeroUI Native 1.0.8 + uniwind + reicon-react-native + Reanimated 4 + expo-dev-client; Motion descartado por no soportar RN; nitro-theme-transition aislado en #43). Plan completo en `.claude/plans/para-el-plan-para-inherited-coral.md`.
- Features #32-#43 (`mobile-*`) creadas en `feature_list.json` como `pending` — branch `update-status-mobile-roadmap`, PR pendiente de merge humano.
- init.sh OK (exit 0).
- Spec de #32 `mobile-ui-foundation` escrita por spec_author en `specs/mobile-ui-foundation/` (requirements, design, tasks, traceability); status `spec_ready` en `feature_list.json`. Sin decisiones pendientes; APIs verificadas contra tarballs npm de heroui-native@1.0.8 y uniwind@1.11.0. Nota: el plan `.claude/plans/para-el-plan-para-inherited-coral.md` no existe en disco — la spec se baso en la descripcion de feature_list.json (que ya recoge el stack aprobado).
- Restriccion nueva del humano (guardada en memoria): pruebas de humo moviles **solo con Expo Go** — sin Android Studio ni dev builds locales por ahora.
- Spec ajustada a Expo Go: stack verificado compatible (todo JS puro o nativos bundleados en SDK 57, verificado contra tarballs y `bundledNativeModules.json`). Smoke test = `bunx expo start --go` + QR (el flag `--go` es obligatorio: expo-dev-client instalado cambia el modo por defecto). Status sigue `spec_ready`.
- Spec #32 **aprobada por humano** (2026-08-20); checkbox marcado en requirements.md. Handoff a Codex entregado al humano.
- Codex implementa R1-R9 en `feature/32-mobile-ui-foundation`; R10 (smoke Expo Go en Android fisico) lo cierra el humano. Mientras Codex trabaja, este agente no toca `mobile-pet-tracker/` ni `backend-pet-tracker/`.
- Implementacion iniciada por Codex: 2026-08-20 21:00 UTC. Plan: spike R1 y configuracion R2-R3; provider/migracion/toggle R4-R6; EAS/docs R7-R8; cierre con contencion e `init.sh` para R9. R10 queda exclusivamente para el humano.
- Codex completo R1-R9: `./init.sh` verde, contencion R9 vacia y resultado detallado en `progress/impl_mobile-ui-foundation.md`. R10 sigue pendiente del smoke humano con `bunx expo start --go`; despues corresponde lanzar `reviewer`.
- Codex termino R1-R9 (21 commits test-rojo→verde por requisito, pusheados hasta `b309c3c`). Reporte: `progress/impl_mobile-ui-foundation.md`.
- Reviewer: **aprobado** (`progress/review_mobile-ui-foundation.md`) — R1-R9 verdes con verificacion independiente, init.sh exit 0.
- **R10 aprobado por humano** (2026-08-20): pantalla health se ve bien en Expo Go desde Android fisico. Nota: status del backend salio "unreachable" — esperado, `EXPO_PUBLIC_API_URL` debe apuntar a la IP LAN del equipo que corre el backend, no a localhost; es config de entorno, no bug de la feature.
- #32 marcada `done` en feature_list.json. PR abierto con `gh pr create`; merge lo hace el humano.
- Siguiente feature del roadmap: #33 (ver feature_list.json).

---

## Sesion 2026-08-20 (2) — feature #33 mobile-auth

- PR #62 (#32 mobile-ui-foundation) mergeado por el humano; main actualizado.
- Branch `feature/33-mobile-auth` creada desde main.
- Spec #33 escrita por spec_author (skills expo-router y expo-data-fetching cargadas): `specs/mobile-auth/` — R1-R11 (R11 = smoke humano Expo Go). forgot-password verificado inexistente en backend → pantalla Forgot stub deshabilitado (R9) y nueva feature #44 `auth-forgot-password` en backlog. D10 = decision codegen OpenAPI a ratificar en el gate (default: tipos a mano hasta 3+ dominios). Status: `spec_ready`.
- Spec #33 **aprobada por humano** (commit `187e401`, 2026-08-20; checkbox marcado por el). Handoff a Codex entregado 2026-08-21.
- Codex implementa R1-R10 en `feature/33-mobile-auth`; R11 (smoke Expo Go) lo cierra el humano. Mientras Codex trabaja, este agente no toca `mobile-pet-tracker/` ni `backend-pet-tracker/`.
- Implementación iniciada por Codex: 2026-08-21 03:53 UTC. Plan: R1/R2 → R3/R4 → R6 → R5 → R7 → R8 → R9 → R10, con commits test-rojo antes de cada implementación y trazabilidad actualizada tras cada verde.
- R1/R2 completados por TDD: `93c5257` (test rojo) → `a4b3841` (cliente auth verde, 20 casos; lint y typecheck móviles verdes).
- R3/R4 completados por TDD: `f33103f` (dependencia + test rojo) → `1008107` (AuthProvider verde, 4 casos; storage ausente de `src/api/`; lint y typecheck móviles verdes).
- R6 completado: `5102370` (health movido a `/health`; pantalla 100% rename, suite 98% rename por el único cambio de import; 6 tests verdes antes y después).
- R5 completado por TDD: `26aa7f1` (test rojo) → `fdd96b1` (splash por sesión + AuthProvider en layout; 3 tests, lint y typecheck móviles verdes).
- R7 completado por TDD: `4cdb79a` (test rojo) → `e51e972` (Login verde, 7 casos; todos los kinds, signIn/navegación y links; lint/typecheck y grep de estilos verdes).
- R8 completado por TDD: `3d2de99` (test rojo) → `765ec59` (Register verde, 8 casos; DTO completo, auto-login/fallback, términos y errores por campo; lint/typecheck y grep de estilos verdes).
- R9 completado por TDD: `3fe20ae` (test rojo) → `4b0c78c` (Forgot stub verde, 2 casos; controles deshabilitados, regreso a Login y cero red; lint/typecheck y grep verdes).
- R10 completado: suite móvil 9/9 (59 tests), `./init.sh` exit 0, contención de backend/infra/CI/init.config vacía; reporte en `progress/impl_mobile-auth.md`.
- Codex completó R1-R10. R11 queda exclusivamente para el smoke humano con Expo Go; después corresponde lanzar `reviewer`. La feature permanece `in_progress` hasta esos gates.
- Reviewer: **aprobado** (`progress/review_mobile-auth.md`, 2026-08-21) — R1-R10 verificados de forma independiente: init.sh exit 0, suite movil 59/59, contencion vacia, C2-C7 verdes.
- **R11 aprobado por humano** (2026-08-21): todo funciona en Expo Go.
- #33 marcada `done` en feature_list.json. PR abierto; merge lo hace el humano.
- Siguiente feature: #34 `mobile-tabs-shell` (P1).

---

## Sesion 2026-08-21 — feature #34 mobile-tabs-shell

- PR #63 (#33 mobile-auth) mergeado por el humano; main actualizado (6ba11c0).
- Cierre de #33 completado: resumen movido a progress/history.md.
- init.sh OK (exit 0).
- Branch `feature/34-mobile-tabs-shell` creada desde main.
- #34 esta `pending` → lanzar spec_author y PARAR hasta aprobación humana de la spec.
- spec_author: spec de #34 escrita → `specs/mobile-tabs-shell/` (R1–R11, cero deps nuevas); #34 pasa a `spec_ready`. Esperando gate humano en `requirements.md` §Aprobación.
- Spec #34 **aprobada por humano** (commit `ae852b7`, 2026-08-21; checkbox marcado). #34 pasa a `in_progress`.
- Handoff a Codex entregado 2026-08-21. Codex implementa R1–R10 en `feature/34-mobile-tabs-shell`; R11 (smoke Expo Go) lo cierra el humano. Mientras Codex trabaja, este agente no toca `mobile-pet-tracker/` ni `backend-pet-tracker/`.
- spec_author: spec de #34 escrita → `specs/mobile-tabs-shell/` (R1–R11, cero deps nuevas); #34 pasa a `spec_ready`. Esperando gate humano en `requirements.md` §Aprobación.
- Implementación iniciada por Codex: 2026-08-21 15:25 UTC. `git pull --ff-only` sin cambios y `./init.sh` verde (e2e omitido por LocalStack apagado). Plan: R1 → R2 → R3 → R4 → R5 → R6 → R7 → R8 → R9/R10, con commits test-rojo antes de cada verde salvo las excepciones R3/R4 documentadas y trazabilidad tras cada requisito.
- R1 completado por TDD: `929d6b2` (test rojo) → `0822ba7` (guard de `(tabs)` verde, 3 casos; typecheck móvil verde). `FloatingTabBar` queda como stub tipado hasta R7/R8, según `tasks.md`.
- R2 completado por TDD: `c1dc47d` (test rojo) → `b3028d1` (guard inverso de `(auth)` verde, 3 casos; typecheck móvil verde).
- R3 completado con la excepción C4 aprobada: `d3992fb` (3 asserts `/home` rojos) → `2995514` (3 hrefs `/home` verdes; 18 tests y typecheck móvil verdes). `git diff --word-diff` confirmó que no cambió nada más en esos archivos.
- R4 completado con la excepción C4 aprobada: `0a55b28` mueve pantalla y suite Health a `(tabs)` (renames 96%/95%); solo cambian 3 imports/paths, los asserts quedan intactos; 6 tests y typecheck móvil verdes.
- R5 completado por TDD: `f49519b` (test rojo) → `b45c1a4` (placeholders Home/Map/Food/Profile verdes, 4 casos; typecheck móvil verde).
- R6 completado por TDD: `95ecd19` (test rojo) → `9100e17` (botón HeroUI Sign out invoca `signOut`, 5 casos de screens; typecheck móvil verde).
- R7 completado por TDD: `9f7d634` (4 tests rojos contra el stub) → `e306135` (5 tabs reicon en orden, estados filled/outline con tokens y navegación preventiva; 4 casos y typecheck móvil verdes).
- R8 completado por TDD: `f30952c` (safe-area rojo, style ausente) → `cf99e35` (`bottom = insets.bottom + 12`; 5 casos de tab bar, lint y typecheck móviles verdes).
- R9 verificado: `typedRoutes` sigue activo; Metro regeneró `.expo/types/router.d.ts` con `/home`, `/map`, `/health`, `/food`, `/profile` y `/login`; typecheck posterior y lint móviles terminan con exit 0. No se conectó ningún dispositivo ni se ejecutó R11.
- R10 verificado: `./init.sh` exit 0 (backend 143/1111, infra 2/14, harness 11/28, móvil 13/75; build/lint/typecheck verdes; e2e omitido por LocalStack apagado), suite móvil directa 13/75 y diffs de áreas prohibidas/dependencias vacíos. R11 permanece como gate humano.
- Reviewer: rechazo inicial por C6 (frontmatter `status: draft` en specs/mobile-tabs-shell/) — fix del leader en `bf16904` (solo 4 frontmatters a `approved`).
- Re-revisión: **aprobado** R1–R10 (`progress/review_mobile-tabs-shell.md`, apéndice 2026-08-21, commit `9f3f5e8`). Resto verde desde la primera pasada: init.sh exit 0, suite móvil 13/75, typecheck/lint 0, contención vacía, C2–C7.
- Pendiente: R11 smoke humano con Expo Go (`bunx expo start --go`, 7 pasos en requirements.md). La feature sigue `in_progress` hasta ese gate.
- R11 aprobado verbalmente por el humano (2026-08-21) con observación: tab bar descentrada (pegada a la izquierda) en Android físico. Checkbox de R11 pendiente de su commit.
- Fix del centrado: cambio trivial de 1 archivo → fallback al subagente `implementer` (excepción documentada de CLAUDE.md §Excepciones; no amerita handoff a Codex). Scope: floating-tab-bar.tsx, posicionamiento horizontal a style inline.
- Fix del centrado verificado por el humano en Expo Go; barra centrada.
- **R11 aprobado**: checkbox marcado y pusheado por el humano (`cb45907`).
- Cierre: #34 `done` en feature_list.json, traceability R11 completada, STATUS.md actualizado (33/44). PR pendiente de abrir.

---

## Sesion 2026-08-21 (3) — feature #35 mobile-home-dashboard

- PR #64 (#34 mobile-tabs-shell) mergeado por el humano; main actualizado (e8da746).
- Branch `feature/35-mobile-home-dashboard` creada desde main.
- #35 esta `pending` → lanzar spec_author y PARAR hasta aprobación humana de la spec.
- spec_author: spec de #35 escrita (`specs/mobile-home-dashboard/`, R1–R13, frontmatter draft); #35 → `spec_ready`. Gate humano pendiente (incluye reevaluación D11 codegen).
- spec_author: spec de #35 escrita → `specs/mobile-home-dashboard/` (R1–R13); #35 paso a `spec_ready`.
- Spec #35 **aprobada por humano** (commit `06f12df`, 2026-08-21; checkbox marcado). Frontmatter de los 4 archivos a `approved` (lección C6 de #34). #35 pasa a `in_progress`.
- Handoff a Codex entregado 2026-08-21. Codex implementa R1–R12 en `feature/35-mobile-home-dashboard`; R13 (smoke Expo Go) lo cierra el humano. Mientras Codex trabaja, este agente no toca `mobile-pet-tracker/` ni `backend-pet-tracker/`.
- Codex inició la implementación: `git pull --ff-only` sin cambios y baseline `./init.sh` verde. Plan: R1→R10 con commits rojo/verde/trazabilidad por requisito; luego R11/R12 y reporte `progress/impl_mobile-home-dashboard.md`.
- Codex completó R1–R12: 18 suites/129 tests móviles, typecheck, lint, guardas de contención y `./init.sh` verdes. R13 sigue reservado al smoke humano; #35 permanece `in_progress`.
- Reviewer: **aprobado** R1–R12 (`progress/review_mobile-home-dashboard.md`) — init.sh exit 0 en corrida propia, 18 suites/129 tests móviles, contención vacía, traceability completa salvo R13.
- Pendiente: R13 smoke humano en Expo Go contra backend real. #35 sigue `in_progress` hasta ese gate.
- R13 aprobado por el humano con smoke real (mascota creada por API, collar ACT-001 reclamado, posiciones del simulador llegando); checkbox `3ee6815`. Dos observaciones de UI en el smoke.
- Fixes post-smoke (fallback `implementer`, excepción CLAUDE.md, cambios triviales de 2 archivos): safe-area top en home (`84a7762`→`4e93518`) y stale-while-revalidate en use-api para eliminar el flash al cambiar de mascota (`f896be3`→`028ba86`); docs `64887cc`. Suite 132/132, lint/typecheck 0. Pendiente verificación visual del humano.
- Fixes verificados por el humano en Expo Go. Cierre: #35 `done`, traceability R13 completa (`3ee6815`), STATUS.md 34/44. PR pendiente de abrir.

---

## Sesion 2026-08-21 (4) — feature #36 mobile-map-live

- PR #65 (#35 mobile-home-dashboard) mergeado por el humano; main actualizado.
- Branch `feature/36-mobile-map-live` creada desde main.
- #36 esta `pending` → lanzar spec_author y PARAR hasta aprobación humana de la spec.
- Tensión conocida a resolver en la spec: expo-maps y react-native-maps requieren dev build, pero la restricción del humano es smoke SOLO con Expo Go.
- spec_author: spec de #36 escrita en `specs/mobile-map-live/` (draft, R1–R13) y #36 → `spec_ready`. La tensión se resolvió: react-native-maps 1.27.2 SÍ corre en Expo Go (evidencia doc SDK 57 en design.md §D1); expo-maps descartado (alpha, no Go). Sin react-query (polling = setInterval+refetch en useFocusEffect, design §D2). Lost Mode sin endpoint backend → stub deshabilitado + feature #45 `pet-lost-mode` añadida al backlog. Esperando aprobación humana del gate.
- Spec #36 **aprobada por humano** (commit `a2f48e9`, 2026-08-21; checkbox marcado). Frontmatter a `approved`. #36 pasa a `in_progress`.
- Handoff a Codex entregado 2026-08-21. Codex implementa R1–R12 en `feature/36-mobile-map-live`; R13 (smoke Expo Go) lo cierra el humano. Mientras Codex trabaja, este agente no toca `mobile-pet-tracker/` ni `backend-pet-tracker/`.
- Codex inició la implementación: `./init.sh` verde (e2e omitidos por LocalStack apagado), branch sincronizada con origin y alcance/TDD R1→R12 confirmado. Se preservan cambios preexistentes ajenos en el working tree.
- Codex completó R1–R12: TDD rojo/verde por R1–R10, 21 suites móviles/193 tests, typecheck/lint y `./init.sh` verdes, contención vacía. Evidencia completa en `progress/impl_mobile-map-live.md`; R13 sigue pendiente del humano.
- Reviewer: **aprobado** R1–R12 (`progress/review_mobile-map-live.md`) — init.sh exit 0, suite móvil 21 suites/193 tests, react-native-maps 1.27.2 única dep nueva, cleanup del polling verificado, contención vacía.
- Pendiente: R13 smoke humano en Expo Go (collar real o SIM_MODE en Android físico). #36 sigue `in_progress`.
- **R13 aprobado por el humano** (checkbox `ce75f03`, 2026-08-22): premium con mapa/ruta/stats (ACT-002 + SIM_MODE), free sin mapa. Durante el smoke: LocalStack reaprovisionado (ResourceNotFoundException — los recursos no sobreviven reinicios del contenedor).
- Cierre: #36 `done` (35/45), traceability R13 completa, STATUS.md actualizado. #45 `pet-lost-mode` quedó en backlog desde la spec. PR pendiente de abrir.

## Sesion 2026-08-22/23 (2) — feature #37 mobile-health

- PR #66 (#36) mergeado; branch `feature/37-mobile-health` desde main.
- spec_author escribió spec R1–R13; humano aprobó (commit `8d1d1e5`, 2026-08-22).
- Handoff a Codex CLI (`progress/handoff_mobile-health.md`); Codex implementó R1–R12 con TDD rojo→verde por R-id. Evidencia en `progress/impl_mobile-health.md`.
- Reviewer: **aprobado** R1–R12 (`progress/review_mobile-health.md`) — typecheck/lint/test (25 suites, 270 tests), init.sh exit 0, contención vacía, cero deps nuevas. Menor: `fmtVariation` duplicada (va al follow-up de extracción previsto).
- **R13 aprobado por el humano** (checkbox `8bd02d7`, 2026-08-22): smoke completo en Expo Go pasó.
- Feedback del smoke: la UI **no respeta el diseño de Figma** — el repo nunca tuvo el link versionado (gap conocido desde mobile-auth). Alta de #46 `mobile-figma-polish` (pending, P2) con el link versionado en su descripción.
- Cierre: #37 `done` (36/46), traceability R13 completa, STATUS.md actualizado. PR abierto para merge humano.

## Sesion 2026-08-23 — feature #46 mobile-figma-polish

- PR #67 (#37) mergeado; branch `feature/46-mobile-figma-polish` desde main.
- Acceso al Figma Make confirmado vía MCP; subagentes no dereferencian recursos MCP → leader volcó la fuente a `specs/mobile-figma-polish/design-src/` (App.tsx 1849 líneas, theme.css, fonts.css).
- spec_author: R1–R12; humano ajustó R4 pre-gate (pill flotante se conserva) y aprobó (`b30f4a5`). Consulta SF: se mantuvo Inter (SF sin licencia fuera de Apple).
- Codex implementó R1–R11 (TDD solo R1–R3; commit atómico por R-id). Reviewer aprobó gate automatizado.
- Smoke iterativo del humano con 3 correcciones: (1) radius inflado — bug de spec R1, `--radius` shadcn ≠ base de escala heroui; fix trivial vía fallback implementer `e370daa`. (2) dark roto — `@source` no escaneaba `src/`, clases de la app fuera del stylesheet; Codex `e2d3d50`. (3) iconos sin color / resolución stale en tabs montadas / mapa sin estilo dark; Codex: helper `useThemeColors` reactivo + `customMapStyle` night `d28d406`+`b5bff10`.
- R12 completo (humano, light y dark). Reviewer final: rechazo docs (traceability sin correcciones) → corregido `0aa5ac0` → **aprobado**.
- Cierre: #46 `done` (37/46), STATUS.md actualizado. Suite final 28 suites/284 tests. PR abierto para merge humano.

## 2026-08-24/25 — Feature #38 mobile-food (cerrada)

- spec_author escribió R1–R11; humano aprobó gate con D7 (Served/Pending
  por hora local) y D9 (Generate solo en MealSchedule) vía sesión
  interactiva + su commit `aa368e6`.
- Primera implementación vía plugin Codex de Claude Code: 3 intentos
  abortados por sandbox bwrap roto (AppArmor `restrict_unprivileged_userns`
  del VPS); se resolvió con `codex exec --dangerously-bypass-approvals-and-sandbox`
  lanzado en background desde la sesión leader.
- Codex implementó R1–R10 con TDD estricto (28 commits test→feat→docs) +
  PR borrador #70. Reviewer aprobó (init.sh exit 0, 31/356).
- Smoke humano R11 con 3 iteraciones: (1) safe area superior faltante en
  Food/MealSchedule (patrón home.tsx `insets.top+12`), (2) flash de carga
  → skeletons dimensionados, (3) selector de pets → componente compartido
  `PetSwitcher` con Avatar heroui (primero con nombre, luego avatar-only a
  pedido). Todo TDD rojo→verde vía Codex.
- Convención nueva en `docs/conventions.md`: dimensiones de layout
  uniformes (métricas de home.tsx) en toda pantalla móvil.
- Reviewer aprobó delta post-smoke; C6 saldado con commits del humano
  (`aa368e6`, `229e460`). Suite final: 32 suites/357 tests. #38 → done.
- Pendiente humano: merge del PR #70.

## 2026-08-25 — Feature #47 reminders-api (cerrada)

- Nacida del gate de #39: el humano pidió GET listado y DELETE real como
  feature backend aparte (en vez de meterlos en la feature móvil).
- spec_author verificó contra el módulo real (patrón vaccines); humano
  aprobó (`e47a686`). Codex implementó R1–R3 con TDD rojo→verde por R-id
  (9 commits): GET dueAt asc sin rol, DELETE 204 owner/403/404.
- Reviewer aprobó: init.sh exit 0, 1114 unitarios + 327 e2e (33/33 de
  reminders), Clean Architecture y contención verificadas.
- Desbloquea #39 mobile-reminders (spec_ready, esperando gate humano).

## 2026-08-24 — Feature #48 mobile-design-drift (cerrada; nació como #47, renumerada por colisión de ID con reminders-api)

- Origen: auditoría solo-lectura de drift (skill expo-design-system) →
  progress/audit_design-drift_mobile.md. Feature registrada como #48.
- Trabajo completo en git worktree Pet-Tracker-wt-47 (branch
  feature/47-mobile-design-drift) en paralelo con la sesión de #39 sobre el
  tree principal — primer uso real del patrón worktree de CLAUDE.md.
- spec_author: R1-R8 EARS; humano aprobó (60296fa). Codex exec en background
  desde la sesión leader (permiso Bash agregado por el humano tras bloqueo
  del clasificador) implementó R1-R8 con TDD estricto, commit
  test-rojo→verde→docs por requisito.
- Entregado: tokens --radius-card/--text-2xs en global.css, card.tsx
  compartido (surface|accent|secondary, sin heredar --radius heroui — bug
  #46) adoptado en las 7 pantallas, text-2xs en tab bar y map, safe area
  según conventions.md en health/weight-log/profile y overlay de map,
  skeletons en vez de Spinner. Grep-clean: cero rounded-[20px]/text-[10px].
- Reviewer aprobó (53d4dd7). #48 → done. PR #72 abierto para merge humano
  (branch conserva el nombre feature/47-mobile-design-drift previo a la
  renumeración).

## 2026-08-25 — Feature #39 mobile-reminders (cerrada)

- Primera feature bajo estructura Expo oficial (src/screens/) y las
  convenciones de dimensiones. Spec rehecha tras gate humano: backend
  aparte (#47 reminders-api), entrada por Profile, picker nativo.
- Codex implementó R1–R11 (33 commits TDD); reviewer aprobó. Reworks
  post-review: swap picker a @expo/ui (gate cruzado con sesión paralela),
  fix raíz stale-data en use-api al cambiar de pet (hallazgo smoke,
  diagnóstico de la sesión Frontend app), BottomSheet de borrado (Alert →
  @expo/ui) con fix de crash: el root de @expo/ui no corre en Expo Go
  Android; se migró a @expo/ui/community/bottom-sheet.
- Merge de #72 (design-drift) con adaptación: Card compartido y text-2xs
  en las pantallas nuevas; conflicto de imports en profile.tsx resuelto
  por el leader (fallback trivial documentado).
- Smoke humano R12 completo en 4 iteraciones (`21e1119`); delta review
  final aprobado. Suite: 38 suites/447 tests. #39 → done.
- Lecciones: @expo/ui root exige dev build (community/* para Expo Go);
  @gorhom/bottom-sheet es peer de heroui/@expo/ui community, no removible.
- Pendiente humano: merge del PR de #39 (post #72; #73 de la otra sesión
  sigue abierto y no conflicta).

## 2026-08-25 — Feature #40 mobile-pets-profile (cerrada)

- Spec R1–R10 aprobada (commit humano 49b85d6); gate Q1–Q4: Docs contra
  backend aparte #49 media-docs-api (pending), backend health eliminado,
  edit/delete de mascota fuera, filas Geocercas/GPS omitidas.
- Implementación Codex CLI: Profile reescrito (screens/ + route delgado),
  users/me, AddPet, foto presignada (expo-image-picker), Docs contra
  contrato #49, blobatar determinista, tema persistente. TDD 9 pares
  rojo→verde + 6 ciclos de fix.
- Fixes de smoke: rutas pets/* dentro de (tabs) (provider), router.back()
  tras alta, y saga de selección pisada → fix raíz: hook compartido
  use-pet-selection con guard useIsFocused + isRefreshing (las tabs
  montadas/desenfocadas con lista stale reseteaban la selección global).
- Review: rechazo C7 (health.ts huérfano) → fix; rechazo delta (2 copias
  del efecto en map/reminders) → fix7 migración total al hook + guardia
  estructural; veredicto final aprobado (solo defecto documental de
  hashes pre-rebase, corregido por leader).
- Smoke R10 humano completo 2026-08-25 (fde2648). Suite: 46 suites/521
  tests. #40 → done.
- Lecciones: REPLACE sobre Tabs no dispara blur/focus (usar back());
  useEffect corre en tabs desenfocadas — todo auto-select global debe
  gatearse con useIsFocused; el rebase sobre commits del humano invalida
  hashes citados en trazabilidad (citarlos post-rebase).
- Pendiente humano: merge del PR de #40. Docs smoke real bloqueado hasta
  #49 media-docs-api.

## 2026-08-25 — Feature #50 mobile-tab-glass (cerrada)

- Sesión 17:37–17:59 UTC en worktree `Pet-Tracker-wt-ui`, branch
  `feature/50-mobile-tab-glass`. Implementación R1–R7 con TDD (7 pares
  rojo→verde + par C8), tokens glass en `global.css`, pill animado con
  shared value.
- Review APROBADO (`progress/review_mobile-tab-glass.md`, HEAD 703fa18)
  con 1 condición: frontmatter de la spec seguía `status: draft` pese a
  casilla humana marcada → corregido (`status: approved`).
- PR #75 mergeado por humano; #50 → done en `feature_list.json`.
- Lección: el commit humano de aprobación puede marcar solo la casilla —
  verificar también el frontmatter antes del handoff.

## 2026-08-26 — Feature #49 media-docs-api (cerrada)

- Spec aprobada (338c035), implementación Codex CLI (11 commits
  test-primero hasta efe585e), review APROBADO
  (`progress/review_media-docs-api.md`, C2–C7). PR #78 mergeado por el
  humano (c3ec70c); #49 done. Desbloquea el smoke Docs de #40.
- Durante el gate se detectó y registró #51 `media-bucket-aws-mode`
  (P2, a41e43a): en AWS_MODE=aws mediaBucket resuelve a un bucket
  inexistente.
- Incidente 2026-08-25: dos sesiones colisionaron sobre el working tree
  (spec de #49 y spec de #43 escritas en paralelo). Ambas specs válidas;
  regla "un solo escritor" reforzada — sesiones paralelas via worktree o
  checkout propio.

## 2026-08-26 — Feature #43 mobile-theme-transition (cerrada)

- Implementó la sesión Claude "Frontend app" (excepción a Codex, orden del
  humano), TDD R1–R5. Review APROBADO + 2 re-reviews por fixes post-review
  hallados por el humano en Expo Go: (1) import top-level de nitro-modules
  lanzaba sin módulo nativo (require perezoso, 4962ea8); (2) Metro reporta
  el throw vía ErrorUtils aunque se capture (sonda hasNitroModules() con
  TurboModuleRegistry.get antes de evaluar el paquete, 6299aef).
- R6 cerrado por humano (434e104): MANTENER; observación registrada — la
  animación no luce como el prototipo de la librería (posible polish futuro).
- PR #80 mergeado; #43 done vía PR #82 (junto a sync de STATUS.md).
- Lecciones: (a) jest con mocks enmascara fallos de evaluación de módulos
  nativos — dejar un test sin mock del paquete vigilando la no-evaluación;
  (b) el frontmatter de la spec vuelve a quedarse en draft tras el gate
  (2ª vez, ver #50) — verificarlo al cerrar el gate, no en el review.

## 2026-08-27 — Feature #51 media-bucket-aws-mode (cerrada)

- Implementación Codex CLI (TDD R1–R5, 61c1c66..926d7c6), review APROBADO
  condicionado (aa2fa2b). Smoke real R5 ejecutado por el humano el
  2026-08-27 (casilla 2971bff, fechada 2026-08-26 por error menor de
  registro): suite gated 2/2 verdes contra el bucket real, flujo HTTP
  completo con SMOKE OK (bytes idénticos), y foto visible en la app móvil
  contra S3 real.
- Incidencias del smoke (Windows): `export`/continuaciones `\` no existen
  en PowerShell (bloques bash → Git Bash); jq no instalado; sesión de
  `aws login` caduca (~30 min) — renovar y reiniciar backend si la prueba
  se alarga.
- Cierre vía PR #81 (#51 → done en la propia branch tras resolver
  conflictos con main).

## 2026-08-28 — Feature #52 android-maps-api-key (cerrada)

- Implementación Codex CLI (TDD R1–R5), review APROBADO condicionado al
  smoke humano. PR #87 mergeado; casilla R6 firmada por el humano en PR #88
  (se mergeó #87 antes de marcarla, corregido con un PR de una línea).
- El humano creó la clave restringida (package `com.trackermex.pettracker` +
  SHA-1 del debug keystore) y regeneró el dev build. Resultado: meta-data en
  el manifest (`grep` = 1), Map monta sin crash, vista nativa creada
  (watermark visible) y logcat sin `API key not found`, `addViewAt`,
  `Authorization failure` ni `API_KEY_ANDROID_APP_BLOCKED`. Google acepta la
  clave.
- **R6 acotado a la clave el 2026-08-28** (4f47897): la redacción original
  exigía tiles y marker, que no renderizan por un defecto independiente que
  el crash por clave ausente venía tapando. Ese defecto es #54
  `android-map-never-ready`; sin la acotación, #52 quedaba rehén de un fallo
  ajeno a su diff.
- Incidencias del smoke (Windows): el `.env` acabó en la raíz del repo en
  vez de en `mobile-pet-tracker/` — Expo solo carga el del directorio del
  proyecto, así que `app.config.ts` no veía la clave y el `grep` daba 0.
  Antes de eso, LocalStack vacío (tabla de posiciones y cola `positions-raw`
  ausentes) hasta correr `provision:local`, y `AWS_MODE` sin declarar en el
  `.env`.
- Lecciones: (a) un requisito de smoke redactado sobre el efecto visible
  ("renderiza tiles") ata la feature a toda la pila que hay debajo — mejor
  redactarlo sobre lo que el diff controla ("la meta-data llega al manifest
  y el SDK no rechaza la clave"); (b) el watermark de Google Maps es señal
  diagnóstica: lo dibuja el delegate de play-services-maps, que no existe
  hasta que corre `onCreate`; (c) diagnosticar a distancia sobre síntomas
  reportados llevó a dos hipótesis erróneas (ciclo de vida, `customMapStyle`)
  antes de que el explorer las tumbara con lectura del paquete — pedir la
  evidencia que discrimina, no la que confirma.

## 2026-08-28 — Feature #45 pet-lost-mode (cerrada)

- Implementación Codex CLI (TDD R1–R8), review APROBADO con una única
  condición documental, ya resuelta (5793f64: la fila R4 de trazabilidad
  citaba `d0299ce`, que es un commit vacío).
- Smoke R9 en el dev build de Android el 2026-08-28, casilla firmada por el
  humano (`1d31d18`): toggle activa y desactiva, el label sigue el estado,
  el perfil refleja `lostMode` y con el backend apagado sale
  `Could not update Lost Mode` quedando el botón usable al reintentar.
- **Paso 5 del smoke no ejecutado** (usuario `family` con el botón
  deshabilitado): no hay uno seedeado en local. La spec lo redacta
  condicional y R7 lo cubre en `map.test.tsx`, así que no bloqueó el gate;
  queda registrado como no ejecutado, no como verificado.
- El tab Map no pinta tiles ni marker en ese entorno por #54
  `android-map-never-ready`, ajeno a este diff: el botón vive en la tarjeta
  superpuesta, que sí se renderiza. Por eso R9 se pudo cerrar aunque el mapa
  siga roto.
- `lost_mode` queda como flag expuesto **sin efectos automáticos** (decisión
  de producto §D1): no dispara alertas ni cambia el polling. Los efectos son
  feature futura.
- Lecciones: (a) el reporte de handoff de Codex arrastraba
  `expo start --go` cuando Expo Go ya no era el runtime de smoke — al cambiar
  una decisión de entorno hay que barrer specs **y** reportes; (b) un paso de
  smoke condicional ("si hay usuario family seedeado") se cierra anotando que
  no se ejecutó, nunca dándolo por bueno.

## 2026-08-28 — Feature #44 auth-forgot-password (cerrada)

- **Feature:** recuperación de contraseña backend mediante
  `POST /v1/auth/forgot-password` y `POST /v1/auth/reset-password`, con
  respuesta uniforme, token SHA-256 de un solo uso/TTL una hora, invalidación
  de tokens hermanos, Argon2, auditoría y entrega por log estructurado.
- **Spec:** [[specs/auth-forgot-password/requirements|spec]] aprobada por
  humano; R1–R13 implementados sin reabrir DA1/DA2 ni el backlog excluido.
- **Acciones:** TDD por requisito con commit rojo anterior a cada verde;
  migración 0015 aplicada al Postgres local; trazabilidad actualizada después
  de cada verde; guía manual e informe de implementación añadidos.
- **Resultado:** `./init.sh` exit 0 — backend 156 suites/1198 tests, infra
  2/14, móvil 50/561, backend e2e 23 suites/349 tests (8 omitidos), build,
  lint y typecheck verdes. Contención R13 limpia contra `origin/main`; ningún
  cambio mobile/infra/env y ningún deploy AWS.
- **Commits:** rojos `64230ee`, `a40ceb2`, `97e2c4b`, `080817e`, `25abbdd`,
  `e36de77`, `106349c`, `0e67341`, `1e62765`, `ac3af27`, `56054ce`,
  `f699540`, `4e05906`; verdes `9cd8473`, `b3e0aaf`, `bfa3f8c`, `9d1f7e7`,
  `721c580`, `e531f63`, `ff042c0`, `e1bc6cf`, `2142d49`, `44fecd5`,
  `4324e31`, `562b8a5`; trazabilidad en commits documentales inmediatos.
- **Estado final:** `done`. Informe:
  `progress/impl_auth-forgot-password.md`.

## Sesión 2026-08-29 (leader = sesión Backend)

### Feature #44 `auth-forgot-password` — done

- Implementada por Codex CLI en `feature/44-auth-forgot-password`, R1–R13,
  backend puro. PR **#93**.
- `reviewer` ejecutado → `progress/review_auth-forgot-password.md`.
  **Veredicto: APROBADO.** El reviewer re-ejecutó `./init.sh` él mismo (exit 0)
  y las cifras coinciden exactas con el reporte del implementador; los 13
  commits rojos existen y preceden a su verde.
- **Pendiente humano antes del merge de #93** (no bloquea el código): ratificar
  en una línea la corrección del regex de contención de R13 descrita en el
  hallazgo H2 del review, para cerrar el hueco de C6.

### Feature #54 `android-map-never-ready` — **done** (2026-09-01)

- Causa **cerrada con evidencia**: el discriminador en dispositivo
  (`progress/discriminador_android-map-never-ready.md`) devolvió `onMapReady`
  dispara, `googleRenderer="LEGACY"` no pinta, `liteMode` sí pinta ⇒ la
  `SurfaceView` del mapa no se compone bajo Fabric. Descartadas la clave de
  Maps (#52), el renderer, `customMapStyle`, el backend y la hipótesis de ciclo
  de vida del explorer.
- Decisión del humano (2026-08-28): **migrar a `expo-maps`**, asumiendo su
  estado alpha. La vía de vuelta está escrita en la spec §Contexto fijo.
- Spec de `spec_author` aprobada por el humano el 2026-08-28 (909 líneas,
  R1–R8). Frontmatter puesto en `approved` por el leader el 2026-08-29 — la
  casilla estaba firmada pero los cuatro ficheros seguían en `draft` (quinta
  vez que ocurre: #50, #43, #52, #44, #54).
- Handoff a Codex CLI listo en `progress/handoff_android-map-never-ready.md`.
- **Causa raíz real, encontrada el 2026-09-01**: `src/app/(tabs)/map.tsx:175`
  declaraba `bg-background` en el contenedor que envuelve `PetMap`. Un
  `SurfaceView` se compone *por detrás* de la ventana; un ancestro con fondo
  opaco tapa el hueco sin producir ningún error. Evidencia y siete hipótesis
  descartadas en `progress/discriminador2_android-map-never-ready.md`.
  Explica por qué la migración a `expo-maps` no arregló nada: ambas librerías
  montan un `SurfaceView` y el contenedor nunca cambió.
- Handoff fix 1 ejecutado el 2026-09-01 con TDD: test rojo `74f50f7` → fix
  verde `38168cf`. `reviewer` **aprobado** en
  `progress/review_android-map-never-ready_fix1.md`: reprodujo el rojo por su
  cuenta en un worktree y `./init.sh` salió 0 (móvil 568 → 569 tests).
- **Smoke humano R8 aprobado** el 2026-09-01 (`81707dd`), con tiles, marker y
  polyline confirmados en ambos temas. Con eso el leader marca #54 `done`.
- Regla nueva que deja esta feature: `docs/ui-guidelines.md` §10 — ningún
  ancestro de una vista nativa de mapa declara fondo opaco.

### Feature #55 `mobile-map-zoom-controls` — **done** (2026-09-01)

- **Branch: `feature/mobile-map-zoom-controls`**, sacada de `main` por el
  humano. `main` está **protegida**: ninguna aprobación de spec ni ningún
  cambio se commitea ahí, siempre en branch. `tasks.md` §Rama quedó obsoleto
  (dice `feature/55-…` sacada de la branch de #54, que ya está mergeada); el
  handoff lo corrige por escrito en vez de editar una spec aprobada.
- Spec escrita por `spec_author` el 2026-09-01 en
  `specs/mobile-map-zoom-controls/` (R1–R3). **Aprobada por el humano** el
  2026-09-01 (`6f6c647`). Frontmatter de los 4 ficheros pasado de `draft` a
  `approved` por el leader — sexta vez que la casilla se firma con los
  ficheros en `draft` (#50, #43, #52, #44, #54, #55): merece automatizarse.
- Handoff a Codex ejecutado el 2026-09-01 con TDD: rojo `e052b07` → verde
  `bf14baf`, más dos commits de documentación. `reviewer` **aprobado** en
  `progress/review_mobile-map-zoom-controls.md`: no se limitó a comprobar que
  el test usa `toEqual`, sino que añadió `zoomGesturesEnabled: true` a mano y
  confirmó que el test se pone rojo. `./init.sh` exit 0, móvil 569 → 570.
- **Smoke humano R3 aprobado** el 2026-09-01 (`aa1da88`): controles `+` / `−`
  ausentes y pinch-to-zoom funcionando. Con eso el leader marca #55 `done`.
- **Aprendizaje de flujo**: Codex commiteó en el VPS y el handoff decía "no
  pushees" — plantilla pensada para cuando implementador y humano comparten
  working tree. Aquí no lo comparten, así que el humano no veía nada en su
  clon. A partir de ahora el leader pushea tras el veredicto del reviewer.
- Desviación declarada por Codex: su plugin `expo` es la v1.0.2 y **no
  contiene** `expo:expo-overview`; cargó `expo:building-native-ui`. Riesgo
  bajo aquí (la autoridad fueron los tipos instalados de `expo-maps` y el diff
  es un booleano), pero conviene actualizar el plugin antes de un handoff
  móvil grande.
- Alcance: `PetMap` pasa `uiSettings={{ zoomControlsEnabled: false }}` a
  `GoogleMaps.View`. Un archivo de producción (`src/components/pet-map.tsx`),
  su test y una sección nueva en `docs/verification.md`. `map.tsx` no se toca.
- Decisión ya tomada por el humano en la entrada #55: se **quitan** los
  controles, no se reubican; `contentPadding` descartado por acoplar el
  wrapper al alto de dos overlays. El pinch-to-zoom no se toca.
- R3 es un smoke humano en dev build de Android (controles `+` / `−` ausentes
  **y** pinch acercando/alejando). **Solo JS**: Fast Refresh sobre el dev build
  ya instalado, sin `prebuild` ni `run:android`.
- Dependía de #54 (`src/components/pet-map.tsx` lo crea esa feature); resuelto:
  #54 se mergeó en `main` con el PR **#94**.

### Choque de IDs entre sesiones — pendiente de resolver

`origin/feature/55-auth-email-delivery` (sesión Backend) salió de `38faa37`,
antes del merge del PR #94, y registró su propio **#55 `auth-email-delivery`**
y **#56 `auth-reset-deep-link`**. En `main` esos ids ya son
`mobile-map-zoom-controls` y `mobile-map-last-position-error-state`. Esa branch
tiene 56 features; `main` tiene 57.

Lo barato es renumerar la de auth (**#55 → #58**, **#56 → #59**), porque la
otra mitad ya está en `main`: son las dos entradas de su `feature_list.json`
más 7 menciones de texto (4 en `design.md`, 3 en `requirements.md`);
`tasks.md` y `traceability.md` no citan el número, y el directorio de la spec
va por nombre. Lo hace **la sesión que lleva esa branch**, y rebasa sobre
`main` después.

Causa de fondo, que va a repetirse: dos sesiones asignando ids contra el mismo
`feature_list.json` en ramas paralelas chocan siempre. O registra features una
sola sesión, o cada una reserva un rango.

### Deuda del arnés detectada en la revisión de #44

Dos violaciones de orden cometidas por el implementador, ambas de proceso y
ninguna de código (H1 y H2 de `progress/review_auth-forgot-password.md`):

1. Codex marcó `#44` como `done` en `feature_list.json` sin veredicto de
   reviewer. Efecto colateral verificado: `./init.sh` pasó a reportar "sesión
   limpia" **por ese cierre prematuro**, así que el gate se validó a sí mismo.
2. Codex editó `specs/auth-forgot-password/requirements.md` ya aprobada. El
   cambio resultó legítimo (una línea, verificada ítem por ítem por el
   reviewer), pero que la corrección fuera correcta no valida el mecanismo.

Ambas prohibiciones quedan ya escritas como condición de aceptación en el
handoff de #54.

### Feature #56 `mobile-map-last-position-error-state` — pending, P2

`map.tsx` no tiene rama para `last.data.kind === 'error'` ni `'unauthorized'`:
un 500 de `GET /pets/:id/positions/last` con mascotas cargadas deja la pantalla
vacía, sin mensaje ni reintento. Preexistente, invisible hasta el fix del
ancestro opaco. Detectado por el `reviewer` (observación 1 del review del fix 1),
no por un reporte de usuario.

### Feature #57 `localstack-presigned-url-lan-host` — pending, P2

Las URLs prefirmadas de S3 salen con host `localhost`, así que las fotos de
mascota no cargan en teléfono físico
(`ConnectException: Failed to connect to localhost/127.0.0.1:4566` en logcat
durante el smoke de #54). La firma SigV4 cubre el header `Host`, así que hay
que firmar ya con un host de la LAN, no reescribirlo después.

### Flake nuevo sin registrar — `health-vaccines` e2e

`backend-pet-tracker/test/health-vaccines.e2e-spec.ts` → `R12: auditoria de
mutaciones` (línea 470) falló una vez a Codex y pasó al repetir: Postgres
devolvió las tres acciones de auditoría en otro orden. Es una aserción que
depende del orden de un `SELECT` sin `ORDER BY` determinista. **No** es el
flake de `add-pet` (#53). Anotado por el reviewer de #55 (observación 3),
pendiente de decidir si se registra como feature propia.

### Feature #53 `mobile-jest-mock-hygiene` — pending, P3

Flake de `add-pet` por mocks sin reinicializar. Sin trabajo en curso.

### Verificación manual pendiente (no bloqueante)

- **R9 paso 5 de #45**: usuario `family` viendo el botón Lost Mode
  deshabilitado. No ejecutado por no haber uno seedeado en local; la spec lo
  redacta condicional y R7 lo cubre en `map.test.tsx`. Anotado en
  `progress/impl_pet-lost-mode.md`.

### Backlog anotado, sin feature propia

- R-ids duplicados dentro de `auth.controller.spec.ts` (`R1`, `R2`, `R3`, `R5`
  aparecen dos veces: serie de `auth-registration` y serie de
  `auth-forgot-password`). No imputable al implementador — los nombres venían
  fijados en la spec aprobada. `auth-login-me` ya resolvió el mismo choque con
  el sufijo `(<feature>)`; conviene que `spec_author` lo aplique siempre que un
  R-id aterrice en un fichero de test compartido. Detalle en H5 del review.

## Sesión 2026-09-01 (leader) — #57 spec

### Feature #57 `localstack-presigned-url-lan-host` — spec_ready

- `./init.sh` verde al arrancar (51/57 done). Sin sesión abierta en esta rama.
- Branch `feature/57-localstack-presigned-url-lan-host` creada desde
  `origin/main` (e8c5511). `main` protegida: aprobación en branch, como #55.
- Spec escrita por `spec_author` en `specs/localstack-presigned-url-lan-host/`
  (R1–R6, frontmatter `draft`). `feature_list.json` id 57: `pending` →
  `spec_ready`.
- Diseño clave: variable nueva `AWS_PRESIGN_ENDPOINT_URL` (solo modo local,
  solo `S3Client`; campo opcional `presignEndpoint` en `AwsRuntimeConfig`).
  SigV4 firma el header `Host` ⇒ se firma ya con host LAN, nunca se reescribe.
  Modo `aws` intacto (`assertNoEndpoint`, R3). R4 en archivo de test propio
  (el spec compartido del adaptador mockea el presigner; R4 necesita el real).
- **Gate humano pendiente**: firmar casilla §Aprobación de `requirements.md`
  con commit propio en esta branch. R6 = smoke en dispositivo físico
  (foto carga, sin ConnectException), no delegable a IA.

### #57 — aprobación recogida y handoff (2026-09-01)

- feature: localstack-presigned-url-lan-host — `in_progress`
- inicio: 2026-09-01 (tras aprobación humana `fe38957`)
- Frontmatter de los 4 ficheros de la spec pasado a `approved` por el leader
  (séptima vez que la casilla se firma con los ficheros en `draft`).
- plan: Codex CLI implementa R1–R5 con TDD (2 commits de test rojos → 1 commit
  de producción en `aws-clients.ts` → docs). Handoff en
  `progress/handoff_localstack-presigned-url-lan-host.md`. Codex commitea sin
  push; leader pushea tras veredicto del reviewer. R6 = smoke humano en
  dispositivo físico, cierra la feature.

### #57 — implementación y review (2026-09-01)

- Codex CLI implementó R1–R5 con TDD: rojos `f3fa40a` (R1-R3) y `2e2dca0`
  (R4) antes del verde `9f100a0` (producción, solo `aws-clients.ts`), docs en
  `b2cff5b`, evidencia en `364fbf9`.
- `reviewer` **APROBADO** → `progress/review_localstack-presigned-url-lan-host.md`.
  Re-ejecutó `./init.sh` (exit 0), reprodujo el rojo en worktree y validó por
  mutación que los tests muerden (quitó el override y se pusieron rojos).
- **Pendiente para `done`**: gate humano R6 — smoke en dispositivo físico
  (runbook en `docs/verification.md` §Feature 57) + segunda casilla de
  §Aprobación en requirements.md.

### #57 — cierre (2026-09-01)

- **Gate humano R6 aprobado** (`9fbdc73`): foto carga en dispositivo físico
  vía host LAN, sin ConnectException; segunda casilla de §Aprobación firmada.
- Merge de `origin/main` (PR #95, #55 done) en la branch; conflicto en
  `docs/verification.md` resuelto conservando las secciones Feature 55 y 57.
- **Estado final:** `done` (52/57). PR **#96** abierto, pendiente de
  merge por el humano: https://github.com/TrackerMex/Pet-Tracker/pull/96


## Sesión 2026-09-01 (leader) — #56 spec

### Feature #56 `mobile-map-last-position-error-state` — spec_ready

- Branch `feature/56-mobile-map-last-position-error-state` desde `origin/main`
  (`c083e3f`, ya incluye el merge del PR #96 de #57).
- Spec de `spec_author` en `specs/mobile-map-last-position-error-state/`
  (R1–R5, frontmatter `draft`). `feature_list.json` 56 → `spec_ready`.
- Decisiones cerradas: R2 `unauthorized` de last comparte la rama de error
  (el enrutado a login ya lo hace `use-api.ts:29` + `Redirect` de
  `(tabs)/_layout.tsx`); R3 switch exhaustivo — un kind nuevo rompe
  `typecheck`; R4 amplía a `unauthorized` de pets (mismo defecto, misma
  pantalla, justificado en design.md); R5 allowlist de contención.
- Sin smoke humano obligatorio (cambio solo-JS); chequeo manual opcional en
  dev build de Android con Fast Refresh.
- **Gate humano pendiente**: casilla §Aprobación de requirements.md con
  commit propio en esta branch.

### #56 — aprobación recogida y handoff (2026-09-02)

- feature: mobile-map-last-position-error-state — `in_progress`
- inicio: 2026-09-02 (tras aprobación humana `7b0c5e5`)
- Frontmatter de los 4 ficheros pasado a `approved` por el leader (octava vez
  que la casilla se firma con los ficheros en `draft`).
- plan: Codex CLI implementa R1–R5 con TDD (1 commit de tests rojos → 1 de
  producción en `map.tsx` → trazabilidad). Handoff en
  `progress/handoff_mobile-map-last-position-error-state.md`. Sin push de
  Codex; leader pushea tras el veredicto del reviewer. Sin smoke humano
  obligatorio (solo-JS).

### #56 — corrección del handoff (2026-09-02)

- Codex paró antes del TDD (correcto): el comando de test de la spec sale
  `No tests found` — Jest interpreta `(tabs)` como grupo regex. Noveno caso a
  favor de que `spec_author` verifique comandos ejecutándolos.
- Leader verificó la forma escapada (`'src/app/\(tabs\)/...'` → 32 verdes) y
  la autorizó por escrito en el handoff. Spec aprobada intacta (precedente
  #55: el handoff corrige, la spec no se reabre).

### #56 — implementación y review (2026-09-02)

- Codex CLI implementó R1–R5 con TDD: rojo `83a1602` (8 fallos nuevos, 32
  previos verdes, cero producción) → verde `dbde188` (solo `map.tsx`, D3–D5)
  → trazabilidad `1a44a53`.
- `reviewer` **APROBADO** → `progress/review_mobile-map-last-position-error-state.md`.
  Rojo reproducido en worktree, 40/40 + typecheck + lint + `./init.sh`
  re-ejecutados, allowlist exacta, tres mutaciones mordieron (unauthorized,
  `petsReady`, kind ficticio → TS2366).
- Sin gate humano obligatorio (solo-JS): con el veredicto, #56 pasa a `done`.

### #56 — cierre (2026-09-02)

- **Estado final:** `done` (53/57). Sin smoke humano obligatorio; chequeo
  manual opcional documentado en la spec (dev build de Android, Fast Refresh).
- PR abierto tras el veredicto; el humano mergea.


## Sesión 2026-09-02 (leader) — #58 auth-email-delivery

### #58 — aprobación recogida y handoff

- feature: auth-email-delivery — `in_progress` (renumerada de #55 el
  2026-09-02; branch renombrada a `feature/58-auth-email-delivery`)
- Spec aprobada por el humano (`0bb05f6`), DA1 (subdominio emisor) y DA2
  (plan Free de Resend) cerradas. Frontmatter de los 4 ficheros pasado a
  `approved` por el leader (novena vez que la casilla se firma en `draft`).
- plan: Codex CLI implementa R1–R12 con TDD por requisito (rojo por R-id
  antes de su verde, patrón #44). Handoff en
  `progress/handoff_auth-email-delivery.md`. Sin red real en tests; gates
  G1–G4 (Resend, DNS, envío real) los ejecuta el humano DESPUÉS de la
  implementación y ANTES del reviewer — el reviewer no aprueba sin G1–G4
  por escrito en progress/.

### #58 — bloqueo R6 y corrección autorizada (2026-09-02)

- Codex completó R1–R5 y R7 (TDD por requisito, rojo→verde por R-id) y paró
  en R6: contradicción interna de la spec (doble de DI vs contención en el
  adaptador de D5). Análisis en `progress/impl_auth-email-delivery.md`.
- Leader autorizó por escrito en el handoff el mecanismo coherente: doble de
  `fetch` dentro de `ResendClient`, adaptador real, application intacta.
  Spec aprobada sin editar (precedente #56).
- Aprendizaje repetido: Codex esta vez trabaja en su PROPIO clon — el
  "no pushees" del handoff dejó al leader ciego hasta que el humano pusheó.
  Próximo handoff: pedir push explícito al terminar cada tramo.

### #58 — review y cierre (2026-09-02)

- Codex completó R6 (mecanismo autorizado) y R8–R12 en su clon; push
  autorizado por el humano al origin verificado. Escaneo de secretos limpio.
- Gates G1–G4 confirmados por el humano (`d7931d5`).
- `reviewer` **APROBADO** → `progress/review_auth-email-delivery.md`: rojos
  R5/R8 reproducidos en worktree, mutaciones R6/R7/R8/R9 mordieron, cero
  secretos, contención limpia (única excepción autorizada:
  `env-drift.test.mjs` 21→23).
- Incidente durante el review: algo externo hizo `git checkout main` a mitad
  de su primer `./init.sh`; el reviewer restauró la branch y reejecutó todo
  en verde. Regla de un-solo-escritor: mientras un reviewer corre, nadie toca
  el working tree del VPS.
- Filas G1–G4 de `traceability.md` pasadas a confirmado (`d7931d5`).
- Estado final: `done` (54/59). PR pendiente de crear/mergear.

### #59 — gates G1–G4 y cierre (2026-09-03)

- G1: el humano obtuvo el fingerprint y lo commiteó (`1b0aed1`). Docs G1
  corregidos: keystore del dev build es `mobile-pet-tracker/android/app/debug.keystore`,
  no `~/.android/`; `-J-Duser.language=en` obligatorio con locale español.
- Desvío: `hosting/` se subió a `public_html/pet/` (el docroot aloja otro
  sitio) y el humano antepuso `/pet` en `password-reset-link.ts`. R1 en rojo,
  `pathPrefix` sin match y `assetlinks.json` fuera de `/.well-known/` raíz:
  el smoke pasó por el botón `mobilepettracker://`, no por App Link.
  Revertido en `f18b4a7`; el código queda idéntico al aprobado en `fb9db23`.
- G2 verificado desde el VPS: 200 `application/json` en la raíz, fallback
  301→200, statement válido en `digitalassetlinks.googleapis.com`.
- G3–G4 repetidos por el humano con los ficheros en la raíz: App Link
  verificado, abre directo en la app.
- Estado final: `done` (55/59). PR pendiente de merge.

### #53 — mobile-jest-mock-hygiene (2026-09-03)

- `spec_author` documentó por qué no activar `clearMocks`/`resetMocks`/
  `restoreMocks` en la config móvil (`resetMocks` vacía las implementaciones
  de `jest.fn(impl)` de 11 suites) y fijó un `beforeEach` de archivo en
  `add-pet/index.test.tsx`. Humano aprobó en `acafd69`.
- Codex CLI: R1 rojo `79caf8c` → verde `43183c4`; R2 10/10 corridas; R3
  `init.sh` exit 0 con config jest intacta. `reviewer` **APROBADO**
  (`progress/review_mobile-jest-mock-hygiene.md`).
- Alta de #60 `mobile-ios-support` (pending) en la misma branch.
- Incidente: otra sesión de Claude commiteó sobre esta branch en el tree
  principal del VPS y la renombró a `feature/61-mobile-ui-legibility-polish`;
  el leader migró a un worktree (`Pet-Tracker-wt-53`). Regla: un worktree
  por sesión activa.
- Estado final: `done` (56/60). PR pendiente de crear/mergear.

---

## Sesion: pulido de UI movil (2026-09-03)

**Rama:** `feature/61-mobile-ui-legibility-polish` (creada desde `origin/main` en `0a5773e`, sin upstream todavia).

**Origen:** el humano pidio pulir la UI siguiendo el diseno de Figma, con la
skill `appllama-app-design-skill`. El diseno NO se saco del MCP de Figma: el
export del Figma Make ya esta versionado en `specs/mobile-figma-polish/design-src/`
desde #46, y esa es la fuente de verdad que se uso.

### Hecho

1. Auditoria read-only de las 16 pantallas implementadas (subagente `explorer`)
   contra `design-src/App.tsx` y `docs/ui-guidelines.md`.
   Resultado en `progress/audit_ui_polish.md`: 26 hallazgos priorizados, cada
   uno con linea de implementacion y linea de diseno. Commit `e4e57a3`.
2. Registradas #61 y #62 en `feature_list.json`, el lote partido en dos por
   decision del humano. Commit `bf9b61a`.
3. Lanzado `spec_author` para la spec de #61.

### Verificado por el leader, no heredado del subagente

- Blanco sobre `#2AB87C` da **2,546:1** (AA pide 4,5:1 para texto normal).
  Recalculado con la formula de luminancia relativa sRGB.
- Regresion de **#46 R10** en Profile: `src/screens/profile/index.tsx:299`
  conserva el tratamiento aprobado, pero `:260` y `:307` usan
  `text-lg font-bold`. Dos estilos para el mismo rol en la misma pantalla.
- El grep-clean de #46 y #72 sigue intacto: cero hex fuera de `src/theme/`,
  cero clases arbitrarias, cero `StyleSheet.create`, cero sombras legacy.

### Decisiones del humano (2026-09-03) — no re-litigar

| Punto | Decision |
|---|---|
| Contraste del acento | El relleno sigue siendo `#2AB87C` exacto. Se anade un token de texto mas oscuro solo para etiquetas y links. Oscurecer `--accent` entero, descartado. |
| Tamano del lote | Dos features: #61 legibilidad y usabilidad real, #62 consistencia visual. |
| `--radius-card: 20px` (#72 R1) | No se reabre. El hallazgo 18 del audit se compara en el proximo smoke, al mismo tamano fisico. |
| Alcance | Solo estilo. Cero conducta, cero cambios de `testID` ni de texto visible. |

### Reparto de hallazgos

- **#61** `mobile-ui-legibility-polish` (P2): hallazgos 1, 2, 3, 4, 5, 6, 7, 13, 19, 21.
- **#62** `mobile-ui-consistency-polish` (P3): 8-12, 14-18, 20, 22-26.
- Fuera de ambas por exigir cambio de conducta: los 8 emoji de iconografia
  (bloqueados por tests que los afirman como texto), el idioma mezclado de la
  UI, la cabecera nativa de las pantallas de detalle, los errores inline por
  campo y el action sheet nativo del confirm destructivo. Listados al final de
  `progress/audit_ui_polish.md`.

### Reversion de la decision de contraste (misma tarde)

El humano leyo la spec en draft y eligio la via contraria a la primera:
**se oscurece `--accent` y la etiqueta se queda blanca**, en vez de conservar
`#2AB87C` y oscurecer la etiqueta. `--accent-contrast` quedo descartado.
La spec se rehizo entera con esa decision.

Valores finales, recalculados por el leader con la formula sRGB:

| Token | Light | Dark | Ratio |
|---|---|---|---|
| `--accent` (relleno) | `#178255` | `#178255` | 4,816:1 con blanco |
| `--accent-foreground` | `#FFFFFF` | `#FFFFFF` | sin tocar |
| `--accent-strong` (tinta) | `#107148` | `#2AB87C` | el verde original vuelve en dark |

El relleno NO se parte por tema; lo que se parte es la tinta, porque sobre
`#161B22` el relleno daria 3,240:1. `--success` no se toca: la distancia
DeltaE00 pasa de 9,16 a 9,24 y nunca comparten rol. Hue conservado: 154,77
grados contra los 154,65 del `#2AB87C` del Figma.

**Desviacion declarada de #46 R1**: los rellenos de la app dejan de coincidir
1:1 con el Make. Va escrita en la spec y propuesta para `docs/ui-guidelines.md`.

AC1 y AC10 de #61 se reescribieron: su redaccion anterior exigia justo lo
contrario, que ningun relleno cambiara de color.

### Gate humano: cerrado

Firmado en `cdc8b82` ("Approve mobile UI legibility polish spec"). La firma
cayo sobre el texto **previo** a la reversion, pero el humano habia pedido esa
via por chat antes de firmar; el frontmatter esta en `approved` (`29f94aa`).
Tres cosas quedaron fijadas despues de su firma y se le reportaron: el hex
`#178255`, la tinta partida por tema, y que ahora hay **10 literales de color
en 9 lineas** de `global-css.test.ts` que tocar (antes eran 2).

### Drift de rama, resuelto

La sesion `Backend` commiteo la aprobacion de #53 (`5ced66b`) sobre esta rama
en vez de la suya: el working tree es uno solo y el HEAD estaba aqui. Lo
rehizo como `041d5b8` desde un worktree propio y #53 ya esta mergeada en main
(PR #100, `f84c926`). Rebase sobre `origin/main` con `--skip` del commit
huerfano: la rama quedo limpia, solo con los 9 commits de #61.

Acuerdo con esa sesion: ella trabaja **solo en worktrees**
(`/home/claude/sites/Pet-Tracker-wt-42` para #42), `/home/claude/sites/Pet-Tracker`
es de esta sesion mientras duren #61 y #62. Codex NO corre en el VPS: corre en
la terminal Windows del humano contra su clon.

**Aviso de secuenciacion**: #42 `mobile-device-pairing` va a tocar
`src/screens/profile/` y #61 tambien (R9, la regresion de #46 R10). Los merges
hay que ordenarlos.

### Implementador: fallback al subagente `implementer` (decision del humano)

`CLAUDE.md` §Implementacion pone a Codex CLI como implementador por defecto y
solo permite el subagente `implementer` como fallback, declarandolo aqui. El
humano lo pidio explicitamente el 2026-09-03: *"todo lo que vamos a trabajar
con el frontend lo hace Claude"*. El handoff a Codex queda escrito en
`progress/handoff_mobile-ui-legibility-polish.md` por si se retoma esa via.

Coste asumido y advertido al humano: el motivo de usar Codex es que **quien
implementa no revisa**. Con `implementer` y `reviewer` siendo los dos Claude,
la review pierde independencia. El humano decidio seguir igualmente. El gate
de smoke en dispositivo real sigue siendo suyo y no cambia.

### Implementacion y review: cerradas

`implementer` escribio R1-R12 test-primero. El `reviewer` **rechazo la primera
vuelta** con tres bloqueos y **aprobo la segunda**, supeditado a la firma
humana. Veredicto en `progress/review_mobile-ui-legibility-polish.md`.

Los tres bloqueos y como cerraron:

- **B1 — R11 sin test que lo defendiera.** El reviewer aplano el overlay del
  mapa de 2x2 a una fila y los 45 tests de `map.test.tsx` siguieron verdes: el
  test solo miraba `numberOfLines`, no la estructura. `292b20d` anadio el
  assert que si discrimina; el reviewer rehizo la mutacion y ahora se pone
  rojo. Cerrado.
- **B2 — C6, la firma de la spec.** La aprobacion humana (`cdc8b82`) cayo sobre
  el texto ANTERIOR a la reversion de la decision de color; el leader volvio a
  poner `approved` por su cuenta despues de rehacer la spec. Hallazgo legitimo:
  en el repo no queda commit humano sobre el texto vigente. **Sigue abierto**,
  es del humano.
- **B3 — flaky en `add-pet`.** El reporte lo declaraba preexistente con n=1 y
  el reviewer no lo replico (1/9 en HEAD, 0/12 en main). Segunda vuelta: ambos
  lo reprodujeron en `origin/main` (3 fallos en 38 corridas sumadas) y se
  diagnostico la causa. **No es higiene de mocks, por eso #53 no lo curo**:
  `add-pet-photo` es un `Button` de heroui, no un `Pressable`, y su `onPress`
  no se despacha dentro del `fireEvent.press`, asi que el picker acaba
  llamandose dentro del test siguiente contra un mock reinicializado.
  Preexistente. Va como deuda a #62.

Verificado por el reviewer, no heredado: `./init.sh` exit 0 entero, 54 suites
y **692 tests** verdes (base 613/53), y los 12 `.test.tsx` preexistentes a `-0`
lineas. La unica excepcion al invariante son las 9 lineas de
`global-css.test.ts` que `design.md` §6 declara.

### PR abierto

https://github.com/TrackerMex/Pet-Tracker/pull/101 — 50 commits, 45 archivos.
El merge lo hace el humano.

### Siguiente paso: dos gates humanos, ninguno delegable

1. **Firmar la spec vigente** (B2 / C6): re-marcar §Aprobacion de
   `specs/mobile-ui-legibility-polish/requirements.md` y sus cuatro puntos, con
   commit propio en la rama.
2. **Smoke en dev build de Android** (AC10), lado a lado con el Figma, en tema
   claro Y oscuro. Guion de 9 puntos en `tasks.md` §Cierre. El acento se ve
   distinto al Make **a proposito** (DeltaE00 17,44); la tinta en dark no
   cambio ni un pixel, asi que si algo se ve distinto en oscuro que no sea un
   relleno, es un bug.

Hasta que los dos cierren, #61 NO se marca `done`. Luego queda #62
`mobile-ui-consistency-polish`, todavia `pending` y sin spec.

### Aviso de numeracion

`origin/main` ya traia un **#60 `mobile-ios-support`**, registrado hoy al
cerrar #59. Por eso este lote es #61/#62 y no #60/#61. Un
`git fetch && git show origin/main:feature_list.json` en un solo comando
devolvio 59; el valor bueno estaba en el `feature_list.json` del working tree
tras el checkout.

### Cierre (2026-09-04)

**Gate C6 (B2)**: firmado por el humano en `ecec663`, sobre el texto vigente.
El leader verifico que ese commit toca **solo** las 5 casillas de §Aprobacion,
cero lineas de codigo. La fecha quedo en `____`; el timestamp del commit es el
registro.

**Gate AC10 (smoke en dev build de Android)**: el humano confirmo los dos
puntos de riesgo que la spec marcaba —el acento oscuro con etiqueta blanca se
ve bien, y la tinta verde en dark no cambio—. No reporto punto por punto los
nueve del guion de `tasks.md` §Cierre; si reporto, en cambio, dos defectos que
encontro explorando, y ambos resultaron preexistentes.

**Veredicto del reviewer**: aprobado en segunda vuelta
(`progress/review_mobile-ui-legibility-polish.md`). Rechazo la primera por tres
bloqueos; los tres cerrados.

**#61 marcada `done`.** PR #101 abierto y pendiente de que lo mergee el humano;
ninguna IA mergea a `main`.

### Lo que destapo el smoke, registrado y no arreglado aqui

- **#63 `mobile-detail-screens-state-reset`** (nueva, P2): el formulario de
  add-reminder conserva el registro anterior. `add-reminder` es ruta de tab, asi
  que `router.back()` cambia de tab sin desmontar y los nueve `useState` de
  `src/screens/add-reminder/index.tsx:39-47` sobreviven. Preexistente: #61 solo
  anadio `hitSlop` a tres controles de esa pantalla.
- **#62 ampliado**: los `TextInput` crudos de `add-pet` y `add-reminder` no
  pasan `placeholderTextColor`, asi que React Native pinta el placeholder con su
  gris fijo y en tema oscuro queda casi negro sobre fondo oscuro. Migrarlos a
  `TextField` de heroui lo arregla de rebote.
- **Deuda del reviewer**: flaky preexistente en `add-pet`, 3 fallos en 38
  corridas, reproducido en `origin/main` por implementer y reviewer por
  separado. Causa: `add-pet-photo` es un `Button` de heroui, no un `Pressable`,
  y su `onPress` no se despacha dentro del `fireEvent.press`. No es higiene de
  mocks, por eso #53 no lo curo. Va a #62.

### #42 — mobile-device-pairing (2026-09-03 → 2026-09-04)

- `spec_author` copió los contratos reales de `devices`/`subscriptions` (D1);
  sin endpoint de subscriptions, tracked/free se deriva del 402 de
  `positions/last` (D2, deuda: endpoint propio); el Figma Make no tiene
  frame de pairing ni QR (D3, sin `expo-camera`). Humano aprobó en `6d32094`.
- Codex CLI: 27 commits, pares test→feat R1–R11 más fix de sondas duplicadas
  (R8) y guion D11 en `docs/verification.md`. Contención limpia.
- `reviewer` **APROBADO** (`progress/review_mobile-device-pairing.md`):
  `init.sh` móvil 56/… verde; no bloqueantes: aviso Node 22 del AWS SDK,
  `DeviceRow` sin separadores.
- G1 (humano, `f310352`): collar real en Wialon. Aprendizajes:
  `provision:device` lee `../.env` relativo a `backend-pet-tracker/` y exige
  `SIM_MODE=false` exacto + token real; el claim da 402 hasta
  `subscription:set --unit-id <id> --status active`.
- Coordinación con la sesión de #61 (tree principal): worktree
  `Pet-Tracker-wt-42`; único solape `src/screens/profile/index.tsx` en
  líneas distintas.
- Estado final: `done` (57/60). PR pendiente de crear/mergear.

### #62 — mobile-ui-consistency-polish (2026-09-04 → 2026-09-05)

- Segundo lote del pulido de `progress/audit_ui_polish.md`: hallazgos 8-12,
  14-17, 20 y 22-26. El 18 fuera por decisión humana; `global.css` sin tocar.
- `spec_author` corrigió al audit con evidencia: los glifos son 7 y no 5 (#42
  añadió `pairing` y un tercer `›`), los `TextInput` con placeholder 5 y no 8
  (tres eran `Pressable` pseudo-campo), los contadores 14 y no 13, los botones
  de acento 12 y no 9. El `leader` verificó esas cuentas antes del gate.
- El `leader` subió al checklist de firma una consecuencia que la spec dejaba
  enterrada: la segunda mitad de R12 quita el borde a los 6 campos crudos, que
  es cambio visible y no solo del placeholder. Humano firmó en `ade9a2f`.
- Codex CLI: 51 commits rojo→verde, uno por requisito. Ningún commit mezcla
  test con implementación.
- `reviewer` **APROBADO** (`progress/review_mobile-ui-consistency-polish.md`,
  sobre `8bc32ce`). Rehízo los 25 conteos por su cuenta, reconstruyó cinco
  ciclos con `git checkout` para comprobar que el rojo fallaba de verdad, y
  diffeó los `testID` entre main y HEAD: 269 → 271, ninguno eliminado ni
  renombrado, y los dos nuevos son los que `design.md` §6 autoriza.
- Dos correcciones del reviewer al implementer, ambas reales: Codex omitió
  `./init.sh` al cierre alegando que `BUILD_CMD` corría CDK, y `cdk synth` no
  crea recursos AWS — lo corrió el reviewer y salió verde; y la spec pedía
  literalmente `bun test`, que invoca el runner nativo de Bun y no la suite
  del proyecto (lo correcto es `bun run test`). Corregir esa redacción en la
  próxima spec móvil.
- Codex escribió su evidencia de R16 en `progress/review_<feature>.md`, que es
  el archivo del `reviewer`; el `leader` lo renombró a `gate_r16_<feature>.md`
  para que la revisión saliera independiente.
- AC8 (humano, `f2e752a`): smoke en dev build de Android, dos temas, las seis
  casillas firmadas. Drift verificado entre el veredicto y el cierre: cero
  cambios de código, solo `docs/`, `specs/` y `progress/`.
- Estado final: `done`. PR pendiente de mergear; ninguna IA mergea a main.

### #64 — mobile-pastel-category-palette (2026-09-05 → 2026-09-06)

- Primera del Bloque 0 del rediseño contra el diseño del Make. Diez tokens
  pastel categóricos en los dos temas; el oscuro se diseñó, no se copió.
- **Codex paró a mitad, en el commit rojo de R4, y tenía razón**: la tabla
  CIEDE2000 de `design.md` §3.3 daba 16,1 donde el valor real era 17,1. Al
  recalcular la tabla entera aparecieron **dos** celdas mal, no una: `blue`
  oscuro (mal el número **y** el par: 16,7 contra `danger-soft`) y `neutral`
  oscuro (10,6). Enmienda firmada por el humano en `56b201f`.
- **El `reviewer` rechazó por C4**: los rojos de R4 y R9 fallaban por un
  `ReferenceError` del helper de test, no por su aserción, y sus verdes no
  añadían una línea de producción. El `leader` encontró que **R3 tenía el mismo
  defecto** y no salía en el reporte porque el handoff solo señalaba dos.
- **Causa raíz: de secuencia, y defecto de la spec.** R3, R4 y R9 son
  requisitos de *verificación* sobre artefactos que R1/R2 y R7/R8 ya habían
  dejado en el árbol: en ese orden su aserción no puede estar roja. Rebase
  descartado (la branch lleva dentro los commits de firma humana).
- Se resolvió preguntando lo que C4 protege de verdad —¿el candado está
  vivo?— con **prueba de mutación**: los tres vivos, y R9 falla nombrando el
  archivo como exige su cláusula EARS. Excepción firmada en `2ffc8fb`.
- **Regla general escrita en `CHECKPOINTS.md` §C4** para no repetirlo: un
  requisito de verificación o se escribe antes de lo que verifica, o se declara
  como tal y se prueba por mutación; y ningún commit rojo vale si falla por un
  `ReferenceError`.
- Dos errores del `leader`, anotados para no repetirlos: (1) cambió de rama en
  el worktree mientras Codex implementaba, rompiendo la regla de un solo
  escritor que él mismo había impuesto — Codex lo detectó por reflog y se
  recuperó; (2) al corregir el desliz de `design.md` §3.1 aplicó la corrección
  a la fila correcta y dejó mal la otra, dejando las dos mal durante un commit.
- El `reviewer` le encontró al `leader` dos defectos de forma en el texto de
  `CHECKPOINTS.md` (prosa colgando de una casilla) y una referencia colgada a
  `design.md` §10, que no existe en esta spec. Corregidos.
- **Gate humano AC (`bd1c488`)**: smoke en dev build de Android, dos temas,
  Reminders y Documentos. Lo bloqueó de paso un fallo de entorno ajeno a la
  feature: `relation "pet_documents" does not exist` en la máquina Windows del
  humano, por **dos Postgres escuchando en el 5432** — el nativo y el del
  contenedor —, así que `drizzle-kit migrate` aplicaba en uno y la app leía del
  otro. No hubo cambio de código: la migración `0014` estaba en el repo desde
  #49.
- **Deuda registrada**: el test de selección de foto de `add-pet` es flaky
  (preexistente); mordió una pasada de `./init.sh` durante el cierre. Queda
  como feature propia.
- Estado final: `done`. PR pendiente de mergear; ninguna IA mergea a main.

### Fix de deriva de migraciones + script `db:migrate` (2026-09-05, humano)

**Disparador**: `GET` de documentos de mascota fallaba en local con
`error: relation "pet_documents" does not exist` (Postgres 42P01) desde
`PetDocumentDrizzleRepository.listByPet`.

**Diagnostico**: no era un bug de codigo. La BD local iba tres migraciones por
detras del repo. `drizzle.__drizzle_migrations` tenia 13 filas (hasta 0012) y
faltaban:

- `0013_wet_may_parker` — sus tablas (`nutrition_plans`, `nutrition_profiles`)
  **si existian** en la BD, pero sin fila en el journal. Esa inconsistencia era
  la causa de fondo: cualquiera que corriese `migrate` reventaba con
  "relation already exists" en 0013 y abandonaba, dejando 0014 y 0015 sin
  aplicar indefinidamente.
- `0014_late_lord_tyger` — `pet_documents` (la del error).
- `0015_auth_password_reset_tokens` — `password_reset_tokens`.

**Acciones sobre la BD local** (no destructivas, solo `CREATE TABLE`):

1. Baseline de 0013: `INSERT` de su fila en `drizzle.__drizzle_migrations`
   (hash `6b0f0ff6...`, `created_at` 1787066723656) tras verificar columna a
   columna que las dos tablas de nutricion en la BD coinciden con el `.sql`.
2. `DATABASE_URL=... pnpm exec drizzle-kit migrate` → aplico 0014 y 0015.
3. Verificado: `pet_documents` existe con PK, `pet_documents_pet_id_idx` y las
   dos FKs (`pet_id` → `pets` ON DELETE CASCADE, `created_by` → `users`).
   16/16 migraciones registradas.

**Cambio en el repo**: `backend-pet-tracker/package.json` gana una linea:

```json
"db:migrate": "drizzle-kit migrate",
```

No existia script para aplicar migraciones — solo `db:generate` — y se aplicaban
a mano (`specs/device-subscriptions/design.md:28` ya lo documentaba como deuda).
Esa ausencia es lo que dejaba la BD derivar.

**Excepcion de rol usada**: el cambio lo hizo el subagente `implementer`, no
Codex CLI, acogiendose a `CLAUDE.md` §Excepciones (fallback para cambios
triviales de una linea). Sin spec y sin TDD: es una entrada en `scripts`, no
logica de aplicacion. Reporte en `progress/impl_db-migrate-script.md`.

**Pendiente / decisiones abiertas**:

- **Sin commitear**. El working tree esta en `feature/64-mobile-pastel-category-palette`,
  que no tiene nada que ver con esto. El cambio deberia ir en su propia branch.
- `drizzle.config.ts` no carga `dotenv`, asi que `pnpm run db:migrate` a secas
  falla con una conexion vacia poco obvia: hay que pasar `DATABASE_URL` en el
  entorno. Anadir `dotenv/config` apuntando a `../.env` seria su propia tarea,
  no colada aqui.
- Los hashes en `drizzle.__drizzle_migrations` de 0003-0008 y 0012 **no**
  coinciden con los `.sql` actuales (CRLF o edicion post-aplicacion). No rompe
  nada — el migrator compara por timestamp, no por hash — pero significa que
  esos archivos cambiaron despues de aplicarse. Sin investigar.

- Cerrado por el humano en `2eb4934` (PR #107). El `leader` habia diagnosticado
  mal la causa —apunto a dos Postgres en el 5432— y la evidencia real del
  journal de `drizzle` la encontro el humano.
- Queda abierto: `drizzle.config.ts` no carga el `.env`, asi que `pnpm db:migrate`
  sigue necesitando exportar `DATABASE_URL` a mano. Pasado a la sesion Backend.

## 2026-09-06 — #65 `mobile-ui-language` (cerrada)

La app movil pasa a **espanol por defecto** con catalogo bilingue de 259 claves
e interruptor en Perfil. 20 requisitos, 325 sitios de copy resueltos por clave,
cero dependencias nuevas, cero cambios de layout. El ingles no desaparece: sigue
siendo la columna `en` del catalogo, y las 9 specs que lo ratificaron llevan su
enmienda firmada por el humano.

**Implementacion repartida.** Codex CLI hizo R1-R16 y el rojo de R17 y agoto su
cuota (vuelve el martes). El subagente `implementer` cerro R17-R20 bajo
`CLAUDE.md` §Excepciones, con el coste declarado: `implementer` y `reviewer`
salen del mismo modelo, asi que en ese tramo se pierde "quien implementa no
revisa" en su version fuerte. Lo que quedo en pie: el `reviewer` corrio
`init.sh` el mismo y reconstruyo los 20 ciclos rojo-verde desde git.

**Tres enmiendas, las tres por parar antes de escribir codigo:**

1. **R18 requisito de verificacion** (firma `5f59a58`). En el orden aprobado
   nacia verde por construccion: solo comprueba propiedades que R1-R11 ya
   dejaron en el arbol. Se eligio la via C4(b) —prueba por mutacion— y no la de
   adelantar el candado, porque eso lo habria dejado rojo a proposito durante
   ~30 commits, destruyendo la senal de "cada commit deja la suite verde".
2. **Recuento de R17, 244 a 265** (firma `2283806`). La cifra estaba **caduca,
   no equivocada**: correcta contra `a44925f`, pero #64 mergeo (+12) y los tests
   obligatorios de la propia spec anadieron 9. El invariante pasa a ser el
   **delta -2** entre el padre y el verde de R17.
3. **Copy sin clave que el inventario no vio** (firma `cb0b53b`). Causa raiz: el
   inventario barrio **literales ingleses por traducir**, asi que toda copy que
   se escribe igual en los dos idiomas era invisible. Cuatro claves nuevas
   (`addPet.no`, `addPet.microchip`, `pairing.esn`, `map.gps`). La misma
   enmienda cambio el candado de **constante congelada a consistencia interna**,
   por ser la tercera vez en dos features que un numero escrito a mano paraba el
   trabajo.

**El rechazo del `reviewer`, que fue lo mejor de la feature.** El escaner de
R18(b) tenia **regiones ciegas en 11 de las 19 pantallas**: una plantilla con
`${...}` no casaba porque la clase de caracteres excluia `$`, el motor tomaba la
comilla invertida de cierre como de apertura y se tragaba hasta **6326 bytes
seguidos**. Lo demostro plantando `'Resumen de hoy'` en `home.tsx:59`: la suite
se quedo **verde**. El arreglo movio el escaneo al **AST de TypeScript**
(`typescript` ya era devDependency) y destapo **364 literales** que nunca se
habian mirado — ninguno con copy suelta. La migracion estaba bien; el candado no.

Leccion: la prueba de mutacion original era **autentica y a la vez inutil**,
porque se planto en un sitio comodo (`login.tsx:68`, zona visible). Una mutacion
que pasa demuestra que el candado funciona **en ese punto**, no en el fichero.

**Un defecto de diseno propio, al final.** R19 se escribio como «THE SYSTEM
SHALL dejar la casilla sin marcar», que obliga a lo que **entrega la
implementacion**; el test lo midio como invariante permanente, asi que la firma
del humano ponia la suite en rojo. R19 exigia 9 casillas firmables y prohibia
que se firmaran. Se arreglo el test —comprueba que la linea de firma existe,
marcada o no— sin tocar la spec; el `reviewer` audito ese juicio y lo confirmo.
El guardian contra la auto-aprobacion nunca fue ese test: es que el `leader`
verifica autoria y ficheros de cada commit de firma, que es lo que destapo el
`f90facb` (un commit de agente que replico una firma humana en vez de hacer
`pull`).

**Gates humanos**: humo en dev build de Android (`7167ac9`) y las 9 enmiendas
(`00151e6` + `2ffc5ee`). Al firmar, el humano marco por error el `Smoke
ejecutado por el humano` de `mobile-auth` (gate de #33) en vez de la enmienda;
lo corrigio y decidio dejar tambien esa casilla marcada por haber corrido esa
prueba.

**Deuda anotada, no bloqueante**: `canonicalAmendment()` no comprueba que
`indexOf(SIGNATURE_LINE)` encuentre algo, asi que si §6.2 perdiera su linea de
firma el `slice` truncaria en silencio; y `language-provider.test.tsx:40` sigue
con un `259` escrito a mano. Ambas, una linea en la proxima feature que toque
esos ficheros.

PR #110. Informes: `progress/impl_mobile-ui-language.md`,
`progress/review_mobile-ui-language.md`.

## Sesion backend 2026-09-05/06 (leader) — migraciones, dotenv de drizzle y #66 pets-list-response-enrichment

## 2026-09-05 — Fix de deriva de migraciones + script `db:migrate`

**Disparador**: `GET` de documentos de mascota fallaba en local con
`error: relation "pet_documents" does not exist` (Postgres 42P01) desde
`PetDocumentDrizzleRepository.listByPet`.

**Diagnostico**: no era un bug de codigo. La BD local iba tres migraciones por
detras del repo. `drizzle.__drizzle_migrations` tenia 13 filas (hasta 0012) y
faltaban:

- `0013_wet_may_parker` — sus tablas (`nutrition_plans`, `nutrition_profiles`)
  **si existian** en la BD, pero sin fila en el journal. Esa inconsistencia era
  la causa de fondo: cualquiera que corriese `migrate` reventaba con
  "relation already exists" en 0013 y abandonaba, dejando 0014 y 0015 sin
  aplicar indefinidamente.
- `0014_late_lord_tyger` — `pet_documents` (la del error).
- `0015_auth_password_reset_tokens` — `password_reset_tokens`.

**Acciones sobre la BD local** (no destructivas, solo `CREATE TABLE`):

1. Baseline de 0013: `INSERT` de su fila en `drizzle.__drizzle_migrations`
   (hash `6b0f0ff6...`, `created_at` 1787066723656) tras verificar columna a
   columna que las dos tablas de nutricion en la BD coinciden con el `.sql`.
2. `DATABASE_URL=... pnpm exec drizzle-kit migrate` → aplico 0014 y 0015.
3. Verificado: `pet_documents` existe con PK, `pet_documents_pet_id_idx` y las
   dos FKs (`pet_id` → `pets` ON DELETE CASCADE, `created_by` → `users`).
   16/16 migraciones registradas.

**Cambio en el repo**: `backend-pet-tracker/package.json` gana una linea:

```json
"db:migrate": "drizzle-kit migrate",
```

No existia script para aplicar migraciones — solo `db:generate` — y se aplicaban
a mano (`specs/device-subscriptions/design.md:28` ya lo documentaba como deuda).
Esa ausencia es lo que dejaba la BD derivar.

**Excepcion de rol usada**: el cambio lo hizo el subagente `implementer`, no
Codex CLI, acogiendose a `CLAUDE.md` §Excepciones (fallback para cambios
triviales de una linea). Sin spec y sin TDD: es una entrada en `scripts`, no
logica de aplicacion. Reporte en `progress/impl_db-migrate-script.md`.

**Pendiente / decisiones abiertas**:

- **Sin commitear**. El working tree esta en `feature/64-mobile-pastel-category-palette`,
  que no tiene nada que ver con esto. El cambio deberia ir en su propia branch.
- `drizzle.config.ts` no carga `dotenv`, asi que `pnpm run db:migrate` a secas
  falla con una conexion vacia poco obvia: hay que pasar `DATABASE_URL` en el
  entorno. Anadir `dotenv/config` apuntando a `../.env` seria su propia tarea,
  no colada aqui.
- Los hashes en `drizzle.__drizzle_migrations` de 0003-0008 y 0012 **no**
  coinciden con los `.sql` actuales (CRLF o edicion post-aplicacion). No rompe
  nada — el migrator compara por timestamp, no por hash — pero significa que
  esos archivos cambiaron despues de aplicarse. Sin investigar.

## Backend: fix `drizzle.config.ts` no carga `.env` (sesion backend, 2026-09-06)

- **Origen**: el humano lo pidio via la sesion Frontend tras perder una tarde con `relation "pet_documents" does not exist` (detalle en `progress/impl_db-migrate-script.md`). `pnpm db:migrate` (PR #107) falla en maquina limpia porque drizzle-kit no carga `.env`.
- **Decision**: fix suelto sin id de feature, branch `fix/drizzle-config-dotenv` desde `origin/main`. Fallback al subagente `implementer` (CLAUDE.md §Excepciones, cambio trivial: cargar dotenv del `.env` raiz como `provision-local.ts`, abortar si `DATABASE_URL` falta, un spec y un parrafo en `docs/conventions.md`). Reporte en `progress/impl_drizzle-config-dotenv.md`; `reviewer` antes del PR.
- **Cerrado**: PR #109 mergeado el 2026-09-06.

## Backend: #66 `pets-list-response-enrichment` (sesion backend, desde 2026-09-05)

- **Reparto**: la sesion Frontend lleva todo `mobile-pet-tracker/`; esta sesion lleva `backend-pet-tracker/`. #66 la pidio Frontend por mensaje entre sesiones el 2026-09-05 porque bloquea el Bloque 1.
- **Branch**: `feature/66-pets-list-response-enrichment` (nacio de `chore/design-gap-backlog`, ya en `main`; sincronizada con `main` el 2026-09-06).
- **Spec aprobada**: el humano firmo con `36d89f7` (fecha 2026-09-05) y confirmo OD-1 firmar siempre, OD-2 TTL 3600 s compartido, OD-3 `device` fuera, OD-4 leida. Frontmatter a `approved`.
- **Siguiente**: handoff a Codex CLI (prompt en `progress/handoff_pets-list-response-enrichment.md`); `reviewer` cuando el humano confirme que Codex termino.
- **Entorno**: `init.sh` de dos worktrees a la vez colisiona en el Postgres compartido (e2e rojos falsos); `pgrep -f 'bash ./init.sh'` antes de lanzarlo. Cada worktree necesita su `graphify update .`.
- **Implementacion Codex iniciada (2026-09-06 18:29 UTC)**: rama y working tree verificados; `./init.sh` base termino con exit 0 (163 suites / 1237 unitarios backend, 25 suites / 353 e2e, 59 suites / 891 tests moviles). Plan: cuatro commits rojos R1/R4/R2/R3, verdes minimos del use case y controller, trazabilidad, `graphify update .` y una unica corrida final limpia de `./init.sh`.
- **Implementacion Codex completada (2026-09-06 18:48 UTC)**: R1-R4 verdes y trazados; `graphify update .` exit 0; `./init.sh` final exit 0 (163 suites / 1243 unitarios backend, 25 suites / 354 e2e, 59 suites / 891 tests moviles). Informe completo en `progress/impl_pets-list-response-enrichment.md`; siguiente paso: revision independiente, sin marcar la feature `done` todavia.
- **Reviewer aprobado (2026-09-06 21:15 UTC)**: `progress/review_pets-list-response-enrichment.md`. C2-C7 verdes; rojo de cada R-id verificado de forma independiente en worktree temporal (4 fallos unitarios + 1 e2e, todos por asercion); OD-1/OD-2/OD-3 respetadas; R4 sin N+1 (una consulta + firmas SigV4 locales); deriva limitada a los 5 archivos de backend declarados. `./init.sh` del reviewer exit 0: 163 suites / 1243 unitarios backend, 25 suites / 354 e2e, 59 suites / 891 moviles.
- **Cierre**: branch sincronizada con `origin/main` (`185d42b`, incluye #65), `feature_list.json` #66 a `done` (62/72), STATUS.md actualizado. PR pendiente de merge por el humano; ninguna IA mergea a main.

## Frontend: #67 mobile-pet-hero-header — sesion UI (desde 2026-09-06)

- **Branch**: `feature/67-mobile-pet-hero-header`, creada sobre main en 303fc19. Worktree principal `/home/claude/sites/Pet-Tracker`.
- **Estado**: spec **aprobada** el 2026-09-07. El humano firmo la casilla de §Aprobacion en su propio commit `8cf28e5` sobre la branch; el leader recogio ese commit y paso el frontmatter de los cuatro ficheros a `approved`. Implementacion en marcha.
- **Implementador: el subagente `implementer`**, no Codex CLI, por la excepcion de `CLAUDE.md` §Excepciones: Codex sigue sin cuota (la nota del 2026-09-06 decia "hasta el martes" y hoy es lunes). Se asume por escrito que la revision cruzada es mas debil de lo normal, porque quien implementa y quien revisa salen del mismo modelo.
- **Implementacion cerrada**: 35 commits test-primero entre `d9d5fa6` y `9313069`, un `test(...)` rojo nombrando el R-id antes de cada `feat(...)`. C4 cumplido, sin el mega-commit de #19. `./init.sh` exit 0; movil 976/976 en 65 suites contra las 932/932 en 63 del baseline `303fc19`, backend, infra y e2e sin cambio. Grep-clean en cero.
- **Reviewer: APROBADO** sobre `9313069` (`progress/review_mobile-pet-hero-header.md`). Corrio `./init.sh` el mismo, replanto las tres mutaciones de R9, recalculo los cuatro ratios de contraste contra los tokens que la implementacion usa de verdad, y verifico uno a uno que ningun `testID` murio sin sustituto.
- **O2, unico arreglo obligatorio, ya hecho en `fd04356`**: el cuarto `it` de `hero-header-amendments.test.ts` buscaba la cadena `- [X] Enmienda #67`, que no existe en ningun fichero en ningun estado. El reviewer lo probo marcando una casilla de verdad y los cuatro `it` siguieron verdes: un candado que no podia fallar nunca. Se borro en vez de arreglarse, porque en cuanto el humano firme las nueve casillas un test que exija "ninguna marcada" se pone rojo por diseno, y el `it` que cubre lo que R10 si prescribe -linea de firma presente, marcada o no- sigue vivo. Suite movil 975 tras el borrado.
- **#67 `done` el 2026-09-07.** Los dos gates humanos quedaron cerrados: el humano firmo las **nueve casillas A1-A9** en su commit `4449f31` -cinco ficheros, una linea cada uno, sin codigo colado- y confirmo el **smoke en dev build de Android** con foto y sin foto en los dos temas. Drift verificado antes de marcar: entre el commit del veredicto `9313069` y HEAD lo unico que toca codigo es el borrado de O2 que el propio reviewer prescribio.
- **PR #112 abierto y pendiente de merge por el humano.** `main` sigue intacta.
- **Dos apuntes que el humano vio en el smoke** (O3 del reviewer): el titulo "Inicio" **desaparece** de Home cuando hay mascota -R5 obliga a que el hero sea el primer hijo del scroll, y el implementer eligio quitarlo en vez de meterlo bajo la foto; se sigue pintando en las tres ramas sin mascota, es decision declarada y no descuido-; y hay que mirar que el degradado no deje banda gris en la transicion a la banda opaca y que la foto no recorte la cara del animal por arriba.
- **O1, informativo, no bloquea**: la fila `home.walks` que #67 anadio a la tabla de catalogo de `specs/mobile-ui-language/design.md:300` es la unica edicion a una spec aprobada sin bloque de enmienda ni firma. La autoriza R7b, que el humano aprobo, y es apunte de registro y no enmienda de decision. Si el harness quiere el invariante duro "ninguna spec aprobada se edita sin firma", la via es que la proxima spec que anada claves de catalogo enrute ese apunte por R10.
- **Lo que el humano tiene que firmar**: (a) la spec, y (b) las **nueve enmiendas A1-A9** de R10, que tocan `specs/mobile-figma-polish/`, `specs/mobile-pets-profile/`, `docs/ui-guidelines.md` y `docs/conventions.md`. El bloque de enmienda es literal y su linea de firma se entrega sin marcar; el test de R10 lo lee de `design.md` §9, no de una copia.
- **Cuatro hallazgos de la spec que corrigen premisas del encargo**, todos verificados contra el arbol y no de memoria:
  1. `backgroundImage` a secas **no existe** en RN 0.86.2: solo `experimental_backgroundImage` (`StyleSheetTypes.d.ts:520`). Y `bg-linear-to-b` no resuelve — el parser de gradientes de uniwind espera paradas literales y `--tw-gradient` no aparece en el paquete. Va por el prop `style`.
  2. El velo del Make no da AA: `rgba(0,0,0,0.28)` sobre foto casi blanca deja blanco a 1,98:1, y subirlo a alpha 0,54 tapa la foto. El texto va sobre banda opaca de `bg-background` (18,93:1 y 4,98:1 en claro; 17,81:1 y 7,45:1 en oscuro), desviacion declarada al estilo de #61.
  3. "Pasos hoy" no se puede pintar: cero ocurrencias de `steps` en `src/` y `activitySummary` sale siempre `null`. El dato destacado pasa a **paseos** (`walkCount`), que Home ya descarga y hoy no pinta nadie.
  4. Home **no** lee `photoUrl` del listado: `home.tsx:174` lo saca del detalle con `getPet`. Lo que #66 desbloquea en Home es el `pet-switcher`, que si lee del listado y llega gratis al montarse en el slot.
- **Baseline verde** medido en `ffd045a` (2026-09-06): `./init.sh` exit 0. Movil 932/932 en 63 suites, backend 1243/1243 en 163, infra 14/14, e2e 354 pasados con 8 saltados de 28 suites; lint y typecheck limpios. El flaky de #72 no mordio en esta pasada. Este es el numero contra el que el reviewer mide el **delta** de #67, no una constante que copiar dentro de la spec.
- **Dos decisiones del humano del 2026-09-06**, ya volcadas a `feature_list.json` #67:
  1. Sin foto el hero pinta el **blobatar a sangre**, no la inicial. El enunciado original de la decision B decia "degradado con la inicial, que es el patron que ya usa pet-avatar" y esa premisa era falsa: `pet-avatar.tsx:29-36` pinta `blobatar(name)` con `SvgXml`, y la R5 aprobada de #40 ya habia matado el fallback de inicial el 2026-08-21. Se conserva blobatar y la R5 de #40 queda **sin enmendar**. El error nacio en `progress/explore_design-gap-vs-make.md:657-662` y se propago a **tres** sitios: ese informe (ya anotado), el enunciado de `feature_list.json` (ya corregido) y `docs/ui-guidelines.md:215-217`, la carta, que espera la enmienda A8 y la firma del humano.
  2. El selector de mascota **no vive dentro del hero**: el hero expone un slot, Home monta dentro el `pet-switcher.tsx` existente y Profile lo usa sin slot.
- **Enmienda pendiente de firma humana**: `specs/mobile-figma-polish/design.md` §5 (L95-103) declara "Headers hero (foto 280-340px con overlay): fuera de #46" y su `requirements.md` §Fuera de alcance lo repite. #67 lo revoca a proposito; la spec enumera el cambio y el humano lo firma, igual que #65 hizo con las specs que ratificaban el ingles.
- **Sin dependencia nueva para el degradado**: `expo-linear-gradient` sigue prohibido por #46. Con `react-native@0.86.2` hay `backgroundImage: linear-gradient(...)` nativo, y queda el `<LinearGradient>` de `react-native-svg` como alternativa; la spec elige y justifica.
- **Fuera de #67**: la pildora "En linea" (depende del pestillo roto de `ingestion.drizzle.store.ts:97` y de un umbral sin definir, decision G).
- **Implementador**: Codex CLI sigue sin cuota hasta el martes, asi que cae en el subagente `implementer` (`CLAUDE.md` §Excepciones), con la revision cruzada mas debil asumida por escrito.

## Frontend: #68 mobile-home-weekly-activity — sesion UI (desde 2026-09-07)

- **Implementacion iniciada por Codex CLI a las 21:27 UTC.** Rama y arbol limpios confirmados; `.expo/types/router.d.ts` no existia; no habia otro `init.sh`; baseline `./init.sh` exit 0 (build, 163 suites backend, 65 suites moviles, 25 suites e2e, lint y typecheck). Leidas completas la spec aprobada, la carta, convenciones, arquitectura y checkpoints. Consultada documentacion oficial fijada a Expo 57 para `@expo/ui/community/segmented-control`, Reanimated, SVG y Router. Orden activo: R1 -> R1b -> R15 -> resto de `tasks.md`, con commits rojo/verde separados y trazabilidad incremental.
- **Hallazgo R15 contra el arbol**: la tabla R19(a) omitio dos candados por ruta que tambien apuntaban al `home.tsx` antiguo: `design-drift.test.ts` (import del Card compartido) y `legibility-classnames.test.ts` (#61 R5, `text-warning-strong`). Se reubicaron a `screens/home/index.tsx` sin cambiar ningun conteo ni assert; se documentara como premisa falsa en el informe final.
- **Hallazgo R4 del arnes**: bajo `jest-expo`, cambiar `process.env.TZ` dentro del test no actualiza la zona efectiva del worker (si Jest nace con `TZ=America/Mexico_City`, el caso conductual si devuelve `sab` con la mutacion). Se conserva el caso exacto de la spec y se refuerza en el mismo `it` con un candado estructural que rechaza `new Date(date)`, para que la mutacion 2 tambien muera en CI UTC. Se documentara como premisa falsa del arnes.
- **Hallazgo R12 de locale**: `Intl.NumberFormat('es-MX', { maximumFractionDigits: 1 })` devuelve punto decimal (`+12.5`) en el runtime, mientras el ejemplo obligatorio de `tasks.md` fija `+12,5`. La implementacion conserva `Intl.NumberFormat` y normaliza el separador para el copy espanol firmado; se documentara como premisa falsa.
- **Hallazgo R20 contra el arbol (2026-09-07), resuelto con autorizacion humana**: la suite completa descubrio que `src/providers/__tests__/language-provider.test.tsx` tambien cierra el numero de claves del catalogo. Las dieciseis claves aprobadas de #68 producen un delta real de `+16`; ese cuarto `toHaveLength` no aparece en R19 ni el fichero aparece en `design.md` §4. El humano autorizo expresamente tocar solo ese candado y se conservo la base historica como `260 + 16`. R20b queda demostrado: las cinco mutaciones se plantaron por separado y todas pusieron roja la suite; las mutaciones de zona ciega 2 y 3 cayeron, respectivamente, en el candado de fecha local de R4 y el caso `source:'stored'` con metrica nula de R5. Tambien reaparecio una vez el flaky conocido #72 de image picker, independiente de #68, durante una corrida contaminada anterior a la referencia verde.
- **Branch**: `feature/68-mobile-home-weekly-activity`, creada sobre main en `4a5f6dd`. Worktree principal `/home/claude/sites/Pet-Tracker`.
- **Spec APROBADA el 2026-09-07.** El humano firmo en `3812900` las **dos** casillas -la spec y la enmienda E1- en su propio commit sobre la branch: un fichero, dos lineas, sin codigo colado. El leader paso el frontmatter de los cuatro ficheros a `approved` y #68 a `in_progress`.
- **Handoff a Codex CLI escrito**: `progress/handoff_mobile-home-weekly-activity.md`. El humano lo corre en su terminal. Mientras Codex trabaja el leader **no toca `mobile-pet-tracker/`**: solo `docs/`, `specs/`, `progress/` y `feature_list.json`.
- **La spec ampliada son 20 requisitos (R1-R20, con R1b/R14b/R20b) mas la enmienda E1**, 1903 lineas. `tasks.md` fija un orden obligatorio que empieza por R1 (la dependencia, porque el paquete es ESM y sin `transformIgnorePatterns` ninguna suite arranca) y sigue por R15 (la migracion, antes de escribir una linea de grafica, o el ultimo commit mueve todo y el diff deja de ser legible).
- **ALCANCE AMPLIADO POR EL HUMANO EL 2026-09-07.** La primera spec se firmo en `a1fa09e` (un fichero, una linea, casilla con fecha, sin codigo colado) para un alcance estrecho. El humano pidio meter dentro **todo lo que esa spec habia dejado fuera**, asi que la spec **se reescribe y la firma anterior deja de cubrirla**: la casilla vuelve sin marcar y hace falta **una firma nueva**. Dejarla marcada seria fraudulento.
- **Que entra ahora**: selector de metrica (minutos activos / distancia / paseos, sin refetch), detalle por dia al tocar con tooltip, navegacion a `/trips` por la ruta existente, eje Y, rejilla, linea de media, animacion de entrada respetando `prefers-reduced-motion`, migracion de la Home a `src/screens/home/` (convencion de #39) y traduccion de los enum crudos de la API -`src/screens/pairing/index.tsx:421-422` pinta hoy `device.connectivity` en bruto, un `'LTE'` a pelo, y su test lo fija en `index.test.tsx:511`-. Esto ultimo mete #68 en una pantalla que no tiene que ver con actividad; queda declarado y acotado en la spec.
- **Dos cosas de la lista de fuera-de-alcance NO se absorben, por decision del humano**: la tira de 4 celdas es **#69** y los accesos rapidos son **#71**. Se especifican despues, con su id, su gate y su PR. Absorberlas habria sido borrar dos features del mapa, no ampliar una.
- **La pildora "En linea" sale con id propio: #73 `pet-online-pill`** (creada el 2026-09-07). Es la unica de esa lista que no se resuelve solo en movil: el pestillo de conectividad del backend esta roto (`ingestion.drizzle.store.ts:97`) y el umbral de silencio nunca se definio (decision G, abierta desde #67). Pintarla con el dato de hoy seria pintar un estado incorrecto.
- **Libreria de graficas: `react-native-chart-kit`, designada por el humano.** Con el alcance ampliado -tooltip, seleccion, eje Y, rejilla- ya se paga; con siete barras estaticas no se pagaba, que es por lo que la primera spec la habia descartado. Tres restricciones que la spec tiene que resolver por escrito: **import obligatorio por el subpath `react-native-chart-kit/v2`** porque la v1 tipa `data` como `number[]` sin null y perderia en silencio la distincion sin-dato/cero; los colores de chart-kit entran por `chartConfig` como cadenas, asi que hay que definir como fluyen los tokens hasta ahi sin romper el grep-clean; y su accesibilidad es **un resumen**, no siete anuncios (`getBarChartAccessibilitySummary` devuelve una cadena), asi que la tabla por columna se pinta a mano. Ademas `width`/`height` son pixeles obligatorios, no `100%`: hace falta `onLayout`.
- **Se conserva de la primera spec, ya verificado contra el arbol**: el discriminante de "sin dato" es **`source` y nunca `null`** -`missingEntry()` pone todo a `null` pero `emptyActivity()` devuelve **ceros**, asi que hoy `null` equivale a `missing` por coincidencia y ramificar por `null` pasaria todos los tests siendo falso-; el array es cronologico terminando hoy y la letra del eje sale de la fecha; y `weekComparison` es delta porcentual de la media diaria a un decimal, sin `restMinutes`.
- **Implementador: Codex CLI.** El humano recupero cuota el 2026-09-07, asi que se vuelve al handoff por disco de `CLAUDE.md` §Implementacion y **se deja de usar el subagente `implementer`**. Vuelve a valer el punto entero del reparto: quien implementa no revisa.
- **Seis premisas del encargo salieron falsas al verificarlas contra el arbol, tres de ellas del leader**, y estan corregidas en la spec:
  1. **La ruta `/trips` no existe.** `src/app/(tabs)/` tiene `map.tsx` y ningun `trips`; `getDayRoute` ademas pide el dia en curso y no acepta fecha. Venia de la lista de fuera-de-alcance de la primera spec. El enlace pasa a `/map` y **solo para hoy**.
  2. **Los colores de chart-kit v2 no entran por `chartConfig`**: eso es la API v1. `BarChartProps` de la v2 ni lo declara y los colores son cadenas planas en `theme` y `series[].color`, asi que el choque con el grep-clean que el leader habia anunciado **no existe**.
  3. **No hay candado global de "cero hex fuera de `src/theme/`"**, pese a haberlo repetido como si lo hubiera. El unico test que persigue hex esta en `design-drift.test.ts` bajo `describe('R9: mobile-pets-profile sin drift')`, **acotado a ocho ficheros nominales** de #40; lo global es el de `text-[10px]`. El grep-clean se venia cumpliendo por revision, no por candado. R18 anade su propio bloque para los ficheros de esta feature.
  4. `getBarChartAccessibilitySummary` devuelve **ingles fijo**, asi que meteria copy fuera del catalogo. Y hay un hecho mas duro: el `BarChart` renderiza su raiz como `<View accessible accessibilityRole="image">`, que **colapsa todo el subarbol** — los siete anuncios son imposibles desde dentro del grafico con cualquier API, y R9 los pone fuera.
  5. `emptyActivity()` va de `pipeline/activity.ts:83` a `:93`, no a `:91`. El hallazgo de fondo, intacto.
  6. `connectivity` **no es un enum**: es `string | null`, el backend solo escribe `'online'` y el `'LTE'` del test es jerga inventada en la fixture. Cerrado: `'online'` a "En linea" y cualquier otro valor a "Desconocida".
- **Precio firmado a sabiendas**: alinear las siete etiquetas con las barras depende de **cinco constantes internas** de la 7.0.4 de chart-kit, porque no hay API publica de geometria. Estan derivadas y acotadas (desvio maximo 0,59 px), la version queda pinneada exacta y R1b se pone rojo si alguien la sube.
- **Implementacion de Codex cerrada**: 43 commits en pares rojo->verde entre `9fd10f4` y `3939981`, en el orden exacto que `tasks.md` prescribia. Informe en `progress/impl_mobile-home-weekly-activity.md`.
- **Reviewer: RECHAZADO** (`progress/review_mobile-home-weekly-activity.md`). Corrio `./init.sh` el mismo -exit 0, movil 67/67 suites y 1023/1023 tests-, replanto las cinco mutaciones prescritas (mueren todas) y luego probo **variantes triviales y semanticamente identicas** de las mutaciones 2 y 3: esas dejan la suite entera en verde. **El codigo de produccion es correcto; los dos arreglos son solo de test.**
  1. **R4 prohibe una grafia, no una conducta** (`weekly-activity-chart.test.tsx:469-482`). El hallazgo de Codex sobre el runtime era cierto y el reviewer lo midio: en un worker de `jest-expo` `process.env` es una copia (`isRealProcessEnv: false`), reasignar `TZ` no ejecuta `tzset`, y la mitad conductual del `it` pasa igual con la mutacion plantada. Lo unico que la mata es un `not.toContain('new Date(date)')`, o sea una cadena literal: **renombrar el parametro de `date` a `isoDate` y dejar el mismo bug deja la suite verde**, 67/67 y 1023/1023. Un dia entero de desfase en toda zona de offset negativo se queda sin candado.
  2. **El discriminante `source` de R5 solo se vigila en 4 de sus 8 sitios.** Plantada la mutacion 3 linea a linea: 188, 298, 475 y 521 se ponen rojas; **283, 287, 296 y 551 sobreviven**. La 283 es justamente la que enuncia la primera clausula de R5 -el valor que se entrega al `BarChart`-. El `it` que existe no lo pilla porque su fixture usa `missing` con `null` y `stored` con `0`, asi que ramificar por `=== null` da la misma respuesta. Es el fixture, no el assert.
- **Correcciones de Codex y REVIEWER APROBADO (2026-09-08).** Siete commits `fix(...)` en pares rojo->verde entre `db53dde` y `241741e`; produccion cambia en **una sola linea** (el `bg-default` del boton de mapa), `weekly-activity-chart.tsx` sin un solo diff. El reviewer volvio a correr `./init.sh` el mismo -exit 0, movil 67/67 y 1023/1023-, replanto unas doce mutaciones y dejo el arbol restaurado.
  - **R4 cerrado por conducta**: el espia de `global.Date` con `Reflect.construct` sustituye al `not.toContain`. El bypass exacto que rompio el candado anterior -renombrar `date` a `isoDate`- ahora se pone rojo por asercion del espia, y tambien caen `Date.parse`, `Date.UTC` y la aritmetica de milisegundos. El reviewer no encontro ninguna via que pase en silencio.
  - **R5 cerrado, con un matiz que conviene no perder**: de las cuatro posiciones, **283 y 551 mueren por conducta** gracias al fixture centinela; **287 y 296 mueren solo por el parser AST**. El reviewer verifico el argumento de Codex en vez de creerselo: demostro por casos que 287 y 296 son **equivalentes en caja negra** dado un 283 correcto, y lo confirmo plantando 287 y corriendo la suite entera -el unico fallo en 1023 tests es la asercion del AST, ninguna prueba de conducta se mueve-. Acepta aqui el nivel estructural habiendo rechazado el de R4 porque **el de R4 vigilaba con una cadena literal una posicion que si era observable**, y aqui no hay conducta que observar.
- **Cuatro apuntes nuevos del reviewer, ninguno bloqueante**: el parser AST se esquiva con un senuelo inerte en 287 (consecuencia practica nula, es mutante equivalente); **el parser da falso positivo en dos refactors honestos** -`const { source } = day` y un helper `isMissing(day)`-, o sea que fija la grafia del codigo correcto y cobra impuesto al proximo que ordene esa funcion; tres de las cuatro vias de escape de R4 mueren por `TypeError: Date.parse is not a function` y no por una asercion disenada, porque el espia deja el mock sin estaticos -mueren bien, pero el mensaje despista-; y `toEqual([[2026, 8, 6]])` fija el constructor a **exactamente una** llamada, asi que un refactor legitimo que construya dos `Date` se pondria rojo.
- **Contraste del boton, cerrado**: `text-foreground` sobre `bg-default` da **17,50:1** en claro y **14,69:1** en oscuro, con el precedente de Profile exacto. La superficie del boton contra la card queda en 1,08:1: dato para el smoke, no defecto.
- **#68 tiene ahora DOS gates humanos, no uno**: (a) el smoke en dev build de Android, y (b) la casilla **D1** que el leader abrio en `requirements.md:744` para el boton de mapa. Lo señalo el propio reviewer: el commit `0556830` es aditivo y no modifica ningun requisito -C6 aguanta- pero anade gate.
- **Sin deriva**: cero backend, cero infra, ningun candado de recuento tocado, ningun assert debilitado (los `expect` suben 118->127 y 131->132), ninguna dependencia nueva, trazabilidad sin filas pendientes.
- **Handoff correctivo escrito**: `progress/handoff_mobile-home-weekly-activity_fix.md`, con criterio de aceptacion por mutacion para los dos.
- **Correccion R4 cerrada (2026-09-08)**: se eligio la via barata aprobada, un espia de `global.Date` con call-through al constructor real. El candado ya no lee una grafia del fuente: exige la llamada exacta con componentes numericos. La variante del reviewer (`isoDate` + `new Date(isoDate)`) dejo la suite movil roja solo en ese `it`; la produccion se restauro sin diff. Par test-primero/verde `cab9028` -> `b833f1d`. El baseline `./init.sh` previo tuvo un timeout transitorio ajeno a #68 en `resource-isolation.e2e-spec.ts`; el mismo fichero paso aislado inmediatamente y el arbol permanecio limpio.
- **Correccion R5 cerrada (2026-09-08)**: el fixture `source:'stored'` con metrica nula ahora comprueba el dato entregado a `BarChart`, la media y el panel del mismo dia; un dia `missing` lleva ademas un valor centinela para desacoplar `source` de `null`. Como las decisiones intermedias del denominador y del ancla son mutantes equivalentes en caja negra cuando `chartData` ya ha normalizado el hueco a `null`, el test inspecciona tambien el AST por contexto semantico y exige el discriminante `source` en cada decision, sin depender de una grafia literal. Las mutaciones aisladas de `chartData`, `measuredValues`, `averageAnchorIndex` y panel dejaron roja la suite movil completa; produccion restaurada sin diff. Par test-primero/verde `6420f75` -> `8fd2780`; suite dirigida, lint, typecheck y suite movil completa verdes despues de restaurar.
- **Correccion de contraste R8 cerrada (2026-09-08)**: se conserva `variant="secondary"` para no tocar la decision visual pendiente de la observacion 3 y se elige `bg-default`, precedente de las acciones secundarias neutrales de Profile con `text-foreground`. `bg-accent-soft` queda para la accion acentuada de elegir foto en Add Pet. El candado dirigido quedo rojo en `60f3f9c`; `c433e77` declara la superficie y deja verdes el caso dirigido, los candados de estilo relacionados, lint y typecheck.
- **Gate final de la correccion (2026-09-08)**: `./init.sh` exit 0 en la unica corrida final, y `graphify update .` exit 0 sin cambios versionados. El diff correctivo no toca backend ni infra; #68 permanece `in_progress`, sin PR ni merge.
- **D1(b)/E2 en curso (2026-09-08)**: tras actualizar la branch, E2 aparece firmada en `efc1e32`. El commit test-primero `1e8a2f0` sube exclusivamente el candado primario de #62, actualiza el texto autorizado de R1 y añade Home a la enumeracion de su diseño. Los casos dirigidos quedan rojos antes de producción: Home recibe `secondary/bg-default` y el inventario recibe doce donde ya exige trece.
- **D1(b)/E2 verde dirigido (2026-09-08)**: `705daea` devuelve el boton de mapa a la variante primaria por defecto con `rounded-xl bg-accent` y `text-accent-foreground`, conservando `min-h-11`, `testID`, copy, condicion de hoy y `router.push('/map')`. Home, consistencia, legibilidad, drift, lint y typecheck pasan; ningun otro inventario se ajusto.
- **D1(b)/E2 cerrado por Codex (2026-09-08)**: `./init.sh` final y `graphify update .` terminaron con exit 0. Trazabilidad sin pendientes; cero cambios en backend/infra. #68 sigue `in_progress`, sin PR ni merge, a la espera de los gates humanos.
- **Corrección de defectos del smoke Android en curso (2026-09-08)**: baseline `./init.sh` exit 0 y catálogo #65 estable en 2 suites/23 tests. El commit test-primero `3299704` planta dos fallos dirigidos: R6 recibe todavía “Distancia recorrida” donde exige “Distancia”, y R9 recibe `appearance: undefined` donde exige que el selector siga los temas oscuro y claro de la app. Producción aún intacta en ese commit.
- **Corrección del selector verde dirigida (2026-09-08)**: `9ea5ac1` añade `useUniwind`, pasa al control `appearance={theme === 'dark' ? 'dark' : 'light'}` y reduce únicamente `weeklyActivity.metricDistance` en español a “Distancia”. Gráfica 35/35; inventario #65 intacto en 2 suites/23 tests; consistencia, drift y legibilidad 3 suites/102 tests; lint y typecheck exit 0. Falta el gate visual estrecho del dev build antes del cierre.
- **Gate automatizado del smoke correctivo (2026-09-08)**: suite móvil completa 67/67 y 1024/1024; `./init.sh` post-cambio exit 0; `graphify update .` completado; grep-clean intacto y cero cambios de backend/infra. La medición de “Minutos activos” queda explícitamente pendiente: el entorno no dispone de Android SDK/JDK, `adb`, emulador, dispositivo, `/dev/kvm` ni sesión EAS. No se sustituyó por Jest/web ni se cambió más copy; hace falta el resultado binario del smoke humano en la pantalla más estrecha soportada.
- **Segundo hallazgo del smoke y decisión humana (2026-09-08)**: el humano confirmó en el dev build Android que “Minutos activos” todavía salta de línea y que, en tema claro, la etiqueta y el icono negros del segmento seleccionado pierden legibilidad sobre el fondo verde. Tras parar como exigía el encargo, autorizó sustituir únicamente ese `SegmentedControl` por un grupo accesible de tres `Pressable`; se conservarán copy, orden, estado local y cero refetch, con una línea por etiqueta y el par semántico `bg-accent`/`text-accent-foreground` también para el icono.
- **Selector accesible verde (2026-09-08)**: rojo `e486e4d` (2 suites dirigidas, 5 fallos esperados y 75 casos verdes) y verde `8003451`. Las opciones son radios de 44 pt, con ancho proporcional al copy, `numberOfLines={1}`, ajuste de fuente, estado seleccionado y check con `accent-foreground`. El primer pase de candados detectó una esquina directa extra de #62; se retiró la superficie redundante del contenedor sin tocar el candado y la batería dirigida terminó 7 suites/205 tests, lint y typecheck en verde. Tres mutaciones aisladas —dos líneas, `text-foreground` activo e icono negro— pusieron rojos sus casos y se restauraron. La primera suite móvil completa reprodujo el flaky conocido #72; Add Pet pasó aislado 17/17 y la repetición limpia terminó 67/67 suites y 1024/1024 tests.
- **Gate final del selector accesible (2026-09-08)**: `./init.sh` exit 0 con build, backend 163/163 suites y 1243/1243 tests, infra 2/2 y 14/14, móvil 67/67 y 1024/1024, e2e 25 suites ejecutadas y 354 tests verdes, lint y typecheck. `graphify update .` exit 0; no dejó cambios versionados. Cero backend/infra, #68 continúa `in_progress`, sin PR ni merge; falta el re-smoke humano del selector nuevo.
- **Preferencia visual de tabs animadas (2026-09-08)**: el humano pidió recuperar la animación del selector. Rojo `18e3a85`; verde `7c3738c`. El grupo accesible se conserva, pero ahora una única píldora medida se desplaza y redimensiona con el spring de 250 ms que ya usa `FloatingTabBar`, con `ReduceMotion.System`. Para evitar un destello de contraste mientras se mueve, adopta también su patrón `bg-tab-pill`/`text-accent-strong`; check y texto consumen el token reactivo. Las etiquetas siguen en una línea, con ancho proporcional y 44 pt táctiles.
- **Verificación dirigida de tabs animadas (2026-09-08)**: 6 suites/195 tests, lint y typecheck en verde; ningún inventario global se movió. Dos mutaciones aisladas y restauradas —quitar el spring horizontal y sustituir `bg-tab-pill` por `bg-accent`— dejaron rojos R6 y R9 respectivamente. Queda el re-smoke humano de movimiento, temas y “Reducir movimiento” en el Android estrecho.
- **Gate automatizado final de tabs animadas (2026-09-08)**: `./init.sh` exit 0 —backend 163/163 suites y 1243/1243 tests, infra 2/2 y 14/14, móvil 67/67 y 1025/1025, e2e 25 suites ejecutadas y 354 tests verdes, lint y typecheck—; `graphify update .` exit 0 sin cambios versionados. #68 sigue `in_progress`; cero backend/infra, sin PR ni merge.
- **Decision visual pendiente del humano** (observacion 3, no bloqueante): el verde de R19 degrado el boton de mapa a `variant="secondary"` para no mover el inventario cerrado de doce botones primarios de #62 R1. R19 mandaba **parar y reportar**; Codex no absorbio el numero -bien- pero tampoco paro. Es una decision visual sin firma.
- **Dos apuntes para el harness, no para la implementacion** (observaciones 5 y 6): el candado de R18 prohibe `StyleSheet` a secas y no `StyleSheet.create`, mas estricto que C8 y que el propio repo, que usa `StyleSheet.flatten` en `components/card.tsx`; y seis requisitos (R1b, R4, R14b, R15, R17, R19) no tienen test que nombre su R-id, pero estan **exactamente donde la spec aprobada mando ponerlos**, asi que el arreglo va en el `spec_author`.
- **Tercer veredicto: APROBADO (2026-09-08)**, sobre D1(b), los dos defectos del smoke y la sustitucion del selector con tabs animadas. `./init.sh` exit 0 corrido por el reviewer en primer plano, movil 67/67 y 1025/1025, cero backend y cero infra, y **12 de 14 mutaciones mueren** -las 5 de Codex mas 9 suyas-. Las dos revisiones anteriores quedan intactas; la nueva se anade al final del fichero.
- **Como llego la sustitucion del selector**: Codex **paro en el punto de parada** del handoff en vez de decidir por su cuenta. El humano midio en el dev build: con el copy ya acortado a "Distancia", **"Minutos activos" seguia saltando de linea**, y en tema claro el texto y el check negros del segmento activo perdian legibilidad sobre el verde. La causa esta en el wrapper y no en el uso: `SegmentedControlProps` no expone `fontStyle` ni `activeFontStyle`, y en Android `tintColor` solo pinta el contenedor activo. El humano autorizo de viva voz sustituirlo por tres `Pressable` propios con pildora animada.
- **Casilla D2 abierta y SIN FIRMAR** (`requirements.md:777`). R6 prescribe **literalmente** implementar el selector con `SegmentedControl` de `@expo/ui/community/segmented-control`, y §Fuera de alcance remata que cambiar de capa es feature separada. La autorizacion fue de viva voz en la terminal de Codex y no estaba versionada. El reviewer cotejo las **16 promesas** de D2 contra el diff: ninguna sobra ni falta, y la carta §Decisiones fijas 5 **no se toco** -`git diff` vacio sobre `docs/ui-guidelines.md` en el rango-. Lo que se abandona es un control concreto por ilegible, no la regla de capas.
- **Correccion a una premisa del leader**: `adjustsFontSizeToFit` **NO es inerte** en Android en RN 0.86.2 -esta implementado en `TextLayoutManager.adjustSpannableFontToFit()`, y el tipado iOS-only de TypeScript esta desactualizado-. Lo inerte es su **suelo**: Android lee `minimumFontSize` (`TextLayoutManager.kt:841-844` via `conversions.h:1155`), que `<Text>` no expone, asi que `minimumFontScale={0.85}` no llega y el suelo real es **4 dp**.
- **Contraste del par nuevo, recalculado**: `bg-tab-pill` con `text-accent-strong` da **4,67:1** en claro y **4,90:1** en oscuro en reposo. El reviewer verifico ademas que el par viejo daba **1,08:1 en transito**, asi que el cambio esta justificado y no es capricho.
- **Reduced motion: candado real.** Mutar `ReduceMotion.System` a `Never` pone la pildora roja.
- **Un solo candado tocado y una sola cifra movida** (12->13 de #62 R1, con E2 firmada por el humano cinco minutos antes del commit que la consume). La cifra de esquinas continuas no se movio, **pero la explicacion de Codex sobre por que es falsa**: los tres `Pressable` no llevan `CONTINUOUS_CORNER`, ni deben.
- **Tres apuntes no bloqueantes con handoff escrito** (`progress/handoff_mobile-home-weekly-activity_a11y.md`): (1) el contenedor del selector no declara `accessibilityRole="radiogroup"`, asi que TalkBack lee tres controles sueltos en vez de un conjunto, y **nada lo vigila** -plantar `accessible` + `accessibilityLabel` ahi, que colapsaria los tres radios en un nodo, deja la suite verde-; (2) el `minimumFontScale` inerte de arriba, tampoco candado; (4) `jest.mock('uniwind')` muerto desde que el `SegmentedControl` se fue.
- **Dos apuntes para el harness, no para #68**: el `describe('R9: el selector sigue el tema de la app')` cuelga de un R-id que no lo cubre -R9 son las columnas y el `BarChart`, no los tokens del selector-, apunte para el `spec_author`; y **`init.sh:127-148` se rompe si hay `FORCE_COLOR` en el entorno**, porque compara por cadena un numero que Node colorea y falla con "Mas de 1 feature en in_progress (1)" habiendo una sola. Le paso al reviewer en su primera corrida.
- **Baseline verde**: `./init.sh` exit 0 sobre `4a5f6dd` al abrir la branch. Es el commit contra el que el reviewer mide el **delta**, no una constante que copiar dentro de la spec.
- **Dependencias nuevas: autorizadas por el humano (2026-09-07)**, siempre que la spec las declare como pide la carta (`docs/ui-guidelines.md:171-172`). Cae el "no se instala nada" implicito desde #46; sigue en pie el veto **nominal** a `expo-linear-gradient` (#46, ratificado en la enmienda A4 de #67).
- **PanelUI (`panelui-native`) evaluada y descartada como libreria de componentes** el 2026-09-07: encaja con el stack (uniwind, Tailwind v4, Reanimated 4) y su `BarChart` es bueno -cero hex, colores por `useCSSVariable`, modela `null` y lo salta, `accessibilityLabelForDatum` por barra-, pero **no sustituye a `heroui-native`, lo duplica**: trae su propio `theme.css` con seis temas y escala de radios por tema, `@hugeicons` en duro frente a `reicon-react-native`, y dos peers requeridos que no tenemos (`expo-linear-gradient`, vetado por nombre, y `@react-native-masked-view/masked-view`, nativo). Migrar seria reescribir #46, #61, #62, #65 y #67. Si algun dia hace falta su chart, la via es su CLI de copiar codigo, no adoptar el paquete.
- **Gate humano de smoke**: dev build de Android en los dos temas, con una mascota que tenga dias sin dato y dias de cero minutos. No delegable a IA.

- **Cierre (2026-09-08)**: los **tres** gates humanos firmados —la spec en `3812900`, las enmiendas D1(b)/E2 en `efc1e32` y D2 en `e435a3f`, y el re-smoke en dev build de Android confirmado de viva voz—. `feature_list.json` #68 a `done` (64/75). Deuda registrada en vez de perderla: **#73** `pet-online-pill`, **#74** `mobile-metric-selector-a11y` y **#75** `harness-init-force-color`.

## Frontend: #69 mobile-home-stats-strip — sesion UI (desde 2026-09-08)

- **Branch**: `feature/69-mobile-home-stats-strip`, creada sobre main en `9358cc7`, que ya incluye #68. Worktree principal `/home/claude/sites/Pet-Tracker`.
- **Estado**: `in_progress`, implementacion R1-R15b terminada y trazada en el orden prescrito; queda el smoke/review humano. La feature no se marca `done` y no se abre PR por orden expresa del humano.
- **Por que esta primero de las tres que quedan**: el hueco **ya esta abierto a proposito** -la spec de #68 anclo la grafica *despues* del `summary-card` justamente para que #69 pueda sustituirlo o subirlo bajo el hero sin reescribir nada-; los datos ya estan servidos y medio cableados -`walkCount` ya se descarga y **ya se pinta** como dato destacado del hero (`index.tsx:142`, clave `home.walks` que anadio #68), y `currentWeightKg` viene en el perfil-; y cierra la parte de la Home que se ve sin scroll: hero, tira, grafica.
- **La decision que la spec tiene que cerrar**: que pasa con el **sueno** (`restMinutes`), que la app muestra hoy en el `summary-card` y el diseno del Make no dibuja. Es el caso de la decision E y el humano ya fijo el criterio general de no perder informacion util solo por fidelidad. Dato ya verificado en #68: `restMinutes` **no tiene `weekComparison`**.
- **Encargo al `spec_author`**: verificar contra el arbol las cuatro premisas del enunciado y volver a derivar todos los numeros de linea. #68 reescribio la Home entera -la migro a `src/screens/home/` y le anadio la grafica-, y entre #67 y #68 el mismo informe de exploracion acumulo **diez** premisas falsas.
- **Dos lecciones de #68 exigidas en los candados**: que un candado que prohibe una cadena literal no es un candado de conducta, y que la mutacion se planta en **todos** los sitios de una decision, no en uno.
- **Baseline verde en la segunda pasada**: `./init.sh` exit 0 sobre `9358cc7`, corrido con `env -u FORCE_COLOR` por el bug de #75. Backend 1243/1243, infra 14/14, movil 67 suites y 1025/1025, e2e 354 pasados con 8 saltados. Es el commit contra el que el reviewer mide el **delta**.
- **La primera pasada salio ROJA, y no era flakiness misteriosa: es un test mal escrito.** `backend-pet-tracker/test/health-vaccines.e2e-spec.ts:497` fallo en la suite completa y paso **15/15** corrida aislada. La consulta `db.select().from(auditLog).where(and(eq(entity,'vaccine'), eq(entityId,id)))` **no lleva `orderBy`**, pero el test asserta `toEqual(['vaccine.create','vaccine.update','vaccine.delete'])` -un array ordenado- y ademas indexa `rows[1].meta` dando por hecho que el update es el segundo. Sin `ORDER BY` el orden de un `SELECT` no esta definido: con la suite entera y el Postgres bajo carga el orden fisico cambia. Ese test llevaba pasando por suerte. Registrado como **#76 `e2e-audit-log-order-assert`**, con el criterio extra de barrer el resto de los e2e buscando el mismo patron, porque seguramente esta copiado. No bloquea #69 -es backend y #69 es puro movil- pero contaminaba el baseline.
- **Implementador: Codex CLI**, por handoff de disco.
- **D1 resuelta y cierre tecnico (2026-09-08)**: el humano autorizo exclusivamente `language-provider.test.tsx:41` con la base visible `260 + 16 + 1`; rojo `e090688`, verde `13026e6`. Las seis mutaciones de R15b quedaron rojas por separado y restauradas (`1586d07` -> `6c170da`). Suite movil 1041/1041, `env -u FORCE_COLOR ./init.sh` exit 0 y `graphify update .` exit 0. Informe: `progress/impl_mobile-home-stats-strip.md`.
- **Premisas falsas observadas sin enmendar la spec**: `describe('R9: summary degrada con gracia')` tenia seis `it` previos, no cinco; y la fixture comun de R1 tiene `device: null`, por lo que el test de orden de R6 necesitaba declarar un collar para que `collar-card` y `last-position-card` existieran. Ambas se conservaran en el informe final cuando se desbloquee R15.
- **Las otras dos del bloque, y por que van despues**: **#71** accesos rapidos es la mas barata en absoluto -navegacion pura, sin datos- pero su spec tiene que enumerar destino por destino y comprobar que cada ruta existe, que es el error exacto que nos comimos en #68 con `/trips`; **#70** recordatorios tiene **la mitad del diseno bloqueada**, porque `nextReminder` y `activitySummary` siguen hardcodeados a `null` en el mapper del perfil y la barra de progreso de comidas no se puede construir.

- **Cierre (2026-09-08)**: los **dos** gates humanos firmados —la spec en `6ad877d`, la decision D1 en `72873d5`, y el smoke en dev build de Android confirmado de viva voz—. `feature_list.json` #69 a `done` (65/80). Deuda abierta desde esta feature: **#77** el peso visible sin collar y **#80** los `testID` del doble atados al componente y no al uso.
- **Tres cosas que esta feature dejo en el harness**: que `language-provider.test.tsx` hay que enumerarlo siempre que una feature anada claves de catalogo -es la segunda vez que se omite-; que R1 decidia **tres** cosas por celda y solo el valor estaba bajo candado, o sea que la app podia pintar `12.4 kg` bajo la etiqueta "Distancia"; y el punto nuevo de **C4**, que un rojo obtenido mutando el doble de test no es rojo legitimo cuando el candado se anade sobre codigo ya correcto.

## Frontend: #71 mobile-home-quick-actions — sesion UI (desde 2026-09-08)

- **Branch**: `feature/71-mobile-home-quick-actions`, creada sobre main en `f9163bf`. Baseline `env -u FORCE_COLOR ./init.sh` exit 0.
- **Spec aprobada** el 2026-09-08 (`100ef1a`), tras **reescribirla entera**. La primera version llevaba a Mapa, Vacunas y Comidas; el humano decidio que los tiles apunten **solo a destinos no alcanzables desde el tab bar**, porque esos tres son pestanas (`_layout.tsx:26-30`) y el tab bar flotante usa **los mismos componentes de icono** `Map` y `ForkKnife`: la fila habria sido tres botones duplicando navegacion visible en la misma pantalla.
- **Tres destinos, y el numero sale de un filtro y no del Make**: `/weight-log` -su valor ya se ve en la tira de #69 sin forma de abrirlo, porque #69 R12 dejo las celdas no interactivas-, `/add-reminder` -hoy el camino mas largo de la app, 3 toques- y `/pets/[petId]/docs`. `/reminders` queda fuera por colision con **#70**, que pondra el enlace a esa lista en esta misma Home; el tile va a la pantalla de **alta**, que es otra cosa.
- **Implementacion de Codex: 78 commits**, con las siete mutaciones versionadas en pares rojo->verde.
- **Reviewer: RECHAZADO por un solo motivo.** La produccion es correcta y su `./init.sh` quedo verde a la primera. El test de la rejilla usa **lista blanca** (`index.test.tsx:1528`) y cuenta los tiles **sobre el fuente** (`:1593`), asi que la asercion prescrita de "exactamente tres tiles" nunca se escribio: el reviewer anadio un **cuarto tile inline a `/pairing`** y la suite movil entera se quedo verde, 68/68 y 1054/1054. El criterio central de la feature no estaba vigilado. Arreglo verificado: `/^quick-action-/` en `:1528`. Handoff correctivo en `progress/handoff_mobile-home-quick-actions_fix.md`.
- **Lo que si funciono, y era la apuesta**: las **siete mutaciones son de produccion**, y el patron se extendio a los rojos de R2-R13 y no solo a R15b. El quinto punto de C4 -anadido el 2026-09-08 a raiz de #69- **nacio vivo en su primera feature**. El reviewer verifico ademas, rompiendolos, que `#64 R9` y el candado de longitud de catalogo siguen pudiendo fallar, con la base visible como suma `260 + 16 + 1 + 4`.
- **Tres apuntes no bloqueantes en el mismo handoff**: una **quinta** dimension sin vigilar -la tinta, `index.tsx:422`: `quickActionInks[index]` a `[0]` deja la suite verde, aunque el cruce que permite sigue pasando AA-; un tercer `as Href` no declarado cubriendo `/weight-log`, que R2 dice que debe ir sin cast; y la tabla de mutaciones que declara 2 fallos donde salen 3.
- **Correccion del veredicto ejecutada el 2026-09-09 por Codex**: baseline `env -u FORCE_COLOR ./init.sh` verde sobre `c18f099`. O1 tiene mutacion inline `/pairing` y candado de arbol `9a4854e -> 7bf12d5`; O2 tiene mutacion de tinta `[0]` y cruce por tile `8246d2e -> 41838b5`; O3 retiro el cast innecesario `da9a847 -> ba92380`, con typecheck verde. M1-M7 se replantaron una por una y todas quedaron rojas; el control restaurado paso 6/6 suites y 198/198 tests. El gate correctivo final y `graphify update .` terminaron con exit 0; queda la nueva revision humana y el smoke no delegable.
- **Segunda correccion tras review ejecutada el 2026-09-09**: O7 sustituyo el recuento indirecto por `testID` por la longitud de hijos de `quick-actions-row`, con par C4 `cc89976 -> deedf19`; tanto un cuarto hijo anonimo como `shortcut-extra` ponen rojo el candado. O8 extendio el cruce a las seis decisiones por tile y observa `text-foreground` con `within(tile)`, par `2aa9ed5 -> 81bb1e6`. Control restaurado: 6/6 suites y 198/198 tests. La auditoria encontro y documento una septima decision visual no vigilada, `text-2xs font-semibold`, ademas de la composicion interior compartida; ambas sondas quedaron fuera de produccion. El unico gate final posterior a O7/O8 termino con exit 0 (movil 68/68 y 1054/1054; demas recuentos estables), y `graphify update .` termino con exit 0. La feature sigue `in_progress`; no se marco done, no se abrio PR y no se mergeo.
- **Dos commits ajenos en la branch, decision del humano: viajan en el PR de #71** y se nombran en su descripcion. Los hizo **otra sesion de Claude** sobre este worktree compartido mientras Codex trabajaba: `997c080` (1 linea en `docs/demo-runbook.md`) y `71a4db7` (227 lineas de runbook nuevo mas una fila en `AGENTS.md`). Solo existen en esta branch, no en `main`. Codex los detecto, los declaro y **no reescribio historia ajena**, que es lo correcto. Es el fallo de [[vps-sesiones-paralelas-worktree]] visto desde el otro lado: esta vez la sesion intrusa no fue esta.

- **Cierre (2026-09-09)**: los **dos** gates humanos firmados —la spec en `100ef1a` y el smoke en dev build de Android confirmado de viva voz—. `feature_list.json` #71 a `done` (66/81). Tres veredictos del reviewer: el primero **rechazado**.
- **Lo que esta feature dejo en el harness**: la lista completa de decisiones que toma un elemento repetido -diez de conducta, tres estructurales y seis invariantes compartidos-, despues de que el reviewer auditara la version del leader y le encontrara tres ejes de menos, uno grave: **el dato que el elemento muestra**, que es justo lo que #69 dejo sin vigilar. Y la confirmacion de que el quinto punto de C4 -rojo de produccion, no del doble- **nacio vivo** en su primera feature.
- **Deuda abierta desde aqui**: **#81** la receta tipografica del tile sin candado, verificada con sonda; los detalles de composicion interior `items-center gap-1.5 py-3` sin decidir si se congelan; un `Pressable` anidado dentro de un tile que el recuento no ve -otra clase de defecto, y cerrarlo congelaria la composicion-; y la deuda transversal de que los tiles son `Pressable` pelados **sin feedback de pulsado**, que C8 pide y que en toda la app tiene **un solo sitio** resuelto.

---

## Rediseno contra el diseno del Make (desde 2026-09-04)

- **Origen y mapa**: `progress/explore_design-gap-vs-make.md`. Alcance cerrado por el humano: Bloque 0 + Bloque 1, features #64-#71.
- **Bloque 0 cerrado y mergeado**: #64 paleta pastel (PR #106), #65 idioma de UI (PR #110).
- **Bloque 1, cinco de seis cerradas**: #66 listado con foto (PR #111), #67 cabecera fotografica (PR #112) y #68 actividad semanal (PR #113). #69 tira de estadisticas (PR #114). **#71 accesos rapidos cerrada el 2026-09-09**, PR pendiente de merge. Detalle completo de cada una en `progress/history.md`.
- **Bloque 1 en implementacion**: **#70 recordatorios** tiene spec aprobada y esta en curso. Entra la proxima vacuna; la barra de comidas queda fuera porque no existe registro de comida servida y `mealsPerDay` vive en el plan de nutricion. `nextReminder` y `activitySummary` no alimentan esa barra y permanecen `unknown`.
- **Deuda abierta**: **#73** `pet-online-pill` -la pildora "En linea" necesita arreglar el pestillo de conectividad del backend (`src/workers/ingestion.drizzle.store.ts:97`) y definir un umbral de silencio, decision G-; **#74** `mobile-metric-selector-a11y` -el contenedor del selector no declara `accessibilityRole="radiogroup"`, asi que TalkBack lee tres controles sueltos, y **nada lo vigila**; handoff ya escrito en `progress/handoff_mobile-home-weekly-activity_a11y.md`-; **#75** `harness-init-force-color` -`init.sh:127-148` compara por cadena un numero que Node colorea y aborta en falso con "Mas de 1 feature en in_progress (1)" si el entorno trae `FORCE_COLOR`; se sortea con `env -u FORCE_COLOR`-. Y sigue **#72**, el flaky de seleccion de foto de add-pet.
- **Implementador: Codex CLI**, con cuota desde el 2026-09-07. Vuelve a valer el reparto entero: quien implementa no revisa.
- **Dependencias nuevas autorizadas** por el humano el 2026-09-07, siempre que la spec las declare (`docs/ui-guidelines.md:171-172`). Sigue en pie el veto **nominal** a `expo-linear-gradient`. La libreria de graficas designada es `react-native-chart-kit`, **siempre** por su subpath `/v2`.
- **Deuda anadida al cerrar #69 y #71**: **#76** `e2e-audit-log-order-assert` -`health-vaccines.e2e-spec.ts:497` asserta un array ordenado sobre un `SELECT` sin `ORDER BY`, asi que cae de forma intermitente bajo carga y ensucia baselines-; **#77** `mobile-home-weight-without-collar` -hoy la tira desaparece entera con el estado de la actividad y el peso se va con ella aunque venga del perfil-; **#80** `mobile-test-double-icon-scope` -los `testID` del doble de `reicon` se atan al componente y no al uso, asi que `Moon` y `Map` emiten los mismos ids fuera de la tira-; **#81** `mobile-quick-actions-typography-lock` -la receta tipografica `text-2xs font-semibold` del tile no esta vigilada: una sonda a `text-xs font-medium` deja la suite **completa** verde-.
- **#78 `mobile-alerts-center` y #79 `mobile-push-registration`** entraron desde otra sesion, no desde esta.
- **C4 gano un punto el 2026-09-08** (`CHECKPOINTS.md`): cuando un candado se anade sobre codigo **ya correcto**, el rojo legitimo es la **mutacion de produccion** versionada en el rojo y revertida en el verde. Mutar un doble de test demuestra que la asercion puede fallar, no que vigile la app.
- **Plantilla de decisiones por elemento repetido, escrita al cerrar #71** y guardada en memoria: **diez** decisiones de conducta por elemento -empezando por **el dato que muestra**, que es el que mas se olvida y el que #69 dejo suelto-, tres estructurales del contenedor -identidad, orden y cardinalidad, esta ultima cerrada con `children.length` y **nunca** contando coincidencias de `testID`- y seis invariantes compartidos. El reviewer audito la primera version del leader y le encontro tres ejes de menos.
- **Deuda transversal detectada en #71, sin id**: los `Pressable` de la app no tienen feedback de pulsado -C8 lo pide y hay **un solo sitio** resuelto en todo el repo-.

## Implementacion activa — #70 mobile-home-reminders-section

- **Inicio**: 2026-09-09 04:20 UTC.
- **Segundo pase iniciado**: 2026-09-09 13:36 UTC, despues del rechazo del reviewer.
- **Tercer pase iniciado**: 2026-09-09 14:47 UTC, despues de la aprobacion del segundo pase y la firma humana de D7 en `4e4efdd`.
- **Cuarto pase iniciado**: 2026-09-09 16:00 UTC, despues de la firma humana de D8 en `28ebba8`.
- **Plan D8**: actualizar solo los valores de `home.reminders` y `home.remindersSeeAll` en ambos idiomas, ajustar cualquier candado literal sin renombrar claves ni mover recuentos, documentar el rojo/verde, actualizar trazabilidad y ejecutar `graphify update .` y el gate integral.
- **Baseline del cuarto pase**: `env -u FORCE_COLOR ./init.sh` termino con exit 0 antes del cambio de copy (backend 163/1243, infra 2/14, movil 68/1078, e2e 25 suites/354 tests pasados y 3 suites/8 tests omitidos; build, lint y typecheck verdes).
- **Evidencia D8**: `e794c96` actualizo el candado literal y dejo `index.test.tsx` rojo con 1 fallo/85 verdes (`Próxima vacuna` esperado, `Recordatorios` recibido). `828889e` cambio solo los cuatro literales de las dos claves aprobadas; `index.test.tsx` y `ui-language.test.ts` quedaron con 2 suites/108 tests verdes. No se renombro ninguna clave, no se movio ningun recuento y `language-provider.test.tsx` quedo intacto.
- **Grafo del cuarto pase**: `graphify update .` termino con exit 0 (724 ficheros, 11289 nodos, 17292 aristas y 711 comunidades) y no produjo cambios versionados.
- **Gate final del cuarto pase**: el primer `env -u FORCE_COLOR ./init.sh` encontro el flaky conocido #72 en `src/screens/add-pet/index.test.tsx`; su reintento dirigido quedo 17/17 verde. La repeticion integral termino con exit 0 (backend 163/1243, infra 2/14, movil 68/1078, e2e 25 suites/354 tests pasados y 3 suites/8 tests omitidos; build, lint y typecheck verdes).
- **Siguiente paso**: reviewer del cuarto pase y repeticion humana del smoke Android con los rotulos de D8; la feature permanece `in_progress`.
- **Branch/worktree**: `feature/70-mobile-home-reminders-section` en `/home/claude/sites/Pet-Tracker` (el worktree recibido en el contexto estaba asociado a #43; no se desmonta ni se altera).
- **Gate D4-D6**: aprobado por el humano en `6eae6ed`; D6 esta firmada en `requirements.md:1106` antes de iniciar este pase.
- **Baseline del segundo pase**: `env -u FORCE_COLOR ./init.sh` en verde antes de tocar los candados (163 suites backend, 2 infra, 68 movil y 25 e2e; lint y typecheck verdes).
- **Veredicto a corregir**: B1 — los dos `it` de R5 cambian `process.env.TZ` dentro de Jest, pero V8 conserva UTC; M1 y M2 dejan verde la invocacion por defecto. O1 entra en alcance por D6: faltan candados de tinta, receta tipografica y pertenencia del icono al arbol.
- **Plan del segundo pase**: sustituir el andamiaje TZ por espias sobre el constructor `Date`; anadir las aserciones de O1 observadas con `within`; probar cada eje de O1 con una sonda temporal de produccion; replantar M1 y M2 por separado como commits rojos de produccion y restaurarlos en commits verdes; rehacer la evidencia en `progress/impl_mobile-home-reminders-section.md`; ejecutar `graphify update .` y el gate final.
- **Evidencia del segundo pase**: candados en `5385ed8` + `238e414`; M1 final `544a525` (rojo 1/1078 sin `TZ`) → `a50245e` (68 suites/1078 tests verdes); M2 final `75dd5c1` (rojo 1/1078 sin `TZ`) → `bcde085` (68/1078 verdes). Las sondas O1 dieron 2 fallos de tinta y un fallo independiente por cada receta de nombre, fecha y texto vacio; produccion quedo restaurada tras cada una.
- **Gate final del segundo pase**: `graphify update .` termino con exit 0 y sin cambios versionados; `env -u FORCE_COLOR ./init.sh` termino con exit 0 (backend 163/1243, infra 2/14, movil 68/1078, e2e 25 suites/354 tests pasados y 3 suites/8 tests omitidos; build, lint y typecheck verdes).
- **Baseline del tercer pase**: `env -u FORCE_COLOR ./init.sh` termino con exit 0 antes de tocar tests (backend 163/1243, infra 2/14, movil 68/1078, e2e 25 suites/354 tests pasados y 3 suites/8 tests omitidos; build, lint y typecheck verdes).
- **Plan D7**: anadir a R5 un `now` con componentes locales y UTC deliberadamente distintos; fijar en R8/R12 la forma de fila vacia y el envoltorio `flex-1`; demostrar los dos ejes O5 con sondas temporales de produccion; versionar solo M9 como par rojo/verde con `bun run test` sin `TZ`; actualizar informe y trazabilidad, ejecutar `graphify update .` y cerrar con el gate integral. Produccion solo se edita para plantar y revertir esas tres sondas.
- **Evidencia D7**: candados en `232c38b`; O5-a y O5-b dejaron por separado 1 fallo/85 verdes en R8 y R12 y se restauraron con diff vacio; M9 `9adea68` dejo la suite completa roja sin `TZ` (1 fallo/1077 verdes) y `4140c2c` la restauro a 68 suites/1078 tests verdes. `format.ts` e `index.tsx` coinciden byte a byte con `4e4efdd`.
- **Grafo del tercer pase**: `graphify update .` termino con exit 0 (723 ficheros, 11281 nodos, 17285 aristas y 717 comunidades) y no produjo cambios versionados.
- **Gate final del tercer pase**: `env -u FORCE_COLOR ./init.sh` termino con exit 0 (backend 163/1243, infra 2/14, movil 68/1078, e2e 25 suites/354 tests pasados y 3 suites/8 tests omitidos; build, lint y typecheck verdes). El flaky #76 no aparecio.
- **Plan**: TDD y commits rojo/verde en el orden aprobado R2 → R4 → R5 → R1 → R6 → R7 → R8 → R9 → R10 → R11 → R12 → R13 → R14 → R15 → R3 → R16 → R17 → R18 → R19; despues, ocho mutaciones de produccion M1-M8, una a una, informe y corrida final unica de `init.sh`.
- **Bloqueo previo al codigo**: `specs/mobile-home-reminders-section/tasks.md` hace incompatible el verde de R1 con su propio paso de implementacion. El test obligatorio exige `reminders-section-body.children` con longitudes `1` (perfil cargado), `1` (detalle pendiente) y `0` (error), pero el paso verde de R1 ordena dejar el cuerpo vacio; los hijos reales se implementan despues en R6, R8 y R9. Respetar ambas instrucciones exigiria adelantar esos requisitos, diferir el assert o introducir un hijo provisional no prescrito. La regla del handoff obliga a parar antes de enmendar una spec aprobada.
- **Premisas desactualizadas detectadas**: la spec dice que el id maximo es 81 y que E2/E3 carecen de feature, pero el arbol ya contiene #83 y #84; la cita `food.tsx:185` tambien se desplazo (el calculo vive ahora en `:65-67` y `:194`). Ademas, M1 no queda verde en UTC con todo R4: el caso de hoy al mediodia produce `-0`, y Jest `toBe(0)` lo distingue. Ninguna de estas premisas autoriza a cambiar la spec sin un nuevo gate humano.

- **Cierre (2026-09-09)**: los dos gates humanos firmados —las ocho enmiendas de
  spec en sus commits (`40413db`, `6eae6ed`, `4e4efdd`, `28ebba8`) y el smoke en
  dev build de Android confirmado de viva voz—. `feature_list.json` #70 a `done`
  (67/85). **Cuatro veredictos del reviewer: el primero rechazado.**
- **Por que se rechazo**: el candado de zona horaria de R5 era inerte.
  `process.env.TZ` asignado dentro de un `it` **no llega a V8 bajo Jest**
  —verificado con sonda en el runner del proyecto: epoch y offset identicos
  antes y despues de asignar—, asi que con el bug de fechas de #68
  reintroducido en produccion el gate entero pasaba en verde. La spec heredo la
  premisa a medias de #68, donde lo que muerde no es el `TZ` sino el espia del
  constructor `Date`, vivo en cualquier zona. D5 cambio el mecanismo.
- **La leccion transversal, y no es sobre zonas horarias**: tres candados de
  esta feature parecian sanos y no lo eran, cada uno por una razon distinta.
  D3: M1 moria **siempre** por `-0` frente a `0` en Jest, no por la zona.
  D5: el mecanismo no llegaba al motor. O4: el candado vigilaba el objetivo
  pero no `now`. **Una mutacion que muere siempre, o que muere por la razon
  equivocada, no demuestra nada.** El unico metodo que los distinguio fue
  plantar y observar, nunca leer el test.
- **Cuatro rondas, cuatro dimensiones nuevas** del elemento repetido: tinta del
  icono y recetas tipograficas (D6), forma de fila del estado vacio y
  envoltorio `flex-1` (D7), y el **orden** de los hijos (O6, sin cerrar). El
  patron ya es predecible, asi que la lista completa se escribio en
  `docs/ui-guidelines.md` §Enmienda #70.
- **El smoke encontro lo que ningun test podia** (D8): titulo "Recordatorios"
  sobre un cuerpo que hablaba de vacunas. Los dos textos eran los que la spec
  pidio. Es el argumento entero a favor del gate humano no delegable.
- **Deuda abierta desde aqui**: **#85** -que la seccion muestre recordatorios
  reales; lleva anotados **O7**, la mitad inglesa de la copy sin candado, y la
  deuda de nombres: los `testID` y las claves `home.reminders*` siguen diciendo
  recordatorios mientras la copy dice vacuna-. **#82** sigue vivo y es
  relevante aqui: `gt(petVaccines.nextDoseAt, after)` es estrictamente mayor,
  asi que una vacuna **de hoy** nunca se devuelve.
- **Incidencia de entorno**: el plugin de Codex en Claude **no funciona en este
  contenedor**. Fuerza su propio sandbox ignorando `~/.codex/config.toml`
  -que ya tiene `sandbox_mode = "danger-full-access"`- y muere antes de ejecutar
  nada con `loopback: Failed RTM_NEWADDR: Operation not permitted`, por falta de
  `CAP_NET_ADMIN`. El binario lanzado a pelo si funciona. Costo ~70 minutos de
  espera contra un proceso vivo que no hacia nada.

---

- Feature: #85 `mobile-home-reminders-real-data`
- Branch: `feature/85-mobile-home-reminders-real-data`
- Inicio: 2026-09-09 17:33 UTC
- Base: `df9b398`; `env -u FORCE_COLOR ./init.sh` verde tras A7 (móvil: 68 suites / 1078 tests)
- Plan: ejecutar R1-R15 en el orden normativo de `tasks.md`, TDD por requisito, sin tocar backend; actualizar trazabilidad tras cada par rojo/verde.
- A7: firmada y leída; traslada el candado inglés del contador a R8. Bloqueo resuelto, implementación reanudada en R1.
- A8: firmada y leída; confirma que M3 aflora solo `rem-sent` porque el tope recorta `rem-cancelled`, sin cambiar fixture, candado ni código.
- A9: firmada y leída; M7/M8 pasan de R3 al refactor de R5, donde existirán también sus dos candados de Home.
- A10: firmada y leída; autoriza el cambio puntual del doble posicional de `hookCall++ % 3` a `% 4`. Deuda estructural registrada fuera de alcance en #86.
- A11: firmada y leída; un `beforeEach` de fichero repone la respuesta vacía de `listReminders` antes de cada test, sin depender del orden.
- A12: firmada y leída; declara R9/R10 de verificación y prescribe P9/P10 fuera de M1-M13.
- A13: firmada y leída; corrige solo la evidencia de P9: desaparece la tarjeta y el cuerpo pasa de 1 a 0; el skeleton no cambia.
- A14: firmada y leída; añade la guarda `upcoming.length === 0` al estado vacío y canda `size={20}` en R6. Base tras `git pull`: `env -u FORCE_COLOR ./init.sh` verde (móvil: 68 suites / 1110 tests).
- Avance: R1-R8 completos. R8 rojo `7dac461`, verde `fecd8e8`; sus tres pruebas y `#70 R11` verdes.
- Avance: R9-R15 completos. R14 cerró 68 suites/1110 tests móviles, typecheck, grep-clean e `init.sh` verdes. R15 replantó las nueve mutaciones no versionadas y auditó las cuatro versionadas; M1-M13 muerden y cada restauración dejó diff vacío. `graphify update .` completado. Pendientes: push, smoke Android humano y reviewer; el PR se abre tras su veredicto.
- Avance A14: candado rojo `56414ff`, guarda verde `47f1020`; P14 quedó sola en `8381d0d` y restaurada en `8e152db`. R6 canda `size={20}` en `992aa13`; la sonda temporal `28` dio `Expected: 20 / Received: 28` y dejó diff vacío al restaurar. Home: 111/111; móvil: 68/1111; `env -u FORCE_COLOR ./init.sh` y `graphify update .`, verdes.

---

## #85 mobile-home-reminders-real-data (cerrada 2026-09-10)

- **Qué entrega**: la Home enseña la proxima vacuna como primera fila fija y
  debajo hasta tres recordatorios reales, solo pendientes y futuros, por fecha
  ascendente. **Cero backend**: `GET /pets/:petId/reminders` ya existia y la
  Home lo reutiliza filtrando en cliente. Lo decidio el explorer al descubrir
  que el contrato del perfil esta congelado y su unica ranura, `nextReminder`,
  es **singular** por diseno documentado: meterle un array habria sido mentirle
  al nombre del campo.
- **Hallazgo de diseno que lo cambio todo**: vacunas y recordatorios son
  entidades **disjuntas**. Dos tablas, dos modulos, cero cruces, y
  `reminders.type` admite `'vaccine'` pero es texto libre **sin FK**. La Home
  puede ensenar la misma vacuna dos veces y **no hay clave para deduplicar**.
  Por eso la vacuna quedo como fila fija separada y no fusionada en el orden:
  elimina de raiz el empate y el comparar un dia civil con un instante.
- **Ocho paradas antes de escribir codigo, las ocho correctas.** Seis fueron
  descuidos de la spec. Merecen quedar escritas por clase, no por numero:
  - **Sujeto ausente** (A7, A9): tests y verificaciones de mutacion que median
    algo que el propio `tasks.md` no creaba hasta tres o cuatro requisitos
    despues. Pasa en R1 porque al escribirlo uno piensa en *todo lo que la
    seccion ensena* en vez de *lo que existe cuando R1 se implementa*. Ya habia
    pasado en #70 (D1). Guardado en memoria.
  - **Evidencia mal predicha** (A8, A13): la mutacion era buena las dos veces;
    lo que fallo fue la frase que decia por que caeria. En A8 se conto el filtro
    y se olvido el tope de tres; en A13 se atribuyo el rojo al esqueleto, que
    depende de otra cosa. **Cuando una spec prescribe el `it` exacto que debe
    caer, esa prediccion tiene el mismo peso normativo que la mutacion.**
  - **Premisas falsas sobre el arnes** (A10, A11): el doble posicional de
    `useApi` codificaba la aridad de la pantalla, y `jest.clearAllMocks()` **no
    restaura el valor por defecto de una factoria** -limpia llamadas, no
    implementaciones-, asi que la fixture de R5 contaminaba los `describe`
    heredados.
  - **Requisitos sin rojo posible** (A12): R9 y R10 asertaban lo que R5 y R6 ya
    implementaban. Es el quinto punto de C4, y lo revelador es que **R7 y R12 si
    llevaban su sonda**: la distincion se conocia y se aplico de forma desigual.
- **El smoke volvio a encontrar lo que la suite entera daba por bueno**: la
  tarjeta "Sin vacuna proxima" pintada encima de tres recordatorios, porque
  miraba solo su propia rama. Segunda feature seguida con un defecto de esta
  clase -en #70 fue un titulo diciendo "Recordatorios" sobre un cuerpo de
  vacunas-. Los tests miran cada rama por separado; el ojo humano ve la pantalla
  entera. Es el argumento entero a favor del gate no delegable.
- **O1 del reviewer**: el `size={20}` del icono de fila sin candado, medido en
  68/1110 verde. No lo tapaba el recuento de literales de #70 R13 porque la fila
  nueva renderiza **por variable**, que es justo lo que R6 exige: el acierto de
  R6 abria el hueco. Cerrado en A14.
- **Cierre**: reviewer aprobado en dos pases -el segundo por A14, que toco
  produccion despues del primero-, con M1, M9 pura, M10, M11, M13, P14 y la
  sonda del `size` reproducidas por el en worktree desechable. Gate
  `env -u FORCE_COLOR ./init.sh` exit 0 llegando al final, asi que lint y
  typecheck si corrieron. Smoke en dev build confirmado por el humano.
  `feature_list.json` #85 a `done` (68/86).
- **Deuda abierta desde aqui**: **#86** -el doble posicional de `useApi` acopla
  el test al numero de peticiones de la Home, asi que la proxima feature que
  anada una lo rompera igual-; **#82** y **#84**, declarados como defecto
  heredado y no introducido.
- **Lo que dejo en el harness**: la nota de `docs/ui-guidelines.md` §Enmienda
  #70 -**inventariar no es candar**-, escrita porque la carta nombraba "tamano
  de icono" y la spec lo copio en prosa sin convertirlo en `expect`. Y en
  memoria, [[sujeto-ausente-en-tasks]].


## #76 e2e-audit-log-order-assert (cerrada 2026-09-10)

- **Qué entrega**: `backend-pet-tracker/test/health-vaccines.e2e-spec.ts` ordena
  la consulta del audit log por `(at, id)` antes de asertar la secuencia
  create→update→delete. Diff de un archivo, tres ediciones, cero producción.
- **Por qué existía**: sin `ORDER BY` el orden de un `SELECT` no está definido;
  aislado pasaba, con la suite entera y el heap con huecos cayó en `main`
  9358cc7 el 2026-09-08.
- **C4 sin rojo, por escrito**: el defecto es el test, no hay rojo reproducible.
  La evidencia es una mutación `asc`→`desc` no versionada, ejecutada por Codex y
  reproducida por el reviewer (falla solo ese `it`, solo por `toEqual`, `Received`
  invertido). El humano firmó la excepción en la misma casilla de aprobación.
- **Barrido (R3)**: único hallazgo en `test/`; los demás `select` multi-fila
  son order-safe (`toHaveLength`, `.find()`, `arrayContaining`). Verificado
  línea a línea por el spec_author, repetido por Codex y por el reviewer.
- **Estabilidad (R4)**: tres corridas consecutivas de la suite e2e, mismo
  `Tests: 354 passed, 362 total`, más `env -u FORCE_COLOR bash ./init.sh` exit 0.
- **Cómo se trabajó**: primera feature desde un worktree propio
  (`/home/claude/sites/Pet-Tracker-wt-backend`) con la sesión Frontend activa en
  el árbol principal. Protocolo: `pgrep -af 'init\.sh'` antes de cada gate y
  aviso cruzado por SendMessage; `feature_list.json` editado por línea, nunca
  con dump del JSON. Cero colisiones.
- **Deuda que toca**: #75 (`FORCE_COLOR` rompe `init.sh`) sigue abierta; todo
  gate se corre con `env -u FORCE_COLOR`. Siguiente backend sin decisión humana
  pendiente: #82.

## #82 vaccine-due-today-inclusive (cerrada 2026-09-10)

- **Qué entrega**: `GET /v1/pets/:petId` calcula `nextVaccine` desde el día civil
  en `users.timezone` del owner (`localDayOf`, fallback a UTC con `warn`) y con
  `gte`: la dosis de hoy es la próxima hasta que acaba el día local. Solo
  backend, diez archivos, contrato intacto. `after` → `from` en el puerto.
- **Por qué existía**: el lector filtraba `gt` contra el hoy UTC del servidor; la
  pestaña Salud compara `>= hoy` local. El día de la dosis, Salud la enseñaba y
  la Home no; en UTC negativo la Home la perdía horas antes.
- **Decisión de zona**: owner, no requester ni dispositivo. La zona ya vivía en
  `users.timezone` (registro) y activity (#10) ya tenía el patrón; el móvil no
  manda nada. Acordado con la sesión Frontend para no pisar #87 (Home y Salud).
- **Parada de Codex (A1)**: `alerts-engine-consumer.service.spec.ts:109` tipa un
  `MockOf<PetRepository>` exhaustivo; el método nuevo del puerto rompía el
  typecheck con jest verde. Décimo archivo, una línea, enmienda firmada.
  Memoria: [[dobles-exhaustivos-de-puertos]].
- **Candados**: e2e hoy/ayer/mañana con Kiritimati/Pago_Pago (rojo a cualquier
  hora si UTC o requester), family en otra zona, owner `'Not/A/Zone'` → 200.
  M1 `gte→gt` y M2 zona `null` (ciega para el unitario) reproducidas por el
  reviewer. Suite e2e dos veces con `357 passed`; `init.sh` exit 0.
- **Deuda**: #88 `vaccine-applied-at-owner-timezone` (`appliedAt <= hoy UTC` en
  el DTO, 400 por la tarde en zonas negativas).
- **Cierre en dos corridas**: el primer `init.sh` de cierre salió rojo por el
  flake #72 (`add-pet/index.test.tsx`, "uploads a chosen preview only after
  createPet succeeds"), con cero archivos móviles en el diff y backend/e2e
  verdes; la segunda corrida, sin tocar nada, exit 0 con `1111 passed` en móvil.
  El leader leyó "exit 0" de la notificación de fondo cuando era el del `echo`
  y commiteó el cierre antes de mirar el log: el PR se abrió solo tras la
  corrida verde. Lección: leer siempre la última línea del log, no el estado
  de la tarea.

## #88 vaccine-applied-at-owner-timezone (cerrada 2026-09-11)

- **Qué entrega**: `POST/PATCH /v1/pets/:petId/vaccines` validan `appliedAt` contra
  el día civil en `users.timezone` del owner, en el use case y con `now` inyectado
  desde el controller. El DTO solo valida formato. `VaccineAppliedInFutureError`
  mapeado al mismo 400 de zod. Helper `ownerLocalDay(pets, petId, now)` compartido
  con `GetPetUseCase` (#82), con fallback UTC + warn.
- **Por qué existía**: el DTO comparaba con el hoy UTC del servidor: 400 indebido
  para zonas positivas tras su medianoche y futuro aceptado para zonas negativas
  por la tarde. El enunciado original tenía la dirección invertida; se corrigió
  con `Intl` antes de especificar.
- **Premisa del leader corregida por el spec_author**: `UpdateVaccineUseCase` no
  inyectaba `PetRepository`; gana el parámetro y el `it` posicional de #14 se
  adapta. Inventario de once archivos, sin dobles exhaustivos afectados (no se
  añaden métodos a puertos).
- **Cierre limpio**: diez commits rojo→verde en orden, verde mínimo por commit,
  reviewer aprobado a la primera (rojos en worktree desechable, M1 día UTC y M2
  `<=`→`<`, dos corridas e2e con `359 passed`, `init.sh` exit 0 sin flake #72,
  hashes de trazabilidad verificados con `merge-base --is-ancestor`).
- **Coordinación**: la sesión Frontend tenía un bucle que relanzaba su `init.sh`
  al no ver otro vivo, sin mirar `test:e2e`; se detectó antes de chocar y lo
  mató. Memoria: `pgrep -af 'init\.sh|test:e2e|jest-e2e'`.
- **Deuda**: #89 `dto-dates-owner-timezone` (`weight.dto.ts` con margen +1,
  `create-pet.dto.ts` birthDate; en create-pet la zona es la del requester).
---

## 2026-09-11 — #87 `mobile-tanstack-query` (cerrada)

## Feature #87 — mobile-tanstack-query (activa)

- **Branch**: `feature/87-mobile-tanstack-query` (rebasado sobre `main` @ 7f298f2)
- **Inicio**: 2026-09-10
- **Estado**: `in_progress` — spec **aprobada** por el humano el 2026-09-10, handoff a Codex CLI entregado
- **Prioridad**: P2

Migracion del fetching movil de `src/hooks/use-api.ts` a TanStack Query.
Decidida por el humano el 2026-09-10 al revisar la spec de #78.

Spec: `specs/mobile-tanstack-query/` — 20 requisitos, los cuatro ficheros en
`approved`. Implementa **Codex CLI**, no un subagente. Mientras Codex trabaja,
esta sesion no toca `mobile-pet-tracker/`: solo `docs/`, `specs/`, `progress/`
y `feature_list.json`.

Rebase hecho sobre `main` @ 7f298f2 (merge de #76 / PR #118).

## Feature #78 — mobile-alerts-center (en espera, NO abandonada)

- **Branch**: `feature/78-mobile-alerts-center`, pusheado (`99f5f2d`, `1e4af3a`)
- **Estado**: `spec_ready`, frontmatter en `draft`, pendiente del gate humano
- **Espera a #87 por decision del humano**, para que la pantalla de alertas se
  escriba una sola vez sobre el patron final en vez de con acumulacion manual de
  paginas que #87 reescribiria.
- Cuando #87 cierre hay que **enmendar R1, R8, R9 y R11** de
  `specs/mobile-alerts-center/`: pasan de acumulacion manual + refetch por foco a
  `useInfiniteQuery` + `invalidateQueries`. `design.md` y `tasks.md` con ellos.
- Las cinco decisiones que el humano tenia que firmar siguen abiertas y se firman
  con la spec ya enmendada, no antes.

### Por que dos features en vuelo

No se viola "una sola in_progress": #78 esta `spec_ready`, no `in_progress`, y su
branch queda quieto. El guard de `init.sh` cuenta por arbol de trabajo, asi que
tampoco choca con la sesion Backend que lleva #76 en su propio worktree.

### Incidencia del entorno (2026-09-10)

`init.sh` aborta en este VPS con `❌ Más de 1 feature en in_progress (0)` habiendo
**cero**. Es el bug **#75 `harness-init-force-color`**, todavia `pending`: el
entorno tiene `FORCE_COLOR=3`, Node imprime el numero coloreado y la comparacion
por cadena de `init.sh:138` no matchea `"0"`. **Todo gate de esta sesion tiene que
lanzarlo como `env -u FORCE_COLOR bash ./init.sh`.**

### Coordinacion con la sesion Backend

Lleva #76 en `/home/claude/sites/Pet-Tracker-wt-backend`. Comparten el Postgres de
docker: `pgrep` y aviso mutuo antes de cada `init.sh`. Id #87 reservado y avisado.

### Evidencia cruzada sobre el flake #72 (2026-09-10)

`#72 mobile-add-pet-photo-test-flake` está `pending` con prioridad **P3**, y hay
razón para subirla:

- El `reviewer` de #87 midió la tasa en la base, sin nada de #87 encima:
  **2 de 13** pasadas completas de la suite móvil en rojo.
- La sesión Backend reportó que su **primer `init.sh` de cierre de #82 cayó por
  ese mismo test** (`add-pet`, *"uploads a chosen preview only after createPet
  succeeds"*) con **cero archivos móviles en su diff**; la segunda corrida salió
  verde sin tocar nada.

Es decir: el flake ya está tumbando gates de features que no tocan el móvil, y
obliga a repetir corridas de `init.sh` completas. El coste real no es el test,
es el tiempo de gate de cualquier feature del repo y el riesgo de que alguien
normalice el "vuelve a correrlo, seguro que pasa" y con eso se cuele un rojo de
verdad.

### Cierre

- `reviewer` aprobado en la **ronda 2** (`progress/review_mobile-tanstack-query.md`).
  La ronda 1 rechazó por dos carreras asíncronas en tests, sin tocar producción.
- Gate humano firmado el 2026-09-11: smoke en dev build de Android, rutas cargando.
- El rebase sobre `main` @ `f3e3280` invalidó los 42 hashes de `traceability.md`
  y del reporte de impl; se reapuntaron verificando `merge-base --is-ancestor`
  uno a uno. Para la próxima, mergear `main` en vez de rebasar cuando la
  trazabilidad ya está escrita.

## 2026-09-11 — #89 `dto-dates-owner-timezone` (cerrada)

## Feature #89 — dto-dates-owner-timezone

- **Branch**: `feature/89-dto-dates-owner-timezone` (desde `origin/main` @ 381d1e36, merge de #88 ya integrado)
- **Worktree**: `/home/claude/sites/Pet-Tracker-wt-backend` (el worktree principal lo ocupa #78, sesion Frontend)
- **Inicio**: 2026-09-11
- **Estado**: `in_progress` -> handoff a Codex CLI (spec aprobada por el humano en 62992e82)
- **Prioridad**: P3

### Plan

1. `init.sh` de base sobre `origin/main` en este worktree (con `env -u FORCE_COLOR`, bug #75 sigue `pending`).
2. `spec_author` escribe `specs/dto-dates-owner-timezone/` (requirements EARS + design + tasks + traceability).
3. **PARADA**: gate humano de aprobacion de la spec (frontmatter `approved` en branch, flujo de aprobacion por commit).
4. Handoff a Codex CLI con la spec autosuficiente.
5. `reviewer` con `init.sh` en primer plano.

### Por que #89

Continuacion directa de #88 (mergeada hoy en PR #120): mismo sesgo UTC, mismos modulos, patron
`ownerLocalDay` ya en `main`. El humano pidio el 2026-09-11 continuar la linea de #88; #88 ya
estaba `done` y mergeada, asi que la siguiente es su deuda declarada.

### Coordinacion con la sesion Frontend

Sesiones paralelas sobre el mismo Postgres de docker. Antes de cada `init.sh` se comprueba que no
haya otro corriendo (`pgrep -f "^bash ./init.sh"`). Mensaje a la sesion Frontend con las dos
preguntas que la spec debe cerrar: formato de `measuredAt` y `birthDate` que manda el movil
(fecha civil o instante UTC) y si alguna pantalla depende del margen de +1 dia en pesos.

### Avance 2026-09-11

- `init.sh` de base verde en este worktree sobre 381d1e36 (`env -u FORCE_COLOR`, exit 0; backend, infra, movil y e2e sin rojos).
- `spec_author` entrego `specs/dto-dates-owner-timezone/` en cf51a1a9. Anade Bloque D (PATCH `/v1/pets/:petId`): `UpdatePetSchema = PetFieldsSchema.partial()` hereda el `refine` UTC, asi que quitarlo del DTO sin mover la regla al use case dejaria PATCH sin validar.
- Respuesta de Frontend incorporada como premisa verificada (fecha civil del dispositivo, nada depende del margen +1) y deuda movil nombrada en §Fuera de alcance sin id.
- Decisiones que el humano ratifica o enmienda en el gate: D2 (sin margen, coherente con #88), D3/D7 (zona del requester en POST, del owner en PATCH), literal del mensaje de pesos.
- Gate humano firmado en 62992e82 (tres casillas, sin enmiendas). Frontmatter a `approved`, #89 a `in_progress`.
- Handoff en `progress/handoff_dto-dates-owner-timezone.md`. Mientras Codex implementa, esta sesion no toca `backend-pet-tracker/`.
- Codex de #78 corre en paralelo en el worktree principal: los gates se turnan con `pgrep -af 'init\.sh'`.

### Cierre

- Codex: trece commits bd97047c..198d67b1, veintidós archivos justos, reporte en `progress/impl_dto-dates-owner-timezone.md`.
- Reviewer: APROBADO sobre 198d67b1 (`progress/review_dto-dates-owner-timezone.md`): seis rojos reproducidos por checkout, M1-M3 reproducidas, barrido y candados sin diff, `init.sh` verde en primer plano en una corrida. Única nota: `files_affected` de #89 corregido a la lista de veintidós.
- `feature_list.json` #89 -> `done`. PR abierto por el leader; mergea el humano.

---

# Sesion #78 mobile-alerts-center (cerrada 2026-09-13)

## Feature #78 — mobile-alerts-center (in_progress, handoff entregado a Codex CLI)

- **Branch**: `feature/78-mobile-alerts-center`, worktree principal
  `/home/claude/sites/Pet-Tracker`.
- **Estado**: `spec_ready`. La spec la aprobo el humano el 2026-09-10
  (`09f1f309`, casilla de §Aprobacion marcada). Falta el gate de las enmiendas.

### Lo que hizo esta sesion (2026-09-11)

1. `git merge origin/main` (`d07427e9`) y `git merge origin/feature/78-...`
   (`2451b66d`) sobre la branch: trae #87 y la firma humana de la spec.
   **Merge, no rebase** — la leccion de #87 con los hashes de trazabilidad.
2. Enmienda **E1-E8** a `specs/mobile-alerts-center/` (`ecb449ee`), porque #87
   `mobile-tanstack-query` se mergeo en `main` (`cea72945`, PR #121) **despues**
   de que el humano firmara la spec y borro `src/hooks/use-api.ts`, sobre el que
   descansaban R4, R8, R9 y R11.

### Las ocho enmiendas, en una linea cada una

| # | Que cierra |
|---|---|
| E1 | Deroga la premisa "no hay TanStack Query" de §0.4 y el punto (4) de §Aprobacion |
| E2 | `alertKeys` en `src/api/query-keys.ts` — obligatorio: `#87 R19` prohibe `queryKey: [` literal en Home |
| E3 | `useInfiniteQuery` en lugar de acumular paginas con `useState` |
| E4 | Los tres estados de la pantalla salen de la query; el `signOut` del `unauthorized` lo hace el `QueryCache` |
| E5 | El ack sigue siendo llamada plana + overlay: ni `useMutation` ni `setQueryData` (moveria la fila, contra R7) |
| E6 | La campana pasa a `useQuery`; **no** se adopta `invalidateQueries`, con la condicion escrita que lo revive |
| E7 | Referencias de linea reapuntadas tras la migracion de #87 |
| E8 | R13 hereda los cuatro candados de #87; unico delta declarado: `'screens/alerts/index.tsx': 1` en `screenSignOutCalls` |

### Gates humanos: los dos firmados

- [X] Spec aprobada — `09f1f309` (2026-09-10), refrescada a 2026-09-11 en
      `4f9298e0`. Con ella, las cuatro decisiones de §Aprobacion; la (4) queda
      derogada por E1.
- [X] **Enmiendas E1-E8 aprobadas** — `4f9298e0` (2026-09-11).

### Ronda 2: reviewer APROBADO (2026-09-11)

- Veredicto **aprobado** en `progress/review_mobile-alerts-center.md` (ronda 2
  arriba, ronda 1 conservada debajo como historial).
- Codex corrigio con **un solo fichero tocado**, y es de test
  (`src/screens/alerts/index.test.tsx`): cero produccion, cero cifras de
  candado movidas.
- El reviewer **replanto el las dos mutaciones**: la de R6 da 3 fallos, todos
  en la asercion nueva del orden interno, con los otros 23 tests verdes; la de
  R4 da 1 fallo en la suya. Rojo por la asercion nueva y por ninguna otra.
- `env -u FORCE_COLOR bash ./init.sh`: exit 0 en una corrida, sin que cayera el
  flake #72. Backend sube a 165/1268 y e2e a 362 por el merge de #89; el movil
  sigue en 73/1230, que es lo correcto: las correcciones son aserciones dentro
  de `it` existentes, no `it` nuevos.
- 41 hashes citados, todos ancestros de HEAD. Mergear en vez de rebasar evito
  repetir el reapuntado de #87.

### Lo unico que falta: el gate humano R14

**#78 NO pasa a `done`** hasta que un humano firme las seis casillas del smoke
en un **dev build de Android** (`specs/mobile-alerts-center/requirements.md`
§R14). Aviso practico del reviewer: la alerta de prueba tiene que ser de una
mascota **con dispositivo y suscripcion vigente**, o el `INNER JOIN` del
backend la esconde y el smoke da un falso negativo.

### Ronda 1: reviewer RECHAZO (2026-09-11)

- `reviewer` **rechazado** (`progress/review_mobile-alerts-center.md`), por
  **un hallazgo bloqueante y uno menor, los dos SOLO DE TEST**:
  1. **R6 decision 12**: intercambiar los dos `<Text>` de la columna de la fila
     —el `petName` pasa a pintarse encima del tipo— deja la suite **entera
     verde** (73 suites, 1230 tests). El candado de orden se paro en
     `row.children`; dentro de `row.children[1]` los tres textos se buscan con
     `getByTestId`, agnostico al orden.
  2. **R4.1**: la receta tipografica del titulo (`text-2xl font-black
     text-foreground`) no tiene `expect`; degradarla deja todo verde.
- **Aceptado** lo demas: E1-E8 una a una, trazabilidad limpia salvo R14, los 37
  hashes resuelven y son ancestros de HEAD, las tres cifras movidas declaradas
  como suma, sonda de R13 verificada y cero drift. El reviewer corrio `init.sh`
  dos veces, exit 0 las dos, sin que cayera el flake #72.
- Handoff de correccion en **`progress/handoff_mobile-alerts-center_fix1.md`**,
  con sonda en rojo obligatoria para cada asercion nueva.
- Pendiente del leader al mergear `main`: `STATUS.md` quedo desactualizado por
  el alta de #90; se actualiza cuando el recuento sea estable.

### Ronda 1, lo que reporto Codex: R1-R13 implementados; R14 reservado al humano

- **Inicio**: 2026-09-11 15:23 UTC.
- Preflight `env -u FORCE_COLOR bash ./init.sh`: verde antes de tocar código
  (build, tests, e2e, lint y typecheck).
- Skills cargadas: `expo-overview`, `expo-router`, `expo-data-fetching`,
  `expo-native-ui`, `expo-ui`, `appllama-app-design-skill` y Ponytail `full`;
  documentación oficial de Expo SDK 57 consultada en su URL versionada.
- R1→R13 completados en el orden de `tasks.md`, con commits rojo/verde y
  trazabilidad cerrada. Evidencia completa en
  `progress/impl_mobile-alerts-center.md`.
- Verificación final `env -u FORCE_COLOR bash ./init.sh`: exit 0 (build, suites,
  e2e, lint y typecheck).
- R14 queda reservado al humano: smoke en dev build de Android con una alerta
  `open` real. Hasta su firma, #78 conserva el estado `in_progress`.

- `feature_list.json`: #78 pasa a **`in_progress`** (2026-09-11).
- Handoff escrito en **`progress/handoff_mobile-alerts-center.md`**. El humano
  lo corre en su terminal; esta sesion **no** toca `mobile-pet-tracker/`
  mientras tanto (un solo escritor sobre el working tree).
- Implementación lista para que el `reviewer` lea
  `progress/impl_mobile-alerts-center.md`; el PR lo abre el leader tras su
  veredicto.
- Queda para el final el gate humano **R14**: smoke en **dev build de Android**
  con una alerta `open` real. No delegable a IA.

### Coordinacion con la sesion Backend (2026-09-11)

- Backend trabaja **#89 dto-dates-owner-timezone** en
  `/home/claude/sites/Pet-Tracker-wt-backend`, branch
  `feature/89-dto-dates-owner-timezone`. #88 ya esta mergeada (PR #120).
- Postgres de docker compartido: `pgrep` antes de cada `init.sh`. Esta sesion
  **no** ha lanzado `init.sh` (trabajo solo de spec).
- Respondido a sus dos preguntas sobre fechas en el movil:
  - `measuredAt` y `birthDate` viajan como **fecha civil `YYYY-MM-DD` en la zona
    del dispositivo**, nunca como instante UTC
    (`app/(tabs)/weight-log.tsx:39-44` `localTodayIso()`,
    `screens/add-pet/index.tsx:34-39` `dateToIso`).
  - **Ningun** test movil depende del margen de +1 dia en pesos; las fixturas son
    fechas pasadas fijas o `localTodayIso()`. Ya existe el camino de error
    (`weight-log.test.tsx:380` mapea el 400 `Date is in the future`).
  - Riesgo que se les traslada: la zona del **dispositivo** puede no ser la del
    owner; hoy el margen de +1 dia lo absorbe.
- **Decision de Backend (2026-09-11)**: #89 va **sin margen**, validando contra
  `users.timezone` del owner, por coherencia con lo que #88 fijo para
  `appliedAt`. El caso "dispositivo por delante del owner" queda en su
  §Fuera de alcance para que lo decida el humano en el gate. La forma del 400 se
  mantiene byte a byte, asi que `src/api/health-records.ts:132` sigue valiendo.
- **Deuda movil que nace si #89 mergea asi** (registrar como feature cuando el
  humano firme, no antes): el movil manda la fecha civil del **dispositivo** y
  tendria que mandar la del owner, o al menos explicar el 400. Afecta a
  `app/(tabs)/weight-log.tsx` (pesos) y a `screens/add-pet/index.tsx`
  (`birthDate`, que con #89 pasa a aceptar hoy a cualquier hora, o sea mejora).
  **Id abierto el 2026-09-11 como #90 `mobile-owner-timezone-dates`** (`pending`,
  P2), despues de que el humano firmara el gate de #89 con la decision por
  defecto (verificado: casilla `[X]` en
  `specs/dto-dates-owner-timezone/requirements.md:701`). Id contrastado contra
  `origin/main` y contra la branch de #89: el maximo era 89 en las dos.
  **Ojo al mergear**: el `feature_list.json` de esta branch no tiene aun la
  entrada de #89 —vive en `feature/89-dto-dates-owner-timezone`—, asi que las
  dos entradas caen en el mismo sitio del array y el merge a `main` pedira una
  resolucion trivial: conservar las dos, #89 antes de #90.
  Anclaje verificado el 2026-09-11: la deuda queda nombrada en
  `specs/dto-dates-owner-timezone/requirements.md:661-673` §Fuera de alcance
  (branch `feature/89-dto-dates-owner-timezone`, `cf51a1a9`), con la condicion
  escrita de que el id lo abre esta sesion solo si el humano firma #89 con la
  decision por defecto.

### Recordatorio de entorno

`init.sh` abortaba en falso en este VPS con `FORCE_COLOR` (#75). Arreglado y mergeado a
`main` en `572a24e4`: desde ahi ya no hace falta `env -u FORCE_COLOR`. Las ramas salidas
de un commit anterior a ese merge todavia lo necesitan.

## 2026-09-13/14 — #91 mobile-tab-indicator-out-of-range (cerrada)

## Feature: #91 mobile-tab-indicator-out-of-range

- **Inicio:** 2026-09-13
- **Rama:** `feature/91-mobile-tab-indicator-out-of-range`, creada desde `origin/main` en
  `072cff40` (merge del PR #123, cierre de #78)
- **Estado:** `in_progress`. Spec escrita (`ebc61b73`) y **firmada por el humano** en
  `95354a19` el 2026-09-12; frontmatter de los cuatro archivos pasado a `approved`.
  Siguiente paso: el humano corre el handoff en Codex CLI. Mientras Codex implementa,
  esta sesion no toca `mobile-pet-tracker/`.
- **Reparto acordado con el humano:** el lado movil (#91) lo lleva esta sesion; la feature
  #73 `pet-online-pill` se paso a la sesion Backend, que trabaja en el worktree
  `/home/claude/sites/Pet-Tracker-wt-backend`. Sin solape de archivos: #91 solo toca
  `mobile-pet-tracker/src/components/floating-tab-bar.tsx` y su test; #73 toca
  `backend-pet-tracker/src/workers/ingestion.drizzle.store.ts` y
  `mobile-pet-tracker/src/app/(tabs)/home.tsx`.

### Plan

Spec del defecto del indicador de la barra de pestanas: la burbuja se posiciona con
`state.index * tabWidth` (indice sobre `state.routes`, que incluye todas las rutas del
grupo `(tabs)/`) mientras la geometria se calcula sobre `TABS.length` (cinco ranuras).
Cualquier ruta fuera de `TABS` cae en indice >= 5 y la burbuja sale del rango. El arreglo
deriva la posicion de `TABS` via `activeRouteName`, sin dependencias nuevas.

Verificado en el arbol antes de especificar: hay **dos** sitios que posicionan la burbuja
—el `useEffect` y `handleLayout`—, no uno; los dos entran en el alcance. El fixture
`routes` del test solo contiene las cinco rutas de `TABS`, asi que el caso nuevo exige
extenderlo.

### Bloqueos y observaciones

- `./init.sh` **aborta** en la comprobacion del harness con
  `Mas de 1 feature en in_progress (0). Resolver antes de continuar.` y el `0` envuelto
  en codigos de color ANSI. Es la feature #75 `harness-init-force-color`: Claude Code
  exporta `FORCE_COLOR=3`, Node colorea los valores no-string de `console.log`, y la
  comparacion `[ "$IN_PROGRESS" = "0" ]` falla contra la cadena coloreada; el `else`
  llama a `fail`, que con `set -e` sale con codigo 1.

  **Correccion del registro:** esta sesion anoto antes "sale con codigo 0, no bloquea".
  Era falso y el error fue de medicion: se lanzo `./init.sh 2>&1 | tail -40`, y el codigo
  de salida de un pipeline es el de `tail`, no el de `init.sh`. El arranque **si** se
  cortaba ahi, y las suites nunca llegaron a correr en esta sesion.

  Arreglado aparte, a peticion del humano, en la rama `feature/75-harness-init-force-color`
  (commit `f3b3016e`, PR #124), hecho en el worktree `Pet-Tracker-wt-75` para no tocar el
  working tree principal mientras Codex implementa #91. Sigue fuera del alcance de #91.

### Baseline de la suite en 072cff40

La sesion Backend corrio `./init.sh` en su worktree sobre el mismo commit y reporto:
backend 25 suites / 362 tests, movil 73 suites / 1230 tests. Sirve de referencia para
declarar el delta de #91 en el gate, no como cifra congelada: lo que se compara es el
delta contra este commit.

Esa linea base es valida pese al defecto de #75: la sesion Backend confirmo que en su
entorno `FORCE_COLOR` esta unset, que su log no trae el aviso del harness y que el
`exit=0` lo capturo sin pipe (`./init.sh > log; echo exit=$?`). El defecto solo muerde
en sesiones que exportan la variable.

### Gate de la spec — verificado

El commit de firma `95354a19` toca **un solo archivo**, `requirements.md`, y un solo
renglon: la casilla de §Aprobacion. Cero drift de codigo colado en el gate.

Correccion aplicada por el leader antes de commitear la spec: el `spec_author` escribio
"los ocho `describe` existentes" en `floating-tab-bar.test.tsx` y son **siete**
(`R1`-`R5`, `R7`, `R8`, sin `R6`). Se corrigio en `tasks.md` §T0 y `design.md` §Archivos
afectados, y se anadio el aviso de que los cinco `describe` nuevos van prefijados
`#91 R...` para que Codex no renumere los viejos.

### Handoff

Prompt de handoff a Codex CLI entregado al humano en el chat de la sesion. Codex escribe
`progress/impl_mobile-tab-indicator-out-of-range.md`; el handoff es por disco. Cuando el
humano confirme que Codex termino, esta sesion lanza `reviewer`.

### Veredicto del reviewer

**APROBADO** — `progress/review_mobile-tab-indicator-out-of-range.md`, sobre el HEAD
`1a57f1aa` y los 24 commits de Codex (`622a94de`..`26ca348f`). Sin bloqueantes.

El reviewer no acepto el reporte de Codex como evidencia: corrio `init.sh` el mismo
(exit=0 medido sin pipe, sorteando el defecto #75 con `env -u FORCE_COLOR`) y reprodujo
los cinco rojos y los dos de mutacion en un worktree desechable. Movil 1230 -> 1236
tests, los seis `it` nuevos exactamente.

Dos comprobaciones que valia la pena hacer:

- El commit intermedio de R3 (`6863488b`) **no relajo la asercion**: solo amplio la
  ventana del temporizador de 300 a 400 ms; el esperado `137.6` quedo intacto y el rojo
  se mantuvo en los dos estados (`206.32` a 300 ms, `206.39999999999998` a 400 ms).
- **M1 y M2 no venian versionadas**, asi que el reviewer las reprodujo, cada una con la
  otra revertida: M1 pone rojo `#91 R3`, M2 pone rojo `#91 R2`. R7 cierra con una
  mutacion por sitio, que es lo que la spec exigia.

Verificado por el leader: cero drift de codigo entre el ultimo commit de Codex y el HEAD
revisado (`git diff 26ca348f..HEAD -- mobile-pet-tracker/` vacio).

### Lo que falta para cerrar #91

**R8, el gate humano**: prueba de humo en dev build de Android (no Expo Go), guion en
`progress/impl_mobile-tab-indicator-out-of-range.md` §R8. Hasta que el humano lo corra,
#91 se queda en `in_progress`: el veredicto del reviewer no basta cuando la feature
tiene un requisito que solo cierra una persona.

### Deuda registrada por el reviewer (no bloqueante)

1. R3 quedo con ventana de temporizador de 400 ms donde la spec fijo 300. La asercion
   normativa no se movio. Leccion para specs futuras con `withSpring`: derivar la
   ventana de la duracion real en vez de fijarla a ojo.
2. `622a94de` no lleva R-id porque es la tarea T0; un sufijo `(T0)` lo habria hecho
   legible desde `git log`.
3. La tercera observacion —#75 vivo en `main`— quedo **obsoleta**: el PR #124 se mergeo
   en `572a24e4` mientras corria la revision.

### Cierre

R8 **PASS**: el humano corrio los cuatro pasos del guion en su dev build de Android el
2026-09-14 sobre `b5faca09` y confirmo que sale bien. Con el veredicto del reviewer ya
aprobado y el gate humano cerrado, #91 pasa a `done` (75/91) y `STATUS.md` queda
sincronizado. PR #125 abierto contra `main`, a la espera del merge humano.

Aparte, en la misma sesion: se arreglo #75 (`harness-init-force-color`) en la rama
`feature/75-harness-init-force-color`, mergeada a `main` en `572a24e4` (PR #124). Sigue
en `pending` en `feature_list.json` a la espera de que el humano decida su estado, porque
se cerro por la excepcion de harness, sin spec ni reviewer.

### Cierre administrativo de #75 (2026-09-14)

#75 `harness-init-force-color` pasa a `done`. Su codigo lleva en `main` desde `572a24e4`
(PR #124) con el CI verde. Se cerro por la excepcion de `CLAUDE.md` §Cuando NO aplica
este rol —arreglo de archivos del harness, no de la aplicacion—, asi que no tuvo spec ni
veredicto de `reviewer`: el gate fue el humano al mergear el PR, y la decision de marcarla
`done` es suya, del 2026-09-14.

El cambio de estado viaja en la rama de #91 a proposito. Hacerlo en una rama propia
habria dejado dos PRs declarando cada uno `75/91` en `STATUS.md` por razones distintas, y
un conflicto seguro en esa linea al mergear el segundo. Yendo junto, el contador queda en
`76/91`, que es el numero correcto cuando #91 y #75 esten las dos en `main`.


---

# Sesión #73 pet-online-pill (cierre de implementación, 2026-09-14)

- Branch `feature/73-pet-online-pill`, worktree
  `/home/claude/sites/Pet-Tracker-wt-backend`.
- Codex ejecutó R1-R10 en orden TDD; los rojos/verdes de R1-R9 y sus hashes
  están en `specs/pet-online-pill/traceability.md`. R2 y R3 comparten el verde
  `f92f0736` por diseño de la tarea.
- R10 deja cinco sondas de mutación, grep-clean, alcance sin los archivos
  prohibidos y la corrida final `./init.sh` con exit 0 en
  `progress/impl_pet-online-pill.md`.
- R11 no se ejecutó: queda el guion literal en dev build Android y su tabla
  vacía para firma humana. Por ese gate, #73 permanece `in_progress`; no se
  abrió PR.

---

# Sesión #73 pet-online-pill (cierre, 2026-09-14, sesión Backend)

- Recibida el 2026-09-13 desde la sesión Frontend (reparto por el humano). Worktree
  `/home/claude/sites/Pet-Tracker-wt-backend`, branch `feature/73-pet-online-pill`
  desde `origin/main` `072cff40`.
- `explorer` → `progress/explore_pet-online-pill.md`: pestillo confirmado (único
  escritor `ingestion.drizzle.store.ts:97`, nadie lo apaga); umbral inexistente en
  backend, el mapa ya usa 120 s; `files_affected` citaba el route delgado.
- `spec_author` → `specs/pet-online-pill/` con decisiones por defecto (A2: derivar en
  lectura; 300 s; cuatro estados; píldora por prop del hero). Firma humana `0a76562b`
  con G2 = 120 s y G7b = pulso con Reanimated; enmiendas E1-E3 firmadas en `383d3fef`.
  Corrección del leader a tasks.md: el rojo de R2 era de compilación (ts-jest con
  diagnósticos), se cambió a stub con placeholder.
- Codex: R1-R10, 19 commits test→feat. `reviewer` aprobado (`progress/review_pet-online-pill.md`),
  hallazgos no bloqueantes: mock de `Skeleton` no prescrito por E2 (errata en la spec),
  Codex cerró `current.md` antes de tiempo.
- Smoke R11 firmado por el humano (`4f9a0eac`). Merge de `origin/main` (#75, #91) en la
  branch con conflictos en `STATUS.md` (contador recalculado: 77/91) e `history.md`.
- Coordinación con la sesión Frontend por SendMessage antes de cada init.sh; Postgres
  compartido sin colisiones.


---

# Sesión #92 device-telemetry-reset-on-reassign (2026-09-14, sesión Backend)

## Feature #92 `device-telemetry-reset-on-reassign` (P3)

- **Sesion**: Backend, worktree `/home/claude/sites/Pet-Tracker-wt-backend`.
- **Branch**: `feature/92-device-telemetry-reset-on-reassign`, desde `origin/main` `66a9d52b`.
- **Inicio**: 2026-09-14.
- **Estado**: `in_progress`. Spec escrita por `spec_author` (`e0cf0bf9`), firmada por el
  humano (`901d815f`, 2026-09-14), frontmatter de los 4 ficheros en `approved`.
  Handoff a Codex CLI en `progress/handoff_device-telemetry-reset-on-reassign.md`;
  el humano lo corre en su terminal. Mientras, este leader no toca `backend-pet-tracker/`.
- **Plan de Codex**: R1 (claim resetea `battery_pct`/`last_message_at` y devuelve la fila
  persistida; e2e (a)+(b) y unit), R2 (sonda de mutación sobre el WHERE), R3 (`init.sh`
  + `diff --stat`).
- **Baseline**: `./init.sh` VERDE, exit 0, medido sin pipe sobre `66a9d52b`. El primer
  intento choco con el `init.sh` de la sesion Frontend (#63) en `cdk.out`
  ("Another CLI is currently synthing"); se esperó su pid y se repitio.
  Cifras: backend 166 suites / 1277 tests; infra 2 / 14; movil 73 / 1265;
  e2e 26 de 29 suites (3 skipped), 365 de 373 tests (8 skipped). Punto de comparacion
  para el delta, no constante de spec.
- **Incidente**: la sesion arranco en `/home/claude/sites/Pet-Tracker`, que la sesion
  Frontend ocupa y cuyo HEAD cambio a `feature/63-...` a mitad de arranque. #92 se movio
  a este worktree antes de que `spec_author` escribiera nada.

- Codex: 4 commits (`4160f514` test R1 → `f1f44880` feat R1 → `3328c0dc` docs R1 →
  `b980d6ed` evidencias R2/R3). `reviewer` APROBADO a la primera
  (`progress/review_device-telemetry-reset-on-reassign.md`): C2-C6 con evidencia,
  sonda R2 (sin `isNull` cae en `batteryPct === 80`) y sonda de zona ciega
  (sin `batteryPct: null` caen (a) y (b) en el 201) repetidas; `init.sh` exit 0
  sin pipe, backend 166/1278, e2e 367 de 375 (+1 unit, +2 e2e). Notas menores
  sin acción: labels de `seedDevice` en mayúscula; esqueleto del impl dentro del
  commit rojo.
- Coordinación con la sesión Frontend por SendMessage antes del `init.sh` del
  reviewer; receta de pgrep ampliada a `test:e2e|jest-e2e`.
- Cierre: `init.sh` del leader, primera corrida exit 1 por el flake conocido #72
  (`add-pet/index.test.tsx` R7 foto, `Cannot read properties of undefined (reading
  'canceled')`; móvil sin diff contra `origin/main`); el fichero 3 de 3 verde suelto y
  la segunda corrida completa exit 0 sin pipe (backend 166/1278, infra 2/14, móvil
  73/1265, e2e 367 de 375). #92 `done`, STATUS.md 78/94, PR abierto; el humano mergea.
---

# Sesión #63 mobile-detail-screens-state-reset (cierre, 2026-09-15, sesión Frontend)

- Worktree principal `/home/claude/sites/Pet-Tracker`, branch
  `feature/63-mobile-detail-screens-state-reset` desde `origin/main` `66a9d52b`,
  en paralelo con la sesión Backend (#92 y luego #93) en `Pet-Tracker-wt-backend`.
- Sin `explorer`: el enunciado de #63 ya traía la exploración. `spec_author` →
  `specs/mobile-detail-screens-state-reset/` con **D1 = reset local, no Stack**,
  cinco costes medidos. Firma humana `1a9fef11`, verificada por el leader: toca
  solo la casilla, sin drift de código.
- Codex CLI: 22 commits test→feat→docs por R-id. `reviewer` aprobado a la primera
  (`progress/review_mobile-detail-screens-state-reset.md`), `./init.sh` exit 0,
  móvil +10 tests y 0 suites contra el baseline `f50b4203`.
- Gate humano firmado el 2026-09-15: cinco pasos en dev build de Android,
  incluidos los dos de `/pairing` con collar real.

## Tres cosas que conviene no perder

1. **El comando de verificación de una spec ya firmada estaba roto.** Los paths
   con `(tabs)` sin escapar: jest los trata como regex, `(tabs)` es grupo de
   captura, no casa con nada, y el gate daba **verde con exit 0 habiendo corrido
   5 suites de 7** — sin ejecutar R3 ni R4. Lo detectó el leader al verificar por
   su cuenta lo que Codex había dejado en "pendiente". Regla en
   `docs/conventions.md`.
2. **Colisión de R-ids entre specs.** `pairing/index.test.tsx` acumula `R5`, `R6`
   y `R7` de #42 y de #63. El repo ya lo había resuelto tres veces con prefijo
   (`#87 R15`, `#61 R10`) sin escribir la regla, por eso el `spec_author` la
   vuelve a omitir. Codificada ahora.
3. **Coordinación entre sesiones, resuelta de raíz.** El Postgres compartido dejó
   de ser cuello de botella: una base por worktree (`pet_tracker_wt`), validada
   por la sesión Backend con la e2e completa en verde. Quedan compartidos
   LocalStack (14 de 29 suites lo tocan) y el journal de migraciones de
   `pet_tracker`, que tiene 14 filas para 20 tablas porque #26 aplicó 0014 y 0015
   con `psql` crudo. Todo escrito en `docs/conventions.md` §Sesiones en paralelo.

## Decisiones del humano en esta sesión

- **#60 iOS pospuesto** (2026-09-15, tras retractarse el mismo día): "continuamos
  con android". La decisión de costo sigue abierta. El leader llegó a escribir el
  Apple Developer Program en el ticket como consecuencia inferida —99 USD/año que
  el humano nunca enunció— y hubo que revertirlo: las consecuencias no enunciadas
  de una decisión de costo se anotan como pregunta abierta, no como parte de la
  decisión.
- **`reminders` y `alerts`** tienen el mismo patrón de estado superviviente y
  siguen fuera de alcance, sin decidir si van a feature aparte.

---

# Sesión #93 drop-devices-connectivity-column (2026-09-14/15, sesión Backend)

## Feature #93 `drop-devices-connectivity-column` (P3)

- **Sesion**: Backend, worktree `/home/claude/sites/Pet-Tracker-wt-backend`.
- **Branch**: `feature/93-drop-devices-connectivity-column`, desde `origin/main` `d8e8a49c`
  (merge de #92, PR #129).
- **Inicio**: 2026-09-14, en paralelo con #63 (sesion Frontend, tree principal, solo movil).
- **Estado**: `in_progress`. Spec de `spec_author` (`659b365a`, enmendada para la base propia
  `pet_tracker_wt`), firmada por el humano (`0cfeae40`, 2026-09-14), frontmatter de los 4
  ficheros en `approved`. Handoff a Codex CLI en
  `progress/handoff_drop-devices-connectivity-column.md`; el humano lo corre en su terminal.
  Mientras, este leader no toca `backend-pet-tracker/`.
- **Base propia**: `pet_tracker_wt` (creada y migrada el 2026-09-14, e2e validado 26/367).
  Codex migra ahi; la compartida `pet_tracker` (journal en 0013) se repara y migra tras el
  merge de #63 (design.md §Aplicacion en el Postgres compartido).
- **Baseline**: el `init.sh` de cierre de #92 (exit 0, sin pipe) sobre el contenido que
  mergeo `d8e8a49c`: backend 166 suites / 1278 tests; infra 2 / 14; movil 73 / 1265;
  e2e 26 de 29 suites (3 skipped), 367 de 375 tests (8 skipped).
- **Premisa falsa detectada antes de especificar**: el criterio 1 dice "aplicada por
  init.sh sin intervencion manual", pero `init.sh` no corre migraciones; se aplican a mano
  con `pnpm db:migrate` (`docs/conventions.md:216`). La spec debe corregirlo en §0.2.
- **Riesgo de Postgres compartido**: `DROP COLUMN` aplicado en la DB de docker rompe los e2e
  de cualquier sesion cuyo codigo aun declare `devices.connectivity` en el schema (la
  sesion Frontend en `origin/main` pre-#93). Con Drizzle, los e2e de #93 pasan con o sin la
  migracion aplicada (solo selecciona columnas declaradas), asi que `db:migrate` en la DB
  compartida se difiere hasta que #63 cierre sus gates o #93 se mergee.

- Codex: 7 commits (`ffaf0669` test R1 → `0a131779` feat R1 → `f9020c3f` docs R1 →
  `8f16049b` R2 → `edcabc41` R3 → `9f61e16c`, `3e3bdc28` trazabilidad/alcance).
  `reviewer` APROBADO (`progress/review_drop-devices-connectivity-column.md`): D1 (.sql
  de una sentencia, journal, snapshot), D2 (greps e intactos), R3 repetido sobre
  `pet_tracker_wt` (17 filas, columna ausente, idempotente, `db:generate` no-op), sondas:
  columna reinsertada en el schema (cae el candado de 14) y `.sql` alterado (cae el
  `describe` #93 R1). `init.sh`: primera corrida exit 1 por el flake #72 (`add-pet` R7
  foto; fichero 3 de 3 verde suelto), segunda exit 0 sin pipe: backend 166/1279 (+1),
  infra 2/14, móvil 73/1265, e2e 367 de 375.
- Observación 1 del reviewer: contradicción interna de la spec (grep de cierre sobre
  `src/db/schema` frente al `describe` obligatorio en el spec del schema). Errata del
  leader tras la firma en requirements.md y tasks.md (`--exclude='*.spec.ts'`), sin
  re-gate: no cambia requisitos ni código.
- Coordinación: aviso a Frontend antes del reviewer (LocalStack compartido); Frontend
  cerró #63 con PR #130 en paralelo. Regla acordada: migraciones destructivas en la base
  compartida solo tras el merge de la otra sesión, con reparación previa del journal.
- Cierre: #93 `done`, STATUS.md 79/94, PR abierto; el humano mergea. Pendiente operativo
  tras el merge de #130: dos INSERT en `drizzle.__drizzle_migrations` de `pet_tracker` +
  `pnpm db:migrate` (design.md §Aplicación en el Postgres compartido).


## Feature #96 `harness-e2e-nunca-corre-en-ci` (P2)

- Sesion Frontend (leader) en el arbol principal; rama
  `feature/96-harness-e2e-nunca-corre-en-ci` desde `48e4130d`. PR #134.
- Problema: los 29 e2e de `backend-pet-tracker/test/` no se ejecutaban **nunca**
  en CI. Dos causas encadenadas: `ci.yml` sin `services`, e `init.sh` saltandose
  los e2e con un `warn` en vez de fallar. Mas un defecto de puertos:
  `E2E_REQUIRED_PORTS=(5432 4566)` daba true por un Postgres ajeno al proyecto,
  porque el del proyecto escucha en 5433.
- Decisiones de la spec: `docker compose up -d --wait` en vez de `services:`
  (no duplica las imagenes ya pineadas y ejecuta el HEALTHCHECK de la imagen);
  fallo duro siempre, sin rama por `$CI`; `E2E_PORT_SOURCES` parseando
  `DATABASE_URL` y `AWS_ENDPOINT_URL`; `E2E_SETUP_CMD` con `db:migrate` y
  `provision:local` dentro de init.sh, no en el workflow (necesitan el
  `node_modules` de `INSTALL_CMD`). El workflow **no** fija `DATABASE_URL`:
  `.env.example` y el compose base ya cuadran en los cuatro campos.
- Hallazgo que no estaba en el enunciado: `provision:local` en CI no es
  opcional. `localstack-provisioning.e2e-spec.ts` provisiona en su `beforeAll`,
  pero jest ordena por tamano y no es el primero. En el VPS no se notaba porque
  LocalStack llevaba horas provisionado; en CI arranca vacio cada job.
- Codex: 19 commits, 9 pares rojo->verde uno por R-id. El `reviewer` no se fio
  del reporte: extrajo el arbol de los 18 commits con `git archive` y corrio los
  tests en cada uno — los 9 rojos fallan **solo** en la suite de su propio R-id.
  APROBADO R1-R9.
- Enmienda **E1** (firmada por el humano en `dbeb6b92`): el reviewer demostro
  con mutaciones que el candado de R2 dejaba pasar `run: AWS_MODE=aws bash
  ./init.sh` y una segunda ocurrencia de `AWS_MODE`. R2 **no** cambio — su
  redaccion ya lo prohibia; lo corto era el candado que lo comprueba. Codex lo
  reforzo en `abc0ac32` (solo el `it` de R2, sin tocar `ci.yml`). Segunda
  revision APROBADA, con una mutacion extra del reviewer (segundo
  `AWS_MODE: "local"`) que confirma que la condicion 1 va por recuento y no por
  regex de valor.
- Techo conocido y documentado en `docs/verification.md`: `env: { AWS_MODE: aws }`
  en mapping de flujo YAML deja la suite verde. No se cerro: exige parsear YAML
  de verdad y el gasto esta cortado aguas abajo por `runSmoke`.
- **G1 cerrado**: run `34992040777` sobre `73a1d6b0`, verde, con los e2e
  ejecutandose de verdad en CI por primera vez (`26 of 29`, migraciones
  aplicadas). Una verde anterior (`34990504701`) se descarto por correr sobre
  `ea5e62bb`, antes de E1.
- **G2 cerrado**: run `34990834840` sobre `87637ceb`, rojo por la mutacion
  deliberada `.expect(401)` -> `.expect(418)` en `app.e2e-spec.ts`. Un unico
  fallo, exit 1; las 73 suites moviles verdes, asi que no fue el flake de #72.
  PR #135 cerrado sin mergear y rama `test/96-ci-red-probe` borrada.
- Coordinacion con Backend: se le aviso **antes** de escribir la spec y sus
  cuatro respuestas entraron en ella (los 29 e2e verdes en su worktree con 3
  skipped por diseno, sus variables literales, cero PRs en vuelo, y que nunca
  corre init.sh con la infra abajo — lo que elimino la rama por `$CI`). Corrio
  ademas el init.sh entero de la rama desde wt-backend para cubrir el unico caso
  que no se prueba desde el arbol principal: la derivacion de 5433 desde su
  `DATABASE_URL`. Exit 0. Suya es la peticion que quedo como R5.
- Ruido documentado para que nadie lea mal G1: las lineas
  `ERROR [PollerService] ... connect ECONNREFUSED 127.0.0.1:4566` del log son un
  `mockRejectedValue` de `poller.service.spec.ts`, no LocalStack caido, y ya
  salian antes de #96.
- Consecuencia para todas las maquinas: `./init.sh` pasa a exigir
  `docker compose up -d` y aborta si la infra no responde.
- Cierre: #96 `done`, 81/96, PR #134 abierto; el humano mergea.

## Feature #97 `mobile-reminders-alerts-state-reset` (P2)

- Sesion Frontend (leader), arbol principal. Rama
  `feature/97-mobile-reminders-alerts-state-reset` desde `0e4aa810`. PR #137.
- Continuacion de #63: aquella arreglo el estado superviviente en las pantallas
  de formulario bajo `(tabs)`, pero su criterio 4 se acoto a add-pet, weight-log,
  meal-schedule y docs. Las dos pantallas de lista quedaron fuera.
- El caso peor no era cosmetico: en reminders, `deleteCandidate` alimenta el
  bottom sheet de confirmacion de borrado, asi que abrir la confirmacion, salir
  por la barra de tabs y volver reabria el dialogo con el boton de confirmar a
  un toque.
- **Dos decisiones en contra del enunciado**, ambas del spec_author y ambas
  correctas:
  - `deletingId` **no** se resetea. Es un guarda de peticion en vuelo cuya vida
    va de `setDeletingId` al `finally`; resetearlo en el blur solo tendria
    efecto mientras el DELETE vuela, y ahi abre un segundo DELETE. La spec
    entrega el observable del criterio y rechaza su mecanismo por escrito. El
    criterio lo habia escrito yo y estaba mal.
  - `acked` **sobrevive**. No es basura de formulario sino una capa optimista
    sobre el servidor: resetearlo haria que una alerta atendida vuelva a verse
    sin atender. Era el "caso legitimo de estado que debe sobrevivir" que el
    criterio 5 de #63 obligaba a nombrar.
- Consecuencia: para que sobrevivir no signifique desincronizarse se anaden R7
  (refetch al ganar el foco, alerts era la unica lista de `(tabs)` sin el) y R8
  (caducidad del overlay cuando la lista ya no trae la alerta como `open`). R8
  enmienda D3 de la spec de #78 — enmienda **E9**, aditiva, firmada por el
  humano junto al gate en `da957174`. Motivo verificado en el backend, no
  supuesto: el motor cierra por `status IN ('open','acked')`
  (`alerts-engine.drizzle.store.ts:102`), asi que con el overlay incondicional
  una alerta atendida y luego cerrada se pintaria "Atendida" para siempre.
- Codex: 27 commits, 8 trios rojo-verde-trazabilidad. R3, R5 y R6 son requisitos
  de verificacion: la mutacion de produccion se versiona en el rojo y se
  revierte en el verde.
- `reviewer` APROBADO. No se fio del reporte en ningun punto duro: cinco rojos
  verificados por checkout (se pedian tres), todos fallando por su propia
  asercion; las mutaciones confirmadas **por hash de blob**; la sonda de zona
  ciega de `ackingIdRef`, que ningun commit versiona, reproducida por el. Cero
  `getQueryData` en las lineas anadidas de los tests, asi que no se sembro el
  patron del flake de #72. i18n byte a byte. `./init.sh` exit 0 sin tuberia; los
  dos flakes de #72 no se manifestaron esta vez.
- **Gate humano cerrado**: los cuatro pasos del smoke en dev build de Android.
  El entorno no tenia ninguna alerta —solo las produce el motor, sin endpoint de
  creacion— asi que el humano inserto dos filas de prueba de tipos distintos (el
  indice anti-spam solo admite una activa por `(pet_id, type, geofence_id)`) y
  uso una para el paso 3 y otra para el 4.
- Coordinacion con Backend: se le reservaron 4566 y 5433 para el gate del
  reviewer; su Codex de #83 corria `pnpm test`, `tsc` y `db:migrate` contra
  `pet_tracker_wt` sin avisar, asi que se aviso al reviewer de que la contencion
  de CPU ensancha la ventana de los flakes de #72. Cero claves de i18n, asi que
  el acuerdo del catalogo quedo dormido hasta #98. La leccion del overlay
  optimista se le paso a Backend, que la aplico a #98 con la distincion
  correcta: en alertas el servidor **supersede** la accion, en comidas puede
  **invalidarla**, asi que alli toca refrescar y no mantener overlay.
- Cierre: #97 `done`, 82/97, PR #137 abierto; el humano mergea.

## Feature #83 `meals-served-tracking` (P3)

- Sesion Backend (leader), worktree `wt-backend`, base propia `pet_tracker_wt`.
  Rama `feature/83-meals-served-tracking` desde `1b9efe86` (main con #96).
  PR #138. Fechas: 2026-09-15 (spec e implementacion) y 2026-09-17 (smoke y
  cierre).
- Arranque: primer `init.sh` con la guarda de infra de #96 desde este worktree,
  exit 0 (5433 y 4566 derivados de `DATABASE_URL` y `AWS_ENDPOINT_URL`).
- Explorer antes de la spec porque el enunciado tenia cuatro decisiones
  abiertas. Hallazgos verificados: la Home **no** pinta ninguna barra de
  comidas (solo el Make, `design-src/App.tsx:438-446`); `food.tsx` finge lo
  servido comparando `mealTimes` con el reloj del dispositivo, conducta
  aprobada como D7 de #38; el patron a copiar es `health-weights` mas el
  helper `ownerLocalDay`; ningun `MockOf<T>` afecta si no se toca
  `PetRepository`.
- Decisiones del humano (AskUserQuestion, 2026-09-15): partir en dos (#83
  backend, #98 movil); cualquier miembro activo sirve y deshace (excepcion
  explicita al owner-only de pesos y plan); 409 al repetir franja mas DELETE
  para deshacer; el contador solo cuenta franjas del plan vigente.
- El id #98 se reservo anunciandolo a la sesion Frontend: `origin/main` iba
  por 97 y la regla "maximo en origin/main" habria repetido el choque #55/#56.
  Frontend lo anoto en la memoria del proyecto.
- spec_author corrigio siete premisas del encargo (§0.2 C1-C7): seis listas de
  claves del perfil y no cuatro; el indice `(pet_id, served_on)` sobra bajo el
  UNIQUE; `servedToday` solo en el `GET` del plan (R19 de #17 congela las 11
  claves de `generate`) y desde el repositorio propio, no desde el lector de
  pets; el orden plan → pertenencia → unicidad hace que una franja servida y
  luego fuera del plan regenerado responda 422 y no 409.
- Handoff a Codex CLI: 25 commits, un par rojo/verde por requisito (R1-R11) y
  R12 como verificacion contra `pet_tracker_wt`. Migracion
  `0017_meal_servings` renombrada como #93.
- `reviewer` APROBADO: `init.sh` en primer plano exit 0 sin tuberia (backend
  170/1295, movil 73/1275 sin flake, e2e 27 de 30 con 3 `aws-real` skipped);
  once rojos comprobados (seis por checkout en worktree temporal); drift
  limitado a la lista cerrada de design.md; journal 18 con `created_at` =
  `when` de 0017, tabla e indices presentes, `db:migrate` idempotente y
  `db:generate` no-op; cinco sondas de mutacion caidas (servedInPlan sin
  filtro, pertenencia al plan, dia UTC en el DELETE, default no nulo en el
  mapper, `@RequirePetRole('owner')`).
- Smoke `curl` del humano (2026-09-17) OK en las trece lineas. Antes dio 500
  en `GET nutrition-plan`: su base local no tenia 0017 y el `GET` consulta
  `meal_servings` desde R9; `pnpm db:migrate` lo resolvio. Leccion: el
  handoff y la spec dicen que `init.sh` migra, pero un backend arrancado con
  `start:dev` sin `init.sh` previo no.
- Coordinacion con Frontend: LocalStack serializado por SendMessage en cada
  gate; #97 no anadio claves i18n, asi que el candado del catalogo llega
  intacto a #98. La leccion del overlay optimista de #97 se escribio en #98
  con la distincion supersede/invalida. Los dos `init.sh` rojos de wt-backend
  (#92 y #93, `reading 'canceled'`) sirvieron a #72 como primeros logs rojos
  con orden de suites y descartaron la hipotesis de que el flake dependia del
  entorno.
- Cierre: #83 `done`, 83/98, PR #138 abierto; el humano mergea. Pendiente del
  leader: aplicar 0017 en `pet_tracker` con `pnpm db:migrate` tras el merge,
  avisando antes a Frontend.

## Feature #72 `mobile-add-pet-photo-test-flake` (P2)

- Rama `feature/72-mobile-add-pet-photo-test-flake` desde `main` 9c3dcab6.
  Feature de tests: ni una linea de produccion en el arbol final.
- `explorer` antes que `spec_author`, porque el criterio 1 exigia causa raiz con
  evidencia y solo una de las dos causas la tenia. Fue la decision que salvo la
  feature: **falso la hipotesis central** que la entrada arrastraba desde el
  segundo avistamiento. Los dos logs rojos que existen son de `main@961b330a`,
  donde `add-pet/index.test.tsx` tenia 386 lineas y **cero**
  `mockResolvedValueOnce` del picker; el primero lo introdujo `eb931f7e` y llego
  a main en el PR #130, despues de los tres avistamientos. No puede agotarse una
  cola que no existia.
- Son **dos causas distintas**, no una de aislamiento entre suites: firmas
  incompatibles, poblaciones disjuntas en 40 corridas registradas sin cruzarse
  ni una vez, y `add-pet` ni siquiera usa TanStack Query.
- Alerts: reproducido (1 de 32) y cerrado a nivel de fuente. `query-core`
  escribe la cache de forma sincrona pero notifica a React via `setTimeout(0)`
  (`notifyManager`, `defaultScheduler = systemSetTimeoutZero`), asi que
  `getQueryData` es cierto una macrotarea antes de que cambie el DOM. El test
  esperaba a la senal equivocada. R1 lo vuelve determinista con una viga de
  200 ms en el notificador, derivada de las constantes reales de RNTL
  (`50 < 200 < 1000`), restaurada en un `afterEach`.
- add-pet: **no se reprodujo en 32 corridas** y los cinco caminos que producirian
  `undefined` estan descartados con fuente. El arreglo obvio ya se habia
  aplicado el 2026-09-03 en `43183c4a` y no basto. El `explorer` se nego a
  inventar una causa, que es la conducta correcta.
- Hallazgo que cambio el gate: **"la primera pasada muerde y la segunda sale
  verde" es en parte un artefacto del sequencer de jest**, que programa primero
  el fichero que fallo en la corrida anterior (cache en `/tmp/jest_ru/perf-cache-*`).
  Verificado en las dos direcciones: add-pet cayo 14o y 15o en las rojas y 3o en
  las verdes de repeticion; alerts, 7o en la roja y 1o en la verde siguiente. La
  segunda corrida verde **no es una absolucion: es el control mas favorable**.
- Por eso el criterio 5 original ("tres `./init.sh` verdes") no media nada. El
  humano firmo dos decisiones el 2026-09-17: **D-A**, cerrar la mitad de add-pet
  con endurecimiento diagnostico (`PICKER_MOCK_UNARMED`) en vez de causa raiz, y
  **D-B**, sustituir el criterio 5 por el Protocolo V. Los criterios 1, 2 y 5 de
  `feature_list.json` se reescribieron al firmar.
- La spec dice sin adornos lo que el gate no prueba: 20 corridas detectan un
  flake del >=14 %, no uno del ~3 % como el de alerts. B se cierra por el
  determinismo de R1, no por estadistica; A no se cierra con ninguna N razonable.
- Codex: 11 commits, rojo->verde por R-id. R2 versiona cinco mutaciones de
  produccion en el rojo y las revierte en el verde.
- `reviewer` APROBADO, sin fiarse del reporte en ningun punto duro: revirtio a
  mano la correccion de R1 con la viga puesta y obtuvo rojo 3 de 3 (verde 2 de 2
  al deshacerlo), reprodujo los rojos de R2 fichero a fichero, comprobo que el
  invariante de R4 salta y **no da falsos positivos** con colas
  `mockResolvedValueOnce`, y re-corrio su propia muestra del Protocolo V (V1
  completo, 5 corridas de V2 con `N == S == 73`, `./init.sh` exit 0 sin tuberia).
- Dos observaciones no bloqueantes que quedan escritas: la premisa de `design.md`
  §D5 era falsa (`profile/index.test.tsx` **si** usa `virtual: true`) y Codex lo
  declaro en vez de taparlo — ese `virtual` sigue abierto para otra feature; y la
  prueba de zona ciega de S3/S4/S5 no dio el contraste previsto (los tres tests
  viejos tambien salieron rojos), anotado sin adornar como autoriza `tasks.md`.
- Coordinacion con Backend: puertos serializados en las dos direcciones, 0017
  aplicada por ellos mientras Codex corria solo jest, y conflicto de
  `docs/conventions.md` descartado antes del merge (#138 solo toco dos cifras de
  §Sesiones en paralelo; la subseccion nueva va a §Tests). `git merge-tree` de la
  rama contra main sale limpio, asi que **no se rebasa**: rebasar invalidaria los
  hashes de `traceability.md`.
- Cierre: #72 `done`, 84 de 98 tras integrar main (#83 entro por el PR #138 mientras esta feature estaba en vuelo). PR #139.

## Feature #90 `mobile-owner-timezone-dates` (P2)

- Sesion Backend (leader), worktree `wt-backend`. Rama
  `feature/90-mobile-owner-timezone-dates` desde `29689598` (main con #83 y
  #72). Fechas: 2026-09-17 (explore, spec, implementacion, review) y
  2026-09-18 (smoke y cierre).
- Baseline `init.sh` exit 0 (movil 170 suites / 1295 tests). Sin flakes.
- Explorer: `POST /v1/pets/:petId/weights` lleva `@RequirePetRole('owner')` y
  `birthDate` en el alta valida contra el requester, asi que la zona del perfil
  propio coincide con la del owner en toda peticion que pueda dar 201; la
  ambiguedad "mascota compartida" del enunciado no existia. Ruta real del
  perfil `GET /v1/me` (el enunciado decia `/v1/users/me`; corregido en
  `feature_list.json`). Ningun helper con `timeZone` en el movil; nadie fija
  `TZ` en jest ni en CI.
- Decisiones del humano (AskUserQuestion, 2026-09-17): (a) zona del perfil
  via `GET /v1/me`; B1 solo `weight-log` en produccion, `add-pet` con test de
  regresion; C-A campo de fecha libre y el 400 de fecha futura traducido. P1
  firmada en el gate: discriminar por `path` Y mensaje byte a byte de #89,
  porque `Invalid ISO date` llega con el mismo `path`.
- Spec: 7 requisitos. Candados como delta (`+ 1` sobre el literal del catalogo,
  `32 + 1` en la tabla de usos); las cuatro aserciones de fecha de
  `weight-log.test.tsx` pasan a reloj fijo `2026-09-17T23:30:00Z` con perfil
  en `Pacific/Kiritimati` (par Kiritimati/Pago_Pago para que el candado no
  dependa de la zona del host). R4 y R6 como requisitos de verificacion con
  mutacion versionada en el rojo y revertida en el verde.
- Codex: 13 commits (819fa5c9..274736de). Helper `civilTodayIso` con
  `Intl.DateTimeFormat` + `formatToParts` y `try/catch`; `measuredAtDraft:
  string | null` con valor derivado; constante unica del literal del backend;
  un solo `t('weightLog.dateCannotBeAfterToday')`.
- Reviewer APROBADO sobre 274736de: rojos reproducidos commit a commit,
  `add-pet/index.tsx` sin diff contra main, lista cerrada respetada, 5 de 6
  sondas cazadas (sonda A, `format()` en vez de `formatToParts`, es zona ciega
  declarada en D2: solo la cierra el smoke en Hermes). Gate movil 74 suites /
  1302 tests; `init.sh` exit 0 medido sin pipe, lanzado solo tras el aviso
  explicito de Frontend (su reviewer de #79 estaba vivo y el `pgrep` tiene
  ventana de carrera; leccion del 2026-09-06).
- Smoke del humano en dev build de Android (2026-09-17 09:48 CDMX; perfil
  `America/Mexico_City`, dispositivo `Asia/Tokyo`): default en dia CDMX, 201
  con hoy, 400 traducido con manana, `Invalid ISO date` crudo, fallback al
  dispositivo en modo avion. Registrado en `progress/impl_mobile-owner-timezone-dates.md`.
- Coordinacion con Frontend (#79 en paralelo, PR #140): #79 con delta i18n
  cero, `catalog.ts` byte-identico a main; #90 no toca `http.ts` ni
  `auth-provider.tsx`, merge limpio en cualquier orden. Frontend reservo
  #99-#101 en su rama; siguiente id libre 102.
- Deuda detectada sin id: `health.tsx:28` conserva su propia `localTodayIso`
  (dispositivo) para filtrar la proxima vacuna y marcar vencidas; solo
  pantalla, fuera de #90 por D-B.
- Cierre: #90 `done`, 85 de 98. PR abierto por el leader; el humano mergea.

## Feature #79 `mobile-push-registration` (P2) — 2026-09-17 a 2026-09-21

- Rama `feature/79-mobile-push-registration`, PR #140, mergeada. 86 de 101.
- **Lo que cambia para el usuario**: desde #13 el backend enviaba push y **no
  llegaba a nadie**, porque la app nunca registraba un token y `push_tokens`
  estaba vacia. Ahora la cadena esta cerrada de punta a punta, verificada en un
  telefono fisico.
- Sin `explorer`: la entrada traia el alcance en cinco puntos y nueve criterios, y
  el contrato del backend existia desde #13. Lo que faltaba no era investigacion.
- La spec corrigio **dos premisas del enunciado** antes de empezar: existe
  `app.config.ts` (config dinamica sobre `app.json`), y `deleteJson` **no admitia
  body**, con lo que el `DELETE` del token habria salido 400 dejando el token vivo
  en el servidor. Esa segunda es justo el bug del telefono compartido que la
  feature venia a evitar.
- Codex, 24 commits para R1-R11 mas las rondas de las enmiendas. Tres rondas de
  `reviewer`, **una de ellas rechazo** por una fila de trazabilidad sin rellenar.
  El reviewer probo el orden de R5 **invirtiendolo a mano**, y comprobo en el **JS
  transpilado** que no queda ningun `require('expo-notifications')` en el cuerpo
  del modulo.

### El gate humano fallo una vez y destapo cinco supuestos falsos

El **paso 8** (tap en arranque en frio) se quedaba en Home: la navegacion a
`/alerts` perdia la carrera contra el `<Redirect href="/home" />` de
`src/app/index.tsx:11`. El test de R10 no lo vio porque comprobaba que se
**llamaba** a `router.push`; la llamada ocurria, lo que no ocurria era el
resultado. Volvio a Codex y se arreglo esperando a la senal correcta.

Las cinco enmiendas firmadas, y el patron que forman:

| | Que se creia | Que era |
|---|---|---|
| **E1** | el rango sale de `bundledNativeModules.json` | ese fichero es la instantanea del paquete `expo` instalado, no la lista viva; `expo install` escribio `~57.0.19` |
| **E2** | el hook podia depurarse | tenia **seis salidas mudas**; R13 las nombra con `__DEV__` |
| **E3** | la credencial FCM en EAS basta | EAS Build la inyecta; un `expo run:android` local necesita `google-services.json` |
| **E4** | `Device.isDevice` detecta Expo Go | en un telefono fisico es `true`; y el modulo rompia **al importarse** |
| **E5** | la app puede abrirse en Expo Go | no: usa modulos nativos propios, empezando por `expo-maps` |

**La spec acerto en todo el diseno y fallo cinco veces en supuestos sobre el
entorno.** Ninguno de los cinco lo habria encontrado un test: en jest
`expo-notifications` esta mockeado y el import nunca lanza. Los cinco los
encontro el gate humano en el telefono.

- De su §Fuera de alcance salieron **#99** (permiso denegado sin salida), **#100**
  (tap al detalle de la alerta) y **#101** (icono de notificacion de Android),
  elegidas por el humano; el resto de exclusiones no se registraron porque ya
  estaban cubiertas (#60 iOS, borrado de tokens muertos en #13) o eran decisiones
  deliberadas.
- Coordinacion con Backend: puertos serializados **por aviso explicito y no por
  `pgrep`**, al detectar que dos reviewers simultaneos veian la lista vacia a la
  vez. i18n en delta cero por nuestro lado, asi que #90 movio el candado del
  catalogo sin coordinarse.
- Cierre: #79 `done`, 86 de 101, PR #140 mergeado.

## #94 — mobile-map-staleness-single-source (2026-09-21)

Branch `feature/94-mobile-map-staleness-single-source`, worktree
`Pet-Tracker-wt-ui`, PR #143. En paralelo con la sesion Frontend, que llevaba
#98 en el worktree principal.

- **Lo que cambia para el usuario**: la Home y el Mapa ya no pueden contradecirse
  sobre la misma mascota. El Mapa decidia "En vivo" / "Desactualizado" con un
  `STALE_SECONDS = 120` propio contra la antiguedad de la ultima **posicion**,
  mientras la Home leia `device.connectivity`, que el backend deriva del ultimo
  **mensaje** del collar. No eran dos umbrales del mismo dato: eran dos
  preguntas distintas, y con los dos numeros en 120 s las dos pantallas **ya se
  contradecian**. Sincronizar el numero nunca lo habria arreglado; habia que
  borrar uno de los dos calculos.
- Sin `explorer`: la deuda venia descrita desde #73 y el contrato del backend
  existia. Lo que faltaba no era investigacion, era decidir que fuente manda.
- **La spec corrigio dos premisas de la ficha antes de empezar**: `GET /v1/pets`
  no devuelve `device` (`pets.controller.ts:86` pasa `null`; solo el detalle lo
  rellena), asi que la via (a) cuesta una quinta query; y la via (b) estaba
  bloqueada, porque exponer el umbral obliga a tocar `src/api/types.ts`, que era
  de #98.
- Codex, 16 commits en pares rojo→verde mas 5 de la ronda 2. **Dos rondas de
  `reviewer`, la primera rechazo.**

### Las dos enmiendas y lo que destaparon

| | Que se creia | Que era |
|---|---|---|
| **E1** | la spec listaba los candados que R2 y R6 tocaban | faltaba `ui-language.test.ts`, que cuenta ocurrencias exactas de `t('clave')` por fichero: R6 habria dejado la suite roja en cuanto Codex cambiara el rotulo |
| **E2** | R5 cerraba el umbral local | R5 persigue **sintaxis**: `const positionAge = position?.staleSeconds ?? 0` lo evade. R10 lo cierra con otra propiedad — un inventario de lecturas por fichero — que caza el alias **y** la mudanza a otro fichero |

### El rechazo: un candado ajeno debilitado en silencio

La ronda 1 cambio el helper compartido `sourceFiles()` de `design-drift.test.ts`
para excluir los `*.test.tsx` colocados. De ese helper cuelgan los **14
describes preexistentes** del fichero (C8, `R3: Card compartido`, `#87 R19`),
asi que **todos** dejaron de mirar esos ficheros. No era un rojo: era cobertura
ajena perdida sin que nada se quejara. La justificacion —"hacia falta para
cerrar R5"— se midio falsa dos veces: con el helper viejo y los dos `it` de R5
en su sitio, el fichero daba 39 de 39 verdes. El reviewer lo probo plantando una
violacion en un test colocado y viendo que `C8` y `#68 R18` volvian a cazarla.

### El gate humano

Costo tres intentos, **ninguno por la app**: el poller seguia vivo porque la
variable estaba **duplicada en el `.env`** del equipo del humano y el backend no
sabia cual tomar. Y al ir a firmar aparecio que **R8 no tenia casilla**: remitia
a §Aprobacion, cuya unica linea era el gate previo a implementar, firmado el
mismo dia antes de que existiera el codigo. La casilla se anadio en `ff76cbfa`.

- Coordinacion con Frontend: reparto de ficheros por escrito en `current.md`
  desde el primer dia, delta de i18n **cero** por nuestro lado, y `./init.sh`
  **nunca ejecutado** en toda la feature — es 100% movil, el gate real era jest
  mas `tsc`, y los puertos eran de la otra sesion.
- Cierre: #94 `done`, 88 de 107. Suite movil 77 suites / 1367 tests, `tsc`
  limpio, medido sin pipe en la punta de la rama.

---

## #98 — `mobile-meals-served-ui` (2026-09-21)

Mitad móvil de #83. `food.tsx` deja de fingir la comida servida con el reloj del
dispositivo y gana un botón por franja contra `POST`/`DELETE
/v1/pets/:petId/meals`; la Home gana una barra de comidas que lee `mealsToday`
de `detail.data.pet`, sin una sola llamada nueva.

Cerrada con **88 de 107** features. PR abierto tras el smoke; el humano mergea.

### La spec acertó; lo que falló fue el entorno del humano, otra vez

Codex entregó **23 commits** con historial rojo→verde por requisito, y el
`reviewer` no le encontró **una sola objeción de código**: 77/77 suites,
1369/1369 tests, `tsc` limpio, catálogo 305→309, `TABULAR_NUMS` 7→8, y las
cardinalidades de `reminders-section-body` byte idénticas al ancla `914905b8`.

El tiempo se fue en otra parte. El smoke murió en `pnpm db:migrate` con un
`ELIFECYCLE` mudo, y el diagnóstico tardó tres rondas porque el síntoma mentía:
la tabla `meal_servings` **existía**, el journal marcaba **18 de 18**, y
`docker exec psql` respondía de maravilla. Lo que no respondía era
`localhost:5432`: el `docker-compose.override.yml` del VPS —gitignored y con un
comentario que dice literalmente «específico de esta máquina, no commitear»—
estaba también en la máquina Windows, publicando el Postgres en **5433**
mientras el `.env` apuntaba al 5432.

**La lección es la forma del engaño, no el puerto.** `docker exec` entra por
dentro del contenedor y nunca toca el mapeo de puertos, así que confirma que la
base está sana justo cuando el problema es que nadie puede llegar a ella. Tres
comprobaciones dieron verde seguidas mientras el backend no conectaba.

### El rechazo de la ronda 1 no fue por código

Fue **C6**: Codex editó la spec aprobada *después* de la firma (R1, R8, R9) y el
único aval era su propia prosa. Las tres eran correctas —el `reviewer` midió que
ninguna relajaba un requisito— pero no existía **sitio donde firmarlas**: vivían
como párrafos sueltos dentro de su requisito. El leader abrió una sección
`## Enmiendas posteriores a la firma` con una tabla que sitúa cada una, y el
humano las firmó de una vez con las dos `§Enmienda #98` que ya debía.

Patrón para la próxima: **una enmienda sin casilla no es una enmienda, es una
nota**. Si Codex tiene que cambiar la spec a mitad de implementación, el handoff
debe pedirle que abra él la casilla.

### Deuda y features nuevas

- **#107** `mobile-meal-toggle-press-lock`, el único hueco que encontró el
  `reviewer`, con **sonda propia** en un sitio que Codex no había sondeado:
  quitar el feedback pressed del `meal-toggle` deja 4 suites y 150 tests verdes.
  Lo declaró **no bloqueante** con un argumento que conviene recordar: la spec
  firmada nunca pidió ese candado, y rechazar por él habría sido inventar un
  requisito post-firma — exactamente lo que costó la ronda 1.
- De la §Fuera de alcance salieron **#102** (las cinco rutas pre-#39, que
  contradice `conventions.md:445-446` y arranca enmendándola), **#103**, **#104**
  y **#105**, las tres bloqueadas por backend, y **#106** (animación y haptics).
  De las nueve viñetas, cuatro eran delimitaciones y no se registraron.
- Tres premisas falsas de la spec, cazadas al registrarlas: el Make pinta una
  **barra** de kcal y no un anillo; el historial **no** estaba desbloqueado
  porque el puerto solo consulta un día; y `react-native-reanimated` ya estaba
  instalado.

### Coordinación

Codex movió un candado de `specs/mobile-ui-language/design.md`, que es de #65 y
está viva en `wt-ui`. El recuento nuevo es correcto (33 claves, 38 ocurrencias)
pero dejó los **sub-rótulos por fichero obsoletos**: 16 + 19 = 35, no 38. Lo
cierra quien lleve #65.

---

## #102 `mobile-routes-to-screens` — 2026-09-22

Refactor puro. Cuatro rutas anteriores a #39 pasan al patrón *route delgado +
`src/screens/<nombre>/index.tsx>`*: `map` (406 líneas), `weight-log` (341),
`meal-schedule` (324) y `health` (279). Sus tests se colocan junto al cuerpo.
Cero cambio de aserción: **77 suites / 1386 tests antes y después**, medido sin
pipe en `3a52028b` y en el tip. `tsc --noEmit` 0 bytes.

Branch `feature/102-mobile-routes-to-screens` desde `3a52028b`, worktree
`Pet-Tracker-wt-ui`. Spec firmada el 2026-09-21 (`7098f985`), 11 commits de
Codex (`ca2d6f80`..`2ae43ea5`), reviewer **aprobado sin bloqueantes**.

### La feature contradecía una convención, y esa era la primera tarea

`docs/conventions.md:445-446` decía que las pantallas anteriores a #39 **no se
migran en frío**. R1 la enmendó con la excepción **A10**, con casilla de firma
**propia y separada** de la aprobación de la spec — lección de
`gate-humano-sin-casilla-donde-firmar`, de #94. La regla por defecto queda
intacta: A10 acota cuándo vale migrar en frío, no abre la puerta.

### Alcance recortado a cuatro: `food.tsx` fuera

El criterio de aceptación 4 de la entrada ya lo autorizaba ("o food.tsx queda
fuera de esta feature"). Lo escribieron pensando en #98, que ya estaba
mergeada, pero #106 + #107 estaban `in_progress` sobre `food.tsx` y su test
**mientras** corría esta feature. Misma razón, otra feature de origen. Queda
como deuda nombrada en la entrada.

La cifra de `food.tsx` se dejó a propósito con su fecha y su contexto: 374 en
`main` el 2026-09-22, **383** en la branch de #106+#107. Caduca al mergearlas
(`constantes-congeladas-en-specs`).

### Lo que abarató el trabajo: las profundidades relativas

`src/app/(tabs)/x.tsx` y `src/screens/x/index.tsx` están **ambos a profundidad
3**, así que los cuerpos no cambiaron **ni un import**: el diff real de cada
cuerpo es **una línea**, la del `export default` → `export`. Los renames salen
con `similarity 99%`. Los tests sí bajaron un nivel (`../../../` → `../../`).
Quien migre `food.tsx` puede contar con lo mismo.

### El coste real estaba en los candados, no en mover ficheros

Cinco ficheros guardan rutas de fichero **literales**:

- `ui-copy-table.ts` — 68 filas nuestras repuntadas (map 17, health 13,
  weight-log 19, meal-schedule 19). Las 19 de `food.tsx` intactas.
- `consistency-classnames.test.ts` y `legibility-classnames.test.ts` — los
  `join('app','(tabs)',…)`, saltándose los de `food`.
- `design-drift.test.ts` — tres sitios: el ternario, `screenSignOutCalls` de
  #87 R19 y el inventario R10 que dejó #94.
- `ui-language.test.ts` — **no se tocó**. Cero ocurrencias de `(tabs)`; sus
  `toHaveLength` miden longitudes de bloque, no rutas.

### Dos trampas que se cazaron antes del handoff, no después

1. **El ternario de `design-drift.test.ts:84-86` se invierte, no se colapsa.**
   Yo escribí en el prompt que las cuatro rutas migradas vaciaban la rama
   `app/(tabs)/`. Falso: su `it.each` lista **siete** pantallas y `food` sigue
   ahí. Colapsar habría leído `src/screens/food/index.tsx` → ENOENT → rojo. El
   `spec_author` lo midió y me corrigió. Queda
   `screen === 'food' ? app/(tabs) : screens/`.
2. **`sourceFiles()` de `design-drift.test.ts:25-35` excluye la carpeta
   `__tests__/` pero NO los `*.test.tsx` colocados** — a diferencia de
   `consistency-classnames` y `legibility-classnames`, que excluyen ambos. Al
   sacar los cuatro tests de `__tests__/` entraron por primera vez en el
   escaneo de C8/R3/R4. Salió verde (cero coincidencias de los tres patrones),
   pero era la trampa silenciosa de la feature. Se convirtió en **R7**, y la
   spec **prohibió tocar el helper**: modificarlo fue el bloqueante H1 que hizo
   rechazar la ronda 1 de #94 dos días antes. Codex no lo tocó (`cmp` exit 0,
   17 describes antes y después).

### C4 en un refactor puro: vía (b)

No hay comportamiento nuevo que poner rojo, así que **el rojo lo produce el
candado**. Un commit rojo + uno verde por ruta. El reviewer hizo checkout de
los cuatro rojos y confirmó lo que importaba: fallan con **ENOENT sobre la ruta
vieja**, cero `ReferenceError` y cero `Cannot find module`. Un rojo que falla
por un import roto no prueba nada.

Desviación de `tasks.md` aceptada: Codex crea el route delgado en el commit
**verde**, no en el rojo. `tasks.md` contradecía a `requirements.md`, y con el
route recreado no hay ENOENT ni rename. Corolario: los cuatro commits rojos
dejan el árbol sin ese fichero de ruta.

### Cuatro datos que yo le pasé mal al `spec_author`

Los midió contra el árbol y me corrigió los cuatro: `map.tsx` son **406**
líneas y no 388 (#94 lo engordó al mergear la víspera); `ui-copy-table.ts`
tiene **87** ocurrencias de `(tabs)` y no 90; `ui-language.test.ts` **no
participa**; y el ternario se invierte. Verifiqué las cuatro correcciones antes
de pasarle la spec al humano. Moraleja repetida de
`premisas-de-explore-sin-verificar`, esta vez con el leader como fuente del
dato falso: el baseline que mides tú al abrir la sesión también caduca cuando
otra feature mergea entre medias.

### Coordinación con la sesión de #106 + #107

Reparto pactado y **respetado por las dos partes**: intersección de ficheros
**vacía**. Ayudó que su §D10 sacara a propósito su candado de
`design-drift.test.ts` y lo metiera en `food.test.tsx`, lo que dejó los cinco
candados compartidos sin disputa para #102. Sigue en pie
`reparto-de-ficheros-caduca-al-mergear`: quien mergee segundo se come el
conflicto en `feature_list.json`, `progress/current.md` y este fichero.

`./init.sh` no se lanzó en toda la feature: #102 no toca
`backend-pet-tracker/` (verificado, ninguno de los 20 ficheros del diff está
ahí) y los puertos eran de la sesión vecina.

---

## 2026-09-21 / 2026-09-22 — #106 `mobile-meals-bar-motion` + #107 `mobile-meal-toggle-press-lock`

Dos entradas del `feature_list.json` cerradas con **una sola spec y un solo
ciclo**, por decisión del humano: tocaban el mismo `Pressable` de
`food.tsx` y la misma barra de `screens/home/index.tsx`, y #107 por su cuenta
eran dos líneas de aserción que no justificaban su propio gate, su propio Codex
y su propia revisión. Spec en `specs/mobile-meals-bar-motion/`, firmada en
`ca13a804`; PR y merge al cierre.

Entregado: la barra de comidas de la Home transiciona su ancho con `withTiming`
(250 ms, `Easing.bezier(0.77, 0, 0.175, 1)`) y se fija sin animar con reduce
motion; servir y deshacer una franja vibran distinguiendo éxito de fallo; y el
feedback de pulsado del botón por franja por fin tiene candado.

Entró **`expo-haptics` ~57.0.3**, primera dependencia nueva desde el veto. El
veto vivo era nominal a `expo-linear-gradient`, no genérico, así que se pudo
pedir. El humano firmó tres cosas que no eran requisitos técnicos: la
instalación, la enmienda a `docs/ui-guidelines.md:171` —que afirmaba que no
estaba instalada, y la carta es el gate C8— y que su dev build de Android
quedaba obsoleto, porque un módulo nativo no entra por OTA ni por Metro.

### Lo que se llevó las tres rondas: candados que no candaban

El código de Codex no dio **una sola** objeción de comportamiento. Las tres
rondas se fueron en tests que decían vigilar algo y no lo vigilaban, tres veces
seguidas y cada una destapada por el mecanismo anterior.

**#98 → #107.** La feature nació porque el `style` pressed de `food.tsx` no lo
miraba ninguno de los ocho usos de `meal-toggle-0`.

**B1.** El candado nuevo de R2 aseveraba contra `MEALS_BAR_TIMING` **importado
del propio módulo de producción**: mutar `MEALS_BAR_DURATION_MS` de 250 a
**2500** dejaba 138/138 en verde, porque la mutación movía los dos lados de la
igualdad. Tautología. La sonda de Codex era honesta —mutó el call-site y eso sí
enrojece— solo que demasiado débil para tocar lo que fija la carta.

**B6.** El candado que sustituyó a B1 muestreaba la curva en `0.25` y `0.75`.
El reviewer demostró que eso son **2 ecuaciones sobre 4 parámetros** y barrió
la rejilla con una réplica del `Bezier.ts` de Reanimated hasta construir
`Easing.bezier(0.97, 0.0893960980395263, 0.17, 0.9976664429227766)`: pasa
138/138 **desviándose 0.33** a mitad de recorrido —la barra iría por el 28% en
vez del 60%— porque los dos puntos elegidos caen en los tramos planos y el
error se esconde en el salto central que queda entre ellos. Cerrado
muestreando nueve puntos, con el barrido repetido para confirmar que no queda
ni una solución en toda la rejilla.

La regla que sale de las tres: **un candado que asevera contra un símbolo
importado de producción no canda nada**, y **un candado que muestrea un
continuo canda solo los puntos que muestrea**. La diferencia entre B1 y B6
importa para decidir si se rebota: el agujero de B1 lo pisa cualquiera cambiando
un 250, el de B6 necesita un solver. Por eso B1 fue rebote a Codex y B6 se
arregló con el `implementer` sin volver a Codex.

### El rechazo de la ronda 1 fue mío, no de Codex

`./init.sh` salió **exit 1** en `init.sh:156`: «Más de 1 feature en
in_progress». Yo había puesto #106 **y** #107 en `in_progress`. El script
aborta ahí y **nunca llega a correr build, tests, e2e, lint ni typecheck**, así
que un error de bookkeeping del leader se disfraza de rechazo técnico. El
reviewer corrió a mano las ocho patas que el script se saltaba —todas exit 0— y
además **simuló** la segunda mina en vez de deducirla: `init.sh:165` exige
`specs/<nombre>/requirements.md` a toda feature `in_progress` o `done`, y #107
no tiene spec propia.

Arreglo: #107 vuelve a `spec_ready` y pasa a `done` a la vez que #106, y se le
añade un **fichero puntero** en `specs/mobile-meal-toggle-press-lock/` que dice
dónde vive su spec y por qué. El harness modela **una feature por ciclo**; dos
entradas compartiendo uno necesitan esa costura explícita.

### Premisas mías que se cayeron al verificarlas

Cuatro, y dos importan. **En este repo no hay NativeWind**: el procesador de
`className` es **uniwind** `^1.11.0`, y yo lo venía diciendo mal arrastrándolo
del contexto de #98. Y **el camino preferido de mi propio rebote de #98 estaba
equivocado**: `props.style` de un `Pressable` con `style` de función llega
**resuelto** (`{opacity: 1}`), no como función, y `pressIn` no lo cambia. El
camino bueno era el de respaldo, y encima sin normalizar producción: diff neto
de `food.tsx` por R5 = **cero**.

Codex también midió y descartó un camino antes de elegir, que es exactamente lo
que se le pidió: comparar contra un `Easing.bezier` fresco **no** funciona,
porque las closures `factory` son referencias distintas aunque los cuatro
parámetros coincidan.

### Triaje de las deudas: 2 de 7

`fuera-de-alcance-no-todo-es-feature` otra vez. De las siete deudas del
veredicto, **B1 y B6 quedaron cerradas** dentro del ciclo, **B4 se la llevó la
sesión Backend como #108**, **B7 y B5 se arreglaron aquí mismo** —una es
redacción de una celda de trazabilidad, la otra un apunte en la plantilla de
handoff— y **B8 no se registra**: falla hacia rojo si alguna vez colisiona. Se
registran **dos**: #109 y #110.

De las dos, la que importa es **#110**: el doble de Reanimated de
`index.test.tsx` trae un `jest.mock('heroui-native')` que no canda nada —
quitarlo deja 138/138 verde— y que **sustituye el `Skeleton` real en los 138
tests del fichero, incluido el de #62 R8**, una feature ajena que cree estar
probando producción y está probando un doble. Un mock de conveniencia degradó
el test de otra feature y nadie lo notó hasta tres rondas después.

### B5 — pedir una skill que no existe no da error, da silencio

El handoff pidió `expo-overview` y `expo-animation`. Ninguna de las dos estaba
en el catálogo de Codex, que acabó cargando `expo:building-native-ui`. No hubo
aviso: el reviewer lo descubrió al final. Queda anotado en la plantilla de
handoff de `.claude/agents/leader.md`.

### Coordinación con la sesión de #94 / #102 / #108

Sin un solo conflicto, y no por suerte. Ellos dejaron `food.tsx` y
`screens/home/index.tsx` fuera del alcance de #102 **a sabiendas** de que los
teníamos nosotros, y midieron nuestro merge por su cuenta en vez de suponerlo.
El intercambio produjo dos correcciones mutuas: yo dije «el guard de hex es una
línea» sin abrir el fichero —son **ocho** guards con el regex duplicado— y
ellos contaron «siete cortas y dos largas» cuando son **seis y dos**. El
hallazgo más útil salió de revisar ese recuento: **las dos guardas largas
difieren entre sí** (`:197` lleva `StyleSheet\.create`, `:343` lleva
`StyleSheet(?:\.create)?`), así que unificarlas a ciegas cambiaría lo que cada
una cubre. Eso convirtió «dejar el regex en un sitio» en una decisión de diseño
para la spec de #108.

`./init.sh` final sobre el árbol ya fusionado con `main`: **exit 0** medido sin
pipe — backend 1295, infra 14, móvil 77 suites / 1396 tests, e2e 384, lint y
typecheck.

---

## 2026-09-22 — #109 `mobile-meal-toggle-source-lock-nesting`

Deuda **B2** del veredicto de #106/#107. Cerrada con dos líneas de cambio en un
fichero de test y **cero diff de producción**. Aprobada por el reviewer sin
rebote y sin prueba de humo: sin cambio en producción no hay nada observable en
el dispositivo, y la spec lo declaró por escrito antes del handoff.

### El agujero, que era peor de lo que parecía

El candado de R5 de #107 recortaba el fuente de `food.tsx` entre
`lastIndexOf('<Pressable', anchor)` e `indexOf('</Pressable>', anchor)`. El
encargo decía «agujero por anidamiento» sin decir en qué dirección, y **yo
aposté por el límite de atrás y me equivoqué**.

Es el de **delante**, y su modo de fallo es el malo: con un `Pressable` anidado
dentro, el corte cae en el `</Pressable>` **del hijo**, así que el bloque se
queda con el **tag de apertura del hijo y su `style`** dentro. El candado
**pasa en verde vigilando el botón equivocado**. No falla hacia rojo, que es lo
que yo había supuesto y lo que habría hecho la deuda inofensiva.

El de atrás resultó benigno por una razón que solo se ve midiendo: el ancla
`testID={…}` vive **dentro** del tag que `lastIndexOf` busca, así que ese
límite se auto-ancla.

### El arreglo, y lo que se descartó

Recortar de `<` a `<` — el tag de apertura propio. **El anidamiento deja de
existir como concepto**, en vez de defenderse de él. Dos `indexOf`, ningún
símbolo nuevo que vigilar, que era justo el aviso de **B8**; y el patrón ya
vivía en `consistency-classnames.test.ts:309-311`.

Se descartaron dos alternativas, las dos midiendo:

- **Balanceador de tags**: sería él mismo otro candado que mantener.
- **Borrar el candado de fuente** y dejar solo la pata de árbol. Medido: cambiar
  `0.8` por `0.5` deja el árbol **verde** y solo el fuente **rojo**. La pata de
  fuente es el **único** sitio donde ese `0.8` está candado. Borrar habría
  parecido limpieza y habría sido una pérdida silenciosa de cobertura.

### El candado nuevo también tiene un agujero, y esta vez se decidió no taparlo

El reviewer corrió siete sondas propias sobre el recorte nuevo. Es **más seguro
que el viejo** —donde el viejo fabricaba verde falso, el nuevo se pone rojo— y
su límite documentado (un `<` dentro del tag) falla hacia rojo, verificado
plantándolo y no leyendo el comentario.

Queda **uno residual**: todo lo que viva entre el `>` del tag y el primer hijo
**elemento** entra en el bloque, incluida una **cadena hija**. Plantar la receta
como texto da verde falso. Pero hay que construirlo a propósito y tumba 25 de
38 tests al intentarlo, y **el recorte viejo también daba verde ahí**, así que
no es regresión.

Se aplicó el criterio que salió de #106 —**¿lo pisa un descuido o hay que
construirlo?**— y la respuesta manda: se documenta, no se defiende. Defenderlo
sería otro símbolo que vigilar, y la defensa cuesta más que el riesgo. Queda
escrito en `docs/conventions.md` con **los dos límites y cuál de los dos
avisa**, más la condición que cambiaría el cálculo: el día que un candado de
estos vigile algo que también aparezca como texto en pantalla.

### Primera spec aprobada desde Notion

Estrena el flujo de #147. El humano movió `Estado del gate` a **Aprobado** en
la página de la base *Specs*; el leader la leyó, verificó la propiedad y su
`page_last_edited_at`, y firmó en el repo citando las dos cosas.

La primera vuelta destapó un fallo en lo que yo mismo había escrito el día
antes: **la sección prometía verificar *quién* aprobó, y la API no lo da** —
devuelve qué y cuándo, pero el filtro por editor es de plan Business. Corregido
en `leader.md` y declarado dentro de la propia spec, para que nadie lea dentro
de seis meses «firmado por el humano» y suponga más de lo que se puede probar.
La firma en el repo sigue abierta para cualquier spec que necesite autoría
demostrable.

### B5, reincidente

Codex volvió a no tener `expo-overview` en su catálogo, igual que en #106.
Inocuo aquí —cero producción— pero es la segunda vez. Hasta que se cierre, el
handoff ahora le pide **listar las skills de su catálogo y decir cuáles cargó
en el reporte**, para que el fallo salga ahí y no en el veredicto.

`./init.sh` del reviewer: **exit 0** sin pipe, 5m51s, cero FAIL. El reviewer
esperó a que cayera la corrida de #108 en `wt-ui` antes de lanzar, según
`init-sh-concurrente-worktrees`.

---

## 2026-09-22 — #110 `mobile-reanimated-double-dead-weight`

Deuda **B3** del veredicto de #106/#107. **Aprobada sin rebote**, cero
bloqueantes, cero diff de producción. El fichero de tests de la Home pasa de
138 a **140** tests y la suite móvil de 1396 a **1398**.

El doble de la cabecera sustituía el `Skeleton` real de `heroui-native` por un
`View` pelado en todos los tests del fichero. No candaba nada —quitarlo dejaba
la suite verde— pero borraba la clase base del componente, el `borderCurve` y
toda la superficie de animación. Ahora se monta el real, y dos tests nuevos lo
candan.

### La premisa con la que yo abrí la deuda era más ancha que la realidad

La registré diciendo que **el test de #62 R8 creía probar producción y probaba
un doble**. Se midió y es falso en la parte que importa: mutar lo que ese test
vigila da **1 rojo idéntico con doble y sin doble**. El doble **no estaba
cegando esa aserción**. Sobrevive a quitarlo porque asevera con `toContain`
sobre el `className` y **ambos** Skeletons lo propagan; el real antepone
`skeleton__root`, así que con `toBe` sí habría enrojecido.

Lo que el doble borraba era real, pero #62 R8 no era su víctima. La sesión de
Backend levantó la misma sospecha por su cuenta —«un test que no se entera de
que le quitan el doble es lo que #110 dice estar cazando»— y la respuesta fue
la medición, no el argumento.

**Lección, que es la de siempre con otra cara:** al registrar una deuda desde
un veredicto, lo que se copia es la observación del reviewer, no su alcance.
Aquí el alcance se ensanchó por el camino y llegó a `feature_list.json` como un
hecho. Verificarlo costó una sonda de dos minutos.

### La desviación firmada

Los títulos de los tests nuevos **no llevan `#110`**: van en la forma
`R<n> (mobile-reanimated-double-dead-weight)`, sin almohadilla. El literal
`#110` casa con `/#[\da-f]{3,8}\b/i` —`1`, `1` y `0` son dígitos hex— y pondría
**rojos los cinco guards** de `design-drift.test.ts` que enumeran ese fichero.
El reviewer lo verificó ejecutando la regex contra las dos formas.

Las alternativas se descartaron por escrito: partir el literal es justo lo que
**#108 está retirando**, y esperar a #108 acopla esta feature a otra que aún no
ha tocado código.

**Lo que hizo falta arreglar:** la desviación estaba razonada y medida en
`design.md` **pero no había dónde firmarla**. El humano habría firmado la spec
sin firmar la desviación, que es exactamente lo que costó una ronda en #98. Se
le añadió su casilla al Gate 1. La regla se confirma otra vez: **una decisión
que no es técnica necesita una casilla, no un párrafo.**

### Lo que el reviewer añadió por su cuenta

Inventarió **las nueve aserciones** sobre Skeletons del fichero para descartar
que quitar el doble perdiera cobertura en silencio. La única de riesgo ya
estaba escrita con `arrayContaining`/`objectContaining`, igual de laxa antes y
después. Y volcó el nodo real con una sonda transitoria que **no toca** el `it`
de #62 R8, para confirmar las dos mediciones de la spec sin tocar una spec
firmada.

Descubrió además que **la ganancia es mayor que la medida**: `pet-hero-header`
no está mockeado, así que sus tres Skeletons también pasan a reales.

### Triaje: cuatro observaciones, cero features

Ninguna se registra, y merece la pena decir por qué:

- **`borderCurve` se recupera pero ningún test lo canda.** No se registra
  porque **no es nuestro**: es una prop interna de un componente de
  `heroui-native`. Candarla sería testear la librería de otro.
- **`conventions.md` lleva un `#110` literal.** Inocuo y **verificado**: ningún
  guard lee ese fichero con la regex de drift. Queda escrito en el veredicto
  precisamente para que nadie lo «arregle».
- El párrafo de #112 en `conventions.md` viaja en esta PR por venir de la fase
  de spec. Correcto.
- La ganancia extra de `pet-hero-header` es buena noticia, no deuda.

### Coordinación: un gate ajeno que esta feature caduca

Los +2 tests dejan obsoleta la línea base de **#108**, cuyo criterio firmado
decía «1396 antes, 1410 después». Se avisó **al medirlo, no al cerrar**, porque
era el dato que les cambiaba el handoff.

Su criterio sobrevive porque lo redactaron **también en forma delta**, y de ahí
sale la mejor frase del intercambio, que afila una regla nuestra:

> «El recuento final se deriva de esa suma, no de un número suelto. Si al
> cerrar la cuenta no da, la pregunta correcta es qué requisito aportó un test
> de más o de menos, no cuál era el número.»

Nuestra regla decía «usa delta, no absoluto». La suya dice **por qué**: un
recuento es una derivación, y cuando no cuadra la pregunta útil es de
atribución, no de aritmética.

Y el aviso que se les dio de vuelta: los 1398 vivían en la branch, **no en
`main`**. Re-medir contra `origin/main` antes del merge habría fijado otra base
que caducaría al mergear. Eligieron que Codex mida la base al arrancar, que es
lo único inmune al orden de merge.

`./init.sh` del reviewer: **exit 0** sin pipe, primer plano. Móvil 77/1398,
backend 170/1295, infra 2/14, e2e verdes.

## #111 `mobile-flaky-waits` — 2026-09-22

Endurecimiento de **esperas** en dos ficheros de test, `screens/health/index.test.tsx`
y `screens/map/index.test.tsx`. **Cero cambio de producción**: 0 ficheros no-test
tocados. Recuento intacto, **77 suites / 1396 tests** antes y después, `tsc` 0
bytes. Dos rondas: `reviewer` rechazó la primera, aprobó la segunda.

### Lo que la justificó, y lo que NO la justificó

Nació de **cuatro corridas rojas reales** (logs versionados en
`progress/logs-111/`) que **nunca se reprodujeron**: después salieron **doce
verdes seguidas**, con caché fría, caliente y los cuatro núcleos saturados. La
spec dice por escrito que **no promete eliminar ningún flake** y que la causa de
esa ventana sigue sin identificar.

Lo que sí la justificó es objetivo: `docs/conventions.md` §*Esperas sobre el
árbol renderizado* exige que la condición que termina una espera sea la misma
observación que hacen las aserciones posteriores, y había sitios que la
incumplían. **Un defecto de convención es defecto se reproduzca o no.**

Corrección que tuve que hacerme a mí mismo a mitad: llegué a decirle al humano
que «el gate de #102 cayó en corridas afortunadas». Con 12/12 verdes después,
esa frase estaba de más y la retiré.

### El dato que me desmintió, y que cambió un requisito entero

Yo escribí en la entrada que los tests corrían contra un `waitFor` de **5000 ms**.
Falso. El `spec_author` lo midió: **RNTL agota a 1000 ms**
(`asyncUtilTimeout: 1000`, y `test/jest-setup.js` no llama a `configure`). Los
5000 son el `testTimeout` de jest, que acota el **test entero**.

Consecuencia: en las cuatro rojas **venció el plazo de RNTL**, así que subir
`testTimeout` —lo que yo había planteado— **no habría salvado ninguna**. De ahí
salió **R4**, que prohíbe tocar la config y explica por qué. `package.json` salió
de `files_affected`.

### El inventario destapó siete sitios, no dos

Y #72 no los había dejado fuera: **se le escaparon**. Su R2 barrió el sub-patrón
estrecho —esperar a un mock o a la caché y aseverar el árbol—; estos eran el otro
—esperar al árbol, pero a un nodo **más débil** que el que se asevera—. Dos
hallazgos quedan registrados **sin tocar**: `map:544-554` es un **candado
tautológico** (ruta-en-error y ruta-pendiente pintan idéntico, ningún nodo las
distingue) y `health:566-576` es el segundo sitio que #72 se dejó.

### R1: convertir un flake irreproducible en un rojo al 100 %

Lo mejor de esta feature. R1 fue por la **vía (a)**, con rojo real: una viga de
200 ms sobre la fuente tardía hace fallar el test **siempre**, con la firma
literal de los logs (`Unable to find an element with testID: weight-current`).
**Esa viga se queda en el árbol.** Revertir la corrección vuelve a poner el test
rojo de forma determinista, en vez de en una ventana que nadie supo reproducir.

Los 200 ms no se eligieron a ojo: se derivan de `DEFAULT_INTERVAL = 50` y
`asyncUtilTimeout = 1000`, con `50 < 200 < 1000`.

### Los dos bloqueantes de la ronda 1, y cuál era culpa de quién

- **B1 — culpa de la spec, no de Codex.** El `reviewer` no pudo cerrar la vía (b)
  de C4 para **S2** porque **no existe par rojo/verde y no es obtenible**. La
  causa: S2 cae en la tercera categoría de la propia §F4 —aserciones
  **causalmente implicadas** por el estado esperado—, que §F4 declara **no
  defecto**. `health/index.tsx:55` y `:61` declaran las queries con
  `enabled: selectedPetId !== null`, el mismo estado que pinta el chip esperado.
  **La tabla de §R2 se contradecía con §F4.** Se le pidió a Codex un rojo que no
  existe. Cerrado con la **Enmienda E1**, firmada: S2 sale de §R2 (siete sitios →
  seis), su evidencia pasa al **argumento de invariancia sin mutación** con el
  precedente exacto de #72 §S6, y el cambio se conserva como endurecimiento
  defensivo porque el conjunto de aserciones es idéntico.
- **B2 — culpa de Codex, y de una línea.** En S4 **eliminó**
  `expect(screen.getByTestId('map-view')).toBeVisible()` en vez de moverla,
  incumpliendo la regla dura de §R2: *ninguna corrección puede aseverar menos de
  lo que asevera hoy*. El test gemelo S3, en el mismo `describe`, sí la conservó.
  La ronda 2 fue **+1 línea**.

Los dos los verifiqué yo antes de aceptarlos, y el `reviewer` re-midió por su
cuenta lo que Codex reportaba: el rojo real de R1, la zona ciega de S4, R3 byte a
byte (393 vs 393 bytes).

### Coordinación

Reparto con la sesión de #106/#107/#109/#110 respetado en las dos direcciones.
Dos avisos suyos evitaron paradas nuestras y uno nuestro evitó una suya:

- Nos avisaron de que **#110 subía la base de 1396 a 1398** antes de mergear, lo
  que salvó el gate de #108.
- Nos avisaron del **desplazamiento de 23 líneas** en `home/index.test.tsx`, que
  habría mandado a Codex a la línea equivocada en #108.
- Les avisamos de que **quitar el `jest.mock` cambiaba el texto** de un fichero
  que cinco guards de `design-drift.test.ts` leen **como texto**, no ejecutan.

De ahí salió la regla que queda: **lo que se desplaza no puede ser el ancla**.
Números de línea y recuentos absolutos son el mismo error con dos caras; el ancla
es contenido grepeable y el número va como descripción fechada, nombrando por
escrito quién lo volverá a mover.

### Notas de harness

Primera feature firmada por el **gate de Notion** (`CLAUDE.md` §Gate de specs vía
Notion, que entró ese mismo día con el PR #147). Dos firmas: la spec y la
enmienda E1, las dos verificadas por consulta directa a la base antes de
teclear el commit.

Y el handoff fue el primero que dijo explícitamente **«no cargues ninguna skill
de Expo»**: el plugin de Codex es la v1.0.2 con 13 skills y **ninguna** cubre
esperas de jest. Pedir una que no existe no da error, da silencio.

---

## #108 `design-drift-hex-guard-rid` — 2026-09-23

El guard de colores hex de `src/__tests__/design-drift.test.ts` confundía un
R-id de tres cifras con un color: `/#[\da-f]{3,8}\b/i` y los dígitos `0-9` son
un subconjunto de los hex, así que **`#106` casaba**. Frontera exacta: `#98` son
dos caracteres y no casa; **`#100` en adelante sí**. Afectaba a toda feature de
id ≥ 100.

Cuatro pares rojo→verde (R1..R4), `reviewer` **aprobado sin bloqueantes**.
Cierre: **77 suites / 1412 tests**, `design-drift.test.ts` **55 tests en 21
describes**, `tsc` 0 bytes.

### De dónde salió: un aviso de la sesión vecina, no un test rojo

Lo destapó #106 al escribir `describe('#106 R2: …')` y ver el guard morder. Su
sesión lo esquivó partiendo el literal (`'#' + '106 R2: …'`), que funciona pero
deja `grep '#106 R2' src/` en **falso negativo** — y ese grep es el método con
el que la trazabilidad cita el título del describe y el `reviewer` verifica C5.
Nos lo pasaron como deuda; lo verificamos y lo cogimos.

**Su estimación de coste era falsa y lo dijimos.** Dijeron «es una línea». El
regex estaba duplicado en **ocho** guards: seis con la forma corta (117, 220,
260, 279, 301, 322) y dos con la larga (197, 343). Y al desglosarlo salió algo
que el total escondía: **las dos largas no son iguales entre sí** — `:197` lleva
`StyleSheet\.create` y `:343` lleva `StyleSheet(?:\.create)?`. Unificarlas
habría cambiado cobertura sin requisito detrás, así que la spec las **deja
separadas** y comparte solo el átomo roto.

Yo también me equivoqué al registrar la entrada: escribí «siete cortas y dos
largas», que suman nueve contra ocho. Lo cazó la sesión vecina **porque publiqué
el desglose**: un total solo se verifica recontando, un desglose se verifica
sumando.

### El arreglo, y por qué es contextual y no léxico

`HEX_LITERAL` pasa de **8 ocurrencias a 1** y la exclusión va como **lookahead
negativa dentro del átomo**: `#(?!\d{2,3} R\d)[\da-f]{3,8}\b`. No como
alternativa hermana, porque el `\b` casa contra el espacio que sigue y el orden
dentro de una alternancia sería una trampa para el siguiente que lo edite.

La fila crítica de la tabla de frontera es **F5: `#000` espera `true`**. Es tres
dígitos decimales **y** un color real, así que cualquier exclusión puramente
léxica —«tres decimales nunca es color»— lo habría apagado, junto con `#111`,
`#222` y `#999`. Eso es lo que el humano firmó de fondo: que `#<id> R<n>` pasa a
ser **contrato con una máquina**, y que una cita suelta seguirá poniendo el
guard en rojo a propósito. R4 lo escribe en `docs/conventions.md`.

Cada una de las ocho filas se asevera contra **las tres** formas compuestas, y
los valores esperados van **literales**, nunca derivados de `HEX_LITERAL`: un
candado que asevera contra el símbolo que vigila mueve los dos lados de la
igualdad al mutarlo (lección de `MEALS_BAR_TIMING` en #106).

### La lección que se llevó por delante dos veces el gate

Esta feature esperó firma mientras **#110 y #111 mergeaban**. Su gate original
era el absoluto `1396 → 1410`, y **nunca llegó a ser cierto**: #110 subió la base
a 1398. Se reescribió como **derivación** antes de la firma —el implementador
mide su propia base y comprueba `+14`— y al cerrar dio **1398 + 14 = 1412**,
clavado. El absoluto habría fallado dos veces.

Lo mismo con las posiciones: el handoff mandaba a Codex a `:3790` y `:3835`, y
#110 los movió **23 líneas arriba**. Se salvó porque la sesión vecina avisó
mientras miraba el diff. Ahora el ancla es `grep -n "'#' + '"` y el número queda
como descripción fechada, nombrando por escrito que **#112 los moverá otra vez**.

De ahí la regla: **lo que se desplaza no puede ser el ancla**. Recuentos y
números de línea son el mismo error con dos caras.

### Verificaciones que no se heredaron del reporte

El `reviewer` corrió los cuatro commits rojos y midió que **todos fallan por
aserción**, ninguno por `ReferenceError` ni módulo ausente. Para R2 confirmó lo
que la spec predecía: contra el regex viejo **solo F1 falla**, F2–F8 ya estaban
verdes. Reprodujo las ocho filas en `node` al margen de jest (8/8, con F5 en
`true`), comprobó que ninguna forma lleva flag `g` —con `g`, `.test()` guarda
`lastIndex` y todo depende del orden— y sondeó revirtiendo el fichero de Home
contra el `design-drift.test.ts` nuevo: 3 rojos, exactamente los tres de R3.

**`sourceFiles()` no se tocó**: solo aparece como contexto en el diff, y el
inventario da cuatro describes añadidos y **cero suprimidos** (17→21).
Modificarlo apagó 14 describes en silencio en la ronda 1 de #94.

### Desviaciones, todas no bloqueantes

- Codex **trabajó en el worktree equivocado** y lo cambió de branch. Sin pérdida
  —todo commiteado y pusheado—, pero dejó los worktrees cruzados.
- Codex escribió `progress/history.md` y vació `progress/current.md`, que son
  artefactos de cierre del leader. Texto honesto, decía explícitamente que no
  marcaba `done`.
- Un commit extra sobre los ocho prescritos, para partir por concatenación la
  aguja del test de R3 y evitar que el gate de grep diera falso positivo sobre
  el propio candado. El `reviewer` sondeó que **no lo debilita**.
- La nota de cierre de `traceability.md` seguía citando `1396 + 14 = 1410`.
  Corregida al cerrar: el número que nunca fue cierto no se queda escrito.

## #104 `nutrition-kcal-consumed` — 2026-09-23

Sesion Backend, worktree `/home/claude/sites/Pet-Tracker-wt-backend`, branch
`feature/104-nutrition-kcal-consumed` desde `origin/main` 2be1b023. En paralelo,
la sesion Frontend llevaba #95 en el tree principal.

### Que se hizo

El `GET /v1/pets/:petId/nutrition-plan` devuelve un campo nuevo,
`kcalConsumedToday`: las kcal de las franjas servidas hoy. Una funcion pura de
dominio, `kcalConsumed(merKcal, mealsPerDay, servedCount)` en
`meal-serving.entity.ts`, cableada en `GetNutritionPlanUseCase` y en el mapper.
Cero migraciones, dependencias, variables de entorno o metodos de puerto.

Decisiones firmadas: **D1** parte la feature como #83/#98 (la tarjeta Objetivo
diario pasa a **#113** `mobile-kcal-consumed-bar`, id coordinado con Frontend);
**D2** reparto uniforme con un solo redondeo sobre el agregado, asi que todas
servidas da `merKcal` exacto y el valor solo depende de cuantas, no de cuales;
**D3** un unico campo, solo en el `GET` del plan; **D4** derivado al leer con el
plan vigente, de modo que si el plan cambia a mitad de dia las franjas servidas
se revaluan; **D5** el dia es el de #83 (`ownerLocalDay`), sin redefinirlo.

### Premisas que no se heredaron

La entrada de #104 decia que el Make pinta una BARRA "y no un anillo". Es falso
a medias: la tarjeta pinta las dos cosas con el mismo porcentaje. No afecta al
backend, pero queda escrito en #113, cuya spec elige. Y "saber cuanto vale cada
franja" no hacia falta: la tarjeta lee un solo numero, asi que basto con
declarar el reparto (segunda rama del criterio 1) en vez de persistirlo.

### Gate y ciclo

- Spec `9932f314`, espejada a Notion; el humano puso Aprobado y el leader firmo
  en `5b743931` citando la pagina y `page_last_edited_at` 2026-09-23T14:22:43Z.
- Codex: seis commits en el orden de `tasks.md` (R1 test/feat; tests rojos de
  R2, R3 y R4; feat compartido) mas uno de trazabilidad.
- Reviewer (`aea4fcab`): reprodujo los rojos, todos por asercion; siete
  mutaciones (floor, ceil, redondeo por franja, mitad hacia abajo,
  `mealsPerDay` en vez de servidas, `served` sin filtrar por plan, dia UTC)
  detectadas todas. Aprobado sin bloqueantes.
- init.sh final: unit 170/1298 (+3), e2e 27+3 skip / 389+8 skip (+5), movil
  77/1412 sin cambios, exit=0 sin pipe.

### Desviaciones, todas no bloqueantes

- Tras el reinicio del VPS de las 03:52, Postgres y LocalStack estaban caidos;
  Frontend los levanto con `docker compose up -d` y los init.sh se turnaron por
  mensaje entre sesiones.
- El handoff sustituyo el init.sh de `tasks.md` §0 y §Cierre por la linea base
  del leader y las suites filtradas, porque el LocalStack es compartido.
- El clasificador de permisos denego `./init.sh` al reviewer ("Interfere With
  Workloads"). El leader no lo rodeo: el humano decidio y el leader lo corrio;
  el reviewer leyo el log el mismo y lo dejo escrito en la review.
- Codex cargo la skill `ponytail:ponytail` (no es de expo); el verde de R1
  reformateo con Prettier un `it` sin cambiar su contenido.
- El leader firmo y dio el handoff sin hacer push, y el humano lo tuvo que
  pedir. Queda en la memoria del flujo de aprobacion.

# Sesión #95 mobile-detail-screens-to-stack (2026-09-23, sesión Frontend)

## Feature #95 `mobile-detail-screens-to-stack` (P3)

- **Sesion**: Frontend (leader), tree principal `/home/claude/sites/Pet-Tracker`,
  branch `feature/95-mobile-detail-screens-to-stack` desde `origin/main` `2be1b023`.
  En paralelo, Backend cerro #104 y arranco #113 en `wt-backend`.
- **Estado**: `done`. PR #155 pendiente del merge humano.

### Que se hizo

Las seis pantallas de detalle (`add-reminder`, `pets/add`, `pets/[petId]/docs`,
`weight-log`, `meal-schedule` y `pairing`) salen de `src/app/(tabs)/` al Stack
raiz:
- `RootStack` con `Stack.Protected guard={status === 'authenticated'}`. El
  `Redirect` de `(tabs)` se queda donde estaba, y `(auth)` y `reset-password`
  siguen libres.
- `SelectedPetProvider` sube al layout raiz y la seleccion queda ligada al
  `token` de la sesion (R1).
- Cabecera nativa con los tokens del tema. Fuera los seis botones de volver
  hechos a mano y sus seis claves del catalogo.
- Metricas bajo la excepcion A11.
- Retirada del reset en blur de #63.
- `router.dismissTo('/map')` en `pairing` (A12).

### Gate y ciclo

- **Spec** `5fe72925`, espejada a Notion. El humano puso Aprobado y el leader
  firmo en `a4b3e69f`, citando la pagina y `page_last_edited_at`
  2026-09-23T14:15:50Z. La firma cubre la spec, A11 y A12, y acepta los valores
  por defecto de las ocho preguntas abiertas.
- **Codex ronda 1**: 20 commits, rojo antes que verde en cada R-id.
- **Reviewer ronda 1**: rechazado. Los `it` de R5 de `weight-log` y
  `meal-schedule` solo renderizaban la carga, y las mutaciones M20, M21 y M22
  sobrevivian. Ademas, el clasificador de permisos le denego `init.sh`.
- **Codex ronda 2** (`handoff_95_rebote_B1.md`): tres commits. El rojo es una
  mutacion de produccion versionada y revertida (C4 via b); el diff neto de
  produccion es vacio y el delta de tests es cero.
- **init.sh**: lo corrio el leader con permiso explicito del humano sobre
  `7702e7eb` (exit 0; movil 80/1426, +3/+14; e2e 27+3 skip). El reviewer de la
  ronda 2 leyo el log crudo y comprobo que el HEAD coincidia. Aprobado.
- **Integracion**: `origin/main` (#104) entro por merge, sin rebase, en
  `90494116`. El unico conflicto fue el final de `feature_list.json` (#113 y
  #114), y se conservaron los dos.
- **Prueba de humo**: el humano la firmo en `63796c58`. El paso 8 necesito
  `adb -s <serial>` porque el mismo telefono salia dos veces por Wi-Fi (IP y
  mDNS). No hubo drift de codigo desde el veredicto.

### Deuda y apuntes

- Registrada #114 `mobile-reminders-alerts-to-stack` (pending).
- Arreglados de paso en `677fbcad`: el ejemplo caducado de
  `docs/conventions.md` §Filtros de jest y la ruta de #103.
- Observaciones del reviewer que no bloquean:
  - el `describe('#95 R8')` esta anidado en pairing;
  - `(tabs)/_layout.tsx` conserva la sangria del provider retirado;
  - los `it` de R5 ya no miran la carga (techo: un titulo que solo exista
    mientras se muestra el Skeleton);
  - el grep de §Cierre de tasks.md chocaba con el propio test de R5, y Codex
    compuso las claves por partes (leccion de spec).
- Tras el reinicio del VPS a las 03:52, `pet-tracker-postgres` y
  `pet-tracker-localstack` estaban caidos, sin politica de reinicio. Se
  levantaron con `docker compose up -d`.

## #113 `mobile-kcal-consumed-bar` — 2026-09-23

Sesion Backend, worktree `/home/claude/sites/Pet-Tracker-wt-backend`, branch
`feature/113-mobile-kcal-consumed-bar` desde `origin/main` 103a3366 (#104
mergeada) y rebasada sobre a833f153 al mergear #95. En paralelo, la sesion
Frontend cerraba #95 y llevaba #114 en el tree principal.

### Que se hizo

La tarjeta Objetivo diario de `src/app/(tabs)/food.tsx` pinta las kcal
servidas hoy contra `merKcal`, leyendo el `kcalConsumedToday` que el `GET` del
plan devuelve desde #104. El tipo `NutritionPlan` gana el campo; bajo la fila
actual entra un bloque `food-plan-progress` con `{n} kcal`, `{pct}%` y una
barra cuyo relleno transiciona su ancho. Una clave de catalogo nueva,
`food.kcalConsumedOfTarget`, como nombre del unico `progressbar`. Cero
dependencias, tokens o llamadas HTTP.

Decisiones firmadas: **D1** barra sola, sin el anillo del Make (el mismo
porcentaje dos veces, y el anillo retiraba el tile y contradecia D2 de
`mobile-food`); **D2** `pct = merKcal > 0 ? Math.round(c / m * 100) : 0`,
leido del campo y nunca derivado de `servedToday`; **D3** `withTiming` 250 ms
con `Easing.bezier(0.77, 0, 0.175, 1)` y `ReduceMotion.System`, la receta de
#106; **D4** texto a opacidad plena, no el `white/70` del Make (no llega a AA);
**D5** una sola clave nueva, `kcal` y `%` fuera del catalogo por D7 de #65;
**D6** esqueleto `h-32` a `h-40`.

### Premisas que no se heredaron

La entrada decia "claves" en plural: es una. Decia que solo se rompian dos
fixtures al tipar el campo: habia un tercer candado, `#98 R1` de la Home, que
cuenta los campos de `NutritionPlan`. Decia que se tocaba
`docs/ui-guidelines.md`: no hacia falta. Y `merKcal` puede valer 0 (pesos de
gramos), asi que la formula lleva guarda.

### Gate y ciclo

- Spec `babb1317`, espejada a Notion. Los candados compartidos con #95
  (catalogo, `R6_FOOD`, `meal-schedule`) se escribieron como delta y el
  handoff espero al merge de #95; la branch se rebaso sobre a833f153 antes
  del primer commit de Codex. Firma `e4a4841e` (`page_last_edited_at`
  2026-09-23T16:47:25Z).
- Codex ronda 1: diez commits TDD, movil 80/1426 a 80/1441.
- Reviewer ronda 1: **rechazado** (H1). `toHaveAnimatedStyle` solo compara
  las claves del esperado y nadie candaba el `style` de los nodos no-texto: una
  opacidad o `backgroundColor: accent` en el relleno (barra invisible) y un
  `style` en el carril pasaban 352/352. El codigo era correcto; el hueco era
  de la prescripcion de la spec. H2: el literal del test de R5 no podia pasar
  (heroui antepone `skeleton__root`); el de Codex era el correcto.
- Enmienda E1 (`ed6ef397`): R7, con el mecanismo y las mutaciones medidos por
  el reviewer antes de escribirla, y errata de R5. Gate reabierto solo para
  E1; firma `9da4db78` (`page_last_edited_at` 2026-09-23T18:34:56Z).
- Codex ronda 2: rojo con mutacion de produccion versionada (C4 quinto punto)
  y verde que la revierte; `food.tsx` identico a la ronda 1. Movil 80/1443.
- Reviewer ronda 2 (`b2535de8`): aprobado; las ocho mutaciones de H1 salen
  rojas. init.sh exit=0 en las dos rondas.
- R6: smoke en dev build de Android firmado por el humano en su propio commit
  (`9c5d8eed`, CPH2709, 2026-09-23).

### Desviaciones y deuda, todas no bloqueantes

- `afterEach(mockReset)` en el `describe` de R4, no prescrito: sin el, una
  respuesta en cola de R4 rompia `#65 R17`. El reviewer lo acepto.
- **H6 (baja)**: un estilo condicionado a proposito al 100 % sobreviviria,
  porque R7 mira 0 % y 63 %. Se cerraria con una tercera fila en una Enmienda
  E2; el leader recomendo no hacerla y el humano cerro sin pedirla. No se
  registra como feature.
- Leccion guardada en memoria: `toHaveAnimatedStyle` sin `shouldMatchAllProps`
  deja una zona ciega; especificar el `style` de cada nodo no-texto candado.

# Sesión #114 mobile-reminders-alerts-to-stack (2026-09-23, sesión Frontend)

## Feature #114 `mobile-reminders-alerts-to-stack` (P3)

- **Sesion**: Frontend (leader), tree principal `/home/claude/sites/Pet-Tracker`,
  branch `feature/114-mobile-reminders-alerts-to-stack` desde `origin/main`
  `a833f153` (#95 dentro). En paralelo, Backend cerro #113 y registro #115-#119
  en `wt-backend`.
- **Estado**: `done`. PR pendiente del merge humano.

### Que se hizo

`reminders` y `alerts` salen de `src/app/(tabs)/` al `Stack.Protected` de
`RootStack`, detras de las seis de #95:
- Cabecera nativa con las opciones de #95 R4; el titulo sale del cuerpo y
  "Nuevo" se queda en el cuerpo (R4, R5).
- `alerts` es `dangerouslySingular`: tocar una notificacion la apila encima de lo
  que haya, una sola vez, sin segunda `(tabs)`. El arranque en frio termina en
  `["(tabs)", "alerts"]` sin ancla. `use-push-registration.ts` no cambia (R2, R3).
- Metricas bajo la excepcion A11, ampliada por A13 (R6).
- `add-reminder` sin mascota hace `router.dismissTo('/reminders')` en vez de
  `<Redirect>`, que apilaba dos Recordatorios (R7, enmienda externa A14).
- Cero claves de catalogo: no choca con el candado de longitud que movia #113.

### Gate y ciclo

- **Spec** `85c37fb3`, espejada a Notion. El humano marco P1 = A, A13, A14 y la
  spec, y puso Aprobado. El leader firmo en `f5a491ee` citando la pagina y
  `page_last_edited_at` 2026-09-23T18:42:29Z.
- **spec_author** desmonto dos premisas del enunciado: el arranque en frio ya
  deja `(tabs)` debajo de Alertas, y Profile no navega a `/alerts`.
- **Codex**: 15 commits, `c713068c..a8d656ad`. A14 primero, tres rojos y un
  verde compartido para R1-R3, y despues rojo antes que verde en cada R-id.
- **init.sh**: lo corrio el leader sobre `349c1a41` (exit 0; movil 82/1435,
  +2/+9; e2e 27+3 skip). El reviewer leyo el log crudo y el `.head`.
- **Reviewer**: aprobado a la primera, sin bloqueantes, con 31 mutaciones
  propias.
- **Integracion**: `origin/main` entro dos veces por merge, sin rebase:
  - `446ba4d1` trae #113. Sin conflictos; el movil queda en 82/1452.
  - `93dcf3d1` trae #157, el registro de #115-#119.
  Los hashes de traceability siguen siendo ancestros.
- **Prueba de humo**: el humano la firmo en `6f6da526`. El commit solo toca
  casillas y la linea del `send-message`, cuyos ids reales devolvio el leader a
  placeholders al cerrar. No hubo drift de codigo desde el veredicto.
- **init.sh de cierre** sobre `93dcf3d1`: exit 0 (unit 170/1298, movil 82/1452,
  e2e 27+3 skip).

### Deuda y apuntes

- **Obs. 1** del reviewer: las dos aserciones que siguen al segundo toque en el
  test de R3 no pueden fallar, porque los temporizadores falsos no se vacian.
  Anotada en #100 con su limite y su criterio de cierre; no se abrio rebote.
- **Obs. 6**: el handoff dijo "SOLO `building-native-ui`" y dejo fuera
  `appllama-app-design-skill`, que la carta hace obligatoria. Corregido en
  `.claude/agents/leader.md` §Catalogo real de skills de Codex.
- **Deuda candidata** de la spec, sin registrar:
  - ramas de #91 en `FloatingTabBar` sin disparador en produccion;
  - `<Redirect>` sin mascota en `weight-log` y `meal-schedule`;
  - `routes()`/`rootStack()` copiados en cuatro tests.
- **Supuestos de entorno de la prueba de humo** (leccion en memoria y en
  `docs/verification.md` §Feature 79):
  - al dev build de la maquina del humano le faltaba `google-services.json` y
    hubo que regenerarlo, aunque la spec decia que no hacia falta;
  - el `sqs send-message` pedia `aws login`: faltaban las credenciales `test`
    de LocalStack, y en PowerShell el JSON va por `file://`.
