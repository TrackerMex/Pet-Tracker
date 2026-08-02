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

- [ ] (1) Escribir test que falla para R1
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R2 — El petId sale solo de request.petMembership

- [ ] (1) Escribir test que falla para R2
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — GET .../positions/last: 200 con las 6 claves desde la caché, sin DynamoDB

- [ ] (1) Escribir test que falla para R3
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — staleSeconds = max(0, floor((now − ts)/1000)) con reloj inyectado

- [ ] (1) Escribir test que falla para R4
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — last_position NULL o corrupta → 200 con body null (+ warn)

- [ ] (1) Escribir test que falla para R5
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — Frescura real del simulador (staleSeconds < 120) como evidencia manual

- [ ] (1) Escribir test que falla para R6 — **no aplica**: es evidencia
      manual de la cadena completa (ver requisito). Sustituir por: dejar
      preparado el guion de verificación en `progress/impl_positions-api.md`
      antes de correrlo.
- [ ] (2) Ejecutar la cadena real (docker compose + poller + claim ACT-00x) y
      capturar la respuesta de `GET .../positions/last`
- [ ] (3) Pegar la evidencia (timestamps, `staleSeconds` observado) en el
      reporte

## R7 — Query string validada con zod .strict() (400 en desconocidos)

- [ ] (1) Escribir test que falla para R7
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R8 — Defaults to = now, from = to − 60 min (constantes nombradas)

- [ ] (1) Escribir test que falla para R8
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — from >= to → 400 INVALID_RANGE; rango > 24 h → 400 RANGE_TOO_LARGE

- [ ] (1) Escribir test que falla para R9
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R10 — Query pk = PET#<petId> AND sk BETWEEN, ascendente, Limit 1000

- [ ] (1) Escribir test que falla para R10
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R11 — Envelope {items, nextCursor} y mapeo camelCase sin atributos internos

- [ ] (1) Escribir test que falla para R11
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R12 — low_accuracy excluidas por defecto; includeSuspect=true no filtra nada

- [ ] (1) Escribir test que falla para R12
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R13 — Cursor base64url {v,p,q,k}: emisión, round-trip y continuación exacta

- [ ] (1) Escribir test que falla para R13
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R14 — Cursor corrupto / de otra mascota / de otra consulta → 400 sin Query

- [ ] (1) Escribir test que falla para R14
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R15 — Página vacía con nextCursor no nulo; rango sin datos → items: [], null

- [ ] (1) Escribir test que falla para R15
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R16 — Sin migraciones, sin tocar workers/pipeline, contrato de #5 intacto

- [ ] (1) Escribir test que falla para R16 — **no aplica** como test unitario:
      se verifica con `git diff main --stat` y la suite previa en verde.
      Sustituir por: registrar el diff esperado en el reporte antes de cerrar.
- [ ] (2) Confirmar `git diff main --name-only` (solo `src/modules/positions/**`,
      `src/app.module.ts`, `test/positions.e2e-spec.ts`, `specs/`, `progress/`)
- [ ] (3) `./init.sh` verde + `pnpm run test:e2e` verde
