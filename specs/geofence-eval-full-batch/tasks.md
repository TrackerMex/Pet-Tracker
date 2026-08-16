---
feature: "geofence-eval-full-batch"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[geofence-eval-full-batch]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
> Rutas relativas a `backend-pet-tracker/`.
>
> **Commits test-primero, obligatorio** (CHECKPOINTS C4): el historial debe
> mostrar el test rojo en un commit y la implementación que lo pone verde en
> otro. Un único commit con test + implementación + docs se rechaza en
> revisión. Convención: `feat(geofence-eval-full-batch): <desc> (R1,R2)`.
>
> **Orden**: los bloques van A → B → C → D. R1 es prerrequisito duro de todo
> lo demás (subir el muestreo antes de filtrar `suspect_jump` duplica la
> exposición a falsa alarma). R6 va antes que R7-R11: sin el schema, el
> consumidor no ve `positions[]`.
>
> Comandos: `pnpm -C backend-pet-tracker test` (unitarios),
> `pnpm -C backend-pet-tracker run test:e2e` (e2e, exige Docker arriba),
> `./init.sh` desde la raíz antes de cerrar.

## Bloque A — núcleo puro

### R1 — `evaluate()` ignora `suspect_jump` igual que `low_accuracy`

- [ ] (1) Test rojo en `src/pipeline/geofence-eval.spec.ts`: describe
      `R1 (geofence-eval-full-batch #30): suspect_jump congela el estado igual
      que low_accuracy`, con `previous = { state: 'inside', updatedAt }`,
      punto a 115 m (`pointAtDistance(CENTER, 115)`), `accuracyM: 10`,
      `flags: [FLAG_SUSPECT_JUMP]`. Hoy devuelve `event: 'exit'` → rojo.
      Añadir el caso de `previous.state` `unknown` y `outside`, y el de
      ambos flags juntos.
- [ ] (2) Implementación mínima en `src/pipeline/geofence-eval.ts`: importar
      `FLAG_SUSPECT_JUMP` de `./constants` y ampliar la guarda de la línea
      106 a `flags.includes(FLAG_LOW_ACCURACY) || flags.includes(FLAG_SUSPECT_JUMP)`.
- [ ] (3) Refactor con tests verdes. Actualizar el comentario `// R22:` de la
      línea 105 para que nombre también a #30 R1.

### R2 — re-congelar el guard de hash

- [ ] (1) Test rojo: ya lo está — tras R1, los dos `it` de
      `src/pipeline/geofence-eval-untouched.spec.ts` fallan.
- [ ] (2) Recalcular los dos sha256 con el comando de [[requirements]] §R2 y
      sustituir `GEOFENCE_EVAL_TS_SHA256` y `GEOFENCE_EVAL_SPEC_TS_SHA256`.
- [ ] (3) Refactor: reescribir el texto del `describe` de la línea 42 y el
      comentario de las líneas 33-36 para que nombren a #30 como el rediseño
      autorizado. **No tocar** el segundo `describe` (constantes).

## Bloque B — productor

### R3 — el `detail` v2 lleva `positions[]`

- [ ] (1) Test rojo en `src/workers/positions-consumer.service.spec.ts`:
      describe `R3 (geofence-eval-full-batch #30): el detail v2 lleva el lote
      completo en positions[]`, mensaje con 3 posiciones en el body,
      assertions sobre `detail.version === 2` y `detail.positions` ascendente
      con las 9 claves por elemento.
- [ ] (2) Implementación en `emitEvents()`
      (`src/workers/positions-consumer.service.ts:234`): extraer
      `toEventPosition(p: ProcessedPosition)` con el mapeo de 9 claves,
      cambiar la firma a `emitEvents(parsed, accepted, previousBattery)` y
      derivar `latest` dentro. Actualizar la llamada de `handleMessage`
      (línea 225).
- [ ] (3) Refactor: actualizar el comentario de bloque de las líneas 228-233
      (hoy dice "Shapes congelados (D9)") para que documente v2.

### R4 — `position` sigue siendo la última del lote

- [ ] (1) Test rojo: `it` `R4 (geofence-eval-full-batch #30): position sigue
      siendo la última de positions[]` dentro del describe de R3
      (`expect(detail.position).toEqual(detail.positions.at(-1))`).
- [ ] (2) Implementación: cubierta por R3 si `toEventPosition` se usa en los
      dos sitios; si no, ajustar.
- [ ] (3) Refactor + **editar** el `it` de la línea 463 (`R16` de #8) a
      `version: 2` y `positions`, sin borrarlo, y registrar la edición en
      [[traceability]] §Tests de #8 actualizados. Verificar que el `it` de la
      línea 518 sigue verde **sin** tocarlo.

### R5 — un solo `Entry` por mensaje, y cabe en 256 KB

- [ ] (1) Test rojo en el mismo archivo: describe
      `R5 (geofence-eval-full-batch #30): un solo Entry position.updated por
      mensaje SQS aunque el lote traiga 100 posiciones`, con un body de 100
      posiciones generadas (ts crecientes, ~30 s de separación, movimiento de
      caminata para no marcar `suspect_jump`), y dos `it`: conteo de entries
      y `Buffer.byteLength(entry.Detail, 'utf8') < 256 * 1024`.
- [ ] (2) Implementación mínima: debería pasar ya con R3; si no, corregir.
- [ ] (3) Refactor con tests verdes.

## Bloque C — contrato de entrada

### R6 — el schema acepta v1 y v2

- [ ] (1) Test rojo en archivo **nuevo**
      `src/workers/alerts-engine/geofence-event-message.schema.spec.ts`:
      describe `R6 (geofence-eval-full-batch #30): positionUpdatedDetailSchema
      acepta v1 y v2`, un `it` por cada caso (a) v2 con `positions` → ok,
      (b) v1 sin `positions` → ok, (c) `positions: []` → falla,
      (d) `version: 3` → falla.
- [ ] (2) Implementación en
      `src/workers/alerts-engine/geofence-event-message.schema.ts`:
      `version: z.union([z.literal(1), z.literal(2)])` y
      `positions: z.array(positionDetailSchema).min(1).optional()`.
- [ ] (3) Refactor: actualizar el comentario de las líneas 19-21 (hoy dice
      "contrato R16/R17 de #8, congelado") para documentar v2 y la
      convivencia con v1.

## Bloque D — motor

### R7 — iterar el lote entero en orden ascendente

- [ ] (1) Test rojo en
      `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts`:
      añadir el helper `pointAtDistance()` y el fixture
      `positionUpdatedDetailV2()` ([[design]] §Helpers de test), y el describe
      `R7 (geofence-eval-full-batch #30): evalúa el lote entero en orden
      ascendente de ts` con los `it` (a), (b) y (c) de [[requirements]] R7.
      Hoy los tres fallan porque solo se evalúa `detail.position`.
- [ ] (2) Implementación en `evaluateGeofences()`
      (`alerts-engine-consumer.service.ts:232`): el bucle de [[design]] §D1,
      con el `sort` sobre una copia.
- [ ] (3) Refactor con tests verdes. Actualizar el JSDoc de la línea 231.

### R8 — la alerta lleva el `ts` de la posición que cruzó

- [ ] (1) Test rojo: describe `R8 (geofence-eval-full-batch #30): la alerta
      lleva el ts de la posición que cruzó`, con ts2 (cruce) ≠ ts3 (última)
      ≠ `NOW.getTime()`, y assertions sobre `openedAt`, `payload.position.ts`
      y sobre `closedAt` en el caso `enter`.
- [ ] (2) Implementación: cuarto parámetro en `handleExit()` (línea 282) y
      `handleEnter()` (línea 311) con la posición que disparó el evento;
      `openedAt`/`closedAt`/`payload.position` salen de ahí.
      **No tocar** `evaluateBatteryRecovery()` (línea 339).
- [ ] (3) Refactor con tests verdes.

### R9 — el guard monotónico sobrevive al lote

- [ ] (1) Test rojo: describe `R9 (geofence-eval-full-batch #30): el guard
      monotónico sobrevive al lote`, con (a) lote reentregado entero →
      `openAlert`, `closeOpenAlert` y `updateGeofenceState` sin llamadas,
      cero mensajes a `notifications`, mensaje borrado; y (b) lote mixto →
      solo se evalúan las `ts > previousUpdatedAtMs`.
- [ ] (2) Implementación: `previousUpdatedAtMs` calculado una vez por
      geocerca antes del bucle, `continue` por posición.
- [ ] (3) Refactor. Verificar que el `it` `R14` de la línea 877 y el
      `R14` de `test/alerts-engine.e2e-spec.ts:374` siguen verdes sin tocar.

### R10 — un `detail` v1 sin `positions[]` se sigue procesando

- [ ] (1) Test rojo/verde-de-regresión: describe
      `R10 (geofence-eval-full-batch #30): un detail v1 sin positions[] se
      sigue procesando`, usando `positionUpdatedDetail()` sin modificar, con
      assertion de `openAlert` una vez y del `ReceiptHandle` en
      `sqs.deleted`. Escribirlo **antes** que la implementación de R7 para
      que el fallback quede fijado desde el principio.
- [ ] (2) Implementación: `detail.positions ?? [detail.position]`.
- [ ] (3) Refactor con tests verdes.

### R11 — un solo `updateGeofenceState` por geocerca y mensaje

- [ ] (1) Test rojo: describe `R11 (geofence-eval-full-batch #30): un solo
      updateGeofenceState por geocerca y mensaje`, lote de 100 posiciones
      todas dentro, `toHaveBeenCalledTimes(1)`.
- [ ] (2) Implementación: el flag `pendingStateWrite` de [[design]] §D1.
- [ ] (3) Refactor. Verificar verdes sin tocar los `it` de R8/R9/R10 de #12
      (líneas 450-642).

## Cierre

- [ ] `pnpm -C backend-pet-tracker run build` verde.
- [ ] `pnpm -C backend-pet-tracker test` verde, sin `skipped` inesperados.
- [ ] `pnpm -C backend-pet-tracker run test:e2e` verde (Docker + LocalStack
      arriba; `test/alerts-engine.e2e-spec.ts` y `test/ingestion.e2e-spec.ts`
      son los relevantes y no deben editarse).
- [ ] `./init.sh` desde la raíz termina en verde.
- [ ] [[traceability]] sin ninguna fila "pendiente", incluida la tabla
      §Tests de #8 actualizados.
- [ ] Nota de cierre en `docs/aws-scalability-review.md` §Discrepancias.
- [ ] `progress/impl_geofence-eval-full-batch.md` con la evidencia (comandos
      y salidas), incluidos los dos sha256 nuevos de R2.
