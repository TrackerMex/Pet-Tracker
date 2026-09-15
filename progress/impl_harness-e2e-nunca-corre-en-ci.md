# impl: harness-e2e-nunca-corre-en-ci

Fecha: 2026-09-15

Agente: Codex (`implementer`)

Rama: `feature/96-harness-e2e-nunca-corre-en-ci`

## Resultado

R1-R9 quedaron implementados con TDD y la feature permanece `in_progress`.
CI levanta el `docker-compose.yml` versionado antes de `init.sh`, fija
`AWS_MODE: local`, y el gate aborta si no puede derivar o abrir los destinos
de `DATABASE_URL` y `AWS_ENDPOINT_URL`. Con la infraestructura disponible,
ejecuta `db:migrate` y `provision:local` antes de los E2E.

No se marcaron ni se dan por cumplidos G1/G2: requieren corridas reales del PR
realizadas por un humano. No se abrió PR ni se hizo merge.

## Cambios

- `.github/workflows/ci.yml`: `AWS_MODE: local` y
  `docker compose up -d --wait --wait-timeout 120` tras checkout.
- `init.sh`: `port_open(host, puerto)`, parseo de URLs desde `.env`, fallo duro
  y setup obligatorio antes de los E2E.
- `init.config.sh`: `E2E_PORT_SOURCES`, `E2E_SETUP_CMD` y cableado del candado.
- `init-e2e-gate.test.mjs`: 9 suites `node:test`, una por R-id; 15 tests.
- `AGENTS.md` y `docs/verification.md`: mapa y runbook de la feature 96.

No se añadieron dependencias ni variables de entorno. No se tocaron
`.env.example`, `mobile-pet-tracker/` ni recursos AWS reales, y no se ejecutó
`cdk deploy`.

Además de la tabla de archivos de `design.md`, se actualizaron los archivos de
bookkeeping exigidos por el flujo: `progress/current.md`, este reporte y
`specs/harness-e2e-nunca-corre-en-ci/traceability.md`.

## TDD: rojo antes que verde

| R | Commit rojo | Commit verde |
|---|---|---|
| R1 | `ae21880a` | `64a0ecc0` |
| R2 | `ba934c99` | `a306d2e3` |
| R3 | `4a13f00a` | `c33995e7` |
| R4 | `cc5f2936` | `18188a7e` |
| R5 | `fd380f3c` | `cb618641` |
| R6 | `9fa459fe` | `437557a4` |
| R7 | `8d8eacfb` | `b75e4602` |
| R8 | `1ea1fbd1` | `719b539a` |
| R9 | `f6d82df7` | `9c6a813e` |

Cada rojo se ejecutó y falló por la aserción dirigida antes de su
implementación. Después de cada verde se actualizó `traceability.md`; los 18
hashes se comprobaron con `git merge-base --is-ancestor`. La rama no se
rebaseó.

## Verificación

Suite dirigida:

```text
$ node --test init-e2e-gate.test.mjs
# tests 15
# suites 9
# pass 15
# fail 0
```

Gate final, ejecutado directamente y sin tubería:

```text
$ ./init.sh
Test Suites: 166 passed, 166 total
Tests:       1279 passed, 1279 total

Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total

Test Suites: 73 passed, 73 total
Tests:       1275 passed, 1275 total

Test Suites: 3 skipped, 26 passed, 26 of 29 total
Tests:       8 skipped, 367 passed, 375 total

Lint sin errores
Typecheck sin errores
Todo verde. Listo para trabajar.
exit code: 0
```

Las tres suites omitidas son `aws-real-*`, tal como exige `AWS_MODE=local`.
El setup del gate usó exclusivamente
`pnpm -C backend-pet-tracker run db:migrate` y
`pnpm -C backend-pet-tracker run provision:local`.

## Gates humanos pendientes

- **G1 — pendiente:** URL de la corrida verde del PR y comprobación del resumen
  E2E según la igualdad dinámica de `requirements.md`.
  El gate 1 la corrida verde
  URL: https://github.com/TrackerMex/Pet-Tracker/pull/134
- **G2 — pendiente:** URL de la corrida roja deliberada con
  `test/96-ci-red-probe`, línea exacta del fallo y cierre del PR de prueba sin
  mergear.
  El gate 2 la corrida roja
  URL: https://github.com/TrackerMex/Pet-Tracker/pull/135

La feature no debe pasar a `done` hasta que un humano aporte ambas evidencias y
el reviewer emita su veredicto.
