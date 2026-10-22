---
feature: "mobile-home-photo-hero-canvas"
status: approved     # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-home-photo-hero-canvas]]

Rutas relativas a `mobile-pet-tracker/src/`. La columna de test lleva el `describe` previsto (`#195 R<n>: …`) y se completa con el nombre exacto del `it` cuando exista. R1 a R20 se verifican de forma automática; R21 es del humano.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `components/__tests__/pet-hero-header.test.tsx::#195 R1` | bd03f556 feat(mobile): contain hero in a 330 point frame (R1) |
| R2 | `components/__tests__/pet-avatar.test.tsx::#195 R2`; `components/__tests__/pet-hero-header.test.tsx::#195 R2` (su `it` `funde al llegar la mascota y al cambiar su id, sin repetir por nombre` queda enmendado por R14: Enmienda A2, [[requirements]] §Candados de visibilidad y de forma de style, fila 12) | 626ebc69 feat(mobile): align hero photo and fade on pet identity (R2) |
| R3 | `components/__tests__/pet-hero-header.test.tsx::#195 R3` | 964aac85 feat(mobile): match canvas gradient stops and scrim (R3) |
| R4 | `theme/__tests__/global-css.test.ts::#195 R4`; `components/__tests__/pet-hero-header.test.tsx::#195 R4` | f308ea70 feat(mobile): add theme-aware photo dim layer (R4) |
| R5 | `components/__tests__/pet-hero-header.test.tsx::#195 R5` | 016e4749 feat(mobile): float hero slot above photo (R5) |
| R6 | `components/__tests__/pet-hero-header.test.tsx::#195 R6`; `__tests__/alerts-canvas-fidelity.test.ts::limita $token a su inventario de producción` (fila `tracking-title`) | e17c14b3 feat(mobile): place hero caption over the gradient (R6) — pendiente sonda ALERTS |
| R7 | `components/__tests__/pet-hero-header.test.tsx::#195 R7`; `screens/home/index.test.tsx::#73 R9` | c9e578a9 feat(mobile): derive hero pill accent tone and spacing (R7) |
| R8 | `components/__tests__/pet-hero-header.test.tsx::#195 R8`; `components/__tests__/ping-ring.test.tsx::#195 R8` | 2b71c252 feat(mobile): use configurable ping ring for online status (R8) |
| R9 | `components/__tests__/pet-switcher.test.tsx::#195 R9` | pendiente |
| R10 | `components/__tests__/pet-switcher.test.tsx::#195 R10` | pendiente |
| R11 | `components/__tests__/glass-circle.test.tsx::#195 R11`; `screens/home/index.test.tsx::#195 R11`; `screens/home/index.test.tsx::#152 R5`; `__tests__/home-photo-hero-canvas.test.ts::#195 R19` (una sola `t('profile.addPet'`) | pendiente |
| R12 | `screens/home/index.test.tsx::#195 R12`; `screens/home/index.test.tsx::#78 R10`, `#124 R1`, `#78 R11` | pendiente |
| R13 | `theme/__tests__/motion.test.ts::#195 R13` | 2908e173 feat(mobile): add hero motion constants (R13) |
| R14 | `components/__tests__/pet-hero-header.test.tsx::#195 R14` (llamadas, reduce motion, prueba (ii)); `components/__tests__/pet-hero-header-motion.test.tsx::#195 R14` (prueba (i), fichero nuevo por la Enmienda A1); `screens/home/index.test.tsx::#152 R5` y los 12 `it` de HERO y HOME con sufijo `(enmendado por #195 R14)` (6 y 6; uno de los de HERO es el `it` de R2 de la Enmienda A2) ([[requirements]] §Candados de visibilidad) | pendiente |
| R15 | `screens/home/index.test.tsx::#195 R15`; `screens/home/index.test.tsx::R5: Home usa el hero compartido`; `screens/home/index.test.tsx::R6: home carga pets y selecciona` (su `it` `pads the content below the status bar with the top safe-area inset` queda enmendado por R15: Enmienda A3, [[requirements]] §Candados de visibilidad y de forma de style, fila 13) | pendiente |
| R16 | `screens/home/bubble-pop.test.tsx::#195 R16` (pruebas (i) y (ii), Reanimated real); `screens/home/index.test.tsx::#190 R11`, `#190 R4`, `#190 R7` (este último con la forma de `style` aplanada sin la cadena `StyleSheet`, Enmienda A1) | pendiente |
| R17 | `__tests__/home-photo-hero-canvas.test.ts::#195 R17` | pendiente |
| R18 | `components/__tests__/pet-hero-header.test.tsx::#195 R18`; `screens/home/index.test.tsx::#195 R18` | pendiente |
| R19 | `__tests__/home-photo-hero-canvas.test.ts::#195 R19` | pendiente |
| R20 | `__tests__/home-photo-hero-canvas.test.ts::#195 R20` | pendiente |
| R21 | humano: smoke en dev build Android (casilla de [[requirements]] §Aprobación) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

Implementación parcial parada antes de R14: la sonda fiel al AnimatedView del hero falló `toBeVisible` (supuesto 1 de design). La Enmienda A1 (2026-10-21) lo convierte en un hecho medido ([[design]] §Hechos medidos H1) y reescribe R14, R16 y los pasos de [[tasks]]; está pendiente de su casilla en [[requirements]] §Aprobación y, hasta que el humano la firme no se implementan R14 ni R16 (ni, por el orden de [[tasks]], nada que venga después de R14). Las filas de R14 y R16 siguen en «pendiente»: no llevan commit hasta que existan. R1 a R8 y R13 no cambian. No se declara done. R6 tiene tests verdes, pero falta la mutación de ALERTS. Evidencia, nombres completos, commits test-primero y pendientes en `progress/impl_mobile-home-photo-hero-canvas.md`. La Enmienda A2 (2026-10-22) añade una fila, la 12, a los candados de visibilidad por el contador global de R2 que la candidata de R14 puso rojo ([[design]] §Hechos medidos H2); está pendiente de su casilla en [[requirements]] §Aprobación y, hasta que el humano la firme, R14 queda parado. Las filas de R2 y R14 reflejan que ese `it` queda enmendado por R14; no se tocó ningún hash. La Enmienda A3 (2026-10-22) añade la fila 13 a los mismos candados por el `gap` del scroll de Inicio que la candidata de R15 puso rojo en un `it` anterior de R6 ([[design]] §Hechos medidos H3); está pendiente de su casilla en [[requirements]] §Aprobación y, hasta que el humano la firme, R15 queda parado. La fila de R15 refleja que ese `it` queda enmendado por R15; las filas que estaban en «pendiente» siguen así y no se tocó ningún hash.
