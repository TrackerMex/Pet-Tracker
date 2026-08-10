---
feature: "aws-real-credentials"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[aws-real-credentials]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> Orden recomendado: R1 → R2 → R3/R4/R5 → R6 → R7 → R8 → R9 → R10 → R11 → R12.
> R1-R7 comparten archivo de test: `backend-pet-tracker/src/aws/aws-mode.spec.ts`,
> un `describe` por R-id, nombrado `describe('R<n>: …')` (`docs/conventions.md`
> §Tests). Comandos: `pnpm -C backend-pet-tracker test`,
> `pnpm -C backend-pet-tracker run test:e2e`, `./init.sh` al cerrar.

## R1 — `AWS_MODE` resuelve el modo, con default seguro `local`

- [ ] (1) Escribir test que falla para R1 — `src/aws/aws-mode.spec.ts`: tabla
      de casos (`undefined`, `''`, `'  '`, `'local'`, `'LOCAL'`, `'production'`,
      `'aws'`, `'AWS'`, `' aws '`) verificada contra
      `resolveAwsConfigFromEnv({ AWS_MODE, AWS_ENDPOINT_URL: 'http://localhost:4566' })`
      y contra `resolveAwsConfigFromConfigService(mock)`; los 3 últimos casos
      esperan `mode === 'aws'`, el resto `mode === 'local'`
- [ ] (2) Implementación mínima que lo pasa — `AwsMode`, campo `mode` en
      `AwsRuntimeConfig`, `resolveAwsMode` privada (D2), lectura de `AWS_MODE`
      en los dos resolvers
- [ ] (3) Refactor con tests verdes

## R2 — Modo `local` construye exactamente las opciones de hoy

- [ ] (1) Escribir test que falla para R2 — `aws-mode.spec.ts`: con `mode local`,
      `Object.keys(resolveAwsClientOptions(config)).sort()` es
      `['credentials','endpoint','region']` y los valores coinciden con las
      variables de entorno
- [ ] (2) Implementación mínima que lo pasa — `AwsClientOptions` +
      `resolveAwsClientOptions` (D3), los 4 factories pasan a consumirla,
      `credentials()` privada se borra
- [ ] (3) Refactor con tests verdes — confirmar con
      `pnpm -C backend-pet-tracker test src/aws` que `aws-clients.spec.ts`,
      `aws-env-config.spec.ts` y `aws.module.spec.ts` siguen verdes **sin
      haberlos editado** (`git status` limpio para esos 3 archivos)

## R3 — Modo `aws`: los 4 clientes sin endpoint custom

- [ ] (1) Escribir test que falla para R3 — `aws-mode.spec.ts`: `it.each` con
      los 4 factories, `expect(client.config.endpoint).toBeUndefined()` y
      `client.destroy()` al final de cada caso
- [ ] (2) Implementación mínima que lo pasa — rama `aws` de
      `resolveAwsClientOptions` sin `endpoint`
- [ ] (3) Refactor con tests verdes

## R4 — Modo `aws`: sin `credentials` explícitas

- [ ] (1) Escribir test que falla para R4 — `aws-mode.spec.ts`:
      `expect('credentials' in resolveAwsClientOptions(awsConfig)).toBe(false)`.
      Leer D6 de [[design]] antes: `client.config.credentials` es una función en
      los dos modos y no sirve como aserción
- [ ] (2) Implementación mínima que lo pasa — rama `aws` sin `credentials`
- [ ] (3) Refactor con tests verdes

## R5 — Modo `aws`: `region` solo si tiene valor

- [ ] (1) Escribir test que falla para R5 — `aws-mode.spec.ts`: con
      `AWS_REGION` con valor, `options.region` es ese valor; con `AWS_REGION`
      ausente o `''`, `'region' in options` es `false`
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — `forcePathStyle` solo en modo `local`

- [ ] (1) Escribir test que falla para R6 — `aws-mode.spec.ts`:
      `createS3Client(localConfig).config.forcePathStyle === true` y
      `createS3Client(awsConfig).config.forcePathStyle === false`
- [ ] (2) Implementación mínima que lo pasa — spread condicional en
      `createS3Client` (D4)
- [ ] (3) Refactor con tests verdes

## R7 — `MissingAwsEndpointError` solo en modo `local`

- [ ] (1) Escribir test que falla para R7 — `aws-mode.spec.ts`: con
      `AWS_MODE=aws` y sin `AWS_ENDPOINT_URL`, `resolveAwsConfigFromEnv` no
      lanza y devuelve `mode: 'aws'` con `endpoint: ''`; con `AWS_MODE=local`
      (y con `AWS_MODE` ausente) sigue lanzando `MissingAwsEndpointError`
- [ ] (2) Implementación mínima que lo pasa — `assertEndpoint` condicional
      dentro de `resolveAwsConfigFromEnv` (D5), sin tocar
      `resolveAwsConfigFromConfigService`
- [ ] (3) Refactor con tests verdes — `aws-env-config.spec.ts` verde sin editar

## R8 — `runProvisioning` aborta en modo `aws`

- [ ] (1) Escribir test que falla para R8 — nuevo `describe('R8: …')` en
      `src/aws/run-provisioning.spec.ts`, reutilizando `silentLogger()`:
      `runProvisioning({ AWS_MODE: 'aws', AWS_REGION: 'us-east-1' }, logger)`
      devuelve `1` y `logger.error` recibe un mensaje que matchea `/AWS_MODE/`
- [ ] (2) Implementación mínima que lo pasa — guarda de 3 líneas antes de
      construir los clientes (D7)
- [ ] (3) Refactor con tests verdes — el test debe terminar en milisegundos:
      si tarda, la guarda está mal colocada y hay red de por medio

## R9 — Los dos guardas estáticos siguen verdes sin tocarlos

- [ ] (1) Escribir test que falla para R9 — no se escribe test nuevo: los
      guardas ya existen (`no-hardcoded-credentials.spec.ts`,
      `no-real-aws-endpoint.spec.ts`). Ejecutarlos tras el primer commit de
      implementación y confirmar que el código nuevo no introduce literales
- [ ] (2) Implementación mínima que lo pasa — región siempre desde `config`,
      nunca literal; ningún dominio de AWS en comentarios ni mensajes
- [ ] (3) Refactor con tests verdes — `git diff --name-only` no incluye esos
      dos archivos

## R10 — `AWS_MODE` documentada en `.env.example` y `docs/conventions.md`

- [ ] (1) Escribir test que falla para R10 — nuevo
      `src/aws/aws-mode-docs.spec.ts` siguiendo el patrón de
      `src/aws/status-doc.spec.ts` (`join(__dirname,'..','..','..', …)`):
      `.env.example` matchea `/^AWS_MODE=local$/m` y `docs/conventions.md`
      contiene una fila de tabla con `` `AWS_MODE` ``
- [ ] (2) Implementación mínima que lo pasa — pegar los dos bloques de texto
      que [[design]] §"Texto exacto de la documentación" ya deja escritos
- [ ] (3) Refactor con tests verdes

## R11 — Prueba de humo contra la cuenta real, auto-saltable

- [ ] (1) Escribir test que falla para R11 — nuevo
      `test/aws-real-smoke.e2e-spec.ts` con el patrón
      `(runSmoke ? describe : describe.skip)` de D9, un `it` que falla si
      `process.env.AWS_ACCESS_KEY_ID` tiene valor, y un `it` que envía
      `ListQueuesCommand` con `createSqsClient(resolveAwsConfigFromEnv(process.env))`
      y espera respuesta sin error (timeout 30000, `client.destroy()` en
      `afterAll`)
- [ ] (2) Implementación mínima que lo pasa — ya cubierta por R1-R7; verificar
      que `pnpm -C backend-pet-tracker run test:e2e` sin `AWS_MODE=aws` reporta
      la suite como *skipped*
- [ ] (3) Refactor con tests verdes — correrla de verdad: `aws login`,
      comentar `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` en el `.env` raíz,
      `AWS_MODE=aws` y ejecutar el e2e. Si la cuenta no está disponible en esta
      sesión, **no se marca la casilla**: se documenta el bloqueo en
      `progress/impl_aws-real-credentials.md` y se reporta al leader

## R12 — Procedimiento de humo documentado y corrida registrada

- [ ] (1) Escribir test que falla para R12 — extender
      `src/aws/aws-mode-docs.spec.ts` con una aserción de que
      `docs/verification.md` contiene la sección
      `Feature 19 — aws-real-credentials` y el literal `AWS_MODE=aws`
- [ ] (2) Implementación mínima que lo pasa — sección en `docs/verification.md`
      con comando exacto, el paso de comentar las credenciales dummy del `.env`
      y el resultado esperado
- [ ] (3) Refactor con tests verdes — volcar en
      `progress/impl_aws-real-credentials.md` el output redactado de la corrida
      de R11 (sin ARNs de cuenta, sin credenciales)

## Cierre

- [ ] `./init.sh` verde
- [ ] `traceability.md` sin filas "pendiente"
- [ ] `git diff --name-only` no contiene ninguno de los archivos de la lista
      "No se tocan" de [[design]]
- [ ] Branch `feature/19-aws-real-credentials` + PR (`docs/conventions.md`
      §Branches y Pull Requests). Ningún agente mergea
