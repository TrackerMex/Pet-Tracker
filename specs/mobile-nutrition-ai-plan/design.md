---
feature: "mobile-nutrition-ai-plan"
status: draft        # draft | approved
tags: [harness, spec, mobile, nutrition]
---

# Diseño — [[mobile-nutrition-ai-plan]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> La UI se rige por `docs/ui-guidelines.md`.

## Decisiones técnicas

**Cliente de la API (R1).**

- Los tipos `NutritionAiProposal` y `NutritionAiStatus` copian el contrato de dominio de #212.
- `aiProposal` es opcional en `NutritionPlan`, para no romper los `makePlan` de tests ajenos.
- `aiStatus` se valida en el borde de confianza con `isNutritionAiStatus`. Si es
  desconocido, se descarta: nunca se propaga un valor que `planView` no sepa tratar.

**Una sola función de ración (R2, R17, R18).**

- `mealPortionGrams` sustituye la expresión duplicada en Horario y Nutrición.
- La rama del motor reproduce exactamente el `Math.round` de hoy. Por eso los tests
  actuales de las dos pantallas siguen verdes sin tocarlos.

**Vista pura (R11).**

- `planView(plan, status, tracked)` concentra toda la precedencia entre el estado de la
  respuesta, la propuesta persistida y el collar.
- La pantalla solo pinta según la vista. Así cada rama se prueba sin render.

**`aiStatus` efímero (decisión cerrada 1).**

- Viaja como parámetro de ruta desde Horario. Tras «Pedir otro plan» vive en estado local.
- No se persiste: el backend no lo guarda, y un `aiStatus` viejo mentiría al volver a
  entrar.
- Al volver a entrar sin parámetro, la vista sale de lo persistido: propuesta o collar.

**Sin `Date.now()` (R6).**

- «Hoy» se compara contra `plan.dataUpdatedAt` de React Query. Cumple la regla de pureza.
- Límite conocido: si el plan se cargó ayer y la pantalla sigue abierta tras la
  medianoche, dice «hoy» hasta el siguiente refetch.

**Parser de #224 sí, componente de #224 no (R8, decisión del firmante D2).**

- Se reutilizan `parseAiExplanation` y `aiExplanationPlainText`.
- No se reutiliza `AiExplanation`: trae aviso y recorte propios que PlanIA no dibuja.
- No se cambia su API.

**Violeta tonal con la receta de Horario (R21, decisión del firmante D6).**

- «Pedir otro plan» copia la receta tonal ya aprobada de «Generar plan» (#200 R14):
  `CATEGORY_SLOTS.violet.surface` de fondo y `CATEGORY_SLOTS.violet.ink` en la etiqueta,
  con `h-14` y `rounded-16`.
- Contraste AA calculado: 4,72:1 en claro y 4,81:1 en oscuro. El sólido del artboard da
  3,41:1 en oscuro y no pasa (ver la decisión cerrada 14 de [[requirements]]).
- Las clases salen de `utils/category-palette.ts`, que no cambia. La guarda `#64 R9` se
  respeta sin enmendarla.
- Labio `chunkyLip.violet`, el que ya existe en `theme/chunky-lip.ts`, en vez del
  `#4C2BB8` del canvas. Así no hay hex en la pantalla.

**Pie fuera del `ScrollView` (R21).**

- Igual que el cuestionario de #209: los botones quedan fijos.
- `paddingBottom: Math.max(insets.bottom, 16)` evita la barra de gestos.

**Copy por clave (R19).**

- 16 claves nuevas bajo `nutritionPlan.*`.
- Se reutilizan las de error de Horario, `home.pairCollar` y `common.*`.
- El contador (decisión del firmante D1) no tiene claves, porque no se pinta.

## Archivos afectados

Rutas relativas a `mobile-pet-tracker/`.

| Capa | Fichero | Cambio |
|---|---|---|
| api (infraestructura) | `src/api/types.ts` | `NutritionMealGrams`, `NutritionAiProposal`, `NutritionAiStatus`; `aiProposal?` en `NutritionPlan` (R1). |
| api (infraestructura) | `src/api/nutrition.ts` | `NUTRITION_AI_STATUSES`, `isNutritionAiStatus`; `aiStatus?` en la variante `ok` de `GeneratePlanState` (R1). |
| api (infraestructura) | `src/api/__tests__/nutrition.test.ts` | Tests de R1. |
| utils (dominio de presentación) | `src/utils/meal-portion.ts` (nuevo) | `engineMealGrams`, `mealPortionGrams` (R2). |
| utils (dominio de presentación) | `src/utils/__tests__/meal-portion.test.ts` (nuevo) | Tests de R2. |
| ruta | `src/app/nutrition-plan.tsx` (nuevo) | Ruta delgada (R3). |
| ruta | `src/app/_layout.tsx` | `Stack.Screen name="nutrition-plan"` como último protegido (R3). |
| pantalla | `src/screens/nutrition-plan/index.tsx` (nuevo) | `NutritionPlanScreen` y `planView` (R4–R16, R21). |
| pantalla | `src/screens/nutrition-plan/index.test.tsx` (nuevo) | Tests de R4–R16 y de las recetas de R21. |
| pantalla | `src/screens/meal-schedule/index.tsx` | Navegación tras `ok` y `mealPortionGrams` (R17). |
| pantalla | `src/screens/meal-schedule/index.test.tsx` | `describe('#215 R17: …')` al final. |
| pantalla | `src/screens/food/index.tsx` | `mealPortionGrams` (R18). |
| pantalla | `src/screens/food/index.test.tsx` | Un `it` al final (R18). |
| i18n | `src/i18n/catalog.ts` | 16 claves × 2 lenguas (R19). |
| guardas | `src/__tests__/ui-copy-table.ts`, `src/__tests__/ui-language.test.ts`, `src/providers/__tests__/language-provider.test.tsx` | Enmiendas de copy (R19). |
| guardas | `src/__tests__/consistency-classnames.test.ts`, `src/__tests__/chunky-cta-canvas-fidelity.test.ts`, `src/__tests__/design-drift.test.ts`, `src/__tests__/alerts-canvas-fidelity.test.ts`, `src/__tests__/profile-canvas-fidelity.test.ts` | Enmiendas de inventario (R20) y el `describe` de deriva (R21). |
| guardas | `src/app/__tests__/layout.test.tsx` | Cuentas del grupo protegido y el `it` nuevo (R3). |

**Sin cambios:**

- `backend-pet-tracker/`;
- `package.json` y `bun.lock`;
- los dos ficheros de #224 (R22).

## Agregados compartidos con #224

Los dos specs suman líneas a los mismos agregados:

- total de claves de `language-provider.test.tsx`;
- `SCREEN_FILES` de `ui-language.test.ts`;
- lista de text-13 de `profile-canvas-fidelity.test.ts`;
- catálogo.

Reglas:

- #224 entra primero. #215 añade sus líneas **detrás** de las de #224.
- La §Re-verificar al mergear #224 de [[requirements]] comprueba con `grep -cF` que las de
  #224 están antes de que #215 escriba.
- Si `origin/dev` trae además otra feature que toque esos agregados, se re-mide con la
  regla mecánica de R20. No se reescriben cifras ajenas.

## Riesgos

- **#224 cambia antes de mergear.** Mitigación: la premisa explícita y la tabla de
  re-verificación; el implementer para si algo no cuadra.
- **Hora de la insignia con caché.** `setAiResult` de #212 no toca `generatedAt`. Límite
  aceptado en la decisión cerrada 6. Arreglarlo pide backend.
- **Desviación del relleno sólido del artboard.** El botón violeta es tonal porque el
  sólido no pasa AA en oscuro. Contraste calculado 4,72:1 y 4,81:1; se revisa a ojo en el
  smoke G4, punto 7. El sólido queda pendiente del humano (enmienda de la carta).
- **Formato de fechas por ICU.** Ninguna fila de test usa septiembre.
- **Rutas con paréntesis en jest.** No aplica: ningún fichero nuevo está bajo `(tabs)`.

## Alternativas descartadas

- **Reutilizar `AiExplanation` de #224.** Pinta un segundo aviso y recorta con «Ver
  más». Es la opción B de D2, descartada.
- **Añadir una prop a `AiExplanation`.** Cambia la API de un componente de #224, que es su
  dueño. Prohibido.
- **Relleno sólido `bg-category-violet-strong` con texto blanco** (y una constante
  `CATEGORY_VIOLET_FILL` en la paleta), como dibuja el artboard. En oscuro da 3,41:1 y la
  etiqueta de 17 px necesita 4,5:1. Aceptarlo es enmendar `docs/ui-guidelines.md` §1, que no
  se delega.
- **Persistir `aiStatus`** en el cliente (AsyncStorage) o pedírselo al backend. El estado
  queda obsoleto al cambiar las entradas, y el backend no lo guarda.
- **`Date.now()` para «hoy».** Vetado por la regla de pureza del render.
- **Contador «Te quedan N de 3»** contando en el cliente. El cliente no ve los `generate`
  de otros dispositivos ni del día anterior: el número mentiría. Pide un campo del backend
  (D1).
- **Parte de arriba de IA en la vista límite**, como dibuja PlanIALimite. Con límite, el
  backend manda `aiProposal: null` y no hay datos que pintar (D4).
- **Entrada permanente desde Nutrición.** Ningún artboard la dibuja (D3).
