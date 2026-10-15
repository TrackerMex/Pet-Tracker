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
- **Estado**: `pending`. Spec en manos de `spec_author`; luego espejo en
  Notion y gate humano.
- **Pedido del humano** (2026-10-15, tras firmar R21 de #172): validación en
  cliente con mensaje claro en todos los inputs de cuenta, como el correo de
  Crear cuenta, en lugar del error del servidor. Texto literal en
  `feature_list.json` #183.
- **Restricción de sites-99** (#178/#179): sus handoffs copian el mock
  `HomeEntrance` de `src/screens/login/index.test.tsx` y el mock de reicon
  (`...actual` + `mockIcon(testID)`) de `src/screens/register/index.test.tsx`.
  #183 no los renombra, mueve ni borra; si hiciera falta, avisar a sites-99.
