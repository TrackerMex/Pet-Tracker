# Implementación — Feature #58 `auth-email-delivery`

- Fecha: 2026-09-02
- Branch: `feature/58-auth-email-delivery`
- Alcance: R1–R12, backend puro
- Resultado: implementación en curso; el bloqueo inicial de aprobación quedó
  corregido por el leader en `b647a60`.

## Bloqueo inicial de la spec

El primer handoff y la casilla de aprobación humana afirmaban que la spec
estaba aprobada, pero los cuatro documentos conservaban `status: draft` en su
frontmatter:

```text
specs/auth-email-delivery/requirements.md:3:status: draft
specs/auth-email-delivery/design.md:3:status: draft
specs/auth-email-delivery/tasks.md:3:status: draft
specs/auth-email-delivery/traceability.md:3:status: draft
```

El commit de handoff `8110530` (`docs(auth): approve #58 spec and hand off to
Codex CLI`) no modificó ninguno de esos cuatro archivos; su diff contenía
únicamente `feature_list.json`, `progress/current.md` y
`progress/handoff_auth-email-delivery.md`.

De acuerdo con la regla explícita del handoff, no se auto-corrigió ningún
documento de `specs/` y no se inició TDD durante ese primer intento. El bloqueo
quedó registrado en el commit local que, tras el rebase, es `d81b303`.

## Reanudación

El leader corrigió los cuatro frontmatters en `b647a60`. Tras
`git pull --rebase`, se verificó que `requirements.md`, `design.md`, `tasks.md`
y `traceability.md` contienen `status: approved`; el gate quedó satisfecho y
se reanudó TDD.

## Verificación previa

Antes del bloqueo inicial se sincronizó la branch y se ejecutó el gate
obligatorio:

```text
$ git checkout feature/58-auth-email-delivery
Already on 'feature/58-auth-email-delivery'

$ git pull
Already up to date.

$ ./init.sh
exit 0
build: OK
backend: 158 suites, 1210 tests passed
infra: 2 suites, 14 tests passed
harness env-drift: 28 tests passed
mobile: 51 suites, 578 tests passed, 1 snapshot
lint y typecheck: OK
e2e: omitidos porque el puerto 5432 no estaba disponible
```

`init.sh` también reportó dos advertencias preexistentes: ocho claves ausentes
en el `.env` local y `STATUS.md` con conteo 51/57 frente a 53/59. Ninguna se
modificó.

No se ejecutó red real, no se creó cuenta de Resend, no se tocó DNS y no se
envió correo. G1–G4 permanecen pendientes y fuera del alcance del implementer.

## Historial TDD

### R1 — rojo (`3be8e9c`)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts --runInBand
FAIL src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts
  ● Test suite failed to run

    Cannot find module './resend-client' from 'modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts'

      1 | import { PasswordResetMessage } from '@/modules/auth/domain/ports/password-reset-sender';
    > 2 | import {
        | ^
      3 |   PASSWORD_RESET_SUBJECT,
      4 |   RESEND_ENDPOINT,
      5 |   ResendClient,

      at Resolver._throwModNotFoundError (../node_modules/.pnpm/jest-resolve@30.4.1/node_modules/jest-resolve/build/index.js:895:11)
      at Object.<anonymous> (modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts:2:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        1.134 s
Ran all test suites matching src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts.
exit 1
```

### R1 — verde (`9b77bb4`)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts --runInBand
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        8.013 s
Ran all test suites matching src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts.
exit 0
```

La implementación mínima compone el correo de reset y delega el `POST` a
`ResendClient`. En este punto `deliver()` todavía espera al proveedor y no
contiene sus fallos; ese comportamiento se conserva intencionalmente hasta el
rojo de R5.
