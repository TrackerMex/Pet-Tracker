# Sesion activa

**Feature**: #94 `mobile-map-staleness-single-source` (P3)
**Branch**: `feature/94-mobile-map-staleness-single-source` (desde `origin/main` 914905b8)
**Worktree**: `/home/claude/sites/Pet-Tracker-wt-ui`
**Fase**: spec (spec_author lanzado el 2026-09-21)

## Coordinacion con la sesion Frontend

Frontend trabaja **#98 `mobile-meals-served-ui`** en el worktree principal
(`/home/claude/sites/Pet-Tracker`, branch `feature/98-mobile-meals-served-ui`).
Reparto de ficheros acordado para no pisarnos:

- **Frontend (#98)**: `src/app/(tabs)/food.tsx`, `src/screens/home/index.tsx` y su
  test, `src/api/types.ts`, `src/api/nutrition.ts`, `src/i18n/catalog.ts`,
  `src/providers/__tests__/language-provider.test.tsx`, `docs/ui-guidelines.md`.
- **Esta sesion (#94)**: `src/app/(tabs)/map.tsx`, `src/app/(tabs)/__tests__/map.test.tsx`,
  `src/utils/device-connectivity.ts` y su test.
- **Delta de i18n de #94: cero.** El catalogo y su candado de longitud son de #98.
  Si el diseno de #94 necesitara una clave nueva, se para y se coordina antes.

## init.sh: diferido a proposito

No se ha ejecutado `./init.sh` en esta sesion. Frontend esta arrancando #98 y
LocalStack/Postgres son compartidos entre worktrees: dos `init.sh` a la vez dan
e2e rojos falsos (lo ya visto el 2026-09-06 y el 2026-09-17). Se ejecuta antes
del gate de `reviewer`, y solo tras aviso explicito de que Frontend no lo esta
corriendo. Para escribir la spec no hace falta: jest movil no toca esos puertos.
