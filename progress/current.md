# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## #121 mobile-home-bell-source-lock-unbounded (2026-09-24, sesion Frontend)

- Branch `feature/121-mobile-home-bell-source-lock-unbounded` desde `origin/main` f44cf3d5 (merge de PR #159, #112).
- Base de produccion: blob de `src/screens/home/index.tsx` = `dbb5b0346895cfc26705bee2257d1f8a8815df6c` (sin cambios desde #112).
- Base de suite: la de cierre de #112 (init.sh exit=0 sobre 8bd8e27d; mobile 82/1452). main solo anadio artefactos de harness encima.
- Fase: spec_author escribiendo la spec. Molde: specs/mobile-reminders-see-all-source-lock-nesting/.
- Backend avisado (trabaja #84 en wt-backend; no pisa home/index.test.tsx).
