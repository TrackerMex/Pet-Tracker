---
feature: "mobile-nutrition-ai-format"
status: draft
tags: [harness, spec]
---

# Trazabilidad — [[mobile-nutrition-ai-format]]

Rutas relativas a `mobile-pet-tracker/src/`. Base fija H0: `552c6b0b` (`552c6b0bc07835f3c5412bc50583dd8587d55a0e`).

| Requisito | Test (archivo::nombre) | Commit de test / base | Commit de implementación o validación |
|---|---|---|---|
| R1 | `screens/food/parse-ai-explanation.test.ts::#224 R1` (19 filas) | `4886b38700b8befe52f49734d9223faed9efd7fc` | `ba62b57fda9e6b3ddea7baa807d67b3788dc19b5` |
| R2 | `screens/food/parse-ai-explanation.test.ts::#224 R2` (18 filas, no lanza, carga lineal) | `4886b38700b8befe52f49734d9223faed9efd7fc` | `ba62b57fda9e6b3ddea7baa807d67b3788dc19b5` |
| R3 | `screens/food/parse-ai-explanation.test.ts::#224 R3` (6 filas y `SAMPLE`) | `4886b38700b8befe52f49734d9223faed9efd7fc` | `ba62b57fda9e6b3ddea7baa807d67b3788dc19b5` |
| R4 | `screens/food/ai-explanation.test.tsx::#224 R4` (6 filas), `__tests__/ui-copy-table.ts`, `__tests__/ui-language.test.ts`, `providers/__tests__/language-provider.test.tsx` | `bcb94e1ae10141a86b102beb17342cbc1f2e29b4` | `8be51e4ff71eca5b04a0c0bd11eb83e55472f178` |
| R5 | `screens/food/ai-explanation.test.tsx::#224 R5` | `bcb94e1ae10141a86b102beb17342cbc1f2e29b4` | `8be51e4ff71eca5b04a0c0bd11eb83e55472f178` |
| R6 | `screens/food/ai-explanation.test.tsx::#224 R6` (5 filas y degradado) | `bcb94e1ae10141a86b102beb17342cbc1f2e29b4` | `8be51e4ff71eca5b04a0c0bd11eb83e55472f178` |
| R7 | `screens/food/ai-explanation.test.tsx::#224 R7` (alterna, 44, texto nuevo) | `bcb94e1ae10141a86b102beb17342cbc1f2e29b4` | `8be51e4ff71eca5b04a0c0bd11eb83e55472f178` |
| R8 | `screens/food/ai-explanation.test.tsx::#224 R8` (6 filas) | `bcb94e1ae10141a86b102beb17342cbc1f2e29b4` | `8be51e4ff71eca5b04a0c0bd11eb83e55472f178` |
| R9 | `screens/food/ai-explanation.test.tsx::#224 R9` (etiqueta, botón fuera, recorte) | `bcb94e1ae10141a86b102beb17342cbc1f2e29b4` | `8be51e4ff71eca5b04a0c0bd11eb83e55472f178` |
| R10 | `screens/food/index.test.tsx::#200 R8` (enmendado por #224 R10), `::#224 R10` (4 filas) | `bcb94e1ae10141a86b102beb17342cbc1f2e29b4` | `9b95970f05d47b8f016764e5f4b8c040e0ae0cd4` |
| R11 | `screens/food/ai-explanation.test.tsx::#224 R11` (montaje y fuente sin imports prohibidos) | `bcb94e1ae10141a86b102beb17342cbc1f2e29b4` | `8be51e4ff71eca5b04a0c0bd11eb83e55472f178` |
| R12 | sin jest: diff vacío (`git diff origin/dev --stat -- ../backend-pet-tracker package.json bun.lock`) | `552c6b0bc07835f3c5412bc50583dd8587d55a0e` | `9b95970f05d47b8f016764e5f4b8c040e0ae0cd4` |
| R13 | `__tests__/profile-canvas-fidelity.test.ts` (lista `text-13`), `__tests__/nutrition-canvas-fidelity.test.ts` (fila `leading-body` e `it.each` `#224 R13`) | `bcb94e1ae10141a86b102beb17342cbc1f2e29b4` | `9b95970f05d47b8f016764e5f4b8c040e0ae0cd4` |

## Commits referenciados

- C1: `4886b38700b8befe52f49734d9223faed9efd7fc` — `test(mobile): parser grammar, degradation and plain text (R1, R2, R3)`
- C2: `ba62b57fda9e6b3ddea7baa807d67b3788dc19b5` — `feat(mobile): AI explanation parser (R1, R2, R3)`
- C3: `bcb94e1ae10141a86b102beb17342cbc1f2e29b4` — `test(mobile): AI explanation component, card and lock amendments (R4-R11, R13)`
- C4: `8be51e4ff71eca5b04a0c0bd11eb83e55472f178` — `feat(mobile): AI explanation component and copy keys (R4-R9, R11, R13)`
- C5: `9b95970f05d47b8f016764e5f4b8c040e0ae0cd4` — `feat(mobile): AI card uses the formatted explanation (R10, R13)`
- C6: commit de este archivo, tasks.md y el reporte — `docs(mobile): traceability and report for the AI explanation format (R1-R13)`.

Evidencias y tabla R1-R13: `progress/impl_mobile-nutrition-ai-format.md`. Las aprobaciones (firma de la spec y smoke de dispositivo) quedan reservadas en
[[requirements]] § Aprobación.
