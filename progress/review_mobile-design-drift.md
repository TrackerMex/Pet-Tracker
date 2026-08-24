# review: mobile-design-drift (#47)
Fecha: 2026-08-24
Veredicto: APROBADO

Revisión ejecutada en el worktree `/home/claude/sites/Pet-Tracker-wt-47`
(branch `feature/47-mobile-design-drift`, HEAD `6079fa2`). Verificación
independiente: el reviewer ejecutó `./init.sh`, la suite móvil, los greps y
los spot-checks de commits rojos él mismo; no se aceptó el reporte de Codex
como evidencia.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` en `feature_list.json` (#47, verificado con jq)
- [x] `progress/current.md` describe la sesión activa (worktree, plan, estado)

## Checklist C3 — Arquitectura
- [x] Feature 100% de presentación móvil: cero cambios en `backend-pet-tracker/`
      e `infra/` (diff contra `origin/main` verificado)
- [x] `src/components/card.tsx` es presentacional puro (View/Pressable +
      twMerge), sin lógica de negocio ni IO
- [x] Sin dependencias nuevas: `tailwind-merge` ya era dependencia directa
      (bun.lock sin cambios)

## Checklist C4 — TDD
- [x] Cada R1–R8 tiene tests que lo nombran (`describe('R1: …')`,
      `it('R5 (mobile-design-drift): …')`, etc.) — verificado en los archivos
- [x] Historial test-primero por requisito: 8 tripletes test → feat/fix/refactor → docs
- [x] Spot-check de rojo real ejecutado por el reviewer:
  - `e58b610` (test R1): `global-css.test.ts` falla (1 failed) ✓
  - `a7b4ce6` (test R5): `health.test.tsx` falla (1 failed) ✓
  - `81bfec8` (test R8): health/weight-log/map fallan (3 failed, uno por pantalla) ✓
  - En HEAD todos verdes.

## Checklist C5 — Trazabilidad
- [x] `specs/mobile-design-drift/traceability.md` sin filas "pendiente";
      R1–R8 completos con test::nombre y hash de commit (hashes cotejados
      contra `git log`)
- [x] Commits siguen `tipo(mobile-design-drift): <desc> (R<n>)`

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` y casilla humana marcada
      (fecha 2026-08-24)
- [x] Aprobación humana real: commit `60296fa` (AlexisSM377) marca la casilla.
      El único cambio posterior a la spec es `6079fa2`, que alinea el
      frontmatter `draft → approved` con esa aprobación ya registrada; ningún
      requisito fue modificado tras el gate.

## Checklist C7 — Sin código huérfano
- [x] Las recetas inline reemplazadas por `Card` fueron eliminadas: grep de
      `rounded-[20px]` y `text-[10px]` bajo `mobile-pet-tracker/src/`
      (excluyendo `__tests__`) devuelve cero resultados; el guard
      `src/__tests__/design-drift.test.ts` lo vigila en CI
- [x] Las cards fuera de alcance (pet-card-error, collar-card, plan-warning-*,
      weight-row-*, last-position-card) siguen intactas, como manda la spec

## Verificaciones puntuales de la spec
- R1: `--radius-card: 20px` y `--text-2xs: 10px` dentro de `@theme` en
      `src/theme/global.css` (líneas 14–15)
- R2: `card.tsx` implementa las 3 recetas exactas, twMerge después del
      variant, `Pressable` con `accessibilityRole="button"` solo con `onPress`;
      5 casos RTL en `card.test.tsx`
- Bug #46: `Card` NO importa el Card de heroui-native ni hereda `--radius`;
      usa `rounded-card` (`--radius-card`) explícito
- R3: las 7 tabs importan `from '../../components/card'` (test parametrizado)
- R5: `paddingTop: insets.top + 12` en health.tsx:86 y weight-log.tsx:121
- R6: profile.tsx raíz `ScrollView` con `testID="screen-profile"` y
      contentContainerStyle completo (línea 33–40)
- R7: map.tsx overlay `top: insets.top + 12` con `testID="map-empty-overlay"`
      (líneas 207–210)
- R8: Skeletons dimensionados `h-12`/`h-40`/`flex-1` conservando testIDs
      `health-loading`, `weight-log-loading`, `map-loading`
- Alcance: `git diff origin/main..HEAD` solo toca `mobile-pet-tracker/`,
      `specs/mobile-design-drift/`, `progress/`, `feature_list.json` y
      `STATUS.md` (este último, bookkeeping del leader en los commits de
      registro/handoff, no de la implementación)

## Observaciones
- Ninguna que bloquee. Pendiente humano (no bloquea este review, sí el cierre
  visual): smoke en Android/iOS con Expo Go — Codex no pudo montar Expo Web
  por la incompatibilidad preexistente de react-native-maps con RN Web.
- `traceability.md` mantiene `status: draft` en su propio frontmatter; C6 solo
  gobierna `requirements.md`, así que no bloquea. Cosmético.

## Output de ./init.sh (ejecutado por el reviewer en el worktree, exit 0)
```
Test Suites: 2 skipped, 20 passed, 20 of 22 total
Tests:       6 skipped, 319 passed, 325 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
  Features: 38/47 completadas | 8 pendientes
```
Suite móvil aparte (`bun run test --silent` en `mobile-pet-tracker/`):
```
Test Suites: 34 passed, 34 total
Tests:       379 passed, 379 total
```
