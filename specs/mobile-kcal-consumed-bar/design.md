---
feature: "mobile-kcal-consumed-bar"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-kcal-consumed-bar]] (#113)

> Ver [[requirements]] para los requisitos y
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI (gate C8).
> Escrito para ser **autosuficiente**: quien implementa (Codex CLI) no tiene
> la conversación que lo originó. Rutas relativas a `mobile-pet-tracker/`
> salvo `docs/`, `specs/`, `progress/`. Base `103a3366`. Anclas por contenido
> grepeable, nunca por número de línea.

## 0. Capas

La app móvil es cliente de presentación: no tiene capas domain/application
propias (`docs/architecture.md` describe el backend). Todo el cambio es
**infraestructura de UI**: un tipo del cliente HTTP, una pantalla, el
catálogo y sus tests. Nada de `backend-pet-tracker/`.

## 1. Qué dijeron las skills, y qué hay que escribir aquí porque Codex no lo tiene

Se cargaron `expo-overview`, `expo-native-ui`, `expo-design-system` y
`expo-animation` (plugin `expo` 1.13.6). **Codex tiene el plugin 1.0.2 con 13
skills y ninguna de animación** (`.claude/agents/leader.md` §Catálogo real de
skills de Codex): la única que le sirve aquí es `building-native-ui`. Todo lo
que sigue va escrito para que no dependa de ninguna otra.

- **`expo-overview`** — SDK 57 (`expo ~57.0.14`); documentación pineada a la
  versión, nunca `latest`. Cero instalaciones.
- **`expo-native-ui`** — cifras tabulares en contadores
  (`fontVariant: ['tabular-nums']`), `borderCurve: 'continuous'` **solo** en
  esquinas no-cápsula, nada de `StyleSheet.create`. De `Color`/`PlatformColor`
  **no** se toma nada: la carta fija uniwind + tokens de `global.css`
  (§Decisiones fijas 1).
- **`expo-design-system`** — «Adopt before you build»: el sistema existe
  (tokens en `src/theme/global.css`, `Card` compartido); se extiende en su
  idioma. Un valor que se repite dos veces es token: `/20` sobre
  `accent-foreground` aparece **una** vez, así que va como modificador de
  opacidad (precedente vivo: `border-danger/20` en `src/screens/map/index.tsx`),
  no como token nuevo.
- **`expo-animation`**, en su orden:
  1. *¿Anima?* Frecuencia «occasional» (servir/deshacer, pocas veces al día) →
     animación estándar. Propósito: **evitar un cambio brusco** (el relleno
     teletransportaría su ancho) e **indicar estado** (el día avanza).
  2. *Herramienta.* La skill pone primero la transición CSS de Reanimated;
     **descartada por medición de #106**: en jest sus props no llegan al host y
     el requisito se quedaría sin candado. Shared value + `useAnimatedStyle` +
     `withTiming`, como `src/screens/home/index.tsx`.
  3. *Propiedad.* `width`. La skill exime de «nunca animes width» al relleno de
     una barra de progreso: nodo sin hijos, y `scaleX` embarraría el
     `rounded-full`. Aquí el relleno no es `absolute`, pero es **hijo único** de
     un carril de alto fijo: el re-layout afecta a un nodo. Mismo razonamiento
     que #106.
  4. *Timing o spring.* Ningún dedo lo mueve → timing. «Moving / morphing on
     screen → ease-in-out» → `Easing.bezier(0.77, 0, 0.175, 1)`. Nunca string
     `'cubic-bezier(...)'` (Reanimated 4.5.1 lo rechaza).
  5. *Duración.* La skill da 150-200 ms; **la carta manda** («250 ms
     transición») y #106 eligió 250 para la barra hermana de la Home. 250.
  6. *Hilo.* `useAnimatedStyle` corre en el hilo de UI. Con React Compiler
     activo (`"reactCompiler": true` en `app.json`), el shared value se toca
     con **`.get()` / `.set()`**, nunca `.value` (precedentes:
     `floating-tab-bar.tsx`, `pet-hero-header.tsx`,
     `weekly-activity-chart.tsx`), y **solo** en el efecto y en el worklet,
     jamás durante el render.
  7. *Reduce motion.* Sale con la animación: `reduceMotion: ReduceMotion.System`
     en la config.

## 2. Decisiones técnicas

### D1 — Barra sola, a todo el ancho, conservando el tile `ForkKnife` (R2) — **firma del humano**

| Opción | A favor | En contra |
|---|---|---|
| **Barra sola (elegida)** | Da **todo** el dato (kcal servidas, %, y el objetivo ya está arriba). Misma anatomía que la barra de comidas de la Home (#98) y misma receta de movimiento (#106): la app tiene **un** modo de pintar progreso del día. Solo `View` y clases del sistema, sin color imperativo. El tile y su candado (`#62 R4`) no se mueven; `specs/mobile-food/design.md` D2 («el ring SVG no se implementa») sigue siendo verdad | Se aparta del Make: falta el anillo |
| Anillo solo | Ocupa el hueco del tile, fiel a esa mitad del Make | Pierde la cifra `890 kcal` o hay que colocarla en otro sitio; **retira el tile**, lo que mueve `'size-14 items-center justify-center rounded-xl bg-surface-secondary'` de `consistency-classnames.test.ts` y **contradice D2 aprobada de `mobile-food`** → enmienda con firma; el trazo va por `useThemeColors` (color imperativo) |
| Ambos (Make literal) | Fidelidad total | **El mismo porcentaje dos veces** en la misma tarjeta: doble codificación y, para TalkBack, dos elementos que dicen lo mismo. Suma todos los costes del anillo a los de la barra y dobla la superficie de test |

**Colocación.** El Make mete la barra en la columna izquierda porque el anillo
ocupa la derecha. Sin anillo, la barra va como **segundo hijo del `Card`**, a
todo el ancho, debajo de la fila actual; el `Card` ya declara `className="gap-4"`
y hoy solo tiene un hijo. La fila existente no cambia ni un carácter.

### D2 — Fórmula y bordes (R2)

```ts
// en FoodScreen, junto a `const servedMeals = loadedPlan?.servedToday.length ?? 0;`
const kcalPct =
  loadedPlan !== null && loadedPlan.merKcal > 0
    ? Math.round((loadedPlan.kcalConsumedToday / loadedPlan.merKcal) * 100)
    : 0;
```

- Misma fórmula que el Make y que la Home. Medido: en el dominio alcanzable
  (§Contrato de datos de [[requirements]]) no difiere de multiplicar primero.
- **Guarda `merKcal > 0`**: alcanzable (C6 de [[requirements]]); sin ella,
  `0/0` pinta `NaN%` y un ancho inválido. Mismo patrón que `total > 0` en la
  Home.
- **Sin recorte a 100**: `kcalConsumedToday ≤ merKcal` lo garantiza #104 por
  construcción; recortar escondería un bug del backend.
- **El móvil lee `kcalConsumedToday`, nunca lo deriva** de `servedToday` ni de
  `mealsPerDay`: una sola fuente, la del backend (D4 de #104). El caso
  1420/890 del test lo canda.
- `kcalPct` se calcula en **cada** render a partir de `loadedPlan`, que
  TanStack Query refresca tras `plan.refetch()` en `toggleMeal`: al servir sube
  y al deshacer baja sin llamadas nuevas.

### D3 — Animación (R4)

```ts
// módulo, junto a los imports (NO exportado: los tests escriben 250 y la curva a mano)
const AnimatedView = Animated.createAnimatedComponent(View);
const KCAL_BAR_TIMING = {
  duration: 250,
  easing: Easing.bezier(0.77, 0, 0.175, 1),
  reduceMotion: ReduceMotion.System,
};

// en FoodScreen, tras kcalPct
const kcalBarWidth = useSharedValue(kcalPct);
const kcalBarStyle = useAnimatedStyle(() => ({
  width: `${kcalBarWidth.get()}%` as `${number}%`,
}));
useEffect(() => {
  kcalBarWidth.set(withTiming(kcalPct, KCAL_BAR_TIMING)); // en R2: kcalBarWidth.set(kcalPct);
}, [kcalBarWidth, kcalPct]);
```

- **Imports**: `import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';`
  y `useEffect` junto a `useState` en `import { useState } from 'react';`.
  En R2 solo entran `Animated`, `useAnimatedStyle` y `useSharedValue`; R4
  añade `Easing`, `ReduceMotion` y `withTiming`.
- **Por qué `withTiming` y no spring**, aunque la carta diga «springs para lo
  que entra/sale o responde a gesto; timings solo para opacidad/color»: el
  relleno ni entra ni sale ni lo mueve un dedo; lo mueve un dato del servidor.
  Un spring no aporta velocidad que conservar y su rebote haría pasar la barra
  de 100 %. Y es **exactamente** la receta que el humano firmó en #106 para la
  barra hermana de la Home: las dos barras se mueven igual.
- **Interrumpible**: una asignación nueva de `withTiming` cancela la que está
  en curso y parte del valor actual (servir y deshacer rápido no salta).
- **Arranque**: el shared value nace en `0` (sin plan aún) y la primera carga
  anima de 0 al porcentaje. Es el mismo comportamiento que la Home y se acepta.
- **Reduce motion**: `ReduceMotion.System` hace que Reanimated asiente el valor
  sin animar cuando el sistema lo pide. **No** se añade `useReducedMotion()` +
  rama JS como en la Home: es el mismo efecto por otro camino, un hook más y
  una rama más que testear. En jest no es observable (el doble sustituye a
  `withTiming`); lo observable y nuestro es la config, y R4 la asevera. El
  comportamiento real lo verifica el paso 5 del smoke.
- **Sin temporizadores en el test**: el doble convierte `withTiming` en la
  identidad, el valor asienta en el acto y `toHaveAnimatedStyle` lee el final.
  Cero `advanceTimersByTime`, cero ventana que calibrar.
- **Sin háptico nuevo**: `toggleMeal` ya vibra una vez por acción (#106 R4).
  Uno por acción es regla absoluta.

### D4 — Color, tipografía y forma (R2)

| Nodo | Decisión | Por qué |
|---|---|---|
| carril `food-plan-track` | `h-2 overflow-hidden rounded-full bg-accent-foreground/20` | Make: `h-2 rounded-full overflow-hidden` sobre `rgba(255,255,255,0.2)`. `accent-foreground` es `#FFFFFF` en los dos temas. Cápsula ⇒ `rounded-full` y **sin** `CONTINUOUS_CORNER` (carta §Decisiones fijas 12; `#62 R14` lo exige) |
| relleno `food-plan-fill` | `h-full rounded-full bg-accent-foreground` | Make: `bg-white`. Relleno blanco frente al carril mezclado (`#459B77`): **3,38:1**, pasa el 3:1 de componente no textual |
| textos `food-plan-consumed`, `food-plan-percent` | `text-xs font-normal text-accent-foreground` + `style={TABULAR_NUMS}` | Make: `text-xs text-white/70`. Blanco al 70 % sobre `#178255` da **3,20:1** (no pasa AA en 12 px); a opacidad plena, **4,82:1**. Ya es regla del repo: `#61 R3` prohíbe componer con opacidad el texto sobre la tarjeta de acento. Cifras tabulares: cambian al servir y no deben bailar |
| bloque `food-plan-progress` | `gap-1.5` | Make: `mb-1.5` entre cabecera y carril |
| cabecera (sin testID) | `flex-row items-center justify-between` | Make: `flex justify-between` |

Contrastes calculados con la fórmula WCAG sobre los hex de `global.css`, no
estimados. Cero hex, cero `[...]`, cero `StyleSheet` en `food.tsx`.
`TABULAR_NUMS` se importa de `../../theme/native-styles` en la **misma**
línea que ya importa `CONTINUOUS_CORNER`
(`import { CONTINUOUS_CORNER, TABULAR_NUMS } from '../../theme/native-styles';`).

### D5 — Copy y accesibilidad (R3)

- **`{kcalConsumedToday} kcal` y `{kcalPct}%` van en línea**, no al catálogo:
  D7 de #65 («las unidades no entran al catálogo… `kcal`, `g`, `%`») y
  `` `${pct}%` `` ya clasificado como unidad en `home.tsx` y `pairing`. Mismo
  patrón que `{portionGrams} g` en esta pantalla.
- **`food.dailyTarget` y `food.dailyKcal` no cambian de sitio ni de uso**: la
  etiqueta y el número grande siguen igual. Ninguna encaja en el texto nuevo
  (`dailyKcal` lleva «/ día», que aquí sería falso).
- **Una clave nueva**, `food.kcalConsumedOfTarget`, solo como nombre accesible.
  Sin ella, TalkBack leería «890 kcal 63 %», que no dice de qué. Se escribe
  «**servidas**», no «consumidas»: el backend sabe qué franjas se sirvieron, no
  si la mascota se las comió (D3 de #104), y casa con
  `food.mealsServedOfTotal` («comidas servidas»). Marcadores `{{consumed}}` y
  `{{target}}` en los dos idiomas.
- **Un único elemento accesible**: el bloque lleva `accessible`,
  `accessibilityRole="progressbar"` y
  `accessibilityValue={{ min: 0, max: 100, now: kcalPct }}`. Android anuncia
  rol y porcentaje de forma nativa; los dos textos y la barra no se leen por
  separado. La Home puso el nombre accesible en el contador porque allí el
  bloque no era una barra única; aquí sí lo es.
- **No es pulsable**: sin `onPress`, sin feedback de pulsado, sin navegación.
- **Sin `selectable`**: coherente con `food-plan-kcal`, que tampoco lo es, y
  dentro de un grupo `accessible` no aportaría.

Registro en la tabla de idioma (`specs/mobile-ui-language/design.md` §2.6),
formato de las filas de #98:

```
| — | `food.kcalConsumedOfTarget` **(param)** | `{{consumed}} of {{target}} kcal served today` | `{{consumed}} de {{target}} kcal servidas hoy` | ← añadida por #113 (R3)
```

En `src/i18n/catalog.ts`, detrás de `'food.dailyGrams': '{{grams}} g / day',`
(en `en`) y de `'food.dailyGrams': '{{grams}} g / día',` (en `es`). #95 retira
claves `back*` en otras zonas del fichero; estas líneas no las toca.

### Las doce decisiones de la carta (§Enmienda #70), una a una, y dónde se candan

El bloque no es una fila repetida, pero es compuesto (cabecera de dos textos +
carril + relleno), y la lista de la carta es la que evita que la revisión
destape una dimensión por ronda.

| # carta | Decisión en `food-plan-progress` | Candado |
|---|---|---|
| 1 dato | izquierda `kcalConsumedToday`, derecha y ancho `kcalPct`, objetivo `merKcal` (en la etiqueta) | R2 (b) siete filas, R3 (a) |
| 2 icono | **ninguno** (el tile `ForkKnife` es de la fila, no del bloque) | R2 (a): `children` exactos en cada nivel |
| 3 etiqueta visible | ninguna clave: `{n} kcal` y `{pct}%` en línea (D5) | R2 (b) texto exacto |
| 4 nombre accesible | `food.kcalConsumedOfTarget` + rol + valor | R3 (a) |
| 5 fondo | carril `bg-accent-foreground/20`, relleno `bg-accent-foreground` | R2 (a) `className` exacto |
| 6 tinta de icono | no aplica (sin icono) | — |
| 7 color y receta de **cada** texto | los dos `text-xs font-normal text-accent-foreground` + tabulares | R2 (a), por texto |
| 8 destino | ninguno, no pulsable | R2 (a): `props.onPress` indefinido |
| 9 condición de render | solo con `loadedPlan !== null`; recuento 1 en siete escenarios, 0 sin plan | R2 (a), (b), (c) |
| 10 forma del contenedor | bloque `gap-1.5`; cabecera `flex-row items-center justify-between`; carril `h-2 overflow-hidden rounded-full …` | R2 (a) |
| 11 envoltorios | ninguno con `flex-1`: el bloque ocupa el ancho del `Card` por ser hijo directo | R2 (a) `card.children` |
| 12 orden | `card`: fila, bloque; bloque: cabecera, carril; cabecera: consumidas, porcentaje | R2 (a) por posición |

Invariantes compartidos: radio (cápsula ⇒ `rounded-full`, sin
`CONTINUOUS_CORNER`: lo vigila `#62 R14` sin tocarlo), rol y agrupación
accesible (R3), feedback de pulsado (no aplica: no es pulsable). Recuento
siempre por `children.length`, nunca por prefijo de `testID`.

### D6 — Esqueleto (R5)

Alto estimado por tokens (Tailwind v4: `text-xs` 12/16, `text-3xl` 30/36,
`gap-1` 4, `gap-1.5` 6, `h-2` 8, `gap-4` 16, `p-5` 20; `food-plan-grams` no
declara tamaño → 14 px de RN, ≈17 de línea con Inter):

| | Cuenta | Total |
|---|---|---|
| Hoy | 20 + (16 + 4 + 36 + 4 + 17) + 20 | ≈117 px (el `h-32` actual reserva 128) |
| Con el bloque | 117 + 16 (`gap-4`) + (16 + 6 + 8) | ≈163 px |

El paso de Tailwind más cercano a 163 es **`h-40` (160)**; `h-44` (176) se
pasa por 13. El esqueleto de comidas (`h-56`) y el de horario (`h-20`) no
cambian.

### D7 — Por qué `docs/ui-guidelines.md` no se enmienda

#98 enmendó la carta porque retiraba una decisión aprobada (D7 de
`mobile-food`). #113 no retira ninguna: el anillo sigue sin implementarse
(D2 de `mobile-food`), y las tres reglas que aplica (texto de acento a
opacidad plena, cápsula sin esquina continua, cifras tabulares) ya están
escritas y candadas. Las decisiones propias viven en esta spec.

## 3. Arnés de test (medido contra el fichero destino)

`src/app/(tabs)/__tests__/food.test.tsx` **no** dobla hoy
`react-native-reanimated`, y renderiza tres componentes de heroui que lo usan
por dentro: `Spinner` (`food-loading`), `Skeleton` (los tres esqueletos) y
`Button`. Se midió con un `setupFilesAfterEnv` desechable **fuera del repo**
(scratchpad), sin crear ni tocar ningún fichero del árbol (`git status`
limpio antes y después), sobre los 38 tests de `103a3366`:

| Doble | Resultado | Por qué |
|---|---|---|
| ninguno (base) | 38/38 verdes | — |
| solo `withTiming` → identidad | **35 rojos**, `AggregateError` | heroui compone `withRepeat(withSequence(withTiming(360, …)))` y `withRepeat(withTiming(1, …))`: `withRepeat`/`withSequence` reales reciben un número |
| `withTiming` + `withRepeat` | 35 rojos | falta `withSequence` (Spinner) |
| `withTiming` + `withRepeat` + `withSequence` | **38/38 verdes** | — |

Llamadas a `withTiming` que hace heroui en este fichero (valores de destino):
**360, 1, 1, 0**. Por eso R4 busca la llamada por su destino (50, 100) y no
usa `not.toHaveBeenCalled()`.

**Intención del doble** (se escribe en el commit rojo de R2; no se copia de
otra suite, y después de escribirlo se corre `food.test.tsx` **entero**):

- `jest.mock('react-native-reanimated', …)` a nivel de módulo que parte de
  `jest.requireActual('react-native-reanimated')`, conserva `__esModule: true`
  (food.tsx importa `Animated` por defecto) y sustituye **exactamente tres**
  funciones: `withTiming` → espía identidad que registra `(value, config)`
  (`const mockWithTiming = jest.fn((value: number, _config?: unknown) => value)`,
  prefijo `mock` para que jest permita la referencia desde la factoría);
  `withRepeat` → devuelve su animación; `withSequence` → devuelve su último
  paso. Todo lo demás, real.
- **No** se dobla `useReducedMotion` (Food no lo usa).
- Precedente de la forma, no para calcar: el doble de
  `src/screens/home/index.test.tsx` (que además dobla `withDelay`,
  `withSpring` y `useReducedMotion` porque la Home los necesita).
- `jest.clearAllMocks()` ya corre en el `beforeEach` global del fichero; el
  espía se limpia solo entre tests.

**`toHaveAnimatedStyle`** está disponible en todo el repo por
`require('react-native-reanimated').setUpTests()` en `test/jest-setup.js`.

**Ayudante de R4** (local en `food.test.tsx`, nombre propio para no
confundirlo con el de la Home):

```ts
function expectKcalBarTiming(target: number): void {
  const config = mockWithTiming.mock.calls.find(([value]) => value === target)?.[1];
  expect(config).toEqual(
    expect.objectContaining({ duration: 250, reduceMotion: ReduceMotion.System }),
  );
  const actual = (config as { easing: ReturnType<typeof Easing.bezier> }).easing.factory();
  const expected = Easing.bezier(0.77, 0, 0.175, 1).factory();
  for (const point of [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]) {
    expect(actual(point)).toBeCloseTo(expected(point), 6);
  }
}
```

`Easing` y `ReduceMotion` vienen de la **librería** (`react-native-reanimated`),
no del módulo bajo prueba: no es candado tautológico. Nueve puntos sobre una
familia de cuatro parámetros sobredeterminan la curva (lección de #106: dos
puntos dejaban un plano de curvas impostoras). Nunca se importa
`KCAL_BAR_TIMING` en el test: no se exporta.

## 4. Archivos afectados (lista cerrada; nada fuera de ella)

| Fichero | Qué cambia | R | ¿Lo toca #95? |
|---|---|---|---|
| `src/api/types.ts` | `NutritionPlan` + `kcalConsumedToday: number;` tras `servedToday` | R1 | no |
| `src/app/(tabs)/food.tsx` | `kcalPct`, `AnimatedView`, shared value, estilo animado, efecto, bloque `food-plan-progress` (R2); props de accesibilidad (R3); `withTiming` + `KCAL_BAR_TIMING` (R4); `h-32` → `h-40` en `food-plan-skeleton` (R5) | R2-R5 | no |
| `src/app/(tabs)/__tests__/food.test.tsx` | `makePlan` + `kcalConsumedToday: 0`; doble de Reanimated; cinco `describe` nuevos; delta `h-32` → `h-40` | R1-R5 | no |
| `src/screens/meal-schedule/index.test.tsx` | `makePlan` + `kcalConsumedToday: 0` | R1 | **sí** (reescribe; `makePlan` sobrevive) |
| `src/screens/home/index.test.tsx` | delta del `describe('#98 R1: …')`: `12 + 1` y `.slice(-3, -1)` | R1 | sí, en otras zonas |
| `src/i18n/catalog.ts` | + `food.kcalConsumedOfTarget` en `en` y `es` | R3 | sí, en otras zonas |
| `src/providers/__tests__/language-provider.test.tsx` | `+ 1` en la suma y en su comentario | R3 | **sí, la misma línea** |
| `src/__tests__/ui-copy-table.ts` | + 1 fila en `R6_FOOD` | R3 | sí, otra fila del mismo array |
| `src/__tests__/ui-language.test.ts` | `+ 1` en `#65 R6` y su título | R3 | **sí, la misma línea** |
| `specs/mobile-ui-language/design.md` | + 1 fila en §2.6 | R3 | sí, otras filas |
| `specs/mobile-kcal-consumed-bar/traceability.md` | hashes y títulos | todos | no |
| `progress/impl_mobile-kcal-consumed-bar.md` | reporte de Codex (nuevo) | todos | no |

**No se tocan, y conviene que quede escrito:** `package.json`, `bun.lock`,
`src/theme/global.css`, `src/theme/native-styles.ts`, `src/components/`,
`src/api/nutrition.ts`, `docs/ui-guidelines.md`,
`src/__tests__/design-drift.test.ts`,
`src/__tests__/consistency-classnames.test.ts`,
`src/__tests__/legibility-classnames.test.ts`, cualquier spec ajena salvo la
fila de `mobile-ui-language`, y todo `backend-pet-tracker/`.

## 5. Solape con #95 (Frontend, en review; probablemente mergea antes)

- **Colisión textual segura en dos líneas**: la suma de
  `expect(englishKeys).toHaveLength(` y la de `expect(R6_FOOD).toHaveLength(`
  (más el título de ese `it`). Las dos cambian en #95 y en #113. Regla del
  repo (memoria `candado-catalogo-omitido-en-specs`): **el segundo en mergear
  añade su delta sobre la línea del primero**, conservando la suma visible.
  Por eso todo está escrito como delta.
- **Lo demás no solapa**: #95 no toca `food.tsx`, `food.test.tsx`, `types.ts`
  ni las filas `food.*` del catálogo, de la tabla de usos o de la tabla de
  idioma.
- **Base al arrancar**: `git fetch` y comprobar si `origin/main` ya contiene
  #95. Si sí, el leader rebasa esta branch **antes** del primer commit de
  Codex (nunca después de rellenar la trazabilidad: los hashes dejarían de ser
  ancestros).
- **Infra compartida**: nadie lanza `./init.sh` mientras otra sesión lo use;
  esta feature no lo necesita para su verificación (§6).

## 6. Comandos de verificación

Desde `mobile-pet-tracker/`, **sin pipe** (`cmd; echo "exit=$?"`):

```bash
rm -f .expo/types/router.d.ts        # gitignorado; sus rutas fantasma rompen tsc
bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx'; echo "exit=$?"
bunx jest --runTestsByPath src/screens/home/index.test.tsx src/screens/meal-schedule/index.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts; echo "exit=$?"
bunx jest; echo "exit=$?"              # suite móvil completa
bunx tsc --noEmit; echo "exit=$?"
bun run lint; echo "exit=$?"
```

`--runTestsByPath` es obligatorio con `(tabs)`: en posicional es regex, el
fichero se salta **con exit 0** y parece verde. Comprobar que el número de
suites que imprime jest es el de ficheros pedidos.

Grep-clean (cada uno debe salir vacío):

```bash
grep -nE '#[0-9a-fA-F]{3,8}\b' 'src/app/(tabs)/food.tsx' src/api/types.ts | grep -vE '#[0-9]{2,3} R[0-9]'
grep -nE '[A-Za-z0-9_-]+-\[[^]]+\]' 'src/app/(tabs)/food.tsx'
grep -nE 'StyleSheet|shadowColor|shadowOffset|shadowOpacity|shadowRadius|elevation *:' 'src/app/(tabs)/food.tsx'
grep -nE 'rounded-(2xl|lg|md|sm)\b|opacity-(70|80)' 'src/app/(tabs)/food.tsx'
git diff --name-only origin/main -- package.json bun.lock src/theme/
```

## 7. Alternativas descartadas

- **Anillo, o anillo + barra** — D1.
- **Transición CSS de Reanimated** (`transitionProperty: 'width'`): la
  herramienta más barata de la skill, pero sin candado posible en jest (medido
  en #106, Q5).
- **`transform: scaleX` con `transformOrigin`**: evita el re-layout pero
  deforma el `rounded-full` y cambia la clase del relleno.
- **`useReducedMotion()` + rama JS** (como la Home): redundante con
  `ReduceMotion.System` (D3).
- **Importar `MEALS_BAR_TIMING` de `src/screens/home/index.tsx`**: una ruta
  importando el cuerpo de otra pantalla arrastra la Home entera al grafo de
  Food (y a su test, cuyos dobles de iconos no cubren los de la Home).
  Promoverlo a `src/theme/` tocaría la Home y sus candados de #106: refactor
  aparte.
- **Token nuevo `--color-accent-track` en `global.css`**: un solo uso; la carta
  pide token a partir de dos.
- **Poner el nombre accesible en el texto de kcal** (patrón de la Home):
  dejaría el porcentaje y la barra como elementos sueltos para TalkBack.
- **`kcal` y `%` al catálogo**: contradice D7 firmada de #65.
- **Fórmula que multiplica primero** (`Math.round((c * 100) / m)`): 0
  diferencias medidas en el dominio alcanzable; se prefiere la del Make y la
  Home.
- **Recortar `kcalPct` a 100**: escondería un bug del backend que el contrato
  de #104 ya excluye.
- **Mover `food.tsx` a `src/screens/food/` de paso**: deuda de #102, no de esta
  feature.
