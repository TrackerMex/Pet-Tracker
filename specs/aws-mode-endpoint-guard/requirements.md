---
feature: "aws-mode-endpoint-guard"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[aws-mode-endpoint-guard]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] y [[../../docs/architecture|architecture]].
>
> Fuente: `feature_list.json` #21 (6 criterios de aceptación) más los checkpoints
> C2-C7 de [[../../CHECKPOINTS|CHECKPOINTS]]. Depende de `aws-real-credentials`
> (#19), que introdujo `AWS_MODE`, `AwsMode`, `resolveAwsClientOptions` y la
> guarda inversa `MissingAwsEndpointError`.
>
> **Esta spec la implementa un agente sin acceso a la conversación que la
> originó.** Todo lo decidible está decidido aquí y en [[design]]. Nombres de
> símbolos, rutas y textos son literales, no ejemplos.

## Por qué existe esta feature (defecto, no mejora)

`aws-real-credentials` (#19) asumió que **no pasar** `endpoint` al construir los
clientes bastaba para aislar `AWS_MODE=aws` de LocalStack. No basta: el AWS SDK
v3 lee `AWS_ENDPOINT_URL` de `process.env` por su cuenta, como configuración
global del SDK. Con el `.env` raíz sin tocar, `AWS_MODE=aws` sigue hablando con
LocalStack.

El síntoma fue peor que un fallo: al cerrar #20,
`backend-pet-tracker/test/aws-real-ingest.e2e-spec.ts` **pasó en verde contra
LocalStack** (`QueueUrl` con account `000000000000`), haciendo creer que se
había verificado AWS real. Solo se detectó apagando LocalStack y repitiendo la
suite (ver `progress/history.md`, sesión 2026-08-10 cierre).

La asimetría de hoy es el defecto: existe `assertNoStaticAccessKey` para las
credenciales y **nada equivalente para el endpoint**.

## Contexto mínimo (estado actual, verificado en el repo)

`backend-pet-tracker/src/aws/aws-clients.ts` (137 líneas hoy) exporta:

| Símbolo | Línea (hoy) | Qué hace |
|---|---|---|
| `AwsMode` | L7 | `'local' \| 'aws'` |
| `AwsRuntimeConfig` | L9 | `{ mode, endpoint, region, accessKeyId, secretAccessKey }` |
| `MissingAwsEndpointError` | L22 | Error si falta `AWS_ENDPOINT_URL` **en modo local** |
| `assertEndpoint()` (privada) | L34 | Lanza `MissingAwsEndpointError` si el endpoint es vacío o solo espacios |
| `resolveAwsMode()` (privada) | L41 | `.trim().toLowerCase() === 'aws' ? 'aws' : 'local'` |
| `resolveAwsConfigFromEnv(env)` | L53 | Vía `process.env` (script standalone + e2e). En modo `aws` hace `env.AWS_ENDPOINT_URL ?? ''` — **aquí está el agujero** |
| `resolveAwsConfigFromConfigService(config)` | L77 | Vía `ConfigService` (runtime Nest). Hace `config.get('AWS_ENDPOINT_URL') ?? ''` — **mismo agujero** |
| `resolveAwsClientOptions(config)` | L98 | En modo `aws` devuelve `{}` o `{ region }`; en `local`, `{ endpoint, region, credentials }` |
| `createSqsClient` / `createDynamoDbClient` / `createS3Client` / `createEventBridgeClient` | L115 / L119 / L123 / L132 | Consumen `resolveAwsClientOptions` |

Consumidores de los dos resolvers (ninguno puede romperse en modo `local`):

- `backend-pet-tracker/src/aws/aws.module.ts` (`resolveAwsConfigFromConfigService`).
- `backend-pet-tracker/src/aws/run-provisioning.ts` (`resolveAwsConfigFromEnv`).
- `backend-pet-tracker/test/localstack-provisioning.e2e-spec.ts` (`resolveAwsConfigFromEnv`).
- `backend-pet-tracker/test/aws-real-smoke.e2e-spec.ts` y
  `backend-pet-tracker/test/aws-real-ingest.e2e-spec.ts` (`resolveAwsConfigFromEnv`).

## Requisitos funcionales

- **R1**: IF el modo resuelto es `aws` AND `AWS_ENDPOINT_URL` tiene un valor
  cuyo `.trim()` no es cadena vacía, THEN THE SYSTEM SHALL lanzar
  `UnexpectedAwsEndpointError` (clase exportada desde
  `backend-pet-tracker/src/aws/aws-clients.ts`, con `this.name =
  'UnexpectedAwsEndpointError'`) desde la función que resuelve la
  configuración, **antes** de construir ningún cliente AWS y sin ejecutar
  ninguna llamada de red. La guarda es simétrica a `MissingAwsEndpointError`:
  misma clase-error nombrada, mismo punto de llamada (dentro del resolver, no
  en los factories).

- **R2**: WHEN `UnexpectedAwsEndpointError` se lanza, THE SYSTEM SHALL producir
  un mensaje que contenga literalmente las cadenas `AWS_ENDPOINT_URL`,
  `AWS_MODE`, `process.env` y `.env`, de forma que la corrida falle explicando
  la causa (el SDK lee la variable por su cuenta) y la acción correctiva
  (comentar la variable en el `.env` raíz). El texto exacto está fijado en
  [[design]] §D2; los tests SHALL comprobar subcadenas, no el string completo.

- **R3**: WHILE el modo resuelto es `aws` AND `AWS_ENDPOINT_URL` está ausente,
  es cadena vacía o solo espacios, THE SYSTEM SHALL comportarse exactamente
  como hoy: los dos resolvers SHALL devolver `{ mode: 'aws', endpoint: '', … }`
  sin lanzar, y `resolveAwsClientOptions` sobre esa config SHALL cumplir
  `'endpoint' in options === false` y `'credentials' in options === false`.

- **R4**: WHILE el modo resuelto es `local`, THE SYSTEM SHALL no cambiar en
  nada: `resolveAwsConfigFromEnv` SHALL seguir lanzando
  `MissingAwsEndpointError` cuando `AWS_ENDPOINT_URL` falta o está vacía;
  `resolveAwsConfigFromConfigService` SHALL seguir devolviendo `endpoint: ''`
  sin lanzar en ese caso; y con `AWS_ENDPOINT_URL` definida los dos resolvers
  SHALL devolver ese endpoint tal cual. Cuatro de los cinco archivos de test de
  #19 (`src/aws/aws-clients.spec.ts`, `src/aws/aws-env-config.spec.ts`,
  `src/aws/aws.module.spec.ts`, `test/localstack-provisioning.e2e-spec.ts`)
  SHALL seguir verdes **sin una sola línea modificada** (verificable con `git
  diff --name-only` al cerrar la feature). El quinto,
  `src/aws/aws-mode.spec.ts`, SHALL adaptarse al contrato nuevo con el cambio
  mínimo descrito en [[design]] §D10 — y nada más: ningún `describe`/`it`
  añadido, borrado ni renombrado, ninguna aserción debilitada.

  > **Enmienda del 2026-08-10 (gate humano reabierto).** La redacción original
  > exigía los cinco archivos intactos y era **imposible**: `aws-mode.spec.ts`
  > pasa `{ AWS_MODE: 'aws', AWS_ENDPOINT_URL: ENDPOINT }` a los dos resolvers
  > en cinco tests (R1 de #19, casos `'aws'`/`'AWS'`/`' aws '`, L47-52; y R5 de
  > #19, casos `AWS_REGION` `undefined`/`''`, L120-124) — justo la combinación
  > que R1 de esta feature declara ilegal. El borrador verificó §D3 contra
  > `resolveAwsClientOptions`, donde `buildAwsConfig()` efectivamente sigue
  > verde, pero no contra las llamadas a los resolvers del mismo archivo.
  > Codex CLI detectó la contradicción, paró sin inventar excepciones y la
  > documentó en `progress/impl_aws-mode-endpoint-guard.md` (commit `250f37e`).

- **R5**: WHEN se ejerce la guarda de R1, THE SYSTEM SHALL cubrir las **dos**
  vías de resolución de configuración —`resolveAwsConfigFromEnv(env)` y
  `resolveAwsConfigFromConfigService(config)`— con el mismo error y el mismo
  mensaje, de modo que un test parametrizado sobre las dos funciones pase para
  ambas. Ninguna de las dos vía SHALL quedar sin guarda.

- **R6**: IF `backend-pet-tracker/test/aws-real-ingest.e2e-spec.ts` se ejecuta
  con `AWS_MODE=aws` AND `AWS_ENDPOINT_URL` definida (por el `.env` raíz o por
  el entorno), THEN la suite SHALL fallar con el mensaje de R2, sin construir
  ningún cliente, sin enviar ningún mensaje a SQS/EventBridge/DynamoDB y sin
  reportar ningún test en verde; y el archivo SHALL contener un test cuyo
  `describe`/`it` nombre `R6` y afirme que resolver la configuración desde
  `process.env` no lanza — el mismo patrón que el test de
  `assertNoStaticAccessKey` en `test/aws-real-smoke.e2e-spec.ts`. WHILE
  `AWS_MODE` no sea `aws`, la suite SHALL seguir auto-saltándose entera
  (`describe.skip`), sin cambios en ese comportamiento.

- **R7**: WHEN la feature queda cerrada, `docs/verification.md` SHALL contener
  una sección `### Feature 21 — aws-mode-endpoint-guard` que nombre
  `UnexpectedAwsEndpointError` y `AWS_ENDPOINT_URL`, y el paso R21 de la
  sección de la feature 20 SHALL dejar de presentar el procedimiento manual
  (comentar la variable y apagar LocalStack) como única red: SHALL indicar que
  la guarda automática aborta la corrida y que el procedimiento manual sigue
  siendo necesario **solo** para la CLI de CDK (`cdk bootstrap` / `cdk deploy`),
  que no pasa por `aws-clients.ts`. El texto exacto está en [[design]] §D6.

- **R9**: WHEN la feature se implementa, THE SYSTEM SHALL dejar evidencia de
  proceso conforme a C2/C4/C5: (a) el historial de la branch
  `feature/21-aws-mode-endpoint-guard` SHALL mostrar, por cada R-id de R1 a R7,
  al menos un commit con el test en rojo **anterior** al commit con la
  implementación que lo pone en verde —nunca test + implementación + docs en un
  solo commit—; (b) `specs/aws-mode-endpoint-guard/traceability.md` SHALL
  quedar sin ninguna fila "pendiente"; (c)
  `progress/impl_aws-mode-endpoint-guard.md` SHALL registrar la corrida final de
  `./init.sh` con su exit code y el recuento de suites; (d) `./init.sh` SHALL
  terminar con exit code 0.

> **No hay R8.** El borrador proponía documentar el nuevo modo de fallo de
> `AWS_ENDPOINT_URL` en la tabla de variables de `docs/conventions.md`. El gate
> humano lo descartó por ir más allá de los seis criterios de aceptación de
> `feature_list.json` #21. El hueco en la numeración es deliberado: los R-ids no
> se renumeran. `docs/conventions.md` **no se toca** en esta feature.

## Fuera de alcance

- **Modo `local`**: no se toca. Ni su flujo, ni sus tests, ni `MissingAwsEndpointError`.
- `backend-pet-tracker/src/aws/provisioning.ts`: no se modifica. Ni una línea.
- No se crea ningún recurso AWS, no se ejecuta `cdk bootstrap` ni `cdk deploy`,
  no se corre ninguna llamada contra la cuenta real desde un agente.
- **No se borra ni se muta `process.env.AWS_ENDPOINT_URL` desde el código.** La
  guarda aborta; no "arregla" el entorno por detrás (misma decisión D8 de #19
  para las credenciales).
- **No se ataca el otro modo de falso verde** (la suite auto-saltada porque
  `AWS_MODE` no llegó al proceso, p. ej. sintaxis PowerShell bajo Bash). Esa es
  otra feature: aquí la suite sigue saltándose cuando `AWS_MODE` no es `aws`.
- No se añade guarda de endpoint a `resolveAwsClientOptions` ni a los cuatro
  factories: rompería `src/aws/aws-mode.spec.ts`, que construye a propósito
  configs `{ mode: 'aws', endpoint: 'http://localhost:4566' }` para probar R3-R6
  de #19 (decisión D3 de [[design]]).
- No se añade `assertEndpoint` a `resolveAwsConfigFromConfigService` en modo
  `local`: sigue vigente la decisión D5 de la spec de #19.
- No se añade validación de esquema de entorno (`AppConfigModule` sigue sin
  validar).
- No se toca `backend-pet-tracker/test/aws-real-smoke.e2e-spec.ts`: hereda la
  guarda automáticamente por usar `resolveAwsConfigFromEnv`.
- No se toca `infra/` ni la stack CDK.

## Decisiones abiertas

Ninguna. Los tres puntos que podrían haber quedado abiertos están cerrados en
[[design]]: nombre del error (§D1), texto del mensaje (§D2) y punto de llamada
de la guarda (§D3).

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-10) ← gate obligatorio antes de implementar
