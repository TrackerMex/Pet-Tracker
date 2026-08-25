---
feature: "mobile-tab-glass"
status: approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-tab-glass]] (feature #50)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/components/__tests__/floating-tab-bar.test.tsx::R1: usa GlassView cuando liquid glass está disponible (y nunca junto a BlurView)` | `7e60fa6 test(mobile-tab-glass): cover liquid glass backdrop (R1)` → `de26438 feat(mobile-tab-glass): render liquid glass backdrop (R1)` |
| R2 | `src/components/__tests__/floating-tab-bar.test.tsx::R2: fallback BlurView con tint por tema, blurMethod y overlay translúcido` + `src/theme/__tests__/global-css.test.ts::R2: tokens glass-surface y tab-pill en light y dark` | `5ebd84f test(mobile-tab-glass): cover blur fallback and tokens (R2)` → `b75e8bf feat(mobile-tab-glass): add themed blur fallback (R2)` |
| R3 | `src/components/__tests__/floating-tab-bar.test.tsx::R3: pill dimensionado y posicionado tras layout (y ausente antes)` | `bbe4052 test(mobile-tab-glass): cover tab indicator geometry (R3)` → `409c02d feat(mobile-tab-glass): position tab indicator after layout (R3)` |
| R4 | `src/components/__tests__/floating-tab-bar.test.tsx::R4: pill se desliza con TAB_INDICATOR_SPRING y retarget-ea en vuelo` | `b0aa293 test(mobile-tab-glass): cover interruptible indicator spring (R4)` → `9f0cb15 feat(mobile-tab-glass): animate interruptible tab indicator (R4)` |
| R5 | `src/components/__tests__/floating-tab-bar.test.tsx::R5: TAB_INDICATOR_SPRING respeta reduced motion del sistema` | `806989b test(mobile-tab-glass): cover reduced motion spring config (R5)` → `f00d207 feat(mobile-tab-glass): respect system reduced motion (R5)` |
| R6 | `src/app/__tests__/tabs-layout.test.tsx::R6: Tabs declara animation fade en screenOptions` | `757dcec test(mobile-tab-glass): cover tab content fade (R6)` → `3da2d36 feat(mobile-tab-glass): fade tab content transitions (R6)` |
| R7 | suite existente `src/components/__tests__/floating-tab-bar.test.tsx` (describes "R7: tab bar renderiza y navega" y "R8: tab bar flota con safe area" de la spec original, sin relajar aserciones) | suite original `9f7d634` → `e306135` (R7) y `f30952c` → `cf99e35` (R8); regresión completa estabilizada en `ce9d2b0 test(mobile-tab-glass): stabilize tab layout regression (R7)` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile-tab-glass): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
