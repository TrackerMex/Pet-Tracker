# review: mobile-nutrition-ai-plan (#215)
Fecha: 2026-10-27
Veredicto: APROBADO (condicionado al `./init.sh` del leader en verde; ver §Output de ./init.sh)

Revisado sobre HEAD `bfdbb6d1` (branch `feature/215-mobile-nutrition-ai-plan`), diff
`ffc2b05e..HEAD`. Implementó el subagente `implementer` (Claude), fallback de CLAUDE.md
§Excepciones: revisión con escepticismo reforzado (36 mutaciones propias, 6 sobreviven, las 6
por huecos de la spec o de bajo impacto; ninguna bloquea).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json` tiene 0 `in_progress` (#215 sigue
  `spec_ready`); el diff no toca `feature_list.json` (escritor único: leader).
- [x] `progress/current.md` actualizado: §«Fallback al subagente `implementer` (#215,
  2026-10-27)» declara el fallback y su motivo (cuota de Codex al 3 %).

## Checklist C3 — Arquitectura
- [x] Capas móviles: la pantalla solo llama a `api/` (`generateNutritionPlan`,
  `getNutritionPlan`, `getPet`, `getPetTracking`) vía React Query; sin `fetch` directo.
- [x] `utils/meal-portion.ts` es puro: solo `import type { NutritionPlan }`.
- [x] Ruta delgada: `src/app/nutrition-plan.tsx` es un re-export de una línea
  (convención #39).
- [x] El import cruzado `../food/parse-ai-explanation` lo prescribe requirements.md:110.

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra: R1, R2, R3, R4–R16 (`#215 R4`…`#215
  R16`, entre 2 y 7 apariciones cada uno), R17, R18, R19, R20 (sufijos `(enmendado por #215
  R20)`), R21. R22 no tiene test; su verificación es el `git diff` vacío de traceability.md,
  que he repetido.
- [x] Historial test-primero: pares `test … rojo` y luego `feat` para R1, R2, R3, R4–R16, R17
  y R18. R19+R20 (`2c9bb739`) y R21 (`a845243b`) son commits solo de test, con la producción
  ya en `95b6945a`. Ambos casos están cubiertos:
  - **R20**: tasks.md declara que su rojo son las guardas que se ponen rojas solas al crear
    la pantalla. Lo he reproducido: restauro las 8 guardas desde `2c9bb739^` y las corro
    contra la producción de HEAD. Salen **16 `it` rojos en 6 suites** (consistency,
    chunky, design-drift, alerts, profile y el total del catálogo de language-provider).
  - **R19**: tasks.md declara un `it` nuevo más una mutación obligatoria. La reproduzco en
    M27, que sale rojo.
  - **R21**: nace verde y no está declarado en tasks.md, pero el handoff lo cierra con
    mutación obligatoria (C4 vía b). La reproduzco en M28 y M30. La tabla de recetas queda
    cerrada por M14, M14b, M15 y M29.
- [x] Ningún rojo viene de un ReferenceError de helper de test ni de mutar un doble. El
  `planView is not a function` (13 filas de R11) y el `Cannot find module '../meal-portion'`
  de R2 son símbolos de producción, y el reporte los anota (ver H8).

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas «pendiente».
- [x] Commits con el formato del repo, `feat(mobile)/test(mobile): #215 R<n> …`.

## Checklist C6 — Spec aprobada
- [x] requirements.md tiene `status: approved` y la casilla marcada en la línea 1343
  (`- [x] Aprobado por humano (fecha: 2026-10-27)`). La firma delegada es `7b601547`; las
  erratas son E1 `b18d7ec2` y E2 `c3da2b3f`.

## Checklist C7 — Sin código huérfano
- [x] La expresión reemplazada `loadedPlan.dailyGrams / loadedPlan.mealsPerDay` queda en 0
  en `meal-schedule/index.tsx` y `food/index.tsx`. `mealPortionGrams` sale 2 en cada uno,
  que son el import y el uso. Ningún test huérfano.

## Checklist C8 — Carta de UI
- [x] Las recetas de R21 coinciden nodo a nodo con `nutrition-plan/index.tsx`:
  - violeta tonal de #200 R14 con `variant="tertiary"`, `CATEGORY_SLOTS.violet.surface`,
    `chunkyLip.violet` y `Sparkles` en `category-violet-strong`;
  - pie fuera del `ScrollView`, con `Math.max(insets.bottom, 16)`;
  - `contentInsetAdjustmentBehavior="automatic"` más `insets.top + 8`, el patrón de 10
    pantallas existentes.
- [x] Prohibidos (hex, `-[`, `StyleSheet`, sombras sueltas) en 0, y M28 y M30 lo confirman.

## Alcance del diff (R22)

`git diff --name-only ffc2b05e..HEAD` da 25 rutas, todas de la lista cerrada de design.md
§Archivos afectados, más `traceability.md` y el reporte. R22 sale vacío contra `origin/dev`
`6e59fb2e`, que es ancestro de HEAD, y también contra H0 `c3da2b3f`.

## Revisión de los diffs de test y guardas (hecha)

- R1 (`api/__tests__/nutrition.test.ts`): 5 + 5 + 11 + 1 filas, literales a mano; solo importa
  `isNutritionAiStatus` y las funciones bajo prueba. La fila «descarta» exige `aiStatus`
  indefinido para `'weird'`, `'PROPOSED'`, `null`, `3` y sin clave.
- R2 (`utils/__tests__/meal-portion.test.ts`): 5 filas + `engineMealGrams`, con la fila de
  redondeo 187/2 = 94 (distingue `Math.round` de `Math.floor`).
- R17 (`meal-schedule/index.test.tsx`): `toStrictEqual` sobre el objeto de `push`, con y sin
  `aiStatus`; 7 filas no-ok que esperan el error (o `signOut`) antes de mirar `push`.
- R18 (`food/index.test.tsx`): `· 90 g` y `· 94 g`.
- R3 (`app/__tests__/layout.test.tsx`): 4 longitudes `+ 1` con `// #215 R3` delante,
  `.at(-1 - 1 - 1); // #215 R3 // #209 R3`, `names.at(-1 - 1)` en el `it` de #209 R3, `it`
  nuevo con `{ headerShown: false }`. Seis `it` con sufijo, como pide R3.
- R19: catálogo con las 16 claves en `en` y `es` detrás de `'mealSchedule.noMealPlanYet'`, en
  orden, literales idénticos a la tabla de R19 y comillas dobles solo en los 5 valores con
  apóstrofo. `R22_NUTRITION_PLAN` con 28 filas en el orden de la tabla; `ALL_USES`, `blocks`,
  import, `SCREEN_FILES` (`+ 1 // #215 R19` tras la línea de #224) y total del catálogo
  (`+ 3 // #224 R4` / `+ 16, // #215 R19`, 692) según la regla.
- R20: consistency (5 `it`: +1, entrada 3, +3, +3, inventario de labio 1 antes de
  nutrition-questionnaire), chunky (fila CTA_ROWS literal, radios 3, text-17 `+ 5`, etiqueta
  `+ 1`, rounded-16 `+ 3); // #215 R20 // #223 R9 // #209 R24` de E2; sufijo en R3.1, R3.2,
  R3.3, R6.2, R7.2, R7.3, R7.4, R7.5 y R8.1, no en R7.1), design-drift (2 `it`), alerts
  (text-15, una línea) y profile (rounded-tile y text-13): todo coincide con la tabla de R20.
  `// #215 R<n>` va delante de los comentarios existentes y las líneas nuevas al final.
- R21 (design-drift): describe nuevo justo antes de `#178 R13: Recordatorios sin deriva`, con
  los 3 `it` de la spec.

## Mutaciones plantadas por el reviewer

Todas con `bunx jest <test> --ci -t <patrón>` y revertidas con `git checkout HEAD -- <fichero>`;
tras cada una, `git status --short` y `git diff --cached --name-only` vacíos.

| Orden | Mutación (fichero) | Patrón | Resultado |
|---|---|---|---|
| M1 | `planView`: reglas 4 y 5 intercambiadas (`nutrition-plan/index.tsx`) | `#215` | SOBREVIVE (116 passed) — ver H1 |
| M2 | `planView`: quitar `status === null &&` | `#215` | rojo: fila 10 de R11 |
| M3 | `planView`: `aiProposal` antes que `limit_reached`/`rejected` | `#215` | rojo: filas 2 y 5 de R11 |
| M4 | `useState((aiStatus as NutritionAiStatus \| undefined) ?? null)` | `#215` | SOBREVIVE (116 passed) — ver H2 |
| M5 | `api/nutrition.ts`: propaga cualquier `aiStatus` | `R1` | rojo: 4 filas «descarta» |
| M6 | `isNutritionAiStatus` acepta cualquier cadena no vacía | `R1` | rojo: 3 filas |
| M7 | `meal-portion.ts`: `Math.floor` | `R2` | rojo: 5 filas |
| M8 | `mealPortionGrams` ignora la hora en el `find` | `R2` | rojo: «propuesta sin la hora» |
| M8b | `mealPortionGrams` siempre motor | `R2` | rojo: «propuesta con la hora» |
| M13 | pie `paddingBottom: insets.bottom` (sin `Math.max(…, 16)`) | `#215` | SOBREVIVE (34 passed) — ver H3 |
| M14 | pie movido dentro del `ScrollView` | `#215` | rojo: receta de `nutrition-plan-footer` |
| M14b | `ScrollView` envuelto en `<View className="flex-1">` | `#215` | rojo: receta del `ScrollView` |
| M15 | `paddingTop: insets.top + 12` | `#215` | rojo: receta del `ScrollView` |
| M16 | `variant="primary"` en `nutrition-plan-request` | `#215` | SOBREVIVE (116 passed) — ver H4 |
| M9 | Horario: `push` tras `error`/`missing-config` | `#215 R17` | rojo: 2 filas «no navega» |
| M9b | Horario: `push` tras `unreachable` | `#215 R17` | rojo: 1 fila «no navega» |
| M9c | Horario: `push` en el `catch` | `#215 R17` | SOBREVIVE (10 passed) — ver H5 |
| M10 | Horario: `params: { petId, aiStatus: result.aiStatus }` | `#215 R17` | rojo: «abre el plan sin aiStatus» |
| M10b | Horario: `router.replace` en vez de `push` | `#215 R17` | rojo: 2 `it` «abre el plan» |
| M11 | Horario: ración vuelve a `Math.round(dailyGrams / mealsPerDay)` | `#215 R17` | rojo: «gramos de la IA en Horario» |
| M12 | Nutrición: ración vuelve a `Math.round(dailyGrams / mealsPerDay)` | `#215 R18` | rojo: «gramos de la IA en Nutrición» |
| M17 | Plan: total IA = `dailyGrams` | `#215` | rojo: «#215 R7: filas de la IA» |
| M18 | Plan: filas siempre `engineMealGrams` | `#215` | rojo: «#215 R7: filas de la IA» |
| M19 | Plan: insignia siempre «hoy» | `#215` | rojo: 5 filas de R6 (fin de año, año nuevo, febrero) |
| M19b | Plan: «hoy» contra `new Date()` en vez de `plan.dataUpdatedAt` | `#215` | SOBREVIVE (116 passed); `eslint` del fichero sale 0 — ver H6 |
| M20 | Plan: pie sin `isOwner` | `#215` | rojo: 4 filas de R16 |
| M21 | Plan: `ok` sin `setStatus` | `#215` | rojo: 3 filas de R15 |
| M22 | Plan: `unauthorized` sin `signOut` | `#215` | rojo: «#215 R15: sesión caducada» |
| M23 | Plan: `ok` sin `plan.refetch()` | `#215` | rojo: 3 filas de R15 |
| M24 | Plan: «antes» con los gramos de la IA | `#215` | rojo: «#215 R7: filas de la IA» |
| M25 | Plan: `isDisabled={false}` | `#215` | rojo: «#215 R15: deshabilitado mientras espera» |
| M26 | `_layout.tsx`: `headerShown: true` en nutrition-plan | `#215 R3` | rojo: `it` nuevo de R3 |
| M27 | **R19 obligatoria**: etiqueta `requestAnother` del límite → `{null}` | `#215 R19` (ui-language) | rojo: «el bloque del plan tiene 28 filas» |
| M28 | **R21 obligatoria**: `<Sparkles … color="#7549F7" />` | `#215 R21` (design-drift) | rojo: «no deja hex, clases arbitrarias, StyleSheet ni sombras sueltas» |
| M29 | Insignia del motor con `bg-violet-100` | `#215` (pantalla) | rojo: «receta de nutrition-plan-badge (motor)»; las guardas globales (design-drift, consistency, chunky) no la ven (228 passed) |
| M30 | `StyleSheet.create` en la pantalla | `#215 R21` (design-drift) | rojo: el mismo `it` de M28 |

## Observaciones (hallazgos; ninguno bloquea)

H1–H6 son huecos de candado: el código hace lo que la spec dice, pero ningún `it` lo
congela. H1 es el que más merece una enmienda (fila 14 de R11) o una deuda registrada.

- H1 (media, hueco de spec) — `src/screens/nutrition-plan/index.tsx:27-34`: la tabla de R11
  no tiene fila «propuesta + `status` null + `tracked` false». La precedencia de la regla 4
  (`aiProposal` → `ai`) sobre la 5 (`status === null && !tracked` → `no-collar`) no la mira
  ningún `it` (M1 sobrevive). El implementer siguió las 13 filas; el hueco es de la spec.
- H2 (baja, hueco de spec) — `src/screens/nutrition-plan/index.tsx:47`: la validación del
  parámetro `aiStatus` de la ruta («Parámetros y estado» de requirements.md) no tiene test
  (M4 sobrevive). El código hace lo que la spec dice.
- H3 (baja, hueco de spec) — pie de `nutrition-plan/index.tsx` (`paddingBottom:
  Math.max(insets.bottom, 16)`): el doble de insets da `bottom = 24` y no hay fila con
  `insets.bottom < 16`, así que `Math.max` es indistinguible de `insets.bottom` (M13 sobrevive).
- H4 (baja) — `src/screens/nutrition-plan/index.tsx:319`: `variant="tertiary"` del botón
  violeta no tiene candado (M16 sobrevive). La aserción de className por prefijo/sufijo no ve
  el `variant`; en Horario lo cubre el ancla de fuente de chunky #177 R8.3, en el plan no hay
  ancla equivalente.
- H5 (baja) — `src/screens/meal-schedule/index.tsx` (catch de «Generar plan»): ningún `it`
  lanza desde `generateNutritionPlan`, así que una navegación en el `catch` sobrevive (M9c).
  La spec dice «IF el resultado no es ok» y sus 7 filas son resultados, no excepciones; el
  ancla `grep -cF "pathname: '/nutrition-plan'"` = 1 sí la detecta (pasaría a 2).
- H6 (baja, hueco de spec) — `src/screens/nutrition-plan/index.tsx:85`: «hoy» contra
  `new Date()` en vez de `plan.dataUpdatedAt` sobrevive a los 116 `it` y a `eslint` (la regla
  de pureza no entra en `badgeText`). Las filas de R6 congelan el reloj y `dataUpdatedAt`
  coincide con él, así que no hay fila con datos de caché de otro día. El código hace lo que
  dice la spec (requirements.md §7 «Hoy», línea 256).
- H7 (baja) — `src/screens/nutrition-plan/index.tsx:245`: `key={recommendation}` usa el texto
  como clave. Si la IA repite una recomendación, React avisa de clave duplicada. La spec no
  prescribe la clave; `key={index}` o texto+índice lo evitaría.
- H8 (observación, C4) — el handoff solo aceptaba `… is not a function` como rojo para R1 y
  R2. R11 tuvo 13 filas de ese tipo y R2 rojeó por `Cannot find module` (import de un módulo
  de producción aún inexistente). Son símbolos de producción, no helpers de test, así que C4
  no se viola. El reporte lo anota con «mismo criterio que R1/R2».
- H9 (observación, C4) — R21 no estaba declarado como verificación en tasks.md. El propio
  orden de la spec (R20 asume las recetas dentro de R4–R16) impedía un rojo honesto, y el
  handoff lo cubre con la mutación obligatoria, que he reproducido (M28).

## Cifras

- `bunx jest --ci`, partido en `--shard=1/2` y `--shard=2/2` para caber en el timeout:
  - logs: `progress/jest_215_review_1.log` y `progress/jest_215_review_2.log`;
  - las dos mitades salen con **exit 0**: 87 + 87 = **174 suites** y 3133 + 3376 = **6509
    tests**, todos pasados;
  - coincide con el reporte del implementer;
  - no reapareció ningún flake conocido (#200 R10, #168 R2, #152 R8).
- `bunx tsc --noEmit` sale con **exit 0**, con un log de 0 bytes
  (`progress/tsc_215_review.log`). `.expo/types/router.d.ts` no existe.
- `bunx expo lint --no-cache` sale con **exit 0**, con un log de 0 bytes
  (`progress/lint_215_review.log`) y 0 coincidencias de `Killed`/`SIGKILL`.
- Anclas de R1 = 2. R17: 0 / 2 / 1. R18: 0 / 2. `t(` en la pantalla = 28. Las 16 claves
  `nutritionPlan.*` están en `en` y `es`, y el total del catálogo es 692.
- Árbol al terminar: `git status --short` solo muestra `?? progress/review_mobile-nutrition-ai-plan.md`
  (los `.log` están ignorados); `git diff --cached` vacío; HEAD sigue en `bfdbb6d1`.

## Output de ./init.sh

```
No ejecutado por el reviewer: instrucción expresa del leader («NO ejecutes ./init.sh … lo
está corriendo el leader»; el clasificador lo deniega al reviewer). El veredicto APROBADO
queda condicionado a que ese init.sh salga verde: si sale rojo, este review pasa a RECHAZADO.
Sustitutos ejecutados aquí: jest completo, tsc y expo lint (ver §Cifras).
```
