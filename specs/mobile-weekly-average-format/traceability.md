---
feature: "mobile-weekly-average-format"
status: approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-weekly-average-format]]

Rutas relativas a `mobile-pet-tracker/src/`. Base fija H0: `fb6b9ad2`.

| Requisito | Test (archivo::nombre) | Commit de test / base | Commit de implementación o validación |
|---|---|---|---|
| R1 | `screens/home/format.test.ts::#219 R1` (19 filas) | `7e4a3eaf` (C1) | `6360d5b0` (C3) |
| R2 | `screens/home/format.test.ts::#219 R2` (13 filas, incluye 3.05) | `7e4a3eaf` (C1) | `6360d5b0` (C3) |
| R3 | `screens/home/format.test.ts::#219 R3` (8 filas; sonda c detectada) | `7e4a3eaf` (C1) | `6360d5b0` (C3: 53/53; fmtKm sin cambio) |
| R4 | `screens/home/weekly-activity-chart.test.tsx::#219 R4` (9 filas es/en) | `2b4b716b` (C2) | `6360d5b0` (C3) |
| R5 | `screens/home/weekly-activity-chart.test.tsx::#219 R5` (y1/y2 reales; sonda d detectada) | `2b4b716b` (C2) | `8b53d0f5` (C4: verificación; average sin cambio) |
| R6 | `screens/home/weekly-activity-chart.test.tsx::#219 R6` (9 filas es + inglés), más tres literales enmendados de R12 | `2b4b716b` (C2) | `8b53d0f5` (C4) |
| R7 | `screens/home/weekly-activity-chart.test.tsx::#219 R7` (espía restaurado en finally; sonda e detectada) | `2b4b716b` (C2) | `8b53d0f5` (C4) |
| R8 | `screens/home/index.test.tsx`, `weekly-activity-chart.test.tsx` (R5-R8, #141 R1), `pingo-phrase.test.ts` (#190 R8/R9); candados existentes conservados | `fb6b9ad2` (H0: tests heredados) | `8b53d0f5` (C4: suite completa verde y 487/487 de Inicio tras commit) |
| R9 | `__tests__/design-drift.test.ts`, `consistency-classnames.test.ts`, `ui-language.test.ts`, `home-canvas-fidelity.test.ts`, `providers/__tests__/language-provider.test.tsx`; diff de rutas protegidas vacío contra H0 | `fb6b9ad2` (H0: tests heredados sin editar) | `8b53d0f5` (C4: 157 suites, 5609 tests; tipos y lint verdes) |

## Commits referenciados

- C1 `7e4a3eaf` — `test(#219): R1-R3 lock the minutes, count and km formatters`
- C2 `2b4b716b` — `test(#219): R4-R7 lock the average label and the trend`
- C3 `6360d5b0` — `feat(#219): R1, R2 round minutes first and show one decimal in counts`
- C4 `8b53d0f5` — `feat(#219): R6, R7 format the trend with a fixed locale and a decimal point`

R3 y R5 son regresiones que nacen verdes, sin implementación nueva; sus sondas
(c) y (d) se plantaron, fallaron por la aserción esperada y se revirtieron.
R8/R9 reutilizan los tests de H0; los únicos it antiguos enmendados son los tres
de tendencia de R12 previstos en [[design]]. No cambia ningún inventario.

Evidencias y tabla R1-R9: [[../../progress/impl_mobile-weekly-average-format]].
La aprobación del smoke Android sigue reservada al humano en [[requirements]].
