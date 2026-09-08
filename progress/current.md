# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Rediseno contra el diseno del Make (desde 2026-09-04)

- **Origen y mapa**: `progress/explore_design-gap-vs-make.md`. Alcance cerrado por el humano: Bloque 0 + Bloque 1, features #64-#71.
- **Bloque 0 cerrado y mergeado**: #64 paleta pastel (PR #106), #65 idioma de UI (PR #110).
- **Bloque 1, cuatro de seis cerradas y mergeadas**: #66 listado con foto (PR #111), #67 cabecera fotografica (PR #112) y #68 actividad semanal (PR #113). **#69 tira de estadisticas cerrada el 2026-09-08**, PR pendiente de merge. Detalle completo de cada una en `progress/history.md`.
- **Queda del Bloque 1**: #70 recordatorios y #71 accesos rapidos. Ninguna especificada.
  - **#70** tiene **la mitad del diseno bloqueada**: `nextReminder` y `activitySummary` siguen hardcodeados a `null` en el mapper del perfil, asi que la barra de progreso de comidas no se puede construir. Su spec tiene que decir explicitamente que mitad entra.
  - **#71** es la mas barata en absoluto -navegacion pura, sin datos- pero su spec tiene que enumerar destino por destino y **comprobar que cada ruta existe**: en #68 la lista de alcance incluia `/trips`, que no existe.
- **Deuda abierta**: **#73** `pet-online-pill` -la pildora "En linea" necesita arreglar el pestillo de conectividad del backend (`src/workers/ingestion.drizzle.store.ts:97`) y definir un umbral de silencio, decision G-; **#74** `mobile-metric-selector-a11y` -el contenedor del selector no declara `accessibilityRole="radiogroup"`, asi que TalkBack lee tres controles sueltos, y **nada lo vigila**; handoff ya escrito en `progress/handoff_mobile-home-weekly-activity_a11y.md`-; **#75** `harness-init-force-color` -`init.sh:127-148` compara por cadena un numero que Node colorea y aborta en falso con "Mas de 1 feature en in_progress (1)" si el entorno trae `FORCE_COLOR`; se sortea con `env -u FORCE_COLOR`-. Y sigue **#72**, el flaky de seleccion de foto de add-pet.
- **Implementador: Codex CLI**, con cuota desde el 2026-09-07. Vuelve a valer el reparto entero: quien implementa no revisa.
- **Dependencias nuevas autorizadas** por el humano el 2026-09-07, siempre que la spec las declare (`docs/ui-guidelines.md:171-172`). Sigue en pie el veto **nominal** a `expo-linear-gradient`. La libreria de graficas designada es `react-native-chart-kit`, **siempre** por su subpath `/v2`.
- **Deuda anadida al cerrar #69**: **#76** `e2e-audit-log-order-assert` -`health-vaccines.e2e-spec.ts:497` asserta un array ordenado sobre un `SELECT` sin `ORDER BY`, asi que cae de forma intermitente bajo carga y ensucia baselines-; **#77** `mobile-home-weight-without-collar` -hoy la tira desaparece entera con el estado de la actividad y el peso se va con ella aunque venga del perfil-; **#80** `mobile-test-double-icon-scope` -los `testID` del doble de `reicon` se atan al componente y no al uso, asi que `Moon` y `Map` emiten los mismos ids fuera de la tira-.
- **#78 `mobile-alerts-center` y #79 `mobile-push-registration`** entraron desde otra sesion, no desde esta.
- **C4 gano un punto el 2026-09-08** (`CHECKPOINTS.md`): cuando un candado se anade sobre codigo **ya correcto**, el rojo legitimo es la **mutacion de produccion** versionada en el rojo y revertida en el verde. Mutar un doble de test demuestra que la asercion puede fallar, no que vigile la app.
