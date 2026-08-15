# impl: claim-activation-code-only

Fecha: 2026-08-15

Branch: `feature/26-claim-activation-code-only`. Spec aprobada por humano en
`specs/claim-activation-code-only/requirements.md`.

## Resultado

- R1/R3: `ClaimDeviceSchema` solo acepta `petId` y `activationCode`
  obligatorio; las claves viejas se descartan y `toDeviceIdentifier()` busca
  siempre por `activationCode`.
- R2: `imei`, `esn` y `serialNumber` solos responden `400` sin asignación,
  cambio de estado ni auditoría; el mismo device sigue reclamable por código.
- R4/R5: `DEVICE_IDENTIFIER_FIELDS` desapareció y el repositorio conserva las
  búsquedas internas por los cuatro identificadores mediante la unión literal.
- R6/R7: los tests heredados de #7 usan `activationCode` para el claim sin
  borrar casos ni cambiar `CLAIM_KEYS`, las respuestas `esn` o el seed.
- R8: schema y modelo de datos documentan `activation_code` como credencial
  única; no hubo cambios de DDL ni migraciones.

## Evidencia TDD

| Requisito | Rojo / prueba | Verde / implementación |
|---|---|---|
| R1 | `740a0d4` | `cd33883` |
| R2 | `8c5948a`, `ee429be` | `cd33883` (implementación previa de R1, según orden de `tasks.md`) |
| R3 | `5841d71` | `a81e01f` |
| R4 | `86d918b` (prueba de preservación) | `7456f83` |
| R5 | N/A, requisito de ausencia/tipo | `7456f83` |
| R6/R7 | `f758129` | `cd33883` |
| R8 | N/A, documental | `a9f62c0` |

## Commits

- `740a0d4` — `test(claim-activation-code-only): require activation code in claim schema (R1)`
- `cd33883` — `feat(claim-activation-code-only): require activation code in claim schema (R1)`
- `5841d71` — `test(claim-activation-code-only): expect activation code lookup (R3)`
- `a81e01f` — `feat(claim-activation-code-only): always lookup activation code (R3)`
- `7456f83` — `refactor(claim-activation-code-only): separate repository identifiers from claim policy (R5)`
- `8c5948a` — `test(claim-activation-code-only): prove legacy identifiers cannot claim (R2)`
- `ee429be` — `test(claim-activation-code-only): prove extra identifiers are ignored (R2)`
- `86d918b` — `test(claim-activation-code-only): preserve internal identifier lookup (R4)`
- `f758129` — `test(claim-activation-code-only): update claim regressions for activation code (R6,R7)`
- `a9f62c0` — `docs(claim-activation-code-only): document activation code credential (R8)`
- `4e54939` — `style(claim-activation-code-only): apply project formatting`

## Verificación

- `init.sh`: exit code 0 con Postgres `5432` y LocalStack `4566` publicados.
- Backend unit: 133 suites, 956 tests verdes.
- Infra: 2 suites, 14 tests verdes.
- E2E: 17 suites, 260 tests verdes; 2 suites/6 tests AWS-real omitidos por su
  gate existente. `devices.e2e-spec.ts`: 26/26 verdes.
- Build, lint y typecheck: verdes.
- `DEVICE_IDENTIFIER_FIELDS`: cero ocurrencias en `src` y `test`.
- Los cinco archivos prohibidos, incluido `claim-device.use-case.ts`, no
  aparecen en el diff.
- Trazabilidad sin filas pendientes; bloques de test en los tres archivos de
  D5: 63 antes, 70 después.

No se crearon recursos AWS reales ni se ejecutó `cdk deploy`.

La implementación está completa; #26 permanece `in_progress` hasta el
veredicto independiente del `reviewer`.
