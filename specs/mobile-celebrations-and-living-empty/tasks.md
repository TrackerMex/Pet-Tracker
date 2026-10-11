---
feature: "mobile-celebrations-and-living-empty"
status: draft        # draft | approved
tags: [harness, spec, mobile, ui, motion]
---

# Tareas — [[mobile-celebrations-and-living-empty]] (#171)

> Disciplina TDD. Cada bloque es (1) test rojo, (2) implementación mínima,
> (3) refactor, y cada (1) y (2) es un **commit propio**: test primero, en
> rojo y con el rojo esperado; luego el verde (C4 de `CHECKPOINTS.md`). Los
> bloques van en **orden de ejecución**, que no es el orden de los R-ids.
>
> Rutas relativas a `mobile-pet-tracker/`. Todos los comandos se lanzan con
> `cd mobile-pet-tracker` explícito y con **bun/bunx**, nunca npm/npx. Los
> paths con paréntesis van escapados en jest (`\(tabs\)`); esta feature no
> toca ninguno.

## Reglas comunes a todos los bloques

- **Skills (nombres de nuestro plugin):** `expo:expo-overview`,
  `expo:expo-animation` y `appllama-app-design-skill`. El leader traduce los
  nombres a los de Codex en el handoff (§Catálogo real de skills de Codex).
- **Antes de tocar código:** `test ! -e .expo/types/router.d.ts`. Si existe,
  **para** y pide al humano que lo borre.
- **Anclas:** al arrancar, re-ejecuta cada `grep -cF` de [[design]] §2, §3,
  §4 y §7. Si alguna no da lo declarado, **para** y anota en
  `progress/impl_mobile-celebrations-and-living-empty.md` cuál y qué dio.
- **Doble de Reanimated** (suites de `celebration` y `empty-state`): el
  patrón de la bienvenida, con `__esModule: true` conservado. Ancla:
  `grep -cF "return { ...actual, __esModule: true, useReducedMotion: () => mockUseReducedMotion(), withRepeat: jest.fn((animation: unknown) => animation) };" src/screens/welcome/index.test.tsx`
  → `1`. En `celebration.test.tsx` **no** se mockea `withRepeat`: R13.2
  asevera por fuente que no se usa.
- **Doble de expo-haptics** (suites de `celebration`, `pairing` y `add-pet`):
  el de comidas. Ancla:
  `grep -cF "jest.mock('expo-haptics', () => ({" src/app/\(tabs\)/__tests__/food.test.tsx`
  → `1`.
- **Doble de safe area** en `celebration.test.tsx`: el de Vincular, con
  `useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 })`.
- **Tests de animación:**
  - `jest.useFakeTimers()` en el `beforeEach` del `describe` y
    `jest.useRealTimers()` en su `afterEach`;
  - se lee con `getAnimatedStyle(node)` y se compara con `toEqual`
    (objeto entero, nunca `toHaveAnimatedStyle`);
  - se avanza con `act(() => { jest.advanceTimersByTime(ms); })`, con `ms`
    derivado de las duraciones de [[design]] §4 y nunca ampliando la
    aserción;
  - cada `it` de animación hace `await render(...)` o
    `await renderWithProviders(...)`;
  - todo `fireEvent` lleva `await`; `requestClose` se emite con
    `await fireEvent(screen.getByTestId('{id}-modal'), 'requestClose')`.
- **Rojo:** cada fila de las tablas dice si el rojo es **por aserción** (un
  `expect` falla) o **por consulta** (`getBy*`/`findBy*` lanza). Un rojo
  distinto del declarado es parada, no adaptación.
- **Suite entera antes de cada commit verde:**
  `cd mobile-pet-tracker && bunx jest`, más `bunx tsc --noEmit` y
  `bunx expo lint --no-cache`. Un rojo en un fichero fuera de [[design]] §5
  es **parada**.
- **Commits:** `test(mobile): <desc> (R<n>)` para el rojo y
  `feat(mobile): <desc> (R<n>)` para el verde. Tras cada verde se rellena la
  fila de [[traceability]].
- **No se corre `./init.sh`**: lo coordina el leader.

## T1 — R1: la pose `celebrate`

- [ ] (1) Test rojo
  - En `src/components/__tests__/celebration.test.tsx`, nuevo
    `describe('#171 R1: la pose celebrate')` con
    `it('pingo-celebrate.webp es WebP con alfa, sin animación, 1024 × 1024 y como mucho 100000 bytes')`.
    Copia la lectura de cabecera del candado de poses de `empty-state`
    (ancla: `grep -cF "expect(bytes.toString('ascii', 12, 16)).toBe('VP8X');" src/components/__tests__/empty-state.test.tsx`
    → `1`), más el ancho y el alto:
    `bytes.readUIntLE(24, 3) + 1` y `bytes.readUIntLE(27, 3) + 1` valen
    `1024`.
  - En `src/screens/welcome/index.test.tsx`,
    `it('no mete otras poses de Pingo'` pasa a esperar
    `['pingo-celebrate.webp', 'pingo-clipboard.webp', 'pingo-collar.webp', 'pingo-food.webp', 'pingo-health.webp', 'pingo-sleep.webp', 'pingo-talk.webp', 'pingo-wave-blink.webp', 'pingo-wave.webp']`.
    Esta lista se midió en 89fe2009. Antes del handoff, el leader la reescribe
    con lo que haya en `origin/main` ([[design]] §9.3 paso 5).

  | it | Rojo esperado |
  |---|---|
  | R1.1 cabecera WebP | excepción `ENOENT` de `readFileSync`; se declara como rojo **por consulta** del fichero |
  | R1.2 lista de poses | **por aserción** (`toEqual`: falta `pingo-celebrate.webp`) |

- [ ] (2) Verde
  ```bash
  mkdir -p ~/pet-tracker-mascot/webp
  uv run --with pillow python -I -c "from PIL import Image; Image.open('/home/claude/pet-tracker-mascot/mascot-03-celebrate-v2.png').save('/home/claude/pet-tracker-mascot/webp/pingo-celebrate.webp', 'WEBP', quality=80, method=6)"
  cp ~/pet-tracker-mascot/webp/pingo-celebrate.webp mobile-pet-tracker/assets/images/pingo-celebrate.webp
  ```
  Si el sandbox deniega leer `/home/claude/pet-tracker-mascot/`, **para** y
  pide al humano que corra esos tres comandos.
- [ ] (3) Refactor: nada.

## T2 — R2: el componente `Celebration`

- [ ] (1) Test rojo, en `src/components/__tests__/celebration.test.tsx`
  - `describe('#171 R2: Celebration')`. Renderiza con `testID="probe"`, dos
    `details` (`{ testID: 'probe-a', label: 'Modelo', value: 'TrailTag Pro' }`,
    `{ testID: 'probe-b', label: 'ESN', value: 'ESN-4242' }`), un primario
    `probe-primary` («Ver en el mapa») y un secundario `probe-secondary`
    («Listo»), con `jest.fn()` como `onPress`.
  - `mockUseReducedMotion` devuelve `false`.

  | it | Rojo esperado |
  |---|---|
  | R2.1 `Celebration` se exporta de `src/components/celebration.tsx` y su fuente no contiene `useTranslate` ni `t(` | excepción `Cannot find module` al importar; se declara rojo **por consulta** del módulo. Toda la suite cae por la misma causa |
  | R2.2 el host `probe-modal` tiene `visible: true`, `animationType: 'fade'`, `statusBarTranslucent: true` y `navigationBarTranslucent: true` | igual (módulo ausente) |
  | R2.3 hijos directos de `probe` en orden `['probe-confetti', 'probe-hero', 'probe-title', 'probe-body', 'probe-details', 'probe-actions']` | igual |
  | R2.3 sin `details` (array vacío y prop ausente, **un `it` por caso**), `probe-details` no existe y los hijos son los otros cinco | igual |
  | R2.4 `probe-pose` está dentro de `probe-pingo`, su `source` es igual a `require('../../../assets/images/pingo-celebrate.webp')` y `probe-badge` contiene el texto `✓` | igual |
  | R2.5 dentro de `probe-details` hay dos fichas en orden; `probe-a` tiene texto exacto `TrailTag Pro` y `probe-b`, `ESN-4242`; las etiquetas `Modelo` y `ESN` son hermanas del valor y no están dentro de él | igual |
  | R2.6 pulsar `probe-primary` llama a su `onPress` una vez y no al otro; ídem para `probe-secondary`; `requestClose` en `probe-modal` llama al secundario una vez y al primario cero. **Tres `it`** | igual |
  | R2.7 `probe-confetti` tiene `pointerEvents: 'none'`, `importantForAccessibility: 'no-hide-descendants'` y `accessibilityElementsHidden: true`; `probe-badge` tiene las dos de accesibilidad. **Un `it` por nodo** | igual |

  Los hijos directos se leen con
  `screen.getByTestId('probe').children.map((child) => typeof child === 'string' ? child : child.props.testID)`,
  el patrón de `#155 R3` en `empty-state.test.tsx`.
- [ ] (2) Verde: `src/components/celebration.tsx` con la composición y las
  clases de [[design]] §3. En este bloque:
  - `probe-confetti` es la capa vacía, que se pinta **siempre**; las piezas
    llegan en T3 y el condicional de reduce motion, en T5;
  - `probe-pingo` y `probe-badge` son `Animated.View` con el estilo
    estático de §3, sin `useAnimatedStyle`, que llega en T4;
  - los dos botones son
    `<Button testID={…} className="min-h-11 w-full rounded-xl">`, sin
    `bg-accent` y sin `variant`. Son **provisionales e inertes** hasta T14,
    que va justo después: un `rounded-xl bg-accent` aquí subiría a 20 los
    recuentos de [[design]] §9.2 mientras `ready-map` sigue en Vincular, y la
    suite entera se pondría roja. Si algún inventario se pone rojo con estas
    clases, **para** y repórtalo; no lo ajustes.
- [ ] (3) Refactor: extraer `DetailChip` como función local si el JSX pasa de
  ~120 líneas. Sin cambio de testIDs.

## T14 — R14: botones con labio (se re-mide tras el merge de #166)

Va **justo después de T2**, antes que cualquier otro bloque (ver
[[design]] §9.2). **No se empieza** hasta que [[design]] §9.3 tenga la tabla
de anclas re-medidas por el leader contra #166 mergeada. Si no la tiene,
**para**.

- [ ] (1) Test rojo.
  - En `celebration.test.tsx`: `describe('#171 R14: botones con labio')`.
  - En los ficheros de test donde #166 dejó sus inventarios (los fija
    [[design]] §9.3): los cambios de expectativa de la columna «Tras T14» de
    [[design]] §9.2, con comentario `// #171 R14`. Son seis:
    1. el mapa de primarios de #166 R2 gana la fila
       `components/celebration.tsx` = 1, y el total pasa de 19 a 20;
    2. `border-b-4` y `border-black/25` pasan de 19 a 20 (#166 R2);
    3. #62 R1 suma `+ 1 // #171 R14: celebration` (20);
    4. #98 R10 suma `+ 1 // #171 R14` (20);
    5. el inventario de secundarios neutros de #166 R3 cambia la extracción a
       `/testID=(?:"([^"]+)"|\{([^}]+)\})/` (grupo 1 o, si no existe, el 2),
       espera
       `['docs-upload-cancel', 'forgot-resend', 'reminders-delete-cancel', 'secondary.testID', 'welcome-have-account']`
       y su título pasa de «cuatro» a «cinco»;
    6. `border-lip-gray` y `border-b-6` pasan de 4 a 5 (#166 R3).
  - El `it.each` de #166 R3 que comprueba el tag de apertura por testID
    literal **no** gana fila: R14.2 lo cubre por render.

  | it | Rojo esperado |
  |---|---|
  | R14.1 `probe-primary` tiene `className` igual a `min-h-11 w-full rounded-xl bg-accent border-b-4 border-black/25`, y su `Button.Label`, `font-bold text-accent-foreground` | **por aserción** (clase inerte de T2) |
  | R14.2 `probe-secondary` tiene `className` igual a `min-h-11 w-full rounded-xl border-2 border-b-6 border-lip-gray bg-surface`, sin prop `variant`, y su `Button.Label`, `font-bold text-foreground` | **por aserción** |
  | cambios 1 a 6 | **por aserción**: el código aún cuenta 19, 19, 19, 19, 4 testIDs y 4 |

  Cómo se lee la clase del `Button` de heroui-native: con el mismo método que
  usen los candados de #166 que §9.3 cite.
- [ ] (2) Verde: las clases de R14.1 y R14.2 en `celebration.tsx`. Con ellas
  los seis cambios pasan a verde sin tocar más código.
- [ ] (3) Refactor: nada.

## T3 — R6: confeti

- [ ] (1) Test rojo: `describe('#171 R6: confeti')`, con
  `const H = Dimensions.get('window').height;` y las tablas de [[design]]
  §4.1 copiadas como literales en el test. No se importan fórmulas ni
  constantes de producción salvo las de `motion.ts`.

  | it | Rojo esperado |
  |---|---|
  | R6.1 `probe-confetti` tiene 24 hijos directos `probe-confetti-0` … `probe-confetti-23`, y el hijo único de cada uno tiene `className` igual a `SHAPES[Math.floor(i / 8)] + ' ' + COLORS[i % 6]`, con las tablas literales | **por aserción** (`toHaveLength(24)` sobre 0 hijos) |
  | R6.2 al montar, sin avanzar, cada pieza `i` tiene `getAnimatedStyle` igual a `{ position: 'absolute', top: 0, left: \`${LEFT[i]}%\`, opacity: 0, transform: [{ translateY: -40 }, { rotate: '0deg' }] }` | **por consulta** (`getByTestId('probe-confetti-0')`) |
  | R6.3 en vuelo: a los 1200 ms, la opacidad de la pieza 0 es `> 0` y `< 1` | **por consulta** |
  | R6.3 retardo: a los 1100 ms, la pieza 22 sigue en `opacity: 0` y `translateY: -40` | **por consulta** |
  | R6.4 a los 5000 ms, cada pieza está en `opacity: 0`, `transform: [{ translateY: H + 40 }, { rotate: '540deg' }]` y con su `left` | **por consulta** |
  | R6 `motion.test`: `MOTION_CONFETTI_FALL_TIMING` es igual a `{ easing: { bezier: [0.2, 0.6, 0.4, 1] }, reduceMotion: 'system' }`, `MOTION_CONFETTI_MIN_MS` es `2400` y `MOTION_CONFETTI_SPREAD_MS` es `1200`, en `src/theme/__tests__/motion.test.ts`. **Un `it` por constante** | **por aserción** (`undefined`) |
  | `it('no exporta nada más')` suma los tres nombres | **por aserción** |

- [ ] (2) Verde: `ConfettiPiece` y las constantes de [[design]] §4.1 y §4.4
  (solo las tres de confeti).
- [ ] (3) Refactor: nada.

## T4 — R7: pop

- [ ] (1) Test rojo: `describe('#171 R7: pop')`.

  | it | Rojo esperado |
  |---|---|
  | R7.1 al montar, `getAnimatedStyle(probe-pingo)` es igual a `{ width: 200, height: 200, opacity: 0, transform: [{ scale: 0.6 }] }` | **por aserción** (`toEqual` contra un estilo sin animar). Si `getAnimatedStyle` lanza sobre un `Animated.View` sin estilo animado, se anota en el impl y vale igual |
  | R7.2 al montar, `probe-badge` es igual a `{ position: 'absolute', right: 0, bottom: 0, opacity: 0, transform: [{ scale: 0.6 }] }` | igual |
  | R7.3 a los 2000 ms, `probe-pingo` es igual a `{ width: 200, height: 200, opacity: 1, transform: [{ scale: 1 }] }` | igual |
  | R7.3 a los 300 ms, `probe-badge` sigue en `opacity: 0` y `scale: 0.6` | igual |
  | R7.3 a los 2400 ms, `probe-badge` está en `opacity: 1` y `scale: 1` | igual |
  | `motion.test`: `MOTION_POP_SCALE` es `0.6` y `MOTION_POP_SPRING` es igual a `{ duration: 400, dampingRatio: 0.5, reduceMotion: 'system' }`. **Un `it` por constante**; `no exporta nada más` suma dos nombres | **por aserción** |

- [ ] (2) Verde: el efecto de pop de [[design]] §4.2, **sin** mirar reduce
  motion: la escala inicial es siempre `MOTION_POP_SCALE` y el muelle se
  lanza siempre. El condicional llega en T5.
- [ ] (3) Refactor: nada.

## T5 — R8: reduce motion en la celebración

- [ ] (1) Test rojo: `describe('#171 R8: reduce motion')`, con
  `mockUseReducedMotion.mockReturnValue(true)` en su `beforeEach`.

  | it | Rojo esperado |
  |---|---|
  | R8.1 `probe-confetti` no existe y `probe-confetti-0` tampoco (`queryByTestId` es `null`) | **por aserción** (T2 pinta la capa siempre) |
  | R8.1 los hijos directos de `probe` son `['probe-hero', 'probe-title', 'probe-body', 'probe-details', 'probe-actions']` | **por aserción** |
  | R8.2 al montar, `probe-pingo` es igual a `{ width: 200, height: 200, opacity: 0, transform: [{ scale: 1 }] }` | **por aserción** (escala 0.6) |
  | R8.2 a los 2000 ms, `probe-pingo` está en `opacity: 1` y `scale: 1` | nace **verde** por T4: la opacidad ya funde y la escala llega a 1. Se declara como fila que nace verde; su sonda es quitar el fundido de opacidad, y debe ponerse rojo |
  | R8.3 al montar, `probe-badge` está en `opacity: 0` y `scale: 1` | **por aserción** (escala 0.6) |
  | R8.3 a los 300 ms, `probe-badge` sigue en `opacity: 0`; a los 2400 ms, en `opacity: 1` y `scale: 1` | nace **verde** por T4; sonda: quitar el `withDelay` de la opacidad pone rojo el tramo de 300 ms |

- [ ] (2) Verde: `reduceMotion = useReducedMotion()`; la capa de confeti
  queda condicionada a `!reduceMotion`, y la escala inicial y el muelle
  siguen [[design]] §4.2.
- [ ] (3) Refactor: nada.

## T6 — R9: háptico

- [ ] (1) Test rojo: `describe('#171 R9: háptico')`, con
  `const mockNotificationAsync = jest.mocked(Haptics.notificationAsync)`.

  | it | Rojo esperado |
  |---|---|
  | R9.1 tras `await render`, sin avanzar temporizadores, `notificationAsync` se llamó 1 vez con `Haptics.NotificationFeedbackType.Success` | **por aserción** (0 llamadas) |
  | R9.2 tras `screen.rerender(...)` con otro `title`, sigue en 1 llamada | **por aserción** (0) |
  | R9.3 con reduce motion activo, 1 llamada | **por aserción** (0) |

- [ ] (2) Verde: el efecto de [[design]] §4.3, declarado antes del efecto
  del pop.
- [ ] (3) Refactor: nada.

## T7 — R13: sin drift

- [ ] (1) Test: en `src/__tests__/design-drift.test.ts`, nuevo
  `describe('#171 R13')`.
  - R13.1: `MEALS_BAR_STYLE_ESCAPES.test(source)` es `false` para
    `src/components/celebration.tsx`,
    `src/components/__tests__/celebration.test.tsx` y `src/theme/motion.ts`.
    **Un `it` por fichero.**
  - R13.2: la fuente de `celebration.tsx` no casa con
    `/LayoutAnimation|entering=|exiting=|withRepeat|withSequence/`.
  - R13.2: todo `useAnimatedStyle(() => ({ … }))` de `celebration.tsx`
    devuelve solo claves de `['opacity', 'transform', 'position', 'top', 'left', 'right', 'bottom']`.
    Se asevera leyendo los estilos con `getAnimatedStyle` de `probe-pingo`,
    `probe-badge` y `probe-confetti-0` a los 0 ms y a los 1200 ms. El
    conjunto de claves debe ser subconjunto de esa lista.

  Estos candados **nacen verdes**: son de regresión. Su sonda va en el impl:
  plantar `#ffffff` en un `className` de `celebration.tsx`, plantar
  `withRepeat(` y plantar `width: progress` en el estilo de una pieza. Cada
  una debe poner rojo su `it` (por aserción). Se revierte con
  `git checkout HEAD -- <fichero>` y se comprueba que
  `git diff --cached --quiet` sale con 0.
- [ ] (2) Verde: no aplica si nacen verdes; si alguno sale rojo, es un bug de
  T2–T6 y se corrige allí.
- [ ] (3) Refactor: nada.

## T8 — R3: disparador de Vincular

- [ ] (1) Test rojo, en `src/screens/pairing/index.test.tsx`
  - Se añade el doble de expo-haptics.
  - Se reutiliza el recorrido de claim `ok` que ya llega a
    `findByTestId('pairing-ready')` (ancla:
    `grep -cF "expect(screen.getByTestId('ready-model')).toHaveTextContent('TrailTag Pro');" src/screens/pairing/index.test.tsx`
    → `1`).
  - Nuevo `describe('#171 R3: celebración al vincular')`.

  | it | Rojo esperado |
  |---|---|
  | R3.1 `pairing-ready-modal` existe; `pairing-ready-title` tiene texto exacto `El collar está listo` y `pairing-ready-body`, `El collar de <nombre de la mascota del fixture> está vinculado. El rastreo GPS está activo.` | **por consulta** (`getByTestId('pairing-ready-modal')`) |
  | R3.1 dentro de `pairing-ready-details` (`within`), `ready-model` tiene texto exacto `TrailTag Pro` y `ready-esn`, `ESN-4242` | **por consulta** (`pairing-ready-details`) |
  | R3.1 dentro de `pairing-ready-actions`, `ready-map` tiene el texto `Ver en el mapa` y `ready-done`, `Listo` | **por consulta** |
  | R3.2 `requestClose` en `pairing-ready-modal` llama a `router.back()` una vez y no a `router.dismissTo`, y `pairing-ready` desaparece | **por consulta** |
  | R3.2 `ready-map` llama a `dismissTo('/map')` una vez; `ready-done` llama a `back()` una vez | ya existen y nacen **verdes**; no se duplican |
  | R3.3 la fuente de `src/screens/pairing/index.tsx` no contiene `<Pressable`, ni `size-16 items-center justify-center rounded-full bg-accent-soft`, ni `<Card className="w-full">`, y contiene `<Celebration` una vez | **por aserción** |
  | R3 al llegar a `pairing-ready`, `notificationAsync` se llamó 1 vez | **por aserción** (0) |
  | R3.4 con claim de error (el fixture de error que ya usa la suite), `pairing-ready-modal` no existe y `notificationAsync` no se llamó | nace **verde**: es candado de regresión. Sonda: cambiar la condición de render a `phase !== 'idle'` debe ponerlo rojo |

- [ ] (2) Verde: [[design]] §3.1. En el mismo commit se mueven, cada uno con
  su comentario `// #171 R3`:
  - los candados de `consistency-classnames` de [[design]] §7
    (CONTINUOUS_CORNER del repo y de Vincular, y los dos recuentos de
    `bg-accent-soft`);
  - los de la columna «Tras T8» de [[design]] §9.2, porque `ready-map` sale
    de Vincular: el mapa de #166 R2 deja `screens/pairing/index.tsx` en 1 y
    el total vuelve a 19 en 18 ficheros; `border-b-4` y `border-black/25`
    vuelven a 19; #62 R1 suma `- 1 // #171 R3: ready-map` y #98 R10,
    `- 1 // #171 R3` (19).
- [ ] (3) Refactor: nada.

## T9 — R12: copy

- [ ] (1) Test rojo, en `src/components/__tests__/celebration.test.tsx`,
  `describe('#171 R12: copy de la variante sin collar')`.

  | it | Rojo esperado |
  |---|---|
  | R12.1 las cuatro claves de [[design]] §6 tienen el literal exacto en `en` y en `es` | **por aserción** (`undefined`) |
  | R12.2 `addPet.celebrateTitle` casa con `/^¡.*!$/` en es y con `/!$/` en en (**un `it` por idioma**); las otras tres no contienen `!` ni `¡`; ninguna casa con `/\p{Extended_Pictographic}/u`; `addPet.celebrateBody` termina en `.` en los dos idiomas | **por aserción** |
  | R12.3 `specs/mobile-ui-language/design.md` tiene la sección `### §2.24 — Añadidos por #171 — Celebraciones` después de §2.23 y antes de `## 3. La infraestructura`, con las cuatro filas literales | **por aserción** (`indexOf` vale `-1`) |
  | longitud del catálogo (`language-provider.test.tsx`) | **por aserción** (se inserta `+ 4 // #171 R12` antes de `- 1, // #159 R2`) |
  | `R9_ADD_PET` y `checkUses(ALL_USES)` | **por aserción** (filas nuevas sin uso en el código) |

  `R9_ADD_PET` y `checkUses` solo se ponen verdes cuando el código use las
  claves (T10 y T11). Por eso el rojo de esas dos filas se **deja** hasta el
  verde de T10/T11 y el commit verde de T9 no las incluye. Así lo exige la
  lección «candados agregados de #65 R18».
- [ ] (2) Verde: las cuatro claves en `src/i18n/catalog.ts` (en y es), la
  sección §2.24 y el `+ 4`.
- [ ] (3) Refactor: nada.

## T10 + T11 — R4 y R5: primera mascota y variante sin collar

R4 y R5 comparten el verde: la celebración de R4 no existe sin la variante de
R5. Van en un commit rojo (los dos `describe`) y en un commit verde.

- [ ] (0) Refactor previo del arnés, en su propio commit y con la suite
  **verde**:
  - `renderAddPet` pasa de `render(` a `renderWithProviders(` (de
    `'../../../test/render-with-providers'`) con el mismo árbol, y devuelve
    su resultado, `queryClient` incluido;
  - el doble de pets pasa a
    `jest.mock('../../api/pets', () => ({ createPet: jest.fn(), listPets: jest.fn() }));`;
  - en el `beforeEach`, `mockListPets.mockResolvedValue({ kind: 'ok', pets: [<un pet del fixture existente>] })`;
  - se añade el doble de expo-haptics.

  Si un `it` existente cambia de color con esto, **para**.
- [ ] (1) Test rojo, en `src/screens/add-pet/index.test.tsx`.
  - El recorrido de rellenar y guardar es el de
    `it('posts selected fields, numeric months, and omits blank optionals'`
    (ancla `grep -cF` → `1`), con el nombre `Nala`.
  - El de foto es el de
    `it('uploads a chosen preview only after createPet succeeds'` (ancla →
    `1`).
  - En los casos «primera», antes de pulsar `add-pet-submit`:
    `await waitFor(() => expect(queryClient.getQueryData(petKeys.list())).toEqual({ kind: 'ok', pets: [] }))`.

  `describe('#171 R4: primera mascota')`:

  | it | Rojo esperado |
  |---|---|
  | R4.1 tras `await renderAddPet()`, `listPets` se llamó 1 vez con `('http://example.test/v1', 'jwt-token')` | **por aserción** (0 llamadas) |
  | R4.3 lista `ok` vacía, sin foto: tras guardar, `await screen.findByTestId('add-pet-celebration-modal')`; `router.back` no se llamó y `notificationAsync` se llamó 1 vez | **por consulta** (`findByTestId`) |
  | R4.3 lista `ok` vacía, con foto subida bien: igual | **por consulta** |
  | R4.4 lista con un pet: `back` 1 vez, sin `add-pet-celebration-modal`, `notificationAsync` 0 | nace **verde** (comportamiento actual). Sonda: `wasFirst = true` fijo debe ponerlo rojo |
  | R4.5 lista pendiente (`mockListPets.mockReturnValue(new Promise(() => {}))`): `back` 1, sin modal | nace **verde**. Sonda: `wasFirst = pets.data?.kind !== 'ok' \|\| pets.data.pets.length === 0` debe ponerlo rojo |
  | R4.5 lista `{ kind: 'error' }` | igual, **`it` propio** |
  | R4.5 lista `{ kind: 'unreachable' }` | igual, **`it` propio** |
  | R4.5 lista `{ kind: 'unauthorized' }` | igual, **`it` propio** |
  | R4.6 lista `ok` vacía y la subida de foto falla: se ve el texto de `addPet.errorPhotoAfterCreate`, sin modal y sin `back` | nace **verde**. Sonda: mover la celebración antes de la comprobación de subida debe ponerlo rojo |

  `describe('#171 R5: variante sin collar')`, con lista `ok` vacía, sin foto
  y con el nombre `Nala`:

  | it | Rojo esperado |
  |---|---|
  | R5.1 `add-pet-celebration-title` tiene texto exacto `¡Nala ya está en casa!` y `add-pet-celebration-body`, `Te ayudo a cuidar de Nala. Vincula un collar y estaré pendiente de dónde está.` | **por consulta** |
  | R5.1 `add-pet-celebration-details` no existe | **por consulta** (`getByTestId('add-pet-celebration')` previo) |
  | R5.2 `add-pet-celebration-pair` tiene el texto `Vincular un collar`; al pulsarlo, `router.replace` se llama 1 vez con `'/pairing'` y `router.back`, 0 | **por consulta** |
  | R5.3 `add-pet-celebration-later` tiene el texto `Ahora no`; al pulsarlo, `back` 1 y `replace` 0 | **por consulta** |
  | R5.3 `requestClose` en `add-pet-celebration-modal`: `back` 1 y `replace` 0 | **por consulta** |

- [ ] (2) Verde: [[design]] §2 y §3.2, más los cuatro usos en `R9_ADD_PET`.
  Las filas de `R9_ADD_PET` y `checkUses`, rojas desde T9, se ponen verdes
  aquí.
- [ ] (3) Refactor: nada.

## T12 — R10: Pingo flota en los vacíos

- [ ] (1) Test rojo, en `src/components/__tests__/empty-state.test.tsx`.
  - Se añade el doble de Reanimated de las reglas comunes, con
    `const mockWithRepeat = jest.mocked(withRepeat)` y temporizadores falsos
    en el `describe` nuevo.
  - Nuevo `describe('#171 R10: Pingo flota')`.

  | it | Rojo esperado |
  |---|---|
  | R10.1 la fuente contiene la línea `export type EmptyStatePose = 'talk' \| 'sleep' \| 'clipboard' \| 'health' \| 'collar' \| 'food';` una vez | nace **verde** (regresión). Sonda: añadir `\| 'celebrate'` |
  | R10.2 `probe-float` existe y contiene a `probe-pose`; al montar, `getAnimatedStyle(probe-float)` es igual a `{ width: 160, height: 160, transform: [{ translateY: 0 }] }` y el `style` de `probe-pose` es igual a `{ width: 160, height: 160 }` | **por consulta** (`probe-float`) |
  | R10.3 sin reduce motion, `mockWithRepeat` se llamó 1 vez con `(expect.anything(), -1, true)` | **por aserción** (0 llamadas) |
  | R10.3 sin reduce motion, a los 1200 ms (`MOTION_FLOAT_TIMING.duration`), `probe-float` está en `translateY: -4` (`-MOTION_FLOAT_OFFSET_Y`) | **por consulta** |

  Además se mueven, en este mismo commit rojo, los candados de [[design]] §7
  sobre `empty-state.tsx`:
  - los dos de hijos directos pasan a `probe-float`: rojo **por aserción**;
  - `EmptyState no anima` se elimina;
  - los tres de imports se reescriben a [[design]] §4.5: rojo **por
    aserción**.
- [ ] (2) Verde: [[design]] §4.5, arrancando el bucle **sin** mirar reduce
  motion. El condicional llega en T13.
- [ ] (3) Refactor: nada.

**Parada:** si tras el verde alguna suite consumidora de `EmptyState` (Inicio,
Mapa, Salud, Docs, Zonas, Recordatorios, Alertas, Comidas) se pone roja,
cuelga o avisa de handles abiertos, **para** y reporta. No se añaden mocks en
suites ajenas sin enmienda.

## T13 — R11: reduce motion en los vacíos

- [ ] (1) Test rojo: `describe('#171 R11: reduce motion en los vacíos')`, con
  `mockUseReducedMotion.mockReturnValue(true)`.

  | it | Rojo esperado |
  |---|---|
  | R11.1 `mockWithRepeat` no se llamó | **por aserción** (1 llamada desde T12) |
  | R11.1 a los 1200 ms y a los 10000 ms, `probe-float` sigue en `translateY: 0` (**dos aserciones** en el mismo `it`) | **por aserción** (-4 a los 1200) |

- [ ] (2) Verde: `if (!reduceMotion)` alrededor del arranque.
- [ ] (3) Refactor: nada.

## T15 — R15: enmienda a la carta

- [ ] (1) Test rojo, en `celebration.test.tsx`:
  `it('#171 R15: docs/ui-guidelines.md termina con la enmienda del confeti')`.
  Lee `../docs/ui-guidelines.md` desde `process.cwd()` y asevera que
  contiene el bloque literal de [[design]] §8 una vez y que no hay otro
  `## ` después de su encabezado. Rojo **por aserción**.
- [ ] (2) Verde: pegar el texto de §8. La casilla se pega **desmarcada**. La
  marca el humano, y solo si marcó la casilla de enmienda de §Aprobación.
- [ ] (3) Refactor: nada.

## T16 — R16: smoke humano en dev build de Android

Lo corre el **humano** en un **dev build de Android**, no en Expo Go. Con dos
transportes adb, usa `adb -s <ip:puerto>`.

1. Con una cuenta **sin mascotas**, en Añadir mascota guarda `Nala` sin foto:
   - sale la celebración a pantalla completa: confeti, Pingo con pop, la
     insignia ✓ un instante después y vibración de éxito;
   - el título es «¡Nala ya está en casa!» y no hay fichas de Modelo/ESN.
2. Pulsa «Vincular un collar»: abre Vincular con Nala seleccionada.
3. Vuelve, añade una segunda mascota: guarda y vuelve atrás **sin**
   celebración.
4. En Vincular, empareja un collar:
   - sale la celebración con las fichas Modelo y ESN;
   - «Ver en el mapa» lleva al mapa;
   - repite y «Listo» vuelve atrás;
   - repite y el botón atrás de Android equivale a «Listo».
5. Repite el paso 1 con otra cuenta vacía y pulsa el atrás de Android:
   equivale a «Ahora no».
6. Abre una pantalla con vacío de Pingo (por ejemplo, Recordatorios sin
   recordatorios): Pingo sube y baja suave, en bucle.
7. Activa Ajustes → Accesibilidad → Quitar animaciones:
   - repite 4: sin confeti ni rebote, la imagen solo aparece con un fundido
     y la vibración sigue;
   - en el paso 6, Pingo está quieto.
8. Repite 1 y 4 en modo oscuro: la celebración es legible y el confeti se
   ve sobre el fondo.

Firma: casilla «R16» de §Aprobación en [[requirements]], con fecha y nombre.
