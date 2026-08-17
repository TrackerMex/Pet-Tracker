---
feature: "test-dev-resource-isolation"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[test-dev-resource-isolation]]

| Requisito | Test (archivo::nombre) | Archivo implementado | Commit (hash + mensaje) |
|---|---|---|---|
| R1 | `backend-pet-tracker/src/aws/resource-names.spec.ts::R1: los diez nombres con sufijo test` | `backend-pet-tracker/src/aws/resource-names.ts` | rojo: `0b537dd test(test-dev-resource-isolation): add failing resource name cases (R1)`; verde: `1a1f339 feat(test-dev-resource-isolation): build suffixed resource names (R1)` |
| R2 | `backend-pet-tracker/src/aws/resource-names.spec.ts::R2: el sufijo se deriva de NODE_ENV en modo local` | `backend-pet-tracker/src/aws/resource-names.ts`, `backend-pet-tracker/src/aws/aws-clients.ts` | rojo: `8337672 test(test-dev-resource-isolation): add failing suffix resolution cases (R2)`; verde: `bd6c36c feat(test-dev-resource-isolation): resolve local test suffix (R2)` |
| R3 | `backend-pet-tracker/src/aws/resource-names.spec.ts::R3: AWS_MODE=aws fuerza sufijo vacio` | `backend-pet-tracker/src/aws/resource-names.ts` | rojo: `54fc211 test(test-dev-resource-isolation): add failing aws mode name cases (R3)`; verde: `da2d0cd feat(test-dev-resource-isolation): keep aws names unsuffixed (R3)` |
| R4 | `backend-pet-tracker/src/aws/aws.module.spec.ts::R4: AWS_RESOURCE_NAMES resuelve nombres sufijados` + specs colocadas de los 8 consumidores | `backend-pet-tracker/src/aws/aws.constants.ts`, `backend-pet-tracker/src/aws/aws.module.ts` + los 8 consumidores de [[design]] §Archivos afectados | rojo: `4621333 test(test-dev-resource-isolation): add failing resource names provider test (R4)`; token: `c9c8e26`; consumidores: `342395b`, `64bd74c`, `b48ae35`, `6009569`, `873c00d`, `a9bbff7`, `5dbe2a3`, `b690727` |
| R5 | `backend-pet-tracker/src/aws/resource-names.spec.ts::R5: constants.ts sigue siendo literales const` | `backend-pet-tracker/src/aws/constants.ts` (**sin cambios** — guarda de regresión) | verde por excepción aprobada: `057c637 test(test-dev-resource-isolation): add green constants regression guard (R5)` |
| R6 | `backend-pet-tracker/src/aws/run-provisioning.spec.ts::R6: runProvisioning crea los dos juegos de recursos` | `backend-pet-tracker/src/aws/run-provisioning.ts`, `backend-pet-tracker/src/aws/provisioning.ts` | rojo: `050576d test(test-dev-resource-isolation): add failing dual provisioning test (R6)`; verde: `20d5d4c feat(test-dev-resource-isolation): provision dev and test resources (R6)` |
| R7 | `backend-pet-tracker/test/localstack-provisioning.e2e-spec.ts::R7: la doble corrida deja ambos juegos utilizables` | sin código propio (verifica el bucle de R6) — **guarda de regresión, nace verde** | verde por excepción aprobada: `0394f37 test(test-dev-resource-isolation): add approved green dual-run guard (R7)` |
| R8 | `backend-pet-tracker/src/aws/run-provisioning.spec.ts::R8: runProvisioning aborta en modo aws` | `backend-pet-tracker/src/aws/run-provisioning.ts` (**sin cambios** — guarda de regresión) | verde por excepción aprobada: `c194ce3 test(test-dev-resource-isolation): strengthen green aws provisioning guard (R8)` |
| R9 | `backend-pet-tracker/test/resource-isolation.e2e-spec.ts::R9: las colas de dev y test tienen URLs distintas` | las 7 suites e2e + `backend-pet-tracker/test/localstack-provisioning.e2e-spec.ts` + `backend-pet-tracker/test/aws-real-ingest.e2e-spec.ts` + `backend-pet-tracker/src/aws/cdk-dev-stack-docs.spec.ts` (solo L19) | rojo: `6c8c1b2 test(test-dev-resource-isolation): add failing e2e resource isolation case (R9)`; suites: `0bad511`, `0ddbda4`, `a454807`, `8afca45`, `3c53a24`, `0b733c8`, `6003490`; provisioning: `0394f37`; AWS real: `026e744`; verde: 9 suites / 129 tests |
| R10 | pendiente — previsto `backend-pet-tracker/test/resource-isolation.e2e-spec.ts::R10: la ingesta no mueve las colas de desarrollo` | sin código propio (verifica R4+R6+R9) | pendiente |
| R11 | pendiente — previsto `backend-pet-tracker/src/aws/resource-names-guard.spec.ts::R11: nadie importa los diez literales de nombre` | `backend-pet-tracker/src/aws/resource-names-guard.spec.ts` | pendiente |
| R12 | pendiente — previsto `backend-pet-tracker/src/aws/resource-names-guard.spec.ts::R12: el stack CDK no importa la resolucion de sufijo` | `infra/` (**sin cambios** — evidencia: `git diff --name-only`) | pendiente |
| R13 | pendiente — previsto `backend-pet-tracker/src/aws/resource-names-guard.spec.ts::R13: verification.md documenta el recuento manual` | `docs/verification.md` | pendiente |
| R14 | pendiente — sin test; evidencia: `git log --oneline` de `feature/28-test-dev-resource-isolation`, esta tabla completa y `progress/impl_test-dev-resource-isolation.md` con `./init.sh` exit 0 | `progress/impl_test-dev-resource-isolation.md` | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(test-dev-resource-isolation): <desc> (R1,R2)`, con el
commit del test en rojo (`test(test-dev-resource-isolation): …`) **antes** que el
de la implementación — C4 exige historial rojo→verde por R-id.

**Excepción declarada:** R5, R7, R8 y R12 son guardas de regresión y **nacen
verdes** (no hay rojo posible: afirman que algo que hoy funciona sigue
funcionando). Su commit de test debe decirlo explícitamente en el mensaje. Las
otras diez filas exigen rojo→verde.

**R7 se añadió a la excepción durante la implementación** (gate humano del
2026-08-17, tras el reporte de Codex en
`progress/impl_test-dev-resource-isolation.md` §Contradicción de spec — R7).
Razón: el orden de [[tasks]] pone **R6 antes que R7**. R6 crea el bucle sobre
los dos sufijos; R7 solo asevera que la segunda corrida sigue devolviendo 0.
Con R6 verde el fallo es inalcanzable, y adelantar R7 no daría un rojo propio
sino el de R6 con otro nombre (*"la cola sufijada no existe"*). Además la
idempotencia de `provision:local` no es conducta nueva de #28: la fija #2
("segunda corrida no falla"), y R7 solo extiende esa garantía al segundo juego.

El test **sí** ejerce la doble corrida, no es un test vacío: el `beforeAll` de
`localstack-provisioning.e2e-spec.ts` ya llama a `runProvisioning`, y el caso
de R7 lo llama otra vez antes de comprobar los veinte recursos. Es un defecto
de la spec —esta lista nació corta—, no del código ni del implementador, que
paró en vez de fabricar un rojo falso.

El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
