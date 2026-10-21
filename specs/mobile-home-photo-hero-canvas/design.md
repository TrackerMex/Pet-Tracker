---
feature: "mobile-home-photo-hero-canvas"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-home-photo-hero-canvas]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Rutas de código relativas a `mobile-pet-tracker/`. El artboard de referencia es
> `canvas-ref/Inicio.dc.html` (versión 85 del canvas, copia congelada junto a esta spec).

## Premisas contrastadas

Leídas en el árbol de la worktree `Pet-Tracker-wt-195`, commit `07bac290` sobre `origin/main` `c0a35a68` (2026-10-21). Se anclan por contenido, no por número de línea ni por recuento global.

- **Hero actual** (`src/components/pet-hero-header.tsx`): exporta `PET_HERO_MEDIA_HEIGHT` (260), `PET_HERO_FADE_HEIGHT` (64), `STATUS_DOT_PULSE`, `PetHeroHighlight`, `PetHeroStatusTone`, `PetHeroStatus`, `STATUS_TONE_CLASSES`, `PetHeroHeaderProps` (`pet`, `variant` `'bleed' | 'card'` con `'card'` por defecto, `highlight`, `status`, `children`) y `PetHeroHeader`. Hoy el slot superior (`pet-hero-slot`, `bg-background px-6 pb-3`, `paddingTop: insets.top + 12`) y la banda inferior (`pet-hero-caption`, `bg-background`) son **opacos y van fuera de la foto**; el único velo es de 64 px en cada borde, del color de fondo. El comentario del fichero explica por qué el transparente se escribe con el propio color y alfa `00` y nunca con `transparent`.
- **Consumidores**: `<PetHeroHeader` aparece **solo** en `src/screens/home/index.tsx` (candado de `tab-headers-canvas`). Perfil dejó de usarlo en #168, de modo que `variant="card"` no tiene consumidor de producción. `src/screens/map/index.tsx` importa `STATUS_TONE_CLASSES` y `PetHeroStatusTone`: por eso no se tocan.
- **`PetAvatar`** (`src/components/pet-avatar.tsx`, 57 líneas): con foto pinta un `Image` de `expo-image` (`testID` `pet-avatar-image-<id>`); sin foto, el blobatar con `SvgXml` (`pet-avatar-fallback-<id>`). En modo rectángulo (`size` objeto) el blobatar se escala al lado menor, centrado y sin recortar (existe el `it` `escala el blobatar al rectángulo sin recortarlo`). Hay un fichero de snapshot de `pet-avatar`, de modo que cualquier prop nueva se reenvía **solo cuando se pasa**. `contentPosition="top"` de `expo-image` equivale a `object-position: 50% 0%`.
- **`PetSwitcher`** (`src/components/pet-switcher.tsx`, 98 líneas): variantes `default` (la comparten Inicio y las pantallas de comidas, vinculación, salud y recordatorios) y `avatars` (Perfil). No hay variante con círculos de vidrio. Hoy el avatar del selector de Inicio sale de HeroUI `Avatar`, cuyo `Avatar.Fallback` trae una prop `entering` propia: de ahí que `pet-avatar-fallback-pet-1` figure en `homeEnteringIds` en `#152 R5`.
- **Fila superior de Inicio**: `home-hero-actions` (`flex-row items-center gap-3`) con **dos** hijos, el envoltorio `flex-1` del selector y la campana `home-alerts-bell` (`size-11 items-center justify-center rounded-full`, icono `Bell` 24 en `muted`, punto `home-alerts-dot`). **No hay botón «+»**: es nuevo. `Plus` no se importa hoy en Inicio, y el mock de `reicon-react-native` del test de Inicio no lo tiene. `t('profile.addPet')` aparece una vez en `home/index.tsx` (el `EmptyState` del estado sin mascotas), y `ui-language.test.ts` cuenta `t('clave'` por fichero.
- **Burbuja de Pingo** (#190): ya es una fila propia dentro de `home-content` (`HomeEntrance index={0} testID="home-entrance-pingo"` > `home-pingo-phrase` `flex-row items-end gap-2.5` > `home-pingo-bubble` `flex-1 rounded-tile rounded-br-4 bg-surface px-3.5 py-3 shadow-sm` con `style={CONTINUOUS_CORNER}` + `PingoFloat testID="home-pingo-float"` con la pose de 64). `--radius-4` existe ya (lo añadió #190).
- **Movimiento** (`src/theme/motion.ts`, cerrado por `motion.test.ts › no exporta nada más`, 31 claves): ya existen `MOTION_CELEBRATION_RISE_OFFSET_Y` (14), `MOTION_CELEBRATION_EASE_OUT` (`{ easing: Easing.bezier(0, 0, .58, 1), reduceMotion: ReduceMotion.System }`), `MOTION_SURFACE_MS` (400), `MOTION_CELEBRATION_POP_PEAK` (1.08), `MOTION_POP_SCALE` (.6), `MOTION_PING_FROM` (.55), `MOTION_PING_TO_SCALE` (1.5), `MOTION_PING_TIMING` (2400) y el componente `PingoFloat`. `PingRing` (`src/components/ping-ring.tsx`, 36 líneas) recibe `testID`, `delay` y `className`; con reduce motion queda en escala 1 y opacidad .3. `PopIn` (`src/components/pop-in.tsx`) es el patrón de entrada con valores compartidos que arranca en opacidad 0 y cuyos hijos los tests afirman `toBeVisible`.
- **Tokens que ya existen y se usan sin tocar**: `tracking-title` (-0.02em), `text-28`, `text-15`, `text-2xs`, `rounded-tile` (18), `rounded-br-4`, `rounded-card` (20), `bg-surface-secondary`, `border-border`, `bg-glass-surface-strong`, `bg-default`. Las clases decimales de Tailwind v4 usadas por esta spec existen por la misma mecánica que `bottom-4.5` y `h-3.5`: `size-2`, `size-2.25`, `size-3.5`, `size-9`, `size-11`, `top-2.25`, `right-2.5`, `-right-0.75`, `-bottom-0.75`, `leading-5.25`, `leading-8` (32), `leading-8.5` (34), `bottom-1.5`, `inset-x-4`, `gap-1.5`, `py-0.75`, `px-2.5`, `p-0.5`, `p-1`, `-m-1`. **No existen** (y la spec no los usa): una altura de 330 como clase (se pasa por `style`) y los tokens `scrim` y `photo-dim`.
- **`useThemeColors`** (`src/theme/use-theme-colors.ts`): exige hex de seis dígitos, resuelve `--color-<token>` y luego `--<token>`, y **cae a `foreground` en silencio** si falta el token. Por eso `scrim` es obligatorio en `global.css` y R4 lo candan.
- **Guardas que la feature toca o roza**, verificadas por contenido: `consistency-classnames` (tabla `directUses` de `#62 R14` por fichero: hero 1 y Home 1, **no hay un total del repositorio que citar**; el `it` del skeleton fija `className="w-full"` + `style={{ height: PET_HERO_MEDIA_HEIGHT }}` sin `rounded-`); `legibility-classnames` (`#61 R4`: `text-accent-strong` hero 1 y Home 2; ningún `useThemeColors([... 'accent' ...])` fuera de `empty-state.tsx`); `alerts-canvas-fidelity` (`#174 R12`: inventario por token; solo `tracking-title` necesita el hero; `text-15`, `rounded-10`, `border-b-5` y `tracking-caps` no se ven afectados; existe un test «cada `tracking-*` va con su `text-*`»); `design-drift` (R9 cubre `pet-hero-header.tsx` y `pet-avatar.tsx`; `HEX_LITERAL` exime solo la forma `#NNN R<n>`); `#173 R15` (cero `shadow-` en `pet-switcher.tsx`); `hero-header-amendments.test.ts` (comprueba el marcador `**Enmendado por #67 (A8) — corrección de un hecho falso.**` y el bloque de firma canónico); y el bloque `Enmienda #190` de la carta, cuyo texto fija un test de forma exacta.
- **Mocks de Reanimated**: `test/jest-setup.js` mockea `react-native-worklets` y llama a `setUpTests()`. El test del hero sustituye `default` por `{ ...actual.default, View }` (así `Animated.View` es un `View` simple), `withTiming: jest.fn((v) => v)`, `withRepeat`, `withSequence`, `cancelAnimation` y `useReducedMotion` vía `mockUseReducedMotion`; **no** mockea `withDelay`. El test de Inicio mockea `withTiming → mockWithTiming(value, config)` (devuelve el valor), `withDelay: jest.fn((_d, a) => a)`, `withRepeat`, `withSequence → último paso`, `withSpring → valor`, `useReducedMotion → mockUseReducedMotion()`, y `useSafeAreaInsets` con `top` 40 y `bottom` 24 (de ahí `paddingBottom` 120).
- **`expo-blur` 57.0.2**: en Android, un `BlurView` sin `blurTarget` cae a «none» y escribe `console.warn`. La barra flotante de pestañas ya tiene ese desenfoque inerte; es una deuda previa.
- **Premisas del encargo corregidas por el árbol**: (a) Perfil ya no usa el hero; (b) la píldora «En línea» y la campana existen desde #67, #73 y #78, solo el «+» es nuevo; (c) el pulso actual de la píldora es de opacidad (`STATUS_DOT_PULSE`), no un `ping`; (d) la burbuja de Pingo ya es fila propia, solo cambian su aspecto y su `pop`; (e) el registro habla de una «tarjeta» (C12) pero el canvas ya adoptó la foto a sangre, así que #67 se **conserva y se ajusta**; (f) C13 y C14 son candidatas del informe de exploración, no features registradas.

## Supuestos no verificados

El implementer los confirma antes del test rojo que los usa; si alguno cae, avisa al leader antes de seguir:

1. **Visibilidad en Jest de los hijos de una entrada que arranca en opacidad 0** (R14, R16). `PopIn` es el precedente: valor compartido inicial 0 y hijos afirmados `toBeVisible`. Se asume que, con el mock de cada test, el valor final se aplica antes de afirmar. **Regla: nunca se relaja un `toBeVisible`; se corrige el componente** (el valor inicial lo decide `useReducedMotion`) o el modo de montar el test.
2. **Origen de las posiciones absolutas** (R9, R12, R21). El artboard usa `box-sizing: border-box` y RN también, pero un hijo absoluto puede quedar 1 a 2 px distinto del borde del padre (Yoga mide desde el borde de relleno). Las cifras de las clases (`-bottom-0.75`, `-right-0.75`, `top-2.25`, `right-2.5`) son las del artboard; el smoke de R21 comprueba la posición real y, si hace falta, se ajusta la clase, no la estructura.
3. **El `-m-1` del `ScrollView` horizontal con `p-1` en el contenido** (R10) basta para que el punto de 14 px, que sobresale 3 px de su chip, no se recorte. Se comprueba en dispositivo.
4. **Tipografía efectiva** (R6, R21): `leading-8.5` y `tracking-title` a 30 px dan 34 y ≈ -0,6 px; `text-sm` y `text-xs` traen sus interlineados por defecto. Se mide que ningún texto del pie se recorta.
5. **Fundido de la foto frente a su decodificación** (R2): el fundido corre al llegar el dato de la mascota. Si `expo-image` aún no ha pintado, la foto «aparece» tras el fundido. Es una limitación declarada; la ruta de arreglo es `onLoad` de `PetAvatar`, que esta feature no añade.

## Contraste con el artboard

Qué dibuja `Inicio.dc.html` y a qué clase o símbolo lo traduce esta spec. La columna «R» dice dónde se prescribe.

| Elemento del artboard | Valor del artboard | Traducción | R |
|---|---|---|---|
| Cabecera a sangre | alto 330, `margin 0 -16px` | `pet-hero-frame` con `{ height: 330 }`; el hero ya es a sangre en Inicio | R1 |
| Foto | alineada arriba (`object-position: 50% 0%`), fundido 500 ms ease-out | `contentPosition="top"`; `withTiming(1, …)` 500 ms | R2 |
| Foto en dark | `brightness(.86)` | `pet-hero-dim` `bg-photo-dim` (negro al 14 %) | R4 |
| Velo superior | 130 px, `rgba(13,17,23,.5)` a 0 | `pet-hero-scrim-top`, `${scrim}80` a `${scrim}00` | R3 |
| Degradado inferior | 160 px; transparente 0 %, fondo .35 a 35 %, fondo .85 a 65 %, fondo 100 % | `pet-hero-fade-bottom`, `${bg}00`, `${bg}59`, `${bg}D9`, `${bg}` | R3 |
| Fila superior | `top: 56` (= `insets.top + 12`), laterales 16, `justify-between`, `rise` 400 ms | `pet-hero-slot` `absolute inset-x-4` + `top` literal | R5, R14 |
| Avatar seleccionado | 44, borde 2 acento, relleno 2, fondo `--bg`, imagen 36 | `size-11 rounded-full border-2 border-accent bg-background p-0.5` + `size-9` | R9 |
| Punto en línea | 14×14, derecha y abajo -3, acento, borde 2 `--bg` | `absolute -bottom-0.75 -right-0.75 size-3.5 … border-2 border-background bg-accent` | R9 |
| Avatar no seleccionado | 44 vidrio, letra 800 16 px `fg` | `GlassCircle` + `Text text-base font-extrabold text-foreground` | R10 (D3) |
| «+» | 44 vidrio, icono 20 trazo 2,4 `muted` | `GlassCircle` + `<Plus size={20} strokeWidth={2.4} color={muted} />` | R11 |
| Campana | 44 vidrio, icono 22 trazo 2 `fg`; punto 9×9 a 9 y 10, `danger`, borde 2 | `GlassCircle` + `<Bell size={22} strokeWidth={2} color={foreground} />`; punto de R12 | R12 |
| Pie | `bottom: 6`, laterales 16, `gap 12`, `rise` 400 ms con retraso 80 ms | `pet-hero-caption` `absolute inset-x-4 bottom-1.5 … gap-3` | R6, R14 |
| Píldora | relleno 3/10, radio 999, fondo `surface2`, acento fuerte 12/700, `gap 6` | `gap-1.5 … px-2.5 py-0.75 bg-surface-secondary`, `text-xs font-bold text-accent-strong` | R7 |
| Anillo del punto | `ping 1.6s ease-out infinite`, escala .55 a 1.5, opacidad .55 a 0 | `PingRing` con `timing` de 1600 ms | R8 |
| Nombre | 30/34/900, interletrado -0,5 px | `text-3xl font-black leading-8.5 tracking-title` | R6 |
| Raza | 14 `muted` | `text-sm font-normal text-muted` | R6 |
| Cifra | 28/32/900 tabular `fg`; etiqueta 12/600 `muted` | `text-28 font-black leading-8` + `TABULAR_NUMS`; `text-xs font-semibold text-muted` | R6 (D5) |
| Fila de Pingo | bajo el hero, `gap 14`, `align-items:flex-end`, `gap 10`, `rise` | `gap: 14` en el scroll; fila ya existente | R15 |
| Burbuja | `flex 1`, `surface2`, `border 1px var(--border)`, radios 18/18/4/18, 12/14, 15/21/600, `pop` 400 ms con retraso 450 ms | clase de R16 + `BubblePop` | R16 |
| Pingo | 56 de ancho, `float 3s` | pose 56 dentro de `PingoFloat` | R16 |
| Reduce motion | `animation: none` | estado final desde el primer render, sin anillo | R8, R14, R16 |

Valores de movimiento del artboard: `float` translateY 0, -10 px, 0; `ping` escala .55 y opacidad .55 hasta escala 1,5 y opacidad 0; `rise` desde opacidad 0 y translateY 14 px; `fade` opacidad 0 a 1; `pop` 0 % escala .6 y opacidad 0, 60 % escala 1,08 y opacidad 1, 100 % escala 1.

## Dependencias y precondiciones

- **Sin dependencias nuevas** (`package.json` y el lockfile no cambian). `expo-image`, `reicon-react-native` (`Plus` ya lo importan `screens/profile` y `screens/reminders`; en Inicio se añade al `import` existente, entre `Pill` y `Stethoscope`), `react-native-reanimated` y `heroui-native` (`Skeleton`) están instalados. `bun`/`bunx` si hiciera falta algo de CLI.
- **Precondición de procedimiento**: la casilla `Enmienda #195 aprobada por humano` de [[requirements]] §Aprobación. Sin ella, ningún candado de §Candados se revierte (R20) y la implementación no empieza por R1.
- **Orden de entrada en `main`**: esta spec no asume ningún reparto de ficheros con otras features en curso; si al implementar `git diff origin/main` muestra cambios ajenos en `pet-hero-header.tsx` o `home/index.tsx`, se avisa al leader. #196 (Perfil) reutilizará `pet-hero-header` y debe rebasar sobre esta feature: no se coordina aquí. Si #196 mergea antes, el merge de `pet-hero-header.tsx` es de **la otra** feature y esta se rebasea (el rebase invalida los hashes de [[traceability]]: reapuntarlos).
- **Worktree nueva**: copiar `.env` y `bun install --frozen-lockfile` en `mobile-pet-tracker/` antes de lanzar tests.

## Decisiones técnicas

### Estructura del hero (R1, R2, R3, R4, R5, R6)

- **Un solo hijo, `pet-hero-frame`.** Todo lo que antes se apilaba (slot, foto, velos, pie) pasa a ser capa de un frame de 330 con `overflow-hidden` heredado de la raíz. Se descartó poner el alto en la raíz con `style={[CONTINUOUS_CORNER, { height }]}`: rompe la cuenta de `style={CONTINUOUS_CORNER}` (el candado `#62 R14` cuenta ese literal por fichero). El frame lleva solo `{ height: PET_HERO_MEDIA_HEIGHT }`.
- **Capas por orden de pintado** (R6 fija el orden): `pet-hero-photo` (foto o skeleton, con el fundido), `pet-hero-dim` (token `photo-dim`, siempre), `pet-hero-scrim-top` (solo con slot), `pet-hero-fade-bottom` (siempre), `pet-hero-slot` (solo con slot) y `pet-hero-caption`. Los tres overlays de color llevan `pointerEvents="none"` para que no se coman toques de la fila superior ni del pie.
- **El fundido es de la capa, no del `PetAvatar`.** Así no se toca `pet-avatar` más que por `contentPosition`, y el skeleton queda en opacidad 1 (el fundido solo corre con mascota; clave: `pet.id`, para que un cambio de mascota reinicie el 0 a 1).
- **Degradados como estilo inline**, no como clase: la cadena lleva los hex del hook (`useThemeColors(['background', 'scrim'])`), que no pueden ser clases estáticas. `transparent` está prohibido (negro con alfa cero, gris en el tramo medio); la parada transparente es `${color}00`. El prefijo `experimental_` de `experimental_backgroundImage` es el único nombre que existe en RN 0.86 (conservar el comentario). Los alfa del artboard se escriben en hex de 8 bits: .35 es `59`, .85 es `D9`, .5 es `80`.
- **Dos tokens nuevos** en `src/theme/global.css`, en las dos formas del fichero (`--x` y `--color-x`, sin espacios tras las comas): `scrim` `#0D1117` (el oscuro de la app, igual en ambos temas porque el velo siempre debe oscurecer) y `photo-dim` (`rgba(0,0,0,0)` en light, `rgba(0,0,0,0.14)` en dark). La capa `pet-hero-dim` se pinta **siempre**: en light es transparente. Se prefiere así a pintarla condicionada por el tema (cero lectura de tema en el componente, cero ramas que probar).
- **Slot y pie absolutos y sin fondo.** El slot (`absolute inset-x-4`, `top: insets.top + 12`) y el pie (`absolute inset-x-4 bottom-1.5`) flotan sobre la foto. La excepción A9 de #67 sigue: el hero a sangre como primer hijo del scroll supone que su slot asume la inset superior. El pie va anclado abajo, de modo que un nombre largo que envuelva crece **hacia arriba** sobre la foto; no se limita con `numberOfLines` porque el artboard no lo hace (riesgo en §Riesgos).
- **Tipografía**: se conservan los tokens existentes y se evita toda clase arbitraria. `text-28` y `text-3xl` (30) son tokens; `leading-8.5` (34) y `leading-8` (32) son escala de espaciado; `text-sm` y `text-xs` traen sus interlineados. Todo el texto dimensionado del hero es `Text` plano de RN (enmienda #187: el `twMerge` de HeroUI expulsa los `text-NN` numéricos); el único componente de HeroUI del hero es `Skeleton`, sin texto.
- **`tracking-title`**: al entrar en el hero, el inventario de `alerts-canvas-fidelity` gana `'components/pet-hero-header.tsx'` justo después de `'components/empty-state.tsx'` (orden alfabético; se comprueba con `node`, no a ojo: en `.sort()` por unidades UTF-16, `_` y mayúsculas ordenan antes que minúsculas).
- **Píldora y tono.** La tabla de tonos del hero se **deriva** de `STATUS_TONE_CLASSES` (`success` sobreescribe `surface` y `dot`; `warning` y `muted` se heredan sin cambio). Así `text-accent-strong` sigue contando 1 línea en el hero y el mapa conserva su tabla.
- **Anillo dentro del punto.** El `PingRing` es hijo del punto (`relative size-2`) y no hermano de la píldora, para que `pill.children` siga siendo `[punto, texto]` (candado `#73 R8`). El anillo hereda el 8×8 del punto, con `inset-0 rounded-full bg-accent`. Sin tono `success`, sin mascota o con reduce motion, el punto va **sin hijos**.

### Movimiento (R2, R8, R13, R14, R16)

- **Valores compartidos y `useAnimatedStyle`, no `entering`.** Los tres elementos del hero (foto, slot, pie) y la burbuja animan solo `opacity` y `transform`. Una prop `entering` metería esos nodos en `homeEnteringIds` (el candado `#152 R5` que lista todo nodo con `entering` de Inicio) y haría depender el hero del orden de `HomeEntrance`. Con valores compartidos el candado solo pierde `pet-avatar-fallback-pet-1`, porque el selector `glass` no usa HeroUI `Avatar`.
- **Constantes**: cuatro nuevas en `motion.ts` (`MOTION_HERO_FADE_MS` 500, `MOTION_HERO_CAPTION_DELAY_MS` 80, `MOTION_HERO_PING_MS` 1600, `MOTION_HERO_BUBBLE_POP_DELAY_MS` 450). El resto se reutiliza. No se reusan `MOTION_CELEBRATION_RISE_STAGGER_MS` (80) ni `MOTION_CELEBRATION_BADGE_DELAY_MS` (450) aunque coincidan: el significado es otro y un cambio de la celebración movería el hero.
- **`pop` de la burbuja** (R16): los tramos de 240 ms (60 % de `MOTION_SURFACE_MS`) y 160 ms (el 40 % restante) se **derivan** de `MOTION_SURFACE_MS` en el componente, sin constantes nuevas; el «.6» del keyframe es `MOTION_POP_SCALE` por valor, pero el pico y la curva son los de la celebración (`MOTION_CELEBRATION_POP_PEAK`, `MOTION_CELEBRATION_EASE_OUT`). La opacidad sube a 1 en el primer tramo y se queda; la escala hace pico y vuelve.
- **`PingRing` gana `timing`**, opcional, con `MOTION_PING_TIMING` por defecto: sus usos actuales (vinculación, #188) no cambian. El hero pasa `{ ...MOTION_CELEBRATION_EASE_OUT, duration: MOTION_HERO_PING_MS }` y `delay={0}`.
- **Reduce motion** sigue al canvas: estado final desde el primer render y **ninguna** llamada a `withTiming` ni a `withDelay`. Esto difiere de la convención general de la app (conservar los fundidos, `PopIn` usa `ReduceMotion.Never` en el fundido) y se declara en la enmienda. Se prefirió el valor inicial decidido por `useReducedMotion()` frente a un efecto que lo corrija después, para que el primer render sea ya el final.

### Fila superior (R9, R10, R11, R12)

- **`GlassCircle`** (`src/components/glass-circle.tsx`) concentra la receta de los círculos de 44: `Pressable` raíz con `testID`, rol `button`, `size-11 items-center justify-center rounded-full bg-glass-surface-strong` y opacidad .8 mientras se pulsa (la receta que hoy vive en la campana por #121/#122). Se usa para la campana, el «+» y los chips no seleccionados. **Plano, sin `BlurView`**: ver alternativas descartadas. El `testID` queda en la raíz `Pressable`, como exige `#122 R2`.
- **Variante `glass` del selector.** Se añade una variante nueva en lugar de modificar `default` o `avatars`, porque `default` la comparten cinco pantallas y `avatars` es de Perfil. Props nuevas, opcionales: `selectedOnline` (punto en el chip seleccionado) y `trailing` (nodo al final de la fila, dentro del scroll, para que «+» se desplace con los avatares). El chip seleccionado es un `Pressable` simple, no `GlassCircle`, porque su aro, su fondo y su punto no son vidrio. Todos los chips llaman a `onSelect(pet.id)`; el seleccionado lo hace también (idempotente) para no ramificar la fila.
- **`PetAvatar` a 36** dentro de un `size-9 overflow-hidden rounded-full`: el recorte circular lo pone el envoltorio. Se descartó mantener HeroUI `Avatar` en la variante `glass` (su fallback trae `entering` y su geometría no deja el aro de 2 px con 2 px de holgura sin pelear con sus clases).
- **Inicio**: `home-hero-actions` conserva sus **dos** hijos; el «+» entra por `trailing` del selector, no como tercer hijo de la fila. El `addPetLabel` se eleva sobre el `return` temprano para no duplicar `t('profile.addPet'`. No hay claves de copy nuevas, así que `R3_HOME` y `SCREEN_FILES` no se mueven.
- **Colores de iconos**: `useThemeColors` de Inicio añade `'foreground'` (el «+» sigue `muted`, la campana pasa a `foreground`). Cumple `legibility-classnames`: ningún `accent` en `useThemeColors` fuera de `empty-state.tsx`.

### Inicio (R15, R16)

- `contentContainerStyle` del `ScrollView` pasa a `{ gap: 14, paddingBottom: insets.bottom + 96 }`. El 14 es el hueco del artboard entre hero y fila de Pingo y cae bajo la excepción de fidelidad del 2026-10-13 (el `gap` del artboard manda); se declara el efecto lateral sobre `home-states` (las ramas sin cabecera, 16 a 14). `home-content` sigue con `paddingHorizontal: 24` y `gap: 16` (D1).
- El hero se desplaza con el contenido (D4). La barra flotante solo cubre la parte inferior, de ahí que `paddingBottom` no cambie.
- La burbuja es `BubblePop` (`src/screens/home/bubble-pop.tsx`), un `Animated.View` con el patrón de `PopIn` y `style={[style, animatedStyle]}`. El `style={CONTINUOUS_CORNER}` literal sigue en `home/index.tsx` y se pasa por prop: la cuenta de ese literal por fichero (1) y la tabla `directUses` no se mueven, y `bubble-pop.tsx` y `glass-circle.tsx` no entran en esa tabla porque no escriben el literal.
- La fila de Pingo sigue entrando con `HomeEntrance index={0}`. El artboard la anima con `rise` de 14 px, 400 ms y retraso 140 ms; la app con el spring de 250 ms y 12 px de todas las secciones. Divergencia declarada y atada a C13, que reordena toda la secuencia de Inicio.

### Contraste (R17)

Modelo, con los tokens reales de `global.css`. Distancia `d` en px desde el borde inferior del frame al borde **superior** de cada texto (peor caso: la parte más alta del texto es la que menos fondo tiene debajo). Alfa del degradado inferior:

- `d ≤ 56`: `1 − (d / 56) · 0,15`
- `56 < d ≤ 104`: `0,85 − ((d − 56) / 48) · 0,5`
- `104 < d ≤ 160`: `0,35 · (160 − d) / 56`

Color efectivo = `fondo · alfa + foto · (1 − alfa)`; peor caso de foto = negra o blanca (en dark, la foto multiplicada por 0,86 antes). Distancias: raza 26, nombre 64, etiqueta de paseos 22, cifra 54.

| Par | Light | Dark | Suelo |
|---|---|---|---|
| Raza `muted` sobre degradado | 4,26 | 6,51 | 4,5 dark / 4,2 light (desviación aceptada) |
| Nombre `foreground` | 10,79 | 9,77 | 4,5 |
| Etiqueta de paseos `muted` | 4,36 | 6,67 | 4,5 dark / 4,2 light (desviación aceptada) |
| Cifra `foreground` | 13,55 | 12,79 | 4,5 |
| Tinta `accent-strong` sobre `surface-secondary` (píldora) | 5,70 | 6,43 | 4,5 |
| Punto `accent` contra `background` | 4,82 | 3,93 | 3,0 (no texto) |
| Punto `danger` contra `background` | 3,76 | 6,84 | 3,0 (no texto) |
| `foreground` sobre el vidrio plano | 13,71 | 11,46 | 4,5 |
| Icono `muted` sobre el vidrio plano | 3,60 | 4,79 | 3,0 (no texto) |

La banda opaca de #67 daba la garantía de AA porque no dependía de la foto; ahora el texto está sobre el degradado, que en la zona del texto cubre entre el 77 % (nombre) y el 94 % (etiqueta) con el color de fondo, de modo que la foto aporta entre el 6 % y el 23 %. Por eso el peor caso se calcula contra la foto negra y la blanca, no contra una foto concreta. La raza y la etiqueta en light quedan **por debajo de 4,5**: se acepta nombrando la cifra en la enmienda y en la casilla, o se pasan a `text-foreground` (la salida si el humano la rechaza; cambia la clase de R6 y no la geometría). Las constantes del modelo son literales del test (`__tests__/home-photo-hero-canvas.test.ts`), nunca importadas de producción; los tokens se **leen** de `global.css`, de modo que cambiar un token sin recalcular pone el test en rojo.

### Documentación de la carta (R20)

La Enmienda #195 va al **final** de `docs/ui-guidelines.md`, tras `Enmienda #188 (E2)`, con el texto de §Texto de la Enmienda #195 (más abajo). No se edita dentro de `Enmienda #190`, `#67` ni `#167`: los tests fijan su texto. El párrafo de continuación de A8 se añade como una cita **nueva** después del párrafo `Enmendado por #67 (A8)`, nunca dentro de él (el test de `hero-header-amendments` fija ese párrafo). La excepción de ping para la píldora sigue el precedente de #188: la regla de #167 («ninguna otra pantalla usa anillos de ping sin una enmienda propia») sigue vigente para el resto.

## Archivos afectados

Todos bajo `mobile-pet-tracker/` salvo indicación.

- `src/components/pet-hero-header.tsx` — reescritura (R1, R2, R3, R5, R6, R7, R8, R14, R18). Constantes 330/160/130; se quita `STATUS_DOT_PULSE`.
- `src/components/pet-avatar.tsx` — prop `contentPosition` (R2).
- `src/components/ping-ring.tsx` — prop `timing` (R8).
- `src/components/glass-circle.tsx` — **nuevo** (R11).
- `src/components/pet-switcher.tsx` — variante `glass`, props `selectedOnline` y `trailing` (R9, R10).
- `src/screens/home/index.tsx` — fila superior, `addPetLabel`, `gap: 14`, `BubblePop`, pose de 56 (R11, R12, R15, R16).
- `src/screens/home/bubble-pop.tsx` — **nuevo** (R16).
- `src/theme/global.css` — tokens `scrim` y `photo-dim` (R4).
- `src/theme/motion.ts` — cuatro constantes (R13).
- `../docs/ui-guidelines.md` — Enmienda #195 y párrafo de continuación de A8 (R20), solo tras la firma.
- Tests nuevos: `src/components/__tests__/glass-circle.test.tsx`, `src/screens/home/bubble-pop.test.tsx`, `src/__tests__/home-photo-hero-canvas.test.ts`.
- Tests enmendados (ver [[requirements]] §Candados): `components/__tests__/pet-hero-header.test.tsx`, `screens/home/index.test.tsx`, `components/__tests__/pet-switcher.test.tsx`, `components/__tests__/ping-ring.test.tsx`, `components/__tests__/pet-avatar.test.tsx`, `theme/__tests__/motion.test.ts`, `theme/__tests__/global-css.test.ts`, `__tests__/alerts-canvas-fidelity.test.ts`.
- **No se tocan**: `src/screens/map/`, `src/screens/profile/`, `STATUS_TONE_CLASSES`, `ui-copy-table.ts`, el catálogo de copy, `package.json` y el lockfile, ni nada del backend.

## Desviaciones conscientes del canvas

La tabla completa está en [[requirements]] §Desviaciones; aquí solo el porqué técnico de las tres que más pesan:

- **Vidrio sin desenfoque.** El artboard desenfoca 12 px detrás de un fondo al 86 %. Con ese alfa el desenfoque es casi imperceptible, y `expo-blur` 57 en Android exige un `blurTarget` que el hero no tiene (sin él cae a «none» con `console.warn`). Reproducirlo exigiría un `BlurTargetView` alrededor de la foto, una dependencia de ordenamiento de capas nueva y más superficie de fallo por un efecto que el ojo no distingue.
- **Oscurecimiento por capa negra.** `filter: brightness(.86)` no existe en RN; una capa negra al 14 % produce la misma multiplicación `foto · 0,86`. El modelo de contraste de R17 usa exactamente ese factor.
- **Padding lateral 24 frente a 16** (D1): cambiarlo a 16 en `home-content` mueve cuatro secciones con candados propios que no son de esta feature.

## Alternativas descartadas

- **`BlurView` / `BlurTargetView` en el vidrio**: ver arriba. Se reabre solo si el humano ve en el smoke de R21 que el vidrio plano no se lee sobre fotos claras.
- **Reescribir `STATUS_TONE_CLASSES`**: lo consume el mapa y su test; derivar la tabla del hero evita tocar ambos.
- **Hero fijo (sticky) de 330 px**: come altura útil en pantallas pequeñas y no lo dibuja el canvas (D4).
- **Alto en la raíz con `[CONTINUOUS_CORNER, { height }]`**: rompe la cuenta del literal por fichero.
- **Una clase `h-82.5` para el alto**: es una altura de un solo uso; la carta pide token solo desde la segunda repetición y el alto ya vive en una constante exportada.
- **El anillo como hermano del punto en la píldora**: rompe `pill.children == [punto, texto]` de `#73 R8` y obliga a otro contenedor `relative`.
- **Mantener HeroUI `Avatar` en la variante `glass`**: su `Avatar.Fallback` trae `entering`, mantiene `pet-avatar-fallback-pet-1` en el inventario de entradas y su geometría pelea con el aro de 2 px.
- **Entradas del hero con `entering`**: entrarían en `homeEnteringIds` y acoplarían el hero a la secuencia de `HomeEntrance`.
- **Reusar las constantes de la celebración** para el retraso de 80 ms y el de 450 ms: mismo número, otro significado.
- **Mover el relleno de 24 a 16 en `home-content`**: es D1; adelantaría C13.
- **Contraste «de verdad» con una captura de la foto**: el peor caso (negra o blanca) acota cualquier foto sin dependencia de dispositivo.

## Riesgos

- **Nombres largos**: el pie está anclado abajo; un nombre largo envuelve y crece hacia arriba sobre la foto, y a partir de tres líneas puede acercarse a la fila superior. El artboard no lo acota. R21 lo mira con un nombre de 25 caracteres; si molesta, `numberOfLines={2}` es un cambio de una línea con su test.
- **Gris en el degradado**: lo evita escribir `${color}00` y no `transparent`; R3 y la guarda de R19 lo candan, y R21 lo confirma a ojo.
- **Dispositivo frente a Jest**: ninguna de las cifras de posición (punto en línea, punto de alerta, recorte del `ScrollView`) se puede comprobar en Jest; son R21.
- **Fundido de la foto frente a su decodificación**: supuesto 5.
- **Rebase con #196**: el rebase invalida los hashes de la trazabilidad; no rebasear tras escribirla o reapuntar.
- **Cola de merge**: `home/index.tsx` es un fichero caliente (otras features de Inicio). El reparto de ficheros que mantiene el leader protege el árbol, no la historia: tras mergear una dependencia se re-miden las cuentas de §Base medida.

## Texto de la Enmienda #195

Este es el texto canónico que R20 incorpora a `docs/ui-guidelines.md` tras la firma. El test lo lee de aquí por contenido; si se edita, se edita aquí primero. El primer bloque va al final del fichero; el segundo, justo después del párrafo `Enmendado por #67 (A8)` del punto 2.

```markdown
## Enmienda #195 — cabecera fotográfica de Inicio fiel al canvas

> Enmienda de `ui-guidelines` por `mobile-home-photo-hero-canvas` (#195, 2026-10-21).
> Directiva del humano: «el diseño final como el artifact» y «Píxel exacto».

**Qué cambia**: la cabecera de Inicio sigue la del artboard `Inicio.dc.html` del canvas aprobado (versión 85). El hero fotográfico de #67 se conserva y se ajusta: alto 330, foto alineada arriba, velo oscuro superior de 130 px (`scrim`) y degradado inferior de 160 px hacia el fondo, ambos sobre la foto y sin banda opaca. La fila superior (avatares, «+» y campana) y el pie (píldora «En línea», nombre, raza y cifra de paseos) van **encima** de la foto, no en bandas aparte. Se añaden los tokens `scrim` y `photo-dim` (capa negra al 14 % en dark, equivalente al `brightness(.86)` del artboard).

**Qué se revierte, de forma nombrada**: la banda opaca bajo el texto (#67 R3 y R3b) y, con ella, la frase de A8 «la garantía de AA la da la banda opaca». La garantía de AA pasa a darla el degradado, medido contra el peor caso (foto negra o blanca) en `specs/mobile-home-photo-hero-canvas/design.md` §Contraste. Excepción nombrada: la raza y la etiqueta de paseos, en light, quedan en 4,26:1 y 4,36:1 (suelo 4,2:1) en lugar de 4,5:1; si el humano lo rechaza, pasan a `text-foreground`.

**Vidrio plano**: los círculos de 44 de la fila superior usan `bg-glass-surface-strong` sin desenfoque (`expo-blur` en Android exige un `blurTarget` y con alfa .86 el desenfoque no se aprecia).

**Anillo de ping en Inicio**: la píldora «En línea» del hero de Inicio pinta un anillo con `PingRing` (escala de .55 a 1.5, opacidad de .55 a 0, 1600 ms, sin retraso). Esta excepción cubre solo esa píldora; la regla de #167, «Ninguna otra pantalla usa anillos de ping sin una enmienda propia», sigue vigente para el resto. Bajo reduce motion el hero de Inicio y la burbuja de Pingo quedan en su estado final (el artboard pone `animation: none`), sin anillo: esto difiere de la convención de conservar los fundidos y vale solo para esas piezas.

**Hueco de 14 px entre el hero y el contenido**: el `gap` del artboard, por la enmienda de fidelidad del 2026-10-13. El padding lateral del resto de Inicio no cambia (24) hasta que otra feature rehaga esas secciones.

Detalle y tests en `specs/mobile-home-photo-hero-canvas/requirements.md` (R1 a R20).

- [ ] Enmienda #195 aprobada por humano
```

```markdown
> **Enmendado por #195.** Desde la Enmienda #195 (2026-10-21) la garantía de AA del texto del hero de Inicio ya no la da una banda opaca bajo el texto (#67 R3) sino los degradados del propio hero, medidos contra el peor caso (foto negra o blanca) en `specs/mobile-home-photo-hero-canvas/design.md` §Contraste, con la excepción nombrada de la raza y la etiqueta de paseos en light. El párrafo anterior se conserva como historia.
```
