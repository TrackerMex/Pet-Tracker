---
feature: "aws-real-credentials"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[aws-real-credentials]]

> Ver [[requirements]] y [[../../docs/architecture|architecture]].
>
> Capa: **infrastructure**. `src/aws/` es infraestructura compartida (análoga a
> `src/db/`), no tiene domain ni application propios. Ninguna capa interna
> conoce este cambio: `domain` y `application` siguen sin saber que existe AWS.

## Decisiones técnicas

- **D1 — `AwsRuntimeConfig` gana un campo `mode`, sin volverse unión
  discriminada.** El tipo pasa a:

  ```ts
  export type AwsMode = 'local' | 'aws';

  export interface AwsRuntimeConfig {
    mode: AwsMode;
    endpoint: string;        // '' en modo aws
    region: string;
    accessKeyId: string;     // '' en modo aws
    secretAccessKey: string; // '' en modo aws
  }
  ```

  Los cuatro campos siguen siendo `string` requeridos. Motivo: `run-provisioning.ts`
  (L50) y `test/localstack-provisioning.e2e-spec.ts` (L68) leen `config.endpoint`
  como `string`; volverlos `string | undefined` obligaría a tocar consumidores
  por un beneficio de tipos que no cambia el comportamiento. La decisión de qué
  se le pasa al SDK vive en `resolveAwsClientOptions` (D3), no en el tipo (R1).

- **D2 — La resolución de modo es exact-match sobre `aws`, con fallback a
  `local`.** Helper privado en `aws-clients.ts`:

  ```ts
  function resolveAwsMode(raw: string | undefined): AwsMode {
    return (raw ?? '').trim().toLowerCase() === 'aws' ? 'aws' : 'local';
  }
  ```

  Es el mismo patrón que ya usan `SIM_MODE` y `PUSH_ENABLED` en
  `docs/conventions.md`: coincidencia exacta sobre el valor arriesgado, todo lo
  demás cae al default seguro. Un `AWS_MODE=awz` arranca contra LocalStack y
  falla ruidosamente en local, en vez de silenciosamente contra la cuenta real.
  No se exporta ni se lanza error por valor desconocido: sería una tercera
  ruta de fallo para cero beneficio (R1).

- **D3 — Un único constructor de opciones, `resolveAwsClientOptions`, y los
  cuatro factories lo consumen.** Sustituye al helper privado `credentials()`
  (L75-L83), que se borra:

  ```ts
  export interface AwsClientOptions {
    endpoint?: string;
    region?: string;
    credentials?: { accessKeyId: string; secretAccessKey: string };
  }

  export function resolveAwsClientOptions(
    config: AwsRuntimeConfig,
  ): AwsClientOptions;
  ```

  - `mode === 'local'` ⇒ `{ endpoint, region, credentials }` — exactamente las
    tres claves de hoy, con los mismos valores (R2).
  - `mode === 'aws'` ⇒ `{}` o `{ region }` si `config.region` no es cadena
    vacía. Sin `endpoint`, sin `credentials` (R3, R4, R5).

  Se exporta porque es **la superficie testeable de R4**: ver D6.

- **D4 — `forcePathStyle` se decide en `createS3Client`, no en las opciones
  comunes.** Es la única opción específica de un cliente:

  ```ts
  new S3Client({
    ...resolveAwsClientOptions(config),
    ...(config.mode === 'local' ? { forcePathStyle: true } : {}),
  });
  ```

  LocalStack community necesita path-style; S3 real no (R6). Los otros tres
  factories quedan en una línea: `new XClient(resolveAwsClientOptions(config))`.

- **D5 — `assertEndpoint` pasa a ser condicional solo dentro de
  `resolveAwsConfigFromEnv`.** El cuerpo pasa a resolver primero el modo y
  después decidir:
  `endpoint: mode === 'local' ? assertEndpoint(env.AWS_ENDPOINT_URL) : (env.AWS_ENDPOINT_URL ?? '')`.
  `resolveAwsConfigFromConfigService` **no** gana la comprobación: hoy no la
  tiene (devuelve `''`) y añadirla haría fallar el arranque de `AwsModule` en
  escenarios que nadie pidió. `MissingAwsEndpointError` conserva su clase, su
  nombre y su mensaje intactos: sigue siendo la red de seguridad del script de
  provisioning (R7).

- **D6 — Cómo se prueba "sin credentials explícitas" (R4): sobre las opciones,
  no sobre el cliente.** Comprobado empíricamente con `@aws-sdk/client-sqs`
  3.1098.0 en este repo:

  | Introspección | Sin pasar la opción | Pasándola |
  |---|---|---|
  | `client.config.endpoint` | `undefined` | `function` |
  | `client.config.credentials` | `function` | `function` |
  | `s3.config.forcePathStyle` | `false` | `true` |

  `client.config.credentials` es una función en ambos casos (el SDK normaliza
  el par estático a un provider), así que **no discrimina** y no sirve para
  R4. Por eso R3 y R6 se testean sobre el cliente construido y R4 se testea
  sobre el objeto que devuelve `resolveAwsClientOptions`. No inventes una
  aserción sobre `client.config.credentials`: no existe ninguna que distinga los
  dos modos sin resolver credenciales reales.

- **D7 — Guarda en `run-provisioning.ts` (R8).** Tras el `resolveAwsConfigFromEnv`
  exitoso y **antes** del bloque que crea los cuatro clientes (hoy L39-L44):
  si `config.mode === 'aws'`, `logger.error(<mensaje que nombra AWS_MODE>)` y
  `return 1`. Tres líneas. Sin ellas, un desarrollador con `AWS_MODE=aws` en su
  `.env` que ejecute `pnpm run provision:local` (o el e2e de LocalStack, que
  llama a `runProvisioning` en su `beforeAll`) crearía 8 recursos reales en su
  cuenta. Es el único punto en el que esta feature va más allá de los 6
  criterios de aceptación de `feature_list.json` #19, y es una red de
  seguridad, no una funcionalidad nueva. Si el gate humano la considera scope
  creep, se borra R8 y el resto de la spec sigue en pie sin tocar nada más.

- **D8 — El `.env` de desarrollo sabotea el modo `aws` si no se limpia.**
  `@nestjs/config`/`dotenv` cargan `AWS_ACCESS_KEY_ID=test` y
  `AWS_SECRET_ACCESS_KEY=test` en `process.env`, y la cadena por defecto del
  SDK v3 mira las variables de entorno **antes** que el perfil/sesión de
  `aws login`. Resultado: con `AWS_MODE=aws` y el `.env` intacto, la llamada
  falla con un error de credenciales inválidas aunque el código sea correcto.
  Se ataca por dos vías, ninguna mágica:
  1. La suite de humo falla rápido con un mensaje que nombra
     `AWS_ACCESS_KEY_ID` si esa variable está presente (R11).
  2. `docs/verification.md` documenta comentar ambas líneas del `.env` raíz
     antes de correr en modo `aws` (R12).

  **No** se borran variables de `process.env` desde el código: efectos
  laterales globales para arreglar un problema de configuración.

- **D9 — La prueba de humo es un e2e auto-saltable, no prosa.** Vive en
  `backend-pet-tracker/test/aws-real-smoke.e2e-spec.ts` (el `testRegex` de
  `test/jest-e2e.json` es `.e2e-spec.ts$`, así que entra sola). Arranca con
  `const runSmoke = (process.env.AWS_MODE ?? '').trim().toLowerCase() === 'aws';`
  y usa `(runSmoke ? describe : describe.skip)(...)`. En CI y en `./init.sh`
  (donde `AWS_MODE` no es `aws`) la suite sale como *skipped* y no requiere
  credenciales. Alternativa descartada: documentar solo un comando en un `.md`
  — un procedimiento que nadie ejecuta es un procedimiento que se pudre.

- **D10 — `AWS_MODE` se documenta en los dos sitios y el test lo vigila.**
  Precedente exacto en el repo: `src/aws/status-doc.spec.ts` lee `STATUS.md`
  desde `src/aws/` con `join(__dirname, '..', '..', '..', 'STATUS.md')`. El
  nuevo `src/aws/aws-mode-docs.spec.ts` hace lo mismo contra `.env.example` y
  `docs/conventions.md` (R10). Al ser `.spec.ts`, los guardas estáticos de R9
  lo ignoran.

## Archivos afectados

Todo lo de `backend-pet-tracker/` es capa **infrastructure**; el resto es
documentación del harness.

| Archivo | Cambio |
|---|---|
| `backend-pet-tracker/src/aws/aws-clients.ts` | **Modificar.** `AwsMode`, `mode` en `AwsRuntimeConfig`, `resolveAwsMode` (privada), `AwsClientOptions` + `resolveAwsClientOptions` (exportados), borrar `credentials()`, condicionar `assertEndpoint` y `forcePathStyle`. R1-R7 |
| `backend-pet-tracker/src/aws/run-provisioning.ts` | **Modificar.** 3 líneas de guarda para `mode === 'aws'`. R8 |
| `backend-pet-tracker/src/aws/aws-mode.spec.ts` | **Nuevo.** Tests unitarios de R1-R7 |
| `backend-pet-tracker/src/aws/run-provisioning.spec.ts` | **Modificar.** Añadir un `describe('R8: …')` siguiendo el patrón `silentLogger()` ya presente en el archivo |
| `backend-pet-tracker/src/aws/aws-mode-docs.spec.ts` | **Nuevo.** Test de R10 sobre `.env.example` y `docs/conventions.md` |
| `backend-pet-tracker/test/aws-real-smoke.e2e-spec.ts` | **Nuevo.** Prueba de humo auto-saltable. R11 |
| `.env.example` (raíz) | **Modificar.** `AWS_MODE=local` + comentario, junto al bloque LocalStack existente. R10 |
| `docs/conventions.md` | **Modificar.** Fila `AWS_MODE` en la tabla "Variables de entorno". R10 |
| `docs/verification.md` | **Modificar.** Sección "Feature 19 — aws-real-credentials" con el procedimiento de humo. R12 |
| `progress/impl_aws-real-credentials.md` | **Nuevo.** Bitácora del implementer + output redactado de la corrida real. R12 |
| `specs/aws-real-credentials/traceability.md` | **Modificar.** Una fila por R-id tras cada commit |

**No se tocan** (si aparecen en el diff, el reviewer rechaza):
`src/aws/provisioning.ts`, `src/aws/aws.module.ts`, `src/aws/aws.constants.ts`,
`src/aws/constants.ts`, `scripts/provision-local.ts`,
`test/localstack-provisioning.e2e-spec.ts`, `src/aws/aws-clients.spec.ts`,
`src/aws/aws-env-config.spec.ts`, `src/aws/aws.module.spec.ts`,
`src/aws/no-hardcoded-credentials.spec.ts`, `src/aws/no-real-aws-endpoint.spec.ts`,
`test/fixtures/.env.aws-fixture`.

## Texto exacto de la documentación (R10)

`.env.example`, inmediatamente encima del bloque `AWS_ENDPOINT_URL`:

```
# Modo de los clientes AWS SDK v3 (#19). local (default, y cualquier valor que
# no sea exactamente "aws"): endpoint explicito + par estatico de credenciales
# + forcePathStyle en S3, todo contra LocalStack. aws: los clientes se
# construyen sin endpoint y sin credentials, el SDK resuelve por su cadena por
# defecto (sesion de `aws login`, que rota). En modo aws hay que comentar
# AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY de este archivo: la cadena mira las
# variables de entorno antes que la sesion (docs/verification.md, feature 19).
AWS_MODE=local
```

Fila para la tabla "Variables de entorno" de `docs/conventions.md` (al final,
después de `PUSH_ENABLED`):

```
| `AWS_MODE` | Modo de construcción de los 4 clientes AWS SDK v3. Cualquier valor distinto de `aws` (incluida su ausencia) ⇒ `local`: endpoint `AWS_ENDPOINT_URL`, par estático `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`, `forcePathStyle` en S3 y `MissingAwsEndpointError` como red de seguridad. Con `aws`: sin endpoint y sin credentials explícitas, resuelve el SDK por su cadena por defecto (`~/.aws/`, `AWS_PROFILE`, sesión de `aws login` — variables que la app nunca lee); `AWS_REGION` se pasa solo si tiene valor. `runProvisioning` aborta con exit 1 en modo `aws` | en `.env.example` (con `local`) — consumida desde `aws-real-credentials` (#19): `src/aws/aws-clients.ts` vía `ConfigService` y vía `process.env` en el script standalone (misma excepción documentada que `AWS_ENDPOINT_URL`) |
```

## Alternativas descartadas

- **Unión discriminada `AwsRuntimeConfig`** (`{mode:'local', endpoint:string,…} | {mode:'aws', region:string}`):
  más segura en tipos, pero obliga a estrechar el tipo en `run-provisioning.ts`
  y en el e2e de LocalStack, que hoy leen `config.endpoint` sin condiciones.
  Diff mayor, cero cambio de comportamiento. Descartada por D1.
- **Una variable booleana (`AWS_REAL=true`) en vez de `AWS_MODE`**: el criterio
  de aceptación #1 nombra `AWS_MODE=local|aws` explícitamente, y un enum deja
  sitio a un tercer modo sin romper el contrato.
- **Lanzar un error con un `AWS_MODE` desconocido**: tercera ruta de fallo,
  rompe el default seguro y contradice el patrón `SIM_MODE`/`PUSH_ENABLED` del
  proyecto. Descartada por D2.
- **Limpiar `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` de `process.env` en modo
  `aws`**: mutar el entorno global del proceso para compensar un `.env` mal
  configurado. Efecto lateral invisible que rompería cualquier otro consumidor
  del proceso. Descartada por D8.
- **Un cliente STS + `GetCallerIdentity` como prueba de humo**: añade la
  dependencia `@aws-sdk/client-sts`, que hoy no está en `package.json`, para
  probar lo mismo que un `ListQueuesCommand` con un cliente que ya existe.
- **Reescribir el e2e de LocalStack para parametrizar el modo**: el criterio de
  aceptación #1 exige justo lo contrario, que ese archivo siga verde sin
  cambios en su flujo.
