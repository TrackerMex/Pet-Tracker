---
feature: "mobile-weight-draw-and-toasts"
status: approved     # draft | approved
tags: [mobile, ui, motion, spec]
---

# Tareas — [[mobile-weight-draw-and-toasts]] (#169)

> TDD C4: cada R tiene un commit rojo (solo tests) y un commit verde
> (implementación), en ese orden y por separado. El refactor, si lo hay, va en
> un tercer commit con la suite verde. Nunca se mezclan implementación y tests
> en un commit.

## Reglas comunes a todas las tareas

- Todos los comandos se lanzan desde `mobile-pet-tracker/`, con un `cd` literal
  en la misma línea (`cd mobile-pet-tracker && bunx jest …`). Se usa bun para
  todo: `bunx`, nunca `npx`.
- Antes del primer typecheck, comprobar `test ! -e .expo/types/router.d.ts`. Si
  existe, hay que parar y avisar: está gitignorado y genera rutas fantasma.
- RNTL 14: `await` en todo `render`, `rerender`, `fireEvent.*` y en cada `act`
  asíncrono.
- Rutas de jest con paréntesis: escapadas (`src/app/\(tabs\)/…`). Ninguna
  tarea de #169 lanza una ruta con paréntesis. `food.test.tsx` solo se lee
  como precedente.
- **Rojo por consulta o por aserción.** Cada rojo dice cuál espera:
  - «por consulta» quiere decir que `getByTestId` lanza `Unable to find an element with testID: …`;
  - «por aserción» quiere decir que falla un `expect`.

  Si el rojo sale de otra clase, hay que parar.
- **Sonda.** Una fila que nace verde por un requisito previo se demuestra con
  una mutación plantada a mano:
  1. se corre la suite y se apunta el rojo (cuántos `it` y de qué clase) en
     `progress/impl_mobile-weight-draw-and-toasts.md`;
  2. se revierte con `git checkout HEAD -- <ruta>` y `git diff --cached --quiet`;
  3. la sonda **no** se commitea.
- **Cierre de cada verde:**

  ```
  cd mobile-pet-tracker && bunx tsc --noEmit && bunx expo lint && bunx jest src/__tests__ src/providers/__tests__/language-provider.test.tsx src/components/__tests__/weight-chart.test.tsx src/screens/weight-log src/screens/health
  ```

  Tras un rojo `Cannot find module`, el lint del verde va con `--no-cache`.
- **Ventanas de tiempo.** Nunca se amplía una aserción. Si una ventana de
  timers no alcanza, se amplía la ventana y se anota en `progress/`.
- **Props animadas (corrección del leader en H0, medida en un spike).** Se leen
  siempre con `?.value` (`props.jestAnimatedProps?.value`), así un rojo antes
  del verde cae por aserción y no por `TypeError`.
  - El **primer frame** (doble `withTiming` que devuelve `0`) y el estado bajo
    **reduce motion** se leen directamente tras el `await render`: los fija el
    render.
  - El **estado final** (doble por defecto) se lee SIEMPRE con
    `await waitFor(() => expect(screen.getByTestId(…).props.jestAnimatedProps?.value).toEqual(…))`,
    re-consultando el nodo dentro del `waitFor`. En jest, Reanimated 4.5.1
    registra el mapper de `useAnimatedProps` con un `setTimeout(0)`
    (`mockedRequestAnimationFrame`), así que tras el `await render` el valor
    final aún no está: leído directamente, el `it` pasa o falla según la carga.
    Es la regla de `docs/conventions.md` §Esperas: la espera termina con la
    misma observación que se aserta.

## Dobles de test (se crean en la tarea que los usa por primera vez)

| Doble | Fichero | Tarea | Forma |
|---|---|---|---|
| Reanimated | `src/components/__tests__/weight-chart.test.tsx` | T1 | `{ ...jest.requireActual('react-native-reanimated'), __esModule: true, useReducedMotion: () => mockUseReducedMotion(), withTiming: (value, config) => mockWithTiming(value, config) }`. En `beforeEach`: `mockUseReducedMotion.mockReturnValue(false)` y `mockWithTiming.mockImplementation((value) => value)` |
| svg: `Polygon` | mismo fichero | T1 | `Polygon` como `View` con las props esparcidas y `testID: 'weight-chart-area'` forzado, igual que `Polyline` (que no cambia y sigue forzando `testID: 'weight-chart-line'`). Se añade al objeto que ya devuelve el doble |
| svg: `G` y `Circle` | mismo fichero | T2 | `G` como `View` con las props esparcidas y `children`, igual que el `Svg` ya doblado. `Circle` como `View` con las props esparcidas y `testID: 'weight-chart-point'` forzado. RNTL 14 no tiene `findAll` ni `UNSAFE_*` en los hosts: los `Circle` se cuentan por ese testID |
| `reicon-react-native` | `src/screens/weight-log/index.test.tsx` | T7 | `...jest.requireActual`, y `Minus`, `TrendUp`, `TrendDown` y `Check` como `Text` de `react-native`. Cada uno tiene su testID (`icon-minus`, `icon-trend-up`, `icon-trend-down`, `icon-check`), `size={size}` y `style={{ color }}`. Enmienda de la Reanudación 2 (2026-10-12): era `View`, pero `{ color }` no cabe en `ViewStyle` y el typecheck falla con TS2769, mientras que `TextStyle` sí lo admite. Cada icono es además una `function MockIcon` con nombre, porque una flecha anónima rompe `react/display-name`. Forma medida por el leader fuera del árbol: typecheck 0, eslint 0 y el rojo de T7 igual (`4 failed, 33 passed, 37 total`, por consulta) |
| `../../theme/use-theme-colors` | mismo fichero | T7 | `useThemeColors: (tokens) => tokens.map((token) => ({ success: 'green', danger: 'red', muted: 'gray', 'accent-strong': 'blue' })[token])`. La firma real (medida por el leader) es `useThemeColors<const T extends readonly string[]>(tokens: T)` y devuelve un array de strings en el mismo orden: el doble encaja tal cual |
| `expo-haptics` | mismo fichero | T10 | `notificationAsync: jest.fn(() => Promise.resolve())` y `NotificationFeedbackType: { Success: 'mock-success', Error: 'mock-error' }`. Es la forma de `food.test.tsx`; se lee con `jest.requireMock` |

## T1 — R1: la línea se dibuja al montarse

- [ ] (1) Rojo. En `src/components/__tests__/weight-chart.test.tsx`, el doble de Reanimated, `Polygon` en el doble de svg y `describe('#169 R1: la línea se dibuja al montarse')` con estos `it`, en este orden de aserciones:
  - **Tres pesos** (la fixture `weight-3/2/1` de 14, 12 y 10 kg que ya usa el `it` de puntos de R8, con puntos `0,36 50,20 100,4`):
    1. `screen.getByTestId('weight-chart-line').props.strokeDasharray` es `[expect.closeTo(104.9952, 3), expect.closeTo(104.9952, 3)]`;
    2. con el doble por defecto, el estado final con `await waitFor(…)`: `jestAnimatedProps?.value` es `toEqual({ strokeDashoffset: 0 })`;
    3. `mockWithTiming` tiene 1 llamada, con `(1, MOTION_FILL_TIMING)`; el segundo argumento se compara con `toBe`.
  - **Primer frame**: con `mockWithTiming.mockImplementation(() => 0)`,
    `jestAnimatedProps?.value` es `toEqual({ strokeDashoffset: expect.closeTo(104.9952, 3) })`, leído directamente.
  - **Dos pesos iguales**: `strokeDasharray` es `[100, 100]` y, en el primer frame, `jestAnimatedProps?.value` es `toEqual({ strokeDashoffset: 100 })`.
  - **El área quieta**: `screen.getByTestId('weight-chart-area').props.jestAnimatedProps` es `toBeUndefined()`.

  Rojo por aserción en los tres primeros (`strokeDasharray` `undefined`; en el
  primer frame, `undefined` contra el objeto). **El área quieta nace verde**: hoy
  el `Polygon` no se anima. Se demuestra con la sonda S1 tras el verde. Commit:
  `test(mobile): la línea de la gráfica de peso se dibuja (#169 R1)`.
- [ ] (2) Verde. En `src/components/weight-chart.tsx`, aplicar D1, D2 y D4 sin
  reduce motion todavía: `WeightChartPlot`, `AnimatedPolyline`, `progress`,
  `L` y el efecto con `withTiming(1, MOTION_FILL_TIMING)`.
  - MP1, MP2 y MP3 los midió el leader en un spike fuera del árbol: `jestAnimatedProps`
    llega al `View` del doble, `createAnimatedComponent` sobre los dobles
    función no lanza, y `health` y `weight-log` siguen verdes con la gráfica
    animada.
  - **Sonda S1**, sobre el verde: el `Polygon` pasa a
    `Animated.createAnimatedComponent(Polygon)` con `animatedProps={pointsProps}`
    (o cualquier `useAnimatedProps` del fichero). El `it` del área sale rojo por
    aserción y ninguno más.
  - Commit: `feat(mobile): dibujo de la línea de peso con strokeDashoffset (#169 R1)`.
- [ ] (3) Refactor si hace falta. Los `it` de `R8: la gráfica degrada con <2 puntos` siguen sin editarse.

## T2 — R2: los puntos aparecen con el mismo progreso

- [ ] (1) Rojo. Añadir `G` y `Circle` al doble de svg y crear
  `describe('#169 R2: los puntos aparecen con el mismo progreso')` con la
  fixture de tres pesos. Tres `it`, y cada uno empieza con
  `screen.getByTestId('weight-chart-points')` fuera de cualquier `waitFor`:
  - **Final**: con el doble por defecto, `await waitFor(…)` hasta que `jestAnimatedProps?.value` es `toEqual({ opacity: 1 })`;
  - **Primer frame**: leído directamente, `toEqual({ opacity: 0 })`;
  - **Un `Circle` por entrada, todos en el grupo**: `within(points).getAllByTestId('weight-chart-point')` tiene longitud 3 y `screen.getAllByTestId('weight-chart-point')` también tiene longitud 3 (no hay ninguno fuera del grupo).

  Rojo por consulta (`weight-chart-points`) en los tres. Commit:
  `test(mobile): los puntos de peso aparecen con el trazo (#169 R2)`.
- [ ] (2) Verde: `AnimatedG` con testID `weight-chart-points` y `opacity` animada (D1). Commit: `feat(mobile): puntos de peso con opacidad animada (#169 R2)`.
- [ ] (3) Refactor si hace falta.

## T3 — R3: reduce motion

- [ ] (1) Rojo: `describe('#169 R3: bajo reduce motion la gráfica sale completa')`,
  con `mockUseReducedMotion.mockReturnValue(true)` y
  `mockWithTiming.mockImplementation(() => 0)` (el doble «origen», para que un
  `withTiming` colado se vea). Se asertan:
  - `mockWithTiming` no se ha llamado;
  - la línea tiene `{ strokeDashoffset: 0 }`;
  - los puntos tienen `{ opacity: 1 }`.

  Las dos props se leen directamente tras el `await render` (bajo reduce motion
  el valor lo fija el render). Rojo por aserción en el único `it`
  (`mockWithTiming` llamado). Commit: `test(mobile): la gráfica de peso respeta reduce motion (#169 R3)`.
- [ ] (2) Verde: D4. Commit: `feat(mobile): reduce motion en el dibujo de la gráfica (#169 R3)`.
- [ ] (3) Refactor si hace falta.

## T4 — R4: cuándo se vuelve a dibujar

- [ ] (1) Tests en `describe('#169 R4: cuándo se vuelve a dibujar')`, uno por sub-requisito. Cada uno hace `await render` y luego `await screen.rerender(…)`, con el mismo wrapper:
  - **R4a**: de los 3 pesos crecientes de T1 (`L ≈ 104.9952`) a los 2 pesos
    iguales de T1 (`L = 100`). La `L` tiene que cambiar; si no, el recálculo
    queda ciego. Tras el `rerender`:
    - `strokeDasharray` es `[100, 100]`;
    - la línea llega a `{ strokeDashoffset: 0 }`, con `await waitFor(…)` (regla de props animadas);
    - `mockWithTiming` sigue con 1 llamada.
  - **R4b**: de 1 entrada a 3 entradas. `mockWithTiming` con 1 llamada.
  - **R4c**: de 3 a 1 y otra vez a 3. `mockWithTiming` con 2 llamadas.

  **Nacen verdes** si T1 ya montó `WeightChartPlot` (D2). El rojo se demuestra
  con dos sondas, cada una sobre el verde y revertida antes de la siguiente.
  Las dos las midió el leader en un spike; los recuentos exactos están en el
  handoff:
  - **S4a**: añadir `L` a las dependencias del efecto. Solo R4a sale rojo, por aserción (`Expected: 1`, `Received: 2`).
  - **S4b**, con el efecto **guardado** (sin la guarda, R4b sigue verde y la sonda no prueba nada):
    1. `WeightChart` devuelve siempre `<WeightChartPlot … />`;
    2. `WeightChartPlot` hace `const t = useTranslate()` junto a sus otros hooks;
    3. el efecto pasa a `if (!reducedMotion && entries.length >= 2) { … }`, con las mismas dependencias `[progress, reducedMotion]`;
    4. el `return` del vacío (`weight-chart-empty`) va después de todos los hooks.

    R4b y R4c salen rojos por aserción (R4b `Expected: 1`, `Received: 0`; R4c `Expected: 2`, `Received: 1`) y ninguno más.

  Se apuntan las dos sondas en `progress/` y se revierten. Commit (solo tests):
  `test(mobile): la gráfica de peso no repite el dibujo al cambiar datos (#169 R4)`.
- [ ] (2) Verde: sin cambio de implementación si las sondas ya se revirtieron. Si alguna fila sale roja sin sonda, se ajusta el montaje según D2. Commit solo si hay cambio: `feat(mobile): reglas de redibujo de la gráfica de peso (#169 R4)`.
- [ ] (3) Refactor si hace falta.

## T5 — R5: `monthlyWeightDelta`

- [ ] (1) Rojo: `src/utils/monthly-weight-delta.test.ts` con un `it.each` de `describe('#169 R5: monthlyWeightDelta')` sobre esta tabla cerrada.
  - Las entradas se construyen con una factoría local `w(measuredAt, weightKg)` que rellena el resto de `WeightEntry`, y van en el orden de la API (la más nueva primero).
  - Los `null` se asertan con `toBeNull()` y los números con `toBe`.

  | # | `todayIso` | Entradas (`measuredAt` `weightKg`) | Esperado | Qué candada |
  |---|---|---|---|---|
  | 1 | `2027-01-05` | `2027-01-04 12.4`, `2026-12-31 12.0`, `2026-12-01 11.0` | `0.4` | base = **primera** anterior al mes, cruzando año (con la última saldría 1.4) |
  | 2 | `2027-01-05` | `2027-01-04 12.4`, `2027-01-02 12.1` | `0.3` | sin anterior, base = última del mes; redondeo |
  | 3 | `2027-01-05` | `2027-01-04 12.4` | `null` | base === newest |
  | 4 | `2027-01-05` | `2026-12-31 12.0`, `2026-12-01 11.0` | `null` | mes vacío |
  | 5 | `2027-01-05` | (ninguna) | `null` | lista vacía |
  | 6 | `2026-12-31` | `2026-12-31 12.0`, `2026-12-01 11.5`, `2026-11-30 11.0` | `1` | el día 1 cuenta como del mes (`>=`), cruzando mes |
  | 7 | `2027-01-05` | `2027-01-04 11.7`, `2026-12-31 12.0` | `-0.3` | negativo y redondeo |
  | 8 | `2027-01-05` | `2027-01-04 12.0`, `2026-12-31 12.0` | `0` | `0` no es `null` |
  | 9 | `2027-01-01` | `2027-01-01 12.2`, `2026-12-31 12.0` | `0.2` | hoy es el día 1 de enero |
  | 10 | `2027-01-05` | `2027-01-04 12.4`, `2027-01-04 12.3`, `2026-12-31 12.0` | `0.4` | newest = `inMonth[0]` por orden, no por valor |
  | 11 | `2027-01-05` | `2026-01-20 12.4`, `2026-01-02 12.0` | `null` | mismo mes de otro año: el año entra en `monthStart` |

  Rojo: `Cannot find module '../utils/monthly-weight-delta'` (o la ruta relativa que toque); es el rojo esperado de un módulo nuevo. Commit: `test(mobile): delta mensual de peso en cliente (#169 R5)`.
- [ ] (2) Verde: `src/utils/monthly-weight-delta.ts` según R5, pasos 1 a 6. Lint con `--no-cache`. Commit: `feat(mobile): monthlyWeightDelta (#169 R5)`.
- [ ] (3) Refactor si hace falta.

## T6 — R9: dos claves de catálogo

- [ ] (1) Rojo, en `src/providers/__tests__/language-provider.test.tsx`:
  - la última línea del recuento pasa de `- 1, // #159 R2` a `- 1 // #159 R2`, más una línea nueva `+ 2, // #169 R9`. Se ancla con `grep -cF -e '- 1, // #159 R2' src/providers/__tests__/language-provider.test.tsx` = 1 antes y 0 después; tras el merge de #166 (d2b8b0ae) sigue dando 1;
  - un `describe('#169 R9: claves de peso nuevas')` con la forma de `#90 R2` y `#147 R1` del mismo fichero:
    - `const english = en as Record<string, string>;` y lo mismo con `es`;
    - `languageDesign` leído con `readFileSync(join(process.cwd(), '../specs/mobile-ui-language/design.md'), 'utf8')`;
    - por cada una de las dos claves, los literales exactos de la Tabla de literales de [[requirements]] con `toBe`, y `expect(languageDesign).toMatch(new RegExp('\\| — \\| `' + escapeRegExp(key) + '`[^\\n]*← añadida por #169 \\(R9\\)'))`;
    - además, `expect(languageDesign).toContain('### §2.24 — Añadidos por #169 — Peso')`.

  Rojo por aserción en **dos** `it`: el del recuento y el de `#169 R9`. Commit: `test(mobile): claves de catálogo del resumen y el toast de peso (#169 R9)`.
- [ ] (2) Verde:
  - las dos claves en los bloques `en` y `es` de `src/i18n/catalog.ts`, junto a las demás `weightLog.*`;
  - en `specs/mobile-ui-language/design.md`, la sección `### §2.N — Añadidos por #169 — Peso` con el formato de `§2.23`. `N` se mide con `grep -c '^### §2\.' specs/mobile-ui-language/design.md` + 1; a 89fe2009 da 24, y tras el merge de #166 (d2b8b0ae) sigue dando 24.

  Commit: `feat(mobile): claves weightLog.weightLogged y monthDelta (#169 R9)`.
- [ ] (3) Refactor si hace falta.

## T7 — R8: candado del chip de delta por entrada

- [ ] (1) Rojo. En `src/screens/weight-log/index.test.tsx`, los dobles de `reicon-react-native` y `use-theme-colors`, y `describe('#169 R8: chip de delta por entrada')` con un `it.each` de 4 filas, una por rama:
  - **Fixture**: `mockListWeights` devuelve 4 entradas con ids `w-up`, `w-down`, `w-flat` y `w-none`, con `variation` `0.4`, `-0.2`, `0` y `null`.
  - **Tile** (`getByTestId(\`weight-row-${id}-tone\`)`):
    - `props.className` contiene la clase de su rama y no contiene `bg-danger-soft`, `bg-success-soft` ni `bg-default` de las otras ramas (en `null` y `0` la propia es `bg-default`);
    - `within(tile)` contiene el icono de su rama, con `style.color` `red`, `green` o `gray` y `size` igual al valor que ya tenga hoy, medido con `grep -nF 'size=' src/screens/weight-log/index.tsx`;
    - `within(tile)` no contiene los otros dos iconos.
  - **Texto** (`getByTestId(\`weight-row-${id}-delta\`)`):
    - `toHaveTextContent` exacto: `+0.4 kg`, `-0.2 kg`, `0 kg` o `—`;
    - su className contiene su tono y no contiene los otros dos (`text-danger`, `text-success`, `text-muted`).

  Rojo por consulta (`weight-row-w-up-tone`). Commit: `test(mobile): candado del chip de delta por entrada de peso (#169 R8)`.
- [ ] (2) Verde: solo los dos testIDs en la fila; ni classNames ni iconos cambian. En el mismo commit, el selector del `it` de mobile-health R7 (`keeps API order and renders each weight detail`, en el mismo fichero de test) pasa de `getAllByTestId(/^weight-row-/)` a `getAllByTestId(/^weight-row-weight-\d+$/)`, porque el prefijo suelto también atrapa los dos testIDs nuevos y el `toEqual` recibe seis ids en vez de dos. La lista esperada y el resto del `it` no cambian. Enmienda de la Reanudación 3 (2026-10-12), medida por el leader fuera del árbol con los dos testIDs puestos: `<PESO>` 130 passed, `<GUARDAS>` 92 passed, typecheck 0 y eslint 0. Commit: `feat(mobile): testIDs del chip de delta por entrada (#169 R8)`.
- [ ] (3) Refactor si hace falta.

## T8 — R6: resumen del peso en la card

- [ ] (1) Rojo: `describe('#169 R6: resumen del peso en la card de la gráfica')`.
  - **`it.each` por zona**: `jest.useFakeTimers()`, `jest.setSystemTime(new Date('2026-10-01T05:00:00Z'))` y `mockGetMe` con `makeProfile(tz)`. Entradas: `2026-09-30 12.4`, `2026-09-29 12.0` y `2026-08-31 11.0`.
    - `Pacific/Pago_Pago`:
      - `weight-current` tiene el texto `12.4 kg`, `props.className` igual a `text-3xl font-black text-foreground` y `props.style` igual a `{ fontVariant: ['tabular-nums'] }`. Es un literal: no se importa `TABULAR_NUMS`;
      - `weight-month-delta-text` tiene el texto `+1.4 kg este mes` y el mismo `style`;
      - `weight-month-delta` tiene className `flex-row items-center gap-1.5`.
    - `Pacific/Kiritimati`: `weight-current` presente con `12.4 kg` y `weight-month-delta` ausente.
  - **Orden**: `weight-summary` está dentro de `weight-chart-card` y antes de `weight-chart`. RNTL 14 no tiene `findAll` en los hosts, así que, en este orden:
    1. `within(screen.getByTestId('weight-chart-card')).getByTestId('weight-summary')` (rojo por consulta);
    2. `within(screen.getByTestId('weight-chart-card')).getAllByTestId(/^weight-(summary|chart)$/).map((node) => node.props.testID)` es `toEqual(['weight-summary', 'weight-chart'])`. `getAllByTestId` devuelve en preorden.
  - **Cero entradas** (`weights: []`): `weight-summary` ausente. Nace verde; se demuestra con la sonda S6: pintar el resumen siempre, con `entries[0]?.weightKg`. Debe salir rojo por aserción.

  Rojo por consulta (`weight-summary`). En la misma tarea se mueven, en el mismo commit rojo:
  - la fila `{ file: 'src/screens/weight-log/index.tsx', key: 'weightLog.monthDelta' }` en `R5_HEALTH`;
  - `expect(R5_HEALTH).toHaveLength(… + 1)` con `#169 R6` en el comentario;
  - en `consistency-classnames.test.ts`, la fila de Peso a `2 + 2], // #169 R6`, y la suma `+ 2` con `#169 R6`. Las anclas exactas están en [[requirements]] §Candados agregados.

  Commit: `test(mobile): resumen de peso actual y delta del mes (#169 R6)`.
- [ ] (2) Verde: D5 y D6. La fila del delta lleva **solo** el `Text` con `style={TABULAR_NUMS}`, sin className de tono y sin icono, que llegan en T9. Commit: `feat(mobile): resumen de peso en la card de la gráfica (#169 R6)`.
- [ ] (3) Refactor si hace falta.

## T9 — R7: tono del delta del mes

- [ ] (1) Rojo: `describe('#169 R7: tono del delta del mes')`, con un `it.each` de 3 filas.
  - **Contexto común**: `setSystemTime(new Date('2026-09-17T18:00:00Z'))` y `makeProfile('America/Mexico_City')` (12:00 del 17 de septiembre).

  | Rama | Entradas | Texto | className exacto de `weight-month-delta-text` | Icono en `weight-month-delta` | Color | Ausentes |
  |---|---|---|---|---|---|---|
  | `> 0` | `2026-09-15 12.4`, `2026-09-02 12.0` | `+0.4 kg este mes` | `text-sm font-semibold text-danger` | `icon-trend-up`, `size` 15 | `red` | `icon-trend-down`, `icon-minus` |
  | `< 0` | `2026-09-15 11.7`, `2026-08-30 12.0` | `-0.3 kg este mes` | `text-sm font-semibold text-success` | `icon-trend-down`, `size` 15 | `green` | `icon-trend-up`, `icon-minus` |
  | `= 0` | `2026-09-15 12.0`, `2026-08-30 12.0` | `0 kg este mes` | `text-sm font-semibold text-muted` | `icon-minus`, `size` 15 | `gray` | `icon-trend-up`, `icon-trend-down` |

  La igualdad exacta del className excluye las clases de las otras ramas. Los iconos se buscan con `within(screen.getByTestId('weight-month-delta'))`, porque las filas del historial tienen los suyos.

  Rojo por aserción (className sin tono). Commit: `test(mobile): tono del delta mensual de peso (#169 R7)`.
- [ ] (2) Verde: clase e icono por rama. Commit: `feat(mobile): color e icono del delta mensual (#169 R7)`.
- [ ] (3) Refactor: D7, el ayudante de tono compartido con las filas. Con T7 y T9 verdes; commit: `refactor(mobile): tono compartido entre filas y resumen de peso (#169 R7)`.
  - **Aviso**: el className del tile de la fila tiene que seguir siendo el literal
    `` `size-8 shrink-0 items-center justify-center rounded-xl ${tileClassName}` ``.
    Lo lee `consistency-classnames.test.ts` y un cambio de forma ahí lo pone rojo.
    Comprobar con `grep -cF '${tileClassName}' src/screens/weight-log/index.tsx`, que da 1
    antes y después del refactor.

## T10 — R10: toast y háptico tras un alta correcta

- [ ] (1) Rojo: el doble de `expo-haptics` y `describe('#169 R10: toast y háptico tras un alta correcta')`. Contexto: el de `R9: alta de peso con degradación por kind`.
  - **`it` diferido**:
    1. `let resolveCreate`; `mockCreateWeight.mockReturnValue(new Promise((resolve) => { resolveCreate = resolve; }))`.
    2. `await fireEvent.changeText(weight-input, '12.4')` y `await fireEvent.press(weight-submit)`.
    3. Se aserta: `queryByTestId('weight-toast')` es `null` y `notificationAsync` no se ha llamado.
    4. `await act(async () => { resolveCreate({ kind: 'ok', weight: makeWeight({ weightKg: 12.4 }) }); })`.
    5. Se aserta el toast:
       - `weight-toast` existe y su className es exacto (el de R10);
       - `props.pointerEvents` es `'none'` y `props.accessibilityLiveRegion` es `'polite'`;
       - `within(toast)` tiene el texto exacto `Anotado. Ya lo puse en la gráfica.`, y el `Text` tiene className `text-sm font-semibold text-foreground`;
       - `icon-check` tiene `size` 16 y `style.color` `green`;
       - `within(screen.getByTestId('screen-weight-log'))` contiene el toast y `within(screen.getByTestId('weight-log-form'))` no lo contiene, es decir, está fuera del scroll.
    6. Se aserta el háptico: `notificationAsync` tiene 1 llamada, con `'mock-success'`.
  - **Candado de fuente** (precedente `weekly-activity-chart.test.tsx`): en el fuente leído con `readFileSync`, el trozo entre `case 'ok':` y el siguiente `case '` contiene `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)` exactamente una vez.

  Rojo por aserción (`queryByTestId('weight-toast')` tras resolver). Si sale por consulta, cambiar la primera aserción tras resolver a `getByTestId` y declararlo. La fila de `weightLog.weightLogged` en `R5_HEALTH` y su `+ 1` con `#169 R10` van en este commit rojo. Commit: `test(mobile): toast y háptico al registrar un peso (#169 R10)`.
- [ ] (2) Verde: D8 y D9, con el toast como `View` (el `Animated.View` llega en T13). Si el toast no está en el árbol justo tras el `act` del paso 4, es MP4 (no medida en spike): se añade un segundo `await act(async () => {})` antes de las aserciones, sin cambiarlas, y se anota en `progress/`. Commit: `feat(mobile): toast y háptico tras registrar un peso (#169 R10)`.
- [ ] (3) Refactor si hace falta.

## T11 — R11: ni toast ni háptico fuera de la rama ok

- [ ] (1) `describe('#169 R11: ni toast ni háptico fuera de la rama ok')`, con un `it.each` de 8 filas: la tabla de R11 en [[requirements]], un candado por rama.
  - **Cada fila**: escribe el peso (`abc` en la fila no numérica, `12.4` en las demás), `await fireEvent.press(weight-submit)` y espera la señal de su fila con `await waitFor(…)` (texto en `weight-form-error`, o `signOut` llamado).
  - **Aserciones**: `queryByTestId('weight-toast')` es `null` y `notificationAsync` no se ha llamado.

  Nacen verdes tras T10. El rojo se demuestra con la sonda S11: mostrar el toast y llamar al háptico como primera sentencia del handler de alta. Deben salir 8 rojos por aserción y ninguno por consulta. Commit (solo tests): `test(mobile): sin toast ni háptico en altas fallidas (#169 R11)`.
- [ ] (2) Verde: sin cambio, con la sonda revertida.
- [ ] (3) Refactor si hace falta.

## T12 — R12: el toast se va solo

- [ ] (1) Rojo: `describe('#169 R12: el toast se va solo')`, con timers falsos. Entre el alta y las ventanas no hay `waitFor`: un `waitFor` avanza los timers falsos.
  - **Primer `it`**:
    1. Alta correcta.
    2. `await act(async () => { jest.advanceTimersByTime(2400); })`: el toast sigue presente.
    3. `+ 250` (2650 ms): el toast está ausente.
  - **Segundo `it`**:
    1. Alta correcta.
    2. `+ 2000`.
    3. `await fireEvent.changeText(weight-input, '12.5')`: el formulario se vació tras la primera alta (#72 R2).
    4. Segunda alta correcta.
    5. `+ 2400` (4400 ms): el toast está presente.
    6. `+ 250` (4650 ms): el toast está ausente.
    7. `notificationAsync` tiene 2 llamadas.

  Rojo por aserción (el toast sigue a los 2650 ms). Commit: `test(mobile): el toast de peso se oculta solo (#169 R12)`.
- [ ] (2) Verde: el timer de D8 con `WEIGHT_TOAST_MS = 2500` y el reinicio. Commit: `feat(mobile): auto-ocultado del toast de peso (#169 R12)`.
- [ ] (3) Refactor si hace falta.

## T13 — R13: movimiento del toast

- [ ] (1) Rojo: `describe('#169 R13: movimiento del toast')`.
  - **Candado de fuente**, sobre `src/screens/weight-log/index.tsx`:
    - contiene `entering={FadeIn.duration(MOTION_TRANSITION_MS)}`;
    - contiene `exiting={FadeOut.duration(MOTION_FEEDBACK_MS)}`;
    - `ReduceMotion.Never` aparece 0 veces.
  - **Conductual**, tras un alta correcta: `toast.props.entering` es `toBeInstanceOf(FadeIn)` y `toast.props.exiting` es `toBeInstanceOf(FadeOut)`. MP5 la midió el leader en un spike: las dos props llegan al host como instancias, así que el `it` conductual se queda.

  Rojo por aserción (`toContain`). Commit: `test(mobile): fundido de entrada y salida del toast de peso (#169 R13)`.
- [ ] (2) Verde: `Animated.View` con `entering` y `exiting`. Correr también `#169 R12`. MP6 la midió el leader en un spike: con `exiting`, el nodo ya no está a los 2501 ms ni a los 2650 ms, así que la ventana basta. Si aun así no basta, se amplía la ventana, nunca la aserción. Commit: `feat(mobile): toast de peso con FadeIn y FadeOut (#169 R13)`.
- [ ] (3) Refactor si hace falta.

## T14 — R14: prueba de humo humana (dev build de Android)

- [ ] Lo corre un humano tras el veredicto aprobado del reviewer, en el dev build de Android y no en Expo Go, con los 5 puntos de R14. Firma en la casilla de R14 de §Aprobación de [[requirements]]. Si `adb` ve el teléfono dos veces, usar `adb -s <ip:puerto>`.

## Cierre (antes de pasar al reviewer)

- [ ] `git diff --name-only 89fe2009..HEAD -- mobile-pet-tracker/src/screens/health` sale vacío.
- [ ] `git diff --name-only 89fe2009..HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/theme/motion.ts` sale vacío.
- [ ] `grep -cF 'Haptics.notificationAsync(' src/screens/weight-log/index.tsx` da 1.
- [ ] Las anclas de [[requirements]] §Candados agregados, medidas otra vez, tienen el valor de su columna «Después».
- [ ] `traceability.md` sin filas «pendiente», salvo R14 hasta la firma humana.
