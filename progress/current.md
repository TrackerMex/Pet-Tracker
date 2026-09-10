# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #82 — vaccine-due-today-inclusive

- **Branch**: `feature/82-vaccine-due-today-inclusive` (desde `origin/main` @ 7f298f2, merge de #118/#76)
- **Worktree**: `/home/claude/sites/Pet-Tracker-wt-backend` (sesion Backend; Frontend trabaja #87 en `/home/claude/sites/Pet-Tracker`)
- **Inicio**: 2026-09-10
- **Estado**: `spec_ready` -> esperando gate humano (exploracion y spec escritas 2026-09-10, sin aprobar)
- **Prioridad**: P3

### Plan

1. Base: `main` 7f298f2 es byte a byte el cierre de #76 (init.sh exit 0 sobre ese arbol el 2026-09-10); no se repite.
2. `explorer` -> `progress/explore_vaccine-due-today-inclusive.md`: como calcula "hoy" cada
   pantalla movil, que tipo de columna tiene `dueAt` de vacunas, si el backend recibe alguna
   pista de zona horaria del cliente, y que patrones (reminders, #70 calendarDaysUntil) ya existen.
3. `spec_author` con la exploracion verificada contra el arbol.
4. **PARADA**: gate humano (aprobacion por commit en branch).
5. Handoff a Codex CLI; `reviewer`; PR.

### Coordinacion con la sesion Frontend

- Mismo protocolo que #76: `pgrep -af 'init\.sh'` y aviso por SendMessage antes de cada gate.
- `feature_list.json` por linea; ids nuevos desde #88 (Frontend reservo #87).
