# Sesión activa

> Este archivo describe el estado de la sesión en curso.
> Al cerrar la sesión, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #30 — geofence-eval-full-batch (P1)

- **Inicio**: 2026-08-15, 20:21
- **Branch**: `feature/30-geofence-eval-full-batch`
- **Estado**: `spec_ready` (spec escrita) — **PARADO en el gate humano**

### Plan

1. ~~`spec_author` escribe `specs/geofence-eval-full-batch/{requirements,design,tasks,traceability}.md`~~ — hecho, 11 R-ids (R1..R11)
2. **PARADA AQUÍ** — gate humano: marcar la casilla en `requirements.md:321`
3. Handoff a Codex CLI (commits test-primero, rojo→verde por R-id)
4. `reviewer` cuando el humano confirme que Codex terminó

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
