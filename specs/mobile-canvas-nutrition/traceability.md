---
feature: "mobile-canvas-nutrition"
status: approved
tags: [harness, spec, mobile, canvas-parity]
---

# Trazabilidad — [[mobile-canvas-nutrition]] (#200)

| R | Test | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|
| R1 | DS `#200 R1`; FO y candados de ruta | f4363121 | 4c1eab22 | implementado; cierre global pendiente |
| R2 | FO `#200 R2` ×4 | a770860b | 42d516d0 | implementado; sondas verificadas, cierre global pendiente |
| R3 | FO `#200 R3` (héroe + cinco filas de texto) | 97e8fc3e | 556e103c | implementado; HT 14dee099, sondas verificadas, cierre global pendiente |
| R4 | MT `#200 R4`, FO `#200 R4` ×2 | ce1bb032 | f773b353 | verde local y sondas verificadas; cierre global pendiente |
| R5 | FO `#200 R5` | 4d7ddc5b | a7a23d9a | verde local; sondas de producción verificadas, cierre global pendiente |
| R6 | FO `#200 R6` ×4 | 1a4c70c1 | dccce7d3 | verde local y sondas verificadas; cierre global pendiente |
| R7 | FO `#200 R7` ×2 | 96295d13 | 5df35c8a | verde local y sondas verificadas; cierre global pendiente |
| R8 | FO `#200 R8` | fde92720 | fc640890 | verde local y sondas verificadas; cierre global pendiente |
| R9 | FO `#200 R9` ×2 | 2194ccca | 76b5bea8 | implementado; parada por DD no inventariado, sondas pendientes |
| R10 | FO `#200 R10` ×2 (el de «sin plan» nace verde; mutación plantada) | — | — | pendiente |
| R11 | FO `#200 R11` (rojo en el commit de R9) | 2194ccca | 76b5bea8 | orden verde local; cierre global pendiente |
| R12 | MS `#200 R12`, LY `#200 R12` | — | — | pendiente |
| R13 | MH `#200 R13`, LY `#200 R13` (y LY `#105 R8` enmendado) | — | — | pendiente |
| R14 | MS `#200 R14` | — | — | pendiente |
| R15 | MS `#200 R15`, MH `#200 R15` | — | — | pendiente |
| R16 | NC `#200 R16` ×4 | — | — | pendiente |
| R17 | NC `#200 R17` ×3 | — | — | pendiente |

La parada de R3 fue resuelta por el leader en 562051d2 (fila 52). Nueva parada obligatoria durante R9: DD `#178 R13: reserva los radios 14, 16 y 22…` no inventaría Food (2 rounded-16). Evidencia y pendientes en `progress/impl_mobile-canvas-nutrition.md`. Feature incompleta; no se declara done.
