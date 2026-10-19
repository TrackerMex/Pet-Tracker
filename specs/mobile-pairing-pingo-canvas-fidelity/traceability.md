---
feature: "mobile-pairing-pingo-canvas-fidelity"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-pairing-pingo-canvas-fidelity]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | src/screens/pairing/index.test.tsx::#188 R1: shows the collar pose as the first visual content | `9dc36944` test(pairing): require collar pose before form content (R1) [rojo]; `af257a8b` feat(pairing): lead the linking view with collar Pingo (R1) [verde] |
| R2 | src/screens/pairing/index.test.tsx::#188 R2: draws exactly two accent rings behind Pingo | `ef7cd9e3` test(pairing): require two accent rings behind Pingo (R2) [rojo]; `5f24b361` feat(pairing): place two accent rings behind collar Pingo (R2) [verde] |
| R3 | src/screens/pairing/index.test.tsx::#188 R3: staggers the ping loop and resets at 2400 ms — ROJO a 2400 ms; requisito sin completar | `ebf21c95` test(pairing): specify stagger and exact ping loop boundary (R3) [rojo]; `bb598dbf` feat(pairing): apply ring stagger pending cycle boundary resolution (R3) [intento, sigue rojo] |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |
| R11 | pendiente | pendiente |
| R12 | pendiente | pendiente |
| R13 | src/components/__tests__/ping-ring.test.tsx::#188 R13: applies the %i ms delay to both animated properties (800 y 1600); src/screens/welcome/index.test.tsx sin cambios | `a479c7f7` test(pairing): specify shared ring delays before extraction (R13) [rojo]; `d9d98844` refactor(pairing): share welcome ping rings with explicit delays (R13) [verde] |
| R14 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Bloqueo de implementación (2026-10-19)

R13, R1 y R2 en verde. R3 sigue rojo: a 2400 ms el anillo 0 muestra opacity 0 y scale 1.5, frente a 0.55/0.55 exigido. R4–R12 y R14 no se iniciaron. Cierre suspendido según el handoff; esta tabla no acredita la feature completa. Detalle en progress/impl_mobile-pairing-pingo-canvas-fidelity.md.
