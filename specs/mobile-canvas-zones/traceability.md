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
| R1 | GZ `#202 R1` ×2; enmienda GZ `#41 R5` métricas (`paddingTop: 52`, `toBe(40 + 12)`), GZ `#189 R1`, profile `#173 R2.4` `text-26`, alerts `#174 R12` `tracking-title` | c5a45651 | 2a352007 | verificado (3 suites verdes; cierre global pendiente por bloqueo R7) |
| R2 | LY, ZF `#202 R2` (aguja `['theme', 'header-layout'].join('/')`); enmienda LY ×2; borra GF `#189 R23` | — | — | pendiente |
| R3 | GZ, ZF `#202 R3`; enmienda GZ `#189 R5` (cada fila, las cinco posiciones, family: F1, F2), GF `#189 R18`; doble de reicon sin `Map` | — | — | pendiente |
| R4 | GZ, GE, ZF `#202 R4`; enmienda GF `#189 R19.2` | — | — | pendiente |
| R5 | GZ, ZF `#202 R5`; enmienda GZ `#189 R6`, GF `#189 R18`; doble de reicon con `AlertTriangle` | — | — | pendiente |
| R6 | GZ, ZF `#202 R6`; enmienda GZ `#41 R7` (recetas), `#189 R5` (papelera; sin `hitSlop`, M3) | — | — | pendiente |
| R7 | CD ×4, ZF `#202 R7`; borra CF `describe('#197 R20: cimientos sin cablear')` entero; enmienda profile `#173 R2` `rounded-hero`, alerts `#174 R12` `text-15` | cd3aa980; ajuste 7f198849 | 2590c582 | tests verdes; bloqueado por discrepancia spec/canvas 24/28 px |
| R8 | GZ `#202 R8` ×3; enmienda GZ `#41 R7` (Alert) | — | — | pendiente |
| R9 | GE `#202 R9` ×4; enmienda GE `#146 R14` (incluidos F3, F4), `#189 R19.2`; borra el helper `alertButton` | — | — | pendiente |
| R10 | GZ ×2, ZF `#202 R10`; enmienda GZ `#41 R5` esqueleto, UL `#41 R10` (`+ 1`), language-provider `#194 R1` (`+ 1 // #202 R10`) | — | — | pendiente |
| R11 | GZ, ZF `#202 R11`; enmienda GZ `#41 R5` `pinta %p…`, `#41 R6` `pinta %s sin recargar…` (M1), alerts `#174 R12` `text-15` | — | — | pendiente |
| R12 | GE, ZF `#202 R12`; enmienda GE `#189 R8` fila | — | — | pendiente |
| R13 | GE, ZF `#202 R13`; enmienda GE `#146 R6` compone, `#189 R9` compone la hoja (F5), CC `#189 R9` (M8) | — | — | pendiente |
| R14 | GE, ZF `#202 R14` | — | — | pendiente |
| R15 | GE, ZF `#202 R15`; enmienda GE `#146 R8`, `#146 R14`, `#189 R13`, chunky-cta `#177 R3.1`, `#177 R4.1` | — | — | pendiente |
| R16 | GE, ZF `#202 R16`; enmienda GE `#146 R8` `pinta %s bajo Guardar…` (M5), `#146 R16`, `#189 R11` | — | — | pendiente |
| R17 | GE ×2, ZF `#202 R17`; enmienda GE `#146 R6` esqueleto (métricas, M6), `#189 R8` plano, `#189 R14`, `#146 R16`; borra `#189 R22`; profile `#173 R2.4`, alerts `tracking-title` | — | — | pendiente |
| R18 | GE ×2, ZF `#202 R18`; enmienda GE `#146 R6` esqueleto (barras, M6), UL `#146 R10` (`+ 1`), language-provider `#194 R1` (`+ 1 // #202 R18`), design-drift `#178 R13` `rounded16`, chunky-cta `#177 R7.3` | — | — | pendiente |
| R19 | GE `#202 R19`; enmienda GE `#146 R6` error | — | — | pendiente |
| R20 | ZF `#202 R20`; enmienda GF `#189 R16.1`, `#189 R16.3`, `#189 R24.1`, `#189 R24.2` | — | — | pendiente |
| R21 | GZ `#202 R21` | n/a (conservación) | — | pendiente |
| R22 | GZ `#202 R22` | n/a (conservación) | — | pendiente |
| R23 | GZ `#202 R23` | n/a (conservación) | — | pendiente |
| R24 | GE `#202 R24` | n/a (conservación) | — | pendiente |
| R25 | ZF `#202 R25` ×2 | — | — | pendiente |
| R26 | Smoke humano, dev build Android | n/a | n/a | pendiente |
