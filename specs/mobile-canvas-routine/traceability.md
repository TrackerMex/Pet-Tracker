---
feature: "mobile-canvas-routine"
status: approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-canvas-routine]]

Rutas de test relativas a `mobile-pet-tracker/src/`. Los hashes los rellena el
implementador; no rebasear después de rellenarlos.

| R | Test (fichero › it) | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|
| R1 | `app/__tests__/layout.test.tsx` › `#204 R1: %s oculta la cabecera nativa` | `da27f678` | `ac1a1bfc` | cubierto |
| R2 | `components/__tests__/screen-header.test.tsx` › `#204 R2: sin título pinta el marcador…`, `#204 R2: con título ignora el marcador` | `7ab3ef45` | `779e59b9` | cubierto |
| R3 | `theme/__tests__/motion.test.ts` › `#204 R3: declara el paso de 70 ms…` | `c3cddf4f` | `f83964d1` | cubierto |
| R4 | `screens/reminders/index.test.tsx` › `#204 R4: …` (3) | `c7ad05ad` | `fdaf7403` | cubierto |
| R5 | `screens/reminders/index.test.tsx` › `#204 R5: la cabecera encabeza el estado %s`, `#204 R5: sin mascotas conserva volver…` | `7108b4d3` | `c276dec6` | cubierto |
| R6 | `screens/reminders/index.test.tsx` › `#204 R6: escalona las filas 0, 70 y 140 ms con RiseIn` | `9441ba24` | `0bd782ef` | cubierto |
| R7 | `screens/reminders/index.test.tsx` › `#204 R7: la fila próxima y su badge usan el ámbar del canvas` | `ab6f505f` | `e1faf85b` | cubierto |
| R8 | `screens/reminders/index.test.tsx` › `#204 R8: Eliminar de fila usa la receta rosa del canvas` | `115caabb` | `ef244818` | cubierto |
| R9 | `screens/reminders/index.test.tsx` › `#204 R9: Eliminar de la hoja lleva cuerpo de 56 y labio danger` | `6f91bc20` | `9673974f` | cubierto |
| R10 | `screens/add-reminder/index.test.tsx` › `#204 R10: …` (4) | `bb320535` | `b8ecc101` | cubierto |
| R11 | `screens/add-reminder/index.test.tsx` › `#204 R11: Guardar se apoya al pie del formulario` | `8dfe420a` | `76ccaeb6` | cubierto |
| R12 | `screens/docs/index.test.tsx` › `#204 R12: …` (5) | `79c4855a` | `fc9291bd` | cubierto |
| R13 | `screens/docs/index.test.tsx` › `#204 R13: la cabecera encabeza el estado %s` | — (nace verde; mutación) | `b6260c80` (solo test) | cubierto |
| R14 | `screens/docs/index.test.tsx` › `#204 R14: escalona las filas 0, 60 y 120 ms con RiseIn` | `a22d6cba` | `a972a5e9` | cubierto |
| R15 | `__tests__/routine-canvas-fidelity.test.ts` › `#204 R15: %s sigue al canvas` | — (nace verde; mutación) | `42b1f7e0` (solo test) | cubierto |
| R16 | `__tests__/routine-canvas-fidelity.test.ts` › `#204 R16: la carta lleva su enmienda una sola vez y con su casilla` | `0361a6e7` | `bea9afd8` | cubierto |
| R17 | `__tests__/routine-canvas-fidelity.test.ts` › `#204 R17: %s es grep-limpio` | — (nace verde; mutación) | `f79d5eef` (solo test) | cubierto |
| R18 | Smoke humano en dev build Android (requirements.md § Cierre del humano) | n/a | n/a | pendiente (humano) |

Cierre del leader (2026-10-24): el reviewer aprobó sobre `2b50c0fe` (`progress/review_mobile-canvas-routine.md`, 0 bloqueantes, 6 no bloqueantes) con el gate del leader en verde. Después se mergeó `origin/dev` con #196 (`15c72f83`, cuatro conflictos de candados agregados resueltos por unión) y se repitió el gate: exit 0, móvil 152/152 suites, 5228/5228 tests, 1 snapshot. El smoke de R18 lo cierra el humano en el lote `progress/smoke_canvas-parity.md` (plan §6).
