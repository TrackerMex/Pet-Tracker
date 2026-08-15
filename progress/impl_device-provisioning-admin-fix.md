# impl: device-provisioning-admin (fix R1 — invocación vía `pnpm run`)
Fecha: 2026-08-14
Branch: `feature/24-device-provisioning-admin`
Modo: fallback al subagente `implementer` (CLAUDE.md §Excepciones — cambio de
una línea, Codex CLI ya cerró su sesión).

## Archivos creados

Ninguno.

## Archivos modificados

- `backend-pet-tracker/scripts/provision-device.ts` — `parseArgs` en `main()`
  ahora recibe `args` explícito con el separador `--` filtrado. Sin ese
  argumento usaba `process.argv.slice(2)`, que incluye el `--` que pnpm
  reenvía literalmente al script; para `parseArgs` ese token marca el fin de
  las opciones y todo lo que sigue pasa a posicional, así que lanzaba
  `ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL`.
- `backend-pet-tracker/test/provision-device.e2e-spec.ts` — un `it` nuevo
  dentro del `describe` de R1 que ya existía. No se creó archivo de tests
  nuevo.
- `specs/device-provisioning-admin/traceability.md` — fila nueva para R1
  (invocación vía `pnpm run`) con los dos hashes.

## Requisitos cubiertos

| Requisito | Test | Commit rojo | Commit verde |
|---|---|---|---|
| R1 (invocación vía `pnpm run`) | `test/provision-device.e2e-spec.ts::R1 (device-provisioning-admin #24): lee --unit-id cuando pnpm reenvia el separador -- literal` | `fda4ec9` | `9833364` |

Dos commits separados según C4 de `CHECKPOINTS.md`: `fda4ec9` toca solo el
`*.e2e-spec.ts`, `9833364` toca solo el script.

Rojo verificado antes del fix, con el error exacto del reporte:

```
● R1 ... › lee --unit-id cuando pnpm reenvia el separador -- literal
  Expected substring: not "ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL"
  Received string: "provision-device failed: TypeError: Unexpected argument
  '--unit-id'. This command does not take positional arguments
    at main (../scripts/provision-device.ts:103:31)
    code: 'ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL'"
Tests: 1 failed, 9 passed, 10 total
```

## Decisiones de diseño

- **Reusar el patrón `spawnSync` que ya vivía en el `describe` de R1** (el test
  de "falla antes de conectar si falta --unit-id") en vez de extraer una
  función de parseo: el bug está en `main()`, así que el test tiene que pasar
  por `main()`. Extraer un helper habría movido el bug fuera del camino que
  falló de verdad.
- **`SIM_MODE=true` y `WIALON_TOKEN=PENDING` en el env del proceso hijo** para
  no tocar Wialon real. `createWialonClient` devuelve el `FakeWialonClient` y
  `assertRealWialonClient` lanza antes de abrir el `Pool` de Postgres, así que
  el test no hace red ni escribe en la base. La aserción
  `stderr` contiene `SimulatedWialonClientError` es justo la prueba de que ya
  parseó `--unit-id`: llegó al guard de R5, dos pasos después del parseo.
  `dotenv` no pisa variables ya presentes en `process.env`, así que el `.env`
  de la raíz no puede revertir ese `SIM_MODE`.
- **Filtrar `--` en vez de hacer `slice` posicional**: pnpm no garantiza la
  posición del separador y el script no acepta posicionales, así que quitar
  todas las apariciones es equivalente y no depende del layout del argv.
- **No se tocó nada más**: cero cambios en `src/modules/devices/`,
  `src/integrations/wialon/`, seeds o controllers. `parseArgs` solo se usa en
  este script en todo el repo (verificado), así que el fix cubre todos los
  callers; no hay scripts hermanos con el mismo bug.

## Output de build

`BUILD_CMD` (`pnpm -C backend-pet-tracker run build && pnpm -C infra run synth`):

```
> nest build && tsc-alias -p tsconfig.build.json
> cdk synth --quiet
82 feature flags are not configured. Run 'cdk flags --unstable=flags' to learn more.
✅ Build exitoso
```

Typecheck (`TYPECHECK_CMD`) verde en backend e infra. Lint (`LINT_CMD`) verde en
backend e infra, sin cambios de `--fix` sobre los archivos tocados.

## Output de tests

`TEST_CMD` (unit):

```
Test Suites: 133 passed, 133 total     (backend)
Tests:       956 passed, 956 total
Test Suites: 2 passed, 2 total         (infra)
Tests:       14 passed, 14 total
✅ Tests pasados
```

Suite objetivo aislada, después del fix:

```
pnpm run test:e2e -- provision-device
Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
Time:        11.198 s
```

`E2E_CMD` completo:

```
Test Suites: 2 failed, 2 skipped, 15 passed, 17 of 19 total
Tests:       5 failed, 6 skipped, 250 passed, 261 total
Time:        343.133 s
FAIL test/alerts-engine.e2e-spec.ts (183.533 s)
FAIL test/ingestion.e2e-spec.ts (12.027 s)
```

Total de tests 261 vs. 260 del baseline de #24 (254 verdes + 6 skipped): el +1
es exactamente el test nuevo.

## init.sh: rojo por entorno, no por este cambio

**`./init.sh` NO queda verde en esta máquina, y el motivo es previo e
independiente del diff.** No lo arreglé porque es estado local del humano y
está fuera del alcance de este fix.

Causa raíz, medida: la cola local `positions-raw` de LocalStack tenía **32,686
mensajes acumulados** al empezar (16,391 tras las corridas de hoy). Sus
mensajes apuntan a filas de `pet_devices` que ya no existen — restos de e2e
que limpian en su `afterAll` y de la corrida con hardware — así que fallan
para siempre:

```
ERROR [PositionsConsumerService] {
  message: 'Failed query: select "id" from "pet_devices" where (...)
            params: 01a001d5-9dca-71f1-aacd-f183c569ad8f,01a00230-...'
}
```

Todo e2e que levanta `AppModule` arranca ese consumer, que se pasa la prueba
entera drenando backlog en vez de dejar avanzar el flujo bajo test. De ahí que
los 5 fallos sean **timeouts**, no aserciones de lógica:

- `alerts-engine`: `Exceeded timeout of 180000 ms` (2 tests)
- `ingestion`: `Exceeded timeout of 5000 ms` (R19)

Y por lo mismo jest no termina aunque ya imprimió el resumen: el consumer queda
como open handle. La primera corrida de `init.sh` se colgó 40 minutos ahí (0.1 s
de CPU en 2 minutos, dos conexiones ociosas al 4566) y hubo que matarla.

Evidencia de que no es mi cambio:

1. `ingestion.e2e-spec.ts` **pasa en aislamiento** (3/3, 9 s) con el fix ya
   aplicado, en cuanto el backlog bajó.
2. `alerts-engine.e2e-spec.ts` **falla igual en aislamiento** (2/3, timeout a
   los 186 s), sin ninguna otra suite compitiendo.
3. Ninguna de las dos suites importa `provision-device` ni `provisionDevice`.
4. El test nuevo no escribe en Postgres ni en SQS: el proceso hijo muere en
   `assertRealWialonClient`, antes del `new Pool`.
5. Durante la primera corrida además estaban vivos el `nest start --watch` y un
   `node dist/src/main` del humano, consumiendo de la misma cola.

Remediación (decisión del humano, yo no la ejecuté):

```
aws --endpoint-url http://localhost:4566 sqs purge-queue \
  --queue-url http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/positions-raw
```

o reiniciar LocalStack. Conviene además apagar el dev server antes de correr
`init.sh`. Vale la pena anotarlo en `docs/` o en la memoria del proyecto: es la
segunda vez que la infra local hace fallar `init.sh` por carrera/estado, no por
regresión.

## Notas para el reviewer

- Verificar que `fda4ec9` toca **solo** `test/provision-device.e2e-spec.ts` y
  `9833364` **solo** `scripts/provision-device.ts` (C4).
- El test depende del guard de R5 (`SimulatedWialonClientError`) como señal de
  "el parseo llegó hasta aquí". Si alguien cambia ese guard, este test hay que
  reescribirlo. Está comentado en el propio test.
- Antes de correr `init.sh`: purgar `positions-raw` y apagar el dev server, o
  se repite el cuelgue de 40 minutos descrito arriba.
- No se ejecutó el CLI contra Wialon real ni contra hardware. La corrida real
  ya la hizo el humano (unidad 401775970, 35 posiciones a DynamoDB); lo único
  roto era la línea de comando de R1.
