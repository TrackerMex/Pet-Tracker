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
