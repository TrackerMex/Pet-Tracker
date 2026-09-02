# Implementación — Feature #59 `auth-reset-deep-link`

- Fecha: 2026-09-02
- Branch: `feature/59-auth-reset-deep-link`
- Alcance: R1–R12, backend + móvil + hosting estático
- Resultado: en progreso; gates humanos G1–G4 fuera del alcance del implementer

## Verificación previa

```text
$ git checkout feature/59-auth-reset-deep-link && git pull
Already up to date.

$ ./init.sh
exit 0
build: OK
backend: 162 suites, 1226 tests passed
infra: 2 suites, 14 tests passed
harness env-drift: 28 tests passed
mobile: 51 suites, 578 tests passed, 1 snapshot
e2e: 24 suites, 352 tests passed; 3 suites y 8 tests omitidos por gates existentes
lint y typecheck: OK
```

`init.sh` mostró dos advertencias preexistentes: `RESEND_API_KEY` y
`RESEND_FROM` ausentes en el `.env` local, y `STATUS.md` con conteo 51/57
frente a 54/59. No se modificó el `.env`, `STATUS.md`, `feature_list.json` ni
`progress/current.md`.

No se ejecutará red real, no se resolverá DNS, no se subirá contenido a
Hostinger y no se generará ningún build Android. Los gates G1–G4 permanecen
pendientes y son exclusivamente humanos.

## Skills móviles cargadas

La instalación local del plugin Expo es la 1.0.2 y no contiene la skill
`expo-overview` citada por la carta de UI (que espera v1.12+). Se leyó primero
el `README.md` del plugin como overview y después las skills disponibles
equivalentes `building-native-ui`, `native-data-fetching` y
`expo-tailwind-setup`. También se cargó la skill obligatoria del repositorio
`appllama-app-design-skill`; sus límites específicos quedan fijados por
`docs/ui-guidelines.md` (tokens/uniwind/heroui-native y gate humano Android).

## Historial TDD

### R1 — rojo (`030076c`)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/email/password-reset-link.spec.ts src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts --runInBand
FAIL src/modules/auth/infrastructure/email/password-reset-link.spec.ts
  ● Test suite failed to run

    Cannot find module './password-reset-link' from
    'modules/auth/infrastructure/email/password-reset-link.spec.ts'

FAIL src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts
  ● Test suite failed to run

    Cannot find module './password-reset-link' from
    'modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts'

Test Suites: 2 failed, 2 total
Tests:       0 total
Snapshots:   0 total
Time:        0.93 s, estimated 1 s
Ran all test suites matching src/modules/auth/infrastructure/email/password-reset-link.spec.ts|src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts.
exit 1
```

### R1 — verde (`e0dfff8`)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/email/password-reset-link.spec.ts src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts --runInBand
Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        0.991 s
Ran all test suites matching src/modules/auth/infrastructure/email/password-reset-link.spec.ts|src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts.
exit 0

$ pnpm -C backend-pet-tracker exec tsc --noEmit
exit 0
```

El helper nuevo conserva el path fijo, elimina slash finales del host y
codifica el token. El correo mantiene el token pelado como segundo párrafo,
añade la URL en uno posterior y continúa limitado a texto plano. En el describe
R1 de #58 solo se eliminó el assert que prohibía `http`; las demás ediciones de
ese fichero pasan el nuevo argumento del constructor.

### R2 — rojo (`4b816e7`)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/email/console-password-reset-sender.spec.ts --runInBand
FAIL src/modules/auth/infrastructure/email/console-password-reset-sender.spec.ts
  ● R2 (auth-reset-deep-link): con RESET_LINK_HOST el log incluye resetUrl
    › conserva los cinco campos existentes y agrega la URL normalizada

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

      Object {
        "email": "ada@example.com",
        "event": "auth.password_reset.issued",
        "expiresAt": "2026-08-28T21:00:00.000Z",
    -   "resetUrl": "https://reset.example.test/reset-password?token=kQ8s0Zr4Vv1nT7yQ2bXpL9dW3fH6jM0aC5eR8uY1oI4",
        "token": "kQ8s0Zr4Vv1nT7yQ2bXpL9dW3fH6jM0aC5eR8uY1oI4",
        "userId": "0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77",
      }

Test Suites: 1 failed, 1 total
Tests:       1 failed, 5 passed, 6 total
Snapshots:   0 total
Time:        0.947 s, estimated 1 s
Ran all test suites matching src/modules/auth/infrastructure/email/console-password-reset-sender.spec.ts.
exit 1
```

### R2 — verde (`ada573c`)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/infrastructure/email/console-password-reset-sender.spec.ts --runInBand
Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        0.874 s, estimated 1 s
Ran all test suites matching src/modules/auth/infrastructure/email/console-password-reset-sender.spec.ts.
exit 0

$ pnpm -C backend-pet-tracker exec tsc --noEmit
exit 0
```

El adaptador de consola acepta el host opcional y añade `resetUrl` mediante el
mismo compositor de R1. Con `undefined`, `null` o cadena vacía conserva
exactamente los cinco campos de #44 y no emite advertencias.
