---
feature: "mobile-health"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-health]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/api/__tests__/health-records.test.ts::R1: listVaccines mapea la respuesta por kind` | `c43f2b9 feat(mobile-health): add vaccine records client (R1)` |
| R2 | `src/api/__tests__/health-records.test.ts::R2: listWeights mapea la respuesta por kind` | `7fa0bcb feat(mobile-health): add weight records list client (R2)` |
| R3 | `src/api/__tests__/health-records.test.ts::R3: createWeight publica y mapea por kind` | `3b1ebab feat(mobile-health): add weight creation client (R3)` |
| R4 | `src/app/(tabs)/__tests__/health.test.tsx::R4: health resuelve la mascota seleccionada` | `149f6d9 feat(mobile-health): resolve pets in health hub (R4)` |
| R5 | `src/app/(tabs)/__tests__/health.test.tsx::R5: vacunas con la próxima destacada` | `6802912 feat(mobile-health): add vaccine hub section (R5)` |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |
| R11 | pendiente | pendiente |
| R12 | pendiente | pendiente |
| R13 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile-health): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
