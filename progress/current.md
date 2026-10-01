# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## #41 `mobile-geofences` (2026-10-01, sesion Backend)

- Decision del humano (2026-10-01, tras mergear la PR #182 de #127 + #128): seguir con #41 y, de aqui en adelante, priorizar las features pesadas de producto frente a los candados de test.
- Branch `feature/41-mobile-geofences` en `Pet-Tracker-wt-backend`, desde `origin/main` 3db47fb0 (merge de la PR #182). `router.d.ts` ausente.
- `./init.sh` del leader sobre 3db47fb0, sin pipe, con aviso a Frontend: `exit=0`, HEAD igual al empezar y al acabar. Backend 171/1307, infra 2/14, movil 86 suites / 1634 tests, e2e 27 suites (+3 skip) / 389 tests (+8 skip). Es la base de la spec.
- Reparto con Frontend (#60 `mobile-ios-support`, branch `feature/60-mobile-ios-support` en 03f57706, reviewer aprobado, SIN PR y sin fecha: faltan los gates humanos R11 AASA, R12 smoke iPhone con EAS y R13 regresion Android). Choque real con #41: `src/components/pet-map.tsx`, `src/components/__tests__/pet-map.test.tsx` y `src/screens/map/index.test.tsx`. Tras #60 las geocercas deben pintarse en las dos ramas (GoogleMaps y AppleMaps). Propuesta de Frontend: escribir la spec de #41 contra `pet-map.tsx` de 03f57706, declarar #60 como dependencia y no hacer el handoff hasta que #60 este en main. Pendiente de decision del humano.
- Feature ambigua (tabla de escalado): `explorer` lanzado, escribe `progress/explore_mobile-geofences.md`. Despues, `spec_author`, con verificacion de premisas contra el arbol.
