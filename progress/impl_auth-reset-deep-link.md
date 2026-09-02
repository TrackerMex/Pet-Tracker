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

### R3 — rojo (`d433535`)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/auth.module.spec.ts --runInBand
FAIL src/modules/auth/auth.module.spec.ts
  ● R3 (auth-reset-deep-link): EMAIL_ENABLED=true sin RESET_LINK_HOST aborta el arranque
    › rechaza la compilacion cuando la variable esta ausente

    expect(received).rejects.toThrow()
    Received promise resolved instead of rejected

  ● R3 (auth-reset-deep-link): EMAIL_ENABLED=true sin RESET_LINK_HOST aborta el arranque
    › rechaza la compilacion cuando la variable esta vacia

    expect(received).rejects.toThrow()
    Received promise resolved instead of rejected

Test Suites: 1 failed, 1 total
Tests:       2 failed, 5 passed, 7 total
Snapshots:   0 total
Time:        1.537 s, estimated 2 s
Ran all test suites matching src/modules/auth/auth.module.spec.ts.
exit 1
```

Jest imprimió además la serialización interna completa de los dos módulos de
Nest resueltos; se omite por longitud. En ambos casos la causa observable fue
la misma: la compilación resolvió cuando debía rechazar la configuración.

## Bloqueo de spec en R3

Se intentó la implementación literal de R3 dentro de la allowlist:

1. `ResendPasswordResetSender(client, resetLinkHost)` valida el host en su
   constructor y lanza `MissingResendConfigError(['RESET_LINK_HOST'])` si está
   vacío.
2. El factory de `PASSWORD_RESET_SENDER` pasa `config.get<string>(
   'RESET_LINK_HOST') ?? ''` a Resend y `... ?? null` a consola.
3. El describe R3 de #58 recibe `RESET_LINK_HOST` en su doble de config, la
   única edición compartida que la spec autoriza para ese requisito.

La suite objetivo quedó verde:

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/auth.module.spec.ts src/modules/auth/infrastructure/email/password-reset-link.spec.ts src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts src/modules/auth/infrastructure/email/console-password-reset-sender.spec.ts --runInBand
Test Suites: 4 passed, 4 total
Tests:       18 passed, 18 total
Snapshots:   0 total
Time:        1.835 s, estimated 3 s
exit 0
```

Sin embargo, el typecheck obligatorio de R12 descubrió dos consumidores
preexistentes que llaman al constructor con un solo argumento:

```text
$ pnpm -C backend-pet-tracker exec tsc --noEmit
src/modules/auth/infrastructure/auth.controller.spec.ts(470,20): error TS2554: Expected 2 arguments, but got 1.
test/auth-email-delivery.e2e-spec.ts(56,19): error TS2554: Expected 2 arguments, but got 1.
exit 2
```

El segundo caso contradice además el §Contexto fijo de `requirements.md`, que
afirma que `test/auth-email-delivery.e2e-spec.ts` «no se ve afectado»: ese e2e
reemplaza `PASSWORD_RESET_SENDER` con
`new ResendPasswordResetSender(client)`, por lo que sí queda afectado. El
unitario de `auth.controller.spec.ts` hace la misma construcción.

R12 no incluye ninguno de esos dos ficheros en la allowlist y prohíbe tocar
nada más de #58 fuera de las excepciones enumeradas. No existe una
implementación que cumpla simultáneamente estas tres condiciones:

- el constructor aborta si `resetLinkHost` está ausente o vacío (R3);
- las dos llamadas existentes sin host siguen compilando y ejecutándose;
- esos dos ficheros no se editan (R12).

Dar un default, tolerar `undefined` solo cuando se omite el argumento o saltar
la URL en ese camino haría que una construcción de Resend sin
`RESET_LINK_HOST` no fallara, contradiciendo el fail-fast explícito de R3 y
D3. Validar en el factory en vez del constructor contradice también el origen
del error fijado por R3.

De acuerdo con la orden del handoff, se retiró por completo el intento de
implementación verde no commiteado, no se editó ningún documento de `specs/`
y se detuvo el trabajo en el commit rojo de R3. Para desbloquear, el humano
debe aprobar una de estas correcciones de spec:

1. ampliar la allowlist para pasar un host de prueba en
   `auth.controller.spec.ts` y `test/auth-email-delivery.e2e-spec.ts`
   (corrección mínima recomendada), o
2. redefinir R3 para permitir explícitamente un modo de compatibilidad del
   constructor cuando se omite el segundo argumento.

## Reanudación tras la Adenda 1

El leader confirmó el bloqueo y autorizó por escrito la opción 1 en la
Adenda 1 de `progress/handoff_auth-reset-deep-link.md`: pasar exclusivamente
`'reset.test'` como segundo argumento en las dos construcciones heredadas. La
opción de compatibilidad quedó rechazada. No se editó la spec.

### R3 — verde (`0a96192`)

```text
$ pnpm -C backend-pet-tracker exec jest src/modules/auth/auth.module.spec.ts src/modules/auth/infrastructure/auth.controller.spec.ts src/modules/auth/infrastructure/email/password-reset-link.spec.ts src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts src/modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts src/modules/auth/infrastructure/email/resend-client.spec.ts src/modules/auth/infrastructure/email/console-password-reset-sender.spec.ts src/modules/auth/infrastructure/email/console-email-verification-sender.spec.ts src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts --runInBand
Test Suites: 9 passed, 9 total
Tests:       70 passed, 70 total
Snapshots:   0 total
Time:        2.931 s, estimated 3 s
exit 0

$ pnpm -C backend-pet-tracker exec tsc --noEmit
exit 0

$ pnpm -C backend-pet-tracker run test:e2e -- --runInBand test/auth-email-delivery.e2e-spec.ts
Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        2.502 s, estimated 3 s
exit 0
```

El constructor implementa el fail-fast literal para host ausente, vacío o de
solo espacios. El factory pasa `''` al adaptador Resend y `null` al de consola.
Las dos ediciones mecánicas de la Adenda 1 fueron incluidas en el mismo commit
verde y no cambiaron ningún otro contenido de esos ficheros. El typecheck y
las suites unitarias/e2e heredadas de #58 quedan verdes.

### R9 — rojo (`837ad2f`)

```text
$ cd mobile-pet-tracker && bun run test --runInBand src/__tests__/hosting-artifacts.test.ts
FAIL src/__tests__/hosting-artifacts.test.ts
  R9: assetlinks.json delega el dominio en el paquete Android de la app
    ✕ publica un unico statement para el package y fingerprint esperados

  ● ENOENT: no such file or directory, open
    '/home/claude/sites/Pet-Tracker/hosting/.well-known/assetlinks.json'

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        1.878 s
Ran all test suites matching /src\\/__tests__\\/hosting-artifacts.test.ts/i.
error: script "test" exited with code 1
exit 1
```

### R9 — verde (`9ba7e93`)

```text
$ cd mobile-pet-tracker && bun run test --runInBand src/__tests__/hosting-artifacts.test.ts
PASS src/__tests__/hosting-artifacts.test.ts
  R9: assetlinks.json delega el dominio en el paquete Android de la app
    ✓ publica un unico statement para el package y fingerprint esperados

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.338 s, estimated 2 s
exit 0
```

`assetlinks.json` contiene un único statement para
`com.trackermex.pettracker` y conserva el placeholder humano del fingerprint.
El README mapea los dos destinos de Hostinger sin incluir ningún dominio real.

### R10 — rojo (`0039189`)

```text
$ cd mobile-pet-tracker && bun run test --runInBand src/__tests__/hosting-artifacts.test.ts
FAIL src/__tests__/hosting-artifacts.test.ts
  R9: assetlinks.json delega el dominio en el paquete Android de la app
    ✓ publica un unico statement para el package y fingerprint esperados
  R10: la pagina fallback no consume el token y ofrece abrir la app
    ✕ solo procesa el query local y no contiene primitivas ni recursos de red

  ● ENOENT: no such file or directory, open
    '/home/claude/sites/Pet-Tracker/hosting/reset-password/index.html'

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
Snapshots:   0 total
Time:        2.025 s
Ran all test suites matching /src\\/__tests__\\/hosting-artifacts.test.ts/i.
error: script "test" exited with code 1
exit 1
```

### R10 — verde (`243fcc6`)

```text
$ cd mobile-pet-tracker && bun run test --runInBand src/__tests__/hosting-artifacts.test.ts
PASS src/__tests__/hosting-artifacts.test.ts
  R9: assetlinks.json delega el dominio en el paquete Android de la app
    ✓ publica un unico statement para el package y fingerprint esperados
  R10: la pagina fallback no consume el token y ofrece abrir la app
    ✓ solo procesa el query local y no contiene primitivas ni recursos de red

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.419 s, estimated 2 s
exit 0
```

La página autocontenida procesa el query exclusivamente con
`URLSearchParams`, muestra el token como texto copiable y construye el scheme
con `encodeURIComponent`. No contiene solicitudes, formularios remotos ni
recursos externos; también ofrece un estado local seguro si falta el token.

### R4 — rojo (`805bf65`)

```text
$ cd mobile-pet-tracker && bun run test --runInBand app.config.test.ts
FAIL ./app.config.test.ts
  R4 (auth-reset-deep-link): RESET_LINK_HOST declara el intent filter de App Links
    ✕ preserva app.json e inyecta un unico filtro https verificado
  R4 (auth-reset-deep-link): sin RESET_LINK_HOST avisa y no declara intent filters
    ✕ acepta un host ausente sin lanzar
    ✕ acepta un host vacío sin lanzar
    ✕ acepta un host solo espacios sin lanzar

  ● Expected: [{"action":"VIEW","autoVerify":true,"category":["BROWSABLE","DEFAULT"],"data":[{"host":"reset.example.test","pathPrefix":"/reset-password","scheme":"https"}]}]
    Received: undefined

  ● Los tres casos sin host esperaban 1 llamada a console.warn
    Received number of calls: 0

Test Suites: 1 failed, 1 total
Tests:       4 failed, 5 passed, 9 total
Snapshots:   0 total
Time:        1.628 s
Ran all test suites matching /app.config.test.ts/i.
error: script "test" exited with code 1
exit 1
```

### R4 — verde (`5877535`)

```text
$ cd mobile-pet-tracker && bun run test --runInBand app.config.test.ts
PASS ./app.config.test.ts
Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        1.807 s, estimated 2 s
exit 0

$ cd mobile-pet-tracker && bun run typecheck
$ tsc --noEmit
exit 0
```

La config recorta el host e inyecta exactamente un intent filter verificado
sin modificar `app.json`. Las ramas de Maps y App Links son independientes;
si faltan ambas variables sus mensajes se agrupan en una única llamada a
`console.warn`, conservando el contrato previo de una advertencia y el nuevo
contrato de R4.

### R7 — rojo (`e729bf4`)

```text
$ cd mobile-pet-tracker && bun run test --runInBand src/api/__tests__/auth.test.ts
FAIL src/api/__tests__/auth.test.ts
  R1: login mapea la respuesta por kind
    ✓ 10 tests
  R2: register mapea la respuesta por kind
    ✓ 10 tests
  R7 (auth-reset-deep-link): resetPassword mapea la respuesta por kind
    ✕ hace POST con el payload completo y mapea 200 a ok
    ✕ mapea 410 a expired
    ✕ mapea un 400 con errors de zod a validation
    ✕ mapea un 400 sin errors a invalid-token
    ✕ mapea un rechazo de fetch a unreachable
    ✕ mapea base URL ausente undefined sin hacer fetch
    ✕ mapea base URL ausente "" sin hacer fetch
    ✕ mapea status inesperado a error
    ✕ mapea status de éxito inesperado a error

  ● TypeError: (0 , _auth.resetPassword) is not a function

Test Suites: 1 failed, 1 total
Tests:       9 failed, 20 passed, 29 total
Snapshots:   0 total
Time:        1.983 s
Ran all test suites matching /src\\/api\\/__tests__\\/auth.test.ts/i.
error: script "test" exited with code 1
exit 1
```

### R7 — verde (`6139108`)

```text
$ cd mobile-pet-tracker && bun run test --runInBand src/api/__tests__/auth.test.ts
PASS src/api/__tests__/auth.test.ts
Test Suites: 1 passed, 1 total
Tests:       29 passed, 29 total
Snapshots:   0 total
Time:        1.672 s, estimated 2 s
exit 0

$ cd mobile-pet-tracker && bun run typecheck
$ tsc --noEmit
exit 0
```

`resetPassword` reutiliza `postJson`, no hace red sin base URL y devuelve la
unión discriminada completa. Los `400` con `errors[]` se distinguen de los
tokens inválidos/usados; `410`, fallos de transporte y statuses inesperados
mantienen estados separados.

### R5 — rojo (`0ad7139`)

```text
$ cd mobile-pet-tracker && bun run test --runInBand src/screens/reset-password/index.test.tsx
FAIL src/screens/reset-password/index.test.tsx
  ● Test suite failed to run

    Cannot find module '../../app/reset-password' from
    'src/screens/reset-password/index.test.tsx'

      4 | import ResetPasswordRoute from '../../app/reset-password';
        | ^

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        2.723 s
Ran all test suites matching /src\\/screens\\/reset-password\\/index.test.tsx/i.
error: script "test" exited with code 1
exit 1
```

Primer intento de verde de R5 (producción aún sin commit):

```text
$ cd mobile-pet-tracker && bun run test --runInBand src/screens/reset-password/index.test.tsx
FAIL src/screens/reset-password/index.test.tsx
  R5: la ruta /reset-password recibe el token del deep link
    ✕ 4 tests

  ● TypeError: (0 , _expoRouter.useLocalSearchParams) is not a function

Test Suites: 1 failed, 1 total
Tests:       4 failed, 4 total
Snapshots:   0 total
Time:        3.582 s
exit 1
```

La causa fue el factory hoisted del mock, que capturaba un `jest.fn` declarado
fuera antes de inicializarse. Se corrigió al patrón existente del repo:
exports creados dentro de `jest.mock` y referencias obtenidas con
`jest.mocked(...)`. No se cambió el comportamiento exigido por R5.

La suite pasó tras ese ajuste (4/4), pero el primer typecheck aún quedó rojo:

```text
$ cd mobile-pet-tracker && bun run typecheck
$ tsc --noEmit
src/screens/reset-password/index.test.tsx(22,46): error TS2322: Type
'string | undefined' is not assignable to type 'string | string[]'.
exit 2
```

El mock representaba la ausencia como `{ token: undefined }`; se cambió a
`{}`, la forma real de Expo Router cuando el query param no existe.

### R5 — verde (`56ea5d6`)

```text
$ cd mobile-pet-tracker && bun run test --runInBand src/screens/reset-password/index.test.tsx
PASS src/screens/reset-password/index.test.tsx
Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        3.388 s, estimated 5 s
exit 0

$ cd mobile-pet-tracker && bun run typecheck
$ tsc --noEmit
exit 0
```

La ruta raíz `/reset-password` delega en `ResetPasswordScreen`, conserva el
token recibido por Expo Router y muestra un estado local seguro cuando falta.
El montaje no contiene todavía ninguna llamada de red; esa propiedad se fija
explícitamente en R6.

### R6 — rojo (`158e256`)

```text
$ cd mobile-pet-tracker && bun run test --runInBand src/screens/reset-password/index.test.tsx
FAIL src/screens/reset-password/index.test.tsx
  R6: abrir la pantalla no dispara ninguna peticion
    ✓ no llama a resetPassword al montar la pantalla
    ✕ hace exactamente una llamada despues del submit

  ● expect(jest.fn()).toHaveBeenCalledTimes(expected)
    Expected number of calls: 1
    Received number of calls: 0

Test Suites: 1 failed, 1 total
Tests:       1 failed, 5 passed, 6 total
Snapshots:   0 total
Time:        4.413 s
exit 1
```

El montaje permanece sin red, pero el botón todavía no tiene handler: la
única prueba roja es la llamada intencional posterior al submit.

### R6 — verde (`b93c938`)

```text
$ cd mobile-pet-tracker && bun run test --runInBand src/screens/reset-password/index.test.tsx
PASS src/screens/reset-password/index.test.tsx
Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        3.141 s, estimated 5 s
exit 0

$ cd mobile-pet-tracker && bun run typecheck
$ tsc --noEmit
exit 0
```

No hay efectos ni loaders de red: montar la ruta deja el mock intacto y el
único camino que invoca `resetPassword` es el handler de `reset-submit`.

### R8 — rojo

```text
$ cd mobile-pet-tracker && bun run test --runInBand src/screens/reset-password/index.test.tsx
FAIL src/screens/reset-password/index.test.tsx
  R8: el submit completa el reset y mapea los errores
    ✕ retira el formulario y permite volver al login tras el exito
    ✕ muestra el mensaje esperado para $kind y permite reintentar (5 casos)
    ✕ une por salto de linea todos los mensajes de validacion
    ✕ deshabilita el boton mientras la peticion esta en vuelo

  ● Unable to find an element with testID: reset-success
  ● Unable to find an element with testID: reset-error
  ● expect(instance).toBeDisabled()
    Received instance is not disabled

Test Suites: 1 failed, 1 total
Tests:       8 failed, 6 passed, 14 total
Snapshots:   0 total
Time:        11.587 s
exit 1
```

R5 y R6 permanecen verdes (6/6). El rojo demuestra que la pantalla todavía
ignora el resultado de la API y no representa ni el estado en vuelo ni sus
resultados.
