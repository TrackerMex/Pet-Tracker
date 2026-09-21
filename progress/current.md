# Sesion activa

**Feature**: #94 `mobile-map-staleness-single-source` (P3)
**Branch**: `feature/94-mobile-map-staleness-single-source` (desde `origin/main` 914905b8)
**Worktree**: `/home/claude/sites/Pet-Tracker-wt-ui`
**Fase**: esperando a Codex CLI (handoff entregado el 2026-09-21)

Handoff en `progress/handoff_mobile-map-staleness-single-source.md` (commit
`606d5a6c`). Enmienda E1 firmada por el humano en `ce652eae`. Cuando el humano
confirme que Codex terminó: leer `progress/impl_mobile-map-staleness-single-source.md`
y lanzar `reviewer`. Mientras tanto el leader no toca `mobile-pet-tracker/`.

Gate humano cerrado el 2026-09-21 en los commits `cf55f1ed` y `0142417b`: spec
aprobada y las tres decisiones abiertas firmadas — **D1** via (a), el badge sale
de `device.connectivity` via `petKeys.detail`; **D2** el tile se rotula
`pairing.connection`; **D3** aceptada la consecuencia visible (el Mapa dice "En
vivo" con un fix antiguo si el collar habla). Frontmatter de las cuatro piezas
de la spec a `approved`, #94 a `in_progress`.

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
