# review: mobile-food (#38)
Fecha: 2026-08-24
Veredicto: APROBADO (implementación R1–R10; cierre condicionado a los dos
ítems humanos pendientes — ver Observaciones)

Alcance revisado: delta `ea6b444..HEAD` en `feature/38-mobile-food`,
implementado por Codex CLI. R11 (smoke humano en Expo Go) queda fuera del
alcance de esta revisión por instrucción del leader.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: #38 mobile-food)
- [x] progress/current.md actualizado (sesión #38, estado R1–R10 trazado)

## Checklist C3 — Arquitectura
- [x] N/A capas backend: `docs/architecture.md` es de backend y la spec lo
      excluye explícitamente para la app móvil. Análogo móvil verificado:
- [x] `src/api/nutrition.ts` es cliente puro — sin imports de React ni
      `expo-secure-store` (grep de R10 sin resultados en `src/api/`)
- [x] Las pantallas dependen del cliente vía `useApi`, no al revés
- [x] Cero `StyleSheet.create` y cero colores hex en `food.tsx` y
      `meal-schedule.tsx` (grep limpio); tokens vía `className` +
      `useThemeColors`; offsets numéricos solo por style inline (lección #34)

## Checklist C4 — TDD
- [x] Cada R1–R8 tiene un `describe` que lo nombra (verificado por grep):
      `nutrition.test.ts` R1–R3, `food.test.tsx` R4–R6,
      `meal-schedule.test.tsx` R7–R8; R9/R10 son gates de comando
- [x] Historial test-primero real: 28 commits en tríos
      `test(...) in red (Rn)` → `feat(...) (Rn)` → `docs(...) (Rn)`.
      Spot-check de contenido: los commits rojos (`9365da4`, `ee67f62`,
      `d8cdc9f`) contienen SOLO el archivo de test; los verdes SOLO la
      implementación. No hay commits "todo junto".
- [x] Excepción C4 aprobada respetada: el diff de `screens.test.tsx`
      (en `95bc9f7`) elimina exactamente el import de `FoodScreen` y su fila
      del `it.each` — la fila de Profile y el resto intactos

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" (R1–R10 con test+commit;
      R11 marcado N/A reservado al humano, coherente con la spec)
- [x] Los 28 commits del delta siguen `tipo(mobile-food): <desc> (R<n>)`
      (validado con grep sobre `git log`: 0 desviaciones)
- [x] Hashes de la tabla verificados contra `git log`

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` en el frontmatter; sección
      "Decisiones del gate (resueltas por humano, 2026-08-24)" con D7/D9;
      `progress/current.md` registra la aprobación humana del 2026-08-24
      vía sesión interactiva
- [ ] **La casilla "Aprobado por humano (fecha: ____)" (línea 338) sigue
      SIN marcar** y el commit que puso `status: approved` (`ea6b444`) es
      de Claude, no del humano. mobile-food es la única spec `approved`
      del repo con la casilla vacía. No es defecto del implementer (el
      gate es previo al handoff), pero debe quedar saldado por el humano
      antes de marcar `done` — puede ir en el mismo commit en que feche
      el smoke R11.
- [x] Ningún requisito modificado tras la aprobación: `requirements.md`
      no tiene cambios en el delta `ea6b444..HEAD`

## Checklist C7 — Sin código huérfano
- [x] El placeholder Food fue reemplazado in situ (`food.tsx` reescrito);
      no queda archivo viejo
- [x] Su cobertura vieja (fila Food de `screens.test.tsx`) eliminada;
      superada por `food.test.tsx` (R4)

## Verificación de invariantes del handoff (independiente, no del reporte)
- Cero dependencias nuevas: `git diff ea6b444..HEAD -- '**/package.json'
  '**/bun.lock'` vacío
- Sin tocar `_layout.tsx`, `floating-tab-bar.tsx`, `backend-pet-tracker/`,
  `infra/`, `init.config.sh`, `.github/`: diff vacío
- `Generate plan` existe SOLO en `meal-schedule.tsx` (+ su test) — D9 ✓
- `meal-schedule.tsx` como ruta oculta en `src/app/(tabs)/`, patrón
  weight-log, con `Redirect href="/food"` para deep-link frío (R7/D10) ✓
- D7: Served/Pending por comparación lexicográfica de `HH:MM` local
  (`localTimeHhmm()` en `food.tsx`), porción
  `Math.round(dailyGrams/mealsPerDay)`; tests con
  `jest.useFakeTimers` + `setSystemTime('2026-08-23T13:00:00')` →
  asserts deterministas 1/2 y 2/3 ✓
- R6/D3: render estrictamente condicional
  `aiExplanation !== null ? <Card/> : null`, test verifica
  `queryByTestId('food-ai-card')` null y pantalla completa sin hueco ✓
- Cliente conforme a D5 (firmas exactas) y D6 (404 unificado en
  `not-found`; `body.code` solo leído en el 422 de generate con
  whitelist de los dos codes) ✓
- `git diff --check ea6b444..HEAD`: limpio

## Ejecución independiente del reviewer
- `bun run test` (mobile-pet-tracker): 31 suites, 356 tests, exit 0
- `bun run typecheck`: exit 0
- `bun run lint`: exit 0, sin warnings
- `./init.sh`: **exit 0** — backend, infra, harness y móvil verdes;
  e2e omitidos por el harness (puerto 4566 sin respuesta, LocalStack
  apagado — esperado, mobile-food no toca AWS)

## Observaciones
Ninguna sobre el código: la implementación cumple spec, design y
convenciones sin desviaciones detectadas.

Condiciones de cierre (humanas, previas a `status: done`):
1. Marcar la casilla "Aprobado por humano" de
   `specs/mobile-food/requirements.md` con fecha, en commit del humano
   (flujo de aprobación por git vigente desde 2026-08-20).
2. Ejecutar el smoke R11 en Expo Go (Android físico) y fechar su casilla.

## Output de ./init.sh (tramo final)
```
Test Suites: 31 passed, 31 total
Tests:       356 passed, 356 total
✅ Tests pasados
→ Tests e2e...
⚠️  Puerto 4566 sin respuesta — se saltan los e2e (levanta la infra con: docker compose up -d)
→ Lint...
✅ Lint sin errores
→ Typecheck...
✅ Typecheck sin errores
══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
[exited with code 0]
```

---

# Review delta post-smoke: mobile-food (614914a..229e460)
Fecha: 2026-08-24
Veredicto: APROBADO

Alcance: solo el delta posterior al review R1-R10 (614914a). Cubre las
correcciones del smoke humano R11 (handoffs fix1/fix2 + ajuste avatar-only),
la convencion de dimensiones en docs/conventions.md (0728fcc) y los 2
commits del humano (aa368e6 aprobacion, 229e460 smoke).

## Checklist C4 — TDD (4 ciclos verificados con checkout real)
- [x] Safe area: 8011711 (solo tests, exit 1 verificado) -> 9caafca verde
- [x] Skeletons: 43389aa (solo tests, exit 1 verificado) -> 8f77e76 verde
- [x] PetSwitcher Avatar: b746530 (solo test nuevo, exit 1 verificado) -> 602870e verde
- [x] Avatar-only: 443c2ca (solo tests, exit 1 verificado) -> 2c8123e verde
- [x] Cada commit rojo toca UNICAMENTE archivos de test (git show --stat)
- [x] Tests nombran R-ids (R4/R5/R7 en pantallas; R11 en pet-switcher.test.tsx)

## Checklist C5 — Trazabilidad
- [x] specs/mobile-food/traceability.md con seccion "Correcciones del smoke R11":
      4 filas fix con commit rojo y verde; filas R4/R5/R7 amplian sus commits
- [x] Sin filas "pendiente"
- [x] progress/impl_mobile-food.md SR11 documenta hallazgos, fixes y verificacion

## Checklist C6 — Spec aprobada
- [x] requirements.md: "Aprobado por humano (fecha: 2026-08-24)" marcado en
      aa368e6, autor AlexisSM377 <al222111377@gmail.com> (verificado con git log)
- [x] Smoke R11: "[X] Smoke ejecutado por el humano (2026-08-24)" en 229e460,
      mismo autor humano

## Checklist C7 — Sin codigo huerfano
- [x] Chips de texto duplicados eliminados de home.tsx, health.tsx y food.tsx
      al extraer src/components/pet-switcher.tsx (fix2)
- [x] Tests de las 3 pantallas intactos (testIDs pet-chip-* conservados)

## Invariantes del delta
- [x] Cero dependencias nuevas (package.json no aparece en el diff)
- [x] Sin tocar _layout.tsx, floating-tab-bar.tsx, backend-pet-tracker/,
      infra/, src/api/ (git diff --name-only verificado)
- [x] testID pet-chip-<id>, accessibilityRole="button",
      accessibilityState={{selected}} conservados en PetSwitcher
- [x] accessibilityLabel={pet.name} presente (nombre accesible en avatar-only)
- [x] home.tsx/health.tsx tocados SOLO donde el handoff fix2 lo autoriza
      (reemplazo del bloque duplicado por <PetSwitcher>)
- [x] Colores via tokens (border-accent, bg-accent-soft), nada hardcodeado

## Verificacion independiente
- ./init.sh: exit 0 (e2e saltados por LocalStack en 4566 = esperado)
- mobile-pet-tracker: bun run test -> 32 suites / 357 tests verdes;
  bun run typecheck -> exit 0; bun run lint -> exit 0
- Los 4 commits rojos fallan de verdad (checkout + run por suite, exit 1
  en cada uno); branch restaurada a feature/38-mobile-food

## Observaciones
- Menor, no bloqueante: los docs internos fechan el smoke el 2026-08-25 y el
  humano marco 2026-08-24 en requirements.md; el registro valido es el commit
  del humano.

Veredicto delta: APROBADO. Con C6 cerrado por el humano, la feature #38
queda lista para status done y cierre de PR por parte del leader.
