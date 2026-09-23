---
feature: "mobile-kcal-consumed-bar"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-kcal-consumed-bar]] (#113)

> Disciplina TDD: por requisito, **(1) commit rojo → (2) commit verde →
> (3) refactor**, un commit por paso, nunca implementación y test juntos.
> Rutas relativas a `mobile-pet-tracker/`. Anclas por contenido (`grep -n`),
> nunca por número de línea. Todo `describe` nuevo lleva el prefijo
> `#113 R<n>:` y el sufijo `(mobile-kcal-consumed-bar #113)`.
> Mensajes: `test(kcal-bar): <desc> (Rn)` el rojo, `feat(kcal-bar): <desc> (Rn)`
> el verde, `refactor(kcal-bar): …` si lo hay, `docs(kcal-bar): …` el cierre.

## Antes de empezar

- [ ] `git fetch origin` y `git log -1`: la base es `103a3366` **o** un
      `origin/main` posterior que ya contenga #95. Si #95 está en `main` y
      esta branch no lo tiene, **parar y avisar al leader** para que rebase
      antes del primer commit (nunca después de rellenar [[traceability]]).
- [ ] `rm -f .expo/types/router.d.ts` (gitignorado; rompe `tsc`).
- [ ] **No lanzar `./init.sh`** (Postgres y LocalStack compartidos). Esta
      feature se verifica con jest, tsc y lint (§Cierre).
- [ ] Medir y **anotar en el reporte** las bases, sin pipe:
      `bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx'; echo "exit=$?"`
      (38 tests en `103a3366`); las sumas actuales de
      `expect(englishKeys).toHaveLength(` y de `expect(R6_FOOD).toHaveLength(`
      tal como estén escritas. Los deltas de esta spec van **sobre esa base**.
- [ ] Leer [[design]] §3 (arnés) antes de escribir el doble de Reanimated.
- [ ] En **producción** (`food.tsx`, `types.ts`, `catalog.ts`) ningún
      comentario cita `#113` salvo como `#113 R<n>` (guard hex de
      `design-drift.test.ts`, C8 de [[requirements]]). Lo más simple: sin
      comentarios.

## Orden y por qué (candado del sujeto ausente)

`R1 → R2 → R3 → R4 → R5`, y R6 (humano) al final. Cada test solo asevera
nodos que ya existen en su punto del orden o que crea su propio verde:

| R | Asevera | Existe desde |
|---|---|---|
| R1 | el bloque `NutritionPlan` de `types.ts` | siempre |
| R2 | `food-plan-card` (existe) y `food-plan-progress/-consumed/-percent/-track/-fill` | los crea el verde de R2 |
| R3 | props de accesibilidad de `food-plan-progress`; la clave del catálogo | nodo de R2; clave del verde de R3 |
| R4 | llamadas a `withTiming` y ancho de `food-plan-fill` | nodo de R2; `withTiming` del verde de R4 |
| R5 | `food-plan-skeleton` (existe) | siempre |

Ningún rojo puede fallar por `ReferenceError` de un helper: `mockWithTiming`
entra en el rojo de R2 y `expectKcalBarTiming` en el rojo de R4, cada uno en
el commit donde se usa por primera vez. **Ningún requisito es de
verificación** (C4): los cinco tienen rojo real por aserción.

---

## R1 — `NutritionPlan` declara `kcalConsumedToday: number`

- [ ] **(1) Commit rojo** `test(kcal-bar): type kcalConsumedToday as the plan's last field (R1)`.
  En `src/app/(tabs)/__tests__/food.test.tsx`, `describe` nuevo al final:
  `describe('#113 R1: NutritionPlan declara kcalConsumedToday como número y último campo (mobile-kcal-consumed-bar #113)')`
  con `it('añade kcalConsumedToday: number justo después de servedToday')`:
  ```ts
  const source = readFileSync('src/api/types.ts', 'utf8');
  const block = source.match(/export interface NutritionPlan \{[\s\S]*?\n\}/)?.[0] ?? '';
  const fields = [...block.matchAll(/^\s+(\w+):/gm)].map(([, field]) => field);
  expect(fields.slice(-2)).toEqual(['servedToday', 'kcalConsumedToday']);
  expect(block).toContain('\n  kcalConsumedToday: number;\n');
  ```
  (`readFileSync` ya existe en el fichero vía `jest.requireActual('fs')`.)
  **Mismo commit**, delta del candado ajeno en `src/screens/home/index.test.tsx`,
  dentro de `describe('#98 R1: los tipos del cliente declaran servedToday y mealsToday'`:
  `expect(nutritionPlanFields).toHaveLength(12);` →
  `expect(nutritionPlanFields).toHaveLength(12 + 1); // +1 #113 R1`, y
  `expect(nutritionPlanFields.slice(-2)).toEqual([` →
  `expect(nutritionPlanFields.slice(-3, -1)).toEqual([` (mismo array
  `'generatedAt', 'servedToday'`). Rojo esperado: los dos `describe`, por
  aserción.
- [ ] **(2) Commit verde** `feat(kcal-bar): add kcalConsumedToday to NutritionPlan (R1)`.
  `src/api/types.ts`: `  kcalConsumedToday: number;` tras
  `  servedToday: string[];` dentro de `export interface NutritionPlan {`.
  Y, para que `tsc` siga verde, `    kcalConsumedToday: 0,` tras
  `    servedToday: [],` en `function makePlan(` de **las dos** fixtures:
  `src/app/(tabs)/__tests__/food.test.tsx` y
  `src/screens/meal-schedule/index.test.tsx`. `bunx tsc --noEmit` verde.
- [ ] **(3) Refactor.** Ninguno previsto. Sonda: `kcalConsumedToday?: number`
      y `kcalConsumedToday: number | null` → R1 rojo; restaurar con
      `git diff` vacío.

## R2 — La tarjeta pinta las kcal servidas contra `merKcal`

- [ ] **(1) Commit rojo** `test(kcal-bar): paint served kcal against the daily target (R2)`.
  En `food.test.tsx`:
  - **Doble de Reanimated a nivel de módulo** según la intención de [[design]]
    §3 (`requireActual` + `__esModule: true` + exactamente `withTiming` como
    espía identidad `mockWithTiming`, `withRepeat` y `withSequence`). Correr
    el fichero **entero** tras escribirlo: los 38 de la base + R1 siguen
    verdes (medido: 38/38 con este doble).
  - `describe('#113 R2: la tarjeta Objetivo diario pinta las kcal servidas contra merKcal (mobile-kcal-consumed-bar #113)')`,
    `beforeEach` con `mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] })`,
    y tres `it`:

  **(a)** `it('compone la tarjeta: fila intacta y bloque de progreso debajo')`
  con `makePlan({ merKcal: 1420, kcalConsumedToday: 890, servedToday: ['07:30'] })`.
  Tras `const card = await screen.findByTestId('food-plan-card')`, y
  comprobando en cada `children[i]` que no es `string` (como hace la Home):
  - `card.children` longitud **2**; `[0]` = fila, `[1]` = bloque;
  - fila: `className` `'flex-row items-center justify-between gap-4'`,
    `children` longitud 2, `within(fila.children[0]).getByTestId('food-plan-kcal')`
    visible y `within(fila.children[1]).getByTestId('food-icon-fork-knife')`
    visible (el tile no se va);
  - bloque: `props.testID` `'food-plan-progress'`, `className` `'gap-1.5'`,
    `props.onPress` `toBeUndefined()` (no navega), `children` longitud 2;
  - cabecera (`bloque.children[0]`): `className`
    `'flex-row items-center justify-between'`, `children` longitud 2,
    `children[0]` con `props.testID` `'food-plan-consumed'` y `children[1]`
    con `'food-plan-percent'` (el **orden** queda candado);
  - para `food-plan-consumed` y `food-plan-percent` vía `screen.getByTestId`:
    `props.className` `toBe('text-xs font-normal text-accent-foreground')` y
    `props.style` `toEqual({ fontVariant: ['tabular-nums'] })` —literal,
    **nunca** `TABULAR_NUMS` importado—;
  - carril (`bloque.children[1]`): `props.testID` `'food-plan-track'`,
    `className` `'h-2 overflow-hidden rounded-full bg-accent-foreground/20'`,
    `children` longitud **1** con `props.testID` `'food-plan-fill'`;
  - `screen.getByTestId('food-plan-fill').props.className`
    `toBe('h-full rounded-full bg-accent-foreground')`;
  - `screen.getAllByTestId('food-plan-progress')` longitud 1.

  **(b)** `it.each` sobre esta tabla literal (título
  `'con merKcal $merKcal y kcalConsumedToday $kcal pinta $consumed y $percent'`):

  | `merKcal` | `mealsPerDay` | `mealTimes` | `servedToday` | `kcal` | `consumed` | `percent` |
  |---|---|---|---|---|---|---|
  | 656 | 2 | `['07:30', '19:30']` | `[]` | 0 | `'0 kcal'` | `'0%'` |
  | 656 | 2 | `['07:30', '19:30']` | `['07:30']` | 328 | `'328 kcal'` | `'50%'` |
  | 656 | 2 | `['07:30', '19:30']` | `['07:30', '19:30']` | 656 | `'656 kcal'` | `'100%'` |
  | 1420 | 2 | `['07:30', '19:30']` | `['07:30']` | 890 | `'890 kcal'` | `'63%'` |
  | 1000 | 3 | `['08:00', '13:00', '20:00']` | `['08:00']` | 333 | `'333 kcal'` | `'33%'` |
  | 200 | 6 | `['06:00', '09:00', '12:00', '15:00', '18:00', '21:00']` | `['06:00']` | 33 | `'33 kcal'` | `'17%'` |
  | 0 | 2 | `['07:30', '19:30']` | `[]` | 0 | `'0 kcal'` | `'0%'` |

  Por fila: `makePlan({ merKcal, mealsPerDay, mealTimes, servedToday, kcalConsumedToday: kcal })`;
  `expect(await screen.findByTestId('food-plan-consumed')).toHaveTextContent(consumed)`;
  `expect(screen.getByTestId('food-plan-percent')).toHaveTextContent(percent)`;
  `expect(screen.getByTestId('food-plan-fill')).toHaveAnimatedStyle({ width: percent })`.
  (`toHaveTextContent` de RNTL 14 compara **exacto** por defecto: `'0 kcal'`
  no casa `'890 kcal'`.) La fila 1420/890 es el ejemplo del Make y **no** es
  derivable de 1 de 2 franjas (daría 50 %): canda que se lee el campo.

  **(c)** `it('no pinta el bloque sin plan')`:
  `mockGetNutritionPlan.mockResolvedValue({ kind: 'not-found' })`,
  `await screen.findByTestId('food-plan-empty')` (espera al árbol, regla de
  `docs/conventions.md` §Esperas) y luego
  `expect(screen.queryByTestId('food-plan-progress')).toBeNull()`.

  Rojo esperado: (a) y (b) por nodos que aún no existen. (c) pasa ya: es la
  rama negativa de (a)/(b) y se queda como no-regresión.
- [ ] **(2) Commit verde** `feat(kcal-bar): add the kcal progress bar to the daily target card (R2)`.
  En `src/app/(tabs)/food.tsx`, según [[design]] D2-D4:
  - imports: `useEffect` en la línea de `react`;
    `import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';`;
    `TABULAR_NUMS` en la línea que ya importa `CONTINUOUS_CORNER`;
  - módulo: `const AnimatedView = Animated.createAnimatedComponent(View);`;
  - en `FoodScreen`, tras `const servedMeals = loadedPlan?.servedToday.length ?? 0;`:
    `kcalPct` (fórmula exacta de D2), `kcalBarWidth = useSharedValue(kcalPct)`,
    `kcalBarStyle` con `.get()`, y
    `useEffect(() => { kcalBarWidth.set(kcalPct); }, [kcalBarWidth, kcalPct]);`
    (**sin** `withTiming`: lo pone R4);
  - dentro de `<Card testID="food-plan-card" …>`, **después** de la fila
    `className="flex-row items-center justify-between gap-4"` (que no cambia),
    el bloque con la anatomía exacta de [[requirements]] R2, el relleno como
    `<AnimatedView testID="food-plan-fill" className="h-full rounded-full bg-accent-foreground" style={kcalBarStyle} />`.
    Sin `CONTINUOUS_CORNER` en carril ni relleno (cápsulas).
- [ ] **(3) Refactor + sondas** (evidencia en el reporte; cada una roja y
      restaurada con `git diff` vacío): intercambiar los dos textos de la
      cabecera; `/20` → `/30`; relleno `bg-accent-foreground` → `bg-accent`;
      quitar `style={TABULAR_NUMS}` del porcentaje; `Math.round` →
      `Math.floor` (rojo en 1420/890 y 200/33); quitar la guarda
      `merKcal > 0` (rojo en 0/0); derivar de
      `servedToday.length / mealsPerDay` (rojo en 1420/890); borrar el tile
      `ForkKnife` (rojo en (a)).

## R3 — Un único elemento accesible, con su clave de catálogo

- [ ] **(1) Commit rojo** `test(kcal-bar): expose the kcal bar as one progressbar (R3)`.
  En `food.test.tsx` (añadir `import { en, es } from '../../../i18n/catalog';`):
  `describe('#113 R3: el progreso es un único elemento accesible con su clave de catálogo (mobile-kcal-consumed-bar #113)')`:

  **(a)** `it.each` con
  `{ merKcal: 1420, kcal: 890, servedToday: ['07:30'], label: '890 de 1420 kcal servidas hoy', now: 63 }` y
  `{ merKcal: 656, kcal: 0, servedToday: [], label: '0 de 656 kcal servidas hoy', now: 0 }`:
  sobre `await screen.findByTestId('food-plan-progress')`,
  `props.accessible` `toBe(true)`, `props.accessibilityRole`
  `toBe('progressbar')`, `props.accessibilityLabel` `toBe(label)` y
  `props.accessibilityValue` `toEqual({ min: 0, max: 100, now })`.

  **(b)** `it('registra food.kcalConsumedOfTarget en los dos idiomas y en la tabla de idioma')`:
  ```ts
  const english = en as Record<string, string>;
  const spanish = es as Record<string, string>;
  expect(english['food.kcalConsumedOfTarget']).toBe('{{consumed}} of {{target}} kcal served today');
  expect(spanish['food.kcalConsumedOfTarget']).toBe('{{consumed}} de {{target}} kcal servidas hoy');
  expect(readFileSync('../specs/mobile-ui-language/design.md', 'utf8')).toMatch(
    /\| — \| `food\.kcalConsumedOfTarget`[^\n]*← añadida por #113 \(R3\)/,
  );
  ```
  **Mismo commit**, deltas de candados ajenos (sobre la base medida):
  - `src/providers/__tests__/language-provider.test.tsx`: añadir ` + 1` al
    final de la suma de `expect(englishKeys).toHaveLength(` y
    ` + 1 de #113 R3 (food.kcalConsumedOfTarget)` al final del comentario que
    empieza por `// 259 en`;
  - `src/__tests__/ui-language.test.ts`, en
    `describe('#65 R6: Food resuelve su copy por clave'`: añadir ` + 1` a la
    suma de `expect(R6_FOOD).toHaveLength(` con `// +1 #113 R3` (si ya hay
    comentario de #95, se añade detrás), y subir en 1 el entero del título
    `'resuelve las N ocurrencias normativas'`.

  Rojo esperado: (a) por `accessibilityLabel` indefinido, (b) por clave
  ausente, `#65 R12` por longitud, `#65 R6` por longitud. `tsc` verde (los
  `Record<string, string>` evitan el error de clave inexistente).
- [ ] **(2) Commit verde** `feat(kcal-bar): name the kcal bar for screen readers (R3)`.
  - `src/i18n/catalog.ts`:
    `'food.kcalConsumedOfTarget': '{{consumed}} of {{target}} kcal served today',`
    tras `'food.dailyGrams': '{{grams}} g / day',`, y
    `'food.kcalConsumedOfTarget': '{{consumed}} de {{target}} kcal servidas hoy',`
    tras `'food.dailyGrams': '{{grams}} g / día',`.
  - `food.tsx`, en el `View` de `food-plan-progress`: `accessible`,
    `accessibilityRole="progressbar"`,
    `accessibilityLabel={t('food.kcalConsumedOfTarget', { consumed: loadedPlan.kcalConsumedToday, target: loadedPlan.merKcal })}`
    (llamada **directa** a `t('…'`: `checkUses` la cuenta por regex) y
    `accessibilityValue={{ min: 0, max: 100, now: kcalPct }}`.
  - `src/__tests__/ui-copy-table.ts`, en `R6_FOOD`, tras
    `{ file: 'src/app/(tabs)/food.tsx', key: 'food.dailyGrams' },`:
    `{ file: 'src/app/(tabs)/food.tsx', key: 'food.kcalConsumedOfTarget' }, // #113 R3`
    (va en el verde porque `key` es `TranslationKey`).
  - `specs/mobile-ui-language/design.md` §2.6, tras la fila de
    `food.mealsServedOfTotal`:
    ```
    | — | `food.kcalConsumedOfTarget` **(param)** | `{{consumed}} of {{target}} kcal served today` | `{{consumed}} de {{target}} kcal servidas hoy` | ← añadida por #113 (R3)
    ```
- [ ] **(3) Refactor + sondas**: rol `'progressbar'` → `'text'`; `now: kcalPct + 1`;
      `consumed` y `target` intercambiados; quitar `accessible`. Cada una roja.

## R4 — El relleno transiciona su ancho

- [ ] **(1) Commit rojo** `test(kcal-bar): animate the kcal bar on serve and undo (R4)`.
  En `food.test.tsx`: `import { Easing, ReduceMotion } from 'react-native-reanimated';`,
  el ayudante `expectKcalBarTiming` literal de [[design]] §3, y
  `describe('#113 R4: el relleno transiciona su ancho al servir y al deshacer (mobile-kcal-consumed-bar #113)')`
  con `it('anima a 50, sube a 100 al servir y baja a 50 al deshacer con 250 ms y ease-in-out')`:
  ```ts
  const half = makePlan({ merKcal: 1420, servedToday: ['07:30'], kcalConsumedToday: 710 });
  const full = makePlan({ merKcal: 1420, servedToday: ['07:30', '19:30'], kcalConsumedToday: 1420 });
  mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  mockGetNutritionPlan
    .mockResolvedValueOnce({ kind: 'ok', plan: half })
    .mockResolvedValueOnce({ kind: 'ok', plan: full })
    .mockResolvedValue({ kind: 'ok', plan: half });
  mockServeMeal.mockResolvedValue({ kind: 'ok' });
  mockUnserveMeal.mockResolvedValue({ kind: 'ok' });
  ```
  Pasos (cada espera es sobre el **árbol**, `docs/conventions.md` §Esperas):
  1. `renderFood()`; `await screen.findByTestId('food-plan-consumed')` con
     `'710 kcal'`; `food-plan-percent` `'50%'`; relleno
     `toHaveAnimatedStyle({ width: '50%' })`; `expectKcalBarTiming(50)`.
  2. `mockWithTiming.mockClear()`;
     `await fireEvent.press(screen.getByTestId('meal-toggle-1'))`;
     `await screen.findByTestId('meal-served-1')`; `'1420 kcal'`, `'100%'`,
     ancho `'100%'`, `expectKcalBarTiming(100)`.
  3. `await waitFor(() => expect(screen.getByTestId('meal-toggle-1')).toBeEnabled())`
     (el candado de pulsación de #98 suelta al acabar la acción);
     `mockWithTiming.mockClear()`;
     `await fireEvent.press(screen.getByTestId('meal-toggle-1'))`;
     `await screen.findByTestId('meal-pending-1')`; `'710 kcal'`, `'50%'`,
     ancho `'50%'`, `expectKcalBarTiming(50)`.

  Destinos 50 y 100 a propósito: heroui llama a `withTiming` con 360, 1 y 0 en
  este fichero. Rojo esperado: `expectKcalBarTiming(50)` encuentra `config`
  indefinido (el verde de R2 asigna sin animar).
- [ ] **(2) Commit verde** `feat(kcal-bar): ease the kcal bar width over 250 ms (R4)`.
  `food.tsx`: añadir `Easing`, `ReduceMotion` y `withTiming` al import de
  Reanimated; `KCAL_BAR_TIMING` a nivel de módulo, **no exportado**, con
  `duration: 250`, `easing: Easing.bezier(0.77, 0, 0.175, 1)`,
  `reduceMotion: ReduceMotion.System`; el efecto pasa a
  `kcalBarWidth.set(withTiming(kcalPct, KCAL_BAR_TIMING));`.
- [ ] **(3) Refactor + sondas**: `duration` 250 → 300; curva →
      `Easing.bezier(0.23, 1, 0.32, 1)`; `ReduceMotion.System` →
      `ReduceMotion.Never`; volver a `set(kcalPct)`. Cada una roja en R4, y R2
      sigue verde en todas (el doble es identidad).

## R5 — Esqueleto del plan a `h-40`

- [ ] **(1) Commit rojo** `test(kcal-bar): size the plan skeleton to the taller card (R5)`.
  `describe('#113 R5: el esqueleto del plan reserva el alto de la tarjeta con progreso (mobile-kcal-consumed-bar #113)')`,
  `it('usa h-40 con el radio de card')`:
  `mockListPets.mockReturnValue(pending<PetsState>())`; `await renderFood()`;
  `expect(screen.getByTestId('food-plan-skeleton').props.className).toBe('h-40 w-full rounded-card')`.
  **Mismo commit**: en `it('shows the hub and a loading state while pets are pending'`,
  `expect.stringContaining('h-32'),` → `expect.stringContaining('h-40'),`
  (único `h-32` del fichero).
- [ ] **(2) Commit verde** `feat(kcal-bar): grow the plan skeleton to h-40 (R5)`.
  `food.tsx`: en el `Skeleton` con `testID="food-plan-skeleton"`,
  `className="h-32 w-full rounded-card"` → `className="h-40 w-full rounded-card"`.
- [ ] **(3) Refactor + sonda**: `h-40` → `h-44` → rojo.

## Cierre (Codex; el `leader` repite los comandos)

- [ ] Suite móvil completa, `tsc` y lint **sin pipe**, cada uno con
      `echo "exit=$?"` (comandos en [[design]] §6). Cero suites rojas nuevas
      respecto a la base medida al arrancar (delta, no recuento absoluto).
- [ ] Filtros con `(tabs)` siempre con `--runTestsByPath`, y el número de
      suites impreso coincide con el de ficheros pedidos.
- [ ] Grep-clean de [[design]] §6: todos vacíos. `package.json`, `bun.lock` y
      `src/theme/` sin diff contra `origin/main`.
- [ ] [[traceability]] con R1-R5 rellenas (título literal del `describe`,
      hash rojo, hash verde) y **sin rebase posterior**. R6 queda «pendiente
      del humano».
- [ ] `progress/impl_mobile-kcal-consumed-bar.md`: bases medidas, deltas
      aplicados (con la suma final escrita), las sondas de cada R con su rojo,
      y la salida sin pipe de los comandos de cierre.
- [ ] **No** marcar la feature `done`, **no** mergear, **no** abrir PR: eso
      es del leader tras el `reviewer` y la casilla de R6.

## R6 — Gate humano (lo corre el humano, no Codex ni el reviewer)

- [ ] Prueba de humo de [[requirements]] §Prueba de humo en dev build de
      Android, firmada en su casilla.
