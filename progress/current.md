# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #102 — mobile-routes-to-screens

- **Branch**: `feature/102-mobile-routes-to-screens`, cortada de `origin/main`
  en `3a52028b` (el merge de PR #143, que cerro #94).
- **Worktree**: `/home/claude/sites/Pet-Tracker-wt-ui`. El worktree principal
  `/home/claude/sites/Pet-Tracker` lo tiene la sesion de #106 + #107.
- **Estado**: implementación terminada, pendiente de reviewer. La spec y la
  enmienda R1 fueron aprobadas por humano el 2026-09-21; gate final móvil en
  77/1386 y typecheck limpio.
- **Plan**: cerrar R1; mover map, health, weight-log y meal-schedule con un
  commit rojo y uno verde por ruta; invertir el ternario de R6; verificar
  R7-R9 y documentar los recuentos finales.

### Alcance recortado a cuatro rutas: `food.tsx` queda fuera

El criterio de aceptacion 4 de #102 en `feature_list.json` ya autoriza esto
("#98 mergeada antes de empezar, **o food.tsx queda fuera de esta feature**").
#98 esta mergeada, pero #106 + #107 estan `in_progress` **ahora mismo** sobre
`src/app/(tabs)/food.tsx` y `src/app/(tabs)/__tests__/food.test.tsx`
(verificado en `specs/mobile-meals-bar-motion/design.md:192-195`), asi que la
misma razon aplica literalmente con otra feature como origen. Mover food.tsx
bajo los pies de Codex seria romper la regla de un solo escritor.

Las cuatro que si se mueven, con su tamano medido hoy:

| Ruta | Lineas | Test | Tests |
|---|---|---|---|
| `src/app/(tabs)/map.tsx` | 406 | `__tests__/map.test.tsx` | 58 |
| `src/app/(tabs)/weight-log.tsx` | 341 | `__tests__/weight-log.test.tsx` | 32 |
| `src/app/(tabs)/meal-schedule.tsx` | 324 | `__tests__/meal-schedule.test.tsx` | 23 |
| `src/app/(tabs)/health.tsx` | 279 | `__tests__/health.test.tsx` | 28 |

`map.tsx` son **406** lineas (no las 388 que medi al abrir la sesion) y
`food.tsx` **374** (no las 325 que dice la entrada del `feature_list.json`):
#94 engordo map.tsx y #98 engordo food.tsx. Las dos cifras quedan corregidas
en la entrada por R9 de la spec.

### Reparto de ficheros con la sesion de #106 + #107

Verificado contra `specs/mobile-meals-bar-motion/design.md` §6 y §Riesgos.

- **Suyos**: `src/screens/home/index.tsx` + `index.test.tsx`,
  `src/app/(tabs)/food.tsx` + `__tests__/food.test.tsx`,
  `package.json` (`expo-haptics`), `docs/ui-guidelines.md:171`.
- **Mios**: las cuatro rutas de arriba con sus tests, y los cuatro candados
  compartidos que guardan rutas a fichero — `src/__tests__/ui-copy-table.ts`,
  `ui-language.test.ts`, `consistency-classnames.test.ts`,
  `legibility-classnames.test.ts`, `design-drift.test.ts` —, mas
  `docs/conventions.md:445-446`.
- Su §D10 saco a proposito su candado de `design-drift.test.ts` y lo metio en
  `food.test.tsx`, asi que los cinco candados compartidos son **mios sin
  disputa**. Interseccion de ficheros: **vacia**.
- Recordatorio de `reparto-de-ficheros-caduca-al-mergear`: el pacto protege el
  arbol, no la historia. Quien mergee segundo se come el conflicto en
  `feature_list.json`, `progress/current.md` y `progress/history.md`.

### Baseline medido en `3a52028b` (sin pipe, `JEST_EXIT=0`)

`Test Suites: 77 passed` · `Tests: 1386 passed`. Por suite tocada:
`design-drift` 41, `consistency-classnames` 57, `legibility-classnames` 26,
`ui-language` 25, `screens.test.tsx` 2. Estos numeros son el candado de la
feature: un refactor puro no mueve ninguno.

### `init.sh` no se lanza

#102 no toca `backend-pet-tracker/`. Jest + `tsc` son el gate real, y los
puertos de Postgres/LocalStack son de la sesion vecina
(`init-sh-concurrente-worktrees`).
