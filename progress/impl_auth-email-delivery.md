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
