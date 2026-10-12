# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## #170 mobile-alerts-grouped-and-detail-map (sesión Backend, 2026-10-11)

- Worktree: `../Pet-Tracker-wt-170`, branch `feature/170-mobile-alerts-grouped-and-detail-map` desde origin/main 89fe2009.
- Asignada por Frontend (fila 4 del canvas, parte 1, C7). Estado: `pending` → spec_author.
- init.sh verde en wt-170 (EXIT=0). Cola de init.sh acordada: Backend → UI-Pet → sites-99 → sites-4c.
- Premisa falsa del explore §2 corregida: la alerta ya trae `geofenceId` en la raíz; la distancia se deriva en cliente con `geofenceId` + `payload.position`, sin backend. Confirmado por Frontend.
- Implementación con Codex espera al merge de #166 (CTA chunky).
- Spec escrita y commiteada (83f733e9, `spec_ready`, frontmatter `draft`). Espejo en Notion: https://app.notion.com/p/3f66115a9b2781ffb484e077f2675684 (Estado del gate = En revisión, Rol actual = Spec Author). Frontend avisado.
- PARADA en el gate humano. Al aprobar: verificar «Aprobado» y `page_last_edited_at`, frontmatter a `approved`, commit de firma citando página y hora, Rol actual = Implementer, y re-medir M1–M6 antes del handoff a Codex.
- Para M2 (Frontend, 2026-10-11): #166 fija en `docs/ui-guidelines.md` punto 13 el secundario neutro `rounded-xl border-2 border-b-6 border-lip-gray bg-surface`. Su inventario `#166 R3` en `consistency-classnames` cierra los secundarios neutros en 4 testIDs, así que `alert-detail-view-map` (R15) tiene que entrar ahí con +1, como ya pide M2. Además #166 suma 8 its a `consistency-classnames` (R2–R4) y 2 a `global-css`. Todo se re-mide tras el merge.
