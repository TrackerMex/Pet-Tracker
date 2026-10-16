---
feature: "mobile-routine-canvas-fidelity"
status: approved
tags: [mobile, ui, spec]
---

# #178 mobile-routine-canvas-fidelity — Trazabilidad

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) | Estado |
|---|---|---|---|
| R1 | `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts::#178 R1: tokens de Recordatorios` | `02b760f2` test(mobile): #178 R1 tokens de Recordatorios; `684178bc` feat(mobile): tokens de Recordatorios (#178 R1) | hecho |
| R2 | `mobile-pet-tracker/src/__tests__/design-drift.test.ts::#178 R2: enmienda de fidelidad al canvas en Recordatorios` | `25c983f3` test(mobile): #178 R2 enmienda de fidelidad al canvas en Recordatorios; `2ea73831` docs(ui): enmienda de fidelidad al canvas en Recordatorios (#178 R2) | hecho |
| R3 | `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx::#178 R3: claves de Recordatorios del canvas` | `1176e1c0` test(mobile): #178 R3 claves de Recordatorios del canvas; `222cb10a` feat(mobile): claves de Recordatorios del canvas (#178 R3) | hecho |
| R4 | `mobile-pet-tracker/src/screens/reminders/index.test.tsx::#178 R4: marco y título en contenido` | `20a16760` test(mobile): #178 R4 marco y título en contenido; `97ef9a0e` feat(mobile): marco y título en contenido (#178 R4) | hecho |
| R5 | `mobile-pet-tracker/src/screens/reminders/index.test.tsx::#178 R5: píldoras de resumen del canvas` | `cd057c22` test(mobile): #178 R5 píldoras de resumen del canvas; `9c5db429` feat(mobile): píldoras de resumen del canvas (#178 R5) | hecho |
| R6 | `mobile-pet-tracker/src/screens/reminders/index.test.tsx::#178 R6: fila del canvas` | `757eb643` test(mobile): #178 R6 fila del canvas; `2d3b6a78` feat(mobile): fila del canvas (#178 R6) | hecho |
| R7 | `mobile-pet-tracker/src/screens/reminders/index.test.tsx::#178 R7: entrada escalonada y badge` | `3485aaa8` test(mobile): #178 R7 entrada escalonada y badge; `35c9a389` feat(mobile): entrada escalonada y badge (#178 R7) | hecho |
| R8 | `mobile-pet-tracker/src/screens/reminders/index.test.tsx::#178 R8: sheet de borrado del canvas` | `4af957d1` test(mobile): #178 R8 sheet de borrado del canvas; `da398b32` feat(mobile): sheet de borrado del canvas (#178 R8) | hecho |
| R9 | `mobile-pet-tracker/src/screens/reminders/index.test.tsx::#178 R9: el vacío ofrece crear` | `aa0c6a75` test(mobile): #178 R9 el vacío ofrece crear; `7860e4d1` feat(mobile): el vacío ofrece crear (#178 R9) | hecho |
| R10 | `mobile-pet-tracker/src/screens/add-reminder/index.test.tsx::#178 R10: marco, título y chips de tipo del canvas` | `5a808f72` test(mobile): #178 R10 marco, título y chips de tipo del canvas; `f8779f27` feat(mobile): marco, título y chips de tipo del canvas (#178 R10) | hecho |
| R11 | `mobile-pet-tracker/src/screens/add-reminder/index.test.tsx::#178 R11: título, fecha y hora del canvas` | `e3a86195` test(mobile): #178 R11 título, fecha y hora del canvas; `03ff8a52` feat(mobile): título, fecha y hora del canvas (#178 R11) | hecho |
| R12 | `mobile-pet-tracker/src/screens/add-reminder/index.test.tsx::#178 R12: chips de aviso y vista previa` | `2dc68762` test(mobile): #178 R12 chips de aviso y vista previa; `30dd2a5e` feat(mobile): chips de aviso y vista previa (#178 R12) | hecho |
| R13 | `mobile-pet-tracker/src/__tests__/design-drift.test.ts::#178 R13: Recordatorios sin deriva` | `acde7bee` test(mobile): #178 R13 candados de deriva de Recordatorios | hecho |
| R14 | prueba de humo humana (`requirements.md` §R14, casilla propia) | n/a | firmada por el humano en `ecb51395` (2026-10-16) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente". R14 se cierra
cuando el humano firma su casilla en `requirements.md`.

## Firmas humanas

| Gate | Dónde | Estado |
|---|---|---|
| Spec aprobada | `requirements.md` §Aprobación: `- [x] Aprobado por humano (fecha: 2026-10-15)` | aprobada por humano; `99808696` |
| Enmiendas E1 a E5 | `requirements.md`, casillas `- [X] Enmienda E1…E5 aprobada por humano` (candados heredados que la spec firmada no inventarió) | aprobadas por humano; `165d4946` (2026-10-15) |
| Humo R14 | `requirements.md` §R14, `- [X] Prueba de humo #178 R14 firmada por: AlexisSM377 — fecha: 2026-10-16` | firmada por el humano; `ecb51395` |

## Ronda de fusión con main (2026-10-16)

`main` avanzó a `91af2d9f` (#183, la limpieza de registro de #185 y #186, y #179) después de la firma de R14. La rama
hizo merge, no rebase, para conservar los hashes de esta tabla: fusión `0e86587b` (padres `6603ff6d` y `91af2d9f`),
handoff `6603ff6d`, nota de Codex `60d030c2`, veredicto del reviewer `5e62f7f6`. Nueve conflictos de contenido,
resueltos por un script del leader (`progress/handoff_mobile-routine-canvas-fidelity_merge_resolve.py`); el reviewer
leyó cada fichero contra los dos padres.

**Desviación de R13 (decisión del leader).** El `it` `reserva los radios 14, 16 y 22 a Recordatorios con su inventario
exacto` de `design-drift.test.ts` exigía que `rounded-14`, `rounded-16` y `rounded-22` no aparecieran en ningún otro
fichero de `src/` (`requirements.md`, R13: «ninguno en otro fichero de `src/`»). #179 usa `rounded-14` en
`meal-schedule` y `meals-history` (mismo token `--radius-14`). El candado queda partido en dos: `rounded-16` y
`rounded-22` siguen exclusivos de Recordatorios, y `rounded-14` fuera de Recordatorios debe ser exactamente esos dos
ficheros de #179. El texto de R13 en `requirements.md` no se edita. El reviewer lo valoró correcto y con dientes
(siete mutaciones propias en rojo).
