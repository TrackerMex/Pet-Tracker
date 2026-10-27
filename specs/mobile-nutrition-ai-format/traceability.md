---
feature: "mobile-nutrition-ai-format"
status: draft
tags: [harness, spec]
---

# Trazabilidad — [[mobile-nutrition-ai-format]]

Rutas relativas a `mobile-pet-tracker/src/`. Base fija H0: se registra al arrancar la
implementación (`git rev-parse --short HEAD` de la rama al hacer el handoff).

| Requisito | Test (archivo::nombre) | Commit de test / base | Commit de implementación o validación |
|---|---|---|---|
| R1 | `screens/food/parse-ai-explanation.test.ts::#224 R1` (19 filas) | pendiente | pendiente |
| R2 | `screens/food/parse-ai-explanation.test.ts::#224 R2` (18 filas, no lanza, carga lineal) | pendiente | pendiente |
| R3 | `screens/food/parse-ai-explanation.test.ts::#224 R3` (6 filas y `SAMPLE`) | pendiente | pendiente |
| R4 | `screens/food/ai-explanation.test.tsx::#224 R4` (6 filas), `__tests__/ui-copy-table.ts`, `__tests__/ui-language.test.ts`, `providers/__tests__/language-provider.test.tsx` | pendiente | pendiente |
| R5 | `screens/food/ai-explanation.test.tsx::#224 R5` | pendiente | pendiente |
| R6 | `screens/food/ai-explanation.test.tsx::#224 R6` (5 filas y degradado) | pendiente | pendiente |
| R7 | `screens/food/ai-explanation.test.tsx::#224 R7` (alterna, 44, texto nuevo) | pendiente | pendiente |
| R8 | `screens/food/ai-explanation.test.tsx::#224 R8` (6 filas) | pendiente | pendiente |
| R9 | `screens/food/ai-explanation.test.tsx::#224 R9` (etiqueta, botón fuera, recorte) | pendiente | pendiente |
| R10 | `screens/food/index.test.tsx::#200 R8` (enmendado por #224 R10), `::#224 R10` (4 filas) | pendiente | pendiente |
| R11 | `screens/food/ai-explanation.test.tsx::#224 R11` (montaje y fuente sin imports prohibidos) | pendiente | pendiente |
| R12 | sin jest: `git diff origin/dev --stat -- ../backend-pet-tracker package.json bun.lock` vacío | pendiente | pendiente |
| R13 | `__tests__/profile-canvas-fidelity.test.ts` (lista `text-13`), `__tests__/nutrition-canvas-fidelity.test.ts` (fila `leading-body` e `it.each` `#224 R13`) | pendiente | pendiente |

## Commits referenciados

Pendiente (C1 a C6 de [[tasks]]).

Evidencias y tabla R1-R13: `progress/impl_mobile-nutrition-ai-format.md` (a crear por
Codex). Las aprobaciones (firma de la spec y smoke de dispositivo) quedan reservadas en
[[requirements]] § Aprobación.
