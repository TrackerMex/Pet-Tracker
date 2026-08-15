# impl: device-provisioning-admin

Fecha: 2026-08-14

Branch: `feature/24-device-provisioning-admin`. Spec aprobada por humano en
`specs/device-provisioning-admin/requirements.md`.

## Resultado

- R1: `provisionDevice(db, wialon, input)` y el comando `provision:device`
  insertan collares reales con flags opcionales, código generado y
  `is_simulated=false`; falta de `--unit-id` termina con error.
- R2: `listUnits()` valida la unidad antes del INSERT; ausencia y errores de
  Wialon no dejan filas nuevas.
- R3: reprovisionar devuelve la fila existente sin regenerar el secreto ni
  llamar otra vez a Wialon; colisiones de otros identificadores propagan
  `23505`.
- R4: `generateActivationCode()` tiene aridad cero y genera `PT-` + 10
  símbolos Crockford desde `randomBytes()`.
- R5-R7: solo existe el CLI interno, rechaza el simulador y coexiste con el
  seed y el claim existentes sin modificarlos.
- R8: `docs/data-model.md` y `docs/wialon-module.md` documentan ambos caminos.

## Evidencia TDD

| Requisito | Rojo | Verde |
|---|---|---|
| R1 | `b613ab5` | `94be544` |
| R2 | `94dbfa6` | `2253495` |
| R3 | `d53804d` | `033cf5d` |
| R4 | `fd2cc24`, `00a3640` | `776f546` |
| R5 | `d940644` | `665ac47` |
| R6 | `922988f` | `94be544` |
| R7 | `244a6eb` | `94be544` |
| R8 | N/A documental | `2f91102` |

## Verificación

- `init.sh`: exit code 0.
- Backend unit: 133 suites, 956 tests verdes.
- Infra: 2 suites, 14 tests verdes.
- E2E: 17 suites, 254 tests verdes; 2 suites/6 tests AWS-real omitidos por su
  gate existente.
- Build, lint y typecheck: verdes.
- `drizzle-kit generate`: `No schema changes, nothing to migrate`.
- Sin diff en controllers, claim (#7), seed, schema/migraciones, poller ni
  integración Wialon compartida (#8).

No se ejecutó el CLI contra Wialon real ni contra hardware; esa corrida queda
para el humano.

La implementación está completa; #24 permanece `in_progress` hasta el
veredicto independiente del `reviewer`.
