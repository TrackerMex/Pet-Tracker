---
feature: "mobile-nutrition-questionnaire"
status: approved     # draft | approved
tags: [harness, spec, mobile, nutrition]
---

# #209 mobile-nutrition-questionnaire — Trazabilidad

Rutas de test relativas a `mobile-pet-tracker/`. Abreviaturas:
- `NQ` = `src/screens/nutrition-questionnaire/index.test.tsx`
- `API` = `src/api/__tests__/nutrition.test.ts`
- `LAY` = `src/app/__tests__/layout.test.tsx`
- `FOOD` = `src/screens/food/index.test.tsx`
- `MS` = `src/screens/meal-schedule/index.test.tsx`

Cada nombre se filtra con `-t '#209 R<n>:'`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | API::#209 R1: putJson envía PUT con cuerpo JSON y Bearer | pendiente |
| R2 | API::#209 R2: upsertNutritionProfile hace PUT a nutrition-profile y devuelve ok con el perfil / #209 R2: status %i se mapea a %s / #209 R2: sin red devuelve unreachable | pendiente |
| R3 | NQ::#209 R3: la ruta nutrition-profile es delgada y está en el Stack / LAY::#209 R3: nutrition-profile es el último hijo protegido, justo tras edit-profile / LAY: los cinco `it` `#194 R4` de la tabla de R3, con ` (enmendado por #209 R3)` | pendiente |
| R4 | NQ::#209 R4: mientras carga pinta el esqueleto / #209 R4: si la mascota falla pinta el error de carga | pendiente |
| R5 | NQ::#209 R5: pinta cabecera, contador «1 de 4» y la barra con un segmento hecho | pendiente |
| R6 | NQ::#209 R6: Volver desde Alimento con condición 6 vuelve a Condición / #209 R6: Volver desde Alimento con condición 7 vuelve a Peso objetivo | pendiente |
| R7 | NQ::#209 R7: Actividad pinta las tres opciones con su copy / #209 R7: Siguiente está desactivado hasta elegir actividad | pendiente |
| R8 | NQ::#209 R8: fila %i pinta «%s», «%s» y la banda %s / #209 R8: Siguiente está desactivado hasta elegir condición | pendiente |
| R9 | NQ::#209 R9: con condición %i Siguiente va a %s | pendiente |
| R10 | NQ::#209 R10: Peso objetivo pinta resumen, copy y contador «2 de 4» / #209 R10: Cambiar vuelve a Condición / #209 R10: sin currentWeightKg no pinta el peso actual / #209 R10: peso «%s» desactiva Siguiente: %s | pendiente |
| R11 | NQ::#209 R11: %s precarga %s kcal y su nota / #209 R11: cambiar de tipo sobrescribe un valor editado | pendiente |
| R12 | NQ::#209 R12: kcal «%s» desactiva Siguiente: %s | pendiente |
| R13 | NQ::#209 R13: Salud pinta las dos listas con su copy y orden / #209 R13: marcar Otra en %s muestra ¿Cuál? y el contador pasa de 0/40 a 7/40 | pendiente |
| R14 | NQ::#209 R14: condición 5 omite targetWeightKg aunque se hubiera escrito antes / #209 R14: condición 7 con peso vacío omite targetWeightKg / #209 R14: condición 7 con «10,5» envía targetWeightKg 10.5 / #209 R14: Otra con «  Maíz  » añade «Maíz» tras las etiquetas marcadas / #209 R14: Otra con solo espacios no añade nada / #209 R14: con 21 alergias conservadas envía 20 | pendiente |
| R15 | NQ::#209 R15: con perfil existente precarga actividad, condición, peso, alimento y kcal / #209 R15: «Pollo» marca su chip y «Maíz» rellena Otra / #209 R15: con bodyCondition null Siguiente de Condición está desactivado | pendiente |
| R16 | NQ::#209 R16: con PUT en vuelo pinta Generando con Perfil guardado en curso / #209 R16: tras PUT ok marca Perfil guardado hecho y Calculando en curso / #209 R16: generate ok invalida perfil y plan y vuelve atrás / #209 R16: con movimiento reducido no pinta anillos | pendiente |
| R17 | NQ::#209 R17: %s %s pinta «%s» | pendiente |
| R18 | NQ::#209 R18: la raíz es un KAV con behavior padding y el scroll persiste taps | pendiente |
| R19 | FOOD::#209 R19: owner sin perfil ve Crear perfil nutricional y navega al cuestionario / #209 R19: %s sin perfil ve el vacío actual / #209 R19: owner con perfil y sin plan ve el vacío actual | pendiente |
| R20 | MS::#209 R20: owner con perfil ve Editar perfil y navega al cuestionario / #209 R20: owner sin perfil ve Crear perfil nutricional / #209 R20: %s no ve enlaces de perfil | pendiente |
| R21 | MS::#209 R21: %s no ve Generar plan / #209 R21: owner ve Generar plan | pendiente |
| R22 | MS::#209 R22: actividad %s se lee «%s» / #209 R22: alimento %s se lee «%s» / MS: los cuatro `it` existentes de la tabla «Tests existentes que R22 contradice», con ` (enmendado por #209 R22)` | pendiente |
| R23 | src/__tests__/ui-language.test.ts::#209 R23: el bloque del cuestionario tiene 96 filas, más las guardas de ui-language.test.ts y ui-copy-table.ts (`#194 R5`, con ` (enmendado por #209 R23)`) y src/providers/__tests__/language-provider.test.tsx::`#194 R1` (`+ 77, // #209 R23`, con ` (enmendado por #209 R23)`) en verde | pendiente |
| R24 | Enmiendas `// #209 R24` en src/__tests__/{consistency-classnames, chunky-cta-canvas-fidelity, design-drift, legibility-classnames, alerts-canvas-fidelity, profile-canvas-fidelity}.test.ts, más LAY (enmiendas de R3): las siete suites en verde. Verificación final con el comando ampliado de R24 (añade language-provider, meal-schedule y food): exit 0 | pendiente |
| R25 | src/__tests__/design-drift.test.ts::#209 R25: Cuestionario sin deriva › #209 R25: no deja hex, clases arbitrarias, StyleSheet ni sombras sueltas / #209 R25: no deja text-accent suelto / #209 R25: no trae dependencias vetadas, useThemeColor ni emoji | pendiente |
| R26 | Anclas desde `mobile-pet-tracker/`: `grep -cF '## Enmienda #209' ../docs/ui-guidelines.md` = 1 y `grep -cE -- '- \[[ xX]\] Enmienda #209 aprobada por humano' ../docs/ui-guidelines.md` = 1; la casilla la marca el humano | pendiente |
