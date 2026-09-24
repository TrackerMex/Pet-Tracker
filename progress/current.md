# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## #121 mobile-home-bell-source-lock-unbounded (2026-09-24, sesion Frontend)

- Branch `feature/121-mobile-home-bell-source-lock-unbounded` desde `origin/main` f44cf3d5 (merge de PR #159, #112).
- Base de produccion: blob de `src/screens/home/index.tsx` = `dbb5b0346895cfc26705bee2257d1f8a8815df6c` (sin cambios desde #112).
- Base de suite: la de cierre de #112 (init.sh exit=0 sobre 8bd8e27d; mobile 82/1452). main solo anadio artefactos de harness encima.
- Spec: 24157f80 (spec_author), status spec_ready. Molde: specs/mobile-reminders-see-all-source-lock-nesting/.
- Espejo Notion: https://app.notion.com/p/3e56115a9b27812baa52c1d194d732a4 (Estado del gate = Aprobado, page_last_edited_at 2026-09-24T14:36:08.808Z). Firmada en 6df6581f. Handoff: progress/handoff_mobile-home-bell-source-lock-unbounded.md. Fase: Codex implementando (lo lanza el humano).
- Pendiente al cierre: (F) del icono `<Bell ...>` contra el fichero entero (decidir registro, id desde #124: Backend reservo #123 mobile-date-picker-utc-day-shift en la PR de #84); enmendar la entrada de #122 ("los dos call-sites" pasan a tres).
- Backend avisado (trabaja #84 en wt-backend; no pisa home/index.test.tsx).
