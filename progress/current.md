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
- **Siguiente**: status `in_progress`, H0 y handoff a Codex. `init.sh`
  coordinado con #174, #175, #178 y #179, que arrancan a la vez.
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
