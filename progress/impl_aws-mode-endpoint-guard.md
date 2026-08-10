# Implementación — aws-mode-endpoint-guard (#21)

## Estado

Implementación iniciada el 2026-08-10 15:59:43 -06:00 en
`feature/21-aws-mode-endpoint-guard`. La feature permanece `in_progress` y no
se marcará `done`; el cierre corresponde al reviewer.

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
  cambio productivo.
- R5: rojo `71d52b6`; implementación detenida por contradicción con R4.

## Bloqueo de spec

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

## Verificación final

Pendiente.
