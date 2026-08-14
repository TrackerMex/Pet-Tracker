# impl: weight-single-source-of-truth

Fecha: 2026-08-14

Branch: `feature/22-weight-single-source-of-truth`. Spec aprobada por humano
en `specs/weight-single-source-of-truth/requirements.md`.

## Resultado

- R1: `POST /v1/pets` descarta `weightKg`; el use-case y el INSERT ya no
  escriben `current_weight_kg`.
- R2: `PATCH /v1/pets/:petId` descarta `weightKg`; si queda solo ese campo,
  conserva el no-op sin UPDATE ni auditoría.
- R3/R4: `backfillWeights(db)` crea el historial faltante, omite pesos nulos,
  historial existente y mascotas sin owner activo, es idempotente y no toca
  `pets.current_weight_kg` ni `updated_at`.
- R5: `docs/data-model.md` documenta el escritor único y el backfill.
- R6: el contrato de lectura conserva las mismas 24 claves y
  `currentWeightKg: number | null`.

## Evidencia TDD

| Requisito | Rojo | Verde |
|---|---|---|
| R1 | `0f45ac4` | `13af2dc` |
| R2 | `bb5cf21` | `cf6f302` |
| R3/R4 | `dbd4fae` | `79121d2` |
| R5 | N/A documental | `95d00c9` |
| R6 | N/A regresión | `86040d5` |

Rojos observados: R1 falló en Zod y en el INSERT capturado; R2 falló el
contrato de tipo y la rama antigua del use-case; R3/R4 fallaron al no existir
todavía `scripts/backfill-weights.ts`.

## Verificación

- `./init.sh`: exit code 0 con Postgres y LocalStack activos.
- Backend unit: 132 suites, 955 tests verdes.
- Infra: 2 suites, 14 tests verdes.
- E2E: 16 suites verdes, 245 tests verdes; 2 suites/6 tests AWS-real omitidos
  por su gate existente.
- Build, lint y typecheck: verdes.
- `pnpm run backfill:weights`: dos ejecuciones locales consecutivas, ambas
  `0 filas insertadas` después del e2e.
- `pet-profile-response.mapper.spec.ts`: 6/6; `pets.e2e-spec.ts`: 20/20;
  bloque R12 de `devices.e2e-spec.ts`: verde.

## Alcance

- Sin cambios en `WeightDrizzleRepository`, `CreateWeightUseCase` ni
  `WeightsController` de `health-weights` (#15).
- Sin cambios en `pet.entity.ts`, `pet-profile-response.mapper.ts`, su spec
  ni `PROFILE_KEYS` de devices.
- Sin migración, dependencia o variable de entorno nueva.
- Solo se aprovisionó LocalStack local con `provision:local`; no se ejecutó
  `cdk deploy` ni se accedió a AWS real.
