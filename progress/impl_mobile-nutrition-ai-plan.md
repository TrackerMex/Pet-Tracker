# impl: mobile-nutrition-ai-plan (#215)
Fecha: 2026-10-27

Implementer: subagente `implementer` (fallback de CLAUDE.md §Excepciones). Base fija H0 `c3da2b3f`.

## Estado

Terminado. R1–R22 cubiertos, `traceability.md` sin filas «pendiente». Sin push.

## Primer comando

```
$ cd /home/claude/sites/Pet-Tracker-wt-215 && pwd && git branch --show-current && git log --oneline -2
/home/claude/sites/Pet-Tracker-wt-215
feature/215-mobile-nutrition-ai-plan
ffc2b05e docs(progress): #215 implementer handoff
c3da2b3f docs(spec): #215 erratum E2 after merging dev with #223 and #224
```

## §Re-verificar al mergear #224

Desde `mobile-pet-tracker/`, las 8 órdenes en el orden de la tabla:

| Orden | Esperada | Obtenida |
|---|---|---|
| parseAiExplanation exportada | 1 | 1 |
| aiExplanationPlainText exportada | 1 | 1 |
| `// #224 R4` en language-provider.test.tsx | 1 | 1 |
| `+ 1 // #224 R4: screens/food/ai-explanation.tsx` | 1 | 1 |
| `'screens/food/ai-explanation.tsx', // #224 R13` | 1 | 1 |
| `'food.aiDisclaimer'` en catalog.ts | 2 | 2 |
| `loadedPlan.dailyGrams / loadedPlan.mealsPerDay` en food/index.tsx | 1 | 1 |
| import de `CATEGORY_SLOTS` en food/index.tsx | 1 | 1 |

Todo cuadra.

## Requisitos

| R | Rojo | Causa del rojo | Verde |
|---|---|---|---|
| R1 | `3683109c` | `generate devuelve aiStatus %s` ×5: aserción `toEqual` (falta `aiStatus` en el resultado); `isNutritionAiStatus(%p)` ×11: `TypeError: … isNutritionAiStatus is not a function` (aceptado por el handoff) | `d1c6a4ad` |
| R2 | `724d6131` | `Cannot find module '../meal-portion'`: el módulo es nuevo y no hay forma de un `is not a function` sin producción en el commit rojo (precedente: `impl_android-map-never-ready.md`, R1) | `d2400354` |
| R3 | `8cb0c216` | 7 `it` rojos por aserción: 4 × `Expected length: 20 / Received length: 19`; `edit-profile es la última` y `nutrition-profile es el último` por `toBe` del nombre; el `it` nuevo por `toEqual` (último hijo `nutrition-profile`) | `46788a48` |
| R4–R16 | `c8a5563e` | 82/82 rojos: 69 por RNTL «Unable to find» (el esbozo de R3 devuelve `null`) y 13 de R11 por `TypeError: … planView is not a function` (la función pura no existe aún; mismo criterio que R1/R2) | `95b6945a` (82/82 verdes, `tsc --noEmit` 0) |
| R17 | `4bcec027` | 3 rojos por aserción: los dos `abre el plan` por `Expected number of calls: 1 / Received: 0`; `gramos de la IA en Horario` por `toHaveTextContent` («94 g» en lugar de «90 g»). Las 7 filas `no navega con %s` nacen verdes (ver §Nace verde) | `065865fd` (106/106 en `meal-schedule/index.test.tsx`; anclas 0 / 2 / 1) |
| R18 | `70d56772` | 1 rojo por aserción: `toHaveTextContent` esperaba `· 90 g` y recibió `· 94 g` | `ec4ea525` (141/141 en `food/index.test.tsx`; anclas 0 / 2). La primera corrida dio el flake conocido `#200 R10 … (food-links)` dos veces seguidas; sola y en dos corridas completas posteriores, verde |
| R19 + R20 | `2c9bb739` (solo tests) | R20: las 16 guardas rojas que dejó el `feat` de R4–R16 (`guards_pre`: 6 suites, 16 tests rojos, 1130 verdes de 1146: #194 R1; design-drift #178 R13 radios y #179 R13 text-17; consistency #62 R1, #98 R10 CONTINUOUS_CORNER, #166 R2; chunky R3.3, R6.2, R7.2, R7.3, R7.4, R7.5, R8.1; alerts text-15; profile rounded-tile y text-13). R19: el `it` nuevo nace verde (ver §Nace verde) y su rojo es la mutación obligatoria | mismo commit: tras las enmiendas, `src/__tests__` + `layout.test.tsx` + `language-provider.test.tsx` dan 39/39 suites y 1150/1150 tests |
| R21 | `a845243b` (solo tests) | Nace verde (ver §Nace verde): 34 filas `#215 R21: receta de %s` en `nutrition-plan/index.test.tsx` y 3 `it` del `describe('#215 R21: Plan de nutrición sin deriva')` en `design-drift.test.ts`. Su rojo es la mutación obligatoria (ver §Mutaciones) | mismo commit: guardas + `language-provider` + `screens/nutrition-plan` dan 40/40 suites y 1269/1269 (1150 + 3 de deriva + 116 de la pantalla); `tsc --noEmit` 0; `eslint` de los dos ficheros 0 |
| R22 | sin test de jest | — | sin commit propio. Desde la raíz del worktree, `git diff origin/dev --stat -- backend-pet-tracker mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/screens/food/ai-explanation.tsx mobile-pet-tracker/src/screens/food/parse-ai-explanation.ts` da salida **vacía**. `origin/dev` es `6e59fb2e` (sin `fetch`, la ref local), ancestro de HEAD. La misma orden contra H0 `c3da2b3f` también da vacía |

Nota R22: `git diff --name-only ffc2b05e HEAD` lista 23 ficheros, todos en design.md
§Archivos afectados. Barrido de producción (los 9 ficheros sin test del diff): 0 `Date.now()`,
0 `#215`, 0 `bg-category-violet-strong`, 0 `console.`/`TODO`; la pantalla del plan importa
`aiExplanationPlainText` y `parseAiExplanation`, no `AiExplanation`. El import de
`AiExplanation` en `food/index.tsx` es de #224 y R18 no lo toca (su diff solo añade el import de
`mealPortionGrams` y cambia el cálculo de `portionGrams`).

Nota R21: sin `feat`, porque las recetas ya entraron en el `feat` de R4–R16 (`95b6945a`).
El `ScrollView` no tiene `testID` y la spec no se lo da, así que la fila `ScrollView` lo lee como
primer hijo de `screen-nutrition-plan` (`node.children[0]`) y comprueba que es él por
`contentInsetAdjustmentBehavior` y `contentContainerStyle`. El `Skeleton` se compara con `toBe`
contra `'skeleton__root h-56 w-full rounded-card'`, como `food-plan-skeleton` en
`food/index.test.tsx` (HeroUI antepone `skeleton__root`). Los labios se comprueban con
`toHaveStyle({ boxShadow: [...] })` y el color del token que da el doble de `useThemeColors`
(`lip` y `lip-violet`), como `#179 R7` en Horario.

Nota R19 + R20: un solo commit de tests, como #209 (`1fc239c5`, `3f87d172`). No hay `feat`
porque las 16 claves del catálogo ya entraron en el `feat` de R4–R16 (ver nota de R4–R16). Se
usa `R22_NUTRITION_PLAN`: ningún otro bloque usaba `R22_` en el árbol (`grep -rn "R22_" src`
vacío antes de la enmienda).

Nota R3: el `feat` crea, además de la línea del Stack y la ruta delgada, un esbozo
`src/screens/nutrition-plan/index.tsx` (`NutritionPlanScreen` que devuelve `null`) para que la
reexportación resuelva. Precedente: `4da4d427` (#209 R3) hizo lo mismo con el cuestionario. El
esbozo no pone rojas las guardas: `src/__tests__` y `language-provider.test.tsx` dan 1106/1106
verdes tras el `feat` de R3.

Nota R4–R16: las 16 claves `nutritionPlan.*` de `catalog.ts` van en el `feat` de R4–R16 y no en
R19+R20, porque `t` lanza con una clave ausente y la pantalla no puede ponerse verde sin ellas.
Desde ese `feat`, las guardas de copia e inventario de `src/__tests__/` quedan rojas hasta el
commit de R20, como prevé el handoff (§Inventarios); no se adelantó ninguna enmienda.

## Mutaciones

### R17 (voluntarias, no exigidas por la spec)

Las dos se plantaron sobre el verde sin commitear y se revirtieron después. `git diff` tras
revertir solo muestra las tres líneas del `feat`.

1. `router.push({ pathname: '/nutrition-plan', params: { petId } });` delante de
   `setGenerateError(t('mealSchedule.errorForbidden'));`.
   `bunx jest src/screens/meal-schedule/index.test.tsx -t 'no navega'` da
   `✕ #215 R17: no navega con { kind: 'forbidden' }` y `Tests: 1 failed, 99 skipped, 6 passed`.
2. La misma llamada detrás de `await signOut();`, en el `case 'unauthorized'` de
   `handleGenerate`. La misma orden da `✕ #215 R17: no navega con { kind: 'unauthorized' }` y
   `Tests: 1 failed, 99 skipped, 6 passed`. Esto confirma que la espera a `signOut` deja ver
   una navegación posterior al `await`.

### R19 (obligatoria)

Sobre `2c9bb739`, sin commitear, se quitó la segunda llamada (botón violeta, línea 326):

```
$ sed -i "326s/{t('nutritionPlan.requestAnother')}/{null}/" src/screens/nutrition-plan/index.tsx
$ bunx jest src/__tests__/ui-language.test.ts -t '#215 R19'
    ✕ #215 R19: el bloque del plan tiene 28 filas (12 ms)
    - Expected  - 1
    + Received  + 1
Tests:       1 failed, 36 skipped, 2 passed, 39 total
$ git checkout -- src/screens/nutrition-plan/index.tsx   # git diff --quiet: limpio
```

### R21 (obligatoria)

Sobre las recetas sin commitear (antes de `a845243b`), se plantó `#7549F7` en la raíz:

```
$ sed -i "136s/className=\"flex-1 bg-background\">/className=\"flex-1 bg-background\" style={{ backgroundColor: '#7549F7' }}>/" src/screens/nutrition-plan/index.tsx
$ bunx jest src/__tests__/design-drift.test.ts -t '#215 R21'
    ✕ #215 R21: no deja hex, clases arbitrarias, StyleSheet ni sombras sueltas (6 ms)
    ✓ #215 R21: no deja text-accent suelto
    ✓ #215 R21: no trae dependencias vetadas, useThemeColor ni emoji
Tests:       1 failed, 124 skipped, 2 passed, 127 total
$ git checkout -- src/screens/nutrition-plan/index.tsx   # git diff --quiet: limpio
```

Voluntaria, sobre las recetas de pantalla: `chunkyLip.violet` cambiado a `chunkyLip.primary` y
`pt-4` del pie cambiado a `pt-3`. `bunx jest src/screens/nutrition-plan/index.test.tsx -t '#215 R21'`
da `✕ … receta de nutrition-plan-footer`, `✕ … receta de nutrition-plan-request (violeta tonal)` y
`Tests: 2 failed, 82 skipped, 32 passed`. Revertido con `git checkout --`.

## Nace verde

- R1 `#215 R1: generate descarta el aiStatus %p` (5 filas): nace verde porque antes de R1 el
  cliente nunca propaga `aiStatus` al resultado; la fila fija que la validación no lo deja
  pasar.
- R1 `#215 R1: getNutritionPlan conserva aiProposal`: nace verde porque el cliente ya
  devuelve el cuerpo entero como plan; fija que no se pierda.
- R17 `#215 R17: no navega con %s` (7 filas): nacen verdes porque antes de R17 Horario no
  navega a `/nutrition-plan` con ningún resultado; las filas fijan que solo `ok` navega. Probado
  con dos mutaciones voluntarias (ver §Mutaciones).
- R19 `#215 R19: el bloque del plan tiene 28 filas`: nace verde porque la pantalla y las 16
  claves ya entraron en el `feat` de R4–R16 con sus 28 llamadas `t('…'`. Su rojo es la
  mutación obligatoria (ver §Mutaciones).
- R21 `#215 R21: receta de %s` (34 filas) y los 3 `it` de `#215 R21: Plan de nutrición sin
  deriva`: nacen verdes porque las recetas se escribieron con la pantalla en el `feat` de
  R4–R16, siguiendo la tabla de R21 al pie de la letra, y la pantalla no tiene hex, `-[`,
  `StyleSheet`, `text-accent` suelto ni dependencias vetadas. Sus rojos son la mutación
  obligatoria y la voluntaria (ver §Mutaciones).

## Skills cargadas

`expo:expo-overview`, `expo:expo-router`, `expo:expo-data-fetching` y `expo:expo-native-ui`.
`expo-tailwind-setup` no está en el catálogo de esta sesión. Todas se cargaron antes de R1.

## Cifras finales (jest, tsc, lint)

Desde `mobile-pet-tracker/`, sobre `a845243b` más `traceability.md` sin commitear (no afecta a
jest). Los logs están en `progress/` y `.gitignore` los ignora (`*.log`), así que no van en el
commit.

| Orden | Salida | Log |
|---|---|---|
| `bunx jest --ci > ../progress/jest_215_final.log 2>&1` | exit 0; `Test Suites: 174 passed, 174 total`; `Tests: 6509 passed, 6509 total`. Sin flakes en esta corrida | `progress/jest_215_final.log` |
| `bunx tsc --noEmit > ../progress/tsc_215.log 2>&1` | exit 0, log vacío | `progress/tsc_215.log` |
| `bunx expo lint --no-cache > ../progress/lint_215.log 2>&1` | exit 0, log vacío (0 bytes); `grep -ci 'killed\|SIGKILL'` = 0 | `progress/lint_215.log` |

Guardas de la spec (requirements.md, cifra orientativa): el conjunto
`src/__tests__ src/app/__tests__/layout.test.tsx src/providers/__tests__/language-provider.test.tsx`
pasa de 1146 (16 rojos tras el `feat` de R4–R16) a 1150 verdes con R19 y R20, y a 1153 con el
`describe` de deriva de R21 (+3, como prevé la spec: 1435 → 1438 en su medida ampliada).

## PARA

Ninguno.

## Notas para el reviewer

- R4–R16 entraron en un único par rojo/verde (`c8a5563e`/`95b6945a`), como manda tasks.md.
  R19+R20 y R21 son commits de solo tests sin `feat`, porque su producción (claves del catálogo
  y recetas) ya estaba en `95b6945a`. Ver las notas de cada fila.
- Nacen verdes: R1 (6 filas), R17 (7 filas), R19 (1 `it`) y R21 (34 + 3). Cada uno tiene su
  motivo en §Nace verde y su rojo comprobado por mutación en §Mutaciones.
- La fila `ScrollView` de R21 llega al `ScrollView` como `children[0]` de
  `screen-nutrition-plan`, porque la tabla de R21 no le da `testID`. Si el reviewer prefiere un
  `testID`, sería un cambio de producción que la spec no prescribe.
- El flake conocido `#200 R10 … (food-links)` salió dos veces en la primera corrida de R18 y no
  ha vuelto: verde en dos corridas completas de `food/index.test.tsx` y en la corrida final.
