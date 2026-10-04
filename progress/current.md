# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## Feature #148 — mobile-keyboard-avoiding-forms

- **Branch:** `feature/148-mobile-keyboard-avoiding-forms` (worktree `Pet-Tracker-wt-148`, antes `wt-icon`; base `origin/main` `9cf45204`, merge de #101)
- **Estado:** `pending` — fase de spec. Elegida por el humano el 2026-10-04 (única P2; fallo visto en el teléfono en Login y Registro de peso).
- **Sesión paralela:** Frontend lleva #105 (`feature/105-meals-history`) en el worktree principal; Postgres/LocalStack compartidos, avisar antes de cada `./init.sh`.
- **Reparto con #105 (acordado por chat entre sesiones, 2026-10-04):** #148 no toca `catalog.ts`, `ui-copy-table.ts`, `ui-language.test.ts`, `language-provider.test.tsx`, `src/app/_layout.tsx`, `layout.test.tsx` ni `(tabs)/food.tsx`. #105 mueve en `consistency-classnames.test.ts` el total de `#62 R15 counters` (+2, fila `screens/meals-history/index.tsx`) y los conteos de `bg-accent-soft` (`#98 R10`, `#64 R9`, +1 cada uno); en `design-drift.test.ts` añade `meals-history` al `it.each` de R3, la fila `screens/meals-history/index.tsx: 1` en `screenSignOutCalls` (#87 R19) y un `describe('#105 R15')`. Si la spec de #148 mueve alguno de esos `describe`, avisar a Frontend con el `it` exacto; mergea quien mergee segundo conservando los dos deltas.
- **Plan:** `explorer` (inventario pantalla a pantalla en `progress/explore_mobile-keyboard-avoiding-forms.md`) → `spec_author` → espejo en Notion → gate humano → handoff a Codex.
- **Gate humano al cierre:** prueba de humo en el dev build de Android, una casilla por pantalla.

### Bloqueado por el humano

- Nada todavía (la spec llegará a Notion para el gate).

### Siguiente paso del leader

Con el inventario escrito, lanzar `spec_author` (verificando las premisas del explore contra el árbol) y espejar `requirements.md` en la base *Specs* de Notion.
