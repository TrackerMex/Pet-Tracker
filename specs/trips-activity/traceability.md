---
feature: "trips-activity"
status: approved   # draft | spec_ready (pendiente gate humano) | approved
tags: [harness, spec]
---

# Trazabilidad — [[trips-activity]]

Rutas relativas a `backend-pet-tracker/`. El nombre tras `::` es el `describe`
que nombra el R-id (`docs/conventions.md` §Tests).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/pipeline/trips.spec.ts::R1: siete umbrales nombrados en pipeline/constants.ts` | `00d64ab` feat(trips-activity): pure core for trips, local day and daily KPIs |
| R2 | `src/pipeline/trips.spec.ts::R2: criterio de movimiento y apertura con 3 puntos consecutivos` | `00d64ab` feat(trips-activity): pure core for trips, local day and daily KPIs |
| R3 | `src/pipeline/trips.spec.ts::R3: cierre por inactividad y por hueco de datos` | `00d64ab` feat(trips-activity): pure core for trips, local day and daily KPIs |
| R4 | `src/pipeline/trips.spec.ts::R4: descarte de paseos cortos o de poca distancia` | `00d64ab` feat(trips-activity): pure core for trips, local day and daily KPIs |
| R5 | `src/pipeline/trips.spec.ts::R5: la distancia excluye los pares con suspect_jump y no filtra low_accuracy` | `00d64ab` feat(trips-activity): pure core for trips, local day and daily KPIs |
| R6 | `src/pipeline/trips.spec.ts::R6: shape, orden, determinismo y pureza de trips.ts` | `00d64ab` feat(trips-activity): pure core for trips, local day and daily KPIs |
| R7 | `src/pipeline/local-day.spec.ts::R7: localDayOf / localDayRange con Intl, sin dependencia nueva` | `00d64ab` feat(trips-activity): pure core for trips, local day and daily KPIs |
| R8 | `src/pipeline/activity.spec.ts::R8: computeDailyActivity devuelve siete metricas sobre la ventana observada` | `00d64ab` feat(trips-activity): pure core for trips, local day and daily KPIs |
| R9 | `src/pipeline/activity.spec.ts::R9: dia vacio y dia de un solo punto dan ceros sin lanzar` | `00d64ab` feat(trips-activity): pure core for trips, local day and daily KPIs |
| R10 | `src/modules/activity/infrastructure/repositories/activity.drizzle.store.spec.ts::R10: la migracion 0005 crea unicamente activity_daily` | `850ba74` feat(trips-activity): activity_daily schema and migration 0005 |
| R11 | `test/activity.e2e-spec.ts::R11: el upsert es idempotente y preserva time_away_minutes` | `1702864` feat(trips-activity): activity ports, dynamo day reader, drizzle store, aggregator and gated tick (e2e `2a1ab72`) |
| R12 | `src/modules/activity/infrastructure/repositories/daily-positions.dynamo.reader.spec.ts::R12: DailyPositionsReader lee un dia entero paginando por dentro` | `1702864` feat(trips-activity): activity ports, dynamo day reader, drizzle store, aggregator and gated tick |
| R13 | `test/activity.e2e-spec.ts::R13: listPetsToAggregate cruza collar activo con la tz del owner` | `1702864` feat(trips-activity): activity ports, dynamo day reader, drizzle store, aggregator and gated tick (e2e `2a1ab72`) |
| R14 | `src/modules/activity/application/use-cases/aggregate-daily-activity.use-case.spec.ts::R14: runOnce procesa el ultimo dia local cerrado de cada mascota` + `test/activity.e2e-spec.ts::R14: runOnce upsertea el ultimo dia local cerrado` | `1702864` feat(trips-activity): activity ports, dynamo day reader, drizzle store, aggregator and gated tick (e2e `2a1ab72`) |
| R15 | `src/modules/activity/infrastructure/activity-scheduler.service.spec.ts::R15: el tick del agregador solo se agenda con la env activa y fuera de test` | `1702864` feat(trips-activity): activity ports, dynamo day reader, drizzle store, aggregator and gated tick |
| R16 | `src/modules/activity/infrastructure/activity.controller.spec.ts::R16: las tres rutas las autoriza PetAccessGuard, sin @RequirePetRole` + `test/activity.e2e-spec.ts::R16: las tres rutas las autoriza PetAccessGuard y nada mas` | `8a2e247` feat(trips-activity): trips and daily activity endpoints behind PetAccessGuard (e2e `2a1ab72`) |
| R17 | `src/modules/activity/infrastructure/activity.controller.spec.ts::R17: la query string se valida entera en el borde HTTP` + `src/modules/activity/application/use-cases/list-trips.use-case.spec.ts::R17: \`:n\` que no es entero >= 0 es InvalidTripIndexError sin I/O` + `src/modules/activity/application/use-cases/get-daily-activity.use-case.spec.ts::R17: los rangos invalidos de /activity/daily no llegan a la base` + `test/activity.e2e-spec.ts::R17: la query invalida es 400 con su codigo` | `8a2e247` feat(trips-activity): trips and daily activity endpoints behind PetAccessGuard (e2e `2a1ab72`) |
| R18 | `src/modules/activity/application/use-cases/list-trips.use-case.spec.ts::R18: GET /trips devuelve {date, items} del dia local del owner` + `test/activity.e2e-spec.ts::R18: GET /trips devuelve {date, items} sin path` | `8a2e247` feat(trips-activity): trips and daily activity endpoints behind PetAccessGuard (e2e `2a1ab72`) |
| R19 | `src/modules/activity/application/use-cases/list-trips.use-case.spec.ts::R19: GET /trips/:n devuelve el paseo con path e indice estable` + `test/activity.e2e-spec.ts::R19: GET /trips/:n devuelve el paseo con su path` | `8a2e247` feat(trips-activity): trips and daily activity endpoints behind PetAccessGuard (e2e `2a1ab72`) |
| R20 | `src/modules/activity/application/use-cases/get-daily-activity.use-case.spec.ts::R20: days trae una entrada por dia con su source` + `test/activity.e2e-spec.ts::R20: days trae stored, computed y missing sin persistir hoy` | `8a2e247` feat(trips-activity): trips and daily activity endpoints behind PetAccessGuard (e2e `2a1ab72`) |
| R21 | `src/modules/activity/domain/week-comparison.spec.ts::R21: weekComparison es el delta % a un decimal contra la base` + `src/modules/activity/application/use-cases/get-daily-activity.use-case.spec.ts::R21: weekComparison compara contra los 7 dias previos a \`from\`` + `test/activity.e2e-spec.ts::R21: weekComparison viaja con la respuesta` | `1702864` (función pura) y `8a2e247` (cableado HTTP) (e2e `2a1ab72`) |
| R22 | `src/modules/activity/infrastructure/activity-scheduler.service.spec.ts::R22: ACTIVITY_AGGREGATOR_ENABLED documentada donde manda AGENTS.md §4` | `1702864` (env var + `.env.example` + `docs/conventions.md`, mismo commit) y el commit de cierre (`docs/data-model.md`, `docs/wialon-module.md`) |
| R23 | sin test automatizado (regla de no regresión): `git diff main --name-only` contra la lista de R23 + `./init.sh` y `pnpm run test:e2e` verdes — evidencia en `progress/impl_trips-activity.md` §"Verificación de no regresión — R23" | verificado sobre `2a1ab72`; registrado en el commit de cierre |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

Nota: R22 y R23 no tienen test unitario clásico. R22 sí quedó automatizado
(un test lee `.env.example` y `docs/conventions.md`); R23 es una verificación
de diff y de suites en verde, documentada en el reporte del implementer —
mismo tratamiento que R6/R16 en `specs/positions-api/traceability.md`.
