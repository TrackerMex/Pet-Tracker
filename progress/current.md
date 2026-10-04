# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## Feature #148 — mobile-keyboard-avoiding-forms

- **Branch:** `feature/148-mobile-keyboard-avoiding-forms` (worktree `Pet-Tracker-wt-148`, antes `wt-icon`; base `origin/main` `9cf45204`, merge de #101)
- **Estado:** `spec_ready` — spec escrita por `spec_author` (2026-10-04) y revisada por el leader contra el árbol en `9cf45204` (anclas de símbolos, `it` y testIDs: 1 coincidencia cada una; sonda RV-5 medida en explore §H). Elegida por el humano el 2026-10-04 (única P2; fallo visto en el teléfono en Login y Registro de peso).
- **Spec:** `specs/mobile-keyboard-avoiding-forms/` (requirements R1–R10, design D1–D9, tasks por pantalla, traceability). Siete pantallas (login, register, reset-password, add-pet, add-reminder, pairing, weight-log); forgot fuera (input deshabilitado). 14 ficheros de código, ningún candado global se mueve.
- **Sesión paralela:** Frontend lleva #105 (`feature/105-meals-history`) en el worktree principal; Postgres/LocalStack compartidos, avisar antes de cada `./init.sh`.
- **Reparto con #105 (acordado por chat entre sesiones, 2026-10-04):** #148 no toca `catalog.ts`, `ui-copy-table.ts`, `ui-language.test.ts`, `language-provider.test.tsx`, `src/app/_layout.tsx`, `layout.test.tsx` ni `(tabs)/food.tsx`. #105 mueve en `consistency-classnames.test.ts` el total de `#62 R15 counters` (+2, fila `screens/meals-history/index.tsx`) y los conteos de `bg-accent-soft` (`#98 R10`, `#64 R9`, +1 cada uno); en `design-drift.test.ts` añade `meals-history` al `it.each` de R3, la fila `screens/meals-history/index.tsx: 1` en `screenSignOutCalls` (#87 R19) y un `describe('#105 R15')`. Si la spec de #148 mueve alguno de esos `describe`, avisar a Frontend con el `it` exacto; mergea quien mergee segundo conservando los dos deltas.
- **Plan:** `explorer` (inventario pantalla a pantalla en `progress/explore_mobile-keyboard-avoiding-forms.md`) → `spec_author` → espejo en Notion → gate humano → handoff a Codex.
- **Gate humano al cierre:** prueba de humo en el dev build de Android, una casilla por pantalla.

### Bloqueado por el humano

- **Gate de la spec en Notion** (base *Specs* del Panel de Proyectos — Harness SDD): página `#148 mobile-keyboard-avoiding-forms` (id `3ef6115a-9b27-8106-a6af-ea461087bb27`, https://app.notion.com/p/3ef6115a9b278106a6afea461087bb27), creada el 2026-10-04 con `Estado del gate` = En revisión y `Rol actual` = Spec Author; cuerpo = espejo de `requirements.md` en `7a075020`. El humano pone `Estado del gate` = Aprobado; el leader lee la página (valor + `page_last_edited_at`), pasa los cuatro ficheros de la spec a `status: approved` y hace el commit de firma citando página y hora. Lista cerrada de ficheros enviada a Frontend el 2026-10-04.

### Siguiente paso del leader

Tras la aprobación en Notion: commit de firma (`status: approved` en los cuatro ficheros de la spec), prompt de handoff a Codex CLI (plantilla de `.claude/agents/leader.md`, nombres de skills de Codex, commits test-primero, §Esperas, lista cerrada de 16 ficheros, base medida sin pipe), y al terminar Codex, `reviewer` (pedir permiso al humano para `init.sh` y avisar a Frontend antes).
