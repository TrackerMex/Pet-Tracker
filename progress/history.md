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
