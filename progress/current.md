# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #89 — dto-dates-owner-timezone

- **Branch**: `feature/89-dto-dates-owner-timezone` (desde `origin/main` @ 381d1e36, merge de #88 ya integrado)
- **Worktree**: `/home/claude/sites/Pet-Tracker-wt-backend` (el worktree principal lo ocupa #78, sesion Frontend)
- **Inicio**: 2026-09-11
- **Estado**: `pending` -> spec en redaccion
- **Prioridad**: P3

### Plan

1. `init.sh` de base sobre `origin/main` en este worktree (con `env -u FORCE_COLOR`, bug #75 sigue `pending`).
2. `spec_author` escribe `specs/dto-dates-owner-timezone/` (requirements EARS + design + tasks + traceability).
3. **PARADA**: gate humano de aprobacion de la spec (frontmatter `approved` en branch, flujo de aprobacion por commit).
4. Handoff a Codex CLI con la spec autosuficiente.
5. `reviewer` con `init.sh` en primer plano.

### Por que #89

Continuacion directa de #88 (mergeada hoy en PR #120): mismo sesgo UTC, mismos modulos, patron
`ownerLocalDay` ya en `main`. El humano pidio el 2026-09-11 continuar la linea de #88; #88 ya
estaba `done` y mergeada, asi que la siguiente es su deuda declarada.

### Coordinacion con la sesion Frontend

Sesiones paralelas sobre el mismo Postgres de docker. Antes de cada `init.sh` se comprueba que no
haya otro corriendo (`pgrep -f "^bash ./init.sh"`). Mensaje a la sesion Frontend con las dos
preguntas que la spec debe cerrar: formato de `measuredAt` y `birthDate` que manda el movil
(fecha civil o instante UTC) y si alguna pantalla depende del margen de +1 dia en pesos.
