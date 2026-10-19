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
| R3 | src/screens/pairing/index.test.tsx::#188 R3: staggers the ping loop and resets at 2401 ms | `ebf21c95` test(pairing): specify stagger and exact ping loop boundary (R3) [rojo]; `bb598dbf` feat(pairing): apply ring stagger pending cycle boundary resolution (R3) [implementación]; `9f831ea3` test(pairing): apply approved cycle boundary amendment (R3) [verde E1, 151/151] |
| R4 | src/screens/pairing/index.test.tsx::#188 R4: floats Pingo from 0 to -10 and back over 3000 ms | `6e5bb3f9` test(pairing): specify Pingo float cycle (R4) [rojo]; `3d39f276` feat(pairing): float collar Pingo with shared motion (R4) [verde] |
| R5 | src/screens/pairing/index.test.tsx::#188 R5: keeps rings and Pingo at rest with reduced motion at 0, 1500 and 2400 ms | `47363b97` test(pairing): require static rings under reduced motion (R5) [rojo]; `aa4687b9` feat(pairing): keep ping rings static with reduced motion (R5) [verde] |
| R6 | src/screens/pairing/index.test.tsx::#188 R6: places the %s title first inside the scroll content (es/en) | `76bc928b` test(pairing): require localized title first in content (R6) [rojo]; `150dcf8d` test(pairing): query title order with supported RNTL API (R6) [rojo corregido]; `598af73d` feat(pairing): place localized title before pet selection (R6) [verde] |
| R7 | src/screens/pairing/index.test.tsx::#188 R7: gives the title the 24 px token and black weight — verde funcional; design-drift ROJO, bloque incompleto | `3e0e36cd` test(pairing): require 24 px title token (R7) [rojo]; `bcebe008` feat(pairing): apply title token pending design guard resolution (R7) [parcial; guardas pendientes] |
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

## Estado al cerrar esta ejecución (2026-10-19)

E1 aplicada en 9f831ea3: R3 verifica 0/600/2400/2401 ms sin cambiar la animación por la aserción retirada. R4, R5 y R6 completados con rojo y verde. R13, R1 y R2 conservan su evidencia funcional previa.

Parada en la verificación obligatoria de R7: pairing pasa 69/69 y consistency-classnames pasa, pero design-drift tiene dos rojos. Sus guardas de clases arbitrarias interpretan el selector `ring-[01]` del test de R2 (pairing/index.test.tsx:1096) como una clase arbitraria. Ambas aserciones señalan ese test; el fallo está fuera de las excepciones 1 y 2 autorizadas para R10. No se cambió el selector ni las guardas. R7 no está completado, y R8–R12 y R14 siguen pendientes. NV: ninguno evaluado.

Última corrida focalizada: 1 suite fallida, 2 verdes; `Tests: 2 failed, 252 passed, 254 total`. No se ejecutó el Cierre completo tras la parada obligatoria. El reviewer no debe aprobar #188 con esta tabla parcial. Detalle y evidencia por commit en progress/impl_mobile-pairing-pingo-canvas-fidelity.md.
