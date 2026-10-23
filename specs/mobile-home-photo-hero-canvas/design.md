---
feature: "mobile-home-photo-hero-canvas"
status: approved     # draft | approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-home-photo-hero-canvas]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Rutas de código relativas a `mobile-pet-tracker/`. El artboard de referencia es
> `canvas-ref/Inicio.dc.html` (versión 85 del canvas, copia congelada junto a esta spec).
>
> **Enmienda A1 (2026-10-21).** El supuesto 1 de la versión aprobada («los hijos de una entrada que arranca en opacidad 0 acaban siendo `toBeVisible`») lo refutó el implementer con sondas y pasó a ser un hecho medido (§Hechos medidos, H1). Cambian este fichero (§Premisas, el bloque «Movimiento», §Supuestos, §Hechos medidos, §Archivos afectados y §Riesgos), `requirements.md` (R14, R16, §Candados, §Aprobación), `tasks.md` (bloques R14 y R16) y `traceability.md`. **No cambia** ninguna otra premisa, decisión, cifra, R-id ni el orden global; el resto de la spec sigue aprobado y no se reabre.
>
> **Enmienda A2 (2026-10-22).** Codex midió que R14 (sin condición de mascota) arranca dos entradas de 400 ms también con `pet = null` y que eso pone rojo un contador global anterior de R2. Cambian solo este fichero (§Hechos medidos, H2), `requirements.md` (una fila más en §Candados de visibilidad y de forma de style, §Aprobación y las líneas `Test` de R2 y R14), `tasks.md` (bloque R14, bloque R2 y dos cuentas) y `traceability.md` (filas R2 y R14). **No cambia** ningún valor, R-id ni premisa; el resto de la spec sigue aprobado.
>
> **Enmienda A3 (2026-10-22).** Codex midió que la candidata de R15 (`gap: 16` a `gap: 14` en el `contentContainerStyle` de `screen-home`) pone rojo un `it` anterior de R6 que no figuraba en ninguna tabla y que afirma ese mismo `gap`. Cambian solo este fichero (§Hechos medidos, H3), `requirements.md` (una fila más, la 13, en §Candados de visibilidad y de forma de style, §Aprobación y la línea `Test` de R15), `tasks.md` (bloque R15 y una fila de «Cuentas a re-medir») y `traceability.md` (fila R15). **No cambia** ningún valor, R-id ni premisa; el resto de la spec sigue aprobado.
>
> **Enmienda A4 (2026-10-22).** Decisión del humano (D6), con R1 a R20 ya implementados: el hero pasa de 330 a 430 de alto, su degradado inferior de 160 a 100 px y su velo superior de 130 a 90 px. Medido: con las paradas proporcionales del artboard R17 se incumple; con `24 %` y `44 %` se cumple (§Hechos medidos, H4). Cambian este fichero (H4, tres filas de la tabla del artboard, §Estructura, §Contraste, §Archivos afectados, §Desviaciones, §Alternativas, §Riesgos y la sección final «Texto de la Enmienda A4 de #195»), `requirements.md` (D6, R1, R3, R17, R18, R20, R21, la fila 14, §Desviaciones, §Fuera de alcance y §Aprobación), `tasks.md` (bloques R1, R3, R17, R18 y R20, la cadena de commits y las cuentas) y `traceability.md` (filas R1, R3, R17, R18 y R20). **No cambia** ningún token, clase, `testID`, alfa, suelo de contraste ni R-id; el resto de la spec sigue aprobado y no se reabre.

## Premisas contrastadas

Leídas en el árbol de la worktree `Pet-Tracker-wt-195`, commit `07bac290` sobre `origin/main` `c0a35a68` (2026-10-21). Se anclan por contenido, no por número de línea ni por recuento global.

- **Hero actual** (`src/components/pet-hero-header.tsx`): exporta `PET_HERO_MEDIA_HEIGHT` (260), `PET_HERO_FADE_HEIGHT` (64), `STATUS_DOT_PULSE`, `PetHeroHighlight`, `PetHeroStatusTone`, `PetHeroStatus`, `STATUS_TONE_CLASSES`, `PetHeroHeaderProps` (`pet`, `variant` `'bleed' | 'card'` con `'card'` por defecto, `highlight`, `status`, `children`) y `PetHeroHeader`. Hoy el slot superior (`pet-hero-slot`, `bg-background px-6 pb-3`, `paddingTop: insets.top + 12`) y la banda inferior (`pet-hero-caption`, `bg-background`) son **opacos y van fuera de la foto**; el único velo es de 64 px en cada borde, del color de fondo. El comentario del fichero explica por qué el transparente se escribe con el propio color y alfa `00` y nunca con `transparent`.
- **Consumidores**: `<PetHeroHeader` aparece **solo** en `src/screens/home/index.tsx` (candado de `tab-headers-canvas`). Perfil dejó de usarlo en #168, de modo que `variant="card"` no tiene consumidor de producción. `src/screens/map/index.tsx` importa `STATUS_TONE_CLASSES` y `PetHeroStatusTone`: por eso no se tocan.
- **`PetAvatar`** (`src/components/pet-avatar.tsx`, 57 líneas): con foto pinta un `Image` de `expo-image` (`testID` `pet-avatar-image-<id>`); sin foto, el blobatar con `SvgXml` (`pet-avatar-fallback-<id>`). En modo rectángulo (`size` objeto) el blobatar se escala al lado menor, centrado y sin recortar (existe el `it` `escala el blobatar al rectángulo sin recortarlo`). Hay un fichero de snapshot de `pet-avatar`, de modo que cualquier prop nueva se reenvía **solo cuando se pasa**. `contentPosition="top"` de `expo-image` equivale a `object-position: 50% 0%`.
- **`PetSwitcher`** (`src/components/pet-switcher.tsx`, 98 líneas): variantes `default` (la comparten Inicio y las pantallas de comidas, vinculación, salud y recordatorios) y `avatars` (Perfil). No hay variante con círculos de vidrio. Hoy el avatar del selector de Inicio sale de HeroUI `Avatar`, cuyo `Avatar.Fallback` trae una prop `entering` propia: de ahí que `pet-avatar-fallback-pet-1` figure en `homeEnteringIds` en `#152 R5`.
- **Fila superior de Inicio**: `home-hero-actions` (`flex-row items-center gap-3`) con **dos** hijos, el envoltorio `flex-1` del selector y la campana `home-alerts-bell` (`size-11 items-center justify-center rounded-full`, icono `Bell` 24 en `muted`, punto `home-alerts-dot`). **No hay botón «+»**: es nuevo. `Plus` no se importa hoy en Inicio, y el mock de `reicon-react-native` del test de Inicio no lo tiene. `t('profile.addPet')` aparece una vez en `home/index.tsx` (el `EmptyState` del estado sin mascotas), y `ui-language.test.ts` cuenta `t('clave'` por fichero.
- **Burbuja de Pingo** (#190): ya es una fila propia dentro de `home-content` (`HomeEntrance index={0} testID="home-entrance-pingo"` > `home-pingo-phrase` `flex-row items-end gap-2.5` > `home-pingo-bubble` `flex-1 rounded-tile rounded-br-4 bg-surface px-3.5 py-3 shadow-sm` con `style={CONTINUOUS_CORNER}` + `PingoFloat testID="home-pingo-float"` con la pose de 64). `--radius-4` existe ya (lo añadió #190).
- **Movimiento** (`src/theme/motion.ts`, cerrado por `motion.test.ts › no exporta nada más`, 31 claves): ya existen `MOTION_CELEBRATION_RISE_OFFSET_Y` (14), `MOTION_CELEBRATION_EASE_OUT` (`{ easing: Easing.bezier(0, 0, .58, 1), reduceMotion: ReduceMotion.System }`), `MOTION_SURFACE_MS` (400), `MOTION_CELEBRATION_POP_PEAK` (1.08), `MOTION_POP_SCALE` (.6), `MOTION_PING_FROM` (.55), `MOTION_PING_TO_SCALE` (1.5), `MOTION_PING_TIMING` (2400) y el componente `PingoFloat`. `PingRing` (`src/components/ping-ring.tsx`, 36 líneas) recibe `testID`, `delay` y `className`; con reduce motion queda en escala 1 y opacidad .3. `PopIn` (`src/components/pop-in.tsx`) es el patrón de entrada con valores compartidos que arranca en opacidad 0. **Corregido por la Enmienda A1:** la versión aprobada añadía que sus hijos se afirman `toBeVisible`, y es falso. `pop-in.test.tsx` monta con Reanimated real (solo `useReducedMotion` sustituido), temporizadores falsos y `act`, lee la opacidad real con `getAnimatedStyle(...)` y afirma la presencia del hijo con `toBeOnTheScreen()`; no hay ningún `toBeVisible` sobre un hijo (H1).
- **Tokens que ya existen y se usan sin tocar**: `tracking-title` (-0.02em), `text-28`, `text-15`, `text-2xs`, `rounded-tile` (18), `rounded-br-4`, `rounded-card` (20), `bg-surface-secondary`, `border-border`, `bg-glass-surface-strong`, `bg-default`. Las clases decimales de Tailwind v4 usadas por esta spec existen por la misma mecánica que `bottom-4.5` y `h-3.5`: `size-2`, `size-2.25`, `size-3.5`, `size-9`, `size-11`, `top-2.25`, `right-2.5`, `-right-0.75`, `-bottom-0.75`, `leading-5.25`, `leading-8` (32), `leading-8.5` (34), `bottom-1.5`, `inset-x-4`, `gap-1.5`, `py-0.75`, `px-2.5`, `p-0.5`, `p-1`, `-m-1`. **No existen** (y la spec no los usa): una altura de 330 (430 desde la Enmienda A4) como clase (se pasa por `style`) y los tokens `scrim` y `photo-dim`.
- **`useThemeColors`** (`src/theme/use-theme-colors.ts`): exige hex de seis dígitos, resuelve `--color-<token>` y luego `--<token>`, y **cae a `foreground` en silencio** si falta el token. Por eso `scrim` es obligatorio en `global.css` y R4 lo candan.
- **Guardas que la feature toca o roza**, verificadas por contenido: `consistency-classnames` (tabla `directUses` de `#62 R14` por fichero: hero 1 y Home 1, **no hay un total del repositorio que citar**; el `it` del skeleton fija `className="w-full"` + `style={{ height: PET_HERO_MEDIA_HEIGHT }}` sin `rounded-`); `legibility-classnames` (`#61 R4`: `text-accent-strong` hero 1 y Home 2; ningún `useThemeColors([... 'accent' ...])` fuera de `empty-state.tsx`); `alerts-canvas-fidelity` (`#174 R12`: inventario por token; solo `tracking-title` necesita el hero; `text-15`, `rounded-10`, `border-b-5` y `tracking-caps` no se ven afectados; existe un test «cada `tracking-*` va con su `text-*`»); `design-drift` (R9 cubre `pet-hero-header.tsx` y `pet-avatar.tsx`; `HEX_LITERAL` exime solo la forma `#NNN R<n>`); `#173 R15` (cero `shadow-` en `pet-switcher.tsx`); `hero-header-amendments.test.ts` (comprueba el marcador `**Enmendado por #67 (A8) — corrección de un hecho falso.**` y el bloque de firma canónico); y el bloque `Enmienda #190` de la carta, cuyo texto fija un test de forma exacta.
- **Mocks de Reanimated**: `test/jest-setup.js` mockea `react-native-worklets` y llama a `setUpTests()`. El test del hero sustituye `default` por `{ ...actual.default, View }` (así `Animated.View` es un `View` simple), `withTiming: jest.fn((v) => v)`, `withRepeat`, `withSequence`, `cancelAnimation` y `useReducedMotion` vía `mockUseReducedMotion`; **no** mockea `withDelay`. Consecuencia medida (A1, H1): con ese `withTiming` el valor final se aplica en la primera llamada, de modo que en ese fichero ni el arranque en 0 ni los 80 y 400 ms de R14 son observables; solo lo son los **argumentos** de las llamadas. El test de Inicio mockea `withTiming → mockWithTiming(value, config)` (devuelve el valor), `withDelay: jest.fn((_d, a) => a)`, `withRepeat`, `withSequence → último paso`, `withSpring → valor`, `useReducedMotion → mockUseReducedMotion()`, y `useSafeAreaInsets` con `top` 40 y `bottom` 24 (de ahí `paddingBottom` 120).
- **`expo-blur` 57.0.2**: en Android, un `BlurView` sin `blurTarget` cae a «none» y escribe `console.warn`. La barra flotante de pestañas ya tiene ese desenfoque inerte; es una deuda previa.
- **Premisas del encargo corregidas por el árbol**: (a) Perfil ya no usa el hero; (b) la píldora «En línea» y la campana existen desde #67, #73 y #78, solo el «+» es nuevo; (c) el pulso actual de la píldora es de opacidad (`STATUS_DOT_PULSE`), no un `ping`; (d) la burbuja de Pingo ya es fila propia, solo cambian su aspecto y su `pop`; (e) el registro habla de una «tarjeta» (C12) pero el canvas ya adoptó la foto a sangre, así que #67 se **conserva y se ajusta**; (f) C13 y C14 son candidatas del informe de exploración, no features registradas.

## Supuestos no verificados

El implementer los confirma antes del test rojo que los usa; si alguno cae, avisa al leader antes de seguir:

1. *(Hueco marcado por la Enmienda A1. Aquí vivía el supuesto «la visibilidad en Jest de los hijos de una entrada que arranca en opacidad 0», que quedó refutado y pasó a §Hechos medidos, H1. Los números 2 a 5 no se renumeran: §Riesgos y R21 los citan por número.)*
2. **Origen de las posiciones absolutas** (R9, R12, R21). El artboard usa `box-sizing: border-box` y RN también, pero un hijo absoluto puede quedar 1 a 2 px distinto del borde del padre (Yoga mide desde el borde de relleno). Las cifras de las clases (`-bottom-0.75`, `-right-0.75`, `top-2.25`, `right-2.5`) son las del artboard; el smoke de R21 comprueba la posición real y, si hace falta, se ajusta la clase, no la estructura.
3. **El `-m-1` del `ScrollView` horizontal con `p-1` en el contenido** (R10) basta para que el punto de 14 px, que sobresale 3 px de su chip, no se recorte. Se comprueba en dispositivo.
4. **Tipografía efectiva** (R6, R21): `leading-8.5` y `tracking-title` a 30 px dan 34 y ≈ -0,6 px; `text-sm` y `text-xs` traen sus interlineados por defecto. Se mide que ningún texto del pie se recorta.
5. **Fundido de la foto frente a su decodificación** (R2): el fundido corre al llegar el dato de la mascota. Si `expo-image` aún no ha pintado, la foto «aparece» tras el fundido. Es una limitación declarada; la ruta de arreglo es `onLoad` de `PetAvatar`, que esta feature no añade.

## Hechos medidos

Medidos en la worktree `Pet-Tracker-wt-195` con `react-native-reanimated` 4.5.1 y el nodo fiel de producción (`Animated.createAnimatedComponent(View)`); evidencia en `progress/impl_mobile-home-photo-hero-canvas.md`. Se numeran `H<n>` para no mezclarse con los supuestos.

### H1. Los hijos de un nodo animado que arranca en opacidad 0 no son `toBeVisible` en Jest, con ningún temporizador (R14, R16)

Sustituye al supuesto 1 de la versión aprobada. Tres sondas contra el nodo fiel, con el doble de HERO (`withTiming: jest.fn((v) => v)`):

- (a) temporizadores reales y `waitFor`: `expect(instance).toBeVisible()` falla («Received instance is not visible»).
- (b) temporizadores falsos y `act` de 500 ms: falla.
- (c) valor inicial 1 (lo que da `useReducedMotion() === true`): pasa.

**Mecanismo** (rutas bajo `mobile-pet-tracker/node_modules/react-native-reanimated/src/`; se localizan por contenido, no por línea):

- `createAnimatedComponent/PropsFilter.tsx`, `filterNonAnimatedProps`: cada handle de `useAnimatedStyle` dentro de `style` se sustituye por `_initialPropsMap.get(handle)`. Ese mapa solo se escribe cuando `component._isFirstRender` es cierto, con `{ ...handle.initial.value, ...initialUpdaterRun(handle.initial.updater) }`. El `style` del nodo host se queda con los valores **del primer render** y no se actualiza.
- `createAnimatedComponent/AnimatedComponent.tsx`, bloque `if (IS_JEST)` con `Object.assign(jestAnimatedStyleOrProps.value, style.initial.value)` (el comentario dice que `props` del objeto de prueba es una copia): los valores vivos se escriben en `jestAnimatedStyle.value`, **no** en `props.style`.
- `jestUtils/index.ts`, `getCurrentStyle` (la función que exporta `getAnimatedStyle` y que lee `toHaveAnimatedStyle`): mezcla `props.style`, `jestInlineStyle` y `props.jestAnimatedStyle.value`, así que ve el valor vivo.
- `@testing-library/react-native` 14.0.1, `dist/matchers/to-be-visible.js`, `isHiddenForStyles`: aplana `instance.props.style` y devuelve «oculto» si `display === 'none'` o `opacity === 0`, y repite la comprobación subiendo por `instance.parent` hasta la raíz (además de `isHiddenFromAccessibility`). Es decir, mira el `style` de los nodos host, el propio y todos sus ancestros: ve el del primer render. Avanzar el reloj o esperar no lo cambia; por construcción no puede.

**Consecuencias, todas verificables:**

1. Falla `toBeVisible` en el **propio nodo animado** y en **cualquier descendiente**, mientras el primer render sea opacidad 0. Las consultas de RNTL (`getByTestId`, `getByText`, `within`) no miran la opacidad y encuentran los nodos; `toBeOnTheScreen()` solo comprueba que el nodo está en el árbol y pasa.
2. La opacidad real se lee con `getAnimatedStyle(nodo)` (o `toHaveAnimatedStyle`, que sin `shouldMatchAllProps` solo comprueba las claves que se le dan). Con Reanimated real y temporizadores falsos, `act(async () => { jest.advanceTimersByTime(n); })` mueve ese valor: es el patrón de `pop-in.test.tsx`.
3. Con el doble `withTiming: jest.fn((v) => v)` (HERO, Inicio) el valor final entra en la primera llamada: el arranque en 0 y los 80 y 400 ms no se ven en `getAnimatedStyle`. Allí solo se afirman los **argumentos** de las llamadas. Para observar el tiempo hace falta Reanimated real, en un fichero propio (HEROMOT, `components/__tests__/pet-hero-header-motion.test.tsx`), porque no se puede tener el doble y el real en el mismo fichero de test.
4. Con reduce motion encendido el valor inicial es el final desde el primer render (`useReducedMotion()` lo decide, sin efecto que lo corrija), de modo que el primer render ya pinta opacidad 1 en el `style` del host y `toBeVisible` **sí** pasa de forma síncrona, en el nodo y en sus descendientes. Esa es la prueba legítima de «lo que se ve está visible».
5. Con un `useAnimatedStyle` en el slot, el pie y la burbuja, su `props.style` deja de ser un objeto y pasa a ser un array, p. ej. `[{ top: 52 }, { opacity: 0, transform: [{ translateY: 14 }] }]`. Cualquier `toEqual({ top: 52 })` o `toMatchObject({ top: 52 })` sobre ese `props.style` deja de valer. En HERO, HEROMOT y BP se aplana con `StyleSheet.flatten`. En `screens/home/index.test.tsx` **no** puede aparecer la cadena `StyleSheet` (cinco `describe` de `design-drift` escanean ese fichero con `/text-\[10px\]|HEX_LITERAL|StyleSheet/i`): allí se usa `[nodo.props.style].flat(Infinity)` con `toContainEqual` de literales.

**Qué no cambia.** Fuera de los nodos que arrancan en opacidad 0 y sus descendientes, `toBeVisible` no se relaja nunca: el esqueleto, `pet-hero`, `pet-hero-fade-bottom` y todo lo que no cuelga de un nodo animado se siguen afirmando `toBeVisible`. La capa de la foto (`pet-hero-photo`) es la tercera que puede arrancar en 0: su valor inicial es `reduceMotion || !pet ? 1 : 0` (ver `pet-hero-header.tsx`), de modo que con una mascota ya en el primer render y reduce motion apagado arranca en 0 y `pet-hero-media` queda bajo la regla de `toBeOnTheScreen()`. En Inicio, `pet-hero-media` sigue siendo `toBeVisible` porque el hero monta por primera vez con `pet = null`, la capa queda en opacidad 1 y el `style` del host no se actualiza después; el fundido solo corre cuando llega la mascota. (La lista de nodos de la enmienda propuesta no incluía esta capa; se añade aquí por ser un caso real de la misma causa.)

### H2. El contador global de `withTiming` de R2 no distingue las entradas de R14 del fundido de la foto (R2, R14)

Medido por Codex con la candidata de R14 (efecto de montaje que lleva el slot y el pie de 0 a 1 con `withTiming(1, { ...MOTION_CELEBRATION_EASE_OUT, duration: 400 })` y el pie envuelto en `withDelay(80, …)`; evidencia en `progress/impl_mobile-home-photo-hero-canvas.md` §PARADA) sobre HERO › `#195 R2 … funde al llegar la mascota y al cambiar su id, sin repetir por nombre`:

- Con `<PetHeroHeader pet={null} />` (sin `children`), `expect(mockWithTiming).not.toHaveBeenCalled()` recibe **2 llamadas**, ambas `withTiming(1, { duration: 400, easing, reduceMotion: system })` (así las imprime el informe de Codex): la del slot y, a través del `withDelay` simulado como paso directo (`jest.fn((_ms, animation) => animation)`), la del pie. Ninguna es de 500 ms: la foto con `pet = null` sigue sin arrancar su fundido, como exige R2.
- Causa: R14 dice «WHEN el hero se monta» y no pone condición de mascota ni de `children`, y el doble de HERO (`withTiming: jest.fn((v) => v)`) cuenta **todas** las llamadas del hero sin saber de qué capa vienen. Un contador global solo distingue «ninguna» de «alguna»; con dos animaciones distintas montándose a la vez, la pregunta de R2 («¿arrancó la foto?») y la de R14 («¿arrancó la entrada?») comparten contador. Lo único que las separa en el doble es la **duración**: 500 (`MOTION_HERO_FADE_MS`) frente a 400 (`MOTION_SURFACE_MS`).
- Es el único `it` anterior que falló en la corrida de HERO + HEROMOT con la candidata (`Tests: 1 failed, 59 passed, 60 total`); el barrido de HOME por lectura no encuentra otro (`progress/spec_amend2_mobile-home-photo-hero-canvas.md`). Solo está medido que falla la primera aserción de contador del `it`, que lo aborta: las que la siguen no llegaron a evaluarse. Por lectura siguen valiendo y se confirma en el primer verde: la del `rerender` con mascota es un `toHaveBeenCalledWith(1, objectContaining({ duration: 500, … }))`, que acepta llamadas extra; las dos finales (`toHaveBeenCalledTimes(1)` y `not.toHaveBeenCalled()`) van tras un `mockClear()` y el efecto de entrada de R14 no se re-ejecuta en un `rerender` (dependencias estables).

**Qué no cambia.** Ningún valor de R2 ni de R14, y la candidata no se modifica para esquivar el contador: R14 pide la entrada al montar. Lo que se corrige es qué cuenta el `it` (fila 12 de [[requirements]] §Candados de visibilidad y de forma de style).

### H3. El `gap` del scroll de Inicio lo afirman dos `it` anteriores y la tabla de candados solo nombraba uno (R15)

Medido por Codex con la candidata de R15 (una sola línea en `src/screens/home/index.tsx`: el `gap` del `contentContainerStyle` del `ScrollView` `screen-home` pasa de 16 a 14; el `paddingBottom` no cambia; evidencia en `progress/impl_mobile-home-photo-hero-canvas.md` §«R15 — rojo y PARADA obligatoria por otro it anterior»). Con el fichero HOME completo y la candidata aplicada: `Tests: 1 failed, 265 passed, 266 total`. Los tres rojos intencionales del commit de test de R15 pasan; el único rojo es un `it` anterior:

- HOME › `R6: home carga pets y selecciona › pads the content below the status bar with the top safe-area inset`, con `Expected gap: 16` y `Received gap: 14` en `index.test.tsx:497` (la línea es del momento de la medida: el ancla es el título, no el número). Su aserción es `expect(screen.getByTestId('screen-home').props.contentContainerStyle).toEqual({ gap: 16, paddingBottom: 120 })`, seguida de `home-states` `style` `toEqual({ paddingHorizontal: 24, paddingTop: 52, gap: 16 })`.
- Causa: el `ScrollView` `screen-home` es el mismo en todas las ramas de Inicio, de modo que su `contentContainerStyle` lo afirman todos los `it` que lo miran, sea cual sea la rama que monten. §Candados de R15 solo enumeraba el que monta la mascota con el hero (`R5: Home usa el hero compartido › conserva gap y paddingBottom`); el de R6 monta la lista de mascotas pendiente (`home-states`, sin hero) y comprueba el mismo valor. Lo que cambia es el valor, no la visibilidad ni un contador: el `it` es falso por construcción en cuanto R15 se cumple.
- Todos los `it` de `src/` que nombran `contentContainerStyle` de Inicio, medidos con `grep -n "contentContainerStyle" src/screens/home/index.test.tsx` (4 líneas) y `grep -rl "screen-home"` / `grep -rl "home-states"` sobre los ficheros de tests (solo HOME): el de R6 (fila 13), el de R5 (ya enmendado en el commit de test de R15, 14 y 120) y los dos `it` nuevos de `#195 R15` (que nacen con 14). No hay un quinto.
- `home-states` conserva su propio `gap: 16`: R15 dice que el `gap` de 14 «alcanza también a `home-states`», y eso es el hueco del **scroll** entre sus hijos (el `gap` del `contentContainerStyle`), no el interno de `home-states`. Así lo cuentan el `it` de R6 (`home-states` en `gap: 16`) y el segundo `it` nuevo de `#195 R15` (`contentContainerStyle` en 14 y `home-states` en 16). La candidata de Codex no toca el `gap` de `home-states`.

**Qué no cambia.** Ningún valor de R15: la candidata no se condiciona por rama ni se cambia para esquivar el `it`, porque R15 pide `gap: 14` para el scroll. Lo que se corrige es qué espera el `it` de R6 (fila 13 de [[requirements]] §Candados de visibilidad y de forma de style). A diferencia de la mayoría de las enmiendas de H1 y de la de H2, que nacen verdes, aquí el `it` enmendado **nace rojo** (la producción sigue en 16 hasta el verde de R15).

### H4. Con 100 px de degradado las paradas proporcionales incumplen R17; con 24 % y 44 % se cumple (R1, R3, R17, R18)

No es un hallazgo de Codex sino una **decisión del humano** (D6, 2026-10-22), tomada con R1 a R20 implementados: tras ver una comparativa con su foto real de 960×1280 (3:4; a 393 de ancho mide 524 de alto) eligió `PET_HERO_MEDIA_HEIGHT` 430, `PET_HERO_FADE_HEIGHT` 100 y `PET_HERO_SCRIM_HEIGHT` 90, porque 330 recorta demasiado y 160 de degradado tapaba demasiada foto. Lo que esta spec debía medir era si esa variante sigue cumpliendo R17 y qué pasa con el pie. Se midió con una réplica literal del modelo de `home-photo-hero-canvas.test.ts` (mezcla lineal sobre la peor foto negra o blanca, ×0,86 en dark, luminancia WCAG, tokens de `global.css`, las mismas distancias `d` de §Contraste); no se asumió ninguna cifra.

**Las distancias no cambian.** El pie sigue anclado a `bottom-1.5`, de modo que `d` (px del borde inferior del frame al borde superior de cada texto) es el de siempre: píldora 90, nombre 64, raza 26, valor de la cifra 54, etiqueta de la cifra 22.

**Alfa del degradado a esas distancias** (la cadena de producción pone el alfa `59` = .35 y `D9` = .85 en las paradas indicadas):

| `d` | antes (160 px; `35 %`, `65 %`) | 100 px con `35 %` y `65 %` | 100 px con `24 %` y `44 %` |
|---|---|---|---|
| 22 | 0,941 | 0,906 | 0,941 |
| 26 | 0,930 | 0,889 | 0,930 |
| 54 | 0,855 | 0,533 | 0,855 |
| 56 | 0,850 | 0,500 | 0,850 |
| 64 | 0,767 | 0,367 | 0,650 |
| 76 | 0,642 | 0,240 | 0,350 |
| 90 | 0,496 | 0,100 | 0,146 |
| 98 | 0,412 | 0,020 | 0,029 |

**Contraste resultante** (orden de R17: raza `d` 26, nombre `d` 64, etiqueta `d` 22, cifra `d` 54; las otras cinco filas del modelo no dependen del degradado y no cambian):

| Par | Antes (160 px) | 100 px, `35 %`/`65 %` | 100 px, `24 %`/`44 %` | Suelo |
|---|---|---|---|---|
| light raza | 4,26 | 3,86 (falla) | 4,26 | 4,2 (aceptado) |
| light nombre | 10,79 | 2,90 (falla) | 7,75 | 4,5 |
| light etiqueta | 4,36 | 4,02 (falla) | 4,36 | 4,2 (aceptado) |
| light cifra | 13,55 | 5,34 | 13,55 | 4,5 |
| dark raza | 6,51 | 5,87 | 6,51 | 4,5 |
| dark nombre | 9,77 | 2,97 (falla) | 6,74 | 4,5 |
| dark etiqueta | 6,67 | 6,13 | 6,67 | 4,5 |
| dark cifra | 12,79 | 4,72 | 12,79 | 4,5 |

**Veredicto.** (1) La variante D con las paradas proporcionales del artboard **no cumple R17**: el nombre, a 64 px, queda con alfa 0,37, por debajo del mínimo que exige el suelo de 4,5 (0,485 en light y 0,517 en dark contra la peor foto), y la raza y la etiqueta de light quedan por debajo incluso del 4,2:1 que el humano aceptó. Una foto clara, con el pie sobre blanco, ocultaría el nombre. (2) Con `24 %` y `44 %` **cumple sin relajar ningún suelo**: los puntos de quiebre del modelo pasan a ser alfa .85 a 56 px del borde inferior (parada `D9` en el 44 % desde arriba, porque (100 − 56) / 100 = 44 %) y alfa .35 a 76 px (parada `59` en el 24 %, porque (100 − 76) / 100 = 24 %). Por encima de los 56 px la fórmula es la de siempre, así que raza, etiqueta y cifra quedan **idénticas** (las dos cifras de la excepción aceptada de light, 4,26 y 4,36, no cambian) y solo el nombre baja, de 10,79 a 7,75 y de 9,77 a 6,74, muy por encima de 4,5. Las paradas no se derivan de una regla única: son las que dejan al nombre con alfa 0,65 (mínimo exigido 0,52) sin tocar nada de lo que ya estaba medido; ver la alternativa del tramo opaco en §Alternativas. (3) La **contrapartida** es que el degradado nuevo es más denso que la vista previa proporcional que vio el humano: a 56 px el alfa es .85 y no .50, y la cobertura media del degradado sube de 0,565 (antes y proporcional) a 0,680. Se declara en la enmienda para que lo vea al firmar.

**Geometría del pie.** La columna izquierda mide pastilla 22 (`text-xs` de interlineado 16 más `py-0.75` ×2) + `gap-1` 4 + nombre de interlineado 34 + `gap-1` 4 + raza de interlineado 20 = 84 px, más los 6 de `bottom-1.5`: la píldora arranca a 90 px del borde inferior. Cabe en un degradado de 100 px con **10 px de margen** (allí el alfa es 0,146, pero la píldora lleva su propio fondo opaco); el nombre queda 36 px dentro; sin píldora (sin `status`) la columna mide 64 y sobran 36 px; la columna derecha (valor de interlineado 32 más etiqueta de 16, más 6) mide 54 y sobran 46. Con menos de 90 px el pie saldría del degradado: por eso D6 dice que otras alturas obligan a recalcular.

**Dos hechos que el modelo de R17 no cubre** y que quedan declarados, no resueltos:

1. *Nombre a dos líneas.* El borde superior de su primera línea queda a unos 98 px del borde inferior, donde el degradado ya es casi transparente: el contraste de `foreground` allí es 1,06 en light y 1,38 en dark (con el degradado antiguo de 160 px era 3,46 y 3,35, tampoco 4,5). El problema existía y A4 lo empeora; R17 solo mide nombres de una línea. Se propone `numberOfLines={1}` como decisión del humano, fuera de esta feature (§Fuera de alcance de [[requirements]]) y sin suelo nuevo.
2. *Velo de 90 px frente a la fila superior.* La fila (`pet-hero-slot`) ocupa de `insets.top + 12` a `insets.top + 56`: sobrepasa los 90 px del velo en cuanto `insets.top` ≥ 35 (6 px con el mock de jest de 40; 25 px con 59). El alfa del velo en el centro de la fila baja de 0,216 (130 px) a 0,089 (90 px) con `insets.top` 40, y de 0,143 a 0,000 con 59. R17 no mide el velo superior (los botones llevan su propio vidrio); lo juzga el humano en el smoke de R21.

**Qué no cambia.** Ningún alfa de la cadena (`00`, `59`, `D9`, `80`), la cadena del velo, el pie, los tokens ni los suelos. Lo que se corrige son las constantes, las dos posiciones de la cadena inferior y lo que el modelo, la carta y ocho `it` de HERO afirman con las cifras antiguas (fila 14 de [[requirements]] §Candados de medida y de paradas). A diferencia de H1 y H2, y como H3, los `it` enmendados **nacen rojos**.

## Contraste con el artboard

Qué dibuja `Inicio.dc.html` y a qué clase o símbolo lo traduce esta spec. La columna «R» dice dónde se prescribe.

| Elemento del artboard | Valor del artboard | Traducción | R |
|---|---|---|---|
| Cabecera a sangre | alto 330, `margin 0 -16px` | `pet-hero-frame` con `{ height: PET_HERO_MEDIA_HEIGHT }`, que vale **430** (Enmienda A4, D6; el commit original de R1 puso 330); el hero ya es a sangre en Inicio | R1 |
| Foto | alineada arriba (`object-position: 50% 0%`), fundido 500 ms ease-out | `contentPosition="top"`; `withTiming(1, …)` 500 ms | R2 |
| Foto en dark | `brightness(.86)` | `pet-hero-dim` `bg-photo-dim` (negro al 14 %) | R4 |
| Velo superior | 130 px, `rgba(13,17,23,.5)` a 0 | `pet-hero-scrim-top`, `${scrim}80` a `${scrim}00`, alto **90** (Enmienda A4, D6) | R3 |
| Degradado inferior | 160 px; transparente 0 %, fondo .35 a 35 %, fondo .85 a 65 %, fondo 100 % | `pet-hero-fade-bottom`, alto **100** (Enmienda A4, D6), `${bg}00` 0 %, `${bg}59` **24 %**, `${bg}D9` **44 %**, `${bg}` 100 % (H4: las paradas proporcionales incumplen R17) | R3 |
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

- **Un solo hijo, `pet-hero-frame`.** Todo lo que antes se apilaba (slot, foto, velos, pie) pasa a ser capa de un frame de 430 (Enmienda A4; 330 hasta entonces) con `overflow-hidden` heredado de la raíz. Se descartó poner el alto en la raíz con `style={[CONTINUOUS_CORNER, { height }]}`: rompe la cuenta de `style={CONTINUOUS_CORNER}` (el candado `#62 R14` cuenta ese literal por fichero). El frame lleva solo `{ height: PET_HERO_MEDIA_HEIGHT }`.
- **Capas por orden de pintado** (R6 fija el orden): `pet-hero-photo` (foto o skeleton, con el fundido), `pet-hero-dim` (token `photo-dim`, siempre), `pet-hero-scrim-top` (solo con slot), `pet-hero-fade-bottom` (siempre), `pet-hero-slot` (solo con slot) y `pet-hero-caption`. Los tres overlays de color llevan `pointerEvents="none"` para que no se coman toques de la fila superior ni del pie.
- **El fundido es de la capa, no del `PetAvatar`.** Así no se toca `pet-avatar` más que por `contentPosition`, y el skeleton queda en opacidad 1 (el fundido solo corre con mascota; clave: `pet.id`, para que un cambio de mascota reinicie el 0 a 1).
- **Degradados como estilo inline**, no como clase: la cadena lleva los hex del hook (`useThemeColors(['background', 'scrim'])`), que no pueden ser clases estáticas. `transparent` está prohibido (negro con alfa cero, gris en el tramo medio); la parada transparente es `${color}00`. El prefijo `experimental_` de `experimental_backgroundImage` es el único nombre que existe en RN 0.86 (conservar el comentario). Los alfa del artboard se escriben en hex de 8 bits: .35 es `59`, .85 es `D9`, .5 es `80`. **Las posiciones de las paradas del degradado inferior ya no son las del artboard** (Enmienda A4): `24 %` y `44 %` en lugar de `35 %` y `65 %`, porque el degradado pasó de 160 a 100 px y las proporcionales dejan el nombre fuera de R17 (H4). Si `PET_HERO_FADE_HEIGHT` vuelve a cambiar, las posiciones se recalculan (`(altura − d) / altura` para `d` = 76 y 56) y R17 las vigila.
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
- **Cómo se prueba (Enmienda A1, H1).** Cada nodo animado que arranca en 0 (`pet-hero-slot`, `pet-hero-caption`, `pet-hero-photo` cuando el hero monta ya con mascota, el `Animated.View` de `BubblePop`) se prueba con dos pruebas que se complementan, y un descendiente suyo nunca se afirma con `toBeVisible` cuando el primer render es 0. (i) **Movimiento real**, en HEROMOT (hero) y BP (burbuja), con Reanimated real, solo `useReducedMotion` sustituido, temporizadores falsos y `act`: `getAnimatedStyle(nodo)` vale opacidad 0 y el desplazamiento de partida antes de avanzar el reloj, y opacidad 1 y desplazamiento 0 (o escala 1) tras avanzar exactamente el tiempo de R13 más un margen de 16 ms de fotograma; la presencia de los hijos se afirma con `toBeOnTheScreen()`. (ii) **Visibilidad real**, con reduce motion encendido: el primer render ya pinta el estado final, así que `toBeVisible()` síncrono sobre los descendientes sí se afirma. Las llamadas a `withTiming` y `withDelay` con sus argumentos exactos se siguen afirmando en HERO con el doble. Ninguna de las dos pruebas basta sola: (i) no prueba que algo sea visible para el usuario, (ii) no prueba la animación.
- **Mutaciones que las separan.** Una prueba (i) debe ponerse roja si el nodo arranca en opacidad 1 (nada animaría), y una prueba (ii) debe ponerse roja si, con reduce motion encendido, el nodo arranca en 0 (el usuario con reduce motion vería un hero invisible). Las dos están prescritas en `tasks.md` (R14 y R16).

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

Modelo, con los tokens reales de `global.css`. Distancia `d` en px desde el borde inferior del frame al borde **superior** de cada texto (peor caso: la parte más alta del texto es la que menos fondo tiene debajo). Alfa del degradado inferior (de 100 px desde la Enmienda A4):

- `d ≤ 56`: `1 − (d / 56) · 0,15`
- `56 < d ≤ 76`: `0,85 − ((d − 56) / 20) · 0,5`
- `76 < d ≤ 100`: `0,35 · (100 − d) / 24`

(Antes de la Enmienda A4, con el degradado de 160 px del artboard: `56 < d ≤ 104` → `0,85 − ((d − 56) / 48) · 0,5` y `104 < d ≤ 160` → `0,35 · (160 − d) / 56`. Los tramos de `d ≤ 56` son idénticos, de modo que raza, etiqueta y cifra no cambian; H4 tiene las tablas.)

Color efectivo = `fondo · alfa + foto · (1 − alfa)`; peor caso de foto = negra o blanca (en dark, la foto multiplicada por 0,86 antes). Distancias: raza 26, nombre 64, etiqueta de paseos 22, cifra 54.

| Par | Light | Dark | Suelo |
|---|---|---|---|
| Raza `muted` sobre degradado | 4,26 | 6,51 | 4,5 dark / 4,2 light (desviación aceptada) |
| Nombre `foreground` | 7,75 (A4; antes 10,79) | 6,74 (A4; antes 9,77) | 4,5 |
| Etiqueta de paseos `muted` | 4,36 | 6,67 | 4,5 dark / 4,2 light (desviación aceptada) |
| Cifra `foreground` | 13,55 | 12,79 | 4,5 |
| Tinta `accent-strong` sobre `surface-secondary` (píldora) | 5,70 | 6,43 | 4,5 |
| Punto `accent` contra `background` | 4,82 | 3,93 | 3,0 (no texto) |
| Punto `danger` contra `background` | 3,76 | 6,84 | 3,0 (no texto) |
| `foreground` sobre el vidrio plano | 13,71 | 11,46 | 4,5 |
| Icono `muted` sobre el vidrio plano | 3,60 | 4,79 | 3,0 (no texto) |

La banda opaca de #67 daba la garantía de AA porque no dependía de la foto; ahora el texto está sobre el degradado, que en la zona del texto cubre entre el 65 % (nombre; antes 77 %) y el 94 % (etiqueta) con el color de fondo, de modo que la foto aporta entre el 6 % y el 35 % (antes, 23 %). Por eso el peor caso se calcula contra la foto negra y la blanca, no contra una foto concreta. La raza y la etiqueta en light quedan **por debajo de 4,5**: se acepta nombrando la cifra en la enmienda y en la casilla, o se pasan a `text-foreground` (la salida si el humano la rechaza; cambia la clase de R6 y no la geometría). Las constantes del modelo son literales del test (`__tests__/home-photo-hero-canvas.test.ts`), nunca importadas de producción; los tokens se **leen** de `global.css`, de modo que cambiar un token sin recalcular pone el test en rojo. **Enmienda A4:** el modelo no leía producción y su único enlace con ella eran las regex de R3 sobre la cadena del degradado, con una zona ciega (cambiar a la vez la cadena y la regex dejaba R17 en verde). Ahora un `it` del mismo fichero lee `pet-hero-header.tsx` como texto, sin comentarios, y exige la altura del degradado y las dos posiciones **derivadas** de los puntos de quiebre literales del modelo (76 y 56 sobre 100 px: 24 % y 44 %); los números son literales del test y lo que se lee de producción es texto, nunca un símbolo importado.

### Documentación de la carta (R20)

La Enmienda #195 va al **final** de `docs/ui-guidelines.md`, tras `Enmienda #188 (E2)`, con el texto de §Texto de la Enmienda #195 (más abajo). No se edita dentro de `Enmienda #190`, `#67` ni `#167`: los tests fijan su texto. El párrafo de continuación de A8 se añade como una cita **nueva** después del párrafo `Enmendado por #67 (A8)`, nunca dentro de él (el test de `hero-header-amendments` fija ese párrafo). La excepción de ping para la píldora sigue el precedente de #188: la regla de #167 («ninguna otra pantalla usa anillos de ping sin una enmienda propia») sigue vigente para el resto. **Enmienda A4:** la sección y el bloque ya existen con las medidas del artboard; las frases que cambian y el texto exacto de cada una están en la última sección de este fichero, y se aplican en un solo commit que reescribe a la vez el primer bloque de §Texto de la Enmienda #195 y la sección de la carta (la comparación byte a byte del guarda de R20 no puede pasar por rojo entre medias). El segundo bloque (la cita tras A8) no cambia.

## Archivos afectados

Todos bajo `mobile-pet-tracker/` salvo indicación.

- `src/components/pet-hero-header.tsx` — reescritura (R1, R2, R3, R5, R6, R7, R8, R14, R18). Constantes 330/160/130; se quita `STATUS_DOT_PULSE`. **Enmienda A4:** las constantes pasan a 430/100/90 (`PET_HERO_MEDIA_HEIGHT`, `PET_HERO_FADE_HEIGHT`, `PET_HERO_SCRIM_HEIGHT`) y la cadena del degradado inferior a `${background}00 0%, ${background}59 24%, ${background}D9 44%, ${background} 100%`; nada más del fichero cambia (R1, R3).
- `src/components/pet-avatar.tsx` — prop `contentPosition` (R2).
- `src/components/ping-ring.tsx` — prop `timing` (R8).
- `src/components/glass-circle.tsx` — **nuevo** (R11).
- `src/components/pet-switcher.tsx` — variante `glass`, props `selectedOnline` y `trailing` (R9, R10).
- `src/screens/home/index.tsx` — fila superior, `addPetLabel`, `gap: 14`, `BubblePop`, pose de 56 (R11, R12, R15, R16).
- `src/screens/home/bubble-pop.tsx` — **nuevo** (R16).
- `src/theme/global.css` — tokens `scrim` y `photo-dim` (R4).
- `src/theme/motion.ts` — cuatro constantes (R13).
- `../docs/ui-guidelines.md` — Enmienda #195 y párrafo de continuación de A8 (R20), solo tras la firma. **Enmienda A4:** se reescriben en la sección de #195 las frases que nombran las medidas (última sección de este fichero) y, en el mismo commit, el primer bloque de §Texto de la Enmienda #195 de este fichero; nada más.
- `src/__tests__/home-photo-hero-canvas.test.ts` — **Enmienda A4:** `fadeAlpha` y las dos referencias del nombre en el `it.each` de R17, un `it` nuevo de R17 que lee `pet-hero-header.tsx` como texto y un `it` nuevo de R20 de ancla negativa sobre la carta. Los tests de HERO que se enmiendan están en la fila 14 de [[requirements]] §Candados de medida y de paradas.
- Tests nuevos: `src/components/__tests__/glass-circle.test.tsx`, `src/screens/home/bubble-pop.test.tsx`, `src/__tests__/home-photo-hero-canvas.test.ts` y, por la Enmienda A1, `src/components/__tests__/pet-hero-header-motion.test.tsx` (HEROMOT: Reanimated real para las pruebas de movimiento (i) del hero; ver H1, consecuencia 3).
- Tests enmendados (ver [[requirements]] §Candados): `components/__tests__/pet-hero-header.test.tsx`, `screens/home/index.test.tsx`, `components/__tests__/pet-switcher.test.tsx`, `components/__tests__/ping-ring.test.tsx`, `components/__tests__/pet-avatar.test.tsx`, `theme/__tests__/motion.test.ts`, `theme/__tests__/global-css.test.ts`, `__tests__/alerts-canvas-fidelity.test.ts`.
- **No se tocan**: `src/screens/map/`, `src/screens/profile/`, `STATUS_TONE_CLASSES`, `ui-copy-table.ts`, el catálogo de copy, `package.json` y el lockfile, ni nada del backend.

## Desviaciones conscientes del canvas

La tabla completa está en [[requirements]] §Desviaciones; aquí solo el porqué técnico de las que más pesan:

- **Alto 430 y degradados de 100 y 90 px** (Enmienda A4, D6). Es la única divergencia de medida con el artboard en la fotografía y sus dos degradados, y la decide el humano: con su foto real de 3:4, 330 recorta demasiado y un degradado de 160 px tapa demasiada foto. Obliga a mover las paradas del degradado inferior (`24 %` y `44 %`) para que R17 se siga cumpliendo (H4).

- **Vidrio sin desenfoque.** El artboard desenfoca 12 px detrás de un fondo al 86 %. Con ese alfa el desenfoque es casi imperceptible, y `expo-blur` 57 en Android exige un `blurTarget` que el hero no tiene (sin él cae a «none» con `console.warn`). Reproducirlo exigiría un `BlurTargetView` alrededor de la foto, una dependencia de ordenamiento de capas nueva y más superficie de fallo por un efecto que el ojo no distingue.
- **Oscurecimiento por capa negra.** `filter: brightness(.86)` no existe en RN; una capa negra al 14 % produce la misma multiplicación `foto · 0,86`. El modelo de contraste de R17 usa exactamente ese factor.
- **Padding lateral 24 frente a 16** (D1): cambiarlo a 16 en `home-content` mueve cuatro secciones con candados propios que no son de esta feature.

## Alternativas descartadas

- **`BlurView` / `BlurTargetView` en el vidrio**: ver arriba. Se reabre solo si el humano ve en el smoke de R21 que el vidrio plano no se lee sobre fotos claras.
- **Reescribir `STATUS_TONE_CLASSES`**: lo consume el mapa y su test; derivar la tabla del hero evita tocar ambos.
- **Hero fijo (sticky) de 330 px (430 desde la Enmienda A4)**: come altura útil en pantallas pequeñas y no lo dibuja el canvas (D4).
- **Alto en la raíz con `[CONTINUOUS_CORNER, { height }]`**: rompe la cuenta del literal por fichero.
- **Una clase `h-82.5` para el alto** (`h-107.5` con la Enmienda A4): es una altura de un solo uso; la carta pide token solo desde la segunda repetición y el alto ya vive en una constante exportada.
- **El anillo como hermano del punto en la píldora**: rompe `pill.children == [punto, texto]` de `#73 R8` y obliga a otro contenedor `relative`.
- **Mantener HeroUI `Avatar` en la variante `glass`**: su `Avatar.Fallback` trae `entering`, mantiene `pet-avatar-fallback-pet-1` en el inventario de entradas y su geometría pelea con el aro de 2 px.
- **Entradas del hero con `entering`**: entrarían en `homeEnteringIds` y acoplarían el hero a la secuencia de `HomeEntrance`.
- **Reusar las constantes de la celebración** para el retraso de 80 ms y el de 450 ms: mismo número, otro significado.
- **Mover el relleno de 24 a 16 en `home-content`**: es D1; adelantaría C13.
- **Contraste «de verdad» con una captura de la foto**: el peor caso (negra o blanca) acota cualquier foto sin dependencia de dispositivo.
- **Enmienda A4, paradas proporcionales (`35 %` y `65 %`) en el degradado de 100 px**: es lo que el humano vio en su vista previa, pero incumple R17 (nombre en 2,90:1 y 2,97:1; raza y etiqueta de light en 3,86:1 y 4,02:1; H4). Descartada por medida, no por gusto: relajarla exigiría bajar el suelo del nombre a menos de 4,5, y el humano solo aceptó dos excepciones concretas (4,26:1 y 4,36:1).
- **Enmienda A4, bajar los suelos de R17 para quedarse con las paradas proporcionales**: descartada; la spec no relaja suelos por comodidad (§Contraste).
- **Enmienda A4, tramo opaco** (alfa 1 hasta unos 26 px del borde inferior y caída después): subiría la raza y la etiqueta de light de 4,26 y 4,36 a unos 4,97:1 (el `muted` de light contra el fondo puro es 4,975:1) y **quitaría las dos excepciones aceptadas**, pero tapa más foto justo donde el humano pidió menos degradado y exige medir de nuevo los cinco textos y el pie. Se ofrece al humano, no se aplica: `24 %` y `44 %` mueven una sola referencia (el nombre) y dejan las excepciones como el humano las firmó.
- **Enmienda A4, `numberOfLines={1}` en el nombre** para cubrir la línea que queda sin degradado (H4, hecho 1): fuera de esta feature por decisión del humano (§Fuera de alcance de [[requirements]]); cambiaría el pie, el modelo de R17 y un candado propio.

## Riesgos

- **Nombres largos**: el pie está anclado abajo; un nombre largo envuelve y crece hacia arriba sobre la foto, y a partir de tres líneas puede acercarse a la fila superior. El artboard no lo acota. R21 lo mira con un nombre de 25 caracteres; si molesta, `numberOfLines={2}` es un cambio de una línea con su test. (Enmienda A4: con el degradado de 100 px un nombre de **dos** líneas ya deja su primera línea casi sin degradado, H4 hecho 1; `numberOfLines={2}` no lo arreglaría y `{1}` sí.)
- **Enmienda A4, paradas atadas a la altura (H4)**: las posiciones `24 %` y `44 %` solo valen con un degradado de 100 px. Cambiar `PET_HERO_FADE_HEIGHT` sin recalcularlas deja de cumplir R17; lo cubren el `it` de R3 (cadena exacta) y el `it` de R17 que enlaza el modelo con el texto de producción (la cadena y la altura se mueven juntas o alguno se pone rojo).
- **Enmienda A4, nombre a dos líneas y velo corto (H4)**: dos efectos que R17 no mide y que el humano mira en el smoke de R21; el primero es previo y A4 lo empeora, el segundo es nuevo (el velo de 90 px deja de cubrir la fila superior en cuanto `insets.top` ≥ 35).
- **Enmienda A4, degradado más denso que la vista previa**: a 56 px el alfa es .85 y no .50 (cobertura media 0,680 frente a 0,565). Es lo que hace falta para que el nombre cumpla; el humano lo ve al firmar.
- **Gris en el degradado**: lo evita escribir `${color}00` y no `transparent`; R3 y la guarda de R19 lo candan, y R21 lo confirma a ojo.
- **Dispositivo frente a Jest**: ninguna de las cifras de posición (punto en línea, punto de alerta, recorte del `ScrollView`) se puede comprobar en Jest; son R21.
- **Fundido de la foto frente a su decodificación**: supuesto 5.
- **Visibilidad por construcción, no por tiempo (A1, H1)**: que `pet-hero-media` siga `toBeVisible` en Inicio depende de que el primer montaje tenga `pet = null` (la capa queda en opacidad 1). Es una dependencia previa de R2, no nueva; si un test monta el hero ya con la mascota cargada, esa capa puede arrancar en 0 (el fundido de R2 corre con mascota) y la afirmación sobre sus descendientes debe pasar a `toBeOnTheScreen()` con la misma regla de R14.
- **Rebase con #196**: el rebase invalida los hashes de la trazabilidad; no rebasear tras escribirla o reapuntar.
- **Cola de merge**: `home/index.tsx` es un fichero caliente (otras features de Inicio). El reparto de ficheros que mantiene el leader protege el árbol, no la historia: tras mergear una dependencia se re-miden las cuentas de §Base medida.

## Texto de la Enmienda #195

Este es el texto canónico que R20 incorpora a `docs/ui-guidelines.md` tras la firma. El test lo lee de aquí por contenido; si se edita, se edita aquí primero. El primer bloque va al final del fichero; el segundo, justo después del párrafo `Enmendado por #67 (A8)` del punto 2.

```markdown
## Enmienda #195 — cabecera fotográfica de Inicio fiel al canvas

> Enmienda de `ui-guidelines` por `mobile-home-photo-hero-canvas` (#195, 2026-10-21).
> Directiva del humano: «el diseño final como el artifact» y «Píxel exacto».

**Qué cambia**: la cabecera de Inicio sigue la del artboard `Inicio.dc.html` del canvas aprobado (versión 85). El hero fotográfico de #67 se conserva y se ajusta: alto 430, foto alineada arriba, velo oscuro superior de 90 px (`scrim`) y degradado inferior de 100 px hacia el fondo, ambos sobre la foto y sin banda opaca. Estas tres medidas difieren a propósito de las del artboard: las decidió el humano el 2026-10-22 (Enmienda A4 de #195) tras ver su foto real de 3:4, porque la altura original recortaba demasiado y el degradado original tapaba demasiada foto; las paradas del degradado inferior son 24 % y 44 %, no las proporcionales del artboard, para que el texto del pie siga cumpliendo el contraste (`specs/mobile-home-photo-hero-canvas/design.md` §Hechos medidos, H4). La fila superior (avatares, «+» y campana) y el pie (píldora «En línea», nombre, raza y cifra de paseos) van **encima** de la foto, no en bandas aparte. Se añaden los tokens `scrim` y `photo-dim` (capa negra al 14 % en dark, equivalente al `brightness(.86)` del artboard).

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

## Texto de la Enmienda A4 de #195

Frases exactas que la Enmienda A4 (D6, 2026-10-22) cambia en la carta, para que quien implemente R20 no tenga que decidir nada. **Esta sección no es un bloque canónico**: no lleva ninguna valla de código marcada como Markdown (el guarda de R20 cuenta exactamente dos y lee todo lo que sigue a la cabecera de la Enmienda #195) y su casilla está en [[requirements]] §Aprobación, no aquí.

**Qué se edita, y dónde, en un solo commit de docs.** (1) El **primer** bloque Markdown de §Texto de la Enmienda #195 de este fichero, el que empieza por la cabecera `## Enmienda #195 — cabecera fotográfica de Inicio fiel al canvas`. (2) La sección de `docs/ui-guidelines.md` que es copia byte a byte de ese bloque (la última `## ` del fichero). Las dos ediciones son idénticas y van en el **mismo** commit, porque el guarda de R20 compara ambos textos y un commit intermedio lo pondría en rojo. El segundo bloque (la cita tras A8), la excepción de contraste (4,26:1 y 4,36:1, suelo 4,2:1), la línea `Detalle y tests…` y la casilla `- [ ] Enmienda #195 aprobada por humano` **no se tocan**.

**Frase 1 (la única que nombra medidas).** Dentro del párrafo `**Qué cambia**`, la subfrase que empieza por «El hero fotográfico de #67 se conserva y se ajusta:» queda así, sustituyendo la que decía las medidas del artboard:

> El hero fotográfico de #67 se conserva y se ajusta: alto 430, foto alineada arriba, velo oscuro superior de 90 px (`scrim`) y degradado inferior de 100 px hacia el fondo, ambos sobre la foto y sin banda opaca.

**Frase 2 (nueva, justo detrás de la anterior y dentro del mismo párrafo).**

> Estas tres medidas difieren a propósito de las del artboard: las decidió el humano el 2026-10-22 (Enmienda A4 de #195) tras ver su foto real de 3:4, porque la altura original recortaba demasiado y el degradado original tapaba demasiada foto; las paradas del degradado inferior son 24 % y 44 %, no las proporcionales del artboard, para que el texto del pie siga cumpliendo el contraste (`specs/mobile-home-photo-hero-canvas/design.md` §Hechos medidos, H4).

**Cadenas que la sección de la carta debe contener y no contener** (las vigila el `it` de ancla negativa de R20; cada una tiene su propia aserción):

| Debe contener | No debe contener |
|---|---|
| `alto 430` | `alto 330` |
| `velo oscuro superior de 90 px` | `130 px` |
| `degradado inferior de 100 px` | `160 px` |

Por eso la frase 2 y cualquier otra de la sección de la carta hablan de «la altura original» y «el degradado original» y **no repiten** las cifras antiguas. (Este fichero sí las conserva, como historia, en su tabla del artboard, en H4 y aquí.)
