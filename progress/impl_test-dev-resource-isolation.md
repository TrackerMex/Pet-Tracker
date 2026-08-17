# Implementación — test-dev-resource-isolation

- Branch: `feature/28-test-dev-resource-isolation`
- Inicio: 2026-08-17
- Baseline: `./init.sh` exit 0 — 136 suites unitarias / 1000 tests, 2 suites infra / 14 tests, 18 suites e2e / 292 tests; 2 suites AWS omitidas.

## Decisiones

- `constants.ts`, `infra/**` y `test/jest-e2e.json` quedan sin cambios según el diseño aprobado.
- `AWS_MODE=aws` se resuelve antes que `NODE_ENV` y siempre usa nombres desnudos.

## Contradicción de spec — R7

Después de implementar R6, el test e2e exigido por R7 nació verde: la doble
corrida devolvió 0 y los veinte recursos quedaron utilizables. Comando:

```text
pnpm -C backend-pet-tracker run test:e2e --runInBand test/localstack-provisioning.e2e-spec.ts
Test Suites: 1 passed, 1 total
Tests: 11 passed, 11 total
```

El trabajo se detuvo sin fabricar un fallo. El gate humano del 2026-08-17
aprobó R7 como guarda verde en `03bb649`; el test se commiteó en `0394f37`.

## Evidencia pendiente

- Corrida final de `./init.sh`.
- Procedimiento manual de R13 por el humano.
