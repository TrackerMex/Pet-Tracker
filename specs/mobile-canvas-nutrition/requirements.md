---
feature: "mobile-canvas-nutrition"
status: approved
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
`violet`), `MOTION_RISE_OFFSET_Y` y `MOTION_RISE_TIMING`
(`src/theme/motion.ts`), los tokens `--leading-body` y `--leading-note`
(`leading-body`, `leading-note`), `tracking-title`, `ScreenHeader`
(`src/components/screen-header.tsx`, props
`{ testID, backFallback, title?, eyebrow?, size?: 24 | 26, accessory? }`,
testIDs `${testID}`, `${testID}-back`, `${testID}-title`) y `RiseIn`
(`src/components/rise-in.tsx`, #197 R24:
`RiseIn({ delayMs, testID, className, children })`, `Animated.View` con
`entering` de `withDelay(delayMs, withTiming(…, MOTION_RISE_TIMING))` y sin
`entering` con «reducir movimiento»). #197 aún no está en `dev` (base de este
worktree `71ff81a1`): las anclas que #197 mueve llevan
`(#197: antes → después)` en § Base medida y el leader las re-mide tras su
merge, antes del handoff.

**Solo depende de #197.** #200 corre en paralelo con #199
(`mobile-canvas-health-weight`) y no consume nada que #199 cree, ni de
producción ni de tests: el doble de `rise-in` y el helper `riseDelayOf` son
locales a los tests de #200. Donde las dos tocan el mismo fichero (`motion.ts`
y MT, `_layout.tsx` y LY, listas de inventario), cada cifra se da como «base
tras #197 + delta de #200» y, si #199 ya está en `dev`, se le suma su delta;
la segunda feature en mergear conserva las entradas que añadió la primera.

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
`MH=src/screens/meals-history/index.tsx`. Las marcas `(#197: antes → después)`
son anclas que #197 mueve antes que #200; el leader las re-mide tras su merge
y antes del handoff. Cada «Tras #200» es «base tras #197 + delta de #200»; si
#199 ya está en `dev`, súmale su delta donde la fila lo indique.

| # | Comando | Hoy | Tras #200 |
|---|---|---|---|
| B1 | `test ! -e src/screens/food && echo ausente` | ausente | presente (R1) |
| B2 | `grep -c '' "$F"` | 468 | ≤ 5 (R1) |
| B3 | `test -e "src/app/(tabs)/__tests__/food.test.tsx" && echo presente` | presente | ausente; vive en `src/screens/food/index.test.tsx` (R1) |
| B4 | `grep -cF "src/app/(tabs)/food.tsx'" src/__tests__/ui-copy-table.ts` | 25 | 0 (R1) |
| B5 | `grep -cF "src/screens/food/index.tsx'" src/__tests__/ui-copy-table.ts` | 0 | 25 (R1) |
| B6 | `grep -cF '<Card' "$F"` | 6 | 0 en `$FS` (R3, R5, R7, R8, R9) |
| B7 | `grep -cF "from '../../components/card'" "$F"` | 1 | 0 en `$FS` |
| B8 | `grep -cF 'style={CONTINUOUS_CORNER}' "$F"` | 1 (la fila de comida) | 6 en `$FS`; escalera por commit verde 1, 2, 2, 3, 4, 6 (R5 +1; R6 0 neto: la fila pierde el suyo y el tile lo gana; R7 +1; R8 +1; R9 +2) |
| B9 | `grep -cF 'text-accent-strong' "$F"` | 1 (insignia «servida») | 1 en `$FS` (`food-meals-progress`); 2 entre el verde de R5 y el de R6, que retira la insignia (§ Candados [47]) |
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
| B20 | `grep -cF 'headerShown' src/app/_layout.tsx` | 2 (#197: 2 → 2) | 4 (R12 +1, R13 +1); si #199 ya está en `dev`, 5 (#199 suma 1) |
| B21 | `grep -cF "name=\"meal-schedule\" options={{ ...headerOptions, title: '' }}" src/app/_layout.tsx` | 1 | 0 (R12) |
| B22 | `grep -cF "name=\"meals-history\" options={{ ...headerOptions, title: '' }}" src/app/_layout.tsx` | 1 | 0 (R13) |
| B23 | `grep -cF 'HomeEntrance' $MS` / `$MH` | 5 / 5 | 0 / 0 (R15) |
| B24 | `grep -cF 'meal-schedule-heading' $MS` / `meals-history-heading` en `$MH` | 1 / 1 | 0 / 0 (R12, R13) |
| B25 | `grep -cF 'paddingBottom: insets.bottom + 24' $MS` / `$MH` | 1 / 1 | 0 / 0; `insets.bottom + 32` 1 / 1 (R12, R13) |
| B26 | `grep -cF '<ScreenHeader' $MS` / `$MH` | 0 / 0 | 1 / 1 (R12, R13) |
| B27 | `grep -cF 'chunkyLip.violet' $MS` | 0 | 1 (R14) |
| B28 | `ls src/components \| grep -cF 'rise-in.tsx'` | 0 (#197: 0 → 1, #197 R24) | 1; #200 no lo crea |
| B29 | `ls src/components \| grep -cF 'screen-header.tsx'` | 0 (#197: 0 → 1) | 1; #200 no lo crea |
| B30 | `grep -cF -- '--leading-note' src/theme/global.css` | 0 (#197: 0 → 1) | 1; #200 no lo crea |
| B31 | `grep -cF 'Enmienda #200' ../docs/ui-guidelines.md` | 0 | ≥ 1 (R16) |
| B32 | `test ! -e src/__tests__/nutrition-canvas-fidelity.test.ts && echo ausente` | ausente | presente (R16) |
| B33 | `cat src/__tests__/canvas-foundations.test.ts 2>/dev/null \| grep -cF '#197 R20: cimientos sin cablear'` | 0 (#197: 0 → 1) | 0 (R10, § Candados [49]) |
| B34 | `cat src/__tests__/canvas-foundations.test.ts 2>/dev/null \| grep -cF "'app/(tabs)/food.tsx'"` | 0 (#197: 0 → 1) | 0 (R1, [43]) |
| B35 | `grep -cF "'app/(tabs)/food.tsx'," src/__tests__/alerts-canvas-fidelity.test.ts` | 0 (#197: 0 → 1) | 0 (R1, [42]) |
| B36 | `grep -cF 'export const MOTION_' src/theme/motion.ts` | 35 (#197: 35 → 37) | 39 (R4 +2); si #199 ya está en `dev`, súmale su delta (+7) |
| B37 | `grep -cF 'sigue sin labio hasta #200' ../docs/ui-guidelines.md` | 0 (#197: 0 → 1) | 0 (R16 (e)) |
| B38 | `grep -cF 'sigue sin labio hasta #200' src/__tests__/chunky-cta-canvas-fidelity.test.ts` | 0 (#197: 0 → 1) | 0 (R16, [48]) |
| B39 | `grep -cF 'sigue sin labio hasta #200' src/__tests__/design-drift.test.ts` | 0 (#197: 0 → 1) | 0 (R16, [48]) |

Si tras el merge de #197 cualquier fila marcada no da su valor «después», el
leader corrige la cifra aquí antes del handoff; las demás filas no dependen
de ella. Si #199 ya está en `dev` cuando se mide, se le suma su delta en las
filas que lo dicen (B20, B36); ninguna otra fila depende de #199.

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

**Dobles comunes.** FO, MS y MH sustituyen, cada uno con su propio
`jest.mock` (`'../../components/rise-in'` desde `src/screens/<pantalla>/`),
el `RiseIn` de #197 R24 por un `View` anfitrión que conserva `testID`,
`className` y `children` y expone `delayMs` como prop del anfitrión (un solo
nivel, como el `Animated.View` real). Cada uno de esos tres ficheros declara su
helper local `riseDelayOf(node)`, que sube por `.parent` desde `node` (incluido)
hasta el primer nodo con `props.delayMs !== undefined` y devuelve ese valor, o
`undefined` si no hay ninguno. Nada de esto se importa de tests de otra
feature (en particular, de #199): el `RiseIn` real lo prueba RI
`src/components/__tests__/rise-in.test.tsx` de #197 R24. FO añade
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

**Enmendado por #222 (C4)**: food-title-row y food-title desaparecen; el selector avatars vive en la cabecera fija food-pet-header (#222 R4).

WHEN Nutrición se pinta en cualquier rama THE SYSTEM SHALL usar en el
`ScrollView` `screen-food` el `contentContainerStyle`
`{ paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96, gap: 14 }`
(canvas `padding: 60px 20px 120px`), sin `padding`. WHEN hay mascotas THE
SYSTEM SHALL pintar `View` `food-title-row` con className exacta
`flex-row items-center justify-between`, cuyo primer hijo es `food-title` y el
segundo `<PetSwitcher variant="avatars" … />` (componente consumido sin
cambios, mismas props de selección que hoy); WHEN no hay mascotas la fila
contiene solo `food-title`. WHEN hay mascota seleccionada THE SYSTEM SHALL dar
al `View` que envuelve su contenido (hoy `className="gap-4"`, padre de
`food-plan-card` o de `food-plan-empty` y de los enlaces) la className exacta
`gap-3.5` (canvas `gap: 14px`), sin añadir ni quitar niveles; el `View` de los
esqueletos conserva `gap-4`.

- Test: FO `#200 R2: el marco es el del canvas` — con el doble de insets
  `{ top: 40, bottom: 24 }`, `contentContainerStyle` es `toEqual`
  `{ paddingHorizontal: 20, paddingTop: 52, paddingBottom: 120, gap: 14 }`.
- Test: FO `#200 R2: los avatares comparten fila con el título` — con dos
  mascotas, `food-title-row` tiene la className exacta, su primer hijo es
  `food-title` y `within(food-title-row).getAllByTestId(/^pet-chip-/)` da
  `['pet-chip-pet-1', 'pet-chip-pet-2']`.
- Test: FO `#200 R2: sin mascotas la fila solo lleva el título` — rama vacía:
  `within(food-title-row).queryAllByTestId(/^pet-chip-/)` vacío.
- Test: FO `#200 R2: el contenido de la mascota se separa 14 como el canvas` —
  con plan `{ kind: 'not-found' }`,
  `getByTestId('food-plan-empty').parent?.props.className` es `'gap-3.5'`.

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
que hoy. Cada `Pressable` lleva su className y su `style` como literales
propios en `$FS` (sin constante compartida): `rounded-16` aparece 2 veces y
`style={CONTINUOUS_CORNER}` suma 2 (B8, § Candados [35]). Dentro: `View className="flex-1 gap-0.5"` con el título
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
`RiseIn` (`src/components/rise-in.tsx`, de #197 R24; #200 no lo modifica) con
estos `delayMs` (canvas `animation: rise 400ms ease-out <n>ms both`). WHEN no
hay plan cargado THE SYSTEM SHALL pintar `food-links` sin envolver en
`RiseIn` (los estados que el canvas no dibuja no cambian):

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
- Test: FO `#200 R10: sin plan los enlaces no entran con RiseIn` — con plan
  `{ kind: 'not-found' }`, `riseDelayOf(getByTestId('food-links'))` es
  `undefined`.

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
- Test: LY `#200 R13: meals-history oculta la cabecera nativa` — mismo acceso
  a `options` por `name` que LY `#200 R12`; las opciones son
  `toEqual({ headerShown: false })`.

### R14 — «Generar plan» con labio violeta

WHEN se pinta `generate-plan-button` THE SYSTEM SHALL añadir
`style={chunkyLip.violet}` al `Button` existente, sin cambiar su className ni
su `variant` (canvas `box-shadow: 0 4px 0 rgba(91,63,163,0.35)`). `chunkyLip`
es la constante `const chunkyLip = useChunkyLip();` que #197 R10 ya deja en
`$MS`: no se declara otra (CC `#177 R7.4` exige exactamente una).

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
Historial entran con `RiseIn` y los retardos de R10 y R15 (es la enmienda que
el punto 4 de la Enmienda #197 exige a todo otro uso del timing de `rise`);
(b) el anillo de Nutrición anima con `MOTION_RING_TIMING` y
`MOTION_RING_DELAY_MS`; (c) frase por feature para `rounded-24` (tarjeta de
comidas) y `rounded-16` (enlaces); (d) héroe, comidas, avisos, IA y enlaces de
Nutrición son `View`/`Pressable` con clases propias, no `Card`. Además, (e) en
el punto 13 de la carta, la línea `- **Secundarios de Horario**` (la que hoy
acaba en «… sigue sin labio hasta #200.») sustituye su cola
``«Generar plan» es tonal de la categoría violeta y sigue sin labio hasta #200.``
por, literal,
``«Generar plan» es tonal de la categoría violeta con `style={chunkyLip.violet}` (#200 R14).``;
el resto de la línea no cambia. Y SHALL existir NC con una fila por literal:

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
- Test: NC `#200 R16: la carta da a «Generar plan» su labio violeta` —
  `../docs/ui-guidelines.md` contiene la cola nueva de (e) y no contiene
  `sigue sin labio hasta #200`.

### R17 — Guardas de la carta en los ficheros tocados

THE SYSTEM SHALL mantener en `$FS`, `$MS`, `$MH` y sus tres tests: cero
`StyleSheet` y cero clases con valor arbitrario (`/\b[\w-]+-\[/`); en `$FS`,
`$MS` y `$MH` (producción), además, cero literales hex salvo `#NNN R<n>`
(`/#[0-9a-fA-F]{3,8}\b(?!\s+R\d)/`); y `$FS` no importa `components/card`.

Errata del leader (2026-10-23, P2 del handoff): la guarda hex no recorre los
tres tests. En H0 ya citan `#106`, `#106/#107`, `#113` y `#147 E…` en títulos y
comentarios, y `meal-schedule/index.test.tsx` tiene un `'#000000'` de doble;
nada de eso es color de producción. Esas líneas no se tocan.

- Test: NC `#200 R17: %s no usa StyleSheet ni corchetes` — `it.each` con una
  fila por fichero (seis filas).
- Test: NC `#200 R17: %s no usa hex salvo #NNN R<n>` — `it.each` con las tres
  fuentes de producción (tres filas).
- Test: NC `#200 R17: Nutrición no importa Card` — `$FS` sin
  `components/card`.

## Candados que la feature revierte

Inventario cerrado, hallado con `git grep -nF '<literal viejo>'` sobre
`71ff81a1` y seguido por constantes, helpers y tablas `it.each` hasta cada
`it`; las filas 31–50 añaden los candados agregados de la auditoría y los que
crea #197 (medidos en su rama, `f408dbf2`). Cada `it` tocado lleva el sufijo `(enmendado por #200 R<n>)` en su
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
14. Retirado (auditoría S1). FO `#168 R10 › la llamada de 50 respeta
    ReduceMotion.System` y `› acota la llamada a 100 aunque el texto diga
    150%` buscan la llamada por valor, no por índice, y siguen en verde con
    `withDelay(200, withTiming(…, MOTION_RING_TIMING))`: no se enmiendan.
15. FO `#168 R8 › la pista tiene exactamente su receta de Circle`:
    `strokeOpacity: 0.2` → `0.22`.
16. MT `no exporta nada más (enmendado por #195 R13) (enmendado por #197 R11)`
    (título tras #197): la lista ordenada de #197 (37 claves) gana
    `MOTION_RING_DELAY_MS` y `MOTION_RING_TIMING` en su posición de `.sort()`
    (verificar con `node -e`), 39 claves. #199 R27 añade a la misma lista
    siete claves en paralelo: si #199 ya está en `dev`, la base es la suya
    (44) y el esperado 46; la segunda feature en mergear conserva las claves
    de la primera.

**R5–R9 (tarjetas de Nutrición)**

17. FO `#62 R5 › aplica la receta canónica al título %s`: cada fila se
    enmienda en su R — `food-meals-title` (R5), `food-ai-title` (R8),
    `meal-schedule-link-title` (R9).
18. `consistency-classnames.test.ts` `#98 R10 › deja CONTINUOUS_CORNER…`
    (`food.match(/style=\{CONTINUOUS_CORNER\}/g)` y la cuenta global) y
    `#62 R14` `directUses` de food: cada R enmienda lo suyo en su commit rojo
    — R5 +1, R7 +1, R8 +1, R9 +2 — y la escalera de food por commit verde es
    1, 2, 2, 3, 4, 6 (B8). R6 es neto 0 (el `style={CONTINUOUS_CORNER}` de la
    fila de comida desaparece y el de `meal-tile-${index}` lo sustituye): R6
    no enmienda esta fila. La cuenta global sube igual (+5 al final). La cuenta
    de `text-accent-strong` del mismo `it` es la fila [47].
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
22. Retirado (auditoría S2). FO `R6 › shows the AI recommendation only when
    the explanation is present` no aserta nada del icono: sigue en verde.
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
    acordadas`: sale la fila `['meal-schedule', '']` (R12); la aserción nueva
    de `meal-schedule` es LY `#200 R12`. Y LY `#105 R8 › declara meals-history
    como decimotercer hijo con cabecera nativa` (R13) pasa a titularse
    `declara meals-history como decimotercer hijo sin cabecera nativa
    (enmendado por #200 R13)`: conserva la comprobación del índice 12
    (`[Stack.Screen, 'meals-history']`) y su segunda aserción pasa de
    `toMatchObject({ headerShown: true, title: '' })` a
    `toEqual({ headerShown: false })`. #199 R1 enmienda en paralelo el mismo
    `it.each` `#194 R4` (su propia fila y su sufijo): la segunda feature en
    mergear conserva las filas que quitó la primera y los dos sufijos.

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

**Filas 31–50 (auditoría `progress/inventory-audit_mobile-canvas-nutrition.md`
F1–F13 y O2, y candados que crea #197).** «Hoy» es el estado tras el merge de
#197 (las filas que #197 no toca dicen lo mismo en `71ff81a1`). Las listas
ordenadas se reordenan con `.sort()` y la posición se verifica con `node -e`.
Alias: **CC** `src/__tests__/chunky-cta-canvas-fidelity.test.ts`, **CN**
`src/__tests__/consistency-classnames.test.ts`, **LG**
`src/__tests__/legibility-classnames.test.ts`, **DD**
`src/__tests__/design-drift.test.ts`, **AC**
`src/__tests__/alerts-canvas-fidelity.test.ts`, **PC**
`src/__tests__/profile-canvas-fidelity.test.ts`, **CF**
`src/__tests__/canvas-foundations.test.ts` (llega con #197).

| # | fichero › describe › it | hoy afirma | pasa a afirmar | R |
|---|---|---|---|---|
| 31 (F1) | FO › `#155 R4: Comida sin mascotas presenta a Pingo` › `queda en el sitio del vacío que sustituye` | hermanos de `food-empty`: `['food-title', 'food-empty']` | `['food-title-row', 'food-empty']` | R2 |
| 32 (F2) | FO › `#155 R9: sin plan de comidas, Pingo enseña el cuenco` › `queda en el sitio del vacío que sustituye` | hermanos de `food-plan-empty`: `['food-plan-empty', 'meal-schedule-link', 'meals-history-link']`; `slot.parent?.parent?.parent` es `screen-food` | `['food-plan-empty', 'food-links']`; la cadena de tres padres hasta `screen-food` no cambia (R2 conserva el `View` envoltorio con `gap-3.5` y R10 no envuelve `food-links` sin plan) | R9 |
| 33 (F3) | CC › `#177 R7.4: solo la definición y los diecisiete consumidores usan el hook (enmendado por #197 R10)` (y, por la misma constante, `#177 R12.1/R12.2` y `#177 R12.3`) | `consumers` = `ctaFiles` + reminders, alerts y meal-schedule | `consumers` gana `'screens/food/index.tsx'`; R7.4 exige en `$FS` exactamente un `const chunkyLip = useChunkyLip();` y R12.1/R12.2/R12.3 pasan a recorrer `$FS` (en verde si R17 se cumple: sin corchetes de clase, sin hex, sin `StyleSheet` ni sombras, sin `#177` suelto). Si #199 añade consumidores en paralelo, la segunda en mergear conserva los de la primera | R3 |
| 34 (F4) | CC › `#177 R7.5: inventario de los tres estilos y el tile (…)` › tercera expectativa | `inventory(/style=\{chunkyLip\.primaryCompact\}/g)` `toEqual({ 'screens/reminders/index.tsx': 1 })` | `toEqual({ 'screens/food/index.tsx': 1, 'screens/reminders/index.tsx': 1 })`; `#177 R8.1`, `#177 R3.3` y la fila `primaryCompact` de ids no cambian (`meal-pending-${index}` es `View`, no `Button`) | R6 |
| 35 (F5) | CC › `#177 R7.3: inventario de los veintisiete radios de dieciséis (…)` | `inventory(/\brounded-16\b/g)` `toEqual(radii)`; `count(…)` `toBe(26 + 1 + 1 + 1 + 2)` | `radii` gana `'screens/food/index.tsx': 2` y la cuenta `+ 2 // #200 R9` (dos literales, R9) | R9 |
| 36 (F6) | CC › `#177 R6.2: recuentos de etiquetas (…)` | `count(/text-17/g)` `toBe(8 + 15 + 1 + 1 + 1 + 1)` y `count(/text-17 font-extrabold text-foreground/g)` `toBe(3 + 3)` | las dos ganan `+ 1 // #200 R5` (`food-meals-title`); las otras cuatro expectativas no cambian | R5 |
| 37 (F7) | DD › `#179 R13: Horario e Historial fieles al canvas` › `sitúa el título antes del resumen y los errores antes de las acciones` | ancla `testID="meal-schedule-heading"` en la lista de anclas y en el `indexOf` frente a `meal-schedule-summary` | ancla `testID="meal-schedule-header"` en los dos sitios, mismo orden | R12 |
| 38 (F8) | DD › `#179 R13: …` › `limita text-22 a Horario y text-17 al inventario de E1.2 (enmendado por #177 R10)` | lista de `text-17` sin food | gana `'screens/food/index.tsx'` entre `'screens/edit-profile/index.tsx'` y `'screens/forgot/index.tsx'`; MS sigue en la lista | R5 |
| 39 (F9a) | AC › `#174 R12: inventarios` › `limita $token a su inventario de producción (…)`, fila `tracking-caps` | `['screens/alerts/index.tsx', 'screens/meal-schedule/index.tsx']` | gana `'screens/food/index.tsx'` entre las dos | R3 |
| 40 (F9b) | AC › mismo `it.each`, fila `text-15` | lista de 14 sin food | gana `'screens/food/index.tsx'` entre `'screens/docs/index.tsx'` y `'screens/forgot/index.tsx'` | R5 |
| 41 (F9c) | AC › mismo `it.each`, fila `tracking-title` | incluye `'screens/meal-schedule/index.tsx'` y `'screens/meals-history/index.tsx'` (sus encabezados) | sin `meal-schedule` (R12) y sin `meals-history` (R13); `'components/screen-header.tsx'` sigue | R12, R13 |
| 42 (#197 R4) | AC › mismo `it.each`, fila `tracking-title` | `'app/(tabs)/food.tsx'` en primera posición (B35) | `'screens/food/index.tsx'` entre `'screens/docs/index.tsx'` y `'screens/geofence-editor/index.tsx'` | R1 |
| 43 (#197 R4) | CF › `#197 R4: ningún fichero de producción usa tracking-tight` › bucle de ficheros | lee `'app/(tabs)/food.tsx'` y exige `text-3xl font-black tracking-title text-foreground` (B34) | lee `'screens/food/index.tsx'`; misma aserción | R1 |
| 44 (F10) | PC › `#173 R4: avatars solo en Perfil` › `limita la variante nueva al consumidor Perfil` | `filesMatching(/variant="avatars"/)` `toEqual(['screens/profile/index.tsx'])` | `toEqual(['screens/food/index.tsx', 'screens/profile/index.tsx'])`; si #199 añade otro consumidor en paralelo, la segunda en mergear lo conserva | R2 |
| 45 (F11) | PC › `#173 R2: inventario de radios nuevos` › `reserva rounded-hero al Card compartido y el skeleton de Perfil` | `['components/card.tsx', 'screens/alert-detail/index.tsx', 'screens/profile/index.tsx']` | gana `'screens/food/index.tsx'` entre `alert-detail` y `profile` | R3 |
| 46 (F12) | PC › `#173 R2.4: inventario de tamaños nuevos` › `limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8) (enmendado por #189 R6)` | lista sin food | gana `'screens/food/index.tsx'` entre `'screens/edit-profile/index.tsx'` y `'screens/forgot/index.tsx'` | R8 |
| 47 (F13) | CN › `#98 R10 › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban` › `food.match(/text-accent-strong\b/g)` ; LG › `#61 R4: el acento como tinta usa accent-strong` › fila de food de `inkSites` (`%s pinta con text-accent-strong (%i)`) y `suma las trece ocurrencias que enumera la spec` | food = 1 (la insignia «servida» vieja); suma sin término de #200 | **en el commit rojo de R5**: CN `toHaveLength(1 + 1) // #200 R5`, fila de food `1 + 1 // #200 R5` y la suma `+ 1 // #200 R5` (R5 añade `food-meals-progress` mientras la insignia vive hasta R6); **en el commit rojo de R6**: `1 + 1 - 1 // #200 R5; #200 R6` en las dos y la suma `- 1 // #200 R6` (R6 retira la insignia). Al final, food = 1 | R5, R6 |
| 48 (O2) | CC › `#177 R11.1: la carta declara la receta global y conserva sus excepciones (enmendado por #197 R21)` (constante `preservedLines`) y DD › `sitúa la receta de secundarios de Horario antes de Sin labio (enmendado por #197 R21)` (constante `actionRule`) | la línea `- **Secundarios de Horario**` acaba en `«Generar plan» es tonal de la categoría violeta y sigue sin labio hasta #200.` (B38, B39) | la misma línea con la cola de R16 (e): ``«Generar plan» es tonal de la categoría violeta con `style={chunkyLip.violet}` (#200 R14).`` | R16 |
| 49 | CF › `describe('#197 R20: cimientos sin cablear')` entero: `nadie monta todavía los cimientos %s` (4 casos: `toggle-switch`, `screen-header`, `shadows`, `rise-in`) y `el layout raíz no cambia` | cero importadores de producción de los 4 módulos; `headerShown` ×2 en `_layout.tsx` (B33) | el `describe` se **borra entero** en el commit rojo de R10 (el primero que monta `RiseIn`; R12 toca `_layout.tsx` después). Es un candado temporal de #197 que la ola 2 retira con el mismo borrado en todas sus features, para que git lo mezcle sin conflicto; no se sustituye por nada (regla del leader, 2026-10-23) | R10 |
| 50 | LY › `#95 R4: cada pantalla de detalle declara su cabecera nativa` › `#194 R4: %s usa exactamente las opciones de cabecera acordadas` | incluye la fila `['meal-schedule', '']` | sin esa fila (item 27); #199 R1 quita en paralelo la suya y la segunda feature en mergear conserva las dos bajas y los dos sufijos | R12 |
| 51 (P1 del handoff; errata del leader 2026-10-23) | CN › `#62 R14` › `fusiona la esquina una vez y la entrega a las dos ramas de Card (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9)`: suma `style={CONTINUOUS_CORNER}` sobre la misma constante `directUses` que [18] | `.toBe(…)` = 42 | en el commit rojo de cada R, el `.toBe(…)` gana un término: R5 `+ 1 // #200 R5` (43), R7 `+ 1 // #200 R7` (44), R8 `+ 1 // #200 R8` (45), R9 `+ 2 // #200 R9` (47); R6 no lo toca. Sufijo como el resto del inventario | R5, R7, R8, R9 |
| 52 (errata del leader 2026-10-23, tras la parada de Codex en R3) | HT (`src/__tests__/heroui-text-size-merge.test.ts`) › `#187 R1: ningún componente que fusiona className lleva text-NN` › `#187 R1: el escáner cubre al menos el universo medido (enmendado por #177 R9) (enmendado por #189 R5, R10, R13)` | `cardElements` `toBeGreaterThanOrEqual(41)`; `heroElements` ≥ 197, `classNameElements` ≥ 163, ficheros con hero ≥ 28 | cada `<Card` de Food que sale baja el suelo de `cardElements`: R3 `41 → 40`, R5 `→ 39`, R7 `→ 38`, R8 `→ 37`, R9 `→ 35`, con su término al final del comentario de esa línea (`; #200 R3: -1`, `; #200 R5: -1`, …). Los otros tres suelos solo se tocan si se ponen rojos, y entonces bajan exactamente al valor recibido, con su término en el comentario. Sufijo ` (enmendado por #200 R3)` tras el de #189; cada R siguiente añade su id al mismo paréntesis (`#200 R3, R5`, …). El de R3 va en un commit propio `test(#200): R3 lower the Card floor of the HeroUI scanner` antes de R4, porque los commits de R3 ya existen; los demás, en el commit rojo de su R | R3, R5, R7, R8, R9 |
| 53 (errata del leader 2026-10-24, tras la parada de Codex en R9) | DD (`src/__tests__/design-drift.test.ts`) › `#178 R13: Recordatorios sin deriva` › `reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto (enmendado por #177 R10)` | `rounded16` sin Food | `rounded16` gana `'screens/food/index.tsx': 2, // #200 R9` entre `'screens/edit-profile/index.tsx'` y `'screens/forgot/index.tsx'`; sufijo ` (enmendado por #200 R9)`. Como los commits de R9 ya existen, va en un commit propio `test(#200): R9 amend the rounded-16 inventory of design drift` antes de R10. #198 (K42) y #196 (E1) tocan el mismo `it` en sus branches: quien mergee después conserva todas las entradas y todos los sufijos | R9 |

Regla de parada: un rojo fuera de este inventario detiene la implementación y
se reporta al leader.

**Enmienda mecánica permitida**: si un `it` no inventariado se pone rojo solo porque compara contra el literal exacto que el R-id quita o sustituye (directo o vía constante/helper del test), el implementador lo enmienda en el commit rojo de ese R con el sufijo y lo apunta en la tabla «Enmiendas mecánicas» de su informe. Cualquier otro rojo no inventariado sigue siendo motivo de parada.

## Erratas del leader (2026-10-24)

Firmadas por delegación (mandato del humano del 2026-10-23, `progress/plan_canvas-parity-2026-10-23.md` §4).

**Fila 53 (parada en R9).** Ver la fila 53 del inventario: DD `#178 R13` › `reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto (enmendado por #177 R10)`.

**Regla de recuentos agregados.** Si al llegar a verde una R se pone rojo un `it` que no está en el inventario y ese `it` solo cuenta usos o ficheros de un literal o token, Codex lo enmienda sin parar. Son de este tipo los inventarios cerrados de radios, de `style={CONTINUOUS_CORNER}`, de `text-NN` o de `<Card`, las sumas de copy y los suelos del escáner HeroUI. La condición es que el delta medido sea exactamente el número de usos que el diff de esa R, tal como esta spec la prescribe, añade o retira. La enmienda:

- da a la cifra o a la entrada su término (`// #200 Rn`, o `; #200 Rn: ±k` dentro de un comentario que ya exista);
- da al título el sufijo ` (enmendado por #200 Rn)`, o añade `Rn` al paréntesis de #200 si ya existe;
- va en el commit rojo de esa R; si ese rojo ya está commiteado, en un commit propio `test(#200): Rn amend the <candado> inventory` antes del siguiente R;
- se apunta en la tabla «Enmiendas mecánicas» del reporte con candado, antes, después y R.

El fichero de test de ese candado entra en la lista cerrada solo para esa enmienda. Sigue siendo PARADA si el delta no coincide, si el `it` afirma comportamiento o estructura y no un recuento, o si la enmienda exigiría cambiar producción.

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

- Cambios en `ScreenHeader`, `RiseIn` o `useChunkyLip`: se consumen tal como
  los deja #197 (`RiseIn` es #197 R24). `PetSwitcher`, `EmptyState` y `Card`
  se consumen sin cambios.
- Cualquier pieza de producción o de test que cree #199: #200 no depende de
  ella (corre en paralelo); solo comparte ficheros de inventario con la regla
  de mezcla de § Contexto.
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

- [x] Aprobado por humano (fecha: 2026-10-23)
  Firma delegada en el leader por mandato del humano del 2026-10-23
  (`progress/plan_canvas-parity-2026-10-23.md` §4, checklist de firma pasada).
  Medidas las anclas de §Base medida tras el merge de #197 en `dev` (81cb6d6b): las que mueve #197
  están en su valor «después». El describe CF `#197 R20` se borra entero en el primer rojo que monta
  un cimiento (regla uniforme de la ola 2).
- [x] Enmienda #200 de `docs/ui-guidelines.md` (R16: entrada con `RiseIn`, anillo con `MOTION_RING_*`, `rounded-24` y `rounded-16`, superficies de Nutrición sin `Card`, y «Generar plan» con `chunkyLip.violet` en el punto 13) aprobada por humano
  Firma delegada, mismo mandato.
- [ ] Smoke de R2, R3, R4, R6, R7, R10, R12, R13, R14 y R15 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
  Va en el lote `progress/smoke_canvas-parity.md` (plan §6); el `done` no espera al smoke.

## Enmienda #222 — avatares fijos y sin título en las pestañas

`mobile-tab-avatar-header` (#222) modifica una decisión que esta spec dejó
aprobada. La spec de origen es `specs/mobile-tab-avatar-header/`; el detalle
de la enmienda está en su `requirements.md` §R11.

- Spec enmendada: `mobile-canvas-nutrition`
- Qué cambia: `R2: Nutrición sin fila de título, con cabecera fija de avatares`
- Qué NO cambia: ningún otro requisito de esta spec ni su estado de
  aprobación. Los tests que cubren lo enmendado se reescriben en #222 (lista
  en su `requirements.md` §R9 y en su `tasks.md`).

- [ ] Enmienda #222 aprobada por humano
