---
feature: "mobile-nutrition-questionnaire"
status: draft        # draft | approved
tags: [harness, spec, mobile, nutrition]
---

# #209 mobile-nutrition-questionnaire — Trazabilidad

Rutas de test relativas a `mobile-pet-tracker/`. Abreviaturas:
`NQ` = `src/screens/nutrition-questionnaire/index.test.tsx`,
`API` = `src/api/__tests__/nutrition.test.ts`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | API::R1: putJson envía PUT con cuerpo JSON y Bearer | pendiente |
| R2 | API::R2: upsertNutritionProfile … / R2: status %i se mapea a %s / R2: sin red devuelve unreachable | pendiente |
| R3 | NQ::R3: la ruta nutrition-profile es delgada y está en el Stack | pendiente |
| R4 | NQ::R4: mientras carga pinta el esqueleto / R4: si la mascota falla pinta el error de carga | pendiente |
| R5 | NQ::R5: pinta cabecera, contador «1 de 4» y la barra con un segmento hecho | pendiente |
| R6 | NQ::R6: Volver desde Alimento con condición 6 … / con condición 7 … | pendiente |
| R7 | NQ::R7: Actividad pinta las tres opciones con su copy / R7: Siguiente está desactivado hasta elegir actividad | pendiente |
| R8 | NQ::R8: fila %i pinta … / R8: Siguiente está desactivado hasta elegir condición | pendiente |
| R9 | NQ::R9: con condición %i Siguiente va a %s | pendiente |
| R10 | NQ::R10: Peso objetivo pinta resumen … / Cambiar … / sin currentWeightKg … / peso «%s» … | pendiente |
| R11 | NQ::R11: %s precarga %s kcal y su nota / R11: cambiar de tipo sobrescribe un valor editado | pendiente |
| R12 | NQ::R12: kcal «%s» desactiva Siguiente: %s | pendiente |
| R13 | NQ::R13: Salud pinta las dos listas … / R13: marcar Otra en %s … | pendiente |
| R14 | NQ::R14 (seis `it`, ver requirements.md) | pendiente |
| R15 | NQ::R15 (tres `it`, ver requirements.md) | pendiente |
| R16 | NQ::R16 (cuatro `it`, ver requirements.md) | pendiente |
| R17 | NQ::R17: %s %s pinta «%s» | pendiente |
| R18 | NQ::R18: la raíz es un KAV con behavior padding y el scroll persiste taps | pendiente |
| R19 | src/screens/food/index.test.tsx::R19 (tres `it`) | pendiente |
| R20 | src/screens/meal-schedule/index.test.tsx::R20 (tres `it`) | pendiente |
| R21 | src/screens/meal-schedule/index.test.tsx::R21: %s no ve Generar plan / R21: owner ve Generar plan | pendiente |
| R22 | src/screens/meal-schedule/index.test.tsx::R22: actividad %s … / alimento %s … | pendiente |
| R23 | src/__tests__/ui-language.test.ts::R23: el bloque del cuestionario tiene N filas, más las guardas de ui-copy-table | pendiente |
| R24 | src/__tests__/design-drift.test.ts, consistency-classnames.test.ts, chunky-cta-canvas-fidelity.test.ts, legibility-classnames.test.ts (enmiendas `// #209 R24`) | pendiente |
| R25 | src/__tests__/design-drift.test.ts::#209 R24: Cuestionario sin deriva | pendiente |
| R26 | ancla `grep -cF '## Enmienda #209' docs/ui-guidelines.md` = 1, más la casilla G4 del humano | pendiente |
