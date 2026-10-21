# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

- feature: mobile-home-photo-hero-canvas (#195), branch `feature/195-mobile-home-photo-hero-canvas`, worktree `/home/claude/sites/Pet-Tracker-wt-195`
- inicio: 2026-10-21 (spec firmada en `ab33dfd1`, Notion «Estado del gate» = Aprobado, `page_last_edited_at` 2026-10-21T21:37:07.943Z)
- plan: Codex CLI implementa R1 a R20 test-primero (cabecera fotográfica de Inicio: `PetHeroHeader` a 330 con foto arriba y degradado, `PetSwitcher` variante `glass`, `GlassCircle`, `BubblePop`, tokens `scrim` y `photo-dim`, cuatro constantes `MOTION_HERO_*`, enmienda #195 en `docs/ui-guidelines.md`). Handoff en `progress/handoff_mobile-home-photo-hero-canvas.md`; reporte esperado en `progress/impl_mobile-home-photo-hero-canvas.md`.
- humano pendiente: R21 (prueba de humo Android en dev build: claro, oscuro, reduce motion; foto oscura, clara y sin foto; nombre largo).
- init.sh: corrido por el leader en `ab33dfd1`, exit 0. Base móvil 130 suites / 4297 tests, cero FAIL.
- riesgo de merge: #189 (wt-189) toca el final de `docs/ui-guidelines.md` y la fila `tracking-title` de `alerts-canvas-fidelity.test.ts`; el leader lo resuelve al mergear (R20 exige que la sección Enmienda #195 sea la última `## `).
- Mientras Codex implementa, el leader no toca `backend-pet-tracker/` ni `mobile-pet-tracker/`.
