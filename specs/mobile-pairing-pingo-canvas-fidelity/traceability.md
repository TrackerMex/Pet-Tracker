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
| R3 | src/screens/pairing/index.test.tsx::#188 R3: staggers the ping loop and resets at 2401 ms | `ebf21c95` test(pairing): specify stagger and exact ping loop boundary (R3) [rojo]; `bb598dbf` feat(pairing): apply ring stagger pending cycle boundary resolution (R3) [implementación]; `9f831ea3` test(pairing): apply approved cycle boundary amendment (R3) [verde E1, 151/151]; `c0e2c93a` refactor(pairing): read animated style from the public reanimated entry (R3) [excepción 5, import público] |
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
| R15 | src/screens/pairing/index.test.tsx::#188 R15: groups a 200 × 150 hero box and the title with a 10 px gap | pendiente |
| R16 | src/screens/pairing/index.test.tsx::#188 R7/R16: gives the title the 28 px token and black weight (renombra el test de R7); src/screens/pairing/index.test.tsx::#188 R16: centers the title at 28 px with black weight and title tracking; src/__tests__/pairing-canvas-fidelity.test.ts::#188 R16/R20: declares the new theme tokens | pendiente |
| R17 | src/screens/pairing/index.test.tsx::#188 R17: shows only the selected pet avatar above the hero; #188 R17: renders the initial or the photo on the palette slot of the selected pet; #188 R17: keeps the full pet switcher outside the linking view | pendiente |
| R18 | src/screens/pairing/index.test.tsx::#188 R18: renders the free-plan banner with an info icon and a bold lead; src/__tests__/pairing-canvas-fidelity.test.ts::#188 R11: resolves visible copy through bilingual catalog keys registered for pairing (lista migrada a Lead y Body) | pendiente |
| R19 | src/screens/pairing/index.test.tsx::#188 R19: anchors the submit button to the bottom edge; #188 R10: uses 20 px horizontal padding when %s (migrado: flexGrow 1 en linking) | pendiente |
| R20 | src/screens/pairing/index.test.tsx::#188 R20: styles label, code input and hint like the artboard; src/__tests__/pairing-canvas-fidelity.test.ts::#188 R16/R20: declares the new theme tokens | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Estado de E2 (2026-10-20)

R15–R20 (enmienda E2) están pendientes de implementar: sus filas dicen «pendiente» y no hay commit hasta que Codex los registre. Las migraciones de aserciones previas que E2 autoriza están en `tasks.md` §Migraciones autorizadas de E2. El estado de la sección siguiente describe la ejecución de R1–R14 y no cambia.

## Estado al cerrar esta ejecución (2026-10-19, tras excepción 5)

R13 y R1–R14 implementados con cobertura focalizada verde. E1 de R3 se conserva sin rehacer el componente. Excepción 4 aplicada exactamente en 0c717e29; R7 queda cerrado con pairing, design-drift y consistency-classnames verdes: `Tests: 254 passed, 254 total`. Excepciones 1 y 2 aplicadas en el commit de implementación de R10, sin ninguna otra modificación de aserciones previas. R9, R11 y R14 nacen verdes (NV) por los requisitos previos indicados en sus filas.

R12 incluye la prueba negativa real: la mutación temporal className="w-[3px]" provoca el único fallo de su candado y se revierte antes del commit; las cuatro guardas quedan verdes. La lectura de ui-copy-table se refactoriza para no registrar dos tests ajenos en la suite nueva.

**Bloqueo de typecheck de `863da0dc` corregido con la excepción 5** (commit `c0e2c93a`, import público de `react-native-reanimated`). El bloqueo era exit 2 solo en Typecheck, con TS2322, TS7017, TS2740, TS2320 y TS2345 en fuentes de react-native-reanimated, causado por la importación profunda. No se declara done: el reviewer rechaza sobre `1ec2046d` (`progress/review_188.md`) y H1–H3 siguen al humano. Las verificaciones que ya estaban iniciadas terminan con 122 suites y `Tests: 4027 passed, 4027 total` (3994 + 32 casos nuevos + 1 caso de excepción 2); las cuatro guardas pasan, lint termina con log vacío y graphify sale 0. La verificación completa se repite sobre el HEAD final: `progress/init-188.log` y `progress/init-188.exit`. Graphify advierte que omite 20 SQL por faltar su parser; no se añaden dependencias.

Evidencia detallada, commits, líneas Tests y límites en progress/impl_mobile-pairing-pingo-canvas-fidelity.md. H1–H3 siguen al humano; no se acredita fidelidad visual ni fps por tests.
