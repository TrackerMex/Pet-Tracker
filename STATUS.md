# pet-tracker — Status

**Última actualización**: 2026-07-30
**Features completadas**: 3/18 (`feature_list.json`)
**Pendientes**: 15 — backlog backend derivado de `plans/` 002–009 (fundaciones, auth propia, mascotas+permisos, collar Wialon SIM, recorridos, geocercas+alertas, salud, nutrición)
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
  corregido en `2bd5de2` y re-aprobado) — pendiente de PR + merge humano.
  **Seguimiento pendiente no bloqueante**: 9/19 requisitos (R1, R2, R3, R9,
  R15, R16, R17, R18, R19) verificados con tests reales que corren y pasan
  en este sandbox; los otros 10 (R4-R8, R10-R14) están implementados con
  test de integración escrito y commiteado
  (`test/localstack-provisioning.e2e-spec.ts`) pero sin ejecutar con éxito
  contra LocalStack real — sandbox sin acceso al socket de Docker, y a
  diferencia de Postgres (#1) LocalStack no tiene alternativa nativa
  viable. Antes de dar la feature por 100% validada, correr en una máquina
  con Docker: `docker compose up -d && pnpm -C backend-pet-tracker run
  test:e2e -- test/localstack-provisioning.e2e-spec.ts`. Ver
  `progress/impl_localstack-provisioning.md` y
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
  revisado y **aprobado** por el `reviewer` — pendiente de PR + merge humano.
  **Seguimiento pendiente no bloqueante**: Docker no arranca en esta máquina
  (`npipe:////./pipe/dockerDesktopLinuxEngine` no responde), así que las
  migraciones nunca se aplicaron contra Postgres real y no hay e2e. Sin
  ejecutar quedan el SQL de `0001`/`0002`, el `returning()` del insert de
  `users` y los `update ... where` de `markEmailVerified`/`markUsed`.
  Deliberadamente **no** se versionó un e2e sin ver pasar. En una máquina con
  Docker: `docker compose up -d && pnpm -C backend-pet-tracker exec drizzle-kit
  migrate`, y confirmar que las 3 tablas se crean y `schema_bootstrap`
  desaparece. Ver `progress/impl_auth-registration.md` y
  `progress/review_auth-registration.md`.
- Deuda menor detectada en #3: no existe script `db:migrate` en
  `package.json` (solo `db:generate`), aplicar migraciones exige hoy
  `exec drizzle-kit migrate` a mano. Candidato a tarea propia.
- Próximo paso SDD: merge humano del PR #4 (feature #3) a `main` — #1 y #2 ya
  mergeados — luego `spec_author` escribe la spec de `auth-login-me` (#4).

---

## Última sesión

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
