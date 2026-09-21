# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Features #106 + #107 — pulido de las superficies que dejo #98

- **Branch**: `feature/106-mobile-meals-bar-motion`, cortada de `main` en `9df7b5bc`
  (el merge de PR #144, que cerro #98).
- **Alcance**: un solo ciclo para dos entradas del `feature_list.json`, porque
  tocan el mismo boton y la misma pantalla:
  - **#106 `mobile-meals-bar-motion`** — la barra de comidas de la Home
    (`src/screens/home/index.tsx:709-715`) salta de un ancho a otro sin
    transicion: `style={{ width: \`${mealsPct}%\` }}` y nada mas. Mas el haptic
    al servir y deshacer.
  - **#107 `mobile-meal-toggle-press-lock`** — el `style` pressed del boton por
    franja (`src/app/(tabs)/food.tsx:253-255`) no lo vigila ningun test.
    Handoff ya escrito en `progress/handoff_98_rebote_meal-toggle.md`.
- **Decision del humano (2026-09-21)**: entra `expo-haptics`, que es
  **dependencia nueva** y necesita su firma en el gate de esta spec.
  `docs/ui-guidelines.md:171` la declara no instalada, asi que la spec tiene
  que enmendar esa linea.
- **Estado**: `spec_author` lanzado. Ambas features siguen `pending` hasta que
  el humano firme la spec.

### Coordinacion con la sesion de #94

`#94 mobile-map-staleness-single-source` esta en vuelo en el worktree
`Pet-Tracker-wt-ui` (PR #143, abierta). Verificado con `gh pr view 143 --json
files`: toca `map.tsx`, `device-connectivity.ts` y tres tests compartidos
(`design-drift.test.ts`, `ui-copy-table.ts`, `ui-language.test.ts`), y **no**
toca `home/index.tsx` ni `food.tsx`. No hay colision de fondo; el unico roce
posible son esos tres tests compartidos si #106 cambia classNames o copy.

Recordatorio de `init-sh-concurrente-worktrees`: los dos worktrees comparten
Postgres y LocalStack. El `reviewer` de esta feature no lanza `init.sh` hasta
que la otra sesion avise.

### Cola detras de esta

- **#102 `mobile-routes-to-screens`** se desbloqueo al mergear #98, pero migra
  `map.tsx` — no se puede arrancar hasta que #94 entre en `main`.
- **#104 `nutrition-kcal-consumed`** es la siguiente que pide backend de
  verdad; se parte en dos mitades como se hizo con #83/#98.
