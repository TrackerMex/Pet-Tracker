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
| ruta | `mobile-pet-tracker/src/app/_layout.tsx` | `Stack.Screen name="nutrition-profile"` como último hijo de `Stack.Protected`, justo tras `edit-profile` (R3) |
| pantalla | `mobile-pet-tracker/src/screens/nutrition-questionnaire/index.tsx` | wizard y Generando (R4–R18, R25) |
| pantalla | `mobile-pet-tracker/src/screens/food/index.tsx` | consulta de perfil y `food-profile-empty` (R19) |
| pantalla | `mobile-pet-tracker/src/screens/meal-schedule/index.tsx` | enlaces de perfil, «Generar plan» solo para owner, píldoras (R20–R22) |
| i18n | `mobile-pet-tracker/src/i18n/catalog.ts` | claves `nutritionQuestionnaire.*` en `en` y `es` (R23) |
| guardas | `mobile-pet-tracker/src/__tests__/{ui-copy-table.ts, ui-language.test.ts, design-drift.test.ts, consistency-classnames.test.ts, chunky-cta-canvas-fidelity.test.ts, legibility-classnames.test.ts, alerts-canvas-fidelity.test.ts, profile-canvas-fidelity.test.ts}` | enmiendas mecánicas (R23, R24) y `describe('#209 R25: Cuestionario sin deriva')` (R25) |
| guardas | `mobile-pet-tracker/src/app/__tests__/layout.test.tsx` | cuentas de hijos `+ 1 // #209 R3` y el `it` nuevo de orden (R3) |
| docs | `docs/ui-guidelines.md` | `## Enmienda #209` con la casilla de aprobación humana `- [ ] Enmienda #209 aprobada por humano`, sin marcar (R26) |

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

- El círculo «en curso» de Generando es un `View` estático: `src/theme/motion.ts`
  no tiene constante `MOTION_*` de giro (decisión 13). Los únicos elementos
  animados de Generando son los dos `PingRing` y `PingoFloat`.

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
- Miden `h-9` (36 pt), así que llevan `hitSlop={TOUCH_SLOP}` para llegar a
  44 pt. Eso mueve `#179 R13` de `1` a `1 + 2` (R24).
- «Editar perfil» pinta `t('profile.editProfile')` («Editar perfil», clave que
  ya existe) con `accessibilityLabel={t('nutritionQuestionnaire.editProfileLabel')}`
  («Editar perfil nutricional»). «Crear perfil nutricional» pinta
  `t('nutritionQuestionnaire.createProfile')`.
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
- **Colisión con #208 en `src/app/__tests__/layout.test.tsx`.** #208 y #209
  añaden cada una un hijo a `Stack.Protected` y suman `+ 1` a las mismas
  cuentas de hijos del layout. Quien mergee segunda conserva los dos `+ 1`
  (`+ 1 // #208 R4` y `+ 1 // #209 R3`) y los dos sufijos en el nombre de cada `it`
  tocado (`(enmendado por #208 R4) (enmendado por #209 R3)`). Los dos `it` de
  orden no chocan: #208 R4 inserta justo tras `meals-history` y #209 R3 al
  final, justo tras `edit-profile`.
- **Sufijos de nombre en los `it` compartidos.** Los `it` que tocan #208, #220 y
  #209 suman sufijos distintos al mismo nombre. En el merge se conservan
  todos, en orden de merge. Un `-t` que filtre por nombre completo deja de
  encontrarlos; por eso los comandos usan el prefijo `#209 R<n>:`.
- **Versión del canvas:** los artboards congelados se verificaron idénticos a
  los de la v140 (`1793036268-d302`) el 2026-10-26, sha256 a sha256. Ver la
  nota en `requirements.md`.
