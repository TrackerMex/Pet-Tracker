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

## Contradicción de spec — R10

Después de completar R4, R6 y R9, el test exigido por R10 nació verde, como el
propio `tasks.md` anticipa, pero R10 no está en la lista de excepciones a C4 de
`traceability.md`. El test verifica el recuento total de las tres colas de
desarrollo, movimiento no vacío de `positions-raw-test` y `ItemCount` estable
en la tabla de desarrollo. Comando:

```text
pnpm exec jest --config ./test/jest-e2e.json --runInBand test/resource-isolation.e2e-spec.ts
Test Suites: 1 passed, 1 total
Tests: 3 passed, 3 total
```

El trabajo se detuvo sin fabricar un fallo. El gate humano del 2026-08-17
aprobó R10 como guarda verde en `c74b031`; el test se commiteó en `6adf304`.

## Contradicción de spec — R11

La guarda exigida por R11 nació verde después de completar las migraciones de
R4 y R9: el escaneo exacto de `src/**` y `test/**` no encontró importadores de
los diez nombres fuera de la lista blanca de D8. `tasks.md` anticipa que los
infractores deberían ser cero, pero R11 no está en la lista de excepciones a
C4 de `traceability.md`. Comando:

```text
pnpm exec jest --runInBand src/aws/resource-names-guard.spec.ts
Test Suites: 1 passed, 1 total
Tests: 1 passed, 1 total
```

El trabajo se detuvo sin fabricar un infractor. El gate humano del 2026-08-17
aprobó R11 como guarda verde en `bfd572f`, condicionado a una aserción
anti-vacío de más de 100 archivos; la guarda se commiteó en `a26ecf2`.

## Evidencia pendiente

- Corrida final de `./init.sh`.
- Procedimiento manual de R13 por el humano.

## Evidencia R12

- Guarda de fuente: 1 suite / 2 tests verdes (`resource-names-guard.spec.ts`).
- Infra: 2 suites / 14 tests verdes.
- `git diff --name-only <merge-base>..HEAD -- infra` no devolvió rutas: `infra/`
  permanece sin cambios.
