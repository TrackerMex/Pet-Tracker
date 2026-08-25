---
feature: "mobile-tab-glass"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-tab-glass]] (feature #50)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas (estructura del componente, mocks
> exactos de jest, tokens nuevos) y [[traceability]] para el test que prueba
> cada R-id. Restricción global: **todo corre en Expo Go SDK 57** (runtime de
> smoke del humano, dispositivo Android) — nada que exija dev build. Cumple
> `docs/ui-guidelines.md` (C8 de CHECKPOINTS.md).

## Requisitos funcionales

- **R1 — Material liquid glass (iOS 26+)**: WHEN la tab bar flotante se
  renderiza en una plataforma donde `isLiquidGlassAvailable()` (de
  `expo-glass-effect`) devuelve `true`, THE SYSTEM SHALL renderizar el fondo
  de la barra con un `GlassView` (testID `tab-bar-glass`,
  `glassEffectStyle="regular"`, sin `tintColor`) que llena todo el contenedor,
  y SHALL NOT montar ningún `BlurView`.

- **R2 — Fallback blur (Android, iOS < 26 — incluye Expo Go Android del
  smoke)**: WHEN `isLiquidGlassAvailable()` devuelve `false`, THE SYSTEM
  SHALL renderizar el fondo con un `BlurView` de `expo-blur` (testID
  `tab-bar-blur`) con exactamente `intensity={80}`,
  `blurMethod="dimezisBlurViewSdk31Plus"` y `tint` igual a `'dark'` cuando el
  tema activo de uniwind es dark y `'light'` en caso contrario, conteniendo
  una superficie translúcida con clase `bg-glass-surface` (testID
  `tab-bar-overlay`) que garantiza el contraste del contenido cuando el
  método de blur degrada a `'none'` (Android ≤ 11). Los tokens
  `--glass-surface` / `--color-glass-surface` y `--tab-pill` /
  `--color-tab-pill` SHALL existir en los bloques `@variant light` y
  `@variant dark` de `mobile-pet-tracker/src/theme/global.css` con los
  valores fijados en [[design]].

- **R3 — Indicador pill posicionado**: WHEN el contenedor de la tab bar
  recibe su evento `onLayout` con `width > 0`, THE SYSTEM SHALL renderizar un
  indicador pill (testID `tab-indicator`) con ancho `(width - 16) / 5`
  (16 = padding horizontal `px-2` a ambos lados), posicionado `left: 8,
  top: 6, bottom: 6`, `borderRadius` cápsula, color de fondo resuelto
  imperativamente vía `useThemeColors(['tab-pill'])`, y
  `translateX = índiceActivo × anchoTab`. IF aún no ha llegado `onLayout`
  (width 0) THEN THE SYSTEM SHALL no renderizar el pill.

- **R4 — Deslizamiento con spring interruptible**: WHEN el tab activo cambia
  (por press o por navegación externa), THE SYSTEM SHALL animar el
  `translateX` del pill hacia `nuevoÍndice × anchoTab` con `withSpring` y la
  configuración exportada
  `TAB_INDICATOR_SPRING = { duration: 250, dampingRatio: 1, reduceMotion: ReduceMotion.System }`,
  ejecutada en el UI thread (shared value + `useAnimatedStyle`, API
  `.get()`/`.set()`); IF llega un nuevo cambio de tab con la animación en
  vuelo THEN THE SYSTEM SHALL retarget-ear el spring hacia el nuevo destino
  sin saltar ni reiniciar desde el origen (interruptible).

- **R5 — Reduced motion**: WHILE el usuario tiene "reducir movimiento"
  activado a nivel de sistema, THE SYSTEM SHALL colocar el pill en su
  posición final sin desplazamiento animado, garantizado porque
  `TAB_INDICATOR_SPRING` contiene `reduceMotion: ReduceMotion.System`
  (verificable como propiedad del objeto exportado).

- **R6 — Transición de contenido entre tabs**: WHEN el usuario cambia de
  tab, THE SYSTEM SHALL transicionar el contenido de las pantallas con
  `animation: 'fade'` declarado en el `screenOptions` del `<Tabs>` de
  `mobile-pet-tracker/src/app/(tabs)/_layout.tsx` (crossfade de opacidad con
  el `transitionSpec` por defecto del navigator — sin override). Decisión
  fijada: `'fade'`, no `'shift'` (ver [[design]] §Alternativas descartadas).

- **R7 — Comportamiento existente conservado**: WHILE el material glass y el
  pill están montados, THE SYSTEM SHALL conservar todo el comportamiento
  actual de la tab bar: los 5 tabs en orden `home, map, health, food,
  profile` con sus labels; emisión de `tabPress` con `canPreventDefault:
  true` y navegación solo si el tab no es el activo y el evento no fue
  prevenido; `accessibilityRole="tab"` y `accessibilityState.selected` en
  cada tab; y posición flotante `bottom: insets.bottom + 12, left: 16,
  right: 16` (la suite existente de `floating-tab-bar.test.tsx` sigue verde
  sin relajar sus aserciones).

## Fuera de alcance

- Patrón PressableScale del backlog de animaciones
  (`progress/audit_animations_mobile.md` A1) — feature aparte, no mezclar.
- Haptics (`expo-haptics` no está instalado; añadirlo sería otra spec).
- `NativeTabs` de expo-router y la capa root de `@expo/ui` (reservadas para
  dev builds; el smoke es siempre Expo Go — crash real visto en #39).
- Animar `intensity` del BlurView o la opacidad del contenedor del
  GlassView (caveat oficial: `opacity: 0` mata el efecto glass; blur animado
  re-renderiza por frame en Android).
- Cambios de contenido/diseño de las pantallas de cada tab.
- Badges, doble-tap-to-top u otros comportamientos nuevos de tabs.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
