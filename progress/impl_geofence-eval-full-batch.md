# impl: geofence-eval-full-batch

Fecha: 2026-08-15

Branch: `feature/30-geofence-eval-full-batch`. Spec aprobada por humano en
`specs/geofence-eval-full-batch/requirements.md`.

## Resultado

- R1-R2: `evaluate()` congela por identidad el estado ante `suspect_jump`; el
  guard sha256 quedó recalculado con BOM fuera y CRLF normalizado a LF.
- R3-R6: `position.updated` v2 conserva `position`, añade el lote ordenado en
  `positions[]`, sigue emitiendo un solo `Entry` y el schema acepta v1/v2.
- R7-R11: el alerts-engine ordena y pliega el lote en memoria, usa el `ts` de
  cada cruce, conserva el guard monotónico y escribe el estado una sola vez
  cuando no hay transiciones.

## Evidencia TDD

Comando usado para cada suite roja/verde:

```text
pnpm -C backend-pet-tracker test -- --runInBand <spec>
```

Salidas literales de las corridas rojas:

| Requisito | Salida | Commit rojo | Commit verde |
|---|---|---|---|
| R1 | `Tests: 3 failed, 20 passed, 23 total` | `033fdcd` | `bad02af` |
| R2 | `Tests: 2 failed, 2 passed, 4 total` | `bad02af` (R1 rompe los hashes) | `7080113`; hash final `a15e991` |
| R3 | `Tests: 1 failed, 23 passed, 24 total` | `59075e6` | `3219407` |
| R4 | `Tests: 2 failed, 23 passed, 25 total` | `bb52775` | `3219407` |
| R5 | `Tests: 3 failed, 24 passed, 27 total` | `a2919f0` | `3219407` |
| R6 | `Tests: 1 failed, 3 passed, 4 total` | `6a68633` | `c8f1b35` |
| R7 | `Tests: 2 failed, 30 passed, 32 total` | `312804c` | `13a65dd` |
| R8 | `Tests: 2 failed, 33 passed, 35 total` | `a37fe41` | `9dc7f9a` |
| R9 | `Tests: 1 failed, 36 passed, 37 total` | `10bc6a6` | `1ba9256` |
| R10 | `Tests: 32 skipped, 1 passed, 33 total` (regresión verde previa a R7) | `39e7ff8` | fallback `13a65dd` |
| R11 | `Tests: 1 failed, 37 passed, 38 total` | `9e1e2e9` | `8f00ce5` |

Corrida conjunta final de las cinco suites tocadas:

```text
Test Suites: 5 passed, 5 total
Tests:       96 passed, 96 total
Snapshots:   0 total
Time:        3.453 s
```

## SHA-256 de R2

Comando exacto ejecutado desde `backend-pet-tracker/`:

```text
node -e "const{createHash}=require('node:crypto');const{readFileSync}=require('node:fs');for(const f of ['geofence-eval.ts','geofence-eval.spec.ts']){const r=readFileSync('src/pipeline/'+f,'utf8');const c=(r.charCodeAt(0)===0xfeff?r.slice(1):r).replace(/\r\n/g,'\n');console.log(f,createHash('sha256').update(c).digest('hex'));}"
```

Salida real final:

```text
geofence-eval.ts d430f100cb41ad2f8ea8c2fc661939404d9a45f072a15e874a8f510c7b924914
geofence-eval.spec.ts eaaa93e58951592ca8cbebbda3a3ecf5d377e6a30d2fb5dd78d96491bba6d8a7
```

## Docker local

```text
> docker compose up -d
 Container pet-tracker-postgres Running
 Container pet-tracker-localstack Running

> docker port pet-tracker-postgres
5432/tcp -> 0.0.0.0:5432
5432/tcp -> [::]:5432

> docker port pet-tracker-localstack
4566/tcp -> 0.0.0.0:4566
4566/tcp -> [::]:4566
```

LocalStack se provisionó con el script local idempotente del repositorio:

```text
> pnpm -C backend-pet-tracker run provision:local
> backend-pet-tracker@0.0.1 provision:local C:\Users\alex\Documents\sites\pet-tracker\backend-pet-tracker
> ts-node -r tsconfig-paths/register scripts/provision-local.ts
```

No se ejecutó `cdk bootstrap`, `cdk deploy` ni ningún comando contra AWS real.

## Verificación final

```text
> pnpm -C backend-pet-tracker run build
> backend-pet-tracker@0.0.1 build C:\Users\alex\Documents\sites\pet-tracker\backend-pet-tracker
> nest build && tsc-alias -p tsconfig.build.json

Exit code: 0
```

```text
> pnpm -C backend-pet-tracker test
Test Suites: 134 passed, 134 total
Tests:       977 passed, 977 total
Snapshots:   0 total
Time:        8.176 s
Ran all test suites.
```

```text
> pnpm -C backend-pet-tracker run test:e2e
Test Suites: 2 skipped, 17 passed, 17 of 19 total
Tests:       6 skipped, 260 passed, 266 total
Snapshots:   0 total
Time:        84.475 s
Ran all test suites.
```

Las dos suites/seis tests omitidos son los guards existentes de AWS real; los
puertos 5432/4566 estaban publicados y los e2e locales sí se ejecutaron.

Salida real de la corrida final de `./init.sh` (Git Bash):

```text
✅ Build exitoso
Test Suites: 134 passed, 134 total
Tests:       977 passed, 977 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
✅ Tests pasados
Test Suites: 2 skipped, 17 passed, 17 of 19 total
Tests:       6 skipped, 260 passed, 266 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

## Commits rojo → verde

```text
033fdcd feat(geofence-eval-full-batch): add suspect jump regression test (R1)
bad02af feat(geofence-eval-full-batch): ignore suspect jumps in geofence evaluation (R1)
7080113 feat(geofence-eval-full-batch): freeze updated geofence evaluator (R2)
59075e6 feat(geofence-eval-full-batch): add full batch event regression test (R3)
bb52775 feat(geofence-eval-full-batch): add latest position compatibility test (R4)
a2919f0 feat(geofence-eval-full-batch): add batched event size test (R5)
3219407 feat(geofence-eval-full-batch): emit full position batches (R3,R4,R5)
6a68633 feat(geofence-eval-full-batch): add event schema compatibility tests (R6)
c8f1b35 feat(geofence-eval-full-batch): accept versioned position batches (R6)
312804c feat(geofence-eval-full-batch): add full batch evaluation tests (R7)
39e7ff8 feat(geofence-eval-full-batch): preserve legacy position events (R10)
13a65dd feat(geofence-eval-full-batch): evaluate every position in each batch (R7,R10)
a37fe41 feat(geofence-eval-full-batch): add crossing timestamp tests (R8)
9dc7f9a feat(geofence-eval-full-batch): timestamp alerts at crossing positions (R8)
10bc6a6 feat(geofence-eval-full-batch): add monotonic batch guard tests (R9)
1ba9256 feat(geofence-eval-full-batch): guard each position monotonically (R9)
9e1e2e9 feat(geofence-eval-full-batch): add single state write test (R11)
8f00ce5 feat(geofence-eval-full-batch): fold geofence state writes in memory (R11)
a15e991 feat(geofence-eval-full-batch): satisfy lint and refresh hash guard (R1,R2,R3,R4,R5,R7,R8,R9,R10,R11)
```

## Archivos protegidos

```text
> git diff --exit-code origin/main...HEAD -- backend-pet-tracker/test/alerts-engine.e2e-spec.ts backend-pet-tracker/test/ingestion.e2e-spec.ts
protected e2e files unchanged
```

El `it` R16 de #8 sobre campos ausentes y los describes R7-R16 de #12 no se
editaron. La única expectativa previa modificada fue el `it` R16 autorizado de
#8: `version: 2` más `positions`.

La implementación está completa; #30 permanece `in_progress` hasta el
veredicto independiente del `reviewer`.
