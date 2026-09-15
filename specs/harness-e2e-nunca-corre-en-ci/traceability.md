---
feature: "harness-e2e-nunca-corre-en-ci"
status: approved   # aprobada por humano en 0f47c176 (gate de requirements.md)
tags: [harness, spec, ci]
---

# Trazabilidad — [[harness-e2e-nunca-corre-en-ci]]

Commit base: `48e4130d`
(`Merge pull request #132 from TrackerMex/docs/72-tercer-avistamiento`).

Todos los tests viven en el mismo fichero nuevo, `init-e2e-gate.test.mjs`
(raíz del repo), un `describe` por R-id, con el id y el `#96` en el título —
mismo patrón que `env-drift.test.mjs` e `init-color.test.mjs`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `init-e2e-gate.test.mjs::R1 (harness-e2e-nunca-corre-en-ci #96): CI levanta la infra antes de init.sh` | rojo: `ae21880a` `test(ci-e2e): require infra before init.sh (R1)`; verde: `64a0ecc0` `feat(ci-e2e): start infra before init.sh (R1)` |
| R2 | `init-e2e-gate.test.mjs::R2 (harness-e2e-nunca-corre-en-ci #96): el workflow fija AWS_MODE local y nunca toca AWS real` | rojo: `ba934c99` `test(ci-e2e): forbid real AWS in CI (R2)`; verde: `a306d2e3` `feat(ci-e2e): pin CI to LocalStack (R2)` |
| R3 | `init-e2e-gate.test.mjs::R3 (harness-e2e-nunca-corre-en-ci #96): los puertos se derivan del .env` | rojo: `4a13f00a` `test(ci-e2e): derive probe targets from env (R3)`; verde: `c33995e7` `feat(ci-e2e): derive probe targets from env (R3)` |
| R4 | `init-e2e-gate.test.mjs::R4 (harness-e2e-nunca-corre-en-ci #96): la infra caida aborta init.sh con codigo 1` | rojo: `cc5f2936` `test(ci-e2e): require hard infra failure (R4)`; verde: `18188a7e` `feat(ci-e2e): fail when infra is unavailable (R4)` |
| R5 | `init-e2e-gate.test.mjs::R5 (harness-e2e-nunca-corre-en-ci #96): el fallo nombra host, puerto y clave de origen` | rojo: `fd380f3c` `test(ci-e2e): require actionable infra error (R5)`; verde: `cb618641` `feat(ci-e2e): report failed infra source (R5)` |
| R6 | `init-e2e-gate.test.mjs::R6 (harness-e2e-nunca-corre-en-ci #96): migraciones y provisioning antes de los e2e` | rojo: `9fa459fe` `test(ci-e2e): require setup before e2e (R6)`; verde: `437557a4` `feat(ci-e2e): prepare infra before e2e (R6)` |
| R7 | `init-e2e-gate.test.mjs::R7 (harness-e2e-nunca-corre-en-ci #96): la suite entra en TEST_CMD y en el mapa del repo` | rojo: `8d8eacfb` `test(ci-e2e): require harness gate wiring (R7)`; verde: `b75e4602` `feat(ci-e2e): wire harness gate test (R7)` |
| R8 | `init-e2e-gate.test.mjs::R8 (harness-e2e-nunca-corre-en-ci #96): ningun comentario describe ya el agujero` | rojo: `1ea1fbd1` `test(ci-e2e): reject silent-skip comments (R8)`; verde: `719b539a` `feat(ci-e2e): document enforced gate (R8)` |
| R9 | `init-e2e-gate.test.mjs::R9 (harness-e2e-nunca-corre-en-ci #96): docs/verification.md documenta el gate` | rojo: `f6d82df7` `test(ci-e2e): require gate runbook (R9)`; verde: `9c6a813e` `feat(ci-e2e): document human gate checks (R9)` |
| G1 | **gate humano** — corrida de CI verde del PR, con el resumen de jest e2e y la igualdad de [[requirements]] §"Cómo se mide el criterio 1" | pendiente (URL de la corrida en `progress/impl_harness-e2e-nunca-corre-en-ci.md`) |
| G2 | **gate humano** — rojo deliberado en `test/96-ci-red-probe`, PR en borrador cerrado sin mergear | pendiente (URL de la corrida roja + línea del fallo en `progress/impl_harness-e2e-nunca-corre-en-ci.md`) |

## Enmienda E1 — candado completo de `AWS_MODE`

| Caso | Test | Evidencia y commit |
|---|---|---|
| R2/E1-a | `init-e2e-gate.test.mjs::R2` rechaza `run: AWS_MODE=aws bash ./init.sh` | copia desechable: exit 1 por `doesNotMatch`; `abc0ac32` `test(ci-e2e): cover all AWS_MODE forms (R2)` |
| R2/E1-b | `init-e2e-gate.test.mjs::R2` exige exactamente una clave `AWS_MODE:` | copia desechable con un segundo `AWS_MODE: "aws"`: exit 1, `2 !== 1`; `abc0ac32` `test(ci-e2e): cover all AWS_MODE forms (R2)` |

No hay commit `feat` para E1: el `ci.yml` real ya cumplía ambas condiciones y
la corrida de control terminó con exit 0. Las mutaciones solo existieron en
copias temporales del árbol; los hashes históricos de R1-R9 no se reescribieron.

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(ci-e2e): <desc> (R1,R2)`; el commit rojo previo va
como `test(ci-e2e): <desc> (R1)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

**G1 y G2 no los cierra el reviewer.** El criterio de aceptación 2 exige un rojo
real observado en una corrida, no una inspección del YAML; ninguna IA puede
firmarlo. El reviewer verifica R1-R9 y comprueba que las dos filas de gate
traen su URL y su evidencia anotadas por el humano — si no las traen, la feature
**no** pasa a `done`.

**No rebasees esta rama después de rellenar la tabla.** Un rebase reescribe los
hashes y deja cada fila apuntando a un commit que ya no existe; si aun así hace
falta, hay que reapuntarlos y verificar con `git merge-base --is-ancestor`.
