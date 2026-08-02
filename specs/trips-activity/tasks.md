---
feature: "trips-activity"
status: approved   # draft | spec_ready (pendiente gate humano) | approved
tags: [harness, spec]
---

# Tareas — [[trips-activity]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> Orden sugerido, de dentro hacia fuera (el núcleo puro no necesita infra, así
> que se cierra entero antes de tocar Docker):
> **(1) núcleo puro** R1 → R2 → R3 → R4 → R5 → R6 → R7 → R8 → R9;
> **(2) persistencia** R10 → R11;
> **(3) agregador** R12 → R13 → R14 → R15;
> **(4) HTTP** R16 → R17 → R18 → R19 → R20 → R21;
> **(5) cierre** R22 → R23.
>
> Cada test nombra su R-id (`describe('R4: ...')`, `docs/conventions.md`
> §Tests). Commits conventional en inglés con los R-ids
> (`feat(trips-activity): <desc> (R2,R3)`), branch `feature/10-trips-activity`,
> PR al final — **el humano mergea**.
>
> **STOP obligatorio** (plan 006 §Condiciones de STOP): si con los umbrales de
> R1 el fixture `walk.json` da 0 paseos, no se recalibran a ojo — se para y se
> reporta con los números. Igual si el modelo necesita cambiar más allá de
> `activity_daily`.

## R1 — Siete umbrales nombrados en pipeline/constants.ts, sin colisión con LOW_ACCURACY_MAX_ACCURACY_M

- [x] (1) Escribir test que falla para R1
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R2 — Criterio de movimiento (1,8 km/h o 0,5 m/s) y apertura con 3 puntos consecutivos

- [x] (1) Escribir test que falla para R2
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R3 — Cierre por 10 min sin movimiento y por gap > 15 min (gap de 20 min parte dos paseos)

- [x] (1) Escribir test que falla para R3
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R4 — Descarte de paseos < 5 min o < 100 m (reposo total → 0 paseos)

- [x] (1) Escribir test que falla para R4
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R5 — Distancia excluyendo pares con suspect_jump; low_accuracy no se filtra

- [x] (1) Escribir test que falla para R5
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R6 — Shape de Trip, orden, no solapamiento, pureza y determinismo (walk.json → ≥1 paseo)

- [x] (1) Escribir test que falla para R6
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R7 — localDayOf / localDayRange con Intl: caso 23:50 America/Mexico_City y días DST de 23 h y 25 h

- [x] (1) Escribir test que falla para R7
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R8 — computeDailyActivity: 7 métricas sobre la ventana observada, firma con {startMs, endMs}

- [x] (1) Escribir test que falla para R8
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R9 — Día vacío y día de un solo punto → todas las métricas a cero, sin lanzar

- [x] (1) Escribir test que falla para R9
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R10 — Migración 0005: solo activity_daily, PK (pet_id, date), tipos y CHECK de no negatividad

- [x] (1) Escribir test que falla para R10
- [x] (2) Implementación mínima que lo pasa (`pnpm run db:generate` +
      `pnpm exec drizzle-kit migrate`; verificar que el DDL tiene un único
      `CREATE TABLE`)
- [x] (3) Refactor con tests verdes

## R11 — Upsert ON CONFLICT (pet_id, date) idempotente que preserva time_away_minutes

- [x] (1) Escribir test que falla para R11
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R12 — DailyPositionsReader: Query paginada del día, tope de 10 páginas con warn, mapeo a ProcessedPosition

- [x] (1) Escribir test que falla para R12
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R13 — listPetsToAggregate: collar activo + timezone del owner, fallback UTC con warn

- [x] (1) Escribir test que falla para R13
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R14 — runOnce(now): último día local cerrado, skip de filas frescas, resiliencia por mascota y guard de solape

- [x] (1) Escribir test que falla para R14
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R15 — Cáscara de scheduling gated por ACTIVITY_AGGREGATOR_ENABLED y NODE_ENV != test, tick de 1 h

- [x] (1) Escribir test que falla para R15
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R16 — Las tres rutas con PetAccessGuard sin @RequirePetRole; petId solo de request.petMembership

- [x] (1) Escribir test que falla para R16
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R17 — Query zod strictObject con fechas YYYY-MM-DD; 400 con code (INVALID_DATE / INVALID_RANGE / RANGE_TOO_LARGE / INVALID_TRIP_INDEX)

- [x] (1) Escribir test que falla para R17
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R18 — GET /trips?date: {date, items} sin path, día en tz del owner, día vacío → items: []

- [x] (1) Escribir test que falla para R18
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R19 — GET /trips/:n: mismo item + path, índice estable, fuera de rango → 404 TRIP_NOT_FOUND

- [x] (1) Escribir test que falla para R19
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R20 — GET /activity/daily: {days, weekComparison}, source stored/computed/missing, hoy al vuelo sin persistir

- [x] (1) Escribir test que falla para R20
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R21 — weekComparison: delta % a 1 decimal contra los 7 días previos; null sin historial o con base 0

- [x] (1) Escribir test que falla para R21
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R22 — ACTIVITY_AGGREGATOR_ENABLED en docs/conventions.md y .env.example (mismo commit) + data-model y wialon-module

- [x] (1) Escribir test que falla para R22 — **no aplica** como test unitario:
      es una regla de cierre documental (`AGENTS.md` §4). Sustituir por: dejar
      la lista de los tres archivos a tocar en `progress/impl_trips-activity.md`
      antes del commit que introduce la lectura de la variable.
- [x] (2) Añadir la fila a `docs/conventions.md` §Variables de entorno y la
      línea a `.env.example` **en el mismo commit** que introduce
      `ConfigService.get('ACTIVITY_AGGREGATOR_ENABLED')`
- [x] (3) Afinar la fila `activity_daily` de `docs/data-model.md` con los tipos
      reales y añadir los 7 umbrales a la tabla de `docs/wialon-module.md`

## R23 — No regresión: una sola migración, ámbito de archivos cerrado, contratos de #5/#8/#9 intactos

- [x] (1) Escribir test que falla para R23 — **no aplica** como test unitario:
      se verifica con `git diff main --name-only` y la suite previa en verde.
      Sustituir por: registrar el diff esperado en el reporte antes de cerrar.
- [x] (2) Confirmar `git diff main --name-only` contra la lista de R23 (cero
      cambios en `src/modules/{pets,positions,devices,users,auth}/**`,
      `src/workers/**`, `src/integrations/**`, `src/aws/**` y `package.json`;
      exactamente una migración `0005_*`)
- [x] (3) `./init.sh` verde + `pnpm run test:e2e` verde, incluidos los tres
      tests que afirman `activitySummary === null` (D12)
