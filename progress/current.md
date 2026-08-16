# Sesión activa

> Este archivo describe el estado de la sesión en curso.
> Al cerrar la sesión, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #27 — reject-future-positions (P1)

- **Inicio**: 2026-08-15, 23:40
- **Branch**: `feature/27-reject-future-positions` (desde `main` con #30 ya mergeada, `c8ef83b`)
- **Estado**: `in_progress` — implementación pausada por desvío de diseño en R4

### Avance de implementación

- 2026-08-16 00:04: `./init.sh` inicial verde (build, 977 unitarios, 260 e2e,
  lint y typecheck); spec aprobada y archivos afectados leídos. Inicio de R8
  con disciplina test rojo → implementación.
- 2026-08-16 00:15: R1-R3 y R6-R8 verdes y trazados. STOP antes de R4:
  dos tests existentes generan 47/87 posiciones fuera del margen futuro y
  esperan persistir 60/100; implementar R4 los rompe y la regla dura prohíbe
  editarlos. Evidencia en `progress/impl_reject-future-positions.md`.
- 2026-08-16: **spec enmendada y gate reabierto** (precedente #21). El error
  era de la spec, no de Codex: `design.md` §Inventario de riesgo auditó
  `BASE_TS` pero no el incremento acumulado, y los dos `it` de lote largo
  (líneas 282 y 677) terminan en `NOW + 28,5 min` y `NOW + 48,5 min`. Se
  corrige el fixture, no el requisito — esas ventanas simulan telemetría del
  futuro, que es justo lo que #27 rechaza; un lote de 100 en producción cubre
  una hora **pasada**. R9(f) autoriza editar **solo** la construcción de sus
  `ts`, con conteos y assertions intactos. Enmienda aprobada por el humano el
  2026-08-16. Handoff de continuación entregado a Codex.

### Plan

1. ~~`spec_author` escribe `specs/reject-future-positions/{requirements,design,tasks,traceability}.md`~~ — hecho, 9 R-ids (R1..R9)
2. ~~Gate humano: casilla marcada en `requirements.md:285` (2026-08-15), frontmatter de los 4 archivos a `approved`~~
3. **AQUÍ** — Codex CLI implementa, commits test-primero, reporta en
   `progress/impl_reject-future-positions.md`
4. `reviewer` cuando el humano confirme que Codex terminó

### Qué implementa Codex

Bloques A → B → C → D de `tasks.md`. R8 primero (la constante es prerrequisito
de compilación de R1), luego el filtro puro (R1-R3), el watermark (R6-R7, que es
lo que cierra el fallo irreversible) y el consumidor (R4-R5).

**Un solo escritor**: mientras Codex trabaja, yo solo toco `docs/`, `specs/`,
`progress/` y `feature_list.json` — nunca `backend-pet-tracker/`.

### Problema

Nada valida que el `ts` de una posición esté en el pasado.
`poller.service.ts:126` avanza el watermark a `Math.max(...)` sin tope, así que
una sola posición con `ts` futuro deja `ingest_watermark` en el futuro y el
poller pasa a pedir un rango invertido: **el device deja de reportar para
siempre, en silencio**. Destapado el 2026-08-14 en el smoke de #24 con collar
real; en local el mismo defecto empujó el watermark hasta 2027 con procesos
jest huérfanos.

Arreglo en dos capas a propósito: filtro en la validación pura de
`src/pipeline/` con margen de tolerancia de reloj (constante en
`pipeline/constants.ts`), **y** tope al avance del watermark para que aguante
aunque el filtro se saltee.

### Puntos que la spec debe cerrar

1. Cómo se recupera un device **ya** envenenado: acotar al leer, al escribir o
   ambos. Sin acotar en la lectura no se recupera solo, y el criterio 4 lo exige.
2. Valor y nombre de la constante de tolerancia, con su justificación escrita.
3. Nombre del flag de anomalía nuevo, coherente con `suspect_jump`/`low_accuracy`.
4. De dónde sale "ahora": el pipeline es puro, `nowMs` viene del caller (#11).

### Riesgo conocido

El criterio 6 exige que los fixtures de #8 y #10 queden verdes **sin tocarlos**.
Si alguno construye posiciones con `ts` relativo a `Date.now()`, la validación
nueva los rompe. Es el riesgo real de esta feature y la spec debe inventariarlo.

### Notas de arranque

- `main` al día con la PR #53 mergeada (`c8ef83b`), `./init.sh` verde.
- Grafo de graphify refrescado tras #30 (5272 nodos).
