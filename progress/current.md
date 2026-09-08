# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Rediseno contra el diseno del Make (desde 2026-09-04)

- **Origen y mapa**: `progress/explore_design-gap-vs-make.md`. Alcance cerrado por el humano: Bloque 0 + Bloque 1, features #64-#71.
- **Bloque 0 cerrado y mergeado**: #64 paleta pastel (PR #106), #65 idioma de UI (PR #110).
- **Bloque 1, tres de cuatro cerradas**: #66 listado con foto (PR #111), #67 cabecera fotografica (PR #112) y **#68 actividad semanal** (2026-09-08, PR pendiente de merge). Detalle completo de cada una en `progress/history.md`.
- **Queda del Bloque 1**: #69 tira de estadisticas, #70 recordatorios, #71 accesos rapidos. Ninguna especificada.
- **Deuda abierta al cerrar #68**: **#73** `pet-online-pill` -la pildora "En linea" necesita arreglar el pestillo de conectividad del backend (`src/workers/ingestion.drizzle.store.ts:97`) y definir un umbral de silencio, decision G-; **#74** `mobile-metric-selector-a11y` -el contenedor del selector no declara `accessibilityRole="radiogroup"`, asi que TalkBack lee tres controles sueltos, y **nada lo vigila**; handoff ya escrito en `progress/handoff_mobile-home-weekly-activity_a11y.md`-; **#75** `harness-init-force-color` -`init.sh:127-148` compara por cadena un numero que Node colorea y aborta en falso con "Mas de 1 feature en in_progress (1)" si el entorno trae `FORCE_COLOR`; se sortea con `env -u FORCE_COLOR`-. Y sigue **#72**, el flaky de seleccion de foto de add-pet.
- **Implementador: Codex CLI**, con cuota desde el 2026-09-07. Vuelve a valer el reparto entero: quien implementa no revisa.
- **Dependencias nuevas autorizadas** por el humano el 2026-09-07, siempre que la spec las declare (`docs/ui-guidelines.md:171-172`). Sigue en pie el veto **nominal** a `expo-linear-gradient`. La libreria de graficas designada es `react-native-chart-kit`, **siempre** por su subpath `/v2`.
