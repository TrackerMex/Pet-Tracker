# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## #124 mobile-home-bell-icon-source-lock-unbounded (2026-09-25, sesion Frontend)

- Branch `feature/124-mobile-home-bell-icon-source-lock-unbounded` desde `origin/main` 2da66b86 (merge de PR #163, #122).
- Base de produccion: blob de `src/screens/home/index.tsx` = `dbb5b0346895cfc26705bee2257d1f8a8815df6c` (sin cambios desde #112). Test: blob de `src/screens/home/index.test.tsx` = `60c0c01396f246d433bd1bdb0655b4df58fbb3ee` (cierre de #122).
- Base de suite: la de cierre de #122 (init.sh exit=0 sobre e078838b; mobile 83/1494). main solo anadio el cierre de #122 encima (9dd90c94, harness).
- Premisa que cambio desde el registro: el `it` de la campana se titula ahora `#121 R1: ... con ancla única (#122 R1)` y lleva la linea de unicidad del ancla de #122; `#122 R2` anadio un `it` que pulsa la campana. El spec_author debe medir contra este arbol, no contra f44cf3d5.
- Backend trabaja #125 en wt-backend (add-reminder, reminders del backend, quiza catalogo); no pisa `src/screens/home/`.
