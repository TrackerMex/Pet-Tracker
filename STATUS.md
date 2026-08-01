# pet-tracker — Status

**Última actualización**: 2026-08-01
**Features completadas**: 4/18 (`feature_list.json`)
**Pendientes**: 14 — backlog backend derivado de `plans/` 002–009 (mascotas+permisos, collar Wialon SIM, recorridos, geocercas+alertas, salud, nutrición)
**En producción**: no

---

## Qué es este proyecto

Backend de Pet Tracker (brief completo en `docs/brief.md`): plataforma de
cuidado de mascotas con 3 pilares — (1) localización y actividad vía collar
GPS (Wialon, con simulador `SIM_MODE` mientras no hay hardware), (2) salud
(vacunas con catálogo, peso, recordatorios), (3) alimentación (motor
calórico determinístico + explicación IA opcional). Multi-usuario con
permisos por mascota (`pet_users`), geocercas con alertas anti-spam y push.
La app móvil (Expo) queda fuera de este repo/backlog — solo backend.

---

## Cómo arrancar

```bash
docker compose up -d   # Postgres + LocalStack (solo si la sesión toca DB/AWS)
./init.sh
```

`init.sh` copia `.env.example` → `.env` si falta. Docker no arranca solo:
levántalo manualmente cuando la feature lo necesite.

### Aprovisionar los recursos de LocalStack (`localstack-provisioning`, #2)

Con `docker compose up -d` levantado (Postgres + LocalStack), desde
`backend-pet-tracker/`:

```bash
docker compose up -d          # si no estaba levantado ya
pnpm run provision:local
```

`provision:local` crea de forma idempotente (correrlo dos veces no falla ni
duplica nada): las colas SQS `positions-raw` + `positions-raw-dlq` +
`notifications` + `notifications-dlq` (con RedrivePolicy DLQ), la tabla
DynamoDB `positions` (pk/sk + TTL sobre `expires_at`), el bucket S3
`pet-tracker-media-local` (sin acceso público) y el bus EventBridge
`pet-tracker`.

Verificación manual:

```bash
aws --endpoint-url=http://localhost:4566 sqs list-queues
```

debe listar las 4 URLs de cola.

---

## Estado actual

- Harness SDD configurado y verde (`init.sh` pasa completo).
- Scaffold NestJS en `backend-pet-tracker/` — sin features todavía.
- Backlog reconciliado con `plans/` (002–009, solo backend): 18 features.
- Datos: **Postgres 17 (Docker) para dominio + DynamoDB (LocalStack) para
  telemetría GPS** + Drizzle — ver `docs/data-model.md` (modelo del plan 001
  adaptado). Auth propia (JWT) porque Cognito no existe en LocalStack
  community; mapa completo de adaptaciones locales en `docs/architecture.md`.
- Infra local: `docker-compose.yml` (Postgres 17 + LocalStack),
  `.env.example` en raíz, `DATABASE_URL` verificada por `init.sh`.
- CI: GitHub Actions (`.github/workflows/ci.yml`) corre `init.sh` en cada PR
  y push a main — verde. Flujo por feature: branch `feature/<id>-<nombre>` +
  PR que el humano mergea (`docs/conventions.md` §Branches y Pull Requests).
- Brief maestro copiado a `docs/brief.md`.
- Knowledge graph con graphify (`pip install graphifyy`): grafo local en
  `graphify-out/` (gitignored) sobre código + plans + docs, sin LLM.
  Hooks PreToolUse activos (consultar grafo antes de grep/read);
  refrescar con `graphify update .` tras cambios de código.
- **`db-setup-drizzle` (#1) done**: Drizzle ORM cableado (drizzle-orm/pg/
  drizzle-kit, `drizzle.config.ts`, `src/db/` con schema barrel +
  `DrizzleModule` bajo token `DRIZZLE`), `AppConfigModule` global (`../.env`),
  `GET /v1/health` público. Revisado, aprobado por el `reviewer` y mergeado
  a `main` (PR #1).
- **`localstack-provisioning` (#2) done**: `src/aws/` (clientes AWS SDK v3
  vía ConfigService, `AwsModule` con tokens de inyección, `provisioning.ts`
  idempotente para las 4 colas SQS + tabla `positions` con TTL + bucket S3 +
  bus EventBridge) y `scripts/provision-local.ts` (`pnpm run
  provision:local`). Branch `feature/2-localstack-provisioning`, revisado y
  aprobado por el `reviewer` (rechazo inicial por R4 sin test nombrado,
  corregido en `2bd5de2` y re-aprobado), mergeado a `main` (`71efa13`).
  **Seguimiento cerrado (2026-08-01)**: el e2e
  `test/localstack-provisioning.e2e-spec.ts` corrió contra LocalStack real
  (imagen pineada a `4.14`, ver sesión 2026-08-01) — 10/10 verdes, con lo
  que R4-R8 y R10-R14 quedan verificados y los 19/19 requisitos ejecutados.
  Ver `progress/impl_localstack-provisioning.md` y
  `progress/review_localstack-provisioning.md`.
- **`auth-registration` (#3) done**: primera feature con tablas de dominio
  reales. `src/db/schema/` con `users`, `email_verification_tokens` y
  `audit_log` (+ migraciones `0001` CREATE y `0002` DROP del placeholder
  `schema_bootstrap` de #1, que queda eliminado); `src/audit/` como módulo
  `@Global()` compartido (puerto `AuditLogger` + token `AUDIT_LOGGER`) que
  reutilizarán #5 y #7; `src/modules/auth/` en 3 capas con `POST
  /v1/auth/register` (201) y `POST /v1/auth/verify-email` (200). argon2id tras
  el puerto `PasswordHasher`, UUIDv7 generado en el repositorio Drizzle, token
  opaco de un solo uso persistido solo como SHA-256, `EMAIL_ENABLED=false` →
  log estructurado en vez de SES. Branch `feature/3-auth-registration`,
  revisado y **aprobado** por el `reviewer`, mergeado a `main` (PR #4,
  `1c7a9fe`). **Seguimiento cerrado (2026-08-01)**: migraciones `0001`/`0002`
  aplicadas contra Postgres 17 real (Docker) — las 3 tablas creadas y
  `schema_bootstrap` eliminado. Sin ejecutar en runtime real quedan solo el
  `returning()` del insert de `users` y los `update ... where` de
  `markEmailVerified`/`markUsed` (no hay e2e de auth versionado — deuda
  menor, candidato a e2e cuando `auth-login-me` #4 toque el mismo módulo).
  Ver `progress/impl_auth-registration.md` y
  `progress/review_auth-registration.md`.
- **`auth-login-me` (#4) done**: `POST /v1/auth/login` (JWT HS256, 24h TTL)
  detrás de un puerto `TokenService` nuevo (`JwtTokenService`, único archivo
  que importa `jsonwebtoken`); `AuthGuard` global vía `APP_GUARD` +
  `@Public()`/`@CurrentUser()` (cubre `/v1/health`,
  `/v1/auth/{register,verify-email,login}` como públicas, todo lo demás
  protegido); módulo nuevo `src/modules/users/` con `GET`/`PATCH /v1/me`
  (update parcial atómico, `timezone` validada con
  `Intl.supportedValuesOf('timeZone')`, auditoría `user.update` con solo
  nombres de campo). Reutiliza `UserRepository`/`PasswordHasher`/
  `AuditLogger` de #3 sin duplicar dominio. Branch `feature/4-auth-login-me`,
  revisado y **aprobado** por el `reviewer` (sin observaciones bloqueantes
  ni no bloqueantes) — PR #5 tuvo CI rojo por un test de
  `auth.module.spec.ts` que intentaba recuperar `APP_GUARD` vía
  `moduleRef.get()` (imposible en un TestingModule: Nest reempaqueta esos
  providers bajo tokens internos), corregido en el rebase del 2026-08-01.
  **Mergeado a `main` por el humano (PR #5, `86dbcd5`)**. Ver
  `progress/impl_auth-login-me.md` y `progress/review_auth-login-me.md`.
- **Hallazgo de entorno (2026-07-31, propio de AQUEL sandbox — resuelto)**:
  en el sandbox Linux donde se trabajó #4, `pnpm test` (vía `init.sh`) daba
  **segfault** — el binding nativo de `argon2` (usado tras el puerto
  `PasswordHasher`, #3) no cargaba: el prebuild
  `linux-x64/argon2.glibc.node` segfaulteaba al hacer `require('argon2')`, y
  compilarlo desde fuente fallaba porque no había `make` instalado (sin sudo
  para instalarlo). Nunca fue un problema del código — CI en GitHub Actions
  siempre estuvo verde en ese aspecto, y en la máquina actual (Windows,
  2026-08-01) los 2 archivos afectados (`argon2-password-hasher.spec.ts` y
  `auth.module.spec.ts`) corren y pasan con normalidad. Se conserva la nota
  solo como registro: si se vuelve a trabajar en un sandbox sin toolchain
  nativo, el patrón de acotar con `npx jest --testPathIgnorePatterns=...`
  sigue siendo válido.
- Deuda menor detectada en #3: no existe script `db:migrate` en
  `package.json` (solo `db:generate`), aplicar migraciones exige hoy
  `exec drizzle-kit migrate` a mano. Candidato a tarea propia.
- Próximo paso SDD: `spec_author` escribe la spec de `pets-crud-permissions`
  (#5) + gate humano de aprobación — #1-#4 ya mergeados a `main`.

---

## Última sesión

- **2026-08-01 (2)** — Sesión corta de cierre: confirmado el merge humano
  del PR #5 (`auth-login-me`, #4) a `main` (`86dbcd5`) — working tree limpio,
  4/18 features done. Sin trabajo de features. Próximo: `spec_author` para
  `pets-crud-permissions` (#5) + gate humano.

- **2026-08-01** — Primera sesión con Docker real: cerrados los seguimientos
  de entorno que venían arrastrándose desde #1. Migraciones de #3 aplicadas
  contra Postgres 17 (3 tablas creadas, `schema_bootstrap` eliminado) y e2e
  de #2 ejecutado contra LocalStack real — 10/10, 19/19 requisitos de esa
  feature ya ejecutados. Dos bugs de entorno encontrados y corregidos en
  branch `fix/jest-e2e-alias`: (1) `localstack/localstack:latest` ahora exige
  `LOCALSTACK_AUTH_TOKEN` (serie CalVer 2026.x, exit 55) → imagen pineada a
  `4.14`, última community (leader, `7b0e492`); (2) `test/jest-e2e.json`
  mapeaba `@/` a `test/src/*` (inexistente) y rompía todo e2e que cargara
  `app.module.ts` — nunca visto porque los e2e jamás habían corrido con
  Docker → fix de una línea vía `implementer` (`1edcd38`), `reviewer` aprobó.
  Suite completa contra infra real: e2e 3/3 (15 tests), unit 30/30 (99
  tests), `init.sh` verde. Además, por decisión humana: convención de
  imports endurecida (`docs/conventions.md` §Imports, `25ee4ae`) — alias
  `@/` obligatorio también para saltos de capa dentro del mismo módulo — y
  refactor mecánico de `src/modules/auth/` para cumplirla (46 imports en 14
  archivos, `626bb10`, vía `implementer`, `reviewer` aprobó). Próximo: merge
  humano del PR del fix, luego spec de `auth-login-me` (#4).

- **2026-07-31 (2)** — Ciclo SDD completo de `auth-login-me` (#4) en el
  mismo sandbox: `spec_author` escribió R1-R15 → **gate humano aprobado** →
  `implementer` (10 commits, TDD por requisito, reutiliza
  `PasswordHasher`/`UserRepository`/`AuditLogger` de #3) → `reviewer`
  verificó código real de forma independiente (no solo el reporte) y
  **aprobó** sin observaciones. 41/41 suites, 161/161 tests (baseline
  28/96), sin regresiones. De paso se acotó el hallazgo de argon2 de la
  sesión anterior: solo 2 archivos afectados (no 3) —
  `auth.controller.spec.ts` corre normal. Feature marcada `done`, PR #5
  abierto. Próximo: merge humano, luego spec de `pets-crud-permissions` (#5).

- **2026-07-31** — Sesión de sandbox nuevo: confirmado merge humano del PR #4
  (`auth-registration`, #3) a `main` — `feature_list.json` ya reflejaba
  `done` desde el close-out de la sesión anterior. Se intentó validar la
  deuda de Docker pendiente (migraciones/e2e reales de #2 y #3); el sandbox
  actual bloquea Docker por permisos (`claude` no está en el grupo `docker`,
  sin password para `sudo`). Al intentar `init.sh` igual se encontró un
  segfault nuevo y no relacionado con Docker: el binding nativo de `argon2`
  no carga en este sandbox (prebuild segfaultea, build desde fuente falla
  por falta de `make`) — documentado arriba, no bloquea specs, CI remoto
  sigue verde. Decisión: no perseguir el entorno, avanzar con
  `spec_author` para `auth-login-me` (#4).

- **2026-07-30 (3)** — Ciclo SDD de `auth-registration` (#3): spec R1-R15
  escrita en la sesión anterior → **gate humano aprobado** (frontmatter
  `approved`) → `implementer` (6 commits, `aa584e4`..`b2131a1`, TDD por
  requisito) → `reviewer` **aprobó** en la primera pasada, verificando C2-C7
  contra el código real y corriendo `init.sh` él mismo. 30 suites / 99 tests
  (baseline 19 / 33), sin regresiones. Desviación de entorno, tercera sesión
  consecutiva con el mismo patrón: sin Docker, las migraciones no se aplicaron
  contra Postgres real; a diferencia de #2 aquí **no** se versionó un e2e sin
  ejecutar. Trabajo de harness de la misma sesión: los cuatro agentes
  delegables (`spec_author`, `explorer`, `implementer`, `reviewer`) no tenían
  frontmatter YAML, así que Claude Code nunca los registró como subagentes
  reales — añadido `name`/`description` en `b79ac5c`, ahora son invocables por
  nombre; `leader.md` queda sin frontmatter a propósito (es el rol del hilo
  principal). Añadida `permissions.allow` explícita en `.claude/settings.json`
  para que el flujo no dependa del clasificador de auto mode. Feature marcada
  `done`. Próximo: PR + merge humano, luego spec de `auth-login-me` (#4).

- **2026-07-30 (2)** — Ciclo SDD de `localstack-provisioning` (#2): spec
  (R1-R19, ampliada con R18/R19 tras feedback humano sobre la convención del
  alias `@/*`) → aprobación humana → `implementer` (12 commits) →
  `reviewer` **rechazó** primero por R4 sin test nombrado (solo vivía en un
  `beforeAll`, violando CHECKPOINTS C4) → `implementer` aplicó fix
  quirúrgico (`2bd5de2`) → `reviewer` re-revisó y **aprobó**. Antes de esto,
  también por feedback humano: se instaló `zod` (class-validator nunca se
  instaló pese a estar documentado) y se resolvió el alias `@/*` en las 3
  rutas de ejecución (`tsc-alias` para build, `moduleNameMapper` en Jest,
  `tsconfig-paths/register` para scripts standalone), documentado en
  `docs/conventions.md`. Desviación de entorno (igual patrón que #1, más
  amplia): sandbox sin Docker → 10/19 requisitos (creación real de
  recursos AWS) implementados y testeados pero sin ejecutar contra
  LocalStack real; sin alternativa nativa posible a diferencia de Postgres.
  Feature marcada `done`. Próximo: PR + merge humano, luego spec de
  `auth-registration` (#3).

- **2026-07-30** — Ciclo SDD completo de `db-setup-drizzle` (#1): spec (R1-R9)
  → aprobación humana → `implementer` (TDD estricto, 9 commits) → limpieza de
  comentarios por el humano → `reviewer` (verificación independiente:
  `init.sh` verde + e2e 5/5, aprobado con una observación no bloqueante ya
  corregida). Desviación de entorno: sandbox sin acceso al socket de Docker,
  se usó Postgres 16 local (`:5544`) para e2e en vez de Postgres 17 vía
  Docker — `.env`/`docker-compose.yml` sin modificar, pendiente validar 1:1
  contra Docker real. Feature marcada `done`. Próximo: PR + merge humano,
  luego spec de `localstack-provisioning` (#2).

- **2026-07-29 (2)** — Sesión de tooling: instalado graphify 0.9.30
  (paquete PyPI `graphifyy`, verificado contra PyPI y GitHub antes de
  instalar). Grafo construido 100% local (tree-sitter, sin LLM): 703
  nodos / 638 edges / 85 comunidades sobre código + plans + docs.
  Integración Claude Code (`graphify claude install`): sección en
  CLAUDE.md + hooks PreToolUse — commit `c4219a7`; `graphify-out/` y
  `*.graphify-bak` al .gitignore. Alias `@/*` en tsconfig por el humano
  (`16f7d45`). Sin trabajo de features. Próximo sin cambio: spec de
  `db-setup-drizzle` (#1).

- **2026-07-29** — Skills instaladas bajo convención del harness. Harness
  configurado: Postgres+Drizzle, conventions, estructura de módulo, infra
  local (docker-compose + .env.example). Backlog inicial de 7 features
  **reemplazado** tras reconciliar con `plans/` (002–009, solo backend):
  18 features alineadas al brief. Decisiones: auth propia (sin Cognito en
  LocalStack), posiciones GPS en DynamoDB LocalStack (fiel al plan),
  workers como cron+SQS en el mismo proceso NestJS. `docs/data-model.md`
  reescrito con el modelo del plan 001; brief → `docs/brief.md`.
  Después: CI con GitHub Actions (init.sh en cada PR/push, verde en
  25s) y flujo PR-por-feature documentado en conventions/AGENTS/CLAUDE —
  el humano aprueba mergeando cada PR.
  Resultado: verde. Próximo: spec de `db-setup-drizzle` (#1) vía
  `spec_author` + aprobación humana.

---

## Stack

- **Backend**: NestJS 11 + TypeScript, pnpm (código en `backend-pet-tracker/`)
- **Datos**: PostgreSQL 17 (Docker) dominio + DynamoDB (LocalStack) telemetría GPS; Drizzle ORM
- **Mensajería local**: SQS + EventBridge en LocalStack (positions-raw, notifications, bus pet-tracker)
- **Infra local**: LocalStack community — **sin AWS real**; arquitectura objetivo serverless en `plans/README.md`
- **Tests**: Jest + supertest
