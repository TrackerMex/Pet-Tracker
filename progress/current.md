# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## #125 reminder-advance-already-past (sesion Backend, worktree Pet-Tracker-wt-backend)

- 2026-09-24: branch `feature/125-reminder-advance-already-past` desde origin/main 40ec1b46 (#162
  mergeada: #123 + registro de #125). Aviso a Frontend (#122 en curso, sin solape de ficheros).
- init.sh de linea base en 40ec1b46 (turno cedido por Frontend): exit=0 sin pipe. Backend unit
  170 / 1298; movil 83 / 1491; e2e 27 + 3 skipped. LocalStack devuelto.
- spec_author: spec en `specs/reminder-advance-already-past/` (commit 6169eca4), #125 en
  `spec_ready`. Una sola spec (D1); push en espanol fijo con fecha/hora en la zona del owner via
  findOwnerTimezone (D2, D3); chips desactivados con seleccion derivada (D6, se aparta de la
  sugerencia del leader con motivo medido). Backend +1 suite / +9, movil +12, +0 claves, e2e +0.
- Espejo en Notion, gate "En revision": https://app.notion.com/p/3e56115a9b278131af7ce26582626036
- Siguiente: firma humana en Notion -> commit de firma -> aviso a Frontend -> handoff a Codex.
