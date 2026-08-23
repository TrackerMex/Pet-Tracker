# review: mobile-health (#37)
Fecha: 2026-08-22
Veredicto: APROBADO (R1–R12; R13 smoke humano pendiente antes de `done`)

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json` → #37, única con `in_progress`)
- [x] progress/current.md actualizado (sesión 2026-08-22 (2), handoff y cierre de Codex registrados)

## Checklist C3 — Arquitectura
- [x] N/A capas backend: `docs/architecture.md` no aplica a la app móvil (declarado en la spec)
- [x] Regla #33 vigente: `src/api/` sin imports de React ni `expo-secure-store` — `grep -rn "expo-secure-store\|from 'react'" mobile-pet-tracker/src/api/` → exit 1, sin coincidencias
- [x] `postJson` en `http.ts` idéntico al contrato D4 (Authorization + Content-Type, catch → unreachable)
- [x] Cero dependencias nuevas: `git diff main...HEAD -- package.json/bun.lock*` vacío
- [x] `_layout.tsx` intacto: tabs declaradas explícitas (home/map/health/food/profile); `weight-log` queda ruta oculta como permite D10

## Checklist C4 — TDD
- [x] Cada R1–R10 tiene test que lo nombra (`describe('R<n>: ...')` verificado por grep en los 5 archivos de test; R11/R12 son gates estáticos sin TDD, como marca la spec)
- [x] Historial rojo→verde por requisito: `git log main..HEAD` muestra para cada R1–R10 el commit `test(...): ... in red (R<n>)` ANTES de su `feat(...)` — verificado con `git show --stat`: los commits rojos tocan solo archivos de test, los verdes solo implementación
- [x] Retoques a tests dentro de commits verdes (6802912, c542020, 8614c15) inspeccionados: cambios mecánicos de matcher/lint (within(), it.each con objetos, jest.requireActual), sin alterar la conducta afirmada
- [x] Excepción C4 (R10) verificada con diff: los casos de `health.test.tsx` en main (estados por kind ×4, recheck tras retry, toggle light→dark) están todos en el nuevo `profile.test.tsx` con testIDs renombrados `backend-health-state`/`backend-health-retry` (`theme-toggle` sin cambio), más assert de `profile-sign-out`. `screens.test.tsx` no se tocó.

## Checklist C5 — Trazabilidad
- [x] `specs/mobile-health/traceability.md` sin filas "pendiente" (R13 = N/A reservado al humano, documentado; no es "pendiente" del implementer)
- [x] Hashes de la tabla coinciden con `git log` (R1 c43f2b9 … R12 1ebd4a3)
- [x] Commits siguen `feat(mobile-health): <desc> (R<n>)` / `test(...)` / `docs(...)` — conventional commits verificados en el log completo de la rama

## Checklist C6 — Spec aprobada
- [x] `specs/mobile-health/requirements.md` con `status: approved` y casilla humana marcada (fecha 22-08-22; commit humano 8d1d1e5 "Approve mobile health feature specification")

## Checklist C7 — Sin código huérfano
- [x] `health.tsx` (health-check antiguo) reemplazado por el hub: ya no importa `fetchHealth` ni renderiza `health-state`/`health-retry`/`theme-toggle`
- [x] Sus tests antiguos reescritos/trasladados: `health.test.tsx` es ahora la suite del hub (R4–R6); la cobertura del health-check vive en `profile.test.tsx` (R10)

## Verificación de código contra la spec (lectura directa)
- R1–R3 (`src/api/health-records.ts`): estados discriminados exactos, `limit` solo si viene definido, `bodyCondition` omitido si undefined, 400→validation (errors[] o []), 403→forbidden, 401→unauthorized, 201/objeto→ok. Coincide con D3/D4.
- R4–R6 (`health.tsx`): hub con selección por defecto (pets[0] si selección inválida), chips con `accessibilityState.selected`, next-vaccine = menor `nextDoseAt >= hoy` local, vencidas en `text-danger`, weight card con `limit 1`, variación formateada (`+x kg`/`-x kg`/`—`), link `router.push('/weight-log')`.
- R7–R9 (`weight-log.tsx`): lista desc con variación y `BC n/9`, Redirect a /health sin selección, form inline con validación local ("Enter a valid weight" sin llamar API), mapeo por kind (validation/forbidden/unreachable/error), botón deshabilitado en vuelo, `refetch()` local tras ok. 401 en el POST → signOut (coherente con la política global de la app; la spec no lo listaba, no es desviación).
- R8 (`weight-chart.tsx`): idéntico al pseudocódigo D8 — <2 puntos → `weight-chart-empty` sin SVG, orden ascendente por reverse, y=20 con pesos iguales (sin división por cero), viewBox 0 0 100 40, stroke accent de useThemeColor.
- R10 (`profile.tsx`): sección App con chip por kind (mismas stateClassNames), recheck, toggle Uniwind; `fetchHealth` sin cambios; título y `profile-sign-out` intactos.
- Tipos `Vaccine`/`WeightEntry` añadidos a `types.ts` conforme a D2/D3.

## Verificaciones ejecutadas por el reviewer (no del reporte)
- `bun run typecheck` (mobile-pet-tracker/): exit 0
- `bun run lint` (mobile-pet-tracker/): exit 0
- `bun run test` (mobile-pet-tracker/): exit 0 — 25 suites, 270 tests, todas verdes (incluye suites de #33–#36)
- R12 contención: `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/` → vacío
- Grep de imports prohibidos en `src/api/` → sin resultados
- Diff de `package.json`/locks vs main → vacío

## Observaciones
- Ninguna bloqueante.
- Menor (no bloqueante): `fmtVariation` está duplicada en `health.tsx` y `weight-log.tsx`; candidata al follow-up de extracción ya previsto en la spec (§Fuera de alcance, 3ª duplicación consciente).
- R13 (smoke humano en Expo Go) queda pendiente del humano antes de marcar la feature `done`.
- Frontmatter de `traceability.md` dice `status: draft` — es metadato de plantilla del archivo de trazabilidad, no del gate (C6 se evalúa sobre `requirements.md`, que está `approved`).

## Output de ./init.sh (ejecutado por el reviewer, exit 0)
```
✅ Tests pasados

→ Tests e2e...
⚠️  Puerto 4566 sin respuesta — se saltan los e2e (levanta la infra con: docker compose up -d)

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 35/45 completadas | 9 pendientes
```
Nota: los e2e se saltan por LocalStack apagado (comportamiento estándar del
harness en este entorno); la feature es 100% móvil y no toca recursos AWS.
