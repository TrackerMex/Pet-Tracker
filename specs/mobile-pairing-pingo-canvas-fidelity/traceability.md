---
feature: "mobile-pairing-pingo-canvas-fidelity"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-pairing-pingo-canvas-fidelity]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | src/screens/pairing/index.test.tsx::#188 R1: shows the collar pose as the first visual content | `9dc36944` test(pairing): require collar pose before form content (R1) [rojo]; `af257a8b` feat(pairing): lead the linking view with collar Pingo (R1) [verde] |
| R2 | src/screens/pairing/index.test.tsx::#188 R2: draws exactly two accent rings behind Pingo | `ef7cd9e3` test(pairing): require two accent rings behind Pingo (R2) [rojo]; `5f24b361` feat(pairing): place two accent rings behind collar Pingo (R2) [verde]; `53e9af61` refactor(pairing): spell R2 ring order selector without bracket syntax (R2) [excepción 3, C8 verde] |
| R3 | src/screens/pairing/index.test.tsx::#188 R3: staggers the ping loop and resets at 2401 ms | `ebf21c95` test(pairing): specify stagger and exact ping loop boundary (R3) [rojo]; `bb598dbf` feat(pairing): apply ring stagger pending cycle boundary resolution (R3) [implementación]; `9f831ea3` test(pairing): apply approved cycle boundary amendment (R3) [verde E1, 151/151] |
| R4 | src/screens/pairing/index.test.tsx::#188 R4: floats Pingo from 0 to -10 and back over 3000 ms | `6e5bb3f9` test(pairing): specify Pingo float cycle (R4) [rojo]; `3d39f276` feat(pairing): float collar Pingo with shared motion (R4) [verde] |
| R5 | src/screens/pairing/index.test.tsx::#188 R5: keeps rings and Pingo at rest with reduced motion at 0, 1500 and 2400 ms | `47363b97` test(pairing): require static rings under reduced motion (R5) [rojo]; `aa4687b9` feat(pairing): keep ping rings static with reduced motion (R5) [verde] |
| R6 | src/screens/pairing/index.test.tsx::#188 R6: places the %s title first inside the scroll content (es/en) | `76bc928b` test(pairing): require localized title first in content (R6) [rojo]; `150dcf8d` test(pairing): query title order with supported RNTL API (R6) [rojo corregido]; `598af73d` feat(pairing): place localized title before pet selection (R6) [verde] |
| R7 | src/screens/pairing/index.test.tsx::#188 R7: gives the title the 24 px token and black weight; design-drift y consistency-classnames verdes | `3e0e36cd` test(pairing): require 24 px title token (R7) [rojo]; `bcebe008` feat(pairing): apply title token pending design guard resolution (R7) [implementación]; `0c717e29` refactor(pairing): cite feature 188 as R1-R14 in describe title (R7) [excepción 4, verde 254/254] |
| R8 | src/screens/pairing/index.test.tsx::#188 R8: orders the %s linking content and preserves its exact copy (es/en) | `252e7e29` test(pairing): specify localized linking content order (R8) [rojo]; `ee3fbc93` feat(pairing): expose label and hint in linking content order (R8) [verde 71/71] |
| R9 | src/screens/pairing/index.test.tsx::#188 R9: omits the unapproved subtitle in %s (10 estados) | `e5716f2f` test(pairing): keep unapproved subtitle absent across states (R9) [NV, D5(a) y R6/R8; verde 81/81] |
| R10 | src/screens/pairing/index.test.tsx::#188 R10: uses 20 px horizontal padding when %s (linking/paired) | `97f2b146` test(pairing): require artboard padding in both device states (R10) [rojo]; `e2194c67` feat(pairing): apply artboard padding and approved metric assertions (R10) [verde 269/269; excepciones 1 y 2] |
| R11 | src/__tests__/pairing-canvas-fidelity.test.ts::#188 R11: resolves visible copy through bilingual catalog keys registered for pairing | `68fb1458` test(pairing): verify catalog copy and registered bilingual keys (R11) [NV, R6/R8]; `c0387881` refactor(pairing): inspect copy table without registering its tests (R11) [verde 33/33 con ui-language] |
| R12 | src/__tests__/pairing-canvas-fidelity.test.ts::#188 R12: keeps hex colors and bracket classes out of %s (dos fuentes); cuatro suites de guardas | `94cea37c` test(pairing): guard style sources after bracket mutation check (R12) [mutación w-[3px] detectada en rojo y revertida antes del commit; cinco suites verdes 243/243] |
| R13 | src/components/__tests__/ping-ring.test.tsx::#188 R13: applies the %i ms delay to both animated properties (800 y 1600); src/screens/welcome/index.test.tsx sin cambios | `a479c7f7` test(pairing): specify shared ring delays before extraction (R13) [rojo]; `d9d98844` refactor(pairing): share welcome ping rings with explicit delays (R13) [verde] |
| R14 | src/screens/pairing/index.test.tsx::#188 R14: preserves %s without the linking hero (tracked/free/unknown/ready/no-pets) | `f820d669` test(pairing): preserve paired ready and empty states without hero (R14) [NV, gating R1/R2/R4; verde 88/88] |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Estado al cerrar esta ejecución (2026-10-19, tras excepción 4)

R13 y R1–R14 implementados con cobertura focalizada verde. E1 de R3 se conserva sin rehacer el componente. Excepción 4 aplicada exactamente en 0c717e29; R7 queda cerrado con pairing, design-drift y consistency-classnames verdes: `Tests: 254 passed, 254 total`. Excepciones 1 y 2 aplicadas en el commit de implementación de R10, sin ninguna otra modificación de aserciones previas. R9, R11 y R14 nacen verdes (NV) por los requisitos previos indicados en sus filas.

R12 incluye la prueba negativa real: la mutación temporal className="w-[3px]" provoca el único fallo de su candado y se revierte antes del commit; las cuatro guardas quedan verdes. La lectura de ui-copy-table se refactoriza para no registrar dos tests ajenos en la suite nueva.

**Cierre bloqueado por typecheck (exit 2)** tras pasar la preguarda de ausencia de .expo/types/router.d.ts. TypeScript da TS2322, TS7017, TS2740, TS2320 y TS2345 en fuentes de react-native-reanimated. Se activa la parada del handoff: no se corrige código ni se elude el gate. No se declara done ni se considera aprobable la feature con un Cierre rojo. Las verificaciones que ya estaban iniciadas terminan con 122 suites y `Tests: 4027 passed, 4027 total` (3994 + 32 casos nuevos + 1 caso de excepción 2); las cuatro guardas pasan, lint termina con log vacío y graphify sale 0. No se lanza otra verificación tras el fallo de typecheck. Graphify advierte que omite 20 SQL por faltar su parser; no se añaden dependencias.

Evidencia detallada, commits, líneas Tests y límites en progress/impl_mobile-pairing-pingo-canvas-fidelity.md. H1–H3 siguen al humano; no se acredita fidelidad visual ni fps por tests.
