---
feature: "mobile-home-photo-hero-canvas"
status: approved     # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-home-photo-hero-canvas]]

Rutas relativas a `mobile-pet-tracker/src/`. La columna de test lleva el `describe` previsto (`#195 R<n>: …`) y se completa con el nombre exacto del `it` cuando exista. R1 a R20 se verifican de forma automática; R21 es del humano.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `components/__tests__/pet-hero-header.test.tsx::#195 R1` | pendiente |
| R2 | `components/__tests__/pet-avatar.test.tsx::#195 R2`; `components/__tests__/pet-hero-header.test.tsx::#195 R2` | pendiente |
| R3 | `components/__tests__/pet-hero-header.test.tsx::#195 R3` | pendiente |
| R4 | `theme/__tests__/global-css.test.ts::#195 R4`; `components/__tests__/pet-hero-header.test.tsx::#195 R4` | pendiente |
| R5 | `components/__tests__/pet-hero-header.test.tsx::#195 R5` | pendiente |
| R6 | `components/__tests__/pet-hero-header.test.tsx::#195 R6`; `__tests__/alerts-canvas-fidelity.test.ts::limita $token a su inventario de producción` (fila `tracking-title`) | pendiente |
| R7 | `components/__tests__/pet-hero-header.test.tsx::#195 R7`; `screens/home/index.test.tsx::#73 R9` | pendiente |
| R8 | `components/__tests__/pet-hero-header.test.tsx::#195 R8`; `components/__tests__/ping-ring.test.tsx::#195 R8` | pendiente |
| R9 | `components/__tests__/pet-switcher.test.tsx::#195 R9` | pendiente |
| R10 | `components/__tests__/pet-switcher.test.tsx::#195 R10` | pendiente |
| R11 | `components/__tests__/glass-circle.test.tsx::#195 R11`; `screens/home/index.test.tsx::#195 R11`; `screens/home/index.test.tsx::#152 R5`; `__tests__/home-photo-hero-canvas.test.ts::#195 R19` (una sola `t('profile.addPet'`) | pendiente |
| R12 | `screens/home/index.test.tsx::#195 R12`; `screens/home/index.test.tsx::#78 R10`, `#124 R1`, `#78 R11` | pendiente |
| R13 | `theme/__tests__/motion.test.ts::#195 R13` | pendiente |
| R14 | `components/__tests__/pet-hero-header.test.tsx::#195 R14` | pendiente |
| R15 | `screens/home/index.test.tsx::#195 R15`; `screens/home/index.test.tsx::R5: Home usa el hero compartido` | pendiente |
| R16 | `screens/home/bubble-pop.test.tsx::#195 R16`; `screens/home/index.test.tsx::#190 R11`, `#190 R4`, `#190 R7` | pendiente |
| R17 | `__tests__/home-photo-hero-canvas.test.ts::#195 R17` | pendiente |
| R18 | `components/__tests__/pet-hero-header.test.tsx::#195 R18`; `screens/home/index.test.tsx::#195 R18` | pendiente |
| R19 | `__tests__/home-photo-hero-canvas.test.ts::#195 R19` | pendiente |
| R20 | `__tests__/home-photo-hero-canvas.test.ts::#195 R20` | pendiente |
| R21 | humano: smoke en dev build Android (casilla de [[requirements]] §Aprobación) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
