---
feature: "mobile-canvas-nutrition"
status: spec_ready        # draft | spec_ready | approved
tags: [harness, spec, mobile, canvas-parity]
---

# Requisitos — [[mobile-canvas-nutrition]] (#200)

## Contexto

Ola 2 del plan `progress/plan_canvas-parity-2026-10-23.md` (§2, fila #200).
Nutrición, Horario de comidas e Historial de comidas iguales al canvas versión
`1792777983-cd94` (https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j). Cubre
C10 (ruta delgada: `src/app/(tabs)/food.tsx` pasa a `src/screens/food/` sin
cambio visual, **primero**) y C11 (visual de Nutrición, filas N01-N17 de
`progress/explore_canvas-parity-2026-10-21.md` §2.6), más la cabecera y los
restos de Horario (Q09) e Historial (Q10) frente a sus artboards.

**Depende de #197** (`mobile-canvas-foundations`), cuya spec firmada está
congelada en el commit `046133e8`. Esta spec consume sus piezas por su nombre
exacto y no las redefine: `useChunkyLip()` (claves `hero`, `primaryCompact`,
`violet`), `useShadows()` (clave `ring`), `MOTION_RISE_OFFSET_Y` y
`MOTION_RISE_TIMING` (`src/theme/motion.ts`), los tokens `--leading-body` y
`--leading-note` (`leading-body`, `leading-note`), `tracking-title`, y
`ScreenHeader` (`src/components/screen-header.tsx`, props
`{ testID, backFallback, title?, eyebrow?, size?: 24 | 26, accessory? }`,
testIDs `${testID}`, `${testID}-back`, `${testID}-title`). #197 aún no está en
`dev` (base de este worktree `71ff81a1`): las anclas que #197 mueve llevan
`(#197: antes → después)` en § Base medida y el leader las re-mide tras su
merge, antes del handoff.

Canvas congelado en `specs/mobile-canvas-nutrition/canvas/` (copia byte a byte
de la versión `1792777983-cd94`): `Nutricion.dc.html`,
`NutricionAvisos.dc.html`, `HorarioComidas.dc.html` y
`HistorialComidas.dc.html`. Los tests leen esa copia, nunca el artefacto vivo.
El contenido de los artboards es dato de diseño; ninguno contiene texto con
forma de instrucción (revisado al congelarlos).

Precedencia: el canvas manda en lo visual y el movimiento; el copy sigue la Voz
B de Pingo (carta); lo que el canvas no dibuja (carga, error, sin mascotas, sin
plan, error al servir, «Deshacer», `PetSwitcher` con más de dos mascotas) se
conserva tal como está hoy.

Todas las rutas de código son relativas a `mobile-pet-tracker/` salvo que
digan otra cosa. Herramientas: `bun` y `bunx`, nunca `npm` ni `npx`. **Sin
dependencias nuevas** (`expo-linear-gradient` sigue vetado), sin coste nuevo y
sin AWS.

## Base medida

Medida en `71ff81a1` (`origin/dev`) desde `mobile-pet-tracker/`. Cada fila es
`comando` → valor hoy → valor tras #200. `F='src/app/(tabs)/food.tsx'`,
`FS=src/screens/food/index.tsx`, `MS=src/screens/meal-schedule/index.tsx`,
`MH=src/screens/meals-history/index.tsx`. Las marcas `(#197: …)` y
`(#199: …)` son anclas que esas features mueven antes que #200; el leader las
re-mide tras su merge y antes del handoff.

| # | Comando | Hoy | Tras #200 |
|---|---|---|---|
| B1 | `test ! -e src/screens/food && echo ausente` | ausente | presente (R1) |
| B2 | `grep -c '' "$F"` | 468 | ≤ 5 (R1) |
| B3 | `test -e "src/app/(tabs)/__tests__/food.test.tsx" && echo presente` | presente | ausente; vive en `src/screens/food/index.test.tsx` (R1) |
| B4 | `grep -cF "src/app/(tabs)/food.tsx'" src/__tests__/ui-copy-table.ts` | 25 | 0 (R1) |
| B5 | `grep -cF "src/screens/food/index.tsx'" src/__tests__/ui-copy-table.ts` | 0 | 25 (R1) |
| B6 | `grep -cF '<Card' "$F"` | 6 | 0 en `$FS` (R3, R5, R7, R8, R9) |
| B7 | `grep -cF "from '../../components/card'" "$F"` | 1 | 0 en `$FS` |
| B8 | `grep -cF 'style={CONTINUOUS_CORNER}' "$F"` | 1 | 6 en `$FS` (R5 1, R6 1, R7 1, R8 1, R9 2) |
| B9 | `grep -cF 'text-accent-strong' "$F"` | 1 | 1 en `$FS` |
| B10 | `grep -cF 'padding: 24,' "$F"` | 1 | 0 en `$FS` (R2) |
| B11 | `grep -cF 'variant="avatars"' "$F"` | 0 | 1 en `$FS` (R2) |
| B12 | `grep -cF 'KCAL_BAR_TIMING' "$F"` | 2 | 0 en `$FS` (R4) |
| B13 | `grep -cF 'strokeOpacity={0.2}' "$F"` | 1 | 0; `strokeOpacity={0.22}` 1 en `$FS` (R4) |
| B14 | `grep -cF 'export const MOTION_RING_' src/theme/motion.ts` | 0 | 2 (R4) |
| B15 | `grep -cF "t('food.pending')" "$F"` | 1 | 0; `t('food.markServedAction')` 1 en `$FS` (R6) |
| B16 | `grep -cF 'food.pending' src/i18n/catalog.ts` | 2 | 0; `food.markServedAction` 0 → 2 (R6) |
| B17 | `grep -cF '<Sparkles size={18}' "$F"` | 1 | 0; `<Sparkles size={22}` 1 en `$FS` (R8) |
| B18 | `grep -cF '<ChevronRight size={20}' "$F"` | 2 | 0; `<ChevronRight size={18}` 2 en `$FS` (R9) |
| B19 | `grep -cF 'tracking-tight' "$F"` | 1 (#197: 1 → 0) | 0 en `$FS` |
| B20 | `grep -cF 'headerShown' src/app/_layout.tsx` | 2 (#199: 2 → 3) | 5 (R12, R13) |
| B21 | `grep -cF "name=\"meal-schedule\" options={{ ...headerOptions, title: '' }}" src/app/_layout.tsx` | 1 | 0 (R12) |
| B22 | `grep -cF "name=\"meals-history\" options={{ ...headerOptions, title: '' }}" src/app/_layout.tsx` | 1 | 0 (R13) |
| B23 | `grep -cF 'HomeEntrance' $MS` / `$MH` | 5 / 5 | 0 / 0 (R15) |
| B24 | `grep -cF 'meal-schedule-heading' $MS` / `meals-history-heading` en `$MH` | 1 / 1 | 0 / 0 (R12, R13) |
| B25 | `grep -cF 'paddingBottom: insets.bottom + 24' $MS` / `$MH` | 1 / 1 | 0 / 0; `insets.bottom + 32` 1 / 1 (R12, R13) |
| B26 | `grep -cF '<ScreenHeader' $MS` / `$MH` | 0 / 0 | 1 / 1 (R12, R13) |
| B27 | `grep -cF 'chunkyLip.violet' $MS` | 0 | 1 (R14) |
| B28 | `test ! -e src/components/rise-in.tsx && echo ausente` | ausente (#199: ausente → presente) | presente; #200 no lo crea |
| B29 | `test ! -e src/components/screen-header.tsx && echo ausente` | ausente (#197: ausente → presente) | presente; #200 no lo crea |
| B30 | `grep -cF -- '--leading-note' src/theme/global.css` | 0 (#197: 0 → 1) | 1; #200 no lo crea |
| B31 | `grep -cF 'Enmienda #200' ../docs/ui-guidelines.md` | 0 | ≥ 1 (R16) |
| B32 | `test ! -e src/__tests__/nutrition-canvas-fidelity.test.ts && echo ausente` | ausente | presente (R16) |

Si tras el merge de #197 y #199 cualquier fila marcada no da su valor
«después», el leader corrige la cifra aquí antes del handoff; las demás filas
no dependen de ellas.

## TestIDs

Se conservan todos los testIDs actuales de las tres pantallas salvo
`meal-schedule-heading` y `meals-history-heading` (los sustituye
`ScreenHeader`). Nuevos:

| TestID | Elemento | R |
|---|---|---|
| `food-title-row` | `View` fila de título y avatares | R2 |
| `meal-tile-${index}` | `View` de 36 con icono de estado | R6 |
| `meal-portion-${index}` | `Text` anidado `· {g} g` dentro de la hora | R6 |
| `food-warnings` | `View` contenedor de avisos | R7 |
| `food-ai-body` | `Text` cuerpo de la recomendación | R8 |
| `food-links` | `View` contenedor de los dos enlaces | R9 |
| `food-icon-check` | doble de `Check` en FO (solo test) | R6 |
| `meal-schedule-header` (+ `-back`, `-title`) | `ScreenHeader` de Horario | R12 |
| `meals-history-header` (+ `-back`, `-title`) | `ScreenHeader` de Historial | R13 |

Selectores por regex vigentes cruzados (`/^meal-row-/`, `/^meal-served-/`,
`/^meal-pending-/`, `/^plan-warning-/`, `/^pet-chip-/`, `/^meal-time-row-/`,
`/^meals-history-day-/`, perfil `/-link$/` y `/-link-tile$/`): ninguno casa con
un testID nuevo. `meal-tile-` y `meal-portion-` no empiezan por `meal-row-`,
`meal-served-` ni `meal-pending-`; `food-links` no acaba en `-link`.

## Requisitos funcionales

Alias de tests: **FO** `src/screens/food/index.test.tsx` (hoy
`src/app/(tabs)/__tests__/food.test.tsx`, R1 lo mueve), **MS**
`src/screens/meal-schedule/index.test.tsx`, **MH**
`src/screens/meals-history/index.test.tsx`, **NC**
`src/__tests__/nutrition-canvas-fidelity.test.ts` (nuevo), **LY**
`src/app/__tests__/layout.test.tsx`, **MT** `src/theme/__tests__/motion.test.ts`,
**DS** `src/app/__tests__/detail-stack.test.tsx`. Cada `it` nuevo empieza por
`#200 R<n>`. Ningún test de FO, MS ni MH usa `StyleSheet` (guarda #68 R18):
los estilos se asertan con `toHaveStyle`.

**Dobles comunes.** FO, MS y MH sustituyen `components/rise-in` (de #199) por
un `View` anfitrión que expone `testID`, `delayMs` y `children`, igual que los
tests de #199; el helper local `riseDelayOf(node)` sube por `.parent` hasta el
primer nodo con `props.delayMs !== undefined` y devuelve ese valor. FO añade
`Check` al doble de `reicon-react-native` con testID `food-icon-check`, y los
dobles de `Check`, `Clock`, `Sparkles` y `ChevronRight` exponen `size`,
`strokeWidth` y `color` como props del nodo anfitrión. FO espía `withDelay`
igual que hoy espía `withTiming` (`mockWithDelay` devuelve la animación
interna).

### R1 — Nutrición es ruta delgada (C10)

WHEN se abre la pestaña Nutrición THE SYSTEM SHALL renderizar `FoodScreen`
exportado por `src/screens/food/index.tsx`, y `src/app/(tabs)/food.tsx` SHALL
contener solo `import { FoodScreen } from '../../screens/food';` y
`export default function FoodRoute() { return <FoodScreen />; }`, sin cambio
visual. El test se mueve con `git mv` a `src/screens/food/index.test.tsx` y
pasa a renderizar `FoodScreen` desde `'.'`. Las referencias por ruta se
actualizan en la lista cerrada de § Candados (R1).

- Test: DS `#200 R1: Nutrición es una ruta delgada sobre src/screens/food` —
  lee `src/app/(tabs)/food.tsx`: ≤ 5 líneas, contiene las dos cadenas
  literales de arriba; `existsSync('src/screens/food/index.tsx')` es `true` y
  `existsSync('src/app/(tabs)/__tests__/food.test.tsx')` es `false`.
- Sin otro `it` nuevo: la suite FO movida en verde, sin cambiar aserciones
  salvo las rutas de lectura de fuente (§ Candados), es la prueba de «sin
  cambio visual».

### R2 — Marco y fila de título

WHEN Nutrición se pinta en cualquier rama THE SYSTEM SHALL usar en el
`ScrollView` `screen-food` el `contentContainerStyle`
`{ paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96, gap: 14 }`
(canvas `padding: 60px 20px 120px`), sin `padding`. WHEN hay mascotas THE
SYSTEM SHALL pintar `View` `food-title-row` con className exacta
`flex-row items-center justify-between`, cuyo primer hijo es `food-title` y el
segundo `<PetSwitcher variant="avatars" … />` (componente consumido sin
cambios, mismas props de selección que hoy); WHEN no hay mascotas la fila
contiene solo `food-title`.

- Test: FO `#200 R2: el marco es el del canvas` — con el doble de insets
  `{ top: 40, bottom: 24 }`, `contentContainerStyle` es `toEqual`
  `{ paddingHorizontal: 20, paddingTop: 52, paddingBottom: 120, gap: 14 }`.
- Test: FO `#200 R2: los avatares comparten fila con el título` — con dos
  mascotas, `food-title-row` tiene la className exacta, su primer hijo es
  `food-title` y `within(food-title-row).getAllByTestId(/^pet-chip-/)` da
  `['pet-chip-pet-1', 'pet-chip-pet-2']`.
- Test: FO `#200 R2: sin mascotas la fila solo lleva el título` — rama vacía:
  `within(food-title-row).queryAllByTestId(/^pet-chip-/)` vacío.

### R3 — Héroe de plan

WHEN hay plan cargado THE SYSTEM SHALL pintar `food-plan-card` como `View`
(no `Card`) con className exacta `rounded-hero bg-accent p-4.5` y
`style={[CONTINUOUS_CORNER, chunkyLip.hero]}` (`const chunkyLip = useChunkyLip();`),
que conserva `food-plan-summary` (`flex-row items-center gap-4`) y la columna
(`flex-1 gap-1`) como hoy. Las clases de texto pasan a, exactas:

| Nodo | className |
|---|---|
| primer hijo de la columna (`t('food.dailyTarget')`) | `text-xs font-extrabold uppercase tracking-caps text-accent-foreground` |
| `food-plan-kcal` | `text-24 font-black text-accent-foreground` |
| `food-plan-grams` | `text-sm font-semibold text-accent-foreground` |
| `food-plan-percent` | `text-24 font-black text-accent-foreground` |
| `food-plan-consumed` | `text-11 font-bold text-accent-foreground` |

Ningún texto lleva opacidad (carta #61 R3; ver § Desviaciones D3).

- Test: FO `#200 R3: el héroe es un View de acento con labio hero` —
  className exacta, `toHaveStyle(CONTINUOUS_CORNER)` y
  `toHaveStyle(renderHook(() => useChunkyLip()).result.current.hero)`.
- Test: FO `#200 R3: textos del héroe con la escala del canvas` — `it.each`
  con una fila por nodo de la tabla.

### R4 — Anillo: pista y movimiento

WHEN el anillo se pinta THE SYSTEM SHALL dar a `food-plan-ring-track`
`strokeOpacity={0.22}` (canvas `rgba(255,255,255,0.22)`), y WHEN cambia el
porcentaje (montaje incluido) THE SYSTEM SHALL animar el relleno con
`withDelay(MOTION_RING_DELAY_MS, withTiming(Math.min(kcalPct, 100), MOTION_RING_TIMING))`.
`src/theme/motion.ts` exporta
`MOTION_RING_TIMING = { duration: 1100, easing: Easing.bezier(0, 0, 0.58, 1), reduceMotion: ReduceMotion.System }`
y `MOTION_RING_DELAY_MS = 200` (canvas `animation: ring 1100ms ease-out 200ms both`).
`KCAL_BAR_TIMING` desaparece.

- Test: MT `#200 R4: el anillo dura 1100 ms con ease-out y espera 200` —
  literales `1100`, `200`, `ReduceMotion.System` y la curva comparada con el
  mismo mecanismo que hoy usa `expectKcalBarTiming` en FO, con `(0, 0, 0.58, 1)`.
- Test: FO `#200 R4: el relleno espera 200 ms y usa la curva del anillo` —
  al montar con 50 %, `mockWithDelay` recibe `200` y `mockWithTiming`
  `(50, MOTION_RING_TIMING)`; al servir hasta 100 %, otra pareja igual con
  `100`.
- Test: FO `#200 R4: la pista lleva la opacidad del canvas` —
  `food-plan-ring-track` tiene `strokeOpacity` `0.22`.

### R5 — Tarjeta de comidas

WHEN hay plan cargado THE SYSTEM SHALL pintar `food-meals-section` como
`View` con className exacta `gap-2 rounded-24 border border-border bg-surface p-3.5`
y `style={CONTINUOUS_CORNER}`; `food-meals-title` con
`text-17 font-extrabold text-foreground` y `food-meals-progress` con
`text-15 font-black text-accent-strong` (conserva `TABULAR_NUMS`).

- Test: FO `#200 R5: la tarjeta de comidas es la del canvas` — className del
  contenedor, `toHaveStyle(CONTINUOUS_CORNER)` y un `it.each` con título y
  progreso.

### R6 — Filas de comida

WHEN se pinta la fila `index` THE SYSTEM SHALL:

1. Dar a `meal-row-${index}` la className exacta
   `flex-row items-center gap-3 py-2` si `index === 0` y
   `flex-row items-center gap-3 border-t border-border py-2` si `index > 0`.
2. Pintar como primer hijo `meal-tile-${index}`: `View` con
   `style={CONTINUOUS_CORNER}` y className
   `size-9 items-center justify-center rounded-xl ${CATEGORY_SLOTS.green.surface}`
   si está servida (contiene `Check size={18} strokeWidth={2.6}` en
   `category-green-strong`) o
   `size-9 items-center justify-center rounded-xl bg-default` si está
   pendiente (contiene `Clock size={18} strokeWidth={2.4}` en `muted`).
3. Pintar después un `View className="flex-1"` con el `Text` de la hora
   (`text-15 font-extrabold text-foreground`, `style={TABULAR_NUMS}`), que
   anida `Text` `meal-portion-${index}` (`font-semibold text-muted`) con
   `· {gramos} g` usando la misma expresión de gramos que hoy pinta `94 g`.
4. Conservar el `Pressable` `meal-toggle-${index}` (`min-h-11 justify-center`,
   etiquetas `food.markServed`/`food.undoServed`, opacidad 0.8 al pulsar), cuyo
   hijo es: servida, `View` `meal-served-${index}` con className
   `rounded-full px-2.5 py-1 ${CATEGORY_SLOTS.green.surface}` y `Text`
   `text-xs font-extrabold ${CATEGORY_SLOTS.green.ink}` con `t('food.served')`;
   pendiente, `View` `meal-pending-${index}` con className
   `h-8 justify-center rounded-full bg-accent px-3`,
   `style={chunkyLip.primaryCompact}` y `Text`
   `text-xs font-extrabold text-accent-foreground` con
   `t('food.markServedAction')`.

Copy: la clave `food.pending` se renombra a `food.markServedAction` en los dos
idiomas: es `'Marcar servido'`, en `'Mark served'`. La fila de `R6_FOOD` en
`src/__tests__/ui-copy-table.ts` cuyo key es `food.pending` pasa a
`food.markServedAction` (misma ruta nueva de R1). `R6_FOOD`, `ALL_USES` y
`SCREEN_FILES` no cambian de longitud por R6.

- Test: FO `#200 R6: la primera fila no lleva borde y las siguientes sí` —
  `it.each` con las ramas `index 0` e `index 1`.
- Test: FO `#200 R6: el tile dice servido o pendiente` — `it.each` con las
  ramas servida (clase verde, `food-icon-check` con `size 18`,
  `strokeWidth 2.6`, color `category-green-strong`) y pendiente (`bg-default`,
  `food-icon-clock` con `size 18`, `strokeWidth 2.4`, color `muted`).
- Test: FO `#200 R6: la hora anida la ración` — la hora tiene la className
  exacta y `toHaveTextContent('07:30 · 94 g')`; `meal-portion-0` tiene
  `font-semibold text-muted` y `toHaveTextContent('· 94 g')`.
- Test: FO `#200 R6: servida es píldora verde y pendiente es botón con labio`
  — `it.each` con las dos ramas: className del `View`, className del `Text`,
  texto `Servido` / `Marcar servido` y, en pendiente,
  `toHaveStyle(renderHook(() => useChunkyLip()).result.current.primaryCompact)`.

### R7 — Avisos del plan (artboard NutricionAvisos)

WHEN el plan trae `warnings` THE SYSTEM SHALL pintarlos dentro de `View`
`food-warnings` (className exacta `gap-2`), cada uno como `View`
`warning-card-${code}` con className exacta `rounded-card bg-default p-3.5` y
`style={CONTINUOUS_CORNER}`, y su `Text` `plan-warning-${code}` con
`text-sm font-medium leading-note text-foreground`. WHEN no hay warnings no se
pinta `food-warnings`.

- Test: FO `#200 R7: cada aviso es una tarjeta neutra con interlineado de nota`
  — fixture de dos warnings: contenedor, cada tarjeta y cada texto.
- Test: FO `#200 R7: sin avisos no hay contenedor` —
  `queryByTestId('food-warnings')` es `null`.

### R8 — Recomendación IA

WHEN hay `aiExplanation` THE SYSTEM SHALL pintar `food-ai-card` como `View`
con className exacta `flex-row gap-3 rounded-card ${CATEGORY_SLOTS.violet.surface} p-3.5`
y `style={CONTINUOUS_CORNER}`, con hijos en orden: `Sparkles size={22}
strokeWidth={2.2}` en `category-violet-strong`, y `View className="flex-1 gap-0.5"`
con `food-ai-title` (`text-sm font-extrabold ${CATEGORY_SLOTS.violet.ink}`,
copy `food.aiRecommendation`) y `food-ai-body`
(`text-13 leading-body text-foreground`, el mismo texto que hoy).

- Test: FO `#200 R8: la recomendación es la tarjeta violeta del canvas` —
  clases de tarjeta, título y cuerpo, y el doble de `Sparkles` con `22`,
  `2.2` y `category-violet-strong`.

### R9 — Enlaces a Horario e Historial

THE SYSTEM SHALL pintar los enlaces existentes (`meal-schedule-link`,
`meals-history-link`, en las mismas ramas que hoy) dentro de `View`
`food-links` (className exacta `gap-2`), cada uno como `Pressable` con
className exacta `flex-row items-center gap-3 rounded-16 bg-default px-3.5 py-3`,
`style={CONTINUOUS_CORNER}`, `accessibilityRole="button"` y el mismo `onPress`
que hoy. Dentro: `View className="flex-1 gap-0.5"` con el título
(`meal-schedule-link-title` / `meals-history-link-title`,
`text-15 font-extrabold text-foreground`) y el subtítulo (`text-xs text-muted`,
claves de hoy), y después `ChevronRight size={18} strokeWidth={2.4}` en
`foreground`.

- Test: FO `#200 R9: los enlaces son filas neutras de radio 16` — `it.each`
  con una fila por enlace: className, `toHaveStyle(CONTINUOUS_CORNER)`, título,
  subtítulo y chevron.
- Test: FO `#200 R9: pulsar cada enlace navega como hoy` — `it.each` con una
  fila por enlace: `router.push` con `'/meal-schedule'` y `'/meals-history'`.

### R10 — Entrada escalonada de Nutrición

WHEN se pinta el plan cargado THE SYSTEM SHALL envolver cada pieza en
`RiseIn` (`src/components/rise-in.tsx`, creado por #199) con estos
`delayMs` (canvas `animation: rise 400ms ease-out <n>ms both`):

| Pieza | `delayMs` |
|---|---|
| `food-plan-card` | `0` |
| `food-meals-section` | `80` |
| `warning-card-${code}` en la posición `index` | `110 + 30 * index` |
| `food-ai-card` | `140` |
| `food-links` | `200` |

- Test: FO `#200 R10: cada pieza entra con el retardo del canvas` — `it.each`
  con seis filas (plan 0, comidas 80, primer aviso 110, segundo aviso 140, IA
  140, enlaces 200) sobre el fixture de dos warnings, leyendo
  `riseDelayOf(getByTestId(id))`.

### R11 — Orden de piezas

WHEN hay plan cargado con avisos e IA THE SYSTEM SHALL pintar, en este orden:
`food-plan-card`, `food-meals-section`, `food-warnings`, `food-ai-card`,
`food-links`.

- Test: FO `#200 R11: las piezas siguen el orden del canvas` —
  `getAllByTestId(/^(food-plan-card|food-meals-section|food-warnings|food-ai-card|food-links)$/)`
  mapeado a `testID` es `toEqual` a esa lista.

### R12 — Cabecera de Horario

WHEN se abre Horario de comidas THE SYSTEM SHALL pintar como primer hijo del
contenido del scroll
`<ScreenHeader testID="meal-schedule-header" size={24} backFallback="/food" title={t('mealSchedule.mealSchedule')} />`,
sin `meal-schedule-heading`, con `contentContainerStyle`
`{ paddingHorizontal: 20, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 32, gap: 14 }`
(canvas `padding: 56px 20px 32px`), y `src/app/_layout.tsx` SHALL declarar
`<Stack.Screen name="meal-schedule" options={{ headerShown: false }} />`.

- Test: MS `#200 R12: Horario pinta su cabecera en contenido` — en carga y con
  datos: `meal-schedule-header-title` muestra el valor de
  `mealSchedule.mealSchedule`, `queryByTestId('meal-schedule-heading')` es
  `null` y `contentContainerStyle` es `toEqual`
  `{ paddingHorizontal: 20, paddingTop: 48, paddingBottom: 56, gap: 14 }`
  (doble `{ top: 40, bottom: 24 }`).
- Test: LY `#200 R12: meal-schedule oculta la cabecera nativa` — con el mismo
  acceso a `options` por `name` que el it `#95 R4 › #194 R4`, las opciones son
  `toEqual({ headerShown: false })`.

### R13 — Cabecera de Historial

Igual que R12 para Historial de comidas:
`<ScreenHeader testID="meals-history-header" size={24} backFallback="/food" title={t('mealsHistory.mealsHistory')} />`,
sin `meals-history-heading`, mismo `contentContainerStyle`, y
`<Stack.Screen name="meals-history" options={{ headerShown: false }} />`.

- Test: MH `#200 R13: Historial pinta su cabecera en contenido` — título,
  ausencia de `meals-history-heading` y `contentContainerStyle` con
  `paddingTop` = `insets.top` del doble + 8 y `paddingBottom` =
  `insets.bottom` del doble + 32.
- Test: LY `#200 R13: meals-history oculta la cabecera nativa`.

### R14 — «Generar plan» con labio violeta

WHEN se pinta `generate-plan-button` THE SYSTEM SHALL añadir
`style={chunkyLip.violet}` (`useChunkyLip()`) al `Button` existente, sin
cambiar su className (canvas `box-shadow: 0 4px 0 rgba(91,63,163,0.35)`).

- Test: MS `#200 R14: «Generar plan» lleva el labio violeta` —
  `toHaveStyle(renderHook(() => useChunkyLip()).result.current.violet)` (los
  valores los candan los tests de #197).

### R15 — Entrada escalonada de Horario e Historial

WHEN se pintan Horario e Historial THE SYSTEM SHALL sustituir `HomeEntrance`
por `RiseIn` conservando los testIDs de entrada, con `delayMs`:
`meal-schedule-summary-entry` `0`, `meal-time-entry-${index}` `80 + 60 * index`,
`meals-history-calendar-entry` `0`, `meals-history-detail-entry` `100`. Las
dos pantallas dejan de importar `../home/home-entrance`.

- Test: MS `#200 R15: Horario entra con los retardos del canvas` — `it.each`
  con `meal-schedule-summary-entry` 0, `meal-time-entry-0` 80 y
  `meal-time-entry-1` 140 (y `meal-time-entry-2` 200 si el fixture pinta tres),
  leyendo `props.delayMs` del doble.
- Test: MH `#200 R15: Historial entra con los retardos del canvas` — `it.each`
  con `meals-history-calendar-entry` 0 y `meals-history-detail-entry` 100.

### R16 — Enmienda de carta y fidelidad al canvas

THE SYSTEM SHALL añadir a `docs/ui-guidelines.md` la sección
«Enmienda #200 (mobile-canvas-nutrition)» con: (a) Nutrición, Horario e
Historial entran con `RiseIn` y los retardos de R10 y R15; (b) el anillo de
Nutrición anima con `MOTION_RING_TIMING` y `MOTION_RING_DELAY_MS`; (c) frase
por feature para `rounded-24` (tarjeta de comidas) y `rounded-16` (enlaces);
(d) héroe, comidas, avisos, IA y enlaces de Nutrición son `View`/`Pressable`
con clases propias, no `Card`. Y SHALL existir NC con una fila por literal:

| Artboard | Literal del canvas | Valor en producción |
|---|---|---|
| `Nutricion` | `padding: 60px 20px 120px` | `$FS` contiene `paddingHorizontal: 20` y `paddingBottom: insets.bottom + 96` |
| `Nutricion` | `animation: rise 400ms ease-out both` | `$FS` contiene `delayMs={0}` |
| `Nutricion` | `animation: rise 400ms ease-out 80ms both` | `$FS` contiene `delayMs={80}` |
| `Nutricion` | `animation: rise 400ms ease-out 140ms both` | `$FS` contiene `delayMs={140}` |
| `Nutricion` | `animation: rise 400ms ease-out 200ms both` | `$FS` contiene `delayMs={200}` |
| `Nutricion` | `animation: ring 1100ms ease-out 200ms both` | `MOTION_RING_TIMING.duration === 1100` y `MOTION_RING_DELAY_MS === 200` |
| `Nutricion` | `box-shadow: 0 6px 0 var(--lip)` | `$FS` contiene `chunkyLip.hero` |
| `Nutricion` | `box-shadow: 0 3px 0 var(--lip)` | `$FS` contiene `chunkyLip.primaryCompact` |
| `Nutricion` | `rgba(255,255,255,0.22)` | `$FS` contiene `strokeOpacity={0.22}` |
| `Nutricion` | `line-height: 1.4` | `$FS` contiene `leading-body` |
| `NutricionAvisos` | `animation: rise 400ms ease-out 110ms both` | `$FS` contiene `110 + 30 * index` |
| `NutricionAvisos` | `line-height: 1.45` | `$FS` contiene `leading-note` |
| `HorarioComidas` | `padding: 56px 20px 32px` | `$MS` contiene `paddingBottom: insets.bottom + 32` |
| `HorarioComidas` | `box-shadow: 0 4px 0 rgba(91,63,163,0.35)` | `$MS` contiene `chunkyLip.violet` |
| `HorarioComidas` | `animation: rise 400ms ease-out 80ms both` | `$MS` contiene `80 + 60 * index` |
| `HistorialComidas` | `padding: 56px 20px 32px` | `$MH` contiene `paddingBottom: insets.bottom + 32` |
| `HistorialComidas` | `animation: rise 400ms ease-out 100ms both` | `$MH` contiene `delayMs={100}` |

- Test: NC `#200 R16: cada literal del canvas tiene su valor en producción` —
  `it.each` sobre la tabla; cada fila lee
  `readFileSync(join(process.cwd(), '..', 'specs/mobile-canvas-nutrition/canvas/<Artboard>.dc.html'), 'utf8')`
  y exige `includes(literal)` y el valor de producción (fuente leída con
  `readFileSync` o constante importada de `src/theme/motion.ts`).
- Test: NC `#200 R16: las cabeceras declaran su vuelta a Nutrición` —
  `$MS` y `$MH` contienen, cada uno, su línea `<ScreenHeader …/>` literal de
  R12/R13 (una fila por fichero).
- Test: NC `#200 R16: la carta recoge la enmienda` —
  `../docs/ui-guidelines.md` contiene `Enmienda #200`, `rounded-24` y
  `rounded-16` dentro de esa sección.

### R17 — Guardas de la carta en los ficheros tocados

THE SYSTEM SHALL mantener en `$FS`, `$MS`, `$MH` y sus tres tests: cero
`StyleSheet`, cero clases con valor arbitrario (`/\b[\w-]+-\[/`) y cero
literales hex salvo `#NNN R<n>` (`/#[0-9a-fA-F]{3,8}\b(?!\s+R\d)/`); y `$FS`
no importa `components/card`.

- Test: NC `#200 R17: %s no usa StyleSheet, corchetes ni hex` — `it.each` con
  una fila por fichero (seis filas).
- Test: NC `#200 R17: Nutrición no importa Card` — `$FS` sin
  `components/card`.

## Candados que la feature revierte

Inventario cerrado, hallado con `git grep -nF '<literal viejo>'` sobre
`71ff81a1` y seguido por constantes, helpers y tablas `it.each` hasta cada
`it`. Cada `it` tocado lleva el sufijo `(enmendado por #200 R<n>)` en su
título (si ya tiene sufijo, se añade `y #200 R<n>`) y se enmienda en el commit
rojo de su R. Las rutas de FO se citan por su sitio nuevo; antes de R1 viven
en `src/app/(tabs)/__tests__/food.test.tsx`.

**R1 (rutas; sin cambio de aserción)**

1. `src/__tests__/ui-copy-table.ts`: las 25 filas `'src/app/(tabs)/food.tsx'`
   pasan a `'src/screens/food/index.tsx'` (B4/B5).
2. `src/__tests__/ui-language.test.ts`, it `#194 R5: no deja ningún valor
   fijo…`: la cuenta de `SCREEN_FILES` gana el término
   `+ 1 - 1 // #200 R1: sale app/(tabs)/food.tsx, entra screens/food/index.tsx`
   (precedente `#117 R10`).
3. `src/__tests__/design-drift.test.ts`: la fila `'food'` de
   `it.each(...)('%s importa el Card compartido')` y su ruta especial
   (`screen === 'food'`) apuntan a `screens/food/index.tsx`; `#98 R10`
   `featureFiles` `'app/(tabs)/food.tsx'` → `'screens/food/index.tsx'`;
   `#87 R19` `screenSignOutCalls` `'app/(tabs)/food.tsx': 0` →
   `'screens/food/index.tsx': 0`.
4. `src/__tests__/tab-headers-canvas.test.ts`: `TAB_SCREENS_168`
   (`'app/(tabs)/food.tsx'` → `'screens/food/index.tsx'`),
   `SCREEN_AND_TEST_FILES_168` (`'app/(tabs)/__tests__/food.test.tsx'` →
   `'screens/food/index.test.tsx'`) y la lista ordenada de
   `#168 R1 › limita el literal…`, con la ruta nueva en la posición que da
   `.sort()` (verificar con `node -e`); los `#168 R12` que iteran esas listas
   no cambian de aserción.
5. `src/components/__tests__/empty-state.test.tsx`:
   `['src/app/(tabs)/food.tsx', 2]` → `['src/screens/food/index.tsx', 2]` y la
   lista ordenada de `ningún otro fichero usa EmptyState`, reordenada con
   `.sort()`.
6. `src/__tests__/consistency-classnames.test.ts`: `#62 R14` `directUses`
   `join('app','(tabs)','food.tsx')` → `join('screens','food','index.tsx')`;
   `#98 R10 › deja CONTINUOUS_CORNER…` `readSource(join('app','(tabs)','food.tsx'))`
   → `readSource(join('screens','food','index.tsx'))`.
7. `src/__tests__/legibility-classnames.test.ts`: `#61 R3` `accentCards` y
   `#61 R4` `inkSites`, ruta de food → `join('screens','food','index.tsx')`.
8. FO: los `readFileSync` de `#98 R4 › no deja rastro del reloj en el fuente
   de Food` y `#107 R5 › #109 R1: acota el bloque…` → `src/screens/food/index.tsx`;
   el render importa `FoodScreen` de `'.'`; cada ruta relativa de `jest.mock`
   e `import` pierde un `../` (de `src/app/(tabs)/__tests__/` a
   `src/screens/food/`).

**R2**

9. FO `R4 › shows the hub and a loading state while pets are pending`:
   `contentContainerStyle` `{ padding: 24, paddingTop: 52, paddingBottom: 120 }`
   → `{ paddingHorizontal: 20, paddingTop: 52, paddingBottom: 120, gap: 14 }`.

**R3**

10. FO `#168 R8 › agrupa progreso y columna como únicos hijos del resumen`:
    caps, kcal y gramos → clases de R3 (resumen y columna no cambian).
11. FO `#168 R8 › porcentaje y kcal llevan sus clases y cifras tabulares`:
    porcentaje y consumido → clases de R3.
12. `legibility-classnames.test.ts` `#61 R3 › '%s conserva las dos etiquetas
    de la card de acento a opacidad plena'`: los literales
    `text-xs font-semibold uppercase tracking-widest text-accent-foreground` y
    `font-semibold text-accent-foreground` → los de caps y gramos de R3.

**R4**

13. FO helper de nivel superior `expectKcalBarTiming` (250 ms,
    `bezier(0.77, 0, 0.175, 1)`) → aserta `MOTION_RING_TIMING` y el
    `withDelay(200, …)`; arrastra `#168 R10 › transiciona de 50 a 100 al servir
    y vuelve a 50 al deshacer`.
14. FO `#168 R10 › la llamada de 50 respeta ReduceMotion.System` y
    `#168 R10 › acota la llamada a 100 aunque el texto diga 150%`: el índice
    de llamada de `mockWithTiming` y su segundo argumento, a la forma de R4.
15. FO `#168 R8 › la pista tiene exactamente su receta de Circle`:
    `strokeOpacity: 0.2` → `0.22`.
16. MT `no exporta nada más (enmendado por #195 R13)`: la lista gana
    `MOTION_RING_DELAY_MS` y `MOTION_RING_TIMING` (#199 también la enmienda:
    el leader re-mide la lista tras su merge).

**R5–R9 (tarjetas de Nutrición)**

17. FO `#62 R5 › aplica la receta canónica al título %s`: cada fila se
    enmienda en su R — `food-meals-title` (R5), `food-ai-title` (R8),
    `meal-schedule-link-title` (R9).
18. `consistency-classnames.test.ts` `#98 R10 › deja CONTINUOUS_CORNER…`
    (`food.match(/style=\{CONTINUOUS_CORNER\}/g)` y la cuenta global) y
    `#62 R14` `directUses` de food: cada R suma lo suyo en su commit rojo —
    R5 +1, R6 +1, R7 +1, R8 +1, R9 +2 — hasta 6 en food (B8). La cuenta de
    `text-accent-strong` (1) no cambia.
19. FO `R5 › renders kcal, grams, ordered meals, portions, and local-time
    badges` (R6): `getByText('07:30')` y `getByText('94 g')` → hora y ración
    de R6; `meal-pending-1` con `Pendiente` → `Marcar servido`.
20. FO `#98 R4 › pinta badges y contador desde servedToday…` (R6): las
    clases de fila `bg-default` / `bg-surface-secondary` → las de R6; el
    color de `food-icon-clock` `accent-strong` (servida) → servida pinta
    `food-icon-check` en `category-green-strong`; pendiente sigue `muted`.
21. FO `#62 R3 › hereda radio, borde y sombra sin capturar el testID del
    texto` (R7): `rounded-card`, `border`, `shadow-sm`, `bg-default` → className
    exacta `rounded-card bg-default p-3.5`.
22. FO `R6 › shows the AI recommendation only when the explanation is
    present` (R8), solo si aserta tamaño o color de `food-icon-sparkles`.
23. FO `#105 R14 › shows the history card immediately after the schedule and
    pushes its route` (R9): className de `meals-history-link-title` →
    `text-15 font-extrabold text-foreground`; el hermano anterior sigue siendo
    `meal-schedule-link`.
24. `design-drift.test.ts` `'%s importa el Card compartido'` (R9): sale la
    fila `'food'` y su ruta especial.

**R12 y R13**

25. MS `R7 › shows loading and the metrics under the native header (#95 R6)`
    y `#179 R4 › muestra el título antes del contenido mientras carga` (y el
    resto de its de `#179 R4: marco y título en contenido`):
    `meal-schedule-heading` → `meal-schedule-header-title`;
    `contentContainerStyle` → el de R12.
26. MH `#105 R9 › shows only one skeleton…` y los its de `#179 R9`:
    `meals-history-heading` → `meals-history-header-title`;
    `contentContainerStyle` → el de R13.
27. LY `#95 R4 › #194 R4: %s usa exactamente las opciones de cabecera
    acordadas`: sale la fila `['meal-schedule', '']` (R12); y el it de LY que
    comprueba las opciones de `meals-history` → `{ headerShown: false }` (R13).
    #199 R1 ya enmienda ese título: el leader re-mide tras su merge.

**R15**

28. MS: el doble `mockHomeEntrance` de `'../home/home-entrance'` → doble de
    `'../../components/rise-in'`; `#179 R5 › compone el resumen…` y los its de
    `#179 R6` pasan de `index` a `delayMs` (`0`; `80 + 60 * index`).
29. MH: igual con `#179 R10` (`meals-history-calendar-entry`, `0`) y
    `#179 R12` (`meals-history-detail-entry`, `100`).
30. `design-drift.test.ts` `#179 R13 › reutiliza entrada, paleta, esquinas y
    margen táctil compartidos`: las dos cadenas
    `"import { HomeEntrance } from '../home/home-entrance';"` (Horario e
    Historial) → `"import { RiseIn } from '../../components/rise-in';"`.

Regla de parada: un rojo fuera de este inventario detiene la implementación y
se reporta al leader.

**Enmienda mecánica permitida**: si un `it` no inventariado se pone rojo solo porque compara contra el literal exacto que el R-id quita o sustituye (directo o vía constante/helper del test), el implementador lo enmienda en el commit rojo de ese R con el sufijo y lo apunta en la tabla «Enmiendas mecánicas» de su informe. Cualquier otro rojo no inventariado sigue siendo motivo de parada.

## Desviaciones del canvas

| # | Canvas | App tras #200 | Motivo |
|---|---|---|---|
| D1 | Horario muestra la píldora «Edad Adulto» | No se pinta | La mascota no tiene etapa vital (solo `birthDate` y `ageMonths`); inventarla sería dato falso |
| D2 | Avatar seleccionado con anillo `0 0 0 3px var(--bg), 0 0 0 5px var(--accent)` | El anillo propio de `PetSwitcher variant="avatars"` | Se consume el componente sin cambios; no se toca `useShadows().ring` aquí |
| D3 | Textos del héroe a opacidad .85/.9 | Opacidad plena | Carta #61 R3: sin opacidad de texto sobre `bg-accent` |
| D4 | Fila de avatares siempre visible | Visible según la regla del `PetSwitcher` (sin mascotas, solo título) | Comportamiento del componente compartido |
| D5 | Barra de pestañas con su sombra | Sin cambios | Es de #206 |
| D6 | Ilustraciones y textos de ejemplo («1200 kcal», «640 kcal») | Datos reales del plan | El canvas es dato de diseño |

## Fuera de alcance

- Cambios en `ScreenHeader`, `RiseIn`, `PetSwitcher`, `EmptyState`, `Card` o
  `useChunkyLip`: se consumen tal como los dejan #197, #199 y #198.
- Estados no dibujados (carga, error, sin mascotas, sin plan, error al
  servir, «Deshacer»): conservan su aspecto actual, incluidos los esqueletos.
- Pantallas de #198, #199 y #201, y la barra de pestañas (#206).
- `docs/conventions.md`, que cita la ruta vieja del test de Nutrición: no se
  toca (texto histórico).
- Etapa vital de la mascota (D1): no es feature de esta ola.
- Backend: ningún cambio de API ni de datos.

## Cierre del humano

Smoke en dev build Android en el PC del humano (no Expo Go, no la VPS). Cierra
la feature; no bloquea la implementación.

1. Nutrición con plan: héroe morado con labio inferior, anillo que se llena
   tras una pausa breve, piezas que suben en cascada (plan, comidas, IA,
   enlaces).
2. Una franja pendiente muestra «Marcar servido» con labio; al pulsarla pasa
   a la píldora verde «Servido» con tile verde y check, y el anillo avanza.
3. Con avisos en el plan, las tarjetas de aviso aparecen entre comidas e IA.
4. Avatares a la derecha del título; cambiar de mascota recarga el plan.
5. Horario y su botón «Generar plan» con labio violeta; Historial; en los
   dos, la flecha de la cabecera vuelve a Nutrición y no hay cabecera nativa
   duplicada.
6. Con «Eliminar animaciones» activado en Android, todo aparece sin
   movimiento.

## Aprobación

- [ ] Aprobado por humano (fecha: ____)
- [ ] Enmienda #200 de `docs/ui-guidelines.md` (R16: entrada con `RiseIn`, anillo con `MOTION_RING_*`, `rounded-24` y `rounded-16`, superficies de Nutrición sin `Card`) aprobada por humano
- [ ] Smoke de R2, R3, R4, R6, R7, R10, R12, R13, R14 y R15 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
