---
feature: "mobile-canvas-zones"
status: approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-canvas-zones]]

Columna «Test(s)»: tests nuevos de #202 y, tras «enmienda», los candados del
inventario de requirements § Candados que el commit rojo de ese R enmienda o
borra. Abreviaturas en el Contexto de [[requirements]]; CF =
`src/__tests__/canvas-foundations.test.ts` (#197).

| R | Test(s) | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|
| R1 | GZ `#202 R1` ×2; enmienda GZ `#41 R5` métricas (`paddingTop: 52`, `toBe(40 + 12)`), GZ `#189 R1`, profile `#173 R2.4` `text-26`, alerts `#174 R12` `tracking-title` | c5a45651 | 2a352007 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R2 | LY, ZF `#202 R2` (aguja `['theme', 'header-layout'].join('/')`); enmienda LY ×2; borra GF `#189 R23` | a4e03209 | 8b91d4a8 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R3 | GZ, ZF `#202 R3`; enmienda GZ `#189 R5` (cada fila, las cinco posiciones, family: F1, F2), GF `#189 R18`; doble de reicon sin `Map` | 47643ab6 | 097959b1 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R4 | GZ, GE, ZF `#202 R4`; enmienda GF `#189 R19.2` | f46cbd3b | 42993f4c | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R5 | GZ, ZF `#202 R5`; enmienda GZ `#189 R6`, GF `#189 R18`; doble de reicon con `AlertTriangle` | f9fa9a07 | 18918880 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R6 | GZ, ZF `#202 R6`; enmienda GZ `#41 R7` (recetas), `#189 R5` (papelera; sin `hitSlop`, M3) | 4b405bba | 36edd873 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R7 | CD (7 casos), ZF `#202 R7`; errata 28 px y atributo nativo accessibilityRole header; borra CF `describe('#197 R20: cimientos sin cablear')` entero; enmienda profile `#173 R2` `rounded-hero`, alerts `#174 R12` `text-15` | cd3aa980; ajuste 7f198849; errata e083cb06; API 1842bba0 | 2590c582; ca15f85a; 1ca6234f | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R8 | GZ `#202 R8` ×3; enmienda GZ `#41 R7` (Alert) | e3b327da; limpieza posterior 505bf6ab | cff043d0 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R9 | GE `#202 R9` ×4; enmienda GE `#146 R14` (incluidos F3, F4), `#189 R19.2`; borra el helper `alertButton` | 3052f1ad; enmienda tardía 71aac698 | 804f3ccd | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R10 | GZ ×2, ZF `#202 R10`; enmienda GZ `#41 R5` esqueleto, UL `#41 R10` (`+ 1`), language-provider `#194 R1` (`+ 1 // #202 R10`) | 12b653ef | b21e37e0 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R11 | GZ, ZF `#202 R11`; enmienda GZ `#41 R5` `pinta %p…`, `#41 R6` `pinta %s sin recargar…` (M1), alerts `#174 R12` `text-15` | 538ba7de | 398cb54c | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R12 | GE, ZF `#202 R12`; enmienda GE `#189 R8` fila | 2c201776 | a7612dc1 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R13 | GE, ZF `#202 R13`; enmienda GE `#146 R6` compone, `#189 R9` compone la hoja (F5), CC `#189 R9` (M8) | b356fc13 | f6da1bcd | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R14 | GE, ZF `#202 R14` | 0d348fd2 | 8d6acb88 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R15 | GE, ZF `#202 R15`; enmienda GE `#146 R8`, `#146 R14`, `#189 R13`, chunky-cta `#177 R3.1`, `#177 R4.1` | 86ba686f | 3c1c3180 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R16 | GE, ZF `#202 R16`; enmienda GE `#146 R8` `pinta %s bajo Guardar…` (M5), `#146 R16`, `#189 R11` | b03fc85e | 21b58dd1 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R17 | GE ×2, ZF `#202 R17`; enmienda GE `#146 R6` esqueleto (métricas, M6), `#189 R8` plano, `#189 R14`, `#146 R16`; borra `#189 R22`; profile `#173 R2.4`, alerts `tracking-title` | 15a955f4; limpieza posterior fbea47b3 | 4f5f0637 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R18 | GE ×2, ZF `#202 R18`; enmienda GE `#146 R6` esqueleto (barras, M6), UL `#146 R10` (`+ 1`), language-provider `#194 R1` (`+ 1 // #202 R18`), design-drift `#178 R13` `rounded16`, chunky-cta `#177 R7.3` | d3b8121a | 1672db90 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R19 | GE `#202 R19`; enmienda GE `#146 R6` error | d8217632 | f2b7c425 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R20 | ZF `#202 R20`; enmienda GF `#189 R16.1`, `#189 R16.3`, `#189 R24.1`, `#189 R24.2` | 11c28902 | 2ba3083b | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R21 | GZ `#202 R21` | n/a (conservación) | e30ee110 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R22 | GZ `#202 R22` | n/a (conservación) | e30ee110 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R23 | GZ `#202 R23` | n/a (conservación) | e30ee110 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R24 | GE `#202 R24` | n/a (conservación) | e30ee110 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R25 | ZF `#202 R25` (4 casos) | n/a (nace verde) | 1cf77769 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R26 | Smoke humano, dev build Android | n/a | n/a | pendiente |

## Cierre de implementación — 2026-10-24

R1–R25 tienen verde focal y sondas revertidas. R21–R24 y R25 nacieron verdes y llevan solo commit de test. Se han retirado exactamente 5 tests CF, 4 GF y 11 GE.

La suite completa mide 144 suites / 4747 casos (+84 −20 sobre 4683): 141 suites y 4744 casos verdes, 3 casos rojos. Las doce guardas del handoff pasan. El cierre global queda bloqueado por `Home #190 R5`, aserción translateY -10 frente a 0, no inventariada ni cubierta por la errata de recuentos. Las otras dos incidencias son timeouts de 5000 ms en GZ/GE, ambos verdes al re-medir cada fichero aislado sin flag: GE 143/143 y GZ 118/118 (reporte). No se modifica Home.

El implementador no marca la feature done ni crea el marcador .done. R26 sigue siendo el cierre humano en dev build Android; su checklist de ocho puntos está en progress/impl_mobile-canvas-zones.md. Ver allí commits, resultados y desviaciones (API de encabezado R7 y retirada del doble Stack tras el verde de R17).

Typecheck final y lint sin caché: exit 0, log de lint vacío. Graphify actualizado, sin cambios en manifiesto/lock. No hay nuevo fallo de los doce candados estáticos. El fallo no inventariado de Home requiere resolución del leader antes de cerrar; no se declara done.
