---
feature: "reject-future-positions"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[reject-future-positions]]

> Rutas relativas a `backend-pet-tracker/`. Los tests **nuevos** nombran su
> requisito como `R<n> (reject-future-positions #27): ...` (ver [[tasks]]).
> El implementer actualiza esta tabla tras cada commit; el reviewer la valida
> al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Requisitos

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/pipeline/validate-positions.spec.ts::R1 (reject-future-positions #27): normalize() descarta el ts futuro fuera del margen de tolerancia` (2 `it`) | rojo: `47d29dc feat(reject-future-positions): add future timestamp rejection tests (R1)`; verde: `f9e6c03 feat(reject-future-positions): reject implausible future positions (R1,R2,R3,R8)` |
| R2 | `src/pipeline/validate-positions.spec.ts::R2 (reject-future-positions #27): un ts adelantado dentro del margen de tolerancia se acepta` (3 `it`: `nowMs + 1`, borde inclusivo, borde exclusivo) | rojo: `951feb4 feat(reject-future-positions): add tolerance boundary tests (R2)`; verde: `f9e6c03 feat(reject-future-positions): reject implausible future positions (R1,R2,R3,R8)` |
| R3 | `src/pipeline/validate-positions.spec.ts::R2 (...)::'R3 (reject-future-positions #27): sin nowMs no se filtra nada'` + el `it` existente de pureza `::R5: ... 'es una funcion pura: sin imports de NestJS/SDK/ORM, sin reloj ni red (inspeccion de imports)'` (línea 83) verde sin editar | test primero: `22d6442 feat(reject-future-positions): preserve clock-free normalization (R3)`; implementación: `f9e6c03 feat(reject-future-positions): reject implausible future positions (R1,R2,R3,R8)` |
| R4 | `src/workers/positions-consumer.service.spec.ts::R4 (reject-future-positions #27): el consumidor pasa now a normalize() y no persiste la posición futura` | pendiente |
| R5 | `src/workers/positions-consumer.service.spec.ts::R5 (reject-future-positions #27): los descartes se loguean agrupados por razón` (2 `it`) | pendiente |
| R6 | `src/workers/poller.service.spec.ts::R6 (reject-future-positions #27): el watermark nunca avanza por delante de now` (2 `it`) | pendiente |
| R7 | `src/workers/poller.service.spec.ts::R7 (reject-future-positions #27): un watermark envenenado en el futuro se recupera solo en el siguiente ciclo` (3 `it`: a, b, c) | pendiente |
| R8 | `src/pipeline/validate-positions.spec.ts::R8 (reject-future-positions #27): FUTURE_TS_TOLERANCE_MS vive en pipeline/constants.ts` (2 `it`) | rojo: `e83b891 feat(reject-future-positions): add tolerance constant tests (R8)`; constante: `d304c71 feat(reject-future-positions): define future timestamp tolerance (R8)`; verde: `f9e6c03 feat(reject-future-positions): reject implausible future positions (R1,R2,R3,R8)` |
| R9 | Sin test nuevo: `pnpm -C backend-pet-tracker test` + `run test:e2e` verdes y `git diff --name-only main...HEAD` sin los archivos de [[tasks]] §Cierre | pendiente |

## Cobertura de los `acceptance_criteria` de `feature_list.json` #27

| # | Criterio de aceptación (abreviado) | Requisito(s) | Estado |
|---|---|---|---|
| 1 | Una posición con `ts` posterior a ahora más el margen se descarta en la función pura y queda marcada como anomalía, con test que la nombre | R1 (descarte + `reason: 'future_ts'`), R3 (`nowMs` viene del caller) | cubierto por `47d29dc`/`22d6442` → `f9e6c03` |
| 2 | Una posición ligeramente adelantada **dentro** del margen SÍ se acepta: el desfase de reloj legítimo no cuesta telemetría | R2 (los tres bordes) | cubierto por `951feb4` → `f9e6c03` |
| 3 | El watermark nunca queda por delante de ahora, ni aunque el filtro anterior se salte: test que alimenta una posición futura directamente al avance | R6 (`Math.min(lastTs, now)` en el poller, que no invoca `normalize()`) | pendiente |
| 4 | Un device con el watermark ya envenenado se recupera solo en el siguiente ciclo, sin tocar la base a mano | R7a (vuelve a ingestar), R7b (la fila queda reparada en disco), R7c (se recupera igual si el ciclo no trae posiciones) | pendiente |
| 5 | La constante de tolerancia vive en `src/pipeline/constants.ts` con su justificación, no dispersa en el poller | R8 (valor + ausencia de literales) | cubierto por `e83b891` → `d304c71`/`f9e6c03` |
| 6 | El comportamiento con `ts` normal no cambia: los fixtures de #8 y #10 siguen verdes sin tocarlos | R9a-R9e, habilitado por R3 (`nowMs` opcional — ver [[design]] §D2) | pendiente |

## Tests de features anteriores actualizados, no borrados

> Una fila por cada test existente cuyo **comportamiento esperado** cambia.
> El reviewer rechaza si algún `it` de #8/#10/#12/#30 desapareció del árbol
> sin aparecer aquí con su justificación.

| Test | Feature dueña | Qué cambia y por qué | Commit |
|---|---|---|---|
| _(ninguno previsto)_ | — | El inventario de [[design]] §Inventario de riesgo audita test por test y concluye que ninguno necesita edición. Si esta tabla deja de estar vacía, el diseño se desvió de la spec y el reviewer debe pedir justificación explícita | — |

## Tests que deben quedar verdes SIN editarse

> Comprobación explícita del reviewer: si alguno de estos hizo falta tocarlo,
> el diseño se desvió de la spec.

- `src/pipeline/validate-positions.spec.ts`, describes `R5`, `R6` y `R7` de
  #8 (líneas 19-226) — #27 solo **añade** describes al final. Incluye el `it`
  de pureza de la línea 83 (R3) y el `it` de umbrales de la línea 76, que no
  enumera claves y por tanto sobrevive a la constante nueva (R8).
- `src/pipeline/trips.spec.ts`, incluido `normalizedWalkFixture()` (línea
  101) que llama `normalize(raw)` **sin** `nowMs` — R3/R9b.
- `src/pipeline/__fixtures__/walk.json` — R9a. Sus `ts` son absolutos y
  pasados (`1785542430000`, 2026-08-02); no envejecen hacia el futuro.
- `src/pipeline/geofence-eval.ts` y `src/pipeline/geofence-eval.spec.ts` —
  R9c. #27 no los toca, así que **no** hay recálculo de sha256.
- `src/pipeline/geofence-eval-untouched.spec.ts` completo, incluidos los dos
  sha256 (líneas 35-38) y el describe `R19` de valores de constantes (líneas
  52-75) — R9c/R9d. Ese describe asevera valores, no el conjunto de claves
  exportadas.
- `src/workers/positions-consumer.service.spec.ts`, todos los describes de
  #8 y #30 (líneas 151-1000+) — R4/R9. Todos llaman `drainOnce(NOW)` con
  `BASE_TS = NOW.getTime() - 60_000`, anterior a `NOW`.
- `src/workers/poller.service.spec.ts`, describes `R9`, `R10` y `R11` de #8
  (líneas 99-350) — R6/R7. Auditado: los `ts` del describe `R10` son
  anteriores a `NOW`, así que `Math.min(lastTs, now)` devuelve `lastTs`.
- `src/integrations/wialon/fake-wialon.client.ts` y su spec — el simulador
  no puede emitir `ts > toTs` ([[requirements]] §Contexto); fuera de alcance.
- `test/ingestion.e2e-spec.ts` completo — R9e.

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(reject-future-positions): <desc> (R1,R2)`.
