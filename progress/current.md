# Sesión activa

> Este archivo describe el estado de la sesión en curso.
> Al cerrar la sesión, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #30 — geofence-eval-full-batch (P1)

- **Inicio**: 2026-08-15, 20:21
- **Branch**: `feature/30-geofence-eval-full-batch`
- **Estado**: `in_progress` — handoff entregado, **Codex CLI implementando**

### Plan

1. ~~`spec_author` escribe `specs/geofence-eval-full-batch/{requirements,design,tasks,traceability}.md`~~ — hecho, 11 R-ids (R1..R11)
2. ~~Gate humano: casilla marcada en `requirements.md:321` (2026-08-15), frontmatter de los 4 archivos a `status: approved`~~
3. **AQUÍ** — Codex CLI implementa en `feature/30-geofence-eval-full-batch`,
   commits test-primero (rojo → verde por R-id), reporta en
   `progress/impl_geofence-eval-full-batch.md`
4. `reviewer` cuando el humano confirme que Codex terminó

### Qué implementa Codex

Bloques A → B → C → D de `tasks.md`. R1 primero (prerrequisito duro:
`evaluate()` filtra `suspect_jump`), R2 re-congela los sha256 del guard,
R3-R5 el productor emite `detail.version: 2` con `positions[]`, R6 el schema
acepta v1 y v2, R7-R11 el consumidor itera el lote encadenando estado en
memoria con una sola escritura por geocerca.

**Un solo escritor**: mientras Codex trabaja, yo solo toco `docs/`, `specs/`,
`progress/` y `feature_list.json` — nunca `backend-pet-tracker/`.

### Problema

El evento `position.updated` se emite por mensaje SQS, no por posición
(`positions-consumer.service.ts:234`, efecto colateral de R16 de #8), así que
`geofence-eval.ts` solo ve la posición más reciente del lote. Con
`POSITIONS_PER_MESSAGE_MAX=100` una salida con regreso dentro del lote no
genera alerta. Prerrequisito en la misma feature: `evaluate()` no filtra
`suspect_jump` (`geofence-eval.ts:105`), subir el muestreo sin arreglarlo
duplica la falsa alarma de fuga.

### Notas de arranque

- `./init.sh` verde: 956 tests + 14 de infra, lint y typecheck OK.
- **e2e saltados**: puerto 5432 sin respuesta, no hay contenedores corriendo
  (`docker ps` vacío). Levantar `docker compose up -d` antes de la revisión
  final de la feature.

### Hueco del harness detectado (no es de esta feature)

`init.sh:250` y `:270` eligen y cuentan con `x.status === 'pending'`, así que
en cuanto una feature pasa a `spec_ready` o `in_progress` **desaparece del
anuncio**: con #30 en `spec_ready`, la próxima sesión verá "7 pendientes" y
anunciará #27, no la feature en curso. Además `docs/specs.md` se contradice
consigo mismo: §Estados dice que `spec_ready` exige la marca humana, y §86
manda al `spec_author` ponerlo antes del gate. Candidato natural a plegarse
en #23 (`init-env-drift-warning`). No se toca sin spec.
