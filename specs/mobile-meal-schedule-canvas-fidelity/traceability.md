---
feature: "mobile-meal-schedule-canvas-fidelity"
status: draft
tags: [mobile, ui, spec]
---

# #179 mobile-meal-schedule-canvas-fidelity — Trazabilidad

> Base de implementación H0: `0aaeda9d800d053b551f0cc38a9129838357cbc7`.
> Hashes y mensajes verificados contra la rama. No rebasear después: invalida los hashes.
> E1 y E2 y los deltas literales del handoff prevalecen sobre los Δ del cuerpo de la spec.
> c1 nace verde como preparación de R6; c12b corrige E2.2; c26 nace verde y demuestra su rojo con S1–S7.

| R | Requisito | Test (fichero › describe) | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|---|
| R1 | Tokens del artboard en `@theme` | `src/theme/__tests__/global-css.test.ts` › `#179 R1: tokens de Horario e Historial` | `07c54ee436708373f043372ad2daa2f7206c7afd` — test(theme): tokens del artboard de Horario e Historial (#179 R1) | `49144d8df64c4159f77c4eaa1fa38b5aff69241b` — feat(theme): tokens del artboard de Horario e Historial (#179 R1) | hecho |
| R2 | Enmienda de la carta | `src/__tests__/design-drift.test.ts` › `#179 R2: enmienda de fidelidad al canvas en Horario e Historial` | `76ad0e300d78cd5fcb71cad41a09db9717f5f2cb` — test(docs-charter): enmienda de fidelidad al canvas (#179 R2) | `94fbb2060dd277c1b57647fa70bd6aa611b19eb7` — docs(ui-guidelines): enmienda de fidelidad al canvas (#179 R2) | hecho |
| R3 | Copy nuevo | `src/providers/__tests__/language-provider.test.tsx` › `#179 R3: claves de Horario e Historial del canvas` + Δ18 | `5c8e24593baab5915e50de4cbaf1912087912b9e` — test(i18n): claves de Horario e Historial del canvas (#179 R3) | `97f42ac034370c2c3b149b90a5741ed44a993e8f` — feat(i18n): claves de Horario e Historial del canvas (#179 R3) | hecho |
| R4 | Horario: marco y título en contenido | MST › `#179 R4: marco y título en contenido` + Δ1, Δ2; LYT Δ15; UC Δ17 | `dbb8ab38ae816df0b8dd13e81e39227179b6987e` — test(meal-schedule): marco y título en contenido (#179 R4) | `a45cade3c9f582248774e5a9349086da2c31c0aa` — feat(meal-schedule): marco y título en contenido (#179 R4) | hecho |
| R5 | Horario: resumen | MST › `#179 R5: resumen del artboard` + Δ3; UC Δ17; Δ18; LG Δ20; CC Δ23–Δ25, Δ27 | `9abdf78758c210d5a58effbc6ea8c225e3b0f277` — test(meal-schedule): resumen del artboard (#179 R5) | `0cc3691fc36b264b74349ae2c8869393a34067e0` — feat(meal-schedule): resumen del artboard (#179 R5) | hecho |
| R6 | Horario: filas | MST › `#179 R6: filas del artboard` + Δ4–Δ6; Δ22; CC Δ31, Δ32, Δ34 | `805dbfdda060d89a16f5f428281cc440143098ab` — test(meal-schedule): filas del artboard (#179 R6)<br>`d5451f1abd2f957fb0b63c84eb58cadb3401e185` — test(meal-schedule): aserciones de botones de E2 (#179 R6) | `a6d1793b7fee522acf3df22b86ba229f088620b1` — test(meal-schedule): dobles de entrada e iconos con tamaño (#179 R6)<br>`4b33d81828a617ddc2a789d080a23d04ed14f6c7` — feat(meal-schedule): filas del artboard (#179 R6) | hecho |
| R7 | Horario: acciones | MST › `#179 R7: acciones del artboard` + Δ7, Δ8; CC Δ27–Δ31, Δ33–Δ35 | `07f2e0f0f0adc320626ca126e11d7c18992c38be` — test(meal-schedule): acciones del artboard (#179 R7) | `14011669a3e8358b56efe0a0d3e935cd254b63dd` — feat(meal-schedule): acciones del artboard (#179 R7) | hecho |
| R8 | Horario: perfil en píldoras | MST › `#179 R8: perfil en píldoras` + Δ9, Δ10; UC Δ17 | `3519b033fa9f4bfc70d983577765a33561e5b6b2` — test(meal-schedule): perfil en píldoras (#179 R8) | `6cb17155ae07d4e8fb256d7b9264f5440b9d66d7` — feat(meal-schedule): perfil en píldoras (#179 R8) | hecho |
| R9 | Historial: marco y título en contenido | MHT › `#179 R9: marco y título en contenido` + Δ11; LYT Δ16; UC Δ17 | `991533a9824be1034275c2ab0b8d12a38b28ec6a` — test(meals-history): marco y título en contenido (#179 R9) | `180fc350c7a24362b6b27228456fcaa923d89016` — feat(meals-history): marco y título en contenido (#179 R9) | hecho |
| R10 | Historial: calendario | MHT › `#179 R10: calendario del artboard` + Δ12; MGT Δ19 y `it` nuevo; DD Δ21; CC Δ24–Δ26 | `9d5bad06165d0aa1a57768c271069164a106f6a5` — test(meals-history): calendario del artboard (#179 R10) | `1ba659298b79e57469f03bb76d4bc9a03fcdc5b4` — feat(meals-history): calendario del artboard (#179 R10) | hecho |
| R11 | Historial: celdas | MHT › `#179 R11: celdas del artboard` + Δ13, Δ14; CC Δ31 | `84ef314cb167699e6f5789d7f5ac588aca42ec8f` — test(meals-history): celdas del artboard (#179 R11) | `ddae4b4eb12fd320dd547b9a7cd797abf8a68af1` — feat(meals-history): celdas del artboard (#179 R11) | hecho |
| R12 | Historial: panel del día | MHT › `#179 R12: panel del día`; CC Δ24–Δ26 | `2c695a28e1988fb87e9c4754e88dc2cc3dd78150` — test(meals-history): panel del día (#179 R12) | `56a1960c43729e43f9ee2f86df18fc233f8ad9a4` — feat(meals-history): panel del día (#179 R12) | hecho |
| R13 | Candados de deriva | `src/__tests__/design-drift.test.ts` › `#179 R13: Horario e Historial fieles al canvas` + sondas | n/a (nace verde; S1–S7: un único fallo de R13 y `limpio=0` cada una) | `e3d053eaa881b43ff2245dff257d8380b2e7fb8e` — test(design-drift): Horario e Historial sin deriva (#179 R13) | hecho |
| R14 | Prueba de humo humana (dev build de Android) | §Aprobación de requirements.md | n/a | n/a | pendiente (humano) |

## Firmas humanas

| Gate | Dónde | Estado |
|---|---|---|
| Spec aprobada | requirements.md §Aprobación: `- [x] Aprobado por humano (fecha: 2026-10-15)` | aprobada por humano; `334fcebc` |
| Enmienda R2 | `docs/ui-guidelines.md` §Enmienda de fidelidad al canvas (2026-10-13): firma humana existente de 2026-10-15. El test acepta `[ xX]`; el handoff, nota 7 y c5, exige conservar la firma previa | aprobada previamente por humano; conservada |
| Humo R14 | requirements.md §Aprobación, `- [ ] Prueba de humo #179 R14 firmada por: ____ — fecha: ____` | pendiente (humano) |
