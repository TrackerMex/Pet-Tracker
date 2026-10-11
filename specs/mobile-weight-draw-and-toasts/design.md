---
feature: "mobile-weight-draw-and-toasts"
status: spec_ready     # draft | spec_ready | approved
tags: [mobile, ui, motion, spec]
---

# Diseño — [[mobile-weight-draw-and-toasts]] (#169)

> Ver [[requirements]]. Base medida: 89fe2009. Solo capa móvil
> (`mobile-pet-tracker/`). Backend, infraestructura y AWS: sin cambios.
> Rige `docs/ui-guidelines.md` (carta C8). Skills del lado de Claude:
> `expo:expo-overview`, `expo:expo-animation` y `expo:expo-native-ui`. Para
> Codex, el leader nombra en el handoff los equivalentes de su catálogo
> (`.claude/agents/leader.md` §Catálogo real de skills de Codex).

## Decisiones técnicas

### D1 — El dibujo es `strokeDasharray` + `strokeDashoffset` sobre la polilínea

- `const AnimatedPolyline = Animated.createAnimatedComponent(Polyline)` y
  `const AnimatedG = Animated.createAnimatedComponent(G)`, a nivel de módulo
  en `weight-chart.tsx`.
- `L = Σ Math.hypot(x[i+1] − x[i], y[i+1] − y[i])` sobre los puntos que la
  gráfica ya calcula (x = `index/(n−1)·100`; y = `36 − ((w−min)/range)·32`, o
  `20` si `range === 0`). Con `preserveAspectRatio="none"` el trazo se escala
  pero las longitudes del guion se miden en unidades de usuario a lo largo del
  path, así que `L` en unidades del `viewBox` es exacto. **No** se añade
  `vectorEffect`: cambiaría las unidades del guion.
- `strokeDasharray={[L, L]}` es una prop estática. La prop animada es
  `useAnimatedProps(() => ({ strokeDashoffset: L * (1 - progress.get()) }))`.
- Los `Circle` pasan a ser hijos de `<AnimatedG testID="weight-chart-points" animatedProps={pointsProps}>`,
  con `useAnimatedProps(() => ({ opacity: progress.get() }))`.
- El `Polygon` del área y el `LinearGradient` no cambian.

### D2 — Un componente interno monta el dibujo solo con 2 o más entradas

Los hooks no pueden ir después del `return` temprano de `weight-chart-empty`.
`WeightChart` conserva ese `return` y delega el dibujo en una función **no
exportada** `WeightChartPlot({ entries })` del mismo fichero, que se monta solo
con 2 o más entradas. Eso da R4 sin lógica extra:

- R4a: cambiar las entradas no desmonta `WeightChartPlot`, así que el efecto
  no vuelve a correr;
- R4b y R4c: pasar de menos de 2 a 2 o más monta `WeightChartPlot` de nuevo.

### D3 — Curva y duración: `MOTION_FILL_TIMING` existente

La carta dice «timings solo para opacidad/color» y reserva los springs para
elementos que entran, salen o responden a un gesto. El trazo no es ninguna de
las dos cosas: es un relleno que avanza, el mismo caso que la barra de batería
del collar (#152 R8, `src/screens/home/collar-battery-bar.tsx`), que ya usa
`withTiming(pct, MOTION_FILL_TIMING)`. Se reutiliza ese preset (250 ms,
`Easing.bezier(0.77, 0, 0.175, 1)`, `ReduceMotion.System`). No hay token
nuevo, así que `motion.ts` y `motion.test.ts` no se tocan. Un spring haría
rebasar el trazo (`strokeDashoffset` negativo, un guion fantasma).

### D4 — Reduce motion, como la barra de batería

```
const reducedMotion = useReducedMotion();
const progress = useSharedValue(reducedMotion ? 1 : 0);
useEffect(() => {
  if (!reducedMotion) progress.set(withTiming(1, MOTION_FILL_TIMING));
}, [progress, reducedMotion]);
```

Es pseudocódigo de intención, no código a calcar. Con `reducedMotion` estable,
las dependencias no cambian y el efecto corre una sola vez por montaje de
`WeightChartPlot`.

### D5 — El delta del mes es una utilidad pura en `src/utils/`

Va en `src/utils/monthly-weight-delta.ts`, junto a `civil-today-iso.ts`, con su
test coubicado `src/utils/monthly-weight-delta.test.ts`. Recibe `todayIso` ya
resuelto, así que no lee ni la hora ni la zona. La pantalla le pasa
`civilTodayIso(profileTimeZone)`, la misma expresión que ya usa para la fecha
por defecto (#90 R3/R4).

- Techo conocido: la lista trae como mucho el límite por defecto de la API. Si
  el último peso anterior al mes queda fuera, la base cae al peso más viejo del
  mes.
- Las comparaciones son de cadenas `YYYY-MM-DD`, válidas porque `measuredAt`
  es una fecha civil.

### D6 — El resumen vive en la card de la gráfica

- `<Card testID="weight-chart-card" className="gap-4">`. `Card` mezcla
  className con `twMerge`, así que `rounded-card` se conserva (#62 R9 sigue
  verde).
- `weight-summary` es su primer hijo. Contiene `weight-current` y, cuando hay
  delta, la fila `weight-month-delta`.
- Los colores de icono salen de la llamada que ya existe:
  `useThemeColors(['success', 'danger', 'muted'])`. No se pide `'accent'`, que
  está vetado por la guarda #61 R4.

### D7 — Un ayudante local de tono, compartido por filas y resumen

En el paso de refactor de R7 se extrae, en `weight-log/index.tsx` y sin
exportar, una función que, dada `variation: number | null`, devuelve la clase
de texto, la clase de tile y cuál de los tres iconos usar. Así filas y resumen
no pueden divergir.

- Las clases de las filas no cambian: R8 las candada antes del refactor.
- El tile usa `bg-default` para `null` y para `0`.

### D8 — Toast local, sin provider ni fichero nuevo

- Estado `const [toastVisible, setToastVisible] = useState(false)` y
  `const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)`.
- La constante de módulo `const WEIGHT_TOAST_MS = 2500;` no se exporta.
- Mostrar el toast hace tres cosas: `clearTimeout` del timer previo,
  `setToastVisible(true)` y un timer nuevo que lo oculta.
- Un efecto de limpieza hace `clearTimeout` al desmontar. En React 19 eso no es
  observable desde un test; es higiene, no un requisito.
- El toast es el último hijo del `KeyboardAvoidingView` raíz, después del
  `ScrollView`: se pinta encima y no se mueve con el scroll.
- `pointerEvents="none"`: no roba toques al formulario.
- Es una cápsula (`rounded-full`), sin `CONTINUOUS_CORNER` (#62 R14).
- No es un `Button` ni un `Pressable`, y no tiene acción («Deshacer» queda
  fuera de alcance). Así #169 no toca los candados de botones de #166: ni la
  lista cerrada de secundarios neutros (#166 R3) ni el labio de los primarios
  (`border-b-4`, #166 R2, #62 R1 y #98 R10). Ver requirements.md §Candados
  agregados, filas `Button` y `Pressable` en Peso.
- Movimiento: `FadeIn.duration(MOTION_TRANSITION_MS)` /
  `FadeOut.duration(MOTION_FEEDBACK_MS)`. Pasa la puerta de frecuencia de la
  skill expo-animation (un toast es «ocasional»), el propósito es feedback, y
  solo anima opacidad, que es lo que la carta permite con timings.

### D9 — Háptico en el mismo bloque que el toast

Dentro de `case 'ok':`, antes de `weights.refetch();`, se muestra el toast y se
llama a `void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);`.
Es la misma forma que en `src/app/(tabs)/food.tsx`, sin condicional de
plataforma. Cumple las tres reglas de la carta: el mismo frame que el visual,
uno por acción del usuario y nunca el único feedback.

## Archivos afectados (capa móvil)

| Fichero | Cambio | R |
|---|---|---|
| `src/components/weight-chart.tsx` | `WeightChartPlot`, `AnimatedPolyline`, `AnimatedG`, `progress`, reduce motion | R1–R4 |
| `src/components/__tests__/weight-chart.test.tsx` | doble de Reanimated, `G` en el doble de svg, describes `#169 R1`–`R4` | R1–R4 |
| `src/utils/monthly-weight-delta.ts` (nuevo) | `monthlyWeightDelta` | R5 |
| `src/utils/monthly-weight-delta.test.ts` (nuevo) | tabla de T5 | R5 |
| `src/screens/weight-log/index.tsx` | testIDs del chip, resumen, tono, toast, háptico | R6–R8, R10–R13 |
| `src/screens/weight-log/index.test.tsx` | dobles de `expo-haptics`, `reicon-react-native` y `use-theme-colors`; describes `#169 R6`–`R8` y `R10`–`R13` | R6–R8, R10–R13 |
| `src/i18n/catalog.ts` | 2 claves × 2 idiomas | R9 |
| `src/providers/__tests__/language-provider.test.tsx` | recuento `+ 2` y literales | R9 |
| `src/__tests__/ui-copy-table.ts` | 2 filas en `R5_HEALTH` | R6, R10 |
| `src/__tests__/ui-language.test.ts` | longitud de `R5_HEALTH` `+ 1 + 1` | R6, R10 |
| `src/__tests__/consistency-classnames.test.ts` | `TABULAR_NUMS` de Peso `2 + 2` y suma `+ 2` | R6 |
| `specs/mobile-ui-language/design.md` | `§2.N — Añadidos por #169 — Peso` | R9 |

**No se tocan:** nada bajo `src/screens/health/` (ni su test), `src/theme/motion.ts`,
`src/theme/__tests__/motion.test.ts`, `package.json` ni `bun.lock`.

## Estrategia de test de la animación (precedentes por fichero)

- **Doble de Reanimated** en `weight-chart.test.tsx`, con la forma de
  `src/screens/home/index.test.tsx`: `{ ...requireActual, __esModule: true, useReducedMotion: () => mockUseReducedMotion(), withTiming: (value, config) => mockWithTiming(value, config) }`.
  Sin `__esModule: true`, el spread pierde la marca y `Animated.View` sale
  `undefined` (precedente #152 E1).
- **`mockWithTiming` tiene dos modos.**
  - Por defecto devuelve `value`: es instantáneo y lleva al estado final.
  - Para el primer frame, `mockImplementation(() => 0)` deja `p` en su origen.
  - El candado contra un doble instantáneo que lo deje ciego es triple:
    identidad del preset (`toBe(MOTION_FILL_TIMING)`), primer frame con el doble
    «origen» y número de llamadas.
- **Lectura de props animadas.**
  - Se lee `getByTestId(...).props.jestAnimatedProps.value` con `toEqual`
    exacto: `{ strokeDashoffset: … }` para la línea y `{ opacity: … }` para los
    puntos.
  - No se usa `toHaveAnimatedProps`, que, como `toHaveAnimatedStyle`, solo mira
    las claves esperadas: una prop colada pasaría en verde.
- **Doble de svg.** Al que ya existe (`Svg` y `Polyline` como `View`) se le añade
  `G` como `View` con props esparcidas y sus `children`, para que
  `weight-chart-points` sea consultable y los `Circle` reales sigan dentro.
- **Sin `advanceTimersByTime` en la gráfica.** El progreso intermedio no se
  candada (lo mismo hace la barra de batería en `home/index.test.tsx`).
- **Ventanas del toast** derivadas de las duraciones reales:
  - el toast se oculta a los 2500 ms y el `exiting` dura `MOTION_FEEDBACK_MS`
    = 150 ms;
  - aserción «visible» a 2400 ms (100 ms de margen ante cualquier avance que
    haga un `waitFor`) y «ausente» a 2650 ms;
  - si hace falta, se amplía la ventana, nunca la aserción.
- **Movimiento del toast (R13).** Es un candado de fuente, con el precedente
  `src/screens/home/weekly-activity-chart.test.tsx` (`describe` R10,
  `toContain` sobre el fuente):
  - el fuente contiene `entering={FadeIn.duration(MOTION_TRANSITION_MS)}` y
    `exiting={FadeOut.duration(MOTION_FEEDBACK_MS)}`;
  - `ReduceMotion.Never` aparece 0 veces en `weight-log/index.tsx`;
  - además, `toast.props.entering` es `toBeInstanceOf(FadeIn)` y
    `toast.props.exiting` es `toBeInstanceOf(FadeOut)`. Sigue el precedente
    `src/screens/home/home-entrance.test.tsx`, que lee `props.entering`.
- **Dobles de `weight-log/index.test.tsx`.**
  - `expo-haptics`: copia intencional del de `src/app/(tabs)/__tests__/food.test.tsx`,
    con `notificationAsync` como `jest.fn` y
    `NotificationFeedbackType: { Success: 'mock-success', Error: 'mock-error' }`.
  - `reicon-react-native`: `...requireActual` más `Minus`, `TrendUp`,
    `TrendDown` y `Check` como `View`, con testID `icon-minus`,
    `icon-trend-up`, `icon-trend-down` e `icon-check` y `style={{ color }}`.
  - `../../theme/use-theme-colors` (ruta medida con
    `grep -cF "from '../../theme/use-theme-colors'" src/screens/weight-log/index.tsx`,
    que da 1):
    devuelve los tokens pedidos mapeados a
    `{ success: 'green', danger: 'red', muted: 'gray', 'accent-strong': 'blue' }`.
    Son nombres CSS válidos, porque `WeightChart` real pinta con ellos.
  - Antes de escribirlos, comprobar los nombres exportados contra el `.d.ts`
    instalado: los dobles se prescriben por intención, no se calcan.

## Tests que se mueven (inventario)

| Suite | Por qué se mueve | Cómo |
|---|---|---|
| `src/components/__tests__/weight-chart.test.tsx` | `Polyline` va envuelto en `createAnimatedComponent` y aparece `G` | doble de Reanimated y `G`; los `it` de #62/R8 (`points`) no cambian |
| `src/screens/weight-log/index.test.tsx` | dobles nuevos a nivel de fichero | los 21 `it` actuales deben seguir verdes sin editarse |
| `src/screens/health/index.test.tsx` | monta `WeightChart` real sin doble de svg ni de Reanimated | **no se edita**. Si se pone rojo, se para y se escala al leader (enmienda); tocarlo rompe el fuera de alcance |
| `src/providers/__tests__/language-provider.test.tsx` | recuento | `+ 2, // #169 R9` |
| `src/__tests__/ui-language.test.ts` + `ui-copy-table.ts` | 2 usos nuevos en Peso | filas y longitud |
| `src/__tests__/consistency-classnames.test.ts` | 2 `TABULAR_NUMS` nuevos | fila de Peso y suma |

## Mediciones pendientes (no se pudieron correr tests al escribir la spec)

`init.sh` estaba corriendo en el worktree. Todo lo anterior está medido con
grep; esto solo se mide corriendo jest. El implementador lo mide en el primer
rojo de cada R y lo apunta en `progress/impl_mobile-weight-draw-and-toasts.md`.

| # | Qué | Si falla |
|---|---|---|
| MP1 | `props.jestAnimatedProps.value` llega al `View` del doble de `Polyline` y de `G` (Reanimated 4.5.1 se lo pasa al componente envuelto) | Leer `toHaveAnimatedProps` con todas las claves esperadas; si tampoco, se para y se escala |
| MP2 | `createAnimatedComponent` sobre los dobles función (`Polyline` y `G` como función) no lanza | Precedente: `weekly-activity-chart.test.tsx` dobla `Rect` como función y producción hace `createAnimatedComponent(Rect)` |
| MP3 | `health/index.test.tsx` y `weight-log/index.test.tsx` siguen verdes con svg y Reanimated reales | Parar y escalar (ver inventario) |
| MP4 | Tras `await fireEvent.press(submit)` con `createWeight` resuelto, `weight-toast` ya está en el árbol sin `waitFor` | `await act(async () => {})` antes de consultar |
| MP5 | `props.entering` / `props.exiting` del `Animated.View` exponen la instancia del builder | Quedarse solo con el candado de fuente de R13 |
| MP6 | Con `exiting`, el nodo sale del árbol en jest dentro de la ventana de 2650 ms | Ampliar la ventana, nunca la aserción |

## Alternativas descartadas

- **Provider global o librería de toasts** (sonner-native, burnt): un solo
  toast en una pantalla no lo justifica, y las dependencias nuevas están
  vetadas.
- **Toast en un fichero propio**: un componente de un solo uso; se queda local
  en `weight-log/index.tsx`.
- **1200 ms + 200 ms del canvas**: fuera de la escala de la carta (P4).
- **Token nuevo `MOTION_DRAW_TIMING` (400 ms, ease-out)**: el preset de relleno
  existente ya describe el caso. Se reconsidera solo si el humano elige 400 ms
  en P4.
- **Spring para el trazo**: el rebase dibuja un guion fantasma.
- **`getTotalLength()` del path**: necesita ref y medida nativa y no existe en
  jest. La suma de segmentos es exacta para una polilínea.
- **Animar el área**: sin propósito nombrable (la carta pide un propósito por
  animación); el área queda quieta.
- **Delta del mes en el backend**: cambia la API, fuera de alcance; el cliente
  ya tiene las entradas.
- **Últimos 30 días en lugar del mes natural**: no coincide con el «este mes»
  del texto (P3).
