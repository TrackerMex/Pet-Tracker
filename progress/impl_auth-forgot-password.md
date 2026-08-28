# Implementación — Feature #44 `auth-forgot-password`

- Fecha: 2026-08-28
- Branch: `feature/44-auth-forgot-password`
- Alcance: R1–R13, backend puro
- Resultado: flujo forgot/reset implementado por capas y gates automáticos
  verdes.

## Resultado funcional

- `POST /v1/auth/forgot-password` devuelve siempre `200
  {"requested":true}` para un payload válido, exista o no la cuenta.
- Para cuentas existentes invalida tokens anteriores, emite un token aleatorio,
  persiste solo su SHA-256 con TTL de una hora y registra
  `user.password_reset_requested`.
- `ConsolePasswordResetSender` entrega el token mediante el evento estructurado
  `auth.password_reset.issued`; con `EMAIL_ENABLED=true` avisa que todavía no
  existe proveedor real. El token nunca aparece en la respuesta HTTP.
- `POST /v1/auth/reset-password` valida token y confirmación, rechaza tokens
  inválidos/usados con 400 y expirados con 410, guarda un hash Argon2 nuevo,
  consume todos los tokens del usuario y registra `user.password_reset`.
- El login anterior queda en 401 y el nuevo devuelve 200. Los tokens de
  verify-email y password-reset no son intercambiables.

## Historial TDD

Cada requisito tuvo un commit rojo anterior a su implementación. La
trazabilidad literal de archivos, `describe` y commits está en
`specs/auth-forgot-password/traceability.md`.

| Requisito | Commit rojo | Commit verde |
|---|---|---|
| R1 | `a40ceb2` | `b3e0aaf` |
| R2 | `97e2c4b` | `bfa3f8c` |
| R3 | `080817e` | `9d1f7e7` |
| R4 | `25abbdd` | `721c580` |
| R5 | `e36de77` | `e531f63` |
| R6 | `1e62765` | `ff042c0` |
| R7 | `ac3af27` | `e1bc6cf` |
| R8 | `56054ce` | `2142d49` |
| R9 | `106349c` | `e531f63` |
| R10 | `f699540` | `44fecd5` |
| R11 | `4e05906` | `4324e31` |
| R12 | `64230ee` | `9cd8473` |
| R13 | `0e67341` | Cierre R13; hash registrado en `traceability.md` |

Después de cada verde se actualizó `traceability.md` en un commit documental
inmediato.

## Comandos y salida

### Gate inicial

```text
$ ./init.sh
exit 0
backend: 152 suites, 1162 tests passed
infra: 2 suites, 14 tests passed
mobile: 50 suites, 561 tests passed
backend e2e: 22 suites, 343 tests passed; 8 skipped
build, lint y typecheck: OK
```

### Migración R12

```text
$ pnpm -C backend-pet-tracker run db:generate
exit 0; generó la migración y snapshot 0015

$ docker compose exec -T postgres psql -U pet_tracker -d pet_tracker \
    < backend-pet-tracker/src/db/migrations/0015_auth_password_reset_tokens.sql
CREATE TABLE
ALTER TABLE
CREATE INDEX

$ docker compose exec -T postgres psql -U pet_tracker -d pet_tracker \
    -c "SELECT ... FROM information_schema.tables ..."
password_reset_tokens: presente
password_reset_tokens_user_id_idx: presente
```

No se ejecutó `cdk deploy`, no se aprovisionaron recursos AWS y no se añadió
ninguna variable de entorno ni dependencia.

### Suites focalizadas de la feature

```text
$ pnpm -C backend-pet-tracker exec jest \
    src/db/schema/password-reset-tokens.schema.spec.ts \
    src/modules/auth/application/use-cases/request-password-reset.use-case.spec.ts \
    src/modules/auth/application/use-cases/reset-password.use-case.spec.ts \
    src/modules/auth/infrastructure/email/console-password-reset-sender.spec.ts \
    src/modules/auth/infrastructure/auth.controller.spec.ts \
    src/modules/auth/auth.module.spec.ts --runInBand
Test Suites: 6 passed, 6 total
Tests:       57 passed, 57 total

$ pnpm -C backend-pet-tracker exec jest --config ./test/jest-e2e.json \
    test/auth-forgot-password.e2e-spec.ts --runInBand
Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
```

### Gate R13

```text
$ pnpm -C backend-pet-tracker run lint
exit 0

$ pnpm -C backend-pet-tracker exec tsc --noEmit
exit 0

$ pnpm -C backend-pet-tracker test
Test Suites: 156 passed, 156 total
Tests:       1198 passed, 1198 total

$ docker compose up -d && pnpm -C backend-pet-tracker run test:e2e
Container pet-tracker-postgres Running
Container pet-tracker-localstack Running
Test Suites: 3 skipped, 23 passed, 23 of 26 total
Tests:       8 skipped, 349 passed, 357 total
```

La primera corrida e2e encontró una fila sintética huérfana dejada por una
corrida anterior de `provision-device.e2e-spec.ts`; se identificó por ID/IMEI,
se comprobó que no tenía relaciones y se eliminó únicamente esa fila del
Postgres local (`DELETE 1`). La segunda corrida encontró un flake preexistente
de orden SQL en `health-vaccines.e2e-spec.ts`; el mismo fichero pasó aislado
15/15 y la repetición completa produjo el resultado verde anterior. No se
modificó ninguno de esos módulos.

```text
$ ./init.sh
exit 0
build: OK
backend: 156 suites, 1198 tests passed
infra: 2 suites, 14 tests passed
harness env-drift: 28 tests passed
mobile: 50 suites, 561 tests passed, 1 snapshot
backend e2e: 23 suites, 349 tests passed; 8 skipped
lint y typecheck: OK
```

El único aviso no bloqueante fue el ya existente del AWS SDK v3: futuras
versiones publicadas después de enero de 2027 requerirán Node >=22; el entorno
actual usa Node 20.20.2.

### Contención

La comprobación exacta de R13 se ejecuta después de commitear este cierre para
que incluya todos sus archivos. Su salida final queda registrada en la sección
siguiente antes de cerrar la feature.

## Decisiones y deuda respetadas

- DA1 (proveedor real de correo) y DA2 (enlace/plantilla) siguen abiertas para
  decisión humana; esta feature no las resuelve ni las presupone.
- Rate limiting, igualación de timing, revocación de JWT emitidos y activación
  del stub móvil permanecen fuera de alcance y ya están anotados en el backlog
  de la feature.
- No se tocó `mobile-pet-tracker/`, `infra/`, `.env.example`, verify-email,
  Argon2, JWT ni el guard de auth.
