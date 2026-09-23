---
feature: "mobile-kcal-consumed-bar"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-kcal-consumed-bar]] (#113)

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden de
> commits y [[../../docs/ui-guidelines|ui-guidelines]] (gate C8) para la carta de UI.
>
> Fuente: `feature_list.json` #113 (description + los cuatro criterios) y el
> contrato ya mergeado de #104 (`specs/nutrition-kcal-consumed/`). Cada
> premisa del encargo se verificó contra el árbol antes de escribir un
> requisito (§0); las que no cuadraban se corrigen en §0.2.
>
> Feature **solo móvil** (`mobile-pet-tracker/`). **Cero dependencias nuevas,
> cero tokens nuevos en `global.css`, cero llamadas HTTP nuevas.**
>
> Base: `103a3366` (= `origin/main` el 2026-09-23, con #104 mergeada). Branch
> `feature/113-mobile-kcal-consumed-bar`, worktree
> `/home/claude/sites/Pet-Tracker-wt-backend`. Rutas relativas a
> `mobile-pet-tracker/` salvo las que empiezan por `docs/`, `specs/` o
> `progress/`. **Ninguna cita usa número de línea**: todo ancla es un texto
> literal que se encuentra con `grep -n`, y donde otra sesión puede moverlo
> (#95) se dice quién.

---

## §0. Verificación de premisas contra el árbol

### §0.1 Premisas confirmadas

| # | Premisa | Evidencia (comando o ancla grepeable) |
|---|---|---|
| P1 | El `GET` del plan devuelve `kcalConsumedToday: number`, última clave tras `servedToday`, entero ≥ 0, nunca mayor que `merKcal` | `kcalConsumedToday: number;` y `return { ...toNutritionPlanResponse(plan), servedToday, kcalConsumedToday };` en `backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts`; fórmula `Math.round((merKcal * servedCount) / mealsPerDay)` en `meal-serving.entity.ts` (#104 R1) |
| P2 | La tarjeta hoy pinta `food-plan-kcal`, `food-plan-grams` y un tile con `ForkKnife`, sin barra ni anillo | `testID="food-plan-card"`, `testID="food-plan-kcal"`, `testID="food-plan-grams"`, `<ForkKnife size={26} color={accent} />` en `src/app/(tabs)/food.tsx` |
| P3 | `food.dailyTarget` y `food.dailyKcal` existen en los dos idiomas | `'food.dailyTarget': 'Daily target'` / `'Objetivo diario'`, `'food.dailyKcal': '{{kcal}} kcal / day'` / `'{{kcal}} kcal / día'` en `src/i18n/catalog.ts` |
| P4 | `react-native-svg` 15.15.4 y `react-native-reanimated` 4.5.1 instalados | `mobile-pet-tracker/package.json` → `dependencies` |
| P5 | Solo **dos** fixtures tipadas `NutritionPlan`, y ningún sitio de producción construye uno | `grep -rln 'servedToday:' src --include=*.test.tsx` → `src/app/(tabs)/__tests__/food.test.tsx`, `src/screens/meal-schedule/index.test.tsx`. `grep -rn '\bNutritionPlan\b' src test` → además solo `src/api/nutrition.ts` (dos `body as unknown as NutritionPlan`, sin literal). `src/api/__tests__/nutrition.test.ts` tiene un `makePlan` **sin tipo** (`Record<string, unknown>`): no rompe |
| P6 | `food.tsx` ya refresca el plan tras servir o deshacer | `await plan.refetch();` dentro de `async function toggleMeal(` |
| P7 | El plan que devuelve `generate` (sin `servedToday` ni `kcalConsumedToday`) **nunca** llega a la caché que lee Food | `src/screens/meal-schedule/index.tsx`: `case 'ok':` → `plan.refetch();` (no hay `setQueryData`) |
| P8 | En el Make, barra y anillo salen del mismo `pct` | `const pct = Math.round((pet.caloriesConsumed / pet.calories) * 100)`, `h-2 rounded-full overflow-hidden` y `2 * Math.PI * 29 * pct` en `specs/mobile-figma-polish/design-src/App.tsx` (`FoodScreen`) |
| P9 | #95 (Frontend, en review) **no** toca `food.tsx`, `food.test.tsx`, `types.ts` ni las líneas `food.*` del catálogo | `git diff --stat origin/main...feature/95-mobile-detail-screens-to-stack -- mobile-pet-tracker` (medido contra `f9a22dd1`) |

### §0.2 Premisas nuevas o corregidas (nadie construye sobre la versión anterior)

| # | Qué decía el encargo o se daba por hecho | Lo que dice el árbol | Evidencia |
|---|---|---|---|
| C1 | Las fixtures son el único sitio que se rompe al tipar el campo | **Falso.** Hay un **tercer candado**: `describe('#98 R1: los tipos del cliente declaran servedToday y mealsToday'` en `src/screens/home/index.test.tsx` cuenta **12** campos en `NutritionPlan` y exige que los dos últimos sean `generatedAt`, `servedToday`. Se pone rojo en cuanto entra el campo | `expect(nutritionPlanFields).toHaveLength(12);` y `expect(nutritionPlanFields.slice(-2)).toEqual([` en ese `describe`. Se mueve con delta en R1 |
| C2 | «Añade claves de copy» (en plural) y «reutilizar `food.dailyTarget` y `food.dailyKcal` donde encajen» | **Una sola clave nueva**, la del nombre accesible. `kcal` y `%` son unidades y **no entran al catálogo** por la decisión D7 firmada de #65; `food.dailyTarget` y `food.dailyKcal` siguen usándose **exactamente donde están** y ninguna encaja en el texto nuevo (ver D5) | `- **D7 — Las unidades no entran al catálogo.** \`kg\`, \`km\`, \`km/h\`, \`kcal\`,` en `specs/mobile-ui-language/design.md`; y en la misma spec, `` `${pct}%` `` clasificado como «unidad» |
| C3 | `files_affected` incluye `docs/ui-guidelines.md` | **No se toca.** Las reglas que esta feature aplica ya están escritas: texto sobre acento a opacidad plena (#61 R3), cápsula ⇒ `rounded-full` sin esquina continua (§Decisiones fijas 12), cifras tabulares (§Micro-reglas). Y **faltaban** cuatro ficheros de candado (tabla §Candados) | `describe('#61 R3: ningún texto sobre bg-accent se compone con opacidad'` en `src/__tests__/legibility-classnames.test.ts` |
| C4 | El esqueleto del plan no cambia | **Cambia.** Hoy `food-plan-skeleton` es `h-32` (128 px) para una tarjeta de ≈117 px; con el bloque nuevo la tarjeta mide ≈163 px (cuenta en [[design]] D6) y la carta exige «Skeleton dimensionado como el contenido final». El candado `expect.stringContaining('h-32')` de `food.test.tsx` se mueve en R5 | `className="h-32 w-full rounded-card"` junto a `testID="food-plan-skeleton"` en `food.tsx` |
| C5 | Una spec aprobada anterior no dice nada del anillo | **Sí lo dice.** `specs/mobile-food/design.md` D2 (aprobada): «El ring SVG de progreso del diseño no se implementa (no hay dato de kcal consumidas)». Con D1 (solo barra) su letra **sigue siendo verdad**; su motivo cambia, pero no hay contradicción ni enmienda | `grep -n "SVG de progreso del diseño no se implementa" specs/mobile-food/design.md` |
| C6 | `merKcal` siempre es positivo | **Puede valer 0.** El backend valida `weightKg: z.number().gt(0).lte(999.99)`; con un peso de gramos, `Math.round(rerRaw * factor)` redondea a 0 y `0/0` pintaría `NaN%`. Guarda en D2 | `backend-pet-tracker/src/modules/health/application/dto/weight.dto.ts`; `const merKcal = Math.round(rerRaw * factor);` en `nutrition-engine.ts` |
| C7 | Doblar `withTiming` como identidad basta para testear la animación | **Falso en este fichero.** heroui-native llama a `withRepeat(withSequence(withTiming(360, …)))` (Spinner) y `withRepeat(withTiming(1, …))` (Skeleton). Medido con un `setupFilesAfterEnv` desechable en el scratchpad, sin tocar el repo: doblar solo `withTiming` → **35 de 38 rojos** (`AggregateError`); `withTiming` + `withRepeat` → 35 rojos; `withTiming` + `withRepeat` + `withSequence` → **38/38 verdes** | `node_modules/heroui-native/lib/module/components/spinner/spinner.animation.js`, `…/skeleton/skeleton.animation.js`. Detalle en [[design]] §Arnés |
| C8 | Citar la feature en comentarios de producción es inocuo | **Pone rojo un guard.** `src/__tests__/design-drift.test.ts` (`describe('#98 R10: la barra de comidas no mete drift de estilo'`) lee `api/types.ts`, `i18n/catalog.ts` y `app/(tabs)/food.tsx` con un regex de hex que solo perdona `#<2-3 dígitos> R<dígito>`. Un `#113` suelto o `#113)` es un «color» | `const HEX_LITERAL = String.raw\`#(?!\d{2,3} R\d)[\da-f]{3,8}\b\`;` y `docs/conventions.md` §Prefijo de feature |

---

## Qué firma el humano al aprobar esta spec

Firmar sin editar = aceptar **D1-D6** tal cual. Detalle y alternativas en
[[design]]; aquí, una línea por decisión.

| Id | Decisión | En una línea |
|---|---|---|
| **D1** | **Barra sola, sin anillo** | Barra a todo el ancho bajo la fila actual; el tile `ForkKnife` se queda. Descartados: anillo solo (pierde la cifra de kcal y retira el tile) y ambos (el mismo % dos veces en la misma tarjeta) |
| D2 | **Fórmula y bordes** | `pct = merKcal > 0 ? Math.round(kcalConsumedToday / merKcal * 100) : 0`, la del Make y la Home; sin recorte a 100 (el contrato de #104 ya lo garantiza). El móvil **lee** el dato, nunca lo deriva de `servedToday` |
| D3 | **Animación** | `withTiming` de **250 ms**, `Easing.bezier(0.77, 0, 0.175, 1)`, `reduceMotion: ReduceMotion.System`: la receta que el humano firmó para la barra de la Home en #106. Sin guard `useReducedMotion` aparte |
| D4 | **Color y tipografía** | Carril `bg-accent-foreground/20`, relleno `bg-accent-foreground`, textos `text-xs font-normal text-accent-foreground` a **opacidad plena** con cifras tabulares. Se aparta del `text-white/70` del Make por AA (3,20:1 frente a 4,82:1) |
| D5 | **Copy y accesibilidad** | `{n} kcal` y `{pct}%` en línea (D7 de #65). **Una** clave nueva, `food.kcalConsumedOfTarget`: `{{consumed}} of {{target}} kcal served today` / `{{consumed}} de {{target}} kcal servidas hoy`, como nombre de un único elemento `progressbar` |
| D6 | **Esqueleto** | `food-plan-skeleton` pasa de `h-32` a `h-40` |

Si el humano **no** firma D1 y quiere el anillo (solo o con la barra), esta
spec se reabre: el anillo retira el tile `ForkKnife`, lo que mueve el candado
`'size-14 items-center justify-center rounded-xl bg-surface-secondary'` de
`src/__tests__/consistency-classnames.test.ts` y exige enmendar D2 de
`specs/mobile-food/design.md`, con su propia firma.

---

## Contrato de datos (normativo)

| Entrada | Salida |
|---|---|
| `loadedPlan.merKcal > 0` | `kcalPct = Math.round((loadedPlan.kcalConsumedToday / loadedPlan.merKcal) * 100)` |
| `loadedPlan.merKcal === 0` | `kcalPct = 0` |
| texto izquierdo | `{loadedPlan.kcalConsumedToday} kcal` |
| texto derecho | `{kcalPct}%` |
| ancho del relleno | `` `${kcalPct}%` `` |
| `accessibilityValue` | `{ min: 0, max: 100, now: kcalPct }` |

Casos literales, calculados a mano (el test los copia; ninguno sale de llamar a
código de producción):

| `merKcal` | `kcalConsumedToday` | izquierda | derecha y ancho | Por qué está |
|---|---|---|---|---|
| 656 | 0 | `0 kcal` | `0%` | borde: nada servido |
| 656 | 328 | `328 kcal` | `50%` | mitad exacta |
| 656 | 656 | `656 kcal` | `100%` | borde: consumidas == `merKcal` |
| 1420 | 890 | `890 kcal` | `63%` | el ejemplo del Make; 62,68 → 63. Con `servedToday: ['07:30']` de 2 franjas, derivarlo daría 50 %: prueba que se **lee** el campo |
| 1000 | 333 | `333 kcal` | `33%` | 33,3 → 33 (redondeo hacia abajo) |
| 200 | 33 | `33 kcal` | `17%` | 16,5 → 17 (mitad hacia arriba). Alcanzable: `merKcal` 200, 6 franjas, 1 servida → `Math.round(33,33) = 33` |
| 0 | 0 | `0 kcal` | `0%` | guarda de C6 |

Medido (no supuesto): sobre todo el dominio alcanzable desde el backend
(`merKcal` 1…3000, `mealsPerDay` 1…6, servidas 0…n) la fórmula del Make
`Math.round((c / m) * 100)` y la de multiplicar primero `Math.round((c * 100) / m)`
dan **0 diferencias**, así que se usa la del Make por coherencia con él y con
la Home (`Math.round((mealsToday.served / mealsToday.total) * 100)`).

---

## Requisitos funcionales

Todas las `describe` nuevas llevan el **prefijo canónico** `#113 R<n>:`
(`docs/conventions.md` §Prefijo de feature: `food.test.tsx` ya acumula R-ids de
cinco specs) y el **sufijo** `(mobile-kcal-consumed-bar #113)`. Los tests
corren en español (`FoodWrapper` monta `LanguageProvider initial="es"`).

### R1 — `NutritionPlan` declara `kcalConsumedToday: number` como último campo

**WHEN** el cliente tipa la respuesta de `GET /v1/pets/:petId/nutrition-plan`,
**THE SYSTEM SHALL** declarar en `export interface NutritionPlan` de
`src/api/types.ts` el campo `kcalConsumedToday: number;` (obligatorio, no
opcional ni `| null`) **inmediatamente después** de `servedToday: string[];`,
y las dos fixtures tipadas de P5 **SHALL** devolver `kcalConsumedToday: 0` por
defecto (coherente con su `servedToday: []`).

**Test** — `src/app/(tabs)/__tests__/food.test.tsx`,
`describe('#113 R1: NutritionPlan declara kcalConsumedToday como número y último campo (mobile-kcal-consumed-bar #113)')`,
un `it('añade kcalConsumedToday: number justo después de servedToday')` que lee
`src/api/types.ts`, extrae el bloque con
`/export interface NutritionPlan \{[\s\S]*?\n\}/`, saca los campos con
`/^\s+(\w+):/gm` y asevera
`expect(fields.slice(-2)).toEqual(['servedToday', 'kcalConsumedToday'])` y
`expect(block).toContain('\n  kcalConsumedToday: number;\n')`. El regex de
campos no casa `kcalConsumedToday?:`, así que un campo opcional también pone
rojo. Rojo real: hoy los dos últimos son `generatedAt`, `servedToday`.

### R2 — La tarjeta «Objetivo diario» pinta las kcal servidas contra `merKcal`

**WHEN** el plan de la mascota seleccionada está cargado (`loadedPlan !== null`),
**THE SYSTEM SHALL** pintar dentro de `food-plan-card`, **como segundo hijo y
debajo de la fila actual** (que no cambia: columna de textos + tile
`ForkKnife`), un bloque `food-plan-progress` con esta anatomía exacta:

```
food-plan-card (Card accent, className "gap-4")          → 2 hijos
├─ fila existente "flex-row items-center justify-between gap-4"  → 2 hijos (columna, tile ForkKnife)
└─ View food-plan-progress  className "gap-1.5"          → 2 hijos
   ├─ View  className "flex-row items-center justify-between"  → 2 hijos
   │  ├─ Text food-plan-consumed  "{kcalConsumedToday} kcal"
   │  └─ Text food-plan-percent   "{kcalPct}%"
   └─ View food-plan-track  className "h-2 overflow-hidden rounded-full bg-accent-foreground/20"  → 1 hijo
      └─ AnimatedView food-plan-fill  className "h-full rounded-full bg-accent-foreground", ancho `${kcalPct}%`
```

con los dos `Text` en `className="text-xs font-normal text-accent-foreground"` y
`style={TABULAR_NUMS}`, los valores del §Contrato de datos, y **ningún**
bloque de progreso cuando no hay plan (`not-found`).

**Test** — `food.test.tsx`,
`describe('#113 R2: la tarjeta Objetivo diario pinta las kcal servidas contra merKcal (mobile-kcal-consumed-bar #113)')`,
tres `it` (detalle literal en [[tasks]] R2):
(a) `it('compone la tarjeta: fila intacta y bloque de progreso debajo')` —
anatomía completa por **posición de hijos** (`children.length` y
`children[i]` en cada nivel con más de un hermano), `className` de cada nodo,
`style` de los dos textos `toEqual({ fontVariant: ['tabular-nums'] })`
**literal** (nunca `TABULAR_NUMS` importado: sería candado tautológico), el
tile `food-icon-fork-knife` dentro de la fila, y
`getAllByTestId('food-plan-progress')` de longitud 1;
(b) `it.each` con las **siete filas** del §Contrato de datos — texto
izquierdo, texto derecho y `toHaveAnimatedStyle({ width })` del relleno;
(c) `it('no pinta el bloque sin plan')` — `not-found` →
`queryByTestId('food-plan-progress')` es `null`.

El relleno nace ya como `AnimatedView` con shared value asignado sin animar
(R4 le pone la transición): así la aserción de ancho de (b) no cambia en R4.
Ver [[design]] §Arnés.

### R3 — El progreso es un único elemento accesible con su clave de catálogo

**WHEN** se pinta `food-plan-progress`,
**THE SYSTEM SHALL** exponerlo como **un solo** elemento accesible:
`accessible`, `accessibilityRole="progressbar"`,
`accessibilityLabel={t('food.kcalConsumedOfTarget', { consumed: loadedPlan.kcalConsumedToday, target: loadedPlan.merKcal })}`
y `accessibilityValue={{ min: 0, max: 100, now: kcalPct }}`;

**AND** el catálogo **SHALL** traer la clave nueva en los dos idiomas, con los
mismos marcadores, registrada en la tabla de idioma:

| Clave | `en` | `es` |
|---|---|---|
| `food.kcalConsumedOfTarget` | `{{consumed}} of {{target}} kcal served today` | `{{consumed}} de {{target}} kcal servidas hoy` |

**Test** — `food.test.tsx`,
`describe('#113 R3: el progreso es un único elemento accesible con su clave de catálogo (mobile-kcal-consumed-bar #113)')`:
(a) `it.each` con dos casos —1420/890 → `'890 de 1420 kcal servidas hoy'`,
`now: 63`; 656/0 → `'0 de 656 kcal servidas hoy'`, `now: 0`— que asevera
`accessible === true`, `accessibilityRole === 'progressbar'`, la etiqueta
literal y `accessibilityValue` `toEqual({ min: 0, max: 100, now })`;
(b) `it('registra food.kcalConsumedOfTarget en los dos idiomas y en la tabla de idioma')`
con `en`/`es` leídos **como `Record<string, string>`** (así el rojo compila) y
el regex `\| — \| \`food\.kcalConsumedOfTarget\`[^\n]*← añadida por #113 \(R3\)`
contra `../specs/mobile-ui-language/design.md`.

### R4 — El relleno transiciona su ancho al servir y al deshacer

**WHEN** `kcalPct` cambia (carga del plan, servir o deshacer una franja),
**THE SYSTEM SHALL** llevar el ancho del relleno al nuevo valor con
`withTiming(kcalPct, { duration: 250, easing: Easing.bezier(0.77, 0, 0.175, 1), reduceMotion: ReduceMotion.System })`
sobre un shared value que lee `useAnimatedStyle` en el hilo de UI;

**AND WHILE** el sistema tiene activada la reducción de movimiento,
**THE SYSTEM SHALL** dejar que `ReduceMotion.System` fije el ancho sin
transición (mecanismo nativo de Reanimated, verificado en el smoke, paso 5).

**Test** — `food.test.tsx`,
`describe('#113 R4: el relleno transiciona su ancho al servir y al deshacer (mobile-kcal-consumed-bar #113)')`,
un `it('anima a 50, sube a 100 al servir y baja a 50 al deshacer con 250 ms y ease-in-out')`:
plan 1420/710 (`servedToday: ['07:30']`) → servir `meal-toggle-1` → plan
1420/1420 → deshacer `meal-toggle-1` → plan 1420/710. En cada paso: textos
(`710 kcal`/`50%`, `1420 kcal`/`100%`, `710 kcal`/`50%`), ancho con
`toHaveAnimatedStyle`, y la llamada a `withTiming` con ese destino y su config
**literal**: `duration: 250`, `reduceMotion: ReduceMotion.System` y la curva
comparada en **nueve** puntos (0,1…0,9, `toBeCloseTo(…, 6)`) contra
`Easing.bezier(0.77, 0, 0.175, 1).factory()` construida en el test. Destinos
50 y 100 porque heroui llama a `withTiming` con 360, 1 y 0 en este fichero
(C7): buscar por valor no colisiona.

### R5 — El esqueleto del plan reserva el alto de la tarjeta con progreso

**WHILE** el plan de la mascota se está cargando,
**THE SYSTEM SHALL** pintar `food-plan-skeleton` con
`className="h-40 w-full rounded-card"`.

**Test** — `food.test.tsx`,
`describe('#113 R5: el esqueleto del plan reserva el alto de la tarjeta con progreso (mobile-kcal-consumed-bar #113)')`,
`it('usa h-40 con el radio de card')`: con `listPets` pendiente,
`expect(screen.getByTestId('food-plan-skeleton').props.className).toBe('h-40 w-full rounded-card')`.
Delta del candado ajeno en el mismo commit rojo (§Candados).

> **Errata (§Enmienda E1, H2):** el literal que puede pasar es
> `'skeleton__root h-40 w-full rounded-card'`: `Skeleton` de heroui-native
> antepone `skeleton__root` al `className` del host. El SHALL no cambia.

### R6 — Gate humano: smoke en dev build de Android

**WHEN** R1-R5 están en verde y el `reviewer` aprobó,
**THE SYSTEM SHALL** superar la prueba de humo de §Prueba de humo, corrida
por el humano. **No delegable a IA.** Se firma en su propia casilla, no en
§Aprobación.

---

## Candados

### Se mueven (delta declarado; ninguno más)

Todos como **delta sobre la base que Codex mida al arrancar**, conservando la
suma visible. #95 puede mergear antes y mover los tres marcados.

| Fichero · ancla grepeable | Delta | R · commit | ¿Lo mueve #95? |
|---|---|---|---|
| `src/screens/home/index.test.tsx` · `describe('#98 R1: los tipos del cliente declaran servedToday y mealsToday'` → `expect(nutritionPlanFields).toHaveLength(12);` | `toHaveLength(12 + 1); // +1 #113 R1` | R1 · rojo | no (toca otras zonas del fichero) |
| mismo `describe` → `expect(nutritionPlanFields.slice(-2)).toEqual([` (`'generatedAt', 'servedToday'`) | `.slice(-3, -1)`, mismo array: `servedToday` sigue justo detrás de `generatedAt` | R1 · rojo | no |
| `src/app/(tabs)/__tests__/food.test.tsx` · `makePlan` (`servedToday: [],` dentro de `function makePlan(`) | `+ kcalConsumedToday: 0,` tras `servedToday: [],` | R1 · verde | no |
| `src/screens/meal-schedule/index.test.tsx` · mismo ancla | `+ kcalConsumedToday: 0,` | R1 · verde | **sí reescribe el fichero**; `makePlan` sobrevive (verificado en `f9a22dd1`) |
| `src/providers/__tests__/language-provider.test.tsx` · `expect(englishKeys).toHaveLength(` y su comentario `// 259 en` | añadir ` + 1` a la suma y `+ 1 de #113 R3 (food.kcalConsumedOfTarget)` al comentario. Hoy `260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4` (309 → 310); con #95, `… + 4 - 6` (303 → 304) | R3 · rojo | **sí** (añade `- 6`) |
| `src/__tests__/ui-language.test.ts` · `describe('#65 R6: Food resuelve su copy por clave'` → `expect(R6_FOOD).toHaveLength(` | añadir ` + 1` con `// +1 #113 R3`, y el entero del título (`'resuelve las N ocurrencias normativas'`) pasa a N + 1. Hoy `35 + 3` (38 → 39); con #95, `35 + 3 + 1 - 2` (37 → 38) | R3 · rojo | **sí** (suma y título) |
| `src/__tests__/ui-copy-table.ts` · `R6_FOOD`, fila `{ file: 'src/app/(tabs)/food.tsx', key: 'food.dailyGrams' },` | nueva fila detrás: `{ file: 'src/app/(tabs)/food.tsx', key: 'food.kcalConsumedOfTarget' }, // #113 R3` | R3 · **verde** (el campo `key` es `TranslationKey`: en el rojo no compilaría) | añade una fila al inicio de `R6_FOOD`; no toca esta |
| `specs/mobile-ui-language/design.md` · §2.6, la fila de `food.mealsServedOfTotal` (la que termina en `← añadida por #98 (R3)`) | nueva fila detrás con la clave de R3 y `← añadida por #113 (R3)` (formato literal en [[tasks]] R3) | R3 · verde | toca otras filas de §2.6, no esta |
| `food.test.tsx` · `it('shows the hub and a loading state while pets are pending'` → `expect.stringContaining('h-32'),` (único `h-32` del fichero) | `'h-32'` → `'h-40'` | R5 · rojo | no |

### Siguen verdes sin tocarlos (si uno se pone rojo, la implementación está mal)

| Candado | Qué fija que esta feature no puede mover |
|---|---|
| `consistency-classnames.test.ts` `#62 R4` | el tile: `'size-14 items-center justify-center rounded-xl bg-surface-secondary'` sigue en `food.tsx` |
| `consistency-classnames.test.ts` `#62 R14` y `#98 R10` | `food.tsx` sigue con **2** `style={CONTINUOUS_CORNER}` (carril y relleno son cápsula: sin esquina continua) y 33 en total; `rounded-xl bg-accent` sigue en 13; `text-accent-strong` en `food.tsx` sigue en 1 |
| `legibility-classnames.test.ts` `#61 R3` y `#61 R4` | cero `opacity-70`/`opacity-80`; las dos etiquetas de la tarjeta intactas; cero `text-accent` suelto |
| `design-drift.test.ts` `C8`, `#98 R10`, `R3` | cero `[...]`, cero hex (ojo C8 de §0.2), cero `StyleSheet`; Food sigue importando el `Card` compartido |
| `food.test.tsx` `#98 R4` («no deja rastro del reloj») y `#109 R1` | sin `new Date(`; el tag del `meal-toggle` intacto |
| `ui-language.test.ts` `#65 R18` | ningún literal entero del catálogo en pantalla: ` kcal` y `%` no son valores del catálogo |
| resto de `food.test.tsx` (38 tests en `103a3366`) | medido verde con el doble de R2 (C7) |

---

## Prueba de humo del humano (no delegable a IA) — R6

Runtime: **dev build de Android**, nunca Expo Go. No hace falta regenerarlo:
esta feature no añade módulos nativos (Reanimated ya está). Backend con #104
(`main` ≥ `103a3366`). Una mascota con plan de **2** franjas.

1. Abrir **Nutrición**. La tarjeta «Objetivo diario» conserva el número de
   kcal/día, los gramos y el tile del tenedor; debajo, a todo el ancho,
   `0 kcal` a la izquierda, `0%` a la derecha y un carril blanco translúcido
   visible.
2. **Servir** la primera franja. `0 kcal` sube a la mitad de `merKcal`
   redondeada, `0%` sube a `50%` y el relleno blanco **crece deslizándose**
   (≈¼ s), no salta.
3. **Deshacer** esa franja. Vuelven `0 kcal` y `0%`, y el relleno **mengua
   deslizándose**.
4. Con **TalkBack**, tocar el bloque: se anuncia como un solo elemento, «N de
   M kcal servidas hoy», barra de progreso, porcentaje.
5. Con **Accesibilidad → Quitar animaciones** activado, repetir el paso 2: el
   relleno **cambia sin transición** y los números siguen siendo correctos.
6. Cambiar a tema oscuro: la tarjeta se ve igual (el acento y su texto son los
   mismos en los dos temas).

- [ ] Prueba de humo de R6 superada por el humano (fecha: ____, dispositivo: ____)

---

## Cobertura de los criterios de aceptación de `feature_list.json` #113

| Criterio | Cubierto por |
|---|---|
| 1. Pinta kcal consumidas contra `merKcal` leyendo `kcalConsumedToday`, según el Make y los tokens; decide barra, anillo o ambos | D1-D4, R1, R2, R4 |
| 2. Claves nuevas nombradas y candado de longitud recontado | D5, R3 (una clave, `food.kcalConsumedOfTarget`; delta +1 declarado arriba) |
| 3. Cero dependencias; suite móvil verde sin pipe; grep-clean | [[tasks]] §Cierre (comandos sin pipe y greps) |
| 4. Smoke en dev build de Android | R6 y su casilla |

---

## Fuera de alcance (cada viñeta clasificada y con su premisa verificada)

**Delimitaciones — no son features, no se registran:**

- **El anillo SVG del Make.** Decisión D1. `specs/mobile-food/design.md` D2
  sigue vigente en su letra (C5).
- **Barra o anillo en la tarjeta de acento de Horario de comidas.** El Make no
  pinta consumo ahí: `grep -n caloriesConsumed specs/mobile-figma-polish/design-src/App.tsx`
  solo cae en los datos de las mascotas y en `FoodScreen`.
- **Kcal consumidas en la Home.** Mismo grep; la Home del Make no pinta kcal
  (ya verificado por #104).
- **Degradado 135° de la tarjeta.** `specs/mobile-food/design.md` D2 lo
  resolvió en sólido `bg-accent`, y el veto a `expo-linear-gradient` sigue.
- **Validar en runtime la forma del cuerpo del plan** (un backend anterior a
  #104 daría `undefined kcal`). `getNutritionPlan` castea sin validar ningún
  campo desde #17; el móvil y el backend se despliegan juntos. Cambiarlo es
  feature de cliente HTTP, no de esta tarjeta.
- **Formatear números grandes (1,4k).** `food-plan-kcal` pinta hoy el entero
  crudo (`1420 kcal / día`); el bloque nuevo sigue el mismo criterio.
- **Guard JS `useReducedMotion`.** `ReduceMotion.System` ya lo hace (D3). La
  Home lleva los dos por #106; no se toca.
- **Cambios en `backend-pet-tracker/`, `docs/ui-guidelines.md`, `global.css`,
  `infra/` o CI.**

**Deuda preexistente, ya nombrada, que esta feature no ejecuta:**

- **`food.tsx` sigue siendo route gordo.** La migración a `src/screens/food/`
  es la «DEUDA NOMBRADA» de #102 (`feature_list.json`, entrada 102, texto
  «migrar food.tsx a src/screens/food/»). No tiene entrada propia; si se
  registra, que no se solape con #113 sobre el mismo fichero.
- **`food-meals-progress` (`1/2`) sin `TABULAR_NUMS`**, y `food.tsx` fuera del
  inventario de `describe('#62 R15: todo contador usa cifras tabulares'`. El
  bloque nuevo **sí** usa cifras tabulares y lo canda en su propio test (R2).
- **`250 ms` repetido sin token `--motion-*`.** Con esta van cuatro
  apariciones (`BAR_ENTRY_DURATION_MS`, el spring del selector de métrica,
  `MEALS_BAR_DURATION_MS`, y esta). #106 ya razonó por qué leer un token CSS
  desde un estilo animado no compensa; se deja constancia, no se registra.

---

## Aprobación

- [x] Aprobado por humano (fecha: 2026-09-23, vía Notion) ← gate obligatorio antes de implementar

---

## Enmienda E1 — R7: el estilo de los nodos no-texto de la barra (H1) y errata del test de R5 (H2)

> Escrita el 2026-09-23 sobre la spec aprobada (firma `e4a4841e`), tras el
> **RECHAZO** de la primera revisión (`progress/review_mobile-kcal-consumed-bar.md`,
> commit `f82b94e8`, sobre la punta de Codex `15e43269`). No toca D1-D6 ni
> R1-R6, ni la firma original: todo eso sigue firmado y su trazabilidad sigue
> valiendo. Añade **R7** y corrige una errata del párrafo «Test» de R5. Su
> casilla va **sin marcar**: el humano reabre el gate solo para esta enmienda.

### El hecho medido (H1 del reviewer)

Tres mutaciones de `src/app/(tabs)/food.tsx` dejan la suite móvil verde
(`food.test.tsx` 53/53):

| Id | Mutación | Efecto visible |
|---|---|---|
| M8 | `opacity: 0.7` dentro del objeto que devuelve el `useAnimatedStyle` de `kcalBarStyle` | el relleno pierde el contraste de D4 |
| M14 | `backgroundColor: accent` en ese mismo objeto | relleno verde sobre tarjeta verde: la barra desaparece |
| M13 | `style={{ opacity: 0.5 }}` en el `View` de `food-plan-track` | carril más tenue que el `/20` de D4 |

**Causa.** `toHaveAnimatedStyle` de Reanimated compara por defecto **solo las
claves del esperado** (`findStyleDiff` en
`node_modules/react-native-reanimated/src/jestUtils/index.ts`); la
comparación completa exige `{ shouldMatchAllProps: true }`. Y R2(a) candó el
`className` de bloque, cabecera, carril y relleno, pero no su `style`, que
puede pisar ese `className`. El código de producción en `15e43269` es
correcto: el hueco está en el test que esta spec prescribió.

### Decisión: E1 añade **R7**, no reescribe R2 ni R4

R2 y R4 están firmados, la implementación los cumple al pie y sus commits
están en [[traceability]]. Reescribir sus párrafos «Test» sería modificar
requisitos aprobados (C6) y dejaría sin sentido sus pares rojo→verde. R7
asevera **otra propiedad** («los nodos no-texto de la barra no llevan más
estilo que el declarado») en un `describe` propio. Los tests de R2 y R4 no se
tocan.

### R7 — nuevo requisito

**R7** *(requisito de verificación sobre código ya correcto: su rojo es una
**mutación de producción** versionada en el commit rojo y revertida en el
verde, CHECKPOINTS.md C4 quinto punto; nunca una mutación del doble)*:
**WHEN** se pinta `food-plan-progress`,
**THE SYSTEM SHALL** dar a `food-plan-fill` un estilo cuyo **único**
contenido es `width: '<kcalPct>%'` (el objeto de `useAnimatedStyle` más
cualquier estilo estático que se le junte, en objeto o en array), y **ningún**
`style` a `food-plan-progress`, a su cabecera (`food-plan-progress` →
`children[0]`) ni a `food-plan-track`.

**Test** — `src/app/(tabs)/__tests__/food.test.tsx`,
`describe('#113 R7: los nodos no-texto de la barra no llevan más estilo que el ancho (mobile-kcal-consumed-bar #113)')`,
un `it.each` con título
`'con merKcal $merKcal y kcalConsumedToday $kcal el relleno solo lleva width $width'`
sobre estas dos filas literales:

| `merKcal` | `kcal` (`kcalConsumedToday`) | `servedToday` | `width` |
|---|---|---|---|
| 656 | 0 | `[]` | `'0%'` |
| 1420 | 890 | `['07:30']` | `'63%'` |

Por fila, con `mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] })`
y `mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan({ merKcal, servedToday, kcalConsumedToday: kcal }) })`:

1. `expect(await screen.findByTestId('food-plan-fill')).toHaveAnimatedStyle({ width }, { shouldMatchAllProps: true })`;
2. `const progress = screen.getByTestId('food-plan-progress')`;
   `expect(progress.props.style).toBeUndefined()`;
3. `const header = progress.children[0]`, con la misma guarda
   `typeof header === 'string'` que usa R2(a);
   `expect(header.props.style).toBeUndefined()`;
4. `expect(screen.getByTestId('food-plan-track').props.style).toBeUndefined()`.

**Criterio de aceptación verificable.** Medido por el reviewer con este mismo
mecanismo (`progress/review_mobile-kcal-consumed-bar.md` §Sondas para la
enmienda de H1): sin mutar, `food.test.tsx` verde; y cada una de estas
mutaciones en `food.tsx` pone **rojo** R7:

- M8, M13 y M14 (tabla de arriba);
- en `food-plan-fill`, `style={[kcalBarStyle, { opacity: 0.7 }]}`,
  `style={[{ opacity: 0.7 }, kcalBarStyle]}` y
  `style={[kcalBarStyle, [{ opacity: 0.7 }]]}`: el matcher junta los objetos
  del array con los valores animados antes de comparar, y la clave de más
  rompe `shouldMatchAllProps`;
- `style={{ opacity: 0.5 }}` en `food-plan-progress` y en su cabecera.

Un `className` extra en el relleno (p. ej. ` opacity-70`) ya lo caza el `toBe`
de R2(a): no es asunto de R7.

### Errata del test de R5 (H2 del reviewer)

El párrafo «Test» de R5 y el paso R5 (1) de [[tasks]] prescriben
`.toBe('h-40 w-full rounded-card')`, que **no puede pasar**: `Skeleton` de
heroui-native antepone `skeleton__root` al `className` del host
(`base: 'skeleton__root'` en
`node_modules/heroui-native/lib/module/components/skeleton/skeleton.styles.js`;
`src/screens/home/index.test.tsx` ya lo asevera así). El literal correcto es
**`'skeleton__root h-40 w-full rounded-card'`**, que es el que ya asevera el
test del commit `a73390f7`. El SHALL de R5 (`className="h-40 w-full rounded-card"`
en el call-site de `food.tsx`) no cambia. Sin trabajo de código.

### Candados que se mueven con E1

Ninguno. R7 es un `describe` nuevo en `food.test.tsx` y ningún test existente
cambia. Recuento esperado: `food.test.tsx` 53 → **55**; suite móvil
1441 → **1443**, mismas 80 suites.

### Aprobación de la Enmienda E1

- [x] Enmienda E1 aprobada por humano (fecha: 2026-09-23, vía Notion) ← gate obligatorio antes de la ronda 2 de Codex
