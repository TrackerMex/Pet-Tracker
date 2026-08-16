---
feature: "reject-future-positions"
status: approved     # draft | approved
tags: [harness, spec]
---

# Tareas — [[reject-future-positions]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
> Rutas relativas a `backend-pet-tracker/`.
>
> **Commits test-primero, obligatorio** (CHECKPOINTS C4): el historial debe
> mostrar el test rojo en un commit y la implementación que lo pone verde en
> otro. Un único commit con test + implementación + docs se rechaza en
> revisión. Convención: `feat(reject-future-positions): <desc> (R1,R2)`.
>
> **Branch**: `feature/27-reject-future-positions`. Nada va a `main`
> directamente; el cierre es un `gh pr create` y el merge lo hace el humano
> (`docs/conventions.md` §Branches y Pull Requests).
>
> **Orden**: A → B → C → D. R8 (la constante) es prerrequisito de R1: sin
> `FUTURE_TS_TOLERANCE_MS` el test de R1 no compila. Los bloques B y C son
> independientes entre sí; el C (watermark) es el que cierra el fallo
> irreversible, así que si hay que partir el trabajo, va primero.
>
> **Regla dura de esta feature**: si te encuentras teniendo que **editar** un
> test existente para ponerlo verde, para y repórtalo — el inventario de
> [[design]] §Inventario de riesgo dice que ninguno lo necesita, así que una
> edición significa que el diseño se desvió.
>
> Comandos: `pnpm -C backend-pet-tracker test` (unitarios),
> `pnpm -C backend-pet-tracker run test:e2e` (e2e, exige Docker arriba),
> `./init.sh` desde la raíz antes de cerrar.

## Bloque A — la constante (prerrequisito)

### R8 — `FUTURE_TS_TOLERANCE_MS` en `pipeline/constants.ts`

- [ ] (1) Test rojo en `src/pipeline/validate-positions.spec.ts`: describe
      nuevo `R8 (reject-future-positions #27): FUTURE_TS_TOLERANCE_MS vive en
      pipeline/constants.ts`, con un `it` que importa la constante de
      `./constants` y asevera `toBe(5 * 60_000)`, y otro que lee
      `validate-positions.ts` con `readFileSync` (patrón de la línea 84) y
      asevera que contiene `FUTURE_TS_TOLERANCE_MS` y no contiene `300_000`
      ni `300000`. Rojo por dos motivos: la constante no existe y el archivo
      no la menciona.
- [ ] (2) Implementación en `src/pipeline/constants.ts`: añadir
      `export const FUTURE_TS_TOLERANCE_MS = 5 * 60_000;` con el JSDoc de
      justificación de [[design]] §D4 (qué desfase legítimo cubre y por qué
      el hardware roto queda fuera). **No** tocar ninguna constante
      existente. El archivo sigue sin `import`. El segundo `it` seguirá rojo
      hasta R1 — eso es correcto, no lo fuerces.
- [ ] (3) Refactor: actualizar el comentario de cabecera del archivo (líneas
      1-3) para nombrar también a #27 como consumidor de umbrales.

## Bloque B — la validación pura

### R1 — `normalize()` descarta el `ts` futuro con razón `future_ts`

- [ ] (1) Test rojo en `src/pipeline/validate-positions.spec.ts`: describe
      nuevo `R1 (reject-future-positions #27): normalize() descarta el ts
      futuro fuera del margen de tolerancia`, con `nowMs = 1_000_000`, una
      posición de `ts: nowMs + FUTURE_TS_TOLERANCE_MS + 1` → `accepted`
      vacío, `discarded[0].reason === 'future_ts'`; y un segundo `it` con
      lote mixto (pasada + futura) → solo cae la futura.
- [ ] (2) Implementación: `'future_ts'` en el union `DiscardReason`
      (`src/pipeline/types.ts:24`); `nowMs?: number` como segundo parámetro
      de `normalize()`; import de `FUTURE_TS_TOLERANCE_MS` desde
      `./constants`; guarda entre las líneas 40 y 41 ([[design]] §D5):
      `if (nowMs !== undefined && position.ts > nowMs + FUTURE_TS_TOLERANCE_MS)`
      → `discarded.push({ reason: 'future_ts', position }); continue;`
- [ ] (3) Refactor: actualizar el JSDoc de `normalize()` (líneas 19-26) para
      documentar el descarte por `ts` futuro y el parámetro `nowMs`.
      Verificar que el `it` de pureza de la línea 83 sigue verde **sin
      tocarlo** y que el segundo `it` de R8 ya pasa.

### R2 — el margen de tolerancia no cuesta telemetría real

- [ ] (1) Test rojo/verde-de-borde en el mismo archivo: describe nuevo
      `R2 (reject-future-positions #27): un ts adelantado dentro del margen
      de tolerancia se acepta`, con tres `it`: `nowMs + 1` aceptada,
      `nowMs + FUTURE_TS_TOLERANCE_MS` aceptada (borde **inclusivo**),
      `nowMs + FUTURE_TS_TOLERANCE_MS + 1` descartada. Escribirlo **antes**
      de dar por buena la implementación de R1: es lo que fija que la
      comparación sea `>` y no `>=`.
- [ ] (2) Implementación: cubierta por R1 si la comparación es estricta; si
      no, corregir el operador.
- [ ] (3) Refactor con tests verdes.

### R3 — el núcleo puro no inventa un "ahora"

- [ ] (1) Test rojo: `it` `R3 (reject-future-positions #27): sin nowMs no se
      filtra nada` dentro del describe de R2, con una posición de `ts` a
      años vista y `normalize([futura])` **sin** segundo argumento →
      `accepted.length === 1`, `discarded.length === 0`.
- [ ] (2) Implementación: cubierta por R1 (`nowMs !== undefined` en la
      guarda). Prohibido cualquier `nowMs = Date.now()` por defecto.
- [ ] (3) Refactor. Verificar que el `it` de pureza de la línea 83 sigue
      verde sin editarse y que `src/pipeline/trips.spec.ts` (que llama
      `normalize(raw)` sin `nowMs` en la línea 106) sigue verde sin
      editarse.

## Bloque C — el watermark (cierra el fallo irreversible)

### R6 — el watermark nunca avanza por delante de `now`

- [ ] (1) Test rojo en `src/workers/poller.service.spec.ts`: describe nuevo
      `R6 (reject-future-positions #27): el watermark nunca avanza por
      delante de now`, con `wialonStub([positionAt(NOW.getTime() - 30_000),
      positionAt(NOW.getTime() + 86_400_000)])` y assertion
      `advanceWatermark.mock.calls[0][1].getTime() === NOW.getTime()`. Más un
      `it` de no-regresión con todas las posiciones pasadas → se sigue
      guardando `lastTs`.
- [ ] (2) Implementación en `src/workers/poller.service.ts:126-127`:
      `new Date(Math.min(lastTs, now.getTime()))`.
- [ ] (3) Refactor: actualizar el comentario de las líneas 123-125 para
      documentar el tope y por qué es redundante con R1 a propósito.
      Verificar que el describe `R10` de #8 (líneas 208-267) sigue verde sin
      tocarse.

### R7 — un watermark envenenado se recupera solo

- [ ] (1) Test rojo en el mismo archivo: describe nuevo
      `R7 (reject-future-positions #27): un watermark envenenado en el
      futuro se recupera solo en el siguiente ciclo`, con
      `assignment({ ingestWatermark: new Date(NOW.getTime() + 86_400_000) })`
      y los tres `it` (a), (b) y (c) de [[requirements]] R7. Hoy (a) falla
      porque `getMessages` recibe el watermark futuro tal cual.
- [ ] (2) Implementación en `pollAssignment()`
      (`src/workers/poller.service.ts:88-90`): el cálculo de `fromTs` de
      [[design]] §D1, con el `logger.warn` de recuperación. Reutilizar
      `CLAIM_WATERMARK_LOOKBACK_MINUTES`, ya importado en la línea 11 — nada
      de constante nueva.
- [ ] (3) Refactor: actualizar el comentario de las líneas 86-87 para cubrir
      los tres casos (`NULL`, envenenado, normal). Verificar que el `it`
      `R9: 'con ingest_watermark NULL usa now - CLAIM_WATERMARK_LOOKBACK_
      MINUTES como inicio'` (línea 132) sigue verde sin editarse.

## Bloque D — el consumidor

### R4 — el consumidor pasa `now` a `normalize()`

- [ ] (1) Test rojo en `src/workers/positions-consumer.service.spec.ts`:
      describe nuevo `R4 (reject-future-positions #27): el consumidor pasa
      now a normalize() y no persiste la posición futura`, con un body de 2
      posiciones (`BASE_TS` y `NOW.getTime() + FUTURE_TS_TOLERANCE_MS +
      60_000`) y assertions sobre el `BatchWriteCommand` (un item),
      `updatePetLastPosition` (con `ts === BASE_TS`) y
      `detail.positions.length === 1`.
- [ ] (2) Implementación en `src/workers/positions-consumer.service.ts:179`:
      `normalize(parsed.positions, now.getTime())`.
- [ ] (3) Refactor con tests verdes. Verificar que **ningún** `it` existente
      del archivo hizo falta editar (todos usan `drainOnce(NOW)` con
      `BASE_TS < NOW`).

### R5 — los descartes dejan de desaparecer

- [ ] (1) Test rojo en el mismo archivo: describe nuevo
      `R5 (reject-future-positions #27): los descartes se loguean agrupados
      por razón`, con un `it` que espía `Logger.prototype.warn` (`Logger` ya
      está importado en la línea 15) sobre un lote con una futura y un
      duplicado y asevera
      `{ scope: 'consumer', deviceId, petId, discarded: { future_ts: 1,
      duplicate_ts: 1 } }`; y otro `it` que asevera cero llamadas a `warn`
      con un lote limpio.
- [ ] (2) Implementación: destructurar `const { accepted, discarded } =
      normalize(...)` en la línea 179, helper local
      `countByReason(discarded: DiscardedStat[]): Record<string, number>` y
      un `this.logger.warn({...})` bajo `if (discarded.length > 0)`. El
      mensaje SQS se sigue procesando y borrando igual.
- [ ] (3) Refactor con tests verdes.

## Cierre

- [ ] `pnpm -C backend-pet-tracker run build` verde.
- [ ] `pnpm -C backend-pet-tracker test` verde, sin `skipped` inesperados.
- [ ] `pnpm -C backend-pet-tracker run test:e2e` verde (Docker + LocalStack
      arriba; `test/ingestion.e2e-spec.ts` es el relevante y **no** debe
      editarse).
- [ ] `git diff --name-only main...HEAD` **no** contiene ninguno de:
      `src/pipeline/__fixtures__/walk.json`,
      `src/pipeline/geofence-eval.ts`, `src/pipeline/geofence-eval.spec.ts`,
      `src/pipeline/geofence-eval-untouched.spec.ts`,
      `src/pipeline/trips.spec.ts`,
      `src/integrations/wialon/fake-wialon.client.ts`,
      `test/ingestion.e2e-spec.ts`.
- [ ] `./init.sh` desde la raíz termina en verde.
- [ ] `docs/wialon-module.md` actualizado: fila de `FUTURE_TS_TOLERANCE_MS`
      en la tabla de umbrales y mención de `future_ts` en la descripción de
      `normalize(raw)`.
- [ ] [[traceability]] sin ninguna fila "pendiente".
- [ ] `progress/impl_reject-future-positions.md` con la evidencia (comandos
      y salidas), incluida la salida del `git diff --name-only` de arriba.
