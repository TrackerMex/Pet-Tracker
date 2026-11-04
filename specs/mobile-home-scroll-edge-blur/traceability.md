---
feature: "mobile-home-scroll-edge-blur"
status: approved      # draft | spec_ready | approved
tags: [mobile, home, ui, spike, native, spec]
---

# Trazabilidad — [[mobile-home-scroll-edge-blur]] (#242)

Tests de pantalla en `mobile-pet-tracker/src/screens/home/index.test.tsx`; los de
R1 en `mobile-pet-tracker/src/__tests__/canvas-foundations.test.ts`. Los hashes
se desarrollan con su mensaje íntegro debajo de la tabla.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `canvas-foundations.test.ts::#242 R1: expo-backdrop queda fijada exacta en 0.1.3`; `canvas-foundations.test.ts::#197 R22: no añade dependencias (enmendado por #217 R8) (enmendado por #214 R23) (enmendado por #242 R1)` | pendiente |
| R2 | `index.test.tsx::#242 R2: el estado contenido pinta ambos bordes`; `…el estado carga pinta ambos bordes`; `…el estado error pinta ambos bordes` | pendiente |
| R3 | `index.test.tsx::#242 R3: con insets {"top":47,"bottom":31} las alturas son 71 y 131`; `…con insets {"top":0,"bottom":0} las alturas son 24 y 100` | pendiente |
| R4 | `index.test.tsx::#242 R4: home-edge-blur-top lleva pointerEvents none en style`; `…home-edge-blur-bottom lleva pointerEvents none en style` | pendiente |
| R5 | `index.test.tsx::#242 R5: la raíz contiene scroll, borde superior y borde inferior en ese orden` | pendiente |
| R6 | `index.test.tsx::#242 R6: con tema light el tint es systemThinMaterialLight`; `…con tema dark el tint es systemThinMaterialDark` | pendiente |
| R7 | `index.test.tsx::#242 R7: la pantalla vacía no pinta overlays ni raíz del blur` | pendiente |
| R8 | `index.test.tsx::#242 R8: conserva clase, inset automático y relleno inferior` | pendiente |
| R9 | anclas, alcance por diff y guards del handoff (`tasks.md` §R9) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda «pendiente». G3 (rebuild del
dev build) y G2 (smoke Android) son casillas del humano en
[[requirements]] §Aprobación; la feature no pasa a `done` hasta que estén
marcadas.
Convención de commit: `feat(mobile): #242 <desc> (R2, R3, …)`; test-primero.
El implementer deja los hashes tras el último verde en un único commit de
documentos (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Commits test-primero

1. pendiente — `test(mobile): #242 pin expo-backdrop 0.1.3 and amend the dependency count (R1)`.
2. pendiente — `chore(mobile): #242 add expo-backdrop 0.1.3 as a native dependency (R1)`.
3. pendiente — `test(mobile): #242 pin the edge blur overlays on Home (R2, R3, R4, R5, R6, R7, R8)`.
4. pendiente — `feat(mobile): #242 render progressive edge blur overlays on Home (R2, R3, R4, R5, R6)`.
5. pendiente — `docs(specs): #242 fill traceability`.

## Evidencia

Pendiente (la rellena el implementer: T0, primer rojo, verde tras cada commit de
producción y mutaciones detectadas).
