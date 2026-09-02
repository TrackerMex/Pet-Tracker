# Implementación — Feature #58 `auth-email-delivery`

- Fecha: 2026-09-02
- Branch: `feature/58-auth-email-delivery`
- Alcance: R1–R12, backend puro
- Resultado: R1–R12 implementados y sus suites verdes; el cierre queda
  bloqueado porque `env-drift.test.mjs` conserva el inventario anterior de
  21 claves y está fuera de la contención aprobada.

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

### R5 — rojo (`b8ac577`)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/email/resend-client.spec.ts --runInBand
FAIL src/modules/auth/infrastructure/email/resend-client.spec.ts
  ● R5: deliver resuelve antes que la respuesta del proveedor y contiene cualquier fallo › resuelve deliver mientras fetch sigue pendiente

    expect(received).toBe(expected) // Object.is equality

    Expected: "deliver-resolved"
    Received: "next-tick"

      54 |     ]);
      55 |
    > 56 |     expect(winner).toBe('deliver-resolved');
         |                    ^
      57 |   });

  ● R5: deliver resuelve antes que la respuesta del proveedor y contiene cualquier fallo › contiene un rechazo de fetch y registra el fallo

    expect(received).resolves.toBeUndefined()

    Received promise rejected instead of resolved
    Rejected to value: [Error: network down]

      65 |     );
      66 |
    > 67 |     await expect(client.deliver(delivery)).resolves.toBeUndefined();
         |           ^
      68 |     await client.whenIdle();

  ● R5: deliver resuelve antes que la respuesta del proveedor y contiene cualquier fallo › contiene un 403 y registra status y mensaje del proveedor

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: {"event": "auth.password_reset.issued", "message": "domain is not verified", "scope": undefined, "status": 403, "userId": "0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77"}

    Number of calls: 0

      87 |     await client.whenIdle();
      88 |
    > 89 |     expect(error).toHaveBeenCalledWith({
         |                   ^

Test Suites: 1 failed, 1 total
Tests:       3 failed, 3 total
Snapshots:   0 total
Time:        7.085 s
Ran all test suites matching src/modules/auth/infrastructure/email/resend-client.spec.ts.
exit 1
```

Durante el primer intento de verde, dos casos pasaron y el `Promise.race`
del primero reveló que el competidor ya estaba resuelto. Se cambió a una
microtarea posterior y se enmendó únicamente el commit rojo; la producción
permaneció fuera de ese commit.

### R5 — verde (`536040f`)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/email/resend-client.spec.ts --runInBand
Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        1.757 s, estimated 5 s
Ran all test suites matching src/modules/auth/infrastructure/email/resend-client.spec.ts.
exit 0
```

La corrida conjunta posterior de R1 y R5 pasó 2 suites y 4 tests.

### R2 — rojo (`26ce596`)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts --runInBand
FAIL src/modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts
  ● Test suite failed to run

    Cannot find module './resend-email-verification-sender' from 'modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts'

    However, Jest was able to find:
    \t'./resend-email-verification-sender.spec.ts'

       5 |   ResendClient,
       6 | } from './resend-client';
    >  7 | import { ResendEmailVerificationSender } from './resend-email-verification-sender';
         | ^

      at Resolver._throwModNotFoundError (../node_modules/.pnpm/jest-resolve@30.4.1/node_modules/jest-resolve/build/index.js:895:11)
      at Object.<anonymous> (modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts:7:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        1.905 s
Ran all test suites matching src/modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts.
exit 1
```

### R2 — verde (`fc5aa18`)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts --runInBand
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        8.341 s
Ran all test suites matching src/modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts.
exit 0
```

### R7 — rojo (`a16f041`)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts src/modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts --runInBand
FAIL src/modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts
  ● R7: el emisor de verificacion no escribe el token ni la API key en ningun log › registra solo metadatos seguros tanto en exito como en fallo

    Expected: {"event": "auth.email_verification.issued", "id": "email-r2", "scope": "auth-email-delivery", "userId": "0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77"}
    Number of calls: 0

      101 |     await successClient.whenIdle();
      102 |
    > 103 |     expect(log).toHaveBeenCalledWith({
          |                 ^

FAIL src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts
  ● R7: el emisor de reset no escribe el token ni la API key en ningun log › registra solo metadatos seguros tanto en exito como en fallo

    Expected: {"event": "auth.password_reset.issued", "id": "email-r1", "scope": "auth-email-delivery", "userId": "0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77"}
    Number of calls: 0

      101 |     await successClient.whenIdle();
      102 |
    > 103 |     expect(log).toHaveBeenCalledWith({
          |                 ^

Test Suites: 2 failed, 2 total
Tests:       2 failed, 2 passed, 4 total
Snapshots:   0 total
Time:        1.997 s, estimated 8 s
Ran all test suites matching src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts|src/modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts.
exit 1
```

### R7 — verde (`59a99c5`)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts src/modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts src/modules/auth/infrastructure/email/resend-client.spec.ts --runInBand
Test Suites: 3 passed, 3 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        1.952 s, estimated 2 s
Ran all test suites matching src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts|src/modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts|src/modules/auth/infrastructure/email/resend-client.spec.ts.
exit 0
```

### R3 — rojo (`8c6cd06`)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/auth.module.spec.ts --runInBand
FAIL src/modules/auth/auth.module.spec.ts (14.027 s)
  ● R3 (auth-email-delivery): EMAIL_ENABLED selecciona los adaptadores Resend para los dos puertos › resuelve los dos puertos con Resend solo para el valor literal true

    Expected constructor: ResendPasswordResetSender
    Received constructor: ConsolePasswordResetSender

      105 |     }).compile();
      106 |
    > 107 |     expect(enabledModule.get(PASSWORD_RESET_SENDER)).toBeInstanceOf(
          |                                                      ^

Test Suites: 1 failed, 1 total
Tests:       1 failed, 2 passed, 3 total
Snapshots:   0 total
Time:        14.526 s
Ran all test suites matching src/modules/auth/auth.module.spec.ts.
exit 1
```

### R3 — verde (`96b97c5`)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/auth.module.spec.ts src/modules/auth/infrastructure/email/console-password-reset-sender.spec.ts src/modules/auth/infrastructure/email/console-email-verification-sender.spec.ts --runInBand
Test Suites: 3 passed, 3 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        13.352 s, estimated 17 s
Ran all test suites matching src/modules/auth/auth.module.spec.ts|src/modules/auth/infrastructure/email/console-password-reset-sender.spec.ts|src/modules/auth/infrastructure/email/console-email-verification-sender.spec.ts.
exit 0
```

La comprobación literal `grep -rn "EMAIL_ENABLED" backend-pet-tracker/src/`
no puede producir dos aciertos: cuenta los specs obligatorios y un comentario
preexistente de `domain/ports/email-verification-sender.ts`, ruta prohibida
por R12. Sin editar la spec ni domain, la comprobación de lecturas ejecutables
sí devuelve exactamente dos líneas, ambas en `auth.module.ts`:

```text
$ rg -n "config\.get<string>\('EMAIL_ENABLED'\)" backend-pet-tracker/src --glob '!*.spec.ts'
backend-pet-tracker/src\modules\auth\auth.module.ts:64:        config.get<string>('EMAIL_ENABLED') === 'true'
backend-pet-tracker/src\modules\auth\auth.module.ts:77:        config.get<string>('EMAIL_ENABLED') === 'true'
exit 0
```

### R4 — rojo (`fa1a447`)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/auth.module.spec.ts --runInBand
FAIL src/modules/auth/auth.module.spec.ts
  ● R4 (auth-email-delivery): EMAIL_ENABLED=true sin RESEND_API_KEY aborta el arranque › rechaza la compilacion cuando falta RESEND_API_KEY

    expect(received).rejects.toThrow()

    Received promise resolved instead of rejected

      165 |     }).compile();
      166 |
    > 167 |     await expect(compilation).rejects.toThrow(MissingResendConfigError);
          |           ^

  ● R4 (auth-email-delivery): EMAIL_ENABLED=true sin RESEND_API_KEY aborta el arranque › rechaza la compilacion cuando falta RESEND_FROM

    expect(received).rejects.toThrow()

    Received promise resolved instead of rejected

      176 |     }).compile();
      177 |
    > 178 |     await expect(compilation).rejects.toThrow(MissingResendConfigError);
          |           ^

Test Suites: 1 failed, 1 total
Tests:       2 failed, 3 passed, 5 total
Snapshots:   0 total
Time:        4.554 s, estimated 12 s
Ran all test suites matching src/modules/auth/auth.module.spec.ts.
exit 1
```

Jest imprimió además el objeto completo de cada módulo resuelto; se omite esa
serialización interna de Nest por longitud. La causa y los dos casos quedan
preservados literalmente arriba.

### R4 — verde (`c233035`)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/auth.module.spec.ts src/modules/auth/infrastructure/email/resend-client.spec.ts src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts src/modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts --runInBand
Test Suites: 4 passed, 4 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        3.707 s, estimated 5 s
Ran all test suites matching src/modules/auth/auth.module.spec.ts|src/modules/auth/infrastructure/email/resend-client.spec.ts|src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts|src/modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts.
exit 0
```

## Bloqueo de spec en R6

La implementación se detuvo antes de escribir el test rojo de R6 porque sus
instrucciones son incompatibles entre sí:

- `requirements.md:273-276` exige que el e2e sobreescriba
  `PASSWORD_RESET_SENDER` con un doble cuyo propio `send()` lanza.
- `tasks.md:99-103` afirma que R5 ya cubre el comportamiento y prohíbe
  arreglarlo en el caso de uso o el controller.
- `design.md:134-138` fija que la contención vive dentro del adaptador Resend
  y que el `await this.resetSender.send(...)` de application queda intacto.
- `requirements.md:422-426` y `design.md:331-333` prohíben tocar
  `src/modules/auth/application/` y presentan esa ausencia de cambios como
  criterio arquitectónico.

Al sobreescribir el token de DI con un objeto cuyo `send()` lanza, Nest evita
por completo `ResendPasswordResetSender` y `ResendClient`; por tanto, ninguna
implementación de R5 puede capturar esa excepción. El `await` heredado de
application la propaga y el endpoint responde 500. Hacer pasar literalmente
esa prueba requiere un `try/catch` en application o controller, justo las dos
rutas que R6 y R12 prohíben.

La corrección coherente con D5 es que el e2e inyecte
`ResendPasswordResetSender` con un `ResendClient` cuyo doble de `fetch`
rechaza. Así falla el proveedor dentro del adaptador, R5 lo contiene y el
endpoint conserva `200 { requested: true }` sin cambiar application ni
controller. El test unitario debe representar la misma frontera.

De acuerdo con el handoff, no se editó la spec ni se inventó un workaround.
El leader debe corregir R6 en `requirements.md` y `tasks.md`, o bien ampliar
explícitamente la allowlist y cambiar la decisión D5 si realmente quiere
contener cualquier implementación defectuosa del puerto.

## Corrección autorizada y cierre de R6

El commit del leader `465eee3` autoriza que los dos tests de R6 usen
`ResendPasswordResetSender` real con un `ResendClient` cuyo doble de
`fetch` rechaza. La corrección sustituye únicamente el mecanismo
contradictorio del doble; la spec aprobada no se editó. Application y
controller permanecen intactos.

El test unitario quedó verde al introducirse porque la contención ya existe en
el verde de R5 (`536040f`), situación prevista expresamente por
`tasks.md` R6(2). No se fabricó un rojo artificial ni hubo implementación
adicional de producción para R6.

### R6 — unitario verde por R5 (`38a5e33`)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/auth.controller.spec.ts --runInBand
Test Suites: 1 passed, 1 total
Tests:       37 passed, 37 total
Snapshots:   0 total
Time:        8.504 s, estimated 13 s
Ran all test suites matching src/modules/auth/infrastructure/auth.controller.spec.ts.
exit 0
```

### R6 — precondición e2e local

La primera ejecución no alcanzó el fallo simulado de Resend: el volumen local
de Postgres era anterior a #44 y no tenía la tabla
`password_reset_tokens`. Se conserva la salida para distinguir este fallo de
entorno de un rojo funcional:

```text
$ pnpm -C backend-pet-tracker exec jest --config test/jest-e2e.json test/auth-email-delivery.e2e-spec.ts --runInBand
FAIL test/auth-email-delivery.e2e-spec.ts (26.602 s)
  ● Auth email delivery (e2e) › R6: con el emisor lanzando, forgot-password sigue devolviendo 200 requested true › iguala status y body entre cuenta existente y cuenta inexistente

    expect(received).toEqual(expected) // deep equality

    - Expected  - 3
    + Received  + 2

      Object {
        "body": Object {
    -     "message": "Internal server error",
    -     "statusCode": 500,
    +     "requested": true,
        },
    -   "status": 500,
    +   "status": 200,
      }

  ● Test suite failed to run

    Failed query: delete from "password_reset_tokens" where "password_reset_tokens"."user_id" in ($1)
    [cause]: error: relation "password_reset_tokens" does not exist

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        27.012 s
Ran all test suites matching test/auth-email-delivery.e2e-spec.ts.
exit 1
```

Se aplicó al Postgres local, sin editar `src/db/`, la migración ya
versionada de #44:

```text
$ Get-Content -Raw backend-pet-tracker/src/db/migrations/0015_auth_password_reset_tokens.sql | docker compose exec -T postgres psql -v ON_ERROR_STOP=1 -U pet_tracker -d pet_tracker
CREATE TABLE
ALTER TABLE
CREATE INDEX
exit 0
```

### R6 — e2e verde por R5 (`38a5e33`)

```text
$ pnpm -C backend-pet-tracker exec jest --config test/jest-e2e.json test/auth-email-delivery.e2e-spec.ts --runInBand
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        6.285 s, estimated 27 s
Ran all test suites matching test/auth-email-delivery.e2e-spec.ts.
exit 0
```

El e2e sobreescribe `PASSWORD_RESET_SENDER` con una instancia real de
`ResendPasswordResetSender`; solo `fetch` es un doble rechazado. La
respuesta de la cuenta existente se compara estructuralmente contra la de la
cuenta inexistente. No hubo red real.

### R8 — rojo unitario

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts --runInBand
FAIL src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts
  ● Test suite failed to run

    Cannot find module './email-rate-limit.guard' from 'modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts'

      1 | import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
    > 2 | import {
        | ^
      3 |   EMAIL_RATE_LIMIT_WINDOW_MS,
      4 |   FORGOT_PASSWORD_MAX_PER_EMAIL,
      5 |   EmailRateLimitGuard,

      at Resolver._throwModNotFoundError (../node_modules/.pnpm/jest-resolve@30.4.1/node_modules/jest-resolve/build/index.js:895:11)
      at Object.<anonymous> (modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts:2:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        2.936 s
Ran all test suites matching src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts.
exit 1
```

### R8 — rojo e2e

```text
$ pnpm -C backend-pet-tracker exec jest --config test/jest-e2e.json test/auth-email-delivery.e2e-spec.ts --runInBand
FAIL test/auth-email-delivery.e2e-spec.ts (6.415 s)
  ● R8: forgot-password devuelve 429 tras agotar el cupo del email › bloquea el cuarto intento antes de ejecutar el caso de uso

    expected 429 "Too Many Requests", got 200 "OK"

      145 |       .post('/v1/auth/forgot-password')
      146 |       .send({ email: email.toUpperCase() })
    > 147 |       .expect(429);
          |        ^
      148 |     expect(execute).toHaveBeenCalledTimes(3);
      149 |   });
      150 | });

      at Object.<anonymous> (auth-email-delivery.e2e-spec.ts:147:8)
      ----
      at Test._assertStatus (../node_modules/.pnpm/supertest@7.2.2/node_modules/supertest/lib/test.js:309:14)
      at ../node_modules/.pnpm/supertest@7.2.2/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (../node_modules/.pnpm/supertest@7.2.2/node_modules/supertest/lib/test.js:342:13)
      at Test.assert (../node_modules/.pnpm/supertest@7.2.2/node_modules/supertest/lib/test.js:195:23)
      at localAssert (../node_modules/.pnpm/supertest@7.2.2/node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (../node_modules/.pnpm/supertest@7.2.2/node_modules/supertest/lib/test.js:152:11)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
Snapshots:   0 total
Time:        6.917 s
Ran all test suites matching test/auth-email-delivery.e2e-spec.ts.
exit 1
```

### R8 — verde

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts --runInBand
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.904 s
Ran all test suites matching src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts.
exit 0
```

```text
$ pnpm -C backend-pet-tracker exec jest --config test/jest-e2e.json test/auth-email-delivery.e2e-spec.ts --runInBand
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        4.841 s, estimated 7 s
Ran all test suites matching test/auth-email-delivery.e2e-spec.ts.
exit 0
```

La implementación usa una ventana fija por email normalizado, poda entradas
vencidas, conserva como máximo `MAX_TRACKED_KEYS` y aplica el guard solo a
`forgotPassword`. La rama de `register` queda fuera de este verde y se
añade en R9.

### R9 — rojo

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts --runInBand
FAIL src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts
  ● R9: la undecima alta desde la misma IP en una hora responde 429 › limita por IP aunque cada peticion use un email diferente

    Expected HttpException

      36 |   }
      37 |
    > 38 |   throw new Error('Expected HttpException');
         |         ^
      39 | }
      40 |
      41 | describe('R8: el cuarto forgot-password del mismo email en una hora responde 429', () => {

      at captureHttpException (modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts:38:9)
      at Object.<anonymous> (modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts:109:19)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 2 passed, 3 total
Snapshots:   0 total
Time:        1.936 s, estimated 2 s
Ran all test suites matching src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts.
exit 1
```

### R9 — verde

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts --runInBand
Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        1.721 s, estimated 2 s
Ran all test suites matching src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts.
exit 0
```

Se añadió únicamente la rama `register:${request.ip}` del guard y
`@UseGuards(EmailRateLimitGuard)` sobre `register`. El guard sigue siendo
un provider normal, no global.

### R10 — rojo

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/auth.controller.spec.ts --runInBand
FAIL src/modules/auth/infrastructure/auth.controller.spec.ts
  ● R10 (auth-email-delivery): el 429 del rate limit no revela si la cuenta existe › deja pasar sin contar cualquier body sin email string

    HttpException: Too Many Requests

      69 |
      70 |     if (current.count >= maximum) {
    > 71 |       throw new HttpException(
         |             ^
      72 |         {
      73 |           statusCode: HttpStatus.TOO_MANY_REQUESTS,
      74 |           message: 'Too Many Requests',

      at EmailRateLimitGuard.consume (modules/auth/infrastructure/guards/email-rate-limit.guard.ts:71:13)
      at EmailRateLimitGuard.canActivate (modules/auth/infrastructure/auth.controller.spec.ts:731:22)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 39 passed, 40 total
Snapshots:   0 total
Time:        2.489 s, estimated 7 s
Ran all test suites matching src/modules/auth/infrastructure/auth.controller.spec.ts.
exit 1
```

### R10 — primer intento de verde (rojo)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/auth.controller.spec.ts src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts --runInBand
FAIL src/modules/auth/infrastructure/auth.controller.spec.ts
  ● R10 (auth-email-delivery): el 429 del rate limit no revela si la cuenta existe › iguala el 200 dentro del cupo y el 429 al agotarlo

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 3
    Received number of calls: 2

      720 |     expect(missingBlocked).toEqual(existingBlocked);
      721 |     expect(existingBlocked.status).toBe(429);
    > 722 |     expect(existing.execute).toHaveBeenCalledTimes(3);
          |                              ^
      723 |     expect(missing.execute).toHaveBeenCalledTimes(3);

      at Object.<anonymous> (modules/auth/infrastructure/auth.controller.spec.ts:722:30)

Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 42 passed, 43 total
Snapshots:   0 total
Time:        2.611 s, estimated 4 s
Ran all test suites matching src/modules/auth/infrastructure/auth.controller.spec.ts|src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts.
exit 1
```

La salida señaló que el primer parche había omitido la asignación de
`forgot:${normalizeEmail(email)}`; ambas cuentas compartían por error la
clave `undefined`. No se commiteó ese estado.

### R10 — verde

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/auth.controller.spec.ts src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts --runInBand
Test Suites: 2 passed, 2 total
Tests:       43 passed, 43 total
Snapshots:   0 total
Time:        2.491 s, estimated 3 s
Ran all test suites matching src/modules/auth/infrastructure/auth.controller.spec.ts|src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts.
exit 0
```

El guard retorna antes de consumir cuota cuando `body.email` no es string.
Para bodies válidos, el 429 depende únicamente de la clave normalizada y del
contador en memoria; no consulta repositorios ni distingue cuentas.

### R11 — rojo

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/email/resend-client.spec.ts --runInBand
FAIL src/modules/auth/infrastructure/email/resend-client.spec.ts
  ● R11: RESEND_API_KEY vive solo en el entorno, nunca en el repo › declara la clave y el remitente como valores vacios en .env.example

    expect(received).toContain(expected) // indexOf

    Expected value: "RESEND_API_KEY="
    Received array: ["# Copia este archivo a .env (init.sh lo hace solo si falta).", "# Valores de desarrollo local — nunca pongas credenciales reales aquí.", "", "# Postgres (docker-compose.yml)", "DATABASE_URL=postgresql://pet_tracker:pet_tracker@localhost:5432/pet_tracker", "", "# Backend HTTP", "PORT=3000", "", "# Verificación de email en el registro. En local no hay SES: con false, el", …]

      107 |     const lines = envExample.split(/\r?\n/);
      108 |
    > 109 |     expect(lines).toContain('RESEND_API_KEY=');
          |                   ^
      110 |     expect(lines).toContain('RESEND_FROM=');
      111 |   });
      112 | });

      at Object.<anonymous> (modules/auth/infrastructure/email/resend-client.spec.ts:109:19)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 3 passed, 4 total
Snapshots:   0 total
Time:        1.488 s
Ran all test suites matching src/modules/auth/infrastructure/email/resend-client.spec.ts.
exit 1
```

### R11 — comprobación adicional inicial (rojo)

```text
$ git grep -nE "re_[A-Za-z0-9]{8,}|process\.env\.RESEND" -- backend-pet-tracker infra docs specs
backend-pet-tracker/src/modules/auth/auth.module.spec.ts:87:    resendApiKey: process.env.RESEND_API_KEY,
backend-pet-tracker/src/modules/auth/auth.module.spec.ts:88:    resendFrom: process.env.RESEND_FROM,
backend-pet-tracker/src/modules/auth/auth.module.spec.ts:101:    process.env.RESEND_API_KEY = 'api-key-for-r3';
backend-pet-tracker/src/modules/auth/auth.module.spec.ts:102:    process.env.RESEND_FROM = 'sender@example.com';
backend-pet-tracker/src/modules/auth/auth.module.spec.ts:143:    resendApiKey: process.env.RESEND_API_KEY,
backend-pet-tracker/src/modules/auth/auth.module.spec.ts:144:    resendFrom: process.env.RESEND_FROM,
backend-pet-tracker/src/modules/auth/auth.module.spec.ts:160:    delete process.env.RESEND_API_KEY;
backend-pet-tracker/src/modules/auth/auth.module.spec.ts:161:    process.env.RESEND_FROM = 'sender@example.com';
backend-pet-tracker/src/modules/auth/auth.module.spec.ts:171:    process.env.RESEND_API_KEY = 'api-key-for-r4';
backend-pet-tracker/src/modules/auth/auth.module.spec.ts:172:    delete process.env.RESEND_FROM;
specs/auth-email-delivery/requirements.md:356:  literal de clave ni `process.env.RESEND`.
specs/nutrition-profile-engine/design.md:27:  `progress/explore_nutrition-profile-engine.md` §5: D1, D2, D4, D5, D6, D7, D8,
specs/nutrition-profile-engine/requirements.md:14:> mitad no-IA del paso 3), `progress/explore_nutrition-profile-engine.md`.
exit 0
```

Los accesos de `auth.module.spec.ts` son propios de esta feature y se
sustituyen por un doble de `ConfigService`. Las tres coincidencias bajo
`specs/` no son secretos: una es la propia prohibición textual de R11 y dos
son el substring `re_nutrition` dentro de `explore_nutrition...`. La spec
es inmutable, de modo que el comando literal que incluye `specs` no puede
quedar vacío; se conserva el hallazgo y se verificará además el alcance
ejecutable/documental sin `specs`.

### R11 — primer intento de verde (rojo)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/email/resend-client.spec.ts src/modules/auth/auth.module.spec.ts --runInBand
FAIL src/modules/auth/auth.module.spec.ts
  ● R3 (auth-email-delivery): EMAIL_ENABLED selecciona los adaptadores Resend para los dos puertos › resuelve los dos puertos con Resend solo para el valor literal true

    TypeError: configService.getOrThrow is not a function

      24 |
      25 |   constructor(configService: ConfigService) {
    > 26 |     this.secret = configService.getOrThrow<string>('JWT_SECRET');
         |                                 ^
      27 |   }

      at new JwtTokenService (modules/auth/infrastructure/security/jwt-token-service.ts:26:33)
      at Object.<anonymous> (modules/auth/auth.module.spec.ts:99:27)

Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 8 passed, 9 total
Snapshots:   0 total
Time:        3.966 s, estimated 4 s
Ran all test suites matching src/modules/auth/infrastructure/email/resend-client.spec.ts|src/modules/auth/auth.module.spec.ts.
exit 1
```

### R11 — verde

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/email/resend-client.spec.ts src/modules/auth/auth.module.spec.ts --runInBand
Test Suites: 2 passed, 2 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        3.493 s, estimated 4 s
Ran all test suites matching src/modules/auth/infrastructure/email/resend-client.spec.ts|src/modules/auth/auth.module.spec.ts.
exit 0
```

`.env.example` declara `RESEND_API_KEY=` y `RESEND_FROM=` exactamente
vacías. `docs/conventions.md` documenta ambas y actualiza
`EMAIL_ENABLED`. Los specs de composición R3/R4 usan un doble de
`ConfigService`, sin acceso directo a variables RESEND.

Comando literal de la spec tras el verde:

```text
$ git grep -nE "re_[A-Za-z0-9]{8,}|process\.env\.RESEND" -- backend-pet-tracker infra docs specs
specs/auth-email-delivery/requirements.md:356:  literal de clave ni `process.env.RESEND`.
specs/nutrition-profile-engine/design.md:27:  `progress/explore_nutrition-profile-engine.md` §5: D1, D2, D4, D5, D6, D7, D8,
specs/nutrition-profile-engine/requirements.md:14:> mitad no-IA del paso 3), `progress/explore_nutrition-profile-engine.md`.
exit 0
```

Comprobación equivalente sobre código, tests, infraestructura y documentación
editable, sin las auto-coincidencias de las specs:

```text
$ git grep -nE "re_[A-Za-z0-9]{8,}|process\.env\.RESEND" -- backend-pet-tracker/src backend-pet-tracker/test infra docs
<sin salida>
exit 1 (git grep: ninguna coincidencia)
```

No se añadió ningún valor real ni se leyó el `.env` local.

### R12 — test de regresión verde al introducirse

```text
$ pnpm -C backend-pet-tracker exec jest --config test/jest-e2e.json test/auth-email-delivery.e2e-spec.ts --runInBand
Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        7.598 s
Ran all test suites matching test/auth-email-delivery.e2e-spec.ts.
exit 0
```

El e2e nuevo usa los adaptadores de consola reales con
`EMAIL_ENABLED=false`, extrae de sus logs los tokens de verificación y reset,
y completa ambos consumos con el guard activo. Pasó sin cambio adicional de
producción porque R1–R11 ya componían el comportamiento requerido. Se conserva
como red de regresión; no se fabricó un fallo artificial.

## Cierre R12 — intentos e2e de entorno

### Primera corrida completa (rojo de entorno)

```text
$ pnpm -C backend-pet-tracker run test:e2e
FAIL test/device-subscriptions.e2e-spec.ts
  Expected getMessages: 1 llamada
  Received: 2 llamadas
FAIL test/alerts-center-notifier.e2e-spec.ts
  InvalidClientTokenId: The security token included in the request is invalid.
FAIL test/resource-isolation.e2e-spec.ts
  MissingAwsEndpointError: AWS_ENDPOINT_URL no está definida (o está vacía).
FAIL test/localstack-provisioning.e2e-spec.ts
  MissingAwsEndpointError: AWS_ENDPOINT_URL no está definida (o está vacía).
[otras suites AWS fallaron por la misma configuración; la salida de herramienta
se truncó tras 56.281 tokens]

Test Suites: 11 failed, 3 skipped, 13 passed, 24 of 27 total
Tests:       138 failed, 8 skipped, 214 passed, 360 total
Snapshots:   0 total
Time:        79.769 s, estimated 92 s
Ran all test suites.
ELIFECYCLE Command failed with exit code 1.
exit 1
```

El `.env` humano carece de varias claves locales, advertencia que ya daba el
baseline. Se provisionó LocalStack de forma idempotente con
`AWS_MODE=local`, endpoint local y credenciales dummy inyectadas solo al
proceso:

```text
$ pnpm -C backend-pet-tracker run provision:local
> backend-pet-tracker@0.0.1 provision:local
> ts-node -r tsconfig-paths/register scripts/provision-local.ts
◇ injected env (14) from ..\.env
exit 0
```

### Segunda corrida completa (rojo de esquema local)

```text
$ pnpm -C backend-pet-tracker run test:e2e
FAIL test/media.e2e-spec.ts
  R8 GetPublicAccessBlock: Exceeded timeout of 5000 ms
  R8 GetBucketPolicy: Exceeded timeout of 5000 ms
  R9 GET directo de photoUrl: Exceeded timeout of 5000 ms
FAIL test/media-docs.e2e-spec.ts
  error: relation "pet_documents" does not exist

Test Suites: 2 failed, 3 skipped, 22 passed, 24 of 27 total
Tests:       11 failed, 8 skipped, 341 passed, 360 total
Snapshots:   0 total
Time:        118.776 s
Ran all test suites.
ELIFECYCLE Command failed with exit code 1.
exit 1
```

Esta corrida ya usó LocalStack con credenciales dummy. El fallo restante de
Postgres es una precondición del volumen: faltaba la migración 0014 ya
versionada; los tres timeouts S3 ocurrieron mientras LocalStack calentaba. No
se cambió código de media, AWS, DB ni infraestructura.

### Tercera corrida completa (rojo de latencia/configuración S3)

```text
$ pnpm -C backend-pet-tracker run test:e2e
FAIL test/media.e2e-spec.ts
  R8 GetPublicAccessBlock: Exceeded timeout of 5000 ms
  R8 GetBucketPolicy: Exceeded timeout of 5000 ms
  R9 GET directo de photoUrl: Exceeded timeout of 5000 ms
FAIL test/media-docs.e2e-spec.ts
  R3 POST → PUT → GET: Exceeded timeout of 5000 ms

Test Suites: 2 failed, 3 skipped, 22 passed, 24 of 27 total
Tests:       4 failed, 8 skipped, 348 passed, 360 total
Snapshots:   0 total
Time:        139.566 s
Ran all test suites.
ELIFECYCLE Command failed with exit code 1.
exit 1
```

El contenedor seguía `healthy` (0,56 % CPU, 466 MiB) y el `.env` humano
tenía `AWS_PRESIGN_ENDPOINT_URL` presente. Para no leer ni modificar ese
valor específico de la máquina, la siguiente prueba inyecta
`http://localhost:4566` solo al proceso e2e local.

### Verificación aislada de media — verde

Con `AWS_PRESIGN_ENDPOINT_URL=http://localhost:4566` inyectado solo al
proceso, las dos suites que habían agotado su timeout pasaron:

```text
$ pnpm -C backend-pet-tracker exec jest --config test/jest-e2e.json test/media.e2e-spec.ts test/media-docs.e2e-spec.ts --runInBand
Test Suites: 2 passed, 2 total
Tests:       21 passed, 21 total
Snapshots:   0 total
exit 0
```

### Cuarta corrida completa — verde

Se repitió la suite completa con `AWS_MODE=local`, los endpoints de
LocalStack y credenciales dummy inyectados solo al proceso. No se leyó ni
modificó ningún secreto local:

```text
$ pnpm -C backend-pet-tracker run test:e2e
Test Suites: 3 skipped, 24 passed, 24 of 27 total
Tests:       8 skipped, 352 passed, 360 total
Snapshots:   0 total
Time:        112.963 s
Ran all test suites.
exit 0
```

La suite imprimió un error de FK esperado por una prueba negativa; Jest
terminó verde. Las migraciones 0014 y 0015 ya versionadas se aplicaron
únicamente al volumen local para restablecer las precondiciones e2e; no se
editó `src/db/` ni ningún fichero de migración.

## Verificación final sobre el HEAD formateado

```text
$ docker compose up -d
Container pet-tracker-localstack  Running
Container pet-tracker-postgres  Running
exit 0
```

```text
$ pnpm -C backend-pet-tracker run lint
> backend-pet-tracker@0.0.1 lint C:\dev\pet-tracker\backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
exit 0
```

El autofix produjo solo ajustes mecánicos en los ficheros permitidos; se
aislaron en `4fa7e62` (`style(auth-email-delivery): apply lint`). Una
segunda corrida no produjo diff adicional.

```text
$ pnpm -C backend-pet-tracker exec tsc --noEmit
<sin salida>
exit 0
```

```text
$ pnpm --filter backend-pet-tracker test
> backend-pet-tracker@0.0.1 test C:\dev\pet-tracker\backend-pet-tracker
> jest

Test Suites: 162 passed, 162 total
Tests:       1226 passed, 1226 total
Snapshots:   0 total
Time:        22.754 s, estimated 24 s
Ran all test suites.
exit 0
```

Durante esa suite aparecieron únicamente logs esperados de pruebas
negativas (mensajes inválidos, servicios simulados no disponibles y
entregas Resend con dobles); el resultado fue verde.

```text
$ pnpm -C backend-pet-tracker exec jest --config test/jest-e2e.json test/auth-email-delivery.e2e-spec.ts --runInBand
Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        8.115 s
Ran all test suites matching test/auth-email-delivery.e2e-spec.ts.
exit 0
```

## Bloqueo de cierre en `init.sh`

`./init.sh` completó build, las 162 suites/1226 tests del backend y las 2
suites/14 tests de infra. Se detuvo en el harness raíz porque el test
preexistente de #23 fija literalmente 21 claves en `.env.example`, mientras
R11 de esta spec obliga a añadir `RESEND_API_KEY` y `RESEND_FROM`, por lo
que ahora hay 23:

```text
$ ./init.sh
[WARN] .env no contiene 10 claves declaradas en .env.example
[WARN] STATUS.md declara 51/57; el inventario actual es 53/59
build: OK
backend: 162 suites, 1226 tests passed
infra: 2 suites, 14 tests passed

R11 (init-env-drift-warning #23): documentacion y cero variables nuevas
  ✖ no añade variables de entorno

AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

23 !== 21

    at env-drift.test.mjs:269:12

tests 28
pass 27
fail 1
exit 1
```

La reproducción aislada bajo el mismo Git Bash de `init.sh` confirma el
único fallo:

```text
$ node --test env-drift.test.mjs
ℹ tests 28
ℹ suites 11
ℹ pass 27
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0

test at env-drift.test.mjs:265:3
✖ no añade variables de entorno
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  23 !== 21

      at TestContext.<anonymous> (file:///C:/dev/pet-tracker/env-drift.test.mjs:269:12)
exit 1
```

`env-drift.test.mjs` está fuera de la lista literal de ficheros de R1–R12.
Actualizar su expectativa de 21 a 23 sería el cambio mínimo y correcto,
pero ampliaría la contención aprobada. Conforme a la instrucción de parar
ante un error de spec, no se editó el harness; el cierre queda bloqueado
hasta que el leader autorice expresamente ese fichero o corrija la spec.

## Contención final

La comprobación pedida contra `main` sale vacía después de filtrar la
allowlist de R12:

```text
$ git diff --name-only main...HEAD | grep -vE 'infrastructure/email/|infrastructure/guards/email-rate-limit|auth\.module|auth\.controller|auth-email-delivery|^\.env\.example$|docs/conventions\.md|docs/verification\.md|^specs/|^progress/|feature_list\.json|STATUS\.md'
<sin salida>
exit 1 (grep: ninguna coincidencia fuera de alcance)
```

El `git diff --stat main...HEAD` previo a este commit documental fue:

```text
 .env.example                                       |   8 +-
 .../src/modules/auth/auth.module.spec.ts           |  82 ++
 .../src/modules/auth/auth.module.ts                |  39 +-
 .../auth/infrastructure/auth.controller.spec.ts    | 163 ++++
 .../modules/auth/infrastructure/auth.controller.ts |   4 +
 .../console-email-verification-sender.spec.ts      |  16 +-
 .../email/console-email-verification-sender.ts     |  13 -
 .../email/console-password-reset-sender.spec.ts    |  32 +-
 .../email/console-password-reset-sender.ts         |  13 -
 .../infrastructure/email/resend-client.spec.ts     | 112 +++
 .../auth/infrastructure/email/resend-client.ts     | 150 ++++
 .../email/resend-email-verification-sender.spec.ts | 128 ++++
 .../email/resend-email-verification-sender.ts      |  27 +
 .../email/resend-password-reset-sender.spec.ts     | 128 ++++
 .../email/resend-password-reset-sender.ts          |  27 +
 .../guards/email-rate-limit.guard.spec.ts          | 118 +++
 .../guards/email-rate-limit.guard.ts               | 110 +++
 .../test/auth-email-delivery.e2e-spec.ts           | 279 +++++++
 docs/conventions.md                                |   4 +-
 docs/verification.md                               |  59 ++
 feature_list.json                                  |  39 +
 progress/current.md                                |  28 +
 progress/handoff_auth-email-delivery.md            |  86 +++
 progress/impl_auth-email-delivery.md               | 842 +++++++++++++++++++++
 specs/auth-email-delivery/design.md                | 369 +++++++++
 specs/auth-email-delivery/requirements.md          | 545 +++++++++++++
 specs/auth-email-delivery/tasks.md                 | 197 +++++
 specs/auth-email-delivery/traceability.md          |  47 ++
 28 files changed, 3587 insertions(+), 78 deletions(-)
```

La comprobación literal de la spec contra
`origin/feature/44-auth-forgot-password` no puede salir vacía en el estado
actual del repositorio: ese ref es `e03ad016`, `main` es `e09cf083` y su
merge-base con HEAD es el propio `e03ad016`. Por tanto lista cambios de #44
y de features posteriores que ya están en `main`, incluidos DB, media y
mobile; no son cambios introducidos por #58. La salida literal fue:

```text
.gitignore
backend-pet-tracker/src/aws/aws-clients.ts
backend-pet-tracker/src/aws/presign-endpoint.spec.ts
backend-pet-tracker/src/db/migrations/0015_auth_password_reset_tokens.sql
backend-pet-tracker/src/db/migrations/meta/0015_snapshot.json
backend-pet-tracker/src/db/migrations/meta/_journal.json
backend-pet-tracker/src/db/schema/index.ts
backend-pet-tracker/src/db/schema/password-reset-tokens.schema.spec.ts
backend-pet-tracker/src/db/schema/password-reset-tokens.schema.ts
backend-pet-tracker/src/modules/auth/application/dto/forgot-password.dto.ts
backend-pet-tracker/src/modules/auth/application/dto/reset-password.dto.ts
backend-pet-tracker/src/modules/auth/application/use-cases/login-user.use-case.spec.ts
backend-pet-tracker/src/modules/auth/application/use-cases/register-user.use-case.spec.ts
backend-pet-tracker/src/modules/auth/application/use-cases/request-password-reset.use-case.spec.ts
backend-pet-tracker/src/modules/auth/application/use-cases/request-password-reset.use-case.ts
backend-pet-tracker/src/modules/auth/application/use-cases/reset-password.use-case.spec.ts
backend-pet-tracker/src/modules/auth/application/use-cases/reset-password.use-case.ts
backend-pet-tracker/src/modules/auth/application/verification-token.ts
backend-pet-tracker/src/modules/auth/domain/entities/password-reset-token.entity.ts
backend-pet-tracker/src/modules/auth/domain/errors/password-reset.errors.ts
backend-pet-tracker/src/modules/auth/domain/ports/password-reset-sender.ts
backend-pet-tracker/src/modules/auth/domain/repositories/password-reset-token.repository.ts
backend-pet-tracker/src/modules/auth/domain/repositories/user.repository.ts
backend-pet-tracker/src/modules/auth/infrastructure/repositories/password-reset-token.drizzle.repository.ts
backend-pet-tracker/src/modules/auth/infrastructure/repositories/user.drizzle.repository.ts
backend-pet-tracker/src/modules/media/infrastructure/photo-storage.presign-host.spec.ts
backend-pet-tracker/src/modules/users/application/use-cases/get-profile.use-case.spec.ts
backend-pet-tracker/src/modules/users/application/use-cases/update-profile.use-case.spec.ts
backend-pet-tracker/test/auth-forgot-password.e2e-spec.ts
docs/data-model.md
docs/ui-guidelines.md
mobile-pet-tracker/app.config.test.ts
mobile-pet-tracker/app.config.ts
mobile-pet-tracker/bun.lock
mobile-pet-tracker/package.json
mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx
mobile-pet-tracker/src/app/(tabs)/map.tsx
mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx
mobile-pet-tracker/src/components/pet-map.tsx
mobile-pet-tracker/src/theme/map-style-dark.json
exit 0
```

No se modificaron por #58 `domain/`, `application/`, `src/db/`,
`src/workers/`, `infra/`, `mobile-pet-tracker/`, `main.ts`,
`test/auth-forgot-password.e2e-spec.ts`, `package.json`, `pnpm-lock.yaml`,
`feature_list.json` ni `progress/current.md`. G1–G4 siguen pendientes y
son gates humanos.
