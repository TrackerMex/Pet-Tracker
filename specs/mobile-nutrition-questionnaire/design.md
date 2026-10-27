---
feature: "mobile-nutrition-questionnaire"
status: approved     # draft | approved
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
| guardas | `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` | suma de `#194 R1`: `+ 77, // #209 R23` (R23) |
| tests de pantalla | `mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx` | cuatro `it` existentes con los literales de R22, sufijo ` (enmendado por #209 R22)` (R22) |
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

- **#220 ya está mergeada.** Entró en esta rama con el merge de `origin/dev`
  `8b4cb1bd` (junto con #210 y #211), y las cifras de R3, R22, R23 y R24 están
  re-medidas sobre esa base. Ya no es un riesgo abierto.
- **#208, #218 y #219 ya están mergeadas (errata ronda 3).** Entraron con el
  merge de `origin/dev` `b185ae61` en `1dbac74f`. Las cifras de R3, R23 y R24
  están re-medidas sobre esa base en la ronda 3 de
  `progress/firma_mobile-nutrition-questionnaire.md`. #219 no toca ninguna
  guarda de #209. #218 añade `#218 R3` (solo `pairing` y `reminders` importan
  `@expo/ui/community/bottom-sheet`), que #209 no pisa. La tabla A16 de abajo
  queda como registro: lo que hizo #208 de verdad está en `1dbac74f`.
- **Agregados compartidos con #208 (A16).** #208 (`mobile-vaccine-create`) va
  a Codex antes que #209. Su spec se leyó en
  `/home/claude/sites/Pet-Tracker-wt-208/specs/mobile-vaccine-create/requirements.md`
  (HEAD `af829aee`, medida sobre `2041e2b3` con las marcas [#220]). Estos son
  los agregados que tocan las dos specs y lo que suma cada una:

  | Fichero | Agregado | #208 | #209 |
  |---|---|---|---|
  | `src/app/_layout.tsx` | hijos de `Stack.Protected` | `pets/[petId]/vaccines/new` justo tras `meals-history` (R4) | `nutrition-profile` al final, justo tras `edit-profile` (R3) |
  | `src/app/__tests__/layout.test.tsx` | los cuatro `toHaveLength(…)` del grupo protegido | `+ 1 // #208 R4` en cada uno | `+ 1 // #209 R3` en cada uno |
  | `src/app/__tests__/layout.test.tsx` | `it` de `edit-profile` como última pantalla | — | `at(-1)` pasa a `at(-1 - 1); // #209 R3` |
  | `src/app/__tests__/layout.test.tsx` | `it` nuevos de orden | `#208 R4: la pantalla de alta de vacuna va justo tras meals-history …` | `#209 R3: nutrition-profile es el último hijo protegido, justo tras edit-profile` |
  | `src/app/__tests__/layout.test.tsx` | sufijos de nombre | ` (enmendado por #208 R4)` en los cuatro `it` | ` (enmendado por #209 R3)` en cinco `it` |
  | `src/__tests__/ui-copy-table.ts` | bloque nuevo | `R19_VACCINE_CREATE` (29 filas) | `R20_NUTRITION_QUESTIONNAIRE` (96 filas) |
  | `src/__tests__/ui-copy-table.ts` | `ALL_USES` | `...R19_VACCINE_CREATE,` más la fila nueva de `R5_HEALTH` (+30 en total) | `...R20_NUTRITION_QUESTIONNAIRE,` (+96) |
  | `src/__tests__/ui-copy-table.ts` | `blocks` de `#194 R5: cuadra ALL_USES …` | `R19_VACCINE_CREATE` | `R20_NUTRITION_QUESTIONNAIRE`, y sufijo ` (enmendado por #209 R23)` (#208 no fija sufijo) |
  | `src/__tests__/ui-language.test.ts` | import de bloques | `R19_VACCINE_CREATE,` | `R20_NUTRITION_QUESTIONNAIRE,` |
  | `src/__tests__/ui-language.test.ts` | `expect(SCREEN_FILES).toHaveLength(…)` | `+ 1 // #208 R20: screens/vaccine-create/index.tsx` | `+ 1 // #209 R23: screens/nutrition-questionnaire/index.tsx`, y sufijo ` (enmendado por #209 R23)` en `#194 R5: no deja ningún valor fijo …` (#208 no fija sufijo) |
  | `src/__tests__/ui-language.test.ts` | `describe` nuevo | `#208 R20: alta de vacuna` | `#209 R23: el cuestionario resuelve su copy por clave` |
  | `src/providers/__tests__/language-provider.test.tsx` | suma de `#194 R1` | `+ 26, // #208 R19` y ` (enmendado por #208 R19)` | `+ 77, // #209 R23` y ` (enmendado por #209 R23)` |
  | `src/i18n/catalog.ts` | claves en `en` y `es` | 26 claves `health.*` y `vaccineCreate.*` | 77 claves `nutritionQuestionnaire.*` |
  | `src/__tests__/consistency-classnames.test.ts` | `#62 R1`, `rounded-16 bg-accent` global | `+ 1 + 1 // #208 R21` | `+ 2` (19 → 21 sobre la base) |
  | `src/__tests__/consistency-classnames.test.ts` | `#62 R14`, `directUses` | Salud `+ 2` y fila nueva `[join('screens', 'vaccine-create', 'index.tsx'), 7]` | fila nueva `[join('screens', 'nutrition-questionnaire', 'index.tsx'), 6], // #209 R24` y `+ 6 // #209 R24` en el agregado |
  | `src/__tests__/consistency-classnames.test.ts` | `#98 R10`, `count(style={CONTINUOUS_CORNER})` | no lo lista; cae en su regla mecánica para lo no listado (su R21 cuenta 2 literales nuevos en Salud y 7 en `vaccine-create`; la cifra real sale de `progress/impl_mobile-vaccine-create.md`) | `+ 6 // #209 R24` (53 → 59 sobre la base) |
  | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | `CTA_ROWS` | 2 filas: `vaccines-empty-action` (Salud) y `vaccine-create-submit` | 2 filas: `nutrition-questionnaire-next` y `food-create-profile`, al final |
  | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | `#177 R6.2`, `count(/text-17/g)` | `+ 3` | `+ 2` |
  | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | `#177 R6.2`, `count(/<Text className="text-17 font-extrabold text-accent-foreground">/g)` | `+ 2` | `+ 2` |
  | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | `#177 R7.3`, `radii` | `'screens/health/index.tsx': 1 + 1` y entrada nueva `'screens/vaccine-create/index.tsx': 1` | `'screens/food/index.tsx': 2 + 1, // #209 R24` y entrada nueva `'screens/nutrition-questionnaire/index.tsx': 2, // #209 R24` al final |
  | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | `#177 R7.5`, inventarios de `chunkyLip` | `primaryCompact` gana `'screens/health/index.tsx': 1` | `neutralCompact` pasa a `'screens/meal-schedule/index.tsx': 1 + 2` |
  | `src/__tests__/design-drift.test.ts` | `describe` nuevos | `#208 R21: alta de vacuna sin deriva` | `#209 R25: Cuestionario sin deriva`, justo antes de `#178 R13` |

  Solo los toca una de las dos, así que no hay choque de cifras:
  - **Solo #208**:
    - `R5_HEALTH` y su candado de longitud;
    - `primaryRadius`, `#62 R15` y `#69 R10`;
    - `#177 R3.3`, `R7.2` y `R8.1`;
    - `detail-stack.guard.test.tsx` (`#149 R3`);
    - `init.config.sh`.
  - **Solo #209**:
    - `#62 R12`, `#166 R2` y `#166 R3`;
    - `consumers` y `#177 R7.1`;
    - `#178 R13` y `#179 R13`;
    - `#61 R4` (`inkSites`; #208 solo exige que Salud siga en 0);
    - `#174 R12`, `#173 R2` y `#173 R2.4`;
    - los cuatro `it` de `meal-schedule/index.test.tsx` de R22.

  Si al mergear aparece algún otro agregado con los dos deltas, se aplica la
  misma regla.

  (errata ronda 3) Medido en `1dbac74f`, la tabla y las listas se quedaron
  cortas en cuatro puntos:
  - #208 sí fijó sufijos: ` (enmendado por #208 R20)` en
    `#194 R5: cuadra ALL_USES …` y en `#194 R5: no deja ningún valor fijo …`,
    y ` (enmendado por #208 R19)` en `#194 R1` y en `#158 R1`. Este último
    no cambia de aserción; #209 no lo toca.
  - `#62 R12` no es «Solo #209»: #208 lo dejó en `6 + 1 + 3` (`textInputs`)
    y `5 + 3` (`withPlaceholder`). Es el único agregado nuevo con cifra
    compartida, y #209 suma `+ 2` solo a `textInputs`.
  - #208 también añadió filas o sufijos en `#166 R2`, `#178 R13`, `#179 R13`
    (`text-17`), `#174 R12`, `#173 R2` y `#173 R2.4`. Son filas de lista o de
    diccionario, sin cifra compartida, y ninguna colocación de #209 cambia.
  - En `#62 R14` y `#98 R10`, la última línea del agregado pasó a ser
    `+ 2 + 7 // #208 R21`, y `+ 6 // #209 R24` va detrás.

  **Regla de merge.** Quien mergee segunda conserva los dos deltas y los dos
  comentarios (`// #208 …` y `// #209 …`) en cada línea de la tabla.
  - Cada nombre de `it` lleva los dos sufijos, en orden de merge (p. ej.
    `(enmendado por #208 R4) (enmendado por #209 R3)`).
  - En las sumas por línea, el último `+ N` es el único con coma. Ejemplo en la
    suma de `#194 R1`: `+ 5 - 2 // #220 R16`, `+ 26 // #208 R19`,
    `+ 77, // #209 R23`.
  - En listas y diccionarios, la entrada de #208 va antes que la de #209,
    salvo que el orden alfabético fijado diga otra cosa.
  - Los números de bloque no cambian: R18 es de #220, R19 de #208 y R20 de
    #209.

  Como #208 va primero, lo normal es que #209 sea la segunda. En ese caso,
  **el handoff de #209 se re-mide tras el merge de #208**:
  - `git merge origin/dev`;
  - el comando ampliado de R24 en el árbol real y en una semilla;
  - las anclas `grep -cF` de R3, R22, R23 y R24.

  Antes de lanzar Codex, cada cifra base de `requirements.md` que haya
  movido #208 se reescribe como «base + delta». (errata ronda 3) Hecho en la
  ronda 3, con `grep -cF` y `node -e` y sin jest. Codex mide el T0 del árbol
  real antes de su primer commit.
- **Colisión con #208 en `src/app/__tests__/layout.test.tsx`.** Es la primera
  fila de la tabla anterior. Los dos `it` de orden no chocan: #208 R4 inserta
  justo tras `meals-history` y #209 R3 al final, justo tras `edit-profile`.
  En `_layout.tsx` de `8b4cb1bd`, `meals-history` es el penúltimo hijo
  protegido y `edit-profile` el último. Por eso la inserción de #208 solo
  desplaza `edit-profile`, que su `it` busca con `at(-1)` y no por índice. Los
  hijos de índice fijo (décimo, undécimo y duodécimo) van antes y no se mueven.
  Aun así, tras el merge de #208 se re-mide la tabla de R3, incluida la frase
  «ningún otro número cambia».
- **Sufijos de nombre en los `it` compartidos.** Los `it` que tocan #208, #220 y
  #209 suman sufijos distintos al mismo nombre. En el merge se conservan
  todos, en orden de merge. Un `-t` que filtre por nombre completo deja de
  encontrarlos; por eso los comandos usan el prefijo `#209 R<n>:`.
- **Versión del canvas:** los artboards congelados se verificaron idénticos a
  los de la v140 (`1793036268-d302`) el 2026-10-26, sha256 a sha256. Ver la
  nota en `requirements.md`.
