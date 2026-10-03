---
feature: "meals-history"
tags: [harness, spec, traceability]
---

# Trazabilidad — [[meals-history]]

> La rellena quien implementa (Codex CLI), fila a fila, con el hash del commit
> **verde** de cada requisito (el rojo va en el mensaje). Convención:
> `test(<scope>): … (#105 R<n>)` y `feat(<scope>): … (#105 R<n>)`.
> El reviewer no aprueba si alguna fila queda pendiente. Tras un rebase los
> hashes caducan: reapuntar y verificar `git merge-base --is-ancestor`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `backend-pet-tracker/test/meals-history.e2e-spec.ts::#105 R1` | `46c18d51 feat(nutrition): list served meals in an inclusive range (#105 R1)` — tsc verde; pendiente verde e2e en R4 |
| R2 | `backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition-error.mapper.spec.ts::#105 R2` | `059aa339 feat(nutrition): map meals history range errors (#105 R2)` — 4/4 unit verde; pendiente verde HTTP en R4 |
| R3 | `backend-pet-tracker/src/modules/nutrition/application/use-cases/get-meals-history.use-case.spec.ts::#105 R3` | `0fe5f788 feat(nutrition): return meals history by owner civil day (#105 R3)` — 9/9 verde |
| R4 | `backend-pet-tracker/test/meals-history.e2e-spec.ts::#105 R4` | pendiente |
| R5 | `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx::#105 R5` (+ candados `#65 R12`, `#65 R6`) | pendiente |
| R6 | `mobile-pet-tracker/src/api/__tests__/nutrition.test.ts::#105 R6` | pendiente |
| R7 | `mobile-pet-tracker/src/api/__tests__/query-keys.test.ts::#105 R7` | pendiente |
| R8 | `mobile-pet-tracker/src/app/__tests__/layout.test.tsx::#105 R8`, `detail-stack.test.tsx::#105 R8`, `detail-stack.navigation.test.tsx::#105 R8`, `detail-stack.guard.test.tsx::#105 R8` | pendiente |
| R9 | `mobile-pet-tracker/src/screens/meals-history/index.test.tsx::#105 R9` | pendiente |
| R10 | `mobile-pet-tracker/src/utils/__tests__/month-grid.test.ts::#105 R10` | pendiente |
| R11 | `mobile-pet-tracker/src/screens/meals-history/index.test.tsx::#105 R11` (+ candados `#62 R15`, `#98 R10`, `#64 R9`) | pendiente |
| R12 | `mobile-pet-tracker/src/screens/meals-history/index.test.tsx::#105 R12` | pendiente |
| R13 | `mobile-pet-tracker/src/screens/meals-history/index.test.tsx::#105 R13` | pendiente |
| R14 | `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx::#105 R14` | pendiente |
| R15 | `mobile-pet-tracker/src/__tests__/design-drift.test.ts::#105 R15` (+ `R3` Card, `#87 R19`) y comandos de cierre | pendiente |
| H1 | Prueba de humo en dev build Android (gate humano, `requirements.md` § Entorno de la prueba de humo) | pendiente (humano) |

Sesión detenida al descubrir el ancla R5 discrepante (9 usos `_layout` en H0 frente a 0 declarado); ver `progress/impl_meals-history.md`. R4 conserva el rojo `430b232a`, sin implementación. No hay cierre de R15 ni H1.
