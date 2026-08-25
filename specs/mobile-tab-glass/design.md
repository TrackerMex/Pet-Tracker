---
feature: "mobile-tab-glass"
status: approved
tags: [harness, spec]
---

# Diseño — [[mobile-tab-glass]] (feature #50)

> Ver [[requirements]] para los R-ids. Spec autosuficiente para Codex CLI:
> rutas, símbolos, valores y mocks exactos. Skills a cargar antes de
> implementar: `expo-native-ui`, `expo-animation`.

## Hechos verificados contra docs.expo.dev (SDK 57, 2026-08-25)

- `expo-glass-effect`: **funciona en Expo Go**; iOS/tvOS only, requiere
  iOS 26+. En plataformas no soportadas `GlassView` degrada a `View` plano y
  `isLiquidGlassAvailable()` devuelve `false` → el fallback Android debe ser
  explícito (R2). Caveat oficial: `opacity: 0` en el GlassView o un ancestro
  desactiva el efecto — no animar opacidad del contenedor.
- `expo-blur`: **estable en Android desde SDK 55** y funciona en Expo Go. El
  prop actual es `blurMethod` (ya no `experimentalBlurMethod`); default
  `'none'` = vista semi-transparente sin blur. `'dimezisBlurViewSdk31Plus'`
  aplica blur real solo en Android 12+ (RenderNode API, coste aceptable) y
  degrada solo a `'none'` en versiones anteriores — evita el penalti
  RenderScript de `'dimezisBlurView'` en Android ≤ 11. Por eso R2 fija
  `blurMethod="dimezisBlurViewSdk31Plus"` + overlay `bg-glass-surface` que
  asegura contraste también cuando el resultado es solo translúcido.
- `Tabs` JS de expo-router extiende Bottom Tabs Navigator v7 de React
  Navigation: `animation: 'fade' | 'shift' | 'none'` (default `'none'`) en
  `screenOptions`, compatible con `tabBar` custom (la transición afecta a las
  escenas, no a la barra).

## Dependencias

`expo-glass-effect@~57.0.1` y `expo-blur@~57.0.2` **ya están declaradas en
`mobile-pet-tracker/package.json`** desde el scaffold SDK 57 (commit
`ee29ed1`). No hay diff esperado en `package.json`; el implementador solo
verifica la instalación local (`npx expo install expo-glass-effect
expo-blur` es no-op o alinea versiones; en la máquina del humano basta su
`bun install`/`npm install` habitual). Ninguna requiere dev build.

## Decisiones técnicas

1. **Selección de material en runtime, no por plataforma** (`R1`, `R2`):
   branch por `isLiquidGlassAvailable()` (no `process.env.EXPO_OS`) — es la
   API oficial y cubre a la vez Android e iOS < 26. El backdrop es un layer
   absoluto que llena el contenedor; el contenido (pill + fila de tabs) se
   renderiza encima.
2. **Tint del BlurView según tema de uniwind, no `systemMaterial`** (`R2`):
   la app tiene toggle light/dark propio (puede divergir del sistema);
   `tint={theme === 'dark' ? 'dark' : 'light'}` con `theme` de
   `useUniwind()` (ya importado indirectamente vía `useThemeColors`).
3. **Tokens nuevos en `global.css`** (`R2`, `R3`) — añadir a AMBOS bloques
   `@variant` de `@layer theme`, siguiendo el patrón par `--x`/`--color-x`
   de `accent`/`muted` (el par `--color-*` es el que uniwind expone a clases
   y a `useThemeColors`):

   | Token | `@variant light` | `@variant dark` |
   |---|---|---|
   | `--glass-surface` y `--color-glass-surface` | `rgba(255,255,255,0.60)` | `rgba(22,27,34,0.60)` |
   | `--tab-pill` y `--color-tab-pill` | `rgba(42,184,124,0.14)` | `rgba(42,184,124,0.22)` |

   (`rgba(22,27,34,…)` = `--surface` dark `#161B22`; `rgba(42,184,124,…)` =
   `--accent` `#2AB87C`.) Cero hex nuevos fuera de `src/theme/`.
4. **Pill sin uniwind className** (`R3`, `R4`): el pill es un
   `Animated.View` con estilo inline estático (posición, ancho, radius,
   `backgroundColor` string resuelto por `useThemeColors(['tab-pill'])`) +
   `useAnimatedStyle` SOLO para `transform: [{ translateX }]`. Cumple la
   regla de la carta: nunca `Color`/var CSS dentro de estilos de Reanimated;
   evita interop dudoso className↔Animated.View.
5. **Geometría del pill** (`R3`): `anchoTab = (containerWidth - 16) / 5`
   (px-2 = 8 px por lado); `left: 8, top: 6, bottom: 6`,
   `borderRadius: 999`. `containerWidth` via `onLayout` del contenedor →
   `useState` (un solo setState, no por frame). Elemento absoluto sin hijos:
   animar solo transform, el ancho es estático tras layout. Primer layout:
   `translateX.set(index * anchoTab)` sin animación (el pill aparece ya
   colocado); cambios posteriores usan spring (decisión 6).
6. **Spring exacto** (`R4`, `R5`): exportar del propio
   `floating-tab-bar.tsx`:

   ```ts
   export const TAB_INDICATOR_SPRING = {
     duration: 250,
     dampingRatio: 1,
     reduceMotion: ReduceMotion.System,
   } as const;
   ```

   250 ms = duración "transición" de la carta; `dampingRatio: 1` sin
   overshoot (el cambio de tab no lleva momentum de gesto); `withSpring`
   retarget-ea solo al recibir nuevo destino en vuelo → interruptible por
   construcción. Constante local (no token `--motion-*` todavía: es su
   primer uso; se promueve si un segundo consumidor aparece).
7. **Estructura del contenedor** (`R1`, `R2`, `R7`): el `View` exterior
   (testID `floating-tab-bar`) conserva posición y borde actuales, pierde
   `bg-surface` y gana `overflow-hidden` (clip del backdrop en cápsula,
   requisito de BlurView con esquinas) + `borderCurve` no aplica (cápsula).
   El padding `px-2 py-3` se mueve del contenedor a la fila interior de
   tabs para que backdrop y pill llenen la cápsula. Orden de capas:
   backdrop → pill → fila de Pressables. `shadow-lg` se mantiene en el
   exterior (boxShadow propio no se clippea).
8. **Transición de contenido** (`R6`): una línea en
   `src/app/(tabs)/_layout.tsx`:
   `screenOptions={{ headerShown: false, animation: 'fade' }}`. Sin
   `transitionSpec` custom. Fade es opacidad pura → válido también bajo
   reduced motion según la carta (se conserva opacidad, no hay traslación).

## Archivos afectados (todo capa UI / infrastructure de la app móvil)

- `mobile-pet-tracker/src/components/floating-tab-bar.tsx` — backdrop
  glass/blur, pill animado, export `TAB_INDICATOR_SPRING` (R1–R5, R7).
- `mobile-pet-tracker/src/components/__tests__/floating-tab-bar.test.tsx` —
  nuevos describes R1–R5; los describes existentes ("R7/R8" de la spec
  original de la tab bar) quedan intactos y cubren el R7 de esta spec.
- `mobile-pet-tracker/src/app/(tabs)/_layout.tsx` — `animation: 'fade'` (R6).
- `mobile-pet-tracker/src/app/__tests__/tabs-layout.test.tsx` — NUEVO (R6);
  vive junto a `index.test.tsx` (precedente existente), nunca dentro de
  `(tabs)/` (sería una ruta).
- `mobile-pet-tracker/src/theme/global.css` — 4 tokens nuevos × 2 variants (R2).
- `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts` — asegura los
  tokens en ambos variants (R2).
- `mobile-pet-tracker/package.json` — sin diff esperado (deps ya declaradas).

## Mocks exactos de jest (fijados — los módulos nativos no corren en jsdom)

En `floating-tab-bar.test.tsx` (top-level, junto al mock existente de
safe-area-context):

```tsx
const mockIsLiquidGlassAvailable = jest.fn<boolean, []>(() => false);

jest.mock('expo-glass-effect', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual('react-native');
  return {
    GlassView: (props: Record<string, unknown>) =>
      React.createElement(View, props),
    isLiquidGlassAvailable: () => mockIsLiquidGlassAvailable(),
  };
});

jest.mock('expo-blur', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual('react-native');
  return {
    BlurView: (props: Record<string, unknown>) =>
      React.createElement(View, props),
  };
});
```

- Los mocks pasan props tal cual → los tests asserten `toHaveProp('tint',…)`,
  `toHaveProp('intensity', 80)`, `toHaveProp('blurMethod',
  'dimezisBlurViewSdk31Plus')` sobre `getByTestId('tab-bar-blur')`, y
  presencia/ausencia de `tab-bar-glass` vs `tab-bar-blur` según
  `mockIsLiquidGlassAvailable.mockReturnValue(true|false)` (R1/R2).
- Reanimated ya está configurado en `test/jest-setup.js`
  (`setUpTests()` + mock de `react-native-worklets`): usar
  `jest.useFakeTimers()`, `fireEvent(getByTestId('floating-tab-bar'),
  'layout', { nativeEvent: { layout: { width: 360, height: 64, x: 0, y: 0 } } })`
  → `anchoTab = (360 - 16) / 5 = 68.8`, y
  `jest.advanceTimersByTime(300)` + matcher `toHaveAnimatedStyle({ transform:
  [{ translateX: … }] })` para posición inicial (R3) y retarget tras
  `rerender` con nuevo `index` (R4, incluido rerender en mitad del vuelo con
  `advanceTimersByTime(100)` intermedio).
- R5 se prueba sobre el objeto exportado:
  `expect(TAB_INDICATOR_SPRING.reduceMotion).toBe(ReduceMotion.System)` (más
  duration 250 y dampingRatio 1 para R4).
- R6 (`tabs-layout.test.tsx`): mockear `expo-router` (`Tabs` como
  componente-espía que registra props, `Tabs.Screen` → null, `Redirect` →
  null) y los providers (`useAuth` → `{ status: 'authenticated' }`,
  `SelectedPetProvider` passthrough); assert
  `screenOptions` recibido `=== { headerShown: false, animation: 'fade' }`.

## Alternativas descartadas

- **`NativeTabs` de expo-router**: barra nativa del sistema — incompatible
  con el diseño flotante custom ya aprobado y con Expo Go como runtime de
  referencia del proyecto.
- **`animation: 'shift'`**: introduce desplazamiento lateral entre tabs, que
  son pares (no hay jerarquía espacial); además muere bajo reduced motion.
  `'fade'` es opacidad pura y neutra.
- **`tint="systemMaterial"`**: sigue el tema del SO, no el toggle de tema
  in-app → mismatch visual cuando divergen.
- **`blurMethod="dimezisBlurView"`**: blur también en Android ≤ 11 vía
  RenderScript — penalti de performance documentado; no lo vale para una
  barra estática.
- **Animar `width`/`left` del pill en vez de `translateX`**: transform es
  gratis; y aunque un absoluto sin hijos podría animar width, aquí el ancho
  es constante entre tabs — solo se traslada.
- **`entering/exiting` para el pill**: el pill vive siempre montado; solo se
  traslada.
- **Token `--motion-transition: 250ms`**: Reanimated no lee vars CSS y este
  es el primer uso de la duración en JS; promover al segundo consumidor.
