---
feature: "positions-api"
status: approved   # draft | spec_ready (pendiente gate humano) | approved
tags: [harness, spec]
---

# Tareas — [[positions-api]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> Orden sugerido: R3-R5 (last, solo Postgres) → R7-R9 (validación de query,
> sin I/O) → R13/R14 (codec de cursor, puro) → R10-R12/R15 (Query DynamoDB) →
> R1/R2 (e2e de guard sobre las rutas ya montadas) → R16 (verificación final).
> Cada test nombra su R-id (`describe('R4: ...')`, `docs/conventions.md`
> §Tests).

## R1 — Ambas rutas protegidas por PetAccessGuard sin @RequirePetRole

- [x] (1) Escribir test que falla para R1
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R2 — El petId sale solo de request.petMembership

- [x] (1) Escribir test que falla para R2
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R3 — GET .../positions/last: 200 con las 6 claves desde la caché, sin DynamoDB

- [x] (1) Escribir test que falla para R3
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R4 — staleSeconds = max(0, floor((now − ts)/1000)) con reloj inyectado

- [x] (1) Escribir test que falla para R4
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R5 — last_position NULL o corrupta → 200 con body null (+ warn)

- [x] (1) Escribir test que falla para R5
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R6 — Frescura real del simulador (staleSeconds < 120) como evidencia manual

- [x] (1) Escribir test que falla para R6 — **no aplica**: es evidencia
      manual de la cadena completa (ver requisito). Sustituir por: dejar
      preparado el guion de verificación en `progress/impl_positions-api.md`
      antes de correrlo.
- [x] (2) Ejecutar la cadena real (docker compose + poller + claim ACT-00x) y
      capturar la respuesta de `GET .../positions/last`
- [x] (3) Pegar la evidencia (timestamps, `staleSeconds` observado) en el
      reporte

Hecho 2026-08-02: guion `scripts/r6-evidence.tmp.ts` (temporal, borrado tras
la corrida; procedimiento reproducible transcrito en el reporte), corrida real
con `POLLER_ENABLED=true SIM_MODE=true` sobre Docker Postgres + LocalStack →
`200`, `staleSeconds: 47`, lat/lng reales. Evidencia en
`progress/impl_positions-api.md` §"Evidencia manual — R6".

## R7 — Query string validada con zod .strict() (400 en desconocidos)

- [x] (1) Escribir test que falla para R7
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R8 — Defaults to = now, from = to − 60 min (constantes nombradas)

- [x] (1) Escribir test que falla para R8
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R9 — from >= to → 400 INVALID_RANGE; rango > 24 h → 400 RANGE_TOO_LARGE

- [x] (1) Escribir test que falla para R9
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R10 — Query pk = PET#<petId> AND sk BETWEEN, ascendente, Limit 1000

- [x] (1) Escribir test que falla para R10
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R11 — Envelope {items, nextCursor} y mapeo camelCase sin atributos internos

- [x] (1) Escribir test que falla para R11
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R12 — low_accuracy excluidas por defecto; includeSuspect=true no filtra nada

- [x] (1) Escribir test que falla para R12
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R13 — Cursor base64url {v,p,q,k}: emisión, round-trip y continuación exacta

- [x] (1) Escribir test que falla para R13
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R14 — Cursor corrupto / de otra mascota / de otra consulta → 400 sin Query

- [x] (1) Escribir test que falla para R14
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R15 — Página vacía con nextCursor no nulo; rango sin datos → items: [], null

- [x] (1) Escribir test que falla para R15
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R16 — Sin migraciones, sin tocar workers/pipeline, contrato de #5 intacto

- [x] (1) Escribir test que falla para R16 — **no aplica** como test unitario:
      se verifica con `git diff main --stat` y la suite previa en verde.
      Sustituir por: registrar el diff esperado en el reporte antes de cerrar.
- [x] (2) Confirmar `git diff main --name-only` (solo `src/modules/positions/**`,
      `src/app.module.ts`, `test/positions.e2e-spec.ts`, `specs/`, `progress/`)
- [x] (3) `./init.sh` verde + `pnpm run test:e2e` verde

Hecho 2026-08-02: `git diff main --name-only` = 33 archivos, todos dentro del
ámbito permitido salvo `feature_list.json` (bookkeeping `pending` →
`in_progress` del leader, sin código de app — hallazgo declarado en el
reporte). Cero migraciones; `src/db/**`, `src/workers/**`, `src/pipeline/**`,
`src/modules/pets/**`, `package.json` y `.env.example` intactos. `./init.sh`
verde (482 unit / 77 suites), `pnpm run test:e2e` verde (84 / 7 suites).
