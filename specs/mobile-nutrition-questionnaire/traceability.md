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
| R1 | API::#209 R1: putJson envía PUT con cuerpo JSON y Bearer | `d4204afa` test(mobile): #209 R1 rojo / `3556f473` feat(mobile): #209 R1 putJson |
| R2 | API::#209 R2: upsertNutritionProfile hace PUT a nutrition-profile y devuelve ok con el perfil / #209 R2: status %i se mapea a %s / #209 R2: sin red devuelve unreachable | `32b84b81` test(mobile): #209 R2 rojo / `96ff9b97` feat(mobile): #209 R2 upsertNutritionProfile |
| R3 | NQ::#209 R3: la ruta nutrition-profile es delgada y está en el Stack / LAY::#209 R3: nutrition-profile es el último hijo protegido, justo tras edit-profile / LAY: los cinco `it` `#194 R4` de la tabla de R3, con ` (enmendado por #209 R3)` | `d5142938` test(mobile): #209 R3 rojo / `4da4d427` feat(mobile): #209 R3 ruta y Stack |
| R4 | NQ::#209 R4: mientras carga pinta el esqueleto / #209 R4: si la mascota falla pinta el error de carga / #209 R4: esqueleto y error de carga respetan el inset superior y el error tiene volver | `2beed28c` test(mobile): #209 R4 rojo / `2e9ce25a` feat(mobile): #209 R4 carga / `63d4295e` test(mobile): #209 R4 rojo (errata ronda 6) / `f75ece10` feat(mobile): #209 R4 inset y volver en la carga y el error / `520944f4` test(mobile): #209 R4 R5 rojo (errata ronda 7) / `f638cbdd` feat(mobile): #209 R4 R5 revierte las mutaciones (errata ronda 7) |
| R5 | NQ::#209 R5: pinta cabecera, contador «1 de 4» y la barra con un segmento hecho / #209 R5: Pingo de la burbuja mide 52 pt y 44 pt en Condición por style / #209 R5: Pingo de la burbuja mide 52 pt en Alimento y en Salud | `9c8c8aa2` test(mobile): #209 R5 rojo / `bc18b081` feat(mobile): #209 R5 cabecera, contador y barra / `5333d27c` test(mobile): #209 R5 R16 R19 rojo (errata ronda 6) / `fbff52ee` feat(mobile): #209 R5 R16 R19 Pingo por style / `520944f4` test(mobile): #209 R4 R5 rojo (errata ronda 7) / `f638cbdd` feat(mobile): #209 R4 R5 revierte las mutaciones (errata ronda 7) |
| R6 | NQ::#209 R6: Volver desde Alimento con condición 6 vuelve a Condición / #209 R6: Volver desde Alimento con condición 7 vuelve a Peso objetivo | `86b8eddb` test(mobile): #209 R6 rojo / `31b34e78` feat(mobile): #209 R6 volver entre pasos |
| R7 | NQ::#209 R7: Actividad pinta las tres opciones con su copy / #209 R7: Siguiente está desactivado hasta elegir actividad | `25bdcefc` test(mobile): #209 R7 rojo / `4b45773f` feat(mobile): #209 R7 actividad |
| R8 | NQ::#209 R8: fila %i pinta «%s», «%s» y la banda %s / #209 R8: Siguiente está desactivado hasta elegir condición | `96550549` test(mobile): #209 R8 rojo / `a38be138` feat(mobile): #209 R8 condición |
| R9 | NQ::#209 R9: con condición %i Siguiente va a %s | `9ecd3ed0` test(mobile): #209 R9 rojo / `b3f04d5f` test(mobile): #209 R9 quita símbolos sin uso del arnés / `c10e2660` feat(mobile): #209 R9 rama de condición |
| R10 | NQ::#209 R10: Peso objetivo pinta resumen, copy y contador «2 de 4» / #209 R10: Cambiar vuelve a Condición / #209 R10: sin currentWeightKg no pinta el peso actual / #209 R10: peso «%s» desactiva Siguiente: %s | `3885d4c7` test(mobile): #209 R10 rojo / `fe27ac00` feat(mobile): #209 R10 peso objetivo |
| R11 | NQ::#209 R11: %s precarga %s kcal y su nota / #209 R11: cambiar de tipo sobrescribe un valor editado | `6a4d80d7` test(mobile): #209 R11 rojo / `d3535d05` feat(mobile): #209 R11 alimento y precargas |
| R12 | NQ::#209 R12: kcal «%s» desactiva Siguiente: %s | `1e6f655d` test(mobile): #209 R12 rojo / `4b42d63d` feat(mobile): #209 R12 cotas de kcal |
| R13 | NQ::#209 R13: Salud pinta las dos listas con su copy y orden / #209 R13: marcar Otra en %s muestra ¿Cuál? y el contador pasa de 0/40 a 7/40 | `d75d118b` test(mobile): #209 R13 rojo / `0981f9cc` feat(mobile): #209 R13 salud y otra |
| R14 | NQ::#209 R14: condición 5 omite targetWeightKg aunque se hubiera escrito antes / #209 R14: condición 7 con peso vacío omite targetWeightKg / #209 R14: condición 7 con «10,5» envía targetWeightKg 10.5 / #209 R14: Otra con «  Maíz  » añade «Maíz» tras las etiquetas marcadas / #209 R14: Otra con solo espacios no añade nada / #209 R14: con 21 alergias conservadas envía 20 | `4ba22119` test(mobile): #209 R14 rojo / `25f79882` feat(mobile): #209 R14 cuerpo del PUT |
| R15 | NQ::#209 R15: con perfil existente precarga actividad, condición, peso, alimento y kcal / #209 R15: «Pollo» marca su chip y «Maíz» rellena Otra / #209 R15: con bodyCondition null Siguiente de Condición está desactivado | `392e80b9` test(mobile): #209 R15 rojo / `6b8a9612` feat(mobile): #209 R15 modo edición |
| R16 | NQ::#209 R16: con PUT en vuelo pinta Generando con Perfil guardado en curso / #209 R16: tras PUT ok marca Perfil guardado hecho y Calculando en curso / #209 R16: generate ok invalida perfil y plan y vuelve atrás / #209 R16: con movimiento reducido no pinta anillos / #209 R16: Pingo de Generando mide 112 pt por style | `101c7f11` test(mobile): #209 R16 rojo / `ed2316b1` feat(mobile): #209 R16 generando / `5333d27c` test(mobile): #209 R5 R16 R19 rojo (errata ronda 6) / `fbff52ee` feat(mobile): #209 R5 R16 R19 Pingo por style |
| R17 | NQ::#209 R17: %s %s pinta «%s» | `8b0f7d80` test(mobile): #209 R17 rojo / `ce66ba47` feat(mobile): #209 R17 errores |
| R18 | NQ::#209 R18: la raíz es un KAV con behavior padding y el scroll persiste taps | `f17a05e0` test(mobile): #209 R18 teclado (nace verde, solo test) |
| R19 | FOOD::#209 R19: owner sin perfil ve Crear perfil nutricional y navega al cuestionario / #209 R19: %s sin perfil ve el vacío actual / #209 R19: owner con perfil y sin plan ve el vacío actual / #209 R19: Pingo de NutricionSinPerfil mide 150 pt por style | `07371db1` test(mobile): #209 R19 rojo / `e23a0fb5` feat(mobile): #209 R19 entrada en Nutrición / `5333d27c` test(mobile): #209 R5 R16 R19 rojo (errata ronda 6) / `fbff52ee` feat(mobile): #209 R5 R16 R19 Pingo por style |
| R20 | MS::#209 R20: owner con perfil ve Editar perfil y navega al cuestionario / #209 R20: owner sin perfil ve Crear perfil nutricional / #209 R20: %s no ve enlaces de perfil | `616f288f` test(mobile): #209 R20 rojo / `12e0c771` feat(mobile): #209 R20 enlaces en Horario |
| R21 | MS::#209 R21: %s no ve Generar plan / #209 R21: owner ve Generar plan | `49e7965e` test(mobile): #209 R21 rojo / `b7e84064` feat(mobile): #209 R21 generar plan solo owner |
| R22 | MS::#209 R22: actividad %s se lee «%s» / #209 R22: alimento %s se lee «%s» / MS: los cuatro `it` existentes de la tabla «Tests existentes que R22 contradice», con ` (enmendado por #209 R22)` | `dd6adc68` test(mobile): #209 R22 rojo / `0c2be183` feat(mobile): #209 R22 píldoras en español |
| R23 | src/__tests__/ui-language.test.ts::#209 R23: el bloque del cuestionario tiene 96 filas, más las guardas de ui-language.test.ts y ui-copy-table.ts (`#194 R5`, con ` (enmendado por #209 R23)`) y src/providers/__tests__/language-provider.test.tsx::`#194 R1` (`+ 77, // #209 R23`, con ` (enmendado por #209 R23)`) en verde | `cc0dd710` test(mobile): #209 R23 rojo (catálogo) / `471d4231` feat(mobile): #209 R23 claves del cuestionario / `3f87d172` test(mobile): #209 R23 tabla de copy |
| R24 | Enmiendas `// #209 R24` en src/__tests__/{consistency-classnames, chunky-cta-canvas-fidelity, design-drift, legibility-classnames, alerts-canvas-fidelity, profile-canvas-fidelity}.test.ts, más LAY (enmiendas de R3): las siete suites en verde. Verificación final con el comando ampliado de R24 (añade language-provider, meal-schedule y food): exit 0 | `1fc239c5` test(mobile): #209 R24 enmiendas de carta (enmiendas de LAY en `d5142938`, R3) |
| R25 | src/__tests__/design-drift.test.ts::#209 R25: Cuestionario sin deriva › #209 R25: no deja hex, clases arbitrarias, StyleSheet ni sombras sueltas / #209 R25: no deja text-accent suelto / #209 R25: no trae dependencias vetadas, useThemeColor ni emoji | `d4c139d9` test(mobile): #209 R25 recetas de carta (nace verde) |
| R26 | Anclas desde `mobile-pet-tracker/`: `grep -cF '## Enmienda #209' ../docs/ui-guidelines.md` = 1 y `grep -cE -- '- \[[ xX]\] Enmienda #209 aprobada por humano' ../docs/ui-guidelines.md` = 1; la casilla la marca el humano | `e2b5ab59` docs(ui): #209 R26 enmienda (la casilla queda sin marcar: la marca el humano) |
