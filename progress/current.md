# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## #183 mobile-account-client-validation

- **Inicio**: 2026-10-15, sesión Frontend (leader), worktree
  `Pet-Tracker-wt-183`, branch `feature/183-mobile-account-client-validation`.
- **Base**: nace de la punta de `feature/172-mobile-account-screens-polish`
  (ec508f88) y no de `origin/main`, porque toca las pantallas que #172 rehízo
  y #172 aún no está mergeada. Cuando #172 entre en main, se mergea
  `origin/main` aquí antes del handoff a Codex.
- **Estado**: spec firmada en `3c7e20c0` (aprobada vía Notion, página
  `3fa6115a9b27813fa1e7c36705b0a312`, `page_last_edited_at`
  2026-10-15T14:20:34.100Z; «Rol actual» = Implementer). P1–P8 cerradas con
  el valor que trae el texto, confirmado por el humano en la sesión.
  `origin/main` mergeado en `4a4abfed` (#172, #173 y #167 dentro); las
  pantallas de cuenta no cambiaron desde ec508f88, solo `catalog.ts` y el
  design de idioma, que la spec ya mide en H0 (B4, B5).
- **in_progress** (2026-10-15). `./init.sh` corrió después de que #174
  acabara el suyo y salió con exit 1: backend verde, y en el móvil 10 rojos de
  3389, todos `Exceeded timeout`, en pet-hero-header (3), meals-history (7) y
  celebration (1). Ninguna de esas suites la toca #183, y la carga estaba en
  17 con el jest de Codex en wt-174. Repetidas a solas: exit 0 y 131 passed.
  Se clasifica como carga. El log rojo está en el scratchpad de la sesión
  (`init-183-rojo-1.log`).
- **H0** = el commit que trae
  `progress/handoff_mobile-account-client-validation.md`. T0 medido: las 8
  suites de la feature dan 300 passed, y las 12 anclas del handoff salen OK.
  Hay dos derivas desde la base de la spec (`60dd9eda`), ambas por #173: B4
  es 398 (la fórmula del catálogo acaba en `- 4 + 3, // #173 R13`) y B5 es
  §2.29, así que #183 toma §2.30. El delta no cambia.
- **Parada 1 de Codex en c1** (2026-10-15): la nota del leader decía que B4
  era 398 y es 402, porque faltó sumar `+ 4 // #171 R12`. Su rojo era el
  esperado. Se resuelve con la Reanudación 1 del handoff, sin cambiar la spec.
  El c1 queda sin commitear en el árbol hasta que Codex lo commitee.
- **Siguiente**: el humano lanza Codex con el handoff. Cuando Codex termine:
  init.sh coordinado con los pares (#174, #178, #179), después reviewer, y
  luego el cierre (Notion «Implementado» / «Completado», y la PR).
- **Pedido del humano** (2026-10-15, tras firmar R21 de #172): validación en
  cliente con mensaje claro en todos los inputs de cuenta, como el correo de
  Crear cuenta, en lugar del error del servidor. Texto literal en
  `feature_list.json` #183.
- **Pacto con Backend (#174)**, 2026-10-15: quien mergee segundo hace merge
  de `origin/main` (no rebase) y suma. #174 añade en `catalog.ts` una sola
  clave (`alerts.dayAgo`; `alerts.daysAgo` solo cambia de valor), así que la
  fórmula de `language-provider.test.tsx` gana `+ 1, // #174 R2`. En el
  design de idioma, #174 crea `### §2.30 — Añadidos por #174 — Alertas fiel
  al canvas` y anota la fila daysAgo con ` · valor cambiado por #174 (R2)`.
  Si en H0 la última sección es §2.29, la §2.N de #183 también sale §2.30, y
  quien mergee segundo la renumera. #183 no toca `src/screens/alerts/` ni
  `alert-detail/`, y avisa a Backend antes de cualquier `init.sh` o suite
  móvil completa mientras Codex implementa #174.
- **Restricción de sites-99** (#178/#179): sus handoffs copian el mock
  `HomeEntrance` de `src/screens/login/index.test.tsx` y el mock de reicon
  (`...actual` + `mockIcon(testID)`) de `src/screens/register/index.test.tsx`.
  #183 no los renombra, mueve ni borra; si hiciera falta, avisar a sites-99.
