---
feature: "mobile-meals-bar-motion"
status: spec_ready
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-meals-bar-motion]] (#106 + #107)

> Ver [[requirements]] para los requisitos y
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI (gate C8).
> Rutas relativas a `mobile-pet-tracker/` salvo donde se indique.
> Base: `9df7b5bc`.

## 1. Qué dijeron las skills

La carta obliga a cargar `expo-overview` y, para trabajo de movimiento,
`expo-animation`. Se cargaron las dos. Lo que aportaron, y lo que se hizo con
ello:

**`expo-overview`** — es un router. Lo aprovechable para esta feature:

- confirma que hay que leer la documentación **pineada a la versión**
  (`https://docs.expo.dev/versions/v57.0.0/`), nunca `latest`;
- manda instalar con `expo install` y no con el gestor a pelo, para que el
  rango lo fije el SDK. En este repo eso es `bunx expo install`
  (`docs/conventions.md` §Convenciones de la app móvil);
- deriva el trabajo de motion, gestos y **haptics** a `expo-animation`.

**`expo-animation`** — de aquí salen cuatro decisiones, no una:

1. **La puerta de frecuencia (§1).** La barra cambia «ocasionalmente» —cuando
   el usuario sirve o deshace una comida, unas pocas veces al día—, que es el
   tramo de «Standard animation». El propósito nombrado (§2) es **prevenir un
   cambio brusco**: hoy el relleno teletransporta su ancho. Pasa la puerta.
2. **La excepción de `width` (§4).** La regla general es «nunca animes
   `width`/`height`/`flex`: re-corren Yoga cada frame». La excepción textual
   de la skill es *«an absolutely positioned element with no children — a tab
   pill, **a progress bar fill**. It's out of flow, so nothing else
   re-lays-out, and animating `width` keeps the corner radius that `scaleX`
   would smear»*. Nuestro relleno **no** es `absolute`, pero es **hijo único
   de un track de altura fija y no tiene hijos**: el re-layout afecta a un
   nodo, sin hermanos ni descendientes. Y el motivo textual de la excepción
   —`scaleX` embarra el radio— aplica igual: el relleno es `rounded-full`. Se
   toma la excepción y **no** se pasa a `absolute` para «cumplirla de forma»:
   eso movería el `className` del relleno y la cardinalidad del track, que son
   candados vivos de #98.
3. **Duración y curva (§5).** «Toggle, small state change: 150–200ms» y
   «Moving / morphing on screen → ease-in-out», con
   `EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1)`. La curva se toma tal cual.
   La duración **no**: la carta de este repo manda sobre la skill (regla 1 de
   §Skills de `docs/ui-guidelines.md`) y fija «250ms transición», que además
   es el valor que ya usan los dos precedentes vivos
   (`BAR_ENTRY_DURATION_MS = 250` y el `duration: 250` del spring del selector
   de métrica). Se elige **250 ms** por consistencia interna.
4. **Haptics (§8) y su tabla.** «Operation succeeded or failed →
   `notificationAsync(Success / Error)`». Y sus tres reglas absolutas —mismo
   frame que el visual, uno por acción, nunca el único feedback— son las que
   fijan **dónde** va la llamada dentro de `toggleMeal` (después de los
   refetch, no en el `onPress`).

También aportó dos avisos de entorno que resultaron decisivos:

- *«In an Expo project, `babel-preset-expo` configures the worklets Babel
  plugin automatically — no `babel.config.js` step»*. Verificado en el árbol
  (§2). Es la respuesta a «por qué no hay `babel.config.js`».
- *«Reanimated 4.1.1 and 4.5.1 reject raw `'cubic-bezier(...)'` strings»* — en
  `withTiming` la curva se escribe con `Easing.bezier(...)`, que es lo que
  prescribe R2.

Lo que la skill propone y **no** se adopta, con su razón:

- **Transición CSS de Reanimated** (`transitionProperty`), que su §3 pone como
  el peldaño más barato para «un valor que cambia sin gesto». Refutada por
  medición (§4): en jest sus props no llegan al host, así que el requisito se
  quedaría sin ningún candado posible salvo una regex sobre el fuente. En este
  repo un candado débil es un candado que el reviewer rebota.
- **`scale: 0.97` en el press** del botón por franja. Es la receta de la skill
  para press feedback, pero este repo ya tiene una decisión firmada y
  uniforme (`opacity: 0.8`, carta §Micro-reglas de pulido), y #107 es un
  **candado**, no un rediseño. Cambiar la receta convertiría un requisito de
  verificación en un cambio de conducta.

## 2. Por qué no hay `babel.config.js` (y por qué no se crea)

Se verificó en el árbol, no se asumió:

- `jest-expo@57.0.4` resuelve las opciones de babel en
  `node_modules/jest-expo/src/resolveBabelOptions.js`: busca los catorce
  nombres de fichero de configuración de babel en el project root y, **si no
  encuentra ninguno**, cae a `require.resolve('expo/internal/babel-preset')`,
  es decir `babel-preset-expo`.
- `babel-preset-expo@57.0.7`, en `build/configs/expo.js:107-112`, añade
  automáticamente `react-native-worklets/plugin` cuando el paquete está
  instalado — y lo está (`react-native-worklets 0.10.1`).

Conclusión operativa: **la ausencia del fichero es la configuración**. Crear un
`babel.config.js` para «asegurar» el plugin cambiaría la rama de resolución y
es exactamente el tipo de cambio que rompe el transform sin aviso. R1 lo canda
con una aserción de no-existencia.

## 3. Cómo se testean hoy las animaciones en este repo

Ocho ficheros de `src/` usan Reanimated. Hay **dos** patrones de test vivos, y
esta spec usa el primero:

| Patrón | Dónde | Cómo funciona |
|---|---|---|
| **Doblar las funciones de animación con la identidad** | `src/screens/home/weekly-activity-chart.test.tsx:58-66` y `src/components/__tests__/pet-hero-header.test.tsx:60-79` | `jest.mock('react-native-reanimated', () => ({ ...requireActual, withTiming: jest.fn((v) => v), ... }))`. El shared value asienta en el acto, así que `toHaveAnimatedStyle` lee el valor final **sin temporizadores**, y además la config de la animación se asevera por los argumentos del mock (`weekly-activity-chart.test.tsx:927-944`) |
| **Reloj falso y avance manual** | `src/components/__tests__/floating-tab-bar.test.tsx:204-215` | `jest.advanceTimersByTime(300)` y luego `StyleSheet.flatten(props.style)` |

Se elige el primero **por la lección de la memoria del repo sobre ventanas de
timer**: con la identidad no hay ventana que derivar ni que ampliar, y la
aserción de la config (`duration`, `easing`, `reduceMotion`) es exacta en vez
de inferida del reloj.

El precedente más cercano es el **indicador del selector de métrica**
(`weekly-activity-chart.tsx:262-331` + su test `:886-951`): anima **`width`**
con un shared value, lo pinta en un `Animated.createAnimatedComponent(View)`
con `className`, y lo asevera con `toHaveAnimatedStyle({ width: 144 })` más
`expect(mockWithSpring).toHaveBeenNthCalledWith(1, 152, expect.objectContaining({ duration: 250, dampingRatio: 1, reduceMotion: ReduceMotion.System }))`.
R2 y R3 son ese patrón con `withTiming` en vez de `withSpring`.

### Detalle que no se puede omitir al doblar Reanimated en `index.test.tsx`

`src/screens/home/index.tsx:74` importa `WeeklyActivityChart`, y
`src/screens/home/index.test.tsx` **no** lo dobla: se renderiza de verdad. Su
`ActivityBar` compone `withDelay(delay, withTiming(1, {...}))`
(`weekly-activity-chart.tsx:125-128`). Si el doble sustituye **solo**
`withTiming` por la identidad, el `withDelay` real recibiría un número en vez
de una animación. Por eso el doble de `index.test.tsx` tiene que cubrir
`withTiming` **y** `withDelay`, igual que hace el de
`weekly-activity-chart.test.tsx:63-65`.

Esto **no** es «copiar el mock de otra suite»: es la consecuencia de que el
fichero destino renderiza el mismo componente para el que se escribió aquel
mock. Antes de escribirlo, ábrase `weekly-activity-chart.test.tsx:58-66` y
compruébese qué símbolos dobla y cuáles deja reales; y después de escribirlo,
córrase `index.test.tsx` **entera**, no solo los describes nuevos: un doble a
nivel de módulo afecta a las 40+ pruebas del fichero.

## 4. Lo que se midió contra el árbol renderizado, y qué salió

Se montó una sonda desechable bajo `test/` con `bunx jest --runTestsByPath`,
se leyó el árbol y se borró; `git status` quedó limpio. Cinco preguntas, cinco
respuestas:

| # | Pregunta | Resultado medido | Consecuencia |
|---|---|---|---|
| Q1 | Para un `Pressable` con `style` de **función** y `className`, ¿qué es `element.props.style`? | Un **objeto ya resuelto**: `{"opacity":1}`. `typeof` es `'object'`, no `'function'` | **Mata el camino A de #107.** `toggle.props.style({ pressed: true })` lanzaría «style is not a function» |
| Q2 | ¿Se puede forzar el estado `pressed` desde el test? | `fireEvent(el, 'pressIn')` deja el estilo en `{"opacity":1}` | Lo mata por segunda vez: no hay forma de observar `0.8` desde jest |
| Q3 | ¿`Animated.createAnimatedComponent(View)` conserva el `className` que procesa uniwind? | Sí, **idéntico**: `"h-full rounded-full bg-accent"` | El candado `expect(fill.props.className).toBe(...)` de `index.test.tsx:3696` **sobrevive sin tocarse** |
| Q4 | ¿Qué es `props.style` en ese componente animado, y funciona `toHaveAnimatedStyle` con un porcentaje en cadena? | `props.style` es `[{"width":"50%"}]` (array, no objeto) y `toHaveAnimatedStyle({ width: '50%' })` **pasa** | Fija el delta exacto de los dos candados que R2 mueve, y confirma que animar un `width` en porcentaje desde un worklet es aseverable |
| Q5 | ¿Sobrevive una transición CSS de Reanimated hasta el host? | El componente renderiza, pero `props.style` vuelve a ser `[{"width":"50%"}]`: `transitionProperty`, `transitionDuration` y `transitionTimingFunction` **no llegan** | Descarta la transición CSS: no habría nada que aseverar |

La sonda existió porque el encargo pedía literalmente comprobar el camino A
«contra el árbol renderizado antes de casarse con él», y porque la memoria del
repo registra tres paradas por premisas de exploración no verificadas.

## 5. El candado de #107, elección de camino

`progress/handoff_98_rebote_meal-toggle.md` daba dos caminos y pedía intentar
el A primero. **El A está refutado** (Q1 y Q2 de §4). Se va al B, con dos
cambios respecto a como estaba escrito:

- **No se normaliza `food.tsx:253-255` a una línea.** El handoff lo pedía para
  poder reutilizar la regex literal de la Home. En su lugar la regex se escribe
  tolerante al salto de línea y a la coma final, y se verificó que casa con
  **las dos** formas: las tres líneas de `food.tsx` y la línea única de
  `src/screens/home/index.tsx:314` y `:626`. Resultado: el diff neto de
  producción por R5 es **cero**, y no hay riesgo de que un reformateo revierta
  la normalización.
- **La regex va acotada al bloque del `Pressable`**, no al fichero entero,
  copiando la técnica de anclaje de `index.test.tsx:3289-3293`. Sobre el
  fichero completo, el candado pasaría aunque el botón perdiera su `style`.

Se añade la aserción sobre el árbol (`opacityOf(...)` vale `1`) porque cubre
un fallo que la regex no ve: que el `style` siga escrito pero deje de llegar
al componente.

## 6. Archivos afectados

Esta feature es **infrastructure** completa en los términos de
`docs/architecture.md`: la app móvil es un cliente de presentación y no tiene
capas domain/application propias. No se toca ninguna entidad, puerto ni caso de
uso, ni nada de `backend-pet-tracker/`.

| Archivo | Qué cambia | R |
|---|---|---|
| `mobile-pet-tracker/package.json` | gana `expo-haptics` en `dependencies`, con el rango que resuelva `bunx expo install` | R1 |
| `mobile-pet-tracker/bun.lock` | se actualiza solo, por el install | R1 |
| `docs/ui-guidelines.md` | la línea `:171-172` se sustituye por la redacción literal de R1 | R1 |
| `mobile-pet-tracker/src/screens/home/index.tsx` | `AnimatedView`, shared value, `useAnimatedStyle`, `useEffect` con `withTiming`, guarda de reduce motion y tres constantes exportadas; el relleno `reminders-meals-fill` pasa de `View` a `AnimatedView` | R2, R3 |
| `mobile-pet-tracker/src/screens/home/index.test.tsx` | doble de Reanimated a nivel de módulo, dos describes nuevos, y **exactamente dos** aserciones existentes reescritas (`:3697` y `:3716-3718`) | R2, R3 |
| `mobile-pet-tracker/src/app/(tabs)/food.tsx` | import de `expo-haptics` y una llamada `notificationAsync` dentro de `toggleMeal`; el `style` del `meal-toggle` se quita en el commit rojo de R5 y **se restaura idéntico** en el verde | R4, R5 |
| `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx` | doble de `expo-haptics` y tres describes nuevos (R1, R4, R5) | R1, R4, R5 |
| `progress/audit_animations_mobile.md` | nota fechada al final de §3 sobre sus rechazos R5 y R7 | R4 |

**Ficheros que esta feature NO toca, y conviene que quede escrito:**
`src/i18n/catalog.ts`, `src/providers/__tests__/language-provider.test.tsx`,
`specs/mobile-ui-language/design.md` (cero claves nuevas),
`src/api/`, `src/components/`, `app.json`, `app.config.ts`, cualquier spec
ajena, y cualquier fichero de `backend-pet-tracker/` o `infra/`.

## 7. Riesgo de conflicto con la sesión de #94

`#94 mobile-map-staleness-single-source` está en vuelo en el worktree
`Pet-Tracker-wt-ui` (PR #143, abierta). Sus ficheros son `map.tsx`,
`device-connectivity.ts`, `design-drift.test.ts`, `ui-copy-table.ts` y
`ui-language.test.ts`. Ninguno coincide con los de §6, **y la intersección se
ha evitado a propósito**:

- **`src/__tests__/design-drift.test.ts` — riesgo evitado.** Su `it('contains
  the approved dependencies')` (`:149-158`) es el sitio natural para candar
  `expo-haptics`, y es uno de los ficheros de #94. El candado se pone en
  `food.test.tsx` en su lugar (decisión D10). Si el reviewer prefiere el sitio
  natural, que sea **después** de que #94 entre en `main`, y como cambio
  aparte.
- **`src/__tests__/ui-language.test.ts` y `ui-copy-table.ts` — sin roce**,
  porque esta feature no añade ni una clave de copy (D7).
- El único acoplamiento real entre las dos sesiones es la infraestructura
  compartida: Postgres y LocalStack. Nadie lanza `./init.sh` hasta que la otra
  sesión avise explícitamente.

## 8. Comandos de verificación

Desde `mobile-pet-tracker/`. **Nunca `./init.sh`** mientras #94 esté en vuelo.

```bash
rm -f .expo/types/router.d.ts        # gitignorado; sus rutas fantasma rompen tsc
bunx jest --runTestsByPath 'src/screens/home/index.test.tsx'
bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx'
bunx jest --runTestsByPath 'src/screens/home/weekly-activity-chart.test.tsx'
bunx jest --runTestsByPath 'src/providers/__tests__/language-provider.test.tsx'
bunx jest                            # suite móvil completa
bunx tsc --noEmit
```

`--runTestsByPath` es obligatorio para cualquier ruta con `(tabs)`: los
argumentos posicionales de jest son **regex**, `(tabs)` se interpreta como
grupo de captura y el fichero se salta **en silencio con exit 0**
(`docs/conventions.md` §Filtros de jest con rutas que llevan paréntesis).

Dos medidas más, sin pipe —`cmd | tail` devuelve el código de `tail`, no el de
`cmd`—:

- que el número de suites que imprime jest coincida con el de ficheros que el
  filtro pretendía coger;
- que la suite completa quede verde con **cero suites nuevas rojas respecto a
  `9df7b5bc`** (delta contra ese commit, nunca un recuento absoluto: un número
  de tests caduca entre la firma y la implementación).

## 9. Alternativas descartadas

- **Transición CSS de Reanimated** (`transitionProperty: 'width'`): es el
  peldaño más barato de la skill y el diff más corto, pero en jest sus props no
  llegan al host (Q5 de §4), así que R2 se quedaría sin candado observable.
  Descartada por testabilidad, no por coste.
- **`layout={LinearTransition}`** sobre el relleno: aún menos código, pero
  aseverar una animación de layout en jest obliga a inspeccionar una prop de
  builder y no hay precedente en el repo. Mismo motivo.
- **`transform: [{ scaleX }]` con `transformOrigin: 'left'`**: evitaría el
  re-layout, pero deforma el `rounded-full` del relleno —que es precisamente el
  motivo por el que la skill exime a las barras de progreso de la regla— y
  además obligaría a cambiar el `className` del relleno, que es candado de #98.
- **Aseverar `toggle.props.style({ pressed: true })`** (camino A del handoff):
  refutado por medición (§4, Q1 y Q2).
- **Normalizar `food.tsx:253-255` a una línea** para calcar la regex de la
  Home: innecesario con una regex tolerante, y mete producción en un requisito
  que es de verificación.
- **`Haptics.selectionAsync()` en `onPressIn`**, que es lo que proponía
  `progress/audit_animations_mobile.md` R5: es la fila «un valor pasa un
  detent» de la tabla de la skill. Aquí el hecho que se comunica no es la
  pulsación sino el resultado de una operación de red que puede fallar, y
  `selectionAsync` no distingue éxito de error. Descartada a favor de
  `notificationAsync`.
- **Candar la dependencia en `design-drift.test.ts`**: su sitio natural, pero
  es fichero de #94 y sería conflicto de merge (§7).
- **Animar también el contador `served/total`** (un count-up): no se pidió, y
  el audit ya rechazó el count-up de cifras en su R3 por el mismo motivo
  (dato en lectura, motion que estorba).
