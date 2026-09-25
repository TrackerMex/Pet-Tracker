# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## #126 mobile-home-cell-icons-source-lock-unbounded (+ verificar #80) (2026-09-25, sesion Frontend)

- Eleccion del humano (2026-09-25, tras mergear PR #165 de #124): #126, y #80 `mobile-test-double-icon-scope` junto a ella si su premisa ya no se sostiene o cabe en el mismo cambio.
- Branch `feature/126-mobile-home-cell-icons-source-lock-unbounded` desde `origin/main` d7cb0d60 (merge de PR #165, #124; arbol identico a 897cbb73).
- Base de suite: la de cierre de #124 sobre el merge 6cd6ea20 (mobile 83/1510, tsc 0, lint 0; init.sh exit=0 sobre 205b126d). main no anadio nada encima salvo el cierre de #124 (harness).
- Blobs de base en d7cb0d60: `src/screens/home/index.tsx` = `dbb5b0346895cfc26705bee2257d1f8a8815df6c`, `index.test.tsx` = `abbdb5b87f0b96bda465cc2dacb98937ef7aaf78`, `docs/conventions.md` = `cb3c52532df6e9703fd965fc3d810c8eadace191` (los de cierre de #124).
- Premisa de #80 que el leader ya ve caducada: la entrada habla de testID `summary-icon-sleep`/`summary-icon-distance`, pero el doble de reicon de `index.test.tsx` emite hoy `icon-<componente>` (`icon-moon`, `icon-map`...). El spec_author la verifica contra el arbol.
- Backend trabaja #99 en wt-backend. Lista cerrada (2026-09-25): use-push-registration.ts + test, screens/profile/index.tsx + test, catalog.ts (+2 claves), language-provider.test.tsx, ui-language.test.ts, ui-copy-table.ts, specs/mobile-ui-language/design.md. Sin solape con #126 (sin copy, sin home en #99); merge en cualquier orden.
