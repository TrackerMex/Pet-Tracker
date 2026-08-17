# Implementación — test-dev-resource-isolation

- Branch: `feature/28-test-dev-resource-isolation`
- Inicio: 2026-08-17
- Baseline: `./init.sh` exit 0 — 136 suites unitarias / 1000 tests, 2 suites infra / 14 tests, 18 suites e2e / 292 tests; 2 suites AWS omitidas.

## Decisiones

- `constants.ts`, `infra/**` y `test/jest-e2e.json` quedan sin cambios según el diseño aprobado.
- `AWS_MODE=aws` se resuelve antes que `NODE_ENV` y siempre usa nombres desnudos.

## Evidencia pendiente

- Corrida final de `./init.sh`.
- Procedimiento manual de R13 por el humano.
