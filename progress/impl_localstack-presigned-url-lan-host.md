# Implementación — #57 `localstack-presigned-url-lan-host`

- Fecha: 2026-09-01
- Branch: `feature/57-localstack-presigned-url-lan-host`
- HEAD inicial del implementer: `58d19c3`
- Spec aprobada: `specs/localstack-presigned-url-lan-host/requirements.md`

## Baseline

Antes de modificar archivos se ejecutó `./init.sh` desde la raíz. Terminó con
exit 0 y `✅ Todo verde. Listo para trabajar.`: backend 156 suites / 1198
tests, infraestructura 2 suites / 14 tests, móvil 51 suites / 569 tests,
backend e2e 23 suites / 349 tests pasados (3 suites / 8 tests saltados por
sus gates), lint y typecheck verdes.

## TDD R1–R3 — rojo

Commit de test: `f3fa40a test(aws): require presign endpoint LAN en modo local (R1-R3)`.

Comando:

```bash
pnpm --filter backend-pet-tracker test -- src/aws/presign-endpoint.spec.ts --runInBand
```

Salida completa (exit 1 esperado), antes de escribir producción:

```text
> backend-pet-tracker@0.0.1 test /home/claude/sites/Pet-Tracker/backend-pet-tracker
> jest -- src/aws/presign-endpoint.spec.ts --runInBand

(node:3006719) Warning: NodeVersionSupportWarning: The AWS SDK for JavaScript (v3)
versions published after the first week of January 2027
will require node >=22. You are running node v20.20.2.

To continue receiving updates to AWS services, bug fixes,
and security updates please upgrade to node >=22.

More information can be found at: https://a.co/c895JFp
(Use `node --trace-warnings ...` to show where the warning was created)
FAIL src/aws/presign-endpoint.spec.ts
  ● R1: modo local firma S3 con AWS_PRESIGN_ENDPOINT_URL › construye S3 con el endpoint LAN recortado y conserva su configuración local

    expect(received).toBe(expected) // Object.is equality

    Expected: "http://192.168.7.42:4566"
    Received: undefined

      44 |     const s3 = createS3Client(config);
      45 |
    > 46 |     expect(config.presignEndpoint).toBe(PRESIGN_ENDPOINT);
         |                                    ^
      47 |     expect(s3.config.endpoint).toBeDefined();
      48 |     const endpoint = await s3.config.endpoint!();
      49 |     expect(endpoint.hostname).toBe('192.168.7.42');

      at Object.<anonymous> (aws/presign-endpoint.spec.ts:46:36)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 9 passed, 10 total
Snapshots:   0 total
Time:        0.822 s
Ran all test suites matching src/aws/presign-endpoint.spec.ts|--runInBand.
/home/claude/sites/Pet-Tracker/backend-pet-tracker:
ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL backend-pet-tracker@0.0.1 test: `jest -- src/aws/presign-endpoint.spec.ts --runInBand`
Exit status 1
```

## TDD R4 — rojo

Commit de test: `2e2dca0 test(media): URL prefirmada firmada con host LAN (R4)`.

Comando:

```bash
pnpm --filter backend-pet-tracker test -- src/modules/media/infrastructure/photo-storage.presign-host.spec.ts --runInBand
```

Salida completa (exit 1 esperado), antes de escribir producción:

```text
> backend-pet-tracker@0.0.1 test /home/claude/sites/Pet-Tracker/backend-pet-tracker
> jest -- src/modules/media/infrastructure/photo-storage.presign-host.spec.ts --runInBand

(node:3007364) Warning: NodeVersionSupportWarning: The AWS SDK for JavaScript (v3)
versions published after the first week of January 2027
will require node >=22. You are running node v20.20.2.

To continue receiving updates to AWS services, bug fixes,
and security updates please upgrade to node >=22.

More information can be found at: https://a.co/c895JFp
(Use `node --trace-warnings ...` to show where the warning was created)
FAIL src/modules/media/infrastructure/photo-storage.presign-host.spec.ts
  ● R4: la URL prefirmada nace firmada con el host LAN › firma la URL de subida con el host y path de LocalStack accesibles por LAN

    expect(received).toBe(expected) // Object.is equality

    Expected: "192.168.7.42:4566"
    Received: "localhost:4566"

      27 |       const url = new URL(await createUrl());
      28 |
    > 29 |       expect(url.host).toBe('192.168.7.42:4566');
         |                        ^
      30 |       expect(url.pathname).toBe(`/${names.mediaBucket}/${KEY}`);
      31 |       expect(url.searchParams.get('X-Amz-Signature')).toBeTruthy();
      32 |       expect(url.searchParams.get('X-Amz-SignedHeaders')).toContain('host');

      at modules/media/infrastructure/photo-storage.presign-host.spec.ts:29:24

  ● R4: la URL prefirmada nace firmada con el host LAN › firma la URL de descarga con el host y path de LocalStack accesibles por LAN

    expect(received).toBe(expected) // Object.is equality

    Expected: "192.168.7.42:4566"
    Received: "localhost:4566"

      27 |       const url = new URL(await createUrl());
      28 |
    > 29 |       expect(url.host).toBe('192.168.7.42:4566');
         |                        ^
      30 |       expect(url.pathname).toBe(`/${names.mediaBucket}/${KEY}`);
      31 |       expect(url.searchParams.get('X-Amz-Signature')).toBeTruthy();
      32 |       expect(url.searchParams.get('X-Amz-SignedHeaders')).toContain('host');

      at modules/media/infrastructure/photo-storage.presign-host.spec.ts:29:24

Test Suites: 1 failed, 1 total
Tests:       2 failed, 2 total
Snapshots:   0 total
Time:        0.838 s
Ran all test suites matching src/modules/media/infrastructure/photo-storage.presign-host.spec.ts|--runInBand.
/home/claude/sites/Pet-Tracker/backend-pet-tracker:
ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL backend-pet-tracker@0.0.1 test: `jest -- src/modules/media/infrastructure/photo-storage.presign-host.spec.ts --runInBand`
Exit status 1
```

## TDD R1–R4 — verde

Commit de producción: `9f100a0 fix(aws): firma URLs prefirmadas de S3 con AWS_PRESIGN_ENDPOINT_URL (R1-R4)`.

Comando dirigido tras aplicar D1–D2:

```bash
pnpm --filter backend-pet-tracker test -- src/aws/presign-endpoint.spec.ts src/modules/media/infrastructure/photo-storage.presign-host.spec.ts --runInBand
```

Salida completa (exit 0):

```text
> backend-pet-tracker@0.0.1 test /home/claude/sites/Pet-Tracker/backend-pet-tracker
> jest -- src/aws/presign-endpoint.spec.ts src/modules/media/infrastructure/photo-storage.presign-host.spec.ts --runInBand

(node:3007895) Warning: NodeVersionSupportWarning: The AWS SDK for JavaScript (v3)
versions published after the first week of January 2027
will require node >=22. You are running node v20.20.2.

To continue receiving updates to AWS services, bug fixes,
and security updates please upgrade to node >=22.

More information can be found at: https://a.co/c895JFp
(Use `node --trace-warnings ...` to show where the warning was created)
(node:3007895) Warning: NodeVersionSupportWarning: The AWS SDK for JavaScript (v3)
versions published after the first week of January 2027
will require node >=22. You are running node v20.20.2.

To continue receiving updates to AWS services, bug fixes,
and security updates please upgrade to node >=22.

More information can be found at: https://a.co/c895JFp

Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        1.163 s
Ran all test suites matching src/aws/presign-endpoint.spec.ts|src/modules/media/infrastructure/photo-storage.presign-host.spec.ts|--runInBand.
```

La suite backend completa también salió 0: 158/158 suites y 1210/1210 tests,
sin snapshots. `pnpm --filter backend-pet-tracker build` salió 0. Los mensajes
de error/log durante la suite son casos negativos ya existentes y todos sus
tests pasaron.

El diff de producción se limita a `src/aws/aws-clients.ts`: campo opcional,
lectura mediante `ConfigService` y override en la rama local de
`createS3Client`. `resolveAwsConfigFromEnv`, `resolveAwsClientOptions`,
`assertEndpoint`, `assertNoEndpoint` y los errores nombrados no tienen líneas
de diff.

## Verificación R5

Commit documental: `b2cff5b docs(aws): document AWS_PRESIGN_ENDPOINT_URL y smoke #57 (R5)`.

### Comandos finales

| Comando | Exit | Resultado |
|---|---:|---|
| `pnpm --filter backend-pet-tracker test` | 0 | 158/158 suites, 1210/1210 tests, 0 snapshots. |
| `./init.sh` (primera corrida final) | 1 | Backend #57 verde (158/1210), infra verde (2/14); falló únicamente el flake preexistente #53 en `mobile-pet-tracker/src/screens/add-pet/index.test.tsx`: el mock de ImagePicker devolvió `undefined` en R7. Móvil: 50 suites pasaron, 1 falló; 568 tests pasaron, 1 falló. |
| `bun run test -- src/screens/add-pet/index.test.tsx --runInBand --silent` | 0 | Reproducción dirigida sin cambios: 1/1 suite y 7/7 tests verdes. |
| `./init.sh` (repetición final) | 0 | `✅ Todo verde`: backend 158/158 suites y 1210/1210 tests; infra 2/2 suites y 14/14 tests; móvil 51/51 suites, 569/569 tests y 1 snapshot; e2e 23 suites/349 tests pasados, 3 suites/8 tests saltados por gates existentes; lint y typecheck verdes. |

La primera falla coincide exactamente con la feature pendiente #53
`mobile-jest-mock-hygiene`, ya registrada en `feature_list.json` y
`progress/current.md`. No se modificó ni se intentó corregir ningún archivo
móvil; la repetición completa salió verde.

### Allowlist de la branch

La referencia local `main` estaba atrasada en `e5d98e7`. Como era ancestro de
`origin/main`, se avanzó de forma fast-forward a `af2cc42` sin checkout ni
cambios en el working tree, para que el comando exigido compare contra el
`main` actual. El merge-base de `main` y esta branch es `e8c5511`.

Salida completa de `git diff --stat main...HEAD` tras el commit de evidencia:

```text
 .env.example                                       |  10 +
 .gitignore                                         |   1 +
 backend-pet-tracker/src/aws/aws-clients.ts         |  20 +-
 .../src/aws/presign-endpoint.spec.ts               | 156 +++++++++++
 .../photo-storage.presign-host.spec.ts             |  35 +++
 docs/conventions.md                                |   1 +
 docs/verification.md                               |  55 ++++
 feature_list.json                                  |   4 +-
 progress/current.md                                |  31 +++
 .../handoff_localstack-presigned-url-lan-host.md   |  60 ++++
 progress/impl_localstack-presigned-url-lan-host.md | 304 +++++++++++++++++++++
 specs/localstack-presigned-url-lan-host/design.md  | 217 +++++++++++++++
 .../requirements.md                                | 271 ++++++++++++++++++
 specs/localstack-presigned-url-lan-host/tasks.md   |  96 +++++++
 .../traceability.md                                |  31 +++
 15 files changed, 1289 insertions(+), 3 deletions(-)
```

Ese diff de la branch completa contiene dos rutas fuera de la allowlist que
**ya estaban en el HEAD inicial `58d19c3` antes de este implementer**:
`.gitignore` (commit `58d19c3`, limpieza de symlinks locales) y
`progress/current.md` (handoff del leader en `61e8c9c`). También incluye los
ficheros de spec, handoff y transición de estado creados por el leader antes
del handoff; esos sí están permitidos por R5. No se reescribieron commits del
leader ni se tocaron esas dos rutas prohibidas para ocultar la preexistencia.

Para aislar el trabajo autorizado del implementer, salida completa de
`git diff --stat 58d19c3..HEAD`:

```text
 .env.example                                       |  10 +
 backend-pet-tracker/src/aws/aws-clients.ts         |  20 +-
 .../src/aws/presign-endpoint.spec.ts               | 156 +++++++++++
 .../photo-storage.presign-host.spec.ts             |  35 +++
 docs/conventions.md                                |   1 +
 docs/verification.md                               |  55 ++++
 progress/impl_localstack-presigned-url-lan-host.md | 304 +++++++++++++++++++++
 .../traceability.md                                |  10 +-
 8 files changed, 585 insertions(+), 6 deletions(-)
```

`git diff --name-status 58d19c3..HEAD`:

```text
M	.env.example
M	backend-pet-tracker/src/aws/aws-clients.ts
A	backend-pet-tracker/src/aws/presign-endpoint.spec.ts
A	backend-pet-tracker/src/modules/media/infrastructure/photo-storage.presign-host.spec.ts
M	docs/conventions.md
M	docs/verification.md
A	progress/impl_localstack-presigned-url-lan-host.md
M	specs/localstack-presigned-url-lan-host/traceability.md
```

Las ocho rutas están dentro de la allowlist de R5. El comando negativo
siguiente salió 0 y no imprimió salida:

```bash
git diff --exit-code 58d19c3..HEAD -- \
  backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts \
  backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.spec.ts \
  backend-pet-tracker/src/aws/aws.module.ts \
  backend-pet-tracker/src/aws/provisioning.ts \
  backend-pet-tracker/src/aws/run-provisioning.ts \
  backend-pet-tracker/scripts/provision-local.ts \
  docker-compose.yml mobile-pet-tracker infra \
  progress/current.md feature_list.json
```

Por tanto, desde el HEAD inicial hay cero líneas de diff en el adaptador y su
spec, `aws.module.ts`, todo provisioning, Docker, infra, la app móvil,
`progress/current.md` y `feature_list.json`. `git diff --unified=0 58d19c3..HEAD
-- backend-pet-tracker/src/aws/aws-clients.ts` muestra únicamente los tres
hunks D1–D2; `resolveAwsConfigFromEnv`, `resolveAwsClientOptions`,
`assertEndpoint`, `assertNoEndpoint`, `MissingAwsEndpointError` y
`UnexpectedAwsEndpointError` quedaron textualmente intactos. `git diff
--check` salió 0.

No se ejecutó `cdk deploy`, no se crearon recursos AWS reales y no hubo push.

## Resultado del smoke R6

**Pendiente del humano.** El implementer no ejecuta ni cierra este gate. Debe
seguir `docs/verification.md` §Feature 57 y confirmar por separado: host LAN
en la URL de API, `curl` GET exit 0, subida y carga en el dispositivo físico,
y logcat sin `ConnectException` hacia `localhost/127.0.0.1:4566`.
