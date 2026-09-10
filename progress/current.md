# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #78 — mobile-alerts-center

- **Branch**: `feature/78-mobile-alerts-center` (desde `main` @ 5666b85, merge de #85 ya integrado)
- **Inicio**: 2026-09-10
- **Estado**: `pending` -> spec en redaccion
- **Prioridad**: P2

### Plan

1. `init.sh` de base sobre `main` recien mergeado (verificacion del arbol antes de especificar).
2. `spec_author` escribe `specs/mobile-alerts-center/` (requirements EARS + design + tasks + traceability).
3. **PARADA**: gate humano de aprobacion de la spec (frontmatter `approved` en branch, segun flujo de aprobacion por commit).
4. Handoff a Codex CLI con la spec ya autosuficiente.
5. `reviewer` y gate humano de smoke (alerta open real en dev build de Android).

### Por que #78 y no las otras dos P2

- **#63** (state-reset) y **#79** (push-registration) siguen `pending`. #79 arranca bloqueada por
  tareas humanas previas (`eas init` con projectId, credenciales FCM V1 en EAS) y su tap solo
  abre Home mientras no exista la ruta de alertas, asi que su propio texto recomienda #78 antes.
- #78 no tiene bloqueos: el backend esta completo desde #12/#13 y el cliente movil no existe.
  Ademas cierra el destino que la spec de #67 dejo prometido para la campana del hero.

### Decision del humano

Eleccion confirmada por el humano en la sesion del 2026-09-10.

### Incidencia del entorno (2026-09-10)

`init.sh` abortó en la primera pasada con `❌ Más de 1 feature en in_progress (0)` habiendo **cero**.
Es el bug **#75 `harness-init-force-color`**, todavía `pending`: este VPS tiene `FORCE_COLOR=3`,
Node imprime el número coloreado y la comparación por cadena de `init.sh:138` no matchea `"0"`.
Workaround usado en esta sesión: `env -u FORCE_COLOR bash ./init.sh`. **Todo gate de esta feature
(incluido el del `reviewer`) tiene que lanzar init.sh así hasta que #75 se arregle.**
