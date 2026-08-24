# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #47 reminders-api — in_progress

- Inicio: 2026-08-25
- Branch: `feature/47-reminders-api` (desde main)
- Spec aprobada por humano (`e47a686`, check R). Origen: gate de #39 —
  el humano pidió GET listado y DELETE real como feature backend aparte.
- Plan: handoff a Codex (GET /pets/:petId/reminders + DELETE 204 owner,
  Clean Architecture, TDD por R-id) → reviewer → done. Sin smoke de
  infraestructura real (endpoints puros sobre LocalStack/CI).
- #39 mobile-reminders queda spec_ready con dependencia dura de #47.
