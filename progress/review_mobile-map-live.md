# review: mobile-map-live (#36)
Fecha: 2026-08-22
Veredicto: APROBADO (R1–R12; R13 = smoke humano, fuera del alcance de esta revisión por instrucción del leader)

Branch: `feature/36-mobile-map-live` @ `45a7e20`. Verificación independiente
ejecutada por el reviewer (no se aceptó el output del implementer).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`#36 mobile-map-live`); `#45 pet-lost-mode` dada de alta como `pending` (D8)
- [x] progress/current.md describe la sesión activa (spec → gate → handoff Codex → impl)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure — backend intacto (diff de contención vacío)
- [x] repositories/contratos en domain son interfaces puras — sin cambios en backend
- [x] application depende de interfaces, no implementaciones — sin cambios en backend
- [x] infrastructure sin lógica de negocio — sin cambios en backend
- [x] Convenciones de la isla móvil: `src/api/` sin React ni expo-secure-store (grep vacío); `fetchFn`/`token` inyectados por parámetro (patrón #33); pantalla con `className` + tokens, sin `StyleSheet.create` ni hex; offsets absolutos por `style` inline (lección #34) — verificado en `map.tsx` líneas 177, 204, 214-219

## Checklist C4 — TDD
- [x] Cada R1–R10 tiene `describe('R<n>: ...')` que lo nombra:
  - R1/R2 → `src/api/__tests__/positions.test.ts` (líneas 21, 114)
  - R3 → `src/api/__tests__/trips.test.ts` (línea 60)
  - R4–R10 → `src/app/(tabs)/__tests__/map.test.tsx` (líneas 209, 283, 302, 351, 416, 555, 621)
- [x] Historial test-primero verificado en el log real: 10 pares rojo→verde
  (`57f354b`→`df5050f` … `86db2ff`→`cbe518c`). Spot-check de `57f354b`
  (solo test, 111 líneas) y `df5050f` (solo implementación): correcto.
  La retirada del caso `map` de `screens.test.tsx` es exactamente la
  excepción C4 aprobada en la spec — el diff toca solo el import y la fila
  del `it.each`; food/profile intactos.

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" para R1–R12; R13 queda "pendiente"
      por diseño (solo lo cierra el humano — regla escrita en el propio archivo
      y confirmada por el leader para esta revisión)
- [x] Commits siguen `feat(mobile-map): <desc> (R<n>)` / `test(...)` / `docs(...)`

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` y casilla humana marcada (2026-08-21, commit `a2f48e9`)
- [x] Ningún requisito modificado tras la aprobación: `git diff a2f48e9..HEAD -- requirements.md`
      solo cambia el frontmatter draft→approved (flujo estándar)

## Checklist C7 — Sin código huérfano
- [x] El placeholder Map fue reescrito en su propio archivo (`map.tsx`)
- [x] Su test placeholder salió de `screens.test.tsx` (excepción C4 aprobada)

## Verificación puntual contra la spec (código real leído)

- **Dependencias**: único añadido en `package.json` es `react-native-maps: "1.27.2"`
  (pin exacto, sin `^`/`~`); `bun.lock` coherente (solo `react-native-maps@1.27.2`
  + su dep transitiva `@types/geojson`). Grep de `expo-maps`/`react-query`/`tanstack`
  en package.json: vacío. ✔
- **R1/R2** (`positions.ts`): `fetchFn` inyectado con default `fetch`, saneo vía
  `getJson`, kinds completos (`ok`/`no-tracking` 402/`unauthorized` 401/`error`/
  `unreachable`/`missing-config`), body `null` → `{ kind: 'ok', position: null }`,
  `listPositions` sin query params (tests aserten URL exacta). ✔
- **R3** (`trips.ts`): lista sin query, `Promise.all` de detalles, orden por
  `index`, validación mínima `Array.isArray(trip.path)`, 401/402/error/unreachable
  propagados. ✔
- **R6/R7** (`map.tsx`): `MapView` `testID="map-view"` `key={selectedPetId}`
  `style={{flex:1}}`, `Marker` solo con posición, región default CDMX + overlay
  `map-empty` con `position === null`, un `Polyline` `map-route-<index>` por trip. ✔
- **R5**: `no-tracking` → nota de collar, sin MapView, sin stats, sin lost-mode;
  el guard de `useFocusEffect` no programa intervalo (test asserta
  `mockFocusCleanup === undefined`). ✔
- **R9 (fuga de timers)**: el cleanup de `useFocusEffect` hace `clearInterval(intervalId)`
  (map.tsx:91); el test avanza 15 s (una llamada extra a last+positions, cero a route),
  invoca el cleanup y verifica `clearInterval`. La ruta se refresca solo al (re)enfocar,
  según D7. Sin fuga: cada re-render del callback pasa por el cleanup del effect. ✔
- **R10**: Button `isDisabled` + `accessibilityState={{disabled:true}}` + texto
  `Coming soon`; sin handler en el código. ✔
- **Mock de react-native-maps** en `map.test.tsx`: stubs `View` que propagan
  `testID`/props, exactamente el patrón de design.md §D9; sin tocar la config de jest. ✔

## Verificación independiente ejecutada

- `bun run typecheck` (mobile): exit 0
- `bun run lint` (mobile): exit 0, sin warnings
- `bun run test` (mobile): **21 suites, 193 tests, todos verdes**
- `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/`: **vacío** (R12) ✔
- `git diff --check main...HEAD`: exit 0
- `grep -rn "expo-secure-store\|from 'react'" mobile-pet-tracker/src/api/`: vacío ✔
- `./init.sh`: **exit 0** (output abajo)

## Observaciones (no bloqueantes)

- E2E backend omitidos por el harness: LocalStack no responde en el puerto 4566
  (mismo estado que en la revisión de #35; esta feature no toca AWS).
- El test R9 asserta que `clearInterval` fue llamado tras el cleanup; el assert
  del design ("avanzar de nuevo → cero llamadas") habría sido marginalmente más
  fuerte, pero la implementación real limpia el intervalo correctamente — no bloquea.
- `init.sh` reporta 34/45 features; el aviso de drift de STATUS.md mencionado en
  el impl report ya no aparece.
- R13 (smoke Expo Go en Android físico) sigue pendiente del humano: la feature
  NO puede pasar a `done` hasta que el humano marque la casilla de R13 en
  requirements.md.

## Output de ./init.sh (tail)

```
Test Suites: 21 passed, 21 total
Tests:       193 passed, 193 total
✅ Tests pasados

→ Tests e2e...
⚠️  Puerto 4566 sin respuesta — se saltan los e2e (levanta la infra con: docker compose up -d)

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 34/45 completadas | 10 pendientes

INIT_EXIT=0
```
