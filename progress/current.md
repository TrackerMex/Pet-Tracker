# Sesión activa

> Este archivo describe el estado de la sesión en curso.
> Al cerrar la sesión, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #27 — reject-future-positions (P1)

- **Inicio**: 2026-08-15, 23:40
- **Branch**: `feature/27-reject-future-positions` (desde `main` con #30 ya mergeada, `c8ef83b`)
- **Estado**: `pending` → escribiendo spec (gate humano pendiente)

### Plan

1. `spec_author` escribe `specs/reject-future-positions/{requirements,design,tasks,traceability}.md`
2. **PARADA** — gate humano: aprobar la spec en `requirements.md`
3. Handoff a Codex CLI (commits test-primero, rojo→verde por R-id)
4. `reviewer` cuando el humano confirme que Codex terminó

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
