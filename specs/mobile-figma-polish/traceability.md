---
feature: "mobile-figma-polish"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-figma-polish]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/theme/__tests__/global-css.test.ts::R1: global.css define los tokens light exactos del diseño` (incl. assert de ausencia de override `--radius`) | rojo `9e27a80`; verde `04aef32 feat(mobile-figma-polish): map light design tokens (R1)`; corrección post-smoke `e370daa fix(mobile-figma-polish): drop --radius override, heroui scale base (R1)` |
| R2 | `src/theme/__tests__/global-css.test.ts::R2: global.css define la paleta dark derivada del diseño`; `src/theme/__tests__/use-theme-colors.test.tsx::R2` (re-resolución reactiva al tema) | rojo `bef097f`; verde `80ba96b feat(mobile-figma-polish): derive dark design palette (R2)`; correcciones post-smoke rojo `879a0d6`→verde `e2d3d50 fix(mobile-figma-polish): resolve dark theme colors` y rojo `26c8f84`→verde `d28d406 fix(mobile-figma-polish): refresh tab colors with theme` + `b5bff10 fix(mobile-figma-polish): style Google map in dark mode` |
| R3 | `src/theme/__tests__/font-registration.test.ts::R3: el layout registra los pesos estáticos de Inter sin bloquear` | rojo `bed689e`; verde `e7a8890 feat(mobile-figma-polish): load static Inter fonts (R3)` |
| R4 | `src/components/__tests__/floating-tab-bar.test.tsx::R7: tab bar renderiza y navega`; `::R8: tab bar flota con safe area` (verde, sin cambios) | `b9283f4 feat(mobile-figma-polish): retokenize floating tab labels (R4)` |
| R5 | `src/components/__tests__/weight-chart.test.tsx::R8: la gráfica degrada con <2 puntos` (verde, sin cambios) | `0326dd6 feat(mobile-figma-polish): polish weight chart area (R5)` |
| R6 | `src/app/(tabs)/__tests__/home.test.tsx` (22 tests R6–R10 verdes, sin cambios) | `2fd27a3 feat(mobile-figma-polish): polish home dashboard (R6)` |
| R7 | `src/app/(tabs)/__tests__/map.test.tsx` (23 tests R4–R10 verdes, sin cambios) | `7b491d3 feat(mobile-figma-polish): polish map status overlay (R7)` |
| R8 | `src/app/(tabs)/__tests__/health.test.tsx` (21 tests R4–R6 verdes, sin cambios) | `e912b5e feat(mobile-figma-polish): polish health hub (R8)` |
| R9 | `src/app/(tabs)/__tests__/weight-log.test.tsx` (suite verde, sin cambios) | `13bcfa0 feat(mobile-figma-polish): polish weight log (R9)` |
| R10 | `src/app/(tabs)/__tests__/profile.test.tsx` (7 tests R10 verdes, sin cambios) | `41f25df feat(mobile-figma-polish): polish profile settings (R10)` |
| R11 | `src/app/(auth)/__tests__/{login,register,forgot}.test.tsx` (17 tests verdes, sin cambios) | `ab5f2e7 feat(mobile-figma-polish): polish authentication forms (R11)` |
| R12 | `bun run typecheck`, `bun run lint`, `bun run test -- --runInBand`, `./init.sh` y auditorías de contención: verdes (28 suites/284 tests tras las correcciones) | `5fc534f docs(mobile-figma-polish): record automated verification (R12)`; **smoke humano COMPLETO** (2026-08-23, light y dark tras 3 correcciones, registrado en `progress/impl_mobile-figma-polish.md` §R12) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Nota de esta feature: para R4–R11 la columna Test se cierra apuntando a la
suite existente que cubre la pantalla (verde, sin diffs en asserts), no a un
test nuevo — decisión registrada en [[design]] §6 y ratificada en el gate.
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
