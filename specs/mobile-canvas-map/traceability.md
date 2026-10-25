---
feature: "mobile-canvas-map"
status: approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-canvas-map]]

| R | Tests | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|
| R1 | MT `#201 R1` ×2; filas 15, 20; CF R1 | `87f3198e`, `dea9ba0c` (errata E2) | `185cd67e` | implementado |
| R2 | MT `#201 R2` ×2; filas 6–11, 27; CF R2 | `c5791111` | `28345d2d` | implementado |
| R3 | MT `#201 R3` ×3 | `3eefc27b` | no aplica (nace verde) | implementado |
| R4 | MT `#201 R4` ×2; CF R4 | `f84fb5ff` | `c322db7b` | implementado |
| R5 | MT `#201 R5`; filas 12, 13, 25, 26; CF R5 | `f3b9b4ba` | `75ac3bc7` | implementado |
| R6 | MT `#201 R6` ×4; fila 14; CF R6 | `b205a365` | `74dd6786` | implementado |
| R7 | MT `#201 R7` ×2; CF R7 | `95b6e7aa` | `b13ac6bd` | implementado |
| R8 | MT `#201 R8`; CF R8 | `1bd49c3c` | `40600ea1` | implementado |
| R9 | MT `#201 R9`; CF R9 | `6993dd71` | `3b187687` | implementado |
| R10 | MT `#201 R10` ×3; CF R10 (incluido `los once Skeleton del mapa son pulse`) | `b6b8dbd5`, `78954267` | `143bc01c` | implementado |
| R11 | MT `#201 R11` ×2; filas 1–5, 19; CF R11 | `5b5e3724`, `3a39f70a` | `9687c788` | implementado |
| R12 | MT `#201 R12`; fila 16; CF R12 | `f83f3a72` | `a0a539aa` | implementado |
| R13 | MT `#201 R13` ×3; filas 17, 18, 21–24, 26; CF R13 | `a86bcd4d`, `af59bbf1` (errata E4: CO), `48caa133` (título de CC R7.2) | `d16f343e` | implementado |
| R14 | EH `#198 R18` ×6 (nacen verdes: entregado por #198) | no aplica | no aplica | implementado (sin commits: lo entregó #198 R18) |
| R15 | PM `#201 R15` ×2; MT `#201 R15`; CF R15 | `08cbc116` | `6dcf8701` | implementado |
| R16 | CF `#201 R16` ×28 (18 filas de guarda, 1 de iconos, 8 de mutación, 1 de exención) | `d19288c7` | no aplica (nace verde) | implementado |

Cierre del leader (2026-10-25): el reviewer aprobó sobre `ba13cc36` (`progress/review_mobile-canvas-map.md`, 0 bloqueantes, 8 no bloqueantes) con el gate del leader en verde. Después se mergeó `origin/dev` con #204 y #203 (`4a95a892`, conflictos de candados agregados resueltos por unión) y se repitió el gate: exit 0, móvil 154/154 suites, 5406/5406 tests, 1 snapshot. R3 cierra también #151 (D15). El smoke S1–S10 lo cierra el humano en el lote `progress/smoke_canvas-parity.md` (plan §6).
