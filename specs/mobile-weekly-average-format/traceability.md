---
feature: "mobile-weekly-average-format"
status: draft
tags: [harness, spec]
---

# Trazabilidad — [[mobile-weekly-average-format]]

Rutas relativas a `mobile-pet-tracker/src/`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `screens/home/format.test.ts::#219 R1` | pendiente |
| R2 | `screens/home/format.test.ts::#219 R2` | pendiente |
| R3 | `screens/home/format.test.ts::#219 R3` | pendiente |
| R4 | `screens/home/weekly-activity-chart.test.tsx::#219 R4` | pendiente |
| R5 | `screens/home/weekly-activity-chart.test.tsx::#219 R5` | pendiente |
| R6 | `screens/home/weekly-activity-chart.test.tsx::#219 R6` (más los tres literales enmendados en `R12`) | pendiente |
| R7 | `screens/home/weekly-activity-chart.test.tsx::#219 R7` | pendiente |
| R8 | `screens/home/index.test.tsx`, `screens/home/weekly-activity-chart.test.tsx` (R5-R8, `#141 R1`), `screens/home/pingo-phrase.test.ts` (`#190 R8`, `#190 R9`) sin editar | pendiente |
| R9 | `__tests__/design-drift.test.ts`, `__tests__/ui-language.test.ts`, `providers/__tests__/language-provider.test.tsx` sin editar; `git diff origin/dev --stat` | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(#219): R1-R3 ...` / `feat(#219): R1,R2 ...`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
