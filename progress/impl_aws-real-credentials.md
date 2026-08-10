# Implementación — aws-real-credentials (#19)

## Resumen

- Se añadió `AWS_MODE` con fallback seguro a `local`; solo el valor `aws`
  normalizado activa el modo real.
- Los cuatro clientes conservan endpoint y credenciales estáticas en local.
  En modo `aws` omiten endpoint y credenciales explícitas; la región también
  se omite si está vacía.
- S3 usa `forcePathStyle` únicamente en local.
- El provisioning local aborta con exit code 1 antes de construir clientes si
  detecta `AWS_MODE=aws`.
- Se documentó `AWS_MODE` y el procedimiento de humo de solo lectura.

## Cobertura por requisito

| R-id | Implementación | Test |
|---|---|---|
| R1 | `AwsMode`, campo `mode` y resolución exact-match en ambos resolvers | `src/aws/aws-mode.spec.ts::R1: AWS_MODE resuelve el modo con default local` |
| R2 | `resolveAwsClientOptions` conserva las tres opciones locales y alimenta los cuatro factories | `src/aws/aws-mode.spec.ts::R2: modo local construye las opciones actuales`; compatibilidad en `aws-clients.spec.ts`, `aws-env-config.spec.ts`, `aws.module.spec.ts` |
| R3 | La rama `aws` omite `endpoint` para SQS, DynamoDB, S3 y EventBridge | `src/aws/aws-mode.spec.ts::R3: modo aws construye los 4 clientes sin endpoint` |
| R4 | La rama `aws` no incluye la clave `credentials` | `src/aws/aws-mode.spec.ts::R4: modo aws no pasa credentials explicitas` |
| R5 | La rama `aws` incluye `region` solo cuando no es cadena vacía | `src/aws/aws-mode.spec.ts::R5: modo aws pasa region solo si tiene valor` |
| R6 | `forcePathStyle: true` se aplica solo en modo local | `src/aws/aws-mode.spec.ts::R6: forcePathStyle solo en modo local` |
| R7 | `MissingAwsEndpointError` queda condicionado al modo local en el resolver de entorno | `src/aws/aws-mode.spec.ts::R7: MissingAwsEndpointError solo en modo local` |
| R8 | `runProvisioning` rechaza modo `aws` antes de cualquier factory | `src/aws/run-provisioning.spec.ts::R8: runProvisioning aborta en modo aws` |
| R9 | No se añadieron regiones, access keys ni endpoints públicos hardcodeados | Guardas preexistentes `no-hardcoded-credentials.spec.ts::R3` y `no-real-aws-endpoint.spec.ts::R15`, sin modificar |
| R10 | `AWS_MODE=local` y explicación añadidos a `.env.example` y `docs/conventions.md` | `src/aws/aws-mode-docs.spec.ts::R10: AWS_MODE documentada en .env.example y conventions` |
| R11 | Suite de humo SQS `ListQueues` auto-saltable; falla antes de red si existe `AWS_ACCESS_KEY_ID` | `test/aws-real-smoke.e2e-spec.ts::R11: llamada de solo lectura con credenciales de sesion` |
| R12 | Procedimiento exacto añadido a `docs/verification.md` | `src/aws/aws-mode-docs.spec.ts::R12: verification.md documenta la prueba de humo` y este reporte |

## Verificación ejecutada

- Baseline inicial: `init.sh` verde; 117 suites / 843 tests. E2E saltados por
  Postgres 5432 no disponible.
- Suites unitarias AWS: 14 suites / 56 tests verdes.
- Suite R11 con `AWS_MODE=local`: 1 suite y 2 tests saltados, sin red.
- `init.sh` final: verde; build, 119 suites / 869 tests, lint y typecheck
  pasaron. E2E generales saltados por Postgres 5432 no disponible.

## R11 — corrida real contra la cuenta (ejecutada por el humano)

Fecha: 2026-08-09. Sesión abierta con `aws login` (usuario IAM de desarrollo,
región `us-east-1`). Identidad y número de cuenta omitidos a propósito.

Procedimiento seguido, el de `docs/verification.md` §"Feature 19":
credenciales dummy de LocalStack comentadas en el `.env` raíz antes de correr,
y restauradas justo después (el `.env` quedó byte-idéntico al original,
verificado con `diff` contra una copia previa).

```
$ AWS_MODE=aws pnpm -C backend-pet-tracker run test:e2e -- --runInBand test/aws-real-smoke.e2e-spec.ts

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Time:        1.517 s
```

Sin `skipped`: la suite se ejecutó de verdad contra AWS. La única llamada
remota fue `ListQueues`; no se creó ni modificó ningún recurso, y la cuenta no
tiene todavía las colas del proyecto (eso es la feature #20).

Esto cierra R11 y la segunda mitad de R12.

## Notas de cierre

- El comando que estaba documentado en `docs/verification.md` omitía el `--`
  antes de `--runInBand`; con esa forma pnpm no reenvía los flags a jest. La
  documentación quedó corregida con la forma verificada arriba.
- Nada que corregir en el código: el reviewer aprobó R1-R10 con infraestructura
  real (ver `progress/review_aws-real-credentials.md`).
