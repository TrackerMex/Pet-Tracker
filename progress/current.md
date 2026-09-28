# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## #74 mobile-metric-selector-a11y (2026-09-28, sesion Frontend)

- Eleccion del humano (2026-09-28, tras mergear PR #168 de #120): #74.
- Branch `feature/74-mobile-metric-selector-a11y` desde `origin/main` c06b9749 (merge de PR #168; arbol identico a c6153446).
- Base de suite: el init.sh de cierre de #120 sobre 52d920a8 (exit 0; mobile 83/1532, 1 snapshot). El merge de PR #168 solo anadio el veredicto y el cierre (harness), asi que no se vuelve a correr init.sh al arrancar.
- Blobs de base en c06b9749: `src/screens/home/weekly-activity-chart.tsx` = 128c09bd, `weekly-activity-chart.test.tsx` = bc8e8fd9. Las lineas que cita la entrada (325-328, 53-56) son de 2026-09-08: el spec_author ancla por contenido (`accessibilityRole="radio"`, `METRIC_LABEL_MIN_FONT_SCALE`, `jest.mock('uniwind'`), no por numero.
- Backend trabaja #77 en wt-backend: su diff movil es solo `home/index.tsx` e `index.test.tsx`. #74 toca `weekly-activity-chart.tsx` y su test, sin solape de ficheros.
- Handoff viejo (`progress/handoff_mobile-home-weekly-activity_a11y.md`, de #68): es materia prima, no una spec. El spec_author verifica cada premisa contra el arbol de hoy.
- Gate humano extra (criterio 6): TalkBack en dev build de Android sobre el selector. No es delegable.
