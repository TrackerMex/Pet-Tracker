---
feature: "mobile-nutrition-ai-plan"
status: draft        # draft | approved
tags: [harness, spec, mobile, nutrition]
---

# Trazabilidad — [[mobile-nutrition-ai-plan]]

Rutas de test relativas a `mobile-pet-tracker/`. Abreviaturas:
- `API` = `src/api/__tests__/nutrition.test.ts`
- `MP` = `src/utils/__tests__/meal-portion.test.ts`
- `LAY` = `src/app/__tests__/layout.test.tsx`
- `NP` = `src/screens/nutrition-plan/index.test.tsx`
- `MS` = `src/screens/meal-schedule/index.test.tsx`
- `FOOD` = `src/screens/food/index.test.tsx`

Cada nombre se filtra con `-t '#215 R<n>:'`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | API::#215 R1: generate devuelve aiStatus %s / #215 R1: generate descarta el aiStatus %p / #215 R1: isNutritionAiStatus(%p) es %p / #215 R1: getNutritionPlan conserva aiProposal | `3683109c` test(mobile): #215 R1 rojo; `d1c6a4ad` feat(mobile): #215 R1 aiProposal and aiStatus in the nutrition client |
| R2 | MP::#215 R2: mealPortionGrams %s / #215 R2: engineMealGrams redondea | `724d6131` test(mobile): #215 R2 rojo; `d2400354` feat(mobile): #215 R2 meal-portion helpers |
| R3 | LAY::#215 R3: nutrition-plan es el último hijo protegido, justo tras nutrition-profile, sin cabecera nativa, más los seis `it` enmendados con ` (enmendado por #215 R3)` | `8cb0c216` test(mobile): #215 R3 rojo; `46788a48` feat(mobile): #215 R3 ruta y Stack |
| R4 | NP::#215 R4: carga, error con reintento y plan inexistente › #215 R4: esqueleto mientras carga / #215 R4: error %s con reintento / #215 R4: sin plan | `c8a5563e` test(mobile): #215 R4–R16 rojo; `95b6945a` feat(mobile): #215 R4–R16 pantalla del plan y copy |
| R5 | NP::#215 R5: cabecera «Plan de <nombre>» con vuelta a Horario › #215 R5: título en %s / #215 R5: volver sin historial va a Horario / #215 R5: sin mascota no hay título | `c8a5563e` test(mobile): #215 R4–R16 rojo; `95b6945a` feat(mobile): #215 R4–R16 pantalla del plan y copy |
| R6 | NP::#215 R6: insignia IA (hoy / fecha) y del motor › #215 R6: insignia %s / #215 R6: insignia del motor en la vista %s | `c8a5563e` test(mobile): #215 R4–R16 rojo; `95b6945a` feat(mobile): #215 R4–R16 pantalla del plan y copy |
| R7 | NP::#215 R7: tarjeta de comidas, «antes» y total › #215 R7: filas de la IA / #215 R7: filas del motor / #215 R7: una fila por hora | `c8a5563e` test(mobile): #215 R4–R16 rojo; `95b6945a` feat(mobile): #215 R4–R16 pantalla del plan y copy |
| R8 | NP::#215 R8: sección «Por qué cambié sus porciones» con el parser de #224 R1 › #215 R8: texto plano de %p / #215 R8: sin sección %s | `c8a5563e` test(mobile): #215 R4–R16 rojo; `95b6945a` feat(mobile): #215 R4–R16 pantalla del plan y copy |
| R9 | NP::#215 R9: recomendaciones numeradas › #215 R9: lista numerada / #215 R9: sin recomendaciones %s | `c8a5563e` test(mobile): #215 R4–R16 rojo; `95b6945a` feat(mobile): #215 R4–R16 pantalla del plan y copy |
| R10 | NP::#215 R10: próxima revisión y aviso › #215 R10: revisión %s / #215 R10: fecha inválida / #215 R10: el motor no avisa / #215 R10: aviso en inglés | `c8a5563e` test(mobile): #215 R4–R16 rojo; `95b6945a` feat(mobile): #215 R4–R16 pantalla del plan y copy |
| R11 | NP::#215 R11: planView, precedencia de vistas › #215 R11: planView %s | `c8a5563e` test(mobile): #215 R4–R16 rojo; `95b6945a` feat(mobile): #215 R4–R16 pantalla del plan y copy |
| R12 | NP::#215 R12: vista sin collar y «Vincular collar» › #215 R12: sin collar por %s / #215 R12: nota en inglés | `c8a5563e` test(mobile): #215 R4–R16 rojo; `95b6945a` feat(mobile): #215 R4–R16 pantalla del plan y copy |
| R13 | NP::#215 R13: vista propuesta descartada › #215 R13: propuesta descartada / #215 R13: nota en inglés | `c8a5563e` test(mobile): #215 R4–R16 rojo; `95b6945a` feat(mobile): #215 R4–R16 pantalla del plan y copy |
| R14 | NP::#215 R14: vista límite diario › #215 R14: límite diario / #215 R14: límite en inglés | `c8a5563e` test(mobile): #215 R4–R16 rojo; `95b6945a` feat(mobile): #215 R4–R16 pantalla del plan y copy |
| R15 | NP::#215 R15: «Pedir otro plan», generate, estados y errores › #215 R15: botón habilitado en la vista %s / #215 R15: deshabilitado mientras espera / #215 R15: ok con aiStatus %s / #215 R15: error %s / #215 R15: sesión caducada / #215 R15: el error se borra al reintentar | `c8a5563e` test(mobile): #215 R4–R16 rojo; `95b6945a` feat(mobile): #215 R4–R16 pantalla del plan y copy |
| R16 | NP::#215 R16: rol family sin pie › #215 R16: family no ve el pie en la vista %s / #215 R16: sin mascota no hay pie | `c8a5563e` test(mobile): #215 R4–R16 rojo; `95b6945a` feat(mobile): #215 R4–R16 pantalla del plan y copy |
| R17 | MS::#215 R17: Horario abre el plan tras generar y pinta los gramos de la IA › #215 R17: abre el plan con aiStatus / #215 R17: abre el plan sin aiStatus / #215 R17: no navega con %s / #215 R17: gramos de la IA en Horario | `4bcec027` test(mobile): #215 R17 rojo; `065865fd` feat(mobile): #215 R17 Horario abre el plan y pinta los gramos de la IA |
| R18 | FOOD::#215 R18: gramos de la IA en Nutrición | `70d56772` test(mobile): #215 R18 rojo; `ec4ea525` feat(mobile): #215 R18 Nutrición pinta los gramos de la IA |
| R19 | src/__tests__/ui-language.test.ts::#215 R19: el plan resuelve su copy por clave › #215 R19: el bloque del plan tiene 28 filas; bloque `R22_NUTRITION_PLAN` (28 filas) en src/__tests__/ui-copy-table.ts y enmiendas `// #215 R19` en ui-copy-table.ts, ui-language.test.ts y src/providers/__tests__/language-provider.test.tsx. Las 16 claves × 2 lenguas de src/i18n/catalog.ts entraron con la pantalla | `2c9bb739` test(mobile): #215 R19 R20 tabla de copy y enmiendas de guardas (las claves, en `95b6945a`) |
| R20 | Enmiendas `// #215 R20` en src/__tests__/{consistency-classnames, chunky-cta-canvas-fidelity, design-drift, alerts-canvas-fidelity, profile-canvas-fidelity}.test.ts, más LAY (R3): `src/__tests__` + LAY + language-provider en verde, 39/39 suites y 1150/1150 tests | `2c9bb739` test(mobile): #215 R19 R20 tabla de copy y enmiendas de guardas |
| R21 | NP::#215 R21: recetas exactas de cada nodo › #215 R21: receta de %s (34 filas); src/__tests__/design-drift.test.ts::#215 R21: Plan de nutrición sin deriva › #215 R21: no deja hex, clases arbitrarias, StyleSheet ni sombras sueltas / #215 R21: no deja text-accent suelto / #215 R21: no trae dependencias vetadas, useThemeColor ni emoji | `a845243b` test(mobile): #215 R21 recetas y deriva (nace verde; recetas en `95b6945a`; mutación `#7549F7` en el reporte) |
| R22 | Sin test de jest. `git diff origin/dev --stat -- backend-pet-tracker mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/screens/food/ai-explanation.tsx mobile-pet-tracker/src/screens/food/parse-ai-explanation.ts`: salida vacía (`origin/dev` = `6e59fb2e`, ancestro de HEAD; también vacía contra H0 `c3da2b3f`) | sin commit propio: ningún commit de la rama toca esas rutas |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

R22 no tiene test de jest: su fila cita la orden `git diff origin/dev --stat …` de
[[requirements]] R22 con su salida vacía.
