# review: mobile-figma-polish (#46)
Fecha: 2026-08-23
Veredicto: APROBADO (gate automatizado; R12 smoke humano sigue abierto — la feature NO puede pasar a done hasta que el humano lo cierre)

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (#46 en `feature_list.json`)
- [x] progress/current.md actualizado con la sesión activa

## Checklist C3 — Arquitectura
- [x] Solo capa presentación tocada: pantallas, componentes, tema, `_layout.tsx`, fuentes
- [x] Cero cambios en `src/api/`, hooks, providers, navegación (verificado por lista de archivos del diff `main...HEAD`)
- [x] domain/application/infrastructure del backend intactas (diff vacío)
- [x] Cero colores literales (hex/rgba/oklch) en pantallas y componentes tocados — todo vía tokens (grep exit 1)

## Checklist C4 — TDD (adaptado según spec/design §6)
- [x] R1–R3 con rojo→verde real y commits separados:
  - R1: test `9e27a80` (en ese commit `global.css` aún tenía `--accent: #208AEF` → rojo) → impl `04aef32`
  - R2: test `bef097f` → impl `80ba96b`
  - R3: test `bed689e` (en ese commit `_layout.tsx` sin `useFonts` → rojo) → impl `e7a8890`
  - Los tests nuevos nombran su R-id: `describe('R1: ...')`, `R2`, `R3`
- [x] R4–R11 sin TDD (decisión ratificada en el gate) pero UN commit atómico por R-id, verificado en `git log main..HEAD`: `b9283f4`(R4) `0326dd6`(R5) `2fd27a3`(R6) `7b491d3`(R7) `e912b5e`(R8) `13bcfa0`(R9) `41f25df`(R10) `ab5f2e7`(R11), cada uno con su commit docs de trazabilidad

## Checklist C5 — Trazabilidad
- [x] `specs/mobile-figma-polish/traceability.md` sin filas "pendiente" (R12: gate automatizado registrado; smoke humano explícitamente reservado al humano, conforme a la spec)
- [x] Commits siguen `feat(mobile-figma-polish): <desc> (R<n>)`

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` y casilla humana marcada (2026-08-23, commit `b30f4a5`)
- [x] Requisitos sin modificar tras la aprobación

## Checklist C7 — Sin código huérfano
- [ ] N/A — esta feature no reemplaza nada existente (solo re-estiliza)

## Verificaciones específicas de la feature (invariantes del handoff)

- [x] `./init.sh` ejecutado por el reviewer: **exit 0**, "Todo verde" (backend, infra, harness, móvil 27 suites / 275 tests, build+lint+typecheck). E2e saltados por LocalStack sin levantar (esperado; la feature no toca AWS).
- [x] `bun run typecheck` en mobile-pet-tracker/: exit 0
- [x] `bun run lint` en mobile-pet-tracker/: exit 0
- [x] `bun run test` en mobile-pet-tracker/: exit 0 — 27 suites, 275 tests
- [x] **INVARIANTE tests**: `git diff main...HEAD -- 'mobile-pet-tracker/**/__tests__/**'` contiene SOLO 2 archivos NUEVOS (`global-css.test.ts`, `font-registration.test.ts`, status A) — cero modificaciones a asserts existentes
- [x] **INVARIANTE testID/strings**: multiset de `testID="..."` idéntico a main en los 10 archivos tocados; extracción de texto JSX visible + props (placeholder/label/accessibilityLabel) idéntica a main en todos (un falso positivo del regex en weight-log.tsx: código de un ternario, no texto — verificado leyendo el diff completo)
- [x] **Cero cambios de conducta**: diff completo leído de home/map/health/weight-log/profile/login/register/forgot + floating-tab-bar + weight-chart: solo className, estructura visual de contenedores, iconos reicon nuevos (Syringe, Lock, Minus, TrendUp/Down) y `useThemeColor` para colorear iconos. Lógica, estados, handlers, navegación y disabled intactos (lost-mode sigue `isDisabled` con su texto)
- [x] R1: tokens light de `global.css` == tabla design.md (accent `#2AB87C`, foreground `#0D1117`, muted `#6B7280`, default `#F5F6F8`, surface-secondary `#F0FBF6`, border `rgba(13,17,23,0.07)`, danger/warning/success, radius `1.25rem`, field-radius `0.75rem`)
- [x] R2: dark == tabla derivada de design.md §2; sin ningún `oklch(` (el test lo asserta además)
- [x] R3: 5 `.ttf` de Inter en `assets/fonts/` (Regular/Medium/SemiBold/Bold/Black), registrados en `_layout.tsx` vía `useFonts` de expo-font, sin return condicional que bloquee el arranque; familias expuestas en `@theme` de `global.css`
- [x] R4: diff de `floating-tab-bar.tsx` = SOLO el className del label (`text-[10px] font-semibold`); pill, posición, sombras, márgenes, iconos Filled/Outline y testIDs `tab-*` intactos
- [x] R5: weight-chart con stroke 2.5 accent, círculos r=3 por dato, área `LinearGradient` accent 0.2→0 de `react-native-svg`; degradación <2 puntos sin cambios
- [x] Cero dependencias nuevas: diff de `package.json`/`bun.lock` vs main vacío
- [x] Contención: `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/` vacío
- [x] `design-src/` solo añadido como referencia versionada (commit de spec `cbde08a`), no modificado después; grep `design-src` en `mobile-pet-tracker/src/` sin resultados

## Observaciones

Aprobado. Dos puntos para el gate humano de R12 (no bloquean este veredicto):

1. **Desviación documentada en R8**: la spec pedía el contador de "días restantes" en `warning font-black` dentro del tile de próxima vacuna, pero eso añadiría copy y cálculo visibles nuevos, en conflicto con la invariante dominante de la feature ("ningún texto visible cambia", aplica a R1–R12). Codex resolvió a favor de la invariante: tile 44px `warning-soft` con glifo de jeringa y el copy actual (`Next due` + nombre + fecha). Decisión razonable y documentada en `progress/impl_mobile-figma-polish.md` §Desviaciones; si el humano quiere el contador, es un ajuste menor de seguimiento.
2. **R12 smoke humano pendiente**: comparación lado a lado en Expo Go (light y dark) contra el Make. La feature queda `in_progress` hasta que el humano lo registre en `progress/impl_mobile-figma-polish.md`.

## Output de ./init.sh (final, ejecutado por el reviewer)
```
Test Suites: 27 passed, 27 total
Tests:       275 passed, 275 total
(móvil)
⚠️  Puerto 4566 sin respuesta — se saltan los e2e
✅ Lint sin errores
✅ Typecheck sin errores
══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
  Features: 36/46 completadas | 9 pendientes
EXIT=0
```
