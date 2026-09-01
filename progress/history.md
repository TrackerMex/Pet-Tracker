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
- **Estado final:** `done` (51+2=53/57). PR **#96** abierto, pendiente de
  merge por el humano: https://github.com/TrackerMex/Pet-Tracker/pull/96

