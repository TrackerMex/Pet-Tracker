# Sesión activa

> Este archivo describe el estado de la sesión en curso.
> Al cerrar la sesión, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #26 — claim-activation-code-only

- **Inicio:** 2026-08-15
- **Branch:** `feature/26-claim-activation-code-only`
- **Estado de entrada:** `pending` (sin spec). Sesión anterior (#24) cerrada,
  PR #51 de bookkeeping mergeada (`4e8fec8`).
- **Objetivo:** dejar `activationCode` como única credencial de
  `POST /v1/devices/claim`; hoy un imei/esn/serialNumber adivinado reclama el
  collar igual que el código secreto.

### Plan

1. `spec_author` escribe `specs/claim-activation-code-only/` (requirements EARS,
   design, tasks, traceability) y cierra la decisión abierta: ¿los tres campos
   retirados se ignoran en silencio (precedente #22) o devuelven 400?
2. **PARADA** — gate humano: aprobar la spec en `requirements.md`.
3. Handoff a Codex CLI (implementación), con commits test-primero explícitos.
4. `reviewer` cuando Codex termine.

### Notas de entorno

- `./init.sh` verde, **pero los e2e se saltaron**: Docker Desktop apagado
  (puerto 5432 sin respuesta). Antes de implementar hay que levantar la infra
  (`docker compose up -d`) — esta feature se valida con e2e de devices.
