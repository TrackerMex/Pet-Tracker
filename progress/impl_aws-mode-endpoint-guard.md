# Implementación — aws-mode-endpoint-guard (#21)

## Estado

Implementación iniciada el 2026-08-10 15:59:43 -06:00 en
`feature/21-aws-mode-endpoint-guard`. La feature permanece `in_progress` y no
se marcará `done`; el cierre corresponde al reviewer.

Implementación terminada el 2026-08-10 16:22:52 -06:00. Lista para revisión.

## Restricciones

- Sin llamadas ni creación de recursos en AWS real.
- Sin `cdk bootstrap` ni `cdk deploy`.
- Solo se modifican los archivos canónicos de `design.md`.
- TDD por requisito con commits separados de test e implementación.

## Verificación base

- `./init.sh` ejecutado mediante Git Bash porque el `bash.exe` de WSL no
  resuelve el Node.js instalado en Windows.
- Exit code: 0.
- Backend unit: 121 suites / 879 tests pasados.
- Infra unit: 2 suites / 14 tests pasados.
- E2E: 13 suites pasadas, 2 omitidas / 181 tests pasados, 5 omitidos.
- Build, synth, lint y typecheck: verdes.

## TDD por requisito

- R1: rojo `4d12b0b` → verde `1b0be58`.
- R2: rojo `2db156b` → verde `99de872`.
- R3: rojo `9d6bd3f` → verde `f19cff6`.
- R4: regresión verde inicial `c9027d2`; `tasks.md` R4(2) prohíbe forzar un
  cambio productivo. Gate reabierto en `ddfa9c8`; fixtures adaptados en
  `9fb6a3c` según D10.
- R5: rojo `71d52b6` → verde `4eb9dca`.
- R6: canario `852a403`; la corrida contaminada falló antes de construir
  clientes.
- R7: rojo `4857274` → verde `4b4142f`.

### Commit de cierre por requisito

| R-id | Commit de cierre |
|---|---|
| R1 | `1b0be58 feat(aws-mode-endpoint-guard): reject unexpected env endpoint (R1)` |
| R2 | `99de872 feat(aws-mode-endpoint-guard): explain rejected endpoint configuration (R2)` |
| R3 | `f19cff6 feat(aws-mode-endpoint-guard): normalize absent aws endpoint (R3)` |
| R4 | `9fb6a3c test(aws-mode-endpoint-guard): adapt #19 mode fixtures to the endpoint guard (R4)` |
| R5 | `4eb9dca feat(aws-mode-endpoint-guard): guard ConfigService endpoint resolution (R5)` |
| R6 | `852a403 test(aws-mode-endpoint-guard): expose contaminated real-ingest runs (R6)` |
| R7 | `4b4142f docs(aws-mode-endpoint-guard): document automatic endpoint guard (R7)` |
| R9 | `8708b88 docs(aws-mode-endpoint-guard): record final verification (R9)` |

## Bloqueo de spec (resuelto)

La corrida conjunta de la suite nueva y los cinco archivos que R4 declara
intocables mostró 1 suite fallida, 4 pasadas y 5 tests fallidos de 40. Los
cinco fallos están en `src/aws/aws-mode.spec.ts`:

- Tres casos de R1 de #19 pasan `AWS_MODE` como `aws`, `AWS` y ` aws ` junto
  con `AWS_ENDPOINT_URL=http://localhost:4566`, y esperan resolver el modo sin
  lanzar.
- Dos casos de R5 de #19 pasan `AWS_MODE=aws` y el mismo endpoint al resolver
  la región, y esperan continuar sin lanzar.

Eso contradice R1 de #21, que exige lanzar para toda combinación de modo
resuelto `aws` y endpoint no vacío, y R4 de #21, que exige que
`aws-mode.spec.ts` siga verde sin modificar una línea. El propio `design.md`
solo consideró los casos que construyen `AwsRuntimeConfig` directamente y no
registró estas cinco llamadas al resolver.

No se añadió ninguna excepción por `NODE_ENV`, caller o valor de fixture: ese
workaround haría que la guarda dejara de cumplir R1. No se modificó ningún
archivo prohibido ni se realizó ninguna llamada de red.

El humano reabrió el gate y enmendó R4 en `ddfa9c8`. D10 autorizó exactamente
dos cambios en `aws-mode.spec.ts`; quedaron aplicados en `9fb6a3c`. Los otros
cuatro archivos de test de #19 siguen sin modificaciones y verdes.

## Verificación segura de R6

Comando ejecutado con variables de proceso efímeras y credenciales estáticas
vacías:

```powershell
$env:AWS_MODE='aws'
$env:AWS_ENDPOINT_URL='http://localhost:4566'
$env:AWS_ACCESS_KEY_ID=''
$env:AWS_SECRET_ACCESS_KEY=''
pnpm -C backend-pet-tracker exec jest --config ./test/jest-e2e.json --runInBand test/aws-real-ingest.e2e-spec.ts
```

Resultado esperado y obtenido: exit 1; 1 suite fallida, 4 tests fallidos, 0
tests verdes. Los cuatro fallaron desde `beforeAll` con
`UnexpectedAwsEndpointError` en `resolveAwsConfigFromEnv`, antes de las líneas
que construyen SQS, EventBridge y DynamoDB. No hubo llamadas de red.

Sin `AWS_MODE=aws`, la misma suite conservó el auto-skip: exit 0; 1 suite y 4
tests omitidos.

## Verificación final

- `./init.sh` ejecutado mediante Git Bash.
- Exit code: 0.
- Backend unit: 123 suites / 889 tests pasados.
- Infra unit: 2 suites / 14 tests pasados.
- E2E: 13 suites pasadas, 2 omitidas / 181 tests pasados, 6 omitidos.
- Build, synth, lint y typecheck: verdes.
- La suite `aws-real-ingest.e2e-spec.ts` aporta 4 de los 6 tests omitidos en
  modo local, conservando su auto-skip.
- Los cuatro tests de #19 aún intocables están ausentes del diff y verdes.
- `docs/conventions.md`, `.env.example`, los módulos AWS excluidos e `infra/`
  están ausentes del diff.
- No se ejecutó `cdk bootstrap`, `cdk deploy` ni ninguna llamada contra AWS
  real. El único synth fue el incluido obligatoriamente por `./init.sh`.
