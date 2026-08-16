# Implementación — reject-future-positions (#27)

## Estado

**Pausada por la regla STOP de la feature antes de R4.** R1-R3 y R6-R8 están
implementados, verdes y trazados. R4, R5, R9 y el cierre quedan pendientes.
No se editó ningún test existente para forzarlo a pasar.

El inventario de riesgo de `design.md` afirma que todas las posiciones del
spec del consumidor son anteriores a `NOW`. Dos tests existentes contradicen
esa afirmación: construyen 60 y 100 posiciones desde `BASE_TS = NOW - 1 min`
en pasos de 30 s y esperan conservarlas todas. R4 exige pasar `NOW` a
`normalize()`, por lo que solo 13 quedan dentro de `NOW + 5 min`.

## Verificación inicial

Comando:

```text
bash -lc 'PATH="/tmp/pet-tracker-codex-bin:$PATH" ./init.sh'
```

Salida real relevante:

```text
Test Suites: 134 passed, 134 total
Tests:       977 passed, 977 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 2 skipped, 17 passed, 17 of 19 total
Tests:       6 skipped, 260 passed, 266 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

## Evidencia TDD

### R8

Comando rojo:

```text
pnpm -C backend-pet-tracker exec jest src/pipeline/validate-positions.spec.ts --runInBand
```

Salida:

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 18 passed, 20 total
```

Tras añadir la constante, el segundo caso quedó rojo hasta R1, como exige
`tasks.md`:

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 19 passed, 20 total
```

Commits:

```text
e83b891 feat(reject-future-positions): add tolerance constant tests (R8)
d304c71 feat(reject-future-positions): define future timestamp tolerance (R8)
```

### R1-R3

Commits de test anteriores a la implementación:

```text
47d29dc feat(reject-future-positions): add future timestamp rejection tests (R1)
951feb4 feat(reject-future-positions): add tolerance boundary tests (R2)
22d6442 feat(reject-future-positions): preserve clock-free normalization (R3)
```

Comando verde:

```text
pnpm -C backend-pet-tracker exec jest src/pipeline/validate-positions.spec.ts src/pipeline/trips.spec.ts --runInBand
```

Salida:

```text
Test Suites: 2 passed, 2 total
Tests:       51 passed, 51 total
Snapshots:   0 total
Time:        1.297 s, estimated 2 s
Ran all test suites matching src/pipeline/validate-positions.spec.ts|src/pipeline/trips.spec.ts.
```

Commit verde:

```text
f9e6c03 feat(reject-future-positions): reject implausible future positions (R1,R2,R3,R8)
```

### R6

Rojo:

```text
Expected: 1785585600000
Received: 1785672000000
Test Suites: 1 failed, 1 total
Tests:       1 failed, 11 passed, 12 total
```

Verde:

```text
Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
Snapshots:   0 total
```

Commits:

```text
4ae0b89 feat(reject-future-positions): add watermark ceiling tests (R6)
8da6cf9 feat(reject-future-positions): cap watermark at current time (R6)
```

### R7

Rojo:

```text
Expected: "900001", 1785585000000, 1785585600000
Received: "900001", 1785672000000, 1785585600000
Test Suites: 1 failed, 1 total
Tests:       2 failed, 13 passed, 15 total
```

Verde:

```text
Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
Snapshots:   0 total
```

Commits:

```text
c1a8404 feat(reject-future-positions): add poisoned watermark recovery tests (R7)
2719a6b feat(reject-future-positions): recover poisoned watermarks (R7)
```

## Evidencia del bloqueo en R4

Baseline del spec existente antes de R4:

```text
$ pnpm -C backend-pet-tracker exec jest src/workers/positions-consumer.service.spec.ts --runInBand
Test Suites: 1 passed, 1 total
Tests:       27 passed, 27 total
Snapshots:   0 total
Time:        1.716 s, estimated 2 s
Ran all test suites matching src/workers/positions-consumer.service.spec.ts.
```

Código existente conflictivo:

```text
282:   it('parte lotes de mas de 25 items en BatchWrite de <=25', async () => {
283:     const positions = Array.from({ length: 60 }, (_, i) => ({
286:       ts: BASE_TS + i * 30_000,
305:     expect(batchSizes).toEqual([25, 25, 10]);

677: describe('R5 (geofence-eval-full-batch #30): un solo Entry position.updated por mensaje SQS aunque el lote traiga 100 posiciones', () => {
683:     return Array.from({ length: 100 }, (_, index) => ({
686:       ts: BASE_TS + index * 30_000,
730:     expect(detail.positions).toHaveLength(100);
```

Cálculo ejecutado con los valores reales del spec:

```text
$ node -e "const now=Date.parse('2026-08-01T12:00:00.000Z'); const base=now-60000; const tolerance=5*60000; for (const count of [60,100]) { const timestamps=Array.from({length:count},(_,i)=>base+i*30000); const accepted=timestamps.filter(ts=>ts<=now+tolerance); console.log(JSON.stringify({count,maxOffsetMinutes:(timestamps.at(-1)-now)/60000,accepted:accepted.length,discarded:count-accepted.length})); }"
{"count":60,"maxOffsetMinutes":28.5,"accepted":13,"discarded":47}
{"count":100,"maxOffsetMinutes":48.5,"accepted":13,"discarded":87}
```

Conclusión: la implementación literal de R4 cambia necesariamente esos dos
resultados. Mantener los `it` verdes exigiría editar sus timestamps o sus
expectativas, acción prohibida por la regla dura de la feature. Se detuvo el
trabajo antes de añadir o implementar R4.

## `git diff --name-only main...HEAD`

Salida real al detenerse:

```text
backend-pet-tracker/src/pipeline/constants.ts
backend-pet-tracker/src/pipeline/types.ts
backend-pet-tracker/src/pipeline/validate-positions.spec.ts
backend-pet-tracker/src/pipeline/validate-positions.ts
backend-pet-tracker/src/workers/poller.service.spec.ts
backend-pet-tracker/src/workers/poller.service.ts
feature_list.json
progress/current.md
specs/reject-future-positions/design.md
specs/reject-future-positions/requirements.md
specs/reject-future-positions/tasks.md
specs/reject-future-positions/traceability.md
```

Ninguno de los siete archivos prohibidos aparece.

## Historial rojo → verde

```text
e83b891 feat(reject-future-positions): add tolerance constant tests (R8)
d304c71 feat(reject-future-positions): define future timestamp tolerance (R8)
47d29dc feat(reject-future-positions): add future timestamp rejection tests (R1)
951feb4 feat(reject-future-positions): add tolerance boundary tests (R2)
22d6442 feat(reject-future-positions): preserve clock-free normalization (R3)
f9e6c03 feat(reject-future-positions): reject implausible future positions (R1,R2,R3,R8)
50d4d0d feat(reject-future-positions): record validation traceability (R1,R2,R3,R8)
4ae0b89 feat(reject-future-positions): add watermark ceiling tests (R6)
8da6cf9 feat(reject-future-positions): cap watermark at current time (R6)
b5ef5e9 feat(reject-future-positions): record watermark ceiling traceability (R6)
c1a8404 feat(reject-future-positions): add poisoned watermark recovery tests (R7)
2719a6b feat(reject-future-positions): recover poisoned watermarks (R7)
8a450f6 feat(reject-future-positions): record watermark recovery traceability (R7)
```

## Verificaciones no ejecutadas por STOP

No se ejecutaron build, suite unitaria completa, e2e, Docker ni `init.sh` de
cierre después del bloqueo. Tampoco se actualizó `docs/wialon-module.md`: la
feature no está completa y R4/R5 siguen pendientes.
