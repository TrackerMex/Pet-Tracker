---
feature: "aws-real-credentials"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[aws-real-credentials]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] y [[../../docs/architecture|architecture]].
>
> Fuente: `feature_list.json` #19 (6 criterios de aceptación). Toda la
> superficie de cambio vive en `backend-pet-tracker/src/aws/aws-clients.ts`
> más su documentación de entorno. Depende de `localstack-provisioning` (#2),
> que creó los cuatro factories y `MissingAwsEndpointError`.
>
> **Esta spec la implementa un agente sin acceso a la conversación que la
> originó.** Todo lo decidible está decidido aquí y en [[design]]: no quedan
> preguntas abiertas. Nombres de símbolos y rutas son literales, no ejemplos.

## Contexto mínimo (estado actual, verificado)

`backend-pet-tracker/src/aws/aws-clients.ts` exporta hoy:

| Símbolo | Línea (hoy) | Qué hace |
|---|---|---|
| `AwsRuntimeConfig` | L7 | `{ endpoint, region, accessKeyId, secretAccessKey }`, los 4 `string` requeridos |
| `MissingAwsEndpointError` | L19 | Error si falta `AWS_ENDPOINT_URL` |
| `assertEndpoint()` (privada) | L31 | Lanza `MissingAwsEndpointError` si el endpoint es vacío |
| `resolveAwsConfigFromEnv(env)` | L46 | Lee `process.env`; **siempre** llama a `assertEndpoint` |
| `resolveAwsConfigFromConfigService(config)` | L64 | Lee `ConfigService`; **nunca** llama a `assertEndpoint` (default `''`) |
| `credentials()` (privada) | L75 | Devuelve el par estático |
| `createSqsClient` / `createDynamoDbClient` / `createS3Client` / `createEventBridgeClient` | L85 / L93 / L101 / L112 | Siempre `endpoint` + `region` + `credentials`; S3 añade `forcePathStyle: true` |

Consumidores actuales de esos símbolos (ninguno puede romperse):

- `backend-pet-tracker/src/aws/aws.module.ts` — provee los 4 clientes por token.
- `backend-pet-tracker/src/aws/run-provisioning.ts` — resuelve config, crea los 4 clientes, usa `config.endpoint` en el mensaje de error.
- `backend-pet-tracker/test/localstack-provisioning.e2e-spec.ts` (L66) — `resolveAwsConfigFromEnv(process.env)`.
- Tests que quedan intactos: `src/aws/aws-clients.spec.ts`, `src/aws/aws-env-config.spec.ts`, `src/aws/aws.module.spec.ts`, `src/aws/no-hardcoded-credentials.spec.ts`, `src/aws/no-real-aws-endpoint.spec.ts`.

## Requisitos funcionales

- **R1**: WHEN `resolveAwsConfigFromEnv(env)` o
  `resolveAwsConfigFromConfigService(config)` resuelven la configuración, THE
  SYSTEM SHALL devolver un `AwsRuntimeConfig` con un campo `mode: AwsMode` cuyo
  valor es `'aws'` **si y solo si** el valor de `AWS_MODE`, tras
  `.trim().toLowerCase()`, es exactamente `aws`; en cualquier otro caso
  (variable ausente, cadena vacía, `local`, `LOCAL`, `production`, o cualquier
  otro literal) SHALL devolver `mode: 'local'`. El default seguro es `local`:
  un typo nunca puede dirigir tráfico a la cuenta AWS real.

- **R2**: WHILE `config.mode === 'local'`, THE SYSTEM SHALL construir los
  cuatro clientes con exactamente las mismas opciones que hoy —
  `endpoint = AWS_ENDPOINT_URL`, `region = AWS_REGION` y
  `credentials = { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY }`—
  de forma que `resolveAwsClientOptions(config)` devuelva un objeto con
  exactamente esas tres claves, y `src/aws/aws-clients.spec.ts`,
  `src/aws/aws-env-config.spec.ts` y `src/aws/aws.module.spec.ts` sigan verdes
  **sin ninguna modificación en esos tres archivos** (verificable con
  `git diff --name-only` al cerrar la feature).

- **R3**: WHILE `config.mode === 'aws'`, THE SYSTEM SHALL construir los cuatro
  clientes sin endpoint custom, de modo que para los cuatro se cumpla
  `client.config.endpoint === undefined`.

- **R4**: WHILE `config.mode === 'aws'`, THE SYSTEM SHALL no pasar credenciales
  explícitas a ningún cliente: `resolveAwsClientOptions(config)` SHALL cumplir
  `'credentials' in options === false`, dejando que el SDK v3 resuelva por su
  cadena de credenciales por defecto (las de `aws login` son de sesión y rotan,
  no un par fijo).

- **R5**: WHILE `config.mode === 'aws'` AND `AWS_REGION` tiene valor no vacío,
  THE SYSTEM SHALL incluir `region` con ese valor en las opciones del cliente;
  IF `AWS_REGION` está ausente o vacía THEN SHALL omitir la clave `region`
  (`'region' in options === false`) para que el SDK la resuelva por su cadena,
  y en ningún caso SHALL pasar `region: ''`.

- **R6**: WHILE `config.mode === 'local'`, el cliente S3 SHALL cumplir
  `client.config.forcePathStyle === true`; WHILE `config.mode === 'aws'`, el
  cliente S3 SHALL construirse sin esa opción, de modo que
  `client.config.forcePathStyle === false` (valor por defecto que el SDK
  resuelve cuando no se pasa; comprobado con `@aws-sdk/client-s3` 3.1098.0).

- **R7**: IF `config.mode === 'local'` AND `AWS_ENDPOINT_URL` está ausente o
  vacía THEN `resolveAwsConfigFromEnv` SHALL lanzar `MissingAwsEndpointError`
  con el mensaje actual (que nombra `AWS_ENDPOINT_URL`); IF
  `config.mode === 'aws'` THEN `resolveAwsConfigFromEnv` SHALL no lanzar aunque
  `AWS_ENDPOINT_URL` falte, y SHALL devolver `{ mode: 'aws', endpoint: '', … }`.

- **R8**: IF `runProvisioning(env, logger)` resuelve una configuración con
  `mode === 'aws'` THEN THE SYSTEM SHALL abortar antes de construir ningún
  cliente, registrar por `logger.error` un mensaje que contenga la cadena
  `AWS_MODE` y devolver exit code `1`, sin ejecutar ninguna llamada de red.
  El provisioning de este proyecto solo apunta a LocalStack; crear recursos en
  la cuenta real es la feature #20.

- **R9**: WHEN se ejecutan `src/aws/no-hardcoded-credentials.spec.ts` y
  `src/aws/no-real-aws-endpoint.spec.ts` sobre el código resultante, THE SYSTEM
  SHALL pasar ambos sin modificar esos dos archivos: ningún `.ts` no-spec de
  `backend-pet-tracker/src/aws/` ni de `backend-pet-tracker/scripts/` contiene
  un literal de región AWS entrecomillado (el patrón exacto está en
  `no-hardcoded-credentials.spec.ts` L25), un access key con forma `AKIA…`, ni
  el literal del dominio público de AWS que vigila `no-real-aws-endpoint.spec.ts`.
  En modo `aws` ese dominio lo construye el SDK en runtime desde su ruleset, no
  aparece como literal en nuestro código: los dos guardas siguen siendo válidos
  tal cual y no hay que relajarlos.

- **R10**: WHEN la feature queda cerrada, THE SYSTEM SHALL documentar `AWS_MODE`
  en los dos sitios que exige `AGENTS.md` §4: una línea `AWS_MODE=local` con
  comentario explicativo en `.env.example` (raíz del repo) y una fila `AWS_MODE`
  en la tabla "Variables de entorno" de `docs/conventions.md`.

- **R11**: WHEN se ejecuta `pnpm -C backend-pet-tracker run test:e2e` con
  `AWS_MODE=aws` y una sesión válida de `aws login`, THE SYSTEM SHALL ejecutar
  `backend-pet-tracker/test/aws-real-smoke.e2e-spec.ts`, que construye el
  cliente SQS con `createSqsClient(resolveAwsConfigFromEnv(process.env))` y
  envía un `ListQueuesCommand` (solo lectura, no crea nada), obteniendo
  respuesta sin error; WHILE `AWS_MODE` no sea `aws`, esa suite SHALL saltarse
  entera (`describe.skip`) para no romper CI ni `./init.sh`; IF `AWS_MODE=aws`
  AND `process.env.AWS_ACCESS_KEY_ID` tiene valor THEN la suite SHALL fallar con
  un mensaje que nombre `AWS_ACCESS_KEY_ID`, porque la cadena por defecto del
  SDK prioriza las variables de entorno sobre la sesión de `aws login` y el
  `.env` de desarrollo trae el par dummy de LocalStack.

- **R12**: WHEN la feature queda cerrada, THE SYSTEM SHALL documentar el
  procedimiento exacto de la prueba de humo de R11 en `docs/verification.md`
  (sección "Feature 19 — aws-real-credentials"), incluyendo el comando, el
  requisito de comentar `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` en el `.env`
  raíz y el resultado esperado; y SHALL dejar registrada en
  `progress/impl_aws-real-credentials.md` la corrida real contra la cuenta (con
  el output redactado, sin ARNs de cuenta ni credenciales).

## Fuera de alcance

- `backend-pet-tracker/src/aws/provisioning.ts` no se modifica. Ni una línea.
- No se crea ningún recurso en AWS real. La única llamada contra la cuenta real
  es la lectura de R11 (`ListQueuesCommand`).
- No se escribe CDK ni CloudFormation: eso es la feature #20.
- No se añade validación de esquema de entorno (`AppConfigModule` no valida hoy
  y sigue sin validar).
- `resolveAwsConfigFromConfigService` **no** gana la comprobación de
  `assertEndpoint`: hoy no la tiene y añadirla cambiaría el arranque de
  `AwsModule` en escenarios no pedidos (decisión D5 de [[design]]).
- No se migra ningún consumidor (`aws.module.ts`, readers Dynamo, adapter S3,
  workers) a una API nueva: siguen recibiendo los mismos clientes por los
  mismos tokens.
- No se toca `scripts/provision-local.ts`.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
