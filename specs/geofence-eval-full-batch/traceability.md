---
feature: "geofence-eval-full-batch"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[geofence-eval-full-batch]]

> Rutas relativas a `backend-pet-tracker/`. Los tests **nuevos** nombran su
> requisito como `R<n> (geofence-eval-full-batch #30): ...` (ver [[tasks]]).
> El implementer actualiza esta tabla tras cada commit; el reviewer la valida
> al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Requisitos

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/pipeline/geofence-eval.spec.ts::R1 (geofence-eval-full-batch #30): suspect_jump congela el estado igual que low_accuracy` | rojo: `033fdcd feat(geofence-eval-full-batch): add suspect jump regression test (R1)`; verde: `bad02af feat(geofence-eval-full-batch): ignore suspect jumps in geofence evaluation (R1)` |
| R2 | `src/pipeline/geofence-eval-untouched.spec.ts::R2 (geofence-eval-full-batch #30): geofence-eval.ts queda congelado en el estado de #30` (2 `it`) | rojo: `bad02af` (R1 rompe ambos hashes); verde: `7080113 feat(geofence-eval-full-batch): freeze updated geofence evaluator (R2)` |
| R3 | `src/workers/positions-consumer.service.spec.ts::R3 (geofence-eval-full-batch #30): el detail v2 lleva el lote completo en positions[]` | rojo: `59075e6 feat(geofence-eval-full-batch): add full batch event regression test (R3)`; verde: `3219407 feat(geofence-eval-full-batch): emit full position batches (R3,R4,R5)` |
| R4 | `src/workers/positions-consumer.service.spec.ts::R4 (geofence-eval-full-batch #30): position sigue siendo la última de positions[]` + el `it` de la línea 518 (`R16` de #8) verde sin editar | rojo: `bb52775 feat(geofence-eval-full-batch): add latest position compatibility test (R4)`; verde: `3219407 feat(geofence-eval-full-batch): emit full position batches (R3,R4,R5)` |
| R5 | `src/workers/positions-consumer.service.spec.ts::R5 (geofence-eval-full-batch #30): un solo Entry position.updated por mensaje SQS aunque el lote traiga 100 posiciones` (2 `it`) | rojo: `a2919f0 feat(geofence-eval-full-batch): add batched event size test (R5)`; verde: `3219407 feat(geofence-eval-full-batch): emit full position batches (R3,R4,R5)` |
| R6 | `src/workers/alerts-engine/geofence-event-message.schema.spec.ts::R6 (geofence-eval-full-batch #30): positionUpdatedDetailSchema acepta v1 y v2` (4 `it`: a, b, c, d) | rojo: `6a68633 feat(geofence-eval-full-batch): add event schema compatibility tests (R6)`; verde: `c8f1b35 feat(geofence-eval-full-batch): accept versioned position batches (R6)` |
| R7 | `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts::R7 (geofence-eval-full-batch #30): evalúa el lote entero en orden ascendente de ts` (3 `it`: a, b, c) | rojo: `312804c feat(geofence-eval-full-batch): add full batch evaluation tests (R7)`; verde: `13a65dd feat(geofence-eval-full-batch): evaluate every position in each batch (R7,R10)` |
| R8 | `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts::R8 (geofence-eval-full-batch #30): la alerta lleva el ts de la posición que cruzó` | rojo: `a37fe41 feat(geofence-eval-full-batch): add crossing timestamp tests (R8)`; verde: `9dc7f9a feat(geofence-eval-full-batch): timestamp alerts at crossing positions (R8)` |
| R9 | `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts::R9 (geofence-eval-full-batch #30): el guard monotónico sobrevive al lote` (2 `it`: a, b) + `test/alerts-engine.e2e-spec.ts::R14: redeliverar el mismo position.updated no duplica la fila ni reenvia la notificacion` verde sin editar | rojo: `10bc6a6 feat(geofence-eval-full-batch): add monotonic batch guard tests (R9)`; verde: `1ba9256 feat(geofence-eval-full-batch): guard each position monotonically (R9)` |
| R10 | `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts::R10 (geofence-eval-full-batch #30): un detail v1 sin positions[] se sigue procesando` | regresión verde: `39e7ff8 feat(geofence-eval-full-batch): preserve legacy position events (R10)`; fallback: `13a65dd feat(geofence-eval-full-batch): evaluate every position in each batch (R7,R10)` |
| R11 | `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts::R11 (geofence-eval-full-batch #30): un solo updateGeofenceState por geocerca y mensaje` | rojo: `9e1e2e9 feat(geofence-eval-full-batch): add single state write test (R11)`; verde: `8f00ce5 feat(geofence-eval-full-batch): fold geofence state writes in memory (R11)` |

## Cobertura de los `acceptance_criteria` de `feature_list.json` #30

| # | Criterio de aceptación (abreviado) | Requisito(s) | Estado |
|---|---|---|---|
| 1 | `evaluate()` ignora `suspect_jump` igual que `low_accuracy`, con test que nombre el R-id y que hoy fallaría | R1 (+ R2 re-congela el guard de hash que R1 rompe) | cubierto por `033fdcd` → `bad02af`; guard verde en `7080113` |
| 2 | Una posición intermedia que cruza el radio de salida abre la alerta de `exit` aunque la última del lote esté dentro | R7a (última a 95 m: alerta abierta, sin `enter`) y R7b (última en el centro: `exit` + `enter`) — habilitado por R3 y R6 | cubierto por `312804c` → `13a65dd` |
| 3 | La alerta se abre con el `ts` de la posición que cruzó, no con el de la última ni con la hora del servidor | R8 | cubierto por `a37fe41` → `9dc7f9a` |
| 4 | Orden ascendente de `ts` y guard monotónico `previousUpdatedAtMs` respetado; un lote reentregado no reabre ni retrocede | R7 (orden) + R9a/R9b (guard) | orden `312804c` → `13a65dd`; guard `10bc6a6` → `1ba9256` |
| 5 | Exactamente un `position.updated` por mensaje SQS: un único `Entry` en el `PutEventsCommand` con un lote de varias posiciones | R5 | cubierto por `a2919f0` → `3219407` |
| 6 | `detail.position` sigue siendo la posición más reciente del lote; consumidores y fixtures de 006/007/010 verdes sin tocarlos | R4 | cubierto por `bb52775` → `3219407` |
| 7 | Un evento sin `positions[]` (`detail.version` 1, mensaje legado en vuelo) se sigue procesando con `position`, sin ir a la DLQ | R6b (schema) + R10 (consumidor) | schema `6a68633` → `c8f1b35`; consumidor `39e7ff8` + `13a65dd` |

## Tests de features anteriores actualizados, no borrados

> Una fila por cada test existente cuyo **comportamiento esperado** cambia.
> El reviewer rechaza si algún `it` de #8/#11/#12 desapareció del árbol sin
> aparecer aquí con su justificación.

| Test | Feature dueña | Qué cambia y por qué | Commit |
|---|---|---|---|
| `src/workers/positions-consumer.service.spec.ts::R16: ... 'emite exactamente un position.updated por mensaje con >=1 aceptada, con el shape congelado'` (línea 463) | #8 `wialon-ingestion-pipeline` | El `expect(detail).toEqual({...})` es estricto: pasa a `version: 2` y suma la clave `positions`. El resto del objeto (`petId`, `deviceId`, `position`, `batteryPct`) no se toca — esa es justamente la garantía de R4 | `3219407` |
| `src/pipeline/geofence-eval-untouched.spec.ts` — `GEOFENCE_EVAL_TS_SHA256`, `GEOFENCE_EVAL_SPEC_TS_SHA256` y el texto del primer `describe` (líneas 37-52) | #12 `alerts-engine` (su R19) | R1 modifica `geofence-eval.ts` y su suite; el guard se re-congela en el estado de #30 en vez de borrarse ([[design]] §D5). El segundo `describe` (valores de `pipeline/constants.ts`, líneas 54-77) queda intacto | `7080113` |

## Tests que deben quedar verdes SIN editarse

> Comprobación explícita del reviewer: si alguno de estos hizo falta tocarlo,
> el diseño se desvió de la spec.

- `src/workers/positions-consumer.service.spec.ts::R16: ... 'serializa con null los campos ausentes de la ultima aceptada'` (línea 518) — R4.
- `src/pipeline/geofence-eval.spec.ts`, describes `R16`-`R25` de #11 — R1 solo añade un describe.
- `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts`, describes `R7`-`R16` de #12 (líneas 371-1036) — R9, R10 y R11 existen precisamente para que el caso de una sola posición produzca las mismas llamadas al store que hoy.
- `test/alerts-engine.e2e-spec.ts` completo, incluido el `detail` v1 construido a mano en las líneas 404-425 — R10.
- `test/ingestion.e2e-spec.ts` completo — no asevera el `detail` del evento.
- `src/aws/provisioning.geofence-events.spec.ts` — la regla no filtra por `detail.version` ([[design]] §D7).

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(geofence-eval-full-batch): <desc> (R1,R2)`.
