---
feature: "mobile-nutrition-questionnaire"
status: draft        # draft | approved
tags: [harness, spec, mobile, nutrition]
---

# #209 mobile-nutrition-questionnaire — Diseño

Esta feature es solo móvil. El backend no cambia: el contrato es el
`UpsertNutritionProfileSchema` actual más las cotas de #212 R1.

## Archivos por capa

| Capa | Archivo | Cambio |
|---|---|---|
| infraestructura (api) | `mobile-pet-tracker/src/api/http.ts` | `putJson` (R1), copia de `patchJson` con `method: 'PUT'` |
| infraestructura (api) | `mobile-pet-tracker/src/api/nutrition.ts` | `upsertNutritionProfile` y `UpsertNutritionProfileState` (R2) |
| dominio (tipos) | `mobile-pet-tracker/src/api/types.ts` | `NutritionProfileInput` (R2) |
| ruta | `mobile-pet-tracker/src/app/nutrition-profile.tsx` | ruta delgada nueva (R3) |
| ruta | `mobile-pet-tracker/src/app/_layout.tsx` | `Stack.Screen name="nutrition-profile"` (R3) |
| pantalla | `mobile-pet-tracker/src/screens/nutrition-questionnaire/index.tsx` | wizard y Generando (R4–R18, R25) |
| pantalla | `mobile-pet-tracker/src/screens/food/index.tsx` | consulta de perfil y `food-profile-empty` (R19) |
| pantalla | `mobile-pet-tracker/src/screens/meal-schedule/index.tsx` | enlaces de perfil, «Generar plan» solo para owner, píldoras (R20–R22) |
| i18n | `mobile-pet-tracker/src/i18n/catalog.ts` | claves `nutritionQuestionnaire.*` en `en` y `es` (R23) |
| guardas | `mobile-pet-tracker/src/__tests__/{ui-copy-table.ts, ui-language.test.ts, design-drift.test.ts, consistency-classnames.test.ts, chunky-cta-canvas-fidelity.test.ts, legibility-classnames.test.ts}` | enmiendas mecánicas (R23, R24) |
| docs | `docs/ui-guidelines.md` | `## Enmienda #209` con la casilla G4 (R26) |

Los tests nuevos van en los ficheros que nombra cada R-id de
`requirements.md`.

## Estructura de la pantalla del cuestionario

```
NutritionQuestionnaireScreen          lee petId (useLocalSearchParams), consultas pet y perfil (R4)
 ├─ skeleton / load-error             R4
 └─ QuestionnaireForm initial={...}   se monta tras cargar; el estado inicial sale de props (sin useEffect)
     ├─ phase: 'form' | 'saving' | 'generating'
     ├─ step: 'activity' | 'condition' | 'target' | 'food' | 'health'
     ├─ form: { activity, bcs, target, foodType, kcal, allergies:Set, allergyOther, diseases:Set, diseaseOther, kept:{allergies,diseases} }
     ├─ phase === 'form'  → KAV raíz + header + barra + ScrollView key={step} + pie con la CTA única
     └─ phase !== 'form'  → Generating (R16)
```

- `stepNumber(step)`: activity 1, condition 2, target 2, food 3, health 4.
- `nextStep`: condition va a target si bcs ≥ 7 y a food en otro caso. Las
  demás transiciones son lineales.
- `prevStep` es el inverso (R6).
- `usePreventRemove(phase === 'form' && step !== 'activity', () => setStep(prevStep(step)))`.
- `buildInput(form)` es una función pura en el mismo fichero (R14). Construye
  el objeto añadiendo las claves opcionales de forma condicional, para que
  `targetWeightKg` y `bodyCondition` no existan si no aplican.
- `initialFromProfile(profile, labels)` también es pura (R15). `labels` son
  los `t(clave)` de los chips.
- Las precargas de kcal (`{ dry: 350, wet: 90, mixed: 220, homemade: 130 }`)
  son una constante local del fichero. Los tests no la importan: escriben los
  números a mano.

## Flujo de guardado

1. Pulsar la CTA en Salud pone `phase = 'saving'` y llama a
   `upsertNutritionProfile`.
2. Si el PUT da `ok`, se invalida `nutritionKeys.profile(petId)`, se pone
   `phase = 'generating'` y se llama a `generateNutritionPlan`.
3. Si generate da `ok`, se invalida `nutritionKeys.plan(petId)` y se llama a
   `router.back()`. `usePreventRemove` ya está inactivo porque
   `phase !== 'form'`.
4. Cualquier otro resultado: `phase = 'form'`, `step = 'health'` y el texto de
   R17. `unauthorized` llama a `signOut()`.

La traducción de errores reutiliza el `switch` de `handleGenerate` de
`src/screens/meal-schedule/index.tsx`. Se copia: no se extrae a un módulo
compartido, para no tocar Horario más de lo que pide R20–R22.

## Nutrición (R19)

- Se añade `useQuery({ queryKey: nutritionKeys.profile(activePetId), queryFn: getNutritionProfile, enabled: plan 404 })`.
  `activePetId` es el que ya usa la consulta `plan`.
- La sección `food-profile-empty` es JSX en línea en `src/screens/food/index.tsx`.
  No se usa `EmptyState`: su variante `hero` mide 260×280, titula a 26 px y
  pone `Plus` por defecto (`actionIcon ?? Plus` no admite suprimirlo), y la
  `default` titula a 18 px. Las dos se apartan del artboard.

## Horario (R20–R22)

- `isOwner` ya existe. Se usa para envolver `generate-plan-button` y los dos
  enlaces.
- Los enlaces son un `Pressable` con labio `neutralCompact`. No son `Button`:
  así no entran en los inventarios de `Button` neutro de #166 R3 y #177 R8.1.
- Las píldoras cambian solo el valor: `loadedProfile.activityLevel` pasa a
  `t(ACTIVITY_LABEL[...])` y `foodType` a `t(FOOD_LABEL[...])`, con mapas
  locales al fichero.

## Alternativas descartadas

- **Un formulario de una sola página.** Contradice el canvas aprobado en G1,
  que tiene 4 pasos.
- **Distinguir «sin perfil» solo por el 404 del plan.** Un perfil con plan sin
  generar también da 404, así que haría falta la consulta de perfil de todos
  modos.
- **`EmptyState` para NutricionSinPerfil.** Ver arriba.
- **`router.replace('/meal-schedule')` al terminar.** Desde Horario apilaría
  Horario dos veces. `router.back()` vuelve a quien abrió el cuestionario, y
  la invalidación repinta.
- **Enviar `null` en los opcionales.** `strictObject` acepta la omisión, pero
  `targetWeightKg: null` da 400.
- **Valores canónicos en inglés para alergias.** El backend guarda texto libre
  y la decisión cerrada es enviar la etiqueta que se muestra.
- **Duración mínima de Generando.** Añadiría temporizadores y riesgo de flake
  con timers falsos, y no la pide el canvas.

## Riesgos

- **Agregados compartidos con #208 y #220** (ui-copy-table e inventarios de
  carta): se resuelven con merge de `origin/dev` y la regla mecánica de R24.
- **Versión del canvas:** congelado de la versión viva `1793039639-fe0d`, no
  de la v140. Ver la nota en `requirements.md`.
