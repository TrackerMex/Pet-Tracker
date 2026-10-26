---
feature: "mobile-vaccine-create"
status: draft        # draft | approved
tags: [mobile, spec]
---

# Trazabilidad — [[mobile-vaccine-create]] (#208)

Rutas de test relativas a `mobile-pet-tracker/src/`, salvo R22, que está en la raíz.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `api/__tests__/health-records.test.ts::#208 R1: …` (5 `it`) | pendiente |
| R2 | `utils/__tests__/vaccine-dates.test.ts::#208 R2: suma %i meses a %s y da %s` | pendiente |
| R3 | `utils/__tests__/form-rules.test.ts::#208 R3: …` (3 `it`) | pendiente |
| R4 | `app/__tests__/layout.test.tsx::#208 R4: …`, `app/__tests__/detail-stack.guard.test.tsx` (`#149 R3`), `screens/vaccine-create/index.test.tsx::#208 R4: …` | pendiente |
| R5 | `screens/health/index.test.tsx::#208 R5: …` (owner y 3 roles) | pendiente |
| R6 | `screens/health/index.test.tsx::#208 R6: …` (tarjeta, CTA y 3 roles) | pendiente |
| R7 | `screens/vaccine-create/index.test.tsx::#208 R7: …` | pendiente |
| R8 | `screens/vaccine-create/index.test.tsx::#208 R8: …` | pendiente |
| R9 | `screens/vaccine-create/index.test.tsx::#208 R9: …` | pendiente |
| R10 | `screens/vaccine-create/index.test.tsx::#208 R10: …` | pendiente |
| R11 | `screens/vaccine-create/index.test.tsx::#208 R11: …` | pendiente |
| R12 | `screens/vaccine-create/index.test.tsx::#208 R12: …` | pendiente |
| R13 | `screens/vaccine-create/index.test.tsx::#208 R13: …` | pendiente |
| R14 | `screens/vaccine-create/index.test.tsx::#208 R14: …` | pendiente |
| R15 | `screens/vaccine-create/index.test.tsx::#208 R15: …` | pendiente |
| R16 | `screens/vaccine-create/index.test.tsx::#208 R16: …` y `screens/health/index.test.tsx::#208 R16: …` | pendiente |
| R17 | `screens/vaccine-create/index.test.tsx::#208 R17: …` | pendiente |
| R18 | `screens/vaccine-create/index.test.tsx::#208 R18: …` | pendiente |
| R19 | `providers/__tests__/language-provider.test.tsx::#194 R1 … (enmendado por #208 R19)` | pendiente |
| R20 | `__tests__/ui-language.test.ts::#208 R20: R19_VACCINE_CREATE tiene 30 usos y cuadra con el código` | pendiente |
| R21 | `__tests__/design-drift.test.ts::#208 R21: …` y los inventarios enmendados de `chunky-cta-canvas-fidelity` y `consistency-classnames` | pendiente |
| R22 | `init-e2e-gate.test.mjs::#208 R22: E2E_SETUP_CMD siembra el catálogo de vacunas entre migrar y aprovisionar` | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(mobile): #208 R<n> … (rojo)` y luego `feat(mobile): #208 R<n> …`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
