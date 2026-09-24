# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## #122 mobile-source-lock-slice-blind-spots (2026-09-24, sesion Frontend)

- Branch `feature/122-mobile-source-lock-slice-blind-spots` desde `origin/main` f72c1fc0 (merge de PR #161, #121).
- Base de produccion: blob de `src/screens/home/index.tsx` = `dbb5b0346895cfc26705bee2257d1f8a8815df6c` (sin cambios desde #112).
- Base de suite: la de cierre de #121 (init.sh exit=0 sobre 1bb01d41; mobile 82/1471 tras mergear #84). main solo anadio el cierre de #121 encima.
- Call-sites del recorte de `<` a `<`: tres (meal-toggle en `src/app/(tabs)/__tests__/food.test.tsx`, reminders-see-all y home-alerts-bell en `src/screens/home/index.test.tsx`).
- Spec: 103329f5 (spec_author), status spec_ready. Molde: specs/mobile-reminders-see-all-source-lock-nesting/ (#112) y specs/mobile-home-bell-source-lock-unbounded/ (#121). Decisiones: P1, P2, P4, O2, O5 y O4 defendidos con R1 (unicidad del ancla) y R2 (pata de arbol que pulsa, `responderGrant`); O2c documentado como limite.
- Espejo Notion: https://app.notion.com/p/3e56115a9b27812db8d9de6c2234f77f (Estado del gate = En revision). Fase: esperando gate humano.
- Pendiente al cierre: (F) de la spec, la pata de fuente de S y M queda redundante con R2 (decidir registro, id contra origin/main y coordinar con Backend).
- Fuera de alcance: #124 (icono `<Bell>` contra el fichero entero) toca el mismo fichero; va despues, en serie.
- Backend trabaja #123 en wt-backend (add-reminder, add-pet); no pisa estos ficheros.
