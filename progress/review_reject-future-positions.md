# review: reject-future-positions (#27)

Fecha: 2026-08-16
Branch: `feature/27-reject-future-positions`
Implementador: Codex CLI
Veredicto: **APROBADO**

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` (#27; verificado con
      `grep -c '"status": "in_progress"'` → 1). init.sh también lo valida.
- [x] `progress/current.md` describe la sesión activa, incluido el STOP en R4,
      la enmienda y el punto exacto donde entra el `reviewer`.
- [x] `progress/history.md` cierra la sesión anterior (#30). #27 sigue abierta:
      su entrada la escribe el `leader` al cerrar.

## Checklist C3 — Arquitectura

- [x] `src/pipeline/validate-positions.ts` sigue siendo núcleo puro: importa
      solo `./constants`, `./geo` y `./types`. Sin NestJS, sin SDK, sin ORM.
- [x] `src/pipeline/constants.ts` sigue **sin ningún `import`** (R8).
- [x] El reloj entra por parámetro desde la capa de workers
      (`now.getTime()` en el consumer, `now` en el poller); el núcleo no lo
      inventa. Regla de dependencia hacia adentro respetada.
- [x] `infrastructure` (workers, drizzle store) no gana lógica de negocio:
      el único helper nuevo, `countByReason()`, es agregación de logging.

## Checklist C4 — TDD

- [x] Cada `R<n>` tiene al menos un test que lo nombra con el formato exacto
      de `requirements.md` (`R<n> (reject-future-positions #27): ...`):

  | R | Test | Cuenta |
  |---|---|---|
  | R1 | `validate-positions.spec.ts::describe R1 (...)` | 2 `it` |
  | R2 | `validate-positions.spec.ts::describe R2 (...)` | 3 `it` |
  | R3 | `it('R3 (reject-future-positions #27): sin nowMs no se filtra nada')` dentro del describe de R2 + el `it` de pureza de la línea 83 verde y sin editar | 1 + 1 |
  | R4 | `positions-consumer.service.spec.ts::describe R4 (...)` | 1 `it` |
  | R5 | `positions-consumer.service.spec.ts::describe R5 (...)` | 2 `it` |
  | R6 | `poller.service.spec.ts::describe R6 (...)` | 2 `it` |
  | R7 | `poller.service.spec.ts::describe R7 (...)` | 3 `it` (a, b, c) |
  | R8 | `validate-positions.spec.ts::describe R8 (...)` | 2 `it` |
  | R9 | Sin test nuevo (por diseño): suites verdes + ausencia en el diff | — |

  16 tests nuevos, que cuadran exactamente con el salto de la suite unitaria:
  977 (baseline de Codex) → 993 (mi ejecución).

- [x] El historial muestra test-primero por requisito, no todo junto.
      Verificado con `git show <sha> --stat`: **todos los commits rojos tocan
      exclusivamente archivos `.spec.ts`**.

  | R | Rojo (solo tests) | Verde (producción) |
  |---|---|---|
  | R8 | `e83b891` (spec, +18) | `d304c71` (constants.ts) → `f9e6c03` |
  | R1 | `47d29dc` (spec, +31) | `f9e6c03` |
  | R2 | `951feb4` (spec, +31) | `f9e6c03` |
  | R3 | `22d6442` (spec, +9) | `f9e6c03` |
  | R6 | `4ae0b89` (spec, +37) | `8da6cf9` (poller.service.ts) |
  | R7 | `c1a8404` (spec, +79) | `2719a6b` (poller.service.ts) |
  | R4 | `6182328` (spec, +38) | `577c7f4` (consumer.ts) |
  | R5 | `a90f796` (spec, +56) | `7cddf71` (consumer.ts) |

- [x] **`f9e6c03` cierra R1, R2, R3 y R8 a la vez, y los tres commits de test
      previos son realmente rojos** (punto pedido explícitamente):
  - `e83b891` importa `FUTURE_TS_TOLERANCE_MS` de `./constants`, que **aún no
    existía** → fallo de compilación TS. El propio reporte de Codex registra
    `Tests: 2 failed, 18 passed`.
  - `47d29dc` y `951feb4` llaman `normalize(raw, nowMs)` con **dos**
    argumentos cuando la firma todavía era `normalize(raw)` (TS2554), y
    esperan `reason: 'future_ts'`, valor que aún no estaba en `DiscardReason`.
    Rojos por partida doble.
  - `22d6442` (R3) es el único que no puede ser rojo *por naturaleza*: asevera
    que **sin** `nowMs` no cambia nada, así que pasa antes y después. Es un
    test de caracterización que blinda a `f9e6c03` contra la regresión que ese
    mismo commit podría introducir. `traceability.md` es honesta y lo etiqueta
    "test primero", no "rojo". Correcto y conforme a la spec, que prescribió
    exactamente ese `it`.

- [x] Tres commits verdes tocan también el `.spec` — inspeccionados uno a uno,
      **ninguna assertion se debilitó**: `577c7f4` y `7cddf71` son reajustes de
      formato (prettier) sobre líneas que ellos mismos habían añadido, y
      `1dfb7e7` es lint/formato más un cast de tipado
      (`mock.calls[0] as [string, Date]`) que deja las assertions idénticas.

## Checklist C5 — Trazabilidad

- [x] `traceability.md` **sin ninguna fila "pendiente"**: las 9 filas de
      requisitos, las 6 de `acceptance_criteria` y las **2 de §Tests de
      features anteriores actualizados** están cerradas con hash.
- [x] Los commits siguen el formato `feat(reject-future-positions): <desc>
      (R-ids)`. El único `test(...)` (`5396c55`) es el prefijo que
      `tasks.md` §R4 paso (0) prescribió literalmente.

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved`; `design.md`, `tasks.md` y
      `traceability.md` también.
- [x] Casilla humana marcada: `[X] Aprobado por humano (2026-08-15)`.
- [x] R9 se modificó tras la aprobación **pasando de nuevo por el gate**:
      enmienda en `479ee7d` + `[X] Enmienda R9(f) aprobada por humano
      (2026-08-16)`. El commit de la enmienda es **anterior** a `5396c55`, así
      que el permiso existía antes de la edición, no después.

## Checklist C7 — Sin código huérfano

- [x] N/A — #27 **añade** un filtro y un tope; no reemplaza ni deja obsoleto
      ningún componente. Ningún `it` borrado ni renombrado en todo el branch.

---

## Verificación punto por punto del encargo

### 1. Trazabilidad R1..R9

Cerrada. Todos los describes nombran su R-id con el formato exacto. Las dos
filas de §Tests de features anteriores actualizados apuntan a `5396c55` con la
justificación y la referencia a R9(f).

### 2. C4 — commits test-primero

Verificado con `git show --stat` commit a commit (tabla arriba). Sin excepción,
los rojos son test-only.

### 3. La excepción R9(f) — `5396c55`

`git show 5396c55` devuelve **1 archivo, 2 inserciones, 2 supresiones**:

```diff
@@ -283,7 +283,7 @@  it('parte lotes de mas de 25 items en BatchWrite de <=25'
-      ts: BASE_TS + i * 30_000,
+      ts: BASE_TS - (60 - 1 - i) * 30_000,
@@ -683,7 +683,7 @@  describe('R5 (geofence-eval-full-batch #30) ...') → oneHundredPositions()
-      ts: BASE_TS + index * 30_000,
+      ts: BASE_TS - (100 - 1 - index) * 30_000,
```

- **Exactamente los dos `it` autorizados.** Prueba independiente y más fuerte
  que leer el commit: en **todo el branch**, el `.spec` del consumer solo tiene
  **dos líneas suprimidas**, y son estas dos.
  `git diff main...HEAD -- positions-consumer.service.spec.ts | grep "^-"` →
  únicamente `ts: BASE_TS + i * 30_000` y `ts: BASE_TS + index * 30_000`.
  Todo lo demás en ese archivo es adición pura (los describes R4 y R5).
  `oneHundredPositions()` es un helper local del describe de #30 (definido en
  679, usado en 696 y 716, ambos dentro de ese describe: no se filtra fuera).
- **Solo la expresión de los `ts`.** Nada más cambia de línea.
- **Conteos, espaciado, orden y assertions intactos**: `length: 60` y
  `length: 100` sin tocar, paso de `30_000` sin tocar, ventana ascendente
  (crece con el índice), nombres de `it` idénticos. `expect(batchSizes)
  .toEqual([25, 25, 10])` sigue en la línea 306 y
  `expect(detail.positions).toHaveLength(100)` en la 731, ambas sin aparecer
  en ningún diff del branch.
- **Commit propio** con el mensaje prescrito, y **verde antes de tocar
  producción**: `5396c55` va después de la enmienda `479ee7d` y **antes** de
  `6182328`/`577c7f4`. En ese punto el consumer todavía llamaba
  `normalize(parsed.positions)` con un solo argumento, así que el cambio era
  behaviouralmente neutro y la suite no podía romperse; el reporte de Codex
  registra `27 passed` en ese commit, el mismo número que el baseline previo.

Sin assertions debilitadas y sin ningún otro `it` tocado.

### 4. R1/R2 — el borde

`validate-positions.ts:43`:

```ts
if (nowMs !== undefined && position.ts > nowMs + FUTURE_TS_TOLERANCE_MS) {
```

Comparación `>`, no `>=`: `ts === nowMs + FUTURE_TS_TOLERANCE_MS` **se acepta**
(borde inclusivo, R2). Ubicación correcta: después del `hasValidTs()` de la
línea 39 y **antes** del `seenTs.has()` de la 47, así que una posición futura
no ocupa entrada de `seenTs` (R1). Se apila en `discarded` como las demás
razones. `'future_ts'` añadido a `DiscardReason` en `types.ts`.

### 5. R3 — pureza

Firma `normalize(raw: RawPosition[], nowMs?: number)`. El archivo completo no
contiene `Date.now()`, `new Date(` ni ningún default derivado del reloj — el
filtro entero está tras la guarda `nowMs !== undefined`, sin rama alternativa.
El `it` de pureza estática de la línea 83 sigue verde y **sin editarse** (el
`.spec` no tiene supresiones fuera de las dos autorizadas).

### 6. R6/R7 — el watermark por los dos lados

- Escritura (R6): `advanceWatermark(deviceId, new Date(Math.min(lastTs, nowMs)))`.
- Lectura (R7): `hasFutureWatermark` descarta el valor envenenado y cae al
  suelo `lookbackTs = nowMs - CLAIM_WATERMARK_LOOKBACK_MINUTES * 60_000`,
  **reutilizando la constante existente**; ninguna constante nueva. Log `warn`
  con `{ scope: 'poller', deviceId, unitId, ingestWatermark }`.
- (a) `getMessages` con el rango de recuperación y `SendMessageCommand`
  emitido — aseverado.
- (b) **La fila queda reparada en disco porque el watermark retrocede.**
  Comprobado más allá del mock: `IngestionDrizzleStore.advanceWatermark()`
  (`ingestion.drizzle.store.ts:47`) es un `UPDATE ... SET ingest_watermark`
  **sin guarda de monotonía** — el "solo si más reciente" de #8 R14 vive en
  `updateDeviceTelemetry`/`updatePetLastPosition`, no aquí. El retroceso
  ocurre de verdad en Postgres, no solo en el stub. El test asevera
  `<= NOW` **y** `< poisonedWatermark`.
- (c) Con `wialonStub([])`: `advanceWatermark` sin llamadas (la fila conserva
  el valor envenenado) y `getMessages` vuelve a usar el suelo — se recupera
  igual en el ciclo siguiente porque el tope está en la **lectura**.

### 7. R8 — la constante

`FUTURE_TS_TOLERANCE_MS = 5 * 60_000` en `src/pipeline/constants.ts:16`, con
justificación JSDoc en el estilo del archivo ("Cubre la deriva legitima de RTC,
GPS y red entre collar y servidor; adelantos de hardware roto por horas, dias o
anos quedan fuera"). `constants.ts` **sigue sin ningún `import`**. Ningún
literal `300_000`/`300000` en los tres consumidores: el grep sobre las líneas
añadidas del branch solo encuentra los dos `expect(source).not.toContain(...)`
del propio test de R8.

### 8. R9(a)-(e) — nada prohibido en el diff

```
$ git diff --name-only main...HEAD | grep -cE "walk\.json|geofence-eval\.ts|geofence-eval\.spec\.ts|geofence-eval-untouched\.spec\.ts|trips\.spec\.ts|fake-wialon\.client\.ts|test/ingestion\.e2e-spec\.ts"
0
```

Los siete archivos ausentes. `geofence-eval-untouched.spec.ts` no aparece en el
diff en absoluto, así que **los dos sha256 del guard de #30 no se
recalcularon**, y su describe `R19` de valores de constantes sigue verde sin
editarse pese a la constante nueva.

### 9. Alcance

- [x] `docs/wialon-module.md` actualizado (`65b3af3`): fila
      `FUTURE_TS_TOLERANCE_MS (5 min)` en la tabla de umbrales y firma
      `normalize(raw, nowMs?)` con la mención de `future_ts`.
- [x] Sin env vars nuevas, sin migraciones, sin dependencias nuevas: el diff de
      `src/` no añade ningún `process.env` y no toca `db/`.
- [x] Sin `console.log`/`console.debug` de debug, sin TODO/FIXME/XXX.
- [x] `feature_list.json`: #27 `pending` → `in_progress`. No se marcó `done`
      por su cuenta. Correcto.

**`STATUS.md` (lo que se pidió comprobar):** Codex lo editó en `e1ff5bc` junto
al reporte. Qué hizo: fecha a 2026-08-16, movió #27 de "Pendientes" a
"En progreso" (7 → 6 pendientes), y añadió un bloque en §Estado actual y otro
en §Última sesión describiendo la implementación.

Juicio: **no invade el cierre y no es motivo de rechazo**, pero es una
extralimitación menor de alcance —`STATUS.md` no está en `tasks.md` §Cierre y
el bookkeeping de cierre es del `leader`—. Lo determinante es que **no reclama
`done`**: el texto dice explícitamente "pendiente de revisión" y "sigue
`in_progress`", y **no tocó `Features completadas: 23/30`**, que es justo la
línea que init.sh valida contra `feature_list.json`. O sea: el edit no fue
necesario para dejar init.sh verde, pero tampoco falsea nada.

Acción para el `leader` al cerrar: `STATUS.md` necesita **otra** pasada
(23/30 → 24/30, quitar #27 de "En progreso", reescribir el bloque como `done`)
y la entrada correspondiente en `progress/history.md`. El texto de Codex es un
borrador utilizable, no el cierre.

---

## Regresiones

Ninguna. Suite unitaria 977 → 993 (+16, exactamente los tests nuevos), 134
suites, 0 fallos. E2E idéntica al baseline previo a la feature: 260 pasados,
2 suites / 6 tests `skipped` — son las suites `AWS_MODE=aws`
(`aws-real-smoke`, `aws-real-ingest`), que ya se saltaban antes de #27 y que
`docs/verification.md` corre a mano contra la cuenta real. No hay `skipped`
nuevos.

El volcado `DrizzleQueryError` / `pet_users_user_id_users_id_fk` que aparece en
el log de e2e es ruido de un test de camino negativo del módulo `pets` (la
suite pasa 260/260); aparece igual en el baseline de Codex previo a la feature
y es ajeno al pipeline. No es regresión de #27.

## Verificación independiente

Corrida por el `reviewer`, no aceptada del reporte. Antes de nada, puertos
comprobados (memoria: init.sh salta los e2e en silencio si 5432 no responde):

```
$ docker port pet-tracker-postgres    → 5432/tcp -> 0.0.0.0:5432
$ docker port pet-tracker-localstack  → 4566/tcp -> 0.0.0.0:4566
  pet-tracker-postgres    Up 5 hours (healthy)
  pet-tracker-localstack  Up 5 hours (healthy)
```

Los e2e **se ejecutaron de verdad** (260 tests, 69 s), no se saltaron.

## Output de ./init.sh

```
→ Verificando entorno...
✅ node disponible (/c/Program Files/nodejs/node)
✅ pnpm disponible (/c/Users/alex/AppData/Local/pnpm/pnpm)

→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida

→ Instalando dependencias...
✅ Dependencias instaladas

→ Verificando coherencia del harness...
✅ Archivos del harness presentes
✅ STATUS.md sincronizado con feature_list.json

→ Build...
✅ Build exitoso

→ Ejecutando tests...
Test Suites: 134 passed, 134 total
Tests:       993 passed, 993 total

Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
✅ Tests pasados

→ Tests e2e...
Test Suites: 2 skipped, 17 passed, 17 of 19 total
Tests:       6 skipped, 260 passed, 266 total
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 23/30 completadas | 6 pendientes

  Próxima feature:
  [#23] init-env-drift-warning (P2)

EXIT=0
```

(Ejecutado dos veces, ambas exit 0. Log completo del segundo run en el
scratchpad de la sesión.)

## Observaciones

Ninguna bloqueante. Tres notas para el `leader`:

1. **`STATUS.md` necesita la pasada de cierre** (23/30 → 24/30, #27 fuera de
   "En progreso") más la entrada en `progress/history.md`. Ver §9.
2. **El STOP de Codex fue el comportamiento correcto y merece quedar
   registrado en `history.md`**: paró en R4 en vez de editar dos tests ajenos
   para forzarlos a verde, y el defecto resultó ser de la spec (el inventario
   de riesgo auditó `BASE_TS` y no el incremento acumulado). El precedente que
   vale la pena guardar es el del *auditor de fixtures*: al inventariar tests
   que un filtro temporal nuevo puede romper, hay que evaluar el `ts` **de la
   última posición**, no el de la primera.
3. **Sugerencia, no requisito**: el suelo de recuperación de R7 reutiliza
   `CLAIM_WATERMARK_LOOKBACK_MINUTES` (10 min), pensado para el claim. Es la
   decisión correcta hoy —cero constantes nuevas— pero si algún día la
   ventana de recuperación necesita ser distinta de la de claim, ese es el
   punto donde se bifurcan. No hace falta tocarlo ahora.
