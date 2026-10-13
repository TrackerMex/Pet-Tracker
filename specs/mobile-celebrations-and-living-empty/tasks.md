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
  → `1`. El código nuevo importa con nombre
  (`import { NotificationFeedbackType, notificationAsync } from 'expo-haptics';`
  y `jest.mocked(notificationAsync)`), no con `import * as Haptics`.
- **`#171` siempre seguido de ` R<n>`** en `celebration.tsx`,
  `celebration.test.tsx`, `motion.ts`, `catalog.ts` y los ficheros de
  Vincular y Añadir mascota: `HEX_LITERAL` de `design-drift`
  (`/#(?!\d{2,3} R\d)[\da-f]{3,8}\b/i`) toma `#171` suelto por un hex, y
  R13.1 lo veta en esos tres ficheros. Los literales de R12.3 y R15 llevan
  `#171` suelto (`Añadidos por #171`, `← añadida por #171 (R12)`,
  `## Enmienda #171`): en `celebration.test.tsx` ese `#` se escribe
  `\u0023` dentro del literal, y ningún comentario lleva `#NNN` sin ` R<n>`.
  Tampoco hay secuencias `-[`, `StyleSheet`, `shadow*` ni `elevation:` en
  esos ficheros.
- **Sin imports nuevos de producción en los rojos:** un rojo no importa un
  símbolo que aún no existe. Las constantes nuevas de `motion.ts` se leen en
  `motion.test.ts` con `require('../motion').MOTION_X` (el fichero ya declara
  `declare function require(moduleName: '../motion'): Record<string, unknown>;`),
  y `celebration.test.tsx` escribe los ms como literales numéricos.
- **Doble de safe area** en `celebration.test.tsx`: el de Vincular, con
  `useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 })`.
- **Tests de animación:**
  - `jest.useFakeTimers()` en el `beforeEach` del `describe` y
    `jest.useRealTimers()` en su `afterEach`;
  - se lee con `getAnimatedStyle(node)` y se compara con `toEqual`
    (objeto entero, nunca `toHaveAnimatedStyle`);
  - se avanza con `await act(async () => { jest.advanceTimersByTime(ms); })`,
    con `ms` derivado de las duraciones de [[design]] §4 y nunca ampliando
    la aserción. Nunca `act(() => …)` sin `await`: en RNTL 14 `act` es
    asíncrono, la forma síncrona deja el scope abierto y el `it` siguiente
    renderiza un árbol vacío (`screen.toJSON() === null`, «Unable to find an
    element»). Paró c8 (Reanudación 2 del handoff);
  - cada `it` de animación hace `await render(...)` o
    `await renderWithProviders(...)`;
  - todo `fireEvent` lleva `await`; `requestClose` se emite con
    `await fireEvent(screen.getByTestId('{id}-modal'), 'requestClose')`.
- **Nodos ocultos a la accesibilidad** (corrección del leader en el handoff):
  `{id}-confetti`, sus piezas `{id}-confetti-<i>` y `{id}-badge` llevan
  `importantForAccessibility="no-hide-descendants"` y
  `accessibilityElementsHidden` (R2.7). RNTL 14 los deja fuera de
  `getBy*`/`queryBy*`/`findBy*`, a ellos y a todo lo que contienen, salvo
  con `{ includeHiddenElements: true }`. Toda consulta a esos nodos o a sus
  hijos lleva la opción, también las negativas (`queryByTestId(..., { includeHiddenElements: true })`)
  y las de dentro de un `within(...)` (el `✓` de R2.4). Nunca
  `toBeVisible()` sobre ellos. Spike del leader sobre d2b8b0ae: sin la
  opción, `getByTestId` lanza `Unable to find` sobre los tres y
  `queryByTestId` da `null` aunque el nodo exista. Los hijos directos leídos
  con `.children` no se filtran.
- **Rojo:** cada fila de las tablas dice si el rojo es **por aserción** (un
  `expect` falla) o **por consulta** (`getBy*`/`findBy*` lanza). Un rojo
  distinto del declarado es parada, no adaptación.
- **Suite entera antes de cada commit verde:**
  `cd mobile-pet-tracker && bunx jest`, más `bun run typecheck` y
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
    Medida en 89fe2009 y re-medida en d2b8b0ae ([[design]] §9.3 paso 5):
    no cambia.

  | it | Rojo esperado |
  |---|---|
  | R1.1 cabecera WebP | excepción `ENOENT` de `readFileSync`; se declara como rojo **por consulta** del fichero |
  | R1.2 lista de poses | **por aserción** (`toEqual`: falta `pingo-celebrate.webp`) |

- [ ] (2) Verde. El leader dejó el WebP convertido antes del handoff
  (`uv run --with pillow`, `quality=80, method=6`, desde
  `mascot-03-celebrate-v2.png`; 55940 bytes, sha256
  `b8e9745f73dedc6d72f89a588046a7440f32df4b2e9685e70fa96a2b70e3a254`),
  como en #153 y #155. El verde solo lo copia:
  ```bash
  cd mobile-pet-tracker
  cp /home/claude/pet-tracker-mascot/webp/pingo-celebrate.webp assets/images/pingo-celebrate.webp
  cmp -s assets/images/pingo-celebrate.webp /home/claude/pet-tracker-mascot/webp/pingo-celebrate.webp; echo "cmp=$?"
  ```
  `cmp=0`. Si el sandbox deniega leer `/home/claude/pet-tracker-mascot/`,
  **para** y pide al humano que corra el `cp`.
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

  Son **12 `it`**. El rojo es el de módulo ausente de #155: el fichero
  entero no carga, R1.1 incluido.
  - jest sobre `celebration.test.tsx`: `Test Suites: 1 failed`,
    `Tests: 0 total` y
    `Cannot find module '../celebration' from 'src/components/__tests__/celebration.test.tsx'`;
  - `bun run typecheck` sale con error y su log tiene exactamente un
    `error TS2307`, en `celebration.test.tsx`;
  - `bunx expo lint --no-cache` sale con error: `✖ 1 problem (1 error, 0 warnings)`
    y un `Unable to resolve path to module '../celebration'`.

  Cualquier otro error de tipos o de lint en ese commit es parada.
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

## T14 — R14: botones con labio (re-medido tras el merge de #166)

Va **justo después de T2**, antes que cualquier otro bloque (ver
[[design]] §9.2). Las anclas re-medidas contra #166 mergeada (5fbe9eed)
están en [[design]] §9.2 y el resultado, en §9.3. Ejecútalas antes del rojo:
cualquier `grep -cF` que no dé `1` es **parada**.

- [ ] (1) Test rojo.
  - En `celebration.test.tsx`: `describe('#171 R14: botones con labio')`.
  - En `src/__tests__/consistency-classnames.test.ts`, donde #166 dejó sus
    inventarios ([[design]] §9.2, tabla «Anclas»): los cambios de expectativa de la columna «Tras T14» de
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

  Cómo se lee la clase del `Button` de heroui-native: como en los candados
  de render de #166, `screen.getByTestId(<testID>).props.className`, y la del
  texto, `screen.getByText(<label>).props.className` ([[design]] §9.3,
  paso 3).
- [ ] (2) Verde: las clases de R14.1 y R14.2 en `celebration.tsx`. Con ellas
  los seis cambios pasan a verde sin tocar más código.
- [ ] (3) Refactor: nada.

## T3 — R6: confeti

- [ ] (1) Test rojo: `describe('#171 R6: confeti')`, con
  `const H = Dimensions.get('window').height;` y las tablas de [[design]]
  §4.1 copiadas como literales en el test. No se importan fórmulas ni
  constantes de producción: los ms van como literales numéricos, y los
  colores, como la tabla desplegada de §4.1 (sin `CONFETTI_FILLS`).

  En `src/__tests__/consistency-classnames.test.ts`, el cambio de #64 R9 de
  [[design]] §7 (E1): tras `'text-category-rose-strong',` del `toEqual`, la
  línea `// #171 R6: el relleno del confeti` y las cinco clases de
  `CONFETTI_FILLS` en su orden; el título del `it` pasa a
  `'centraliza las quince clases completas y prohíbe interpolarlas'`.

  | it | Rojo esperado |
  |---|---|
  | R6.1 `probe-confetti` tiene 24 hijos directos `probe-confetti-0` … `probe-confetti-23`, y el hijo único de cada uno tiene `className` igual a `SHAPES[Math.floor(i / 8)] + ' ' + COLORS[i % 6]`, con las tablas literales | **por aserción** (`toHaveLength(24)` sobre 0 hijos) |
  | R6.2 al montar, sin avanzar, cada pieza `i` tiene `getAnimatedStyle` igual a `{ position: 'absolute', top: 0, left: \`${LEFT[i]}%\`, opacity: 0, transform: [{ translateY: -40 }, { rotate: '0deg' }] }` | **por consulta** (`getByTestId('probe-confetti-0')`) |
  | R6.3 en vuelo: a los 1200 ms, la opacidad de la pieza 0 es `> 0` y `< 1` | **por consulta** |
  | R6.3 retardo: a los 1100 ms, la pieza 22 sigue en `opacity: 0` y `translateY: -40` | **por consulta** |
  | R6.4 a los 5000 ms, cada pieza está en `opacity: 0`, `transform: [{ translateY: H + 40 }, { rotate: '540deg' }]` y con su `left` | **por consulta** |
  | R6 `motion.test`: `MOTION_CONFETTI_FALL_TIMING` es igual a `{ easing: { bezier: [0.2, 0.6, 0.4, 1] }, reduceMotion: 'system' }`, `MOTION_CONFETTI_MIN_MS` es `2400` y `MOTION_CONFETTI_SPREAD_MS` es `1200`, en `src/theme/__tests__/motion.test.ts`, leídas con `require('../motion').MOTION_X`. **Un `it` por constante**, con `// #171 R6` | **por aserción** (`undefined`) |
  | `it('no exporta nada más')` suma los tres nombres en su sitio alfabético | **por aserción** |
  | #64 R9 `it('centraliza las quince clases completas y prohíbe interpolarlas')` | **por aserción** (el módulo de paleta aún nombra diez) |

  Cuenta: +5 `it` en `celebration` (R6.1, R6.2, R6.3 ×2, R6.4) y +3 en
  `motion`; `consistency-classnames` no gana `it`. Rojos: 5 + 4 + 1.

- [ ] (2) Verde: `ConfettiPiece` y las constantes de [[design]] §4.1 y §4.4
  (solo las tres de confeti), y `CONFETTI_FILLS` al final de
  `src/utils/category-palette.ts` con el bloque literal de §4.1 (E1).
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
  | `motion.test`: `MOTION_POP_SCALE` es `0.6` y `MOTION_POP_SPRING` es igual a `{ duration: 400, dampingRatio: 0.5, reduceMotion: 'system' }`, con `require('../motion')`. **Un `it` por constante**, con `// #171 R7`; `no exporta nada más` suma dos nombres | **por aserción** |

  Cuenta: +5 en `celebration` y +2 en `motion`. Rojos: 5 + 3. La lista
  final de `no exporta nada más`, en orden:
  `MOTION_BLINK_INTERVAL_MS`, `MOTION_BLINK_TIMING`,
  `MOTION_CONFETTI_FALL_TIMING`, `MOTION_CONFETTI_MIN_MS`,
  `MOTION_CONFETTI_SPREAD_MS`, `MOTION_ENTRANCE_OFFSET_Y`,
  `MOTION_ENTRANCE_SCALE`, `MOTION_FADE_TIMING`, `MOTION_FEEDBACK_MS`,
  `MOTION_FILL_TIMING`, `MOTION_FLOAT_OFFSET_Y`, `MOTION_FLOAT_TIMING`,
  `MOTION_POP_SCALE`, `MOTION_POP_SPRING`, `MOTION_SETTLE_SPRING`,
  `MOTION_STAGGER_MS`, `MOTION_SURFACE_MS`, `MOTION_TRANSITION_MS`.

- [ ] (2) Verde: el efecto de pop de [[design]] §4.2, **sin** mirar reduce
  motion: la escala inicial es siempre `MOTION_POP_SCALE` y el muelle se
  lanza siempre. El condicional llega en T5.
- [ ] (3) Refactor: nada.

## T5 — R8: reduce motion en la celebración

- [ ] (1) Test rojo: `describe('#171 R8: reduce motion')`, con
  `mockUseReducedMotion.mockReturnValue(true)` en su `beforeEach`.

  | it | Rojo esperado |
  |---|---|
  | R8.1 `probe-confetti` no existe y `probe-confetti-0` tampoco (`queryByTestId(<id>, { includeHiddenElements: true })` es `null`; sin la opción daría `null` siempre) | **por aserción** (T2 pinta la capa siempre) |
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
  `const mockNotificationAsync = jest.mocked(notificationAsync)`.

  | it | Rojo esperado |
  |---|---|
  | R9.1 tras `await render`, sin avanzar temporizadores, `notificationAsync` se llamó 1 vez con `NotificationFeedbackType.Success` | **por aserción** (0 llamadas) |
  | R9.2 tras `screen.rerender(...)` con otro `title`, sigue en 1 llamada | **por aserción** (0) |
  | R9.3 con reduce motion activo, 1 llamada | **por aserción** (0) |

- [ ] (2) Verde: el efecto de [[design]] §4.3, declarado antes del efecto
  del pop.
- [ ] (3) Refactor: nada.

## T7 — R13: sin drift

- [ ] (1) Test: en `src/__tests__/design-drift.test.ts`, nuevo
  `describe('#171 R13: sin drift en la celebración')`, con 4 `it`. Lee cada
  fuente con `readFileSync(join(projectRoot, relativePath), 'utf8')`, el
  patrón de `#118 R11` en ese fichero.
  - R13.1: `expect(source).not.toMatch(MEALS_BAR_STYLE_ESCAPES)` para
    `src/components/celebration.tsx`,
    `src/components/__tests__/celebration.test.tsx` y `src/theme/motion.ts`.
    **Un `it` por fichero.**
  - R13.2 (fuente): la fuente de `celebration.tsx` no casa con
    `/LayoutAnimation|entering=|exiting=|withRepeat|withSequence/`.
  - R13.2 (claves animadas): **en `celebration.test.tsx`**, no en
    `design-drift` (que es un `.ts` sin render), en
    `describe('#171 R13: solo anima transform y opacity')` con 1 `it`:
    a los 0 ms y a los 1200 ms, `Object.keys(getAnimatedStyle(node)).sort()`
    es igual, nodo a nodo, a:
    - `probe-pingo`: `['height', 'opacity', 'transform', 'width']`;
    - `probe-badge`: `['bottom', 'opacity', 'position', 'right', 'transform']`;
    - `probe-confetti-0`: `['left', 'opacity', 'position', 'top', 'transform']`.

    `getAnimatedStyle` de Reanimated 4.5.1 funde el `style` estático del
    array con el animado, por eso salen `width`/`height` del héroe y las
    claves de posición: son de layout, fijas, y R6.2, R7.1 y R7.2 fijan sus
    valores. La sonda `width: progress` en el estilo de la pieza añade una
    clave a `probe-confetti-0` y debe ponerlo rojo.

  Cuenta: +4 en `design-drift` y +1 en `celebration`.

  Estos candados **nacen verdes**: son de regresión, y van en **un solo
  commit** `test(mobile): …` con la suite verde. Su sonda va en el impl:
  plantar `#ffffff` en un `className` de `celebration.tsx`, plantar
  `withRepeat(` y plantar `width: progress` en el estilo de una pieza. Cada
  una debe poner rojo su `it` (por aserción). Se revierte con
  `git checkout HEAD -- <fichero>` y se comprueba que
  `git diff --cached --quiet && git diff --quiet` sale con 0.
- [ ] (2) Verde: no aplica si nacen verdes; si alguno sale rojo, es un bug de
  T2–T6 y se corrige allí.
- [ ] (3) Refactor: nada.

## T8 — R3: disparador de Vincular

- [ ] (1) Test rojo, en `src/screens/pairing/index.test.tsx`
  - Se añade el doble de expo-haptics.
  - Se reutiliza el recorrido de claim `ok` que ya llega a
    `findByTestId('pairing-ready')` (ancla:
    `grep -cF "expect(screen.getByTestId('ready-model')).toHaveTextContent('TrailTag Pro');" src/screens/pairing/index.test.tsx`
    → `1`): la función `renderReady` del
    `describe('R7: tras el 201 muestra "El collar está listo" con el collar y sus CTAs'`
    (anclas `grep -cF "async function renderReady("` → `1`
    y `grep -cF "describe('R7: tras el 201 muestra"` → `1`).
  - Nuevo `describe('#171 R3: celebración al vincular')`, **anidado al final
    del `describe` de R7**, tras `describe('#95 R8: ver en el mapa desapila pairing'`
    (ancla `grep -cF "describe('#95 R8: ver en el mapa desapila pairing'"` →
    `1`), para heredar su `beforeEach` y `renderReady`. Es una excepción
    explícita a «código nuevo al final del fichero».
  - La fuente de R3.3 se lee con `jest.requireActual<typeof import('fs')>('fs')`,
    como en `empty-state.test.tsx`.

  | it | Rojo esperado |
  |---|---|
  | R3.1 `pairing-ready-modal` existe; `pairing-ready-title` tiene texto exacto `El collar está listo` y `pairing-ready-body`, `El collar de Luna está vinculado. El rastreo GPS está activo.` (Luna es el `makePet()` del `beforeEach` de R7) | **por consulta** (`getByTestId('pairing-ready-modal')`) |
  | R3.1 dentro de `pairing-ready-details` (`within`), `ready-model` tiene texto exacto `TrailTag Pro` y `ready-esn`, `ESN-4242` | **por consulta** (`pairing-ready-details`) |
  | R3.1 dentro de `pairing-ready-actions`, `ready-map` tiene el texto `Ver en el mapa` y `ready-done`, `Listo` | **por consulta** |
  | R3.2 `requestClose` en `pairing-ready-modal` llama a `router.back()` una vez y no a `router.dismissTo`, y `pairing-ready` desaparece | **por consulta** |
  | R3.2 `ready-map` llama a `dismissTo('/map')` una vez; `ready-done` llama a `back()` una vez | ya existen y nacen **verdes**; no se duplican |
  | R3.3 la fuente de `src/screens/pairing/index.tsx` no contiene `<Pressable`, ni `size-16 items-center justify-center rounded-full bg-accent-soft`, ni `<Card className="w-full">`, y contiene `<Celebration` una vez | **por aserción** |
  | R3 al llegar a `pairing-ready`, `notificationAsync` se llamó 1 vez | **por aserción** (0) |
  | R3.4 con `mockClaimDevice.mockResolvedValue({ kind: 'error' })`, `await renderPairing()`, `await fireEvent.changeText(await screen.findByTestId('activation-code-input'), 'ACT-READY')`, `await fireEvent.press(screen.getByTestId('pairing-submit'))` y `await screen.findByTestId('pairing-error')`; `pairing-ready-modal` no existe y `notificationAsync` no se llamó | nace **verde**: es candado de regresión. Sonda (corregida por el leader en el handoff: `phase` solo vale `'idle'` o `'ready'`, así que `phase !== 'idle'` no mutaba nada): en `case 'error':` / `case 'missing-config':`, tras `setActionError(t('common.somethingWentWrong'));`, añadir `setReadyDevice({} as never); setPhase('ready');`. Midiendo `pairing`: `Tests:       5 failed, 56 passed, 61 total`, con R3.4 y cuatro `it` existentes (dos de `R5: sin collar muestra el formulario` y dos filas de `R6: el claim mapea cada kind`), medidos por el leader con la misma mutación sobre la base |

  Cuenta: +7 `it`. Rojos: 6 (R3.1 ×3 y R3.2 por consulta, con
  `Unable to find`; R3.3 y el háptico por aserción). Nace verde 1 (R3.4).

  **Parada:** si tras el verde algún `it` existente de Vincular cuelga,
  excede su timeout o avisa de handles abiertos al montar `Celebration`
  (Reanimated con temporizadores reales), **para** y reporta; no añadas
  temporizadores falsos ni mocks a los `it` existentes.

- [ ] (2) Verde: [[design]] §3.1. En el mismo commit se mueven, cada uno con
  su comentario `// #171 R3`:
  - los candados de `consistency-classnames` de [[design]] §7
    (CONTINUOUS_CORNER del repo, de Vincular y la suma del mapa de #62 R14,
    y los dos recuentos de `bg-accent-soft`);
  - los de la columna «Tras T8» de [[design]] §9.2, porque `ready-map` sale
    de Vincular: el mapa de #166 R2 deja `screens/pairing/index.tsx` en 1 y
    el total vuelve a 19 en 18 ficheros; `border-b-4` y `border-black/25`
    vuelven a 19; #62 R1 suma `- 1 // #171 R3: ready-map` y #98 R10,
    `- 1 // #171 R3` (19).
- [ ] (3) Refactor: nada.

## T9 — R12: copy

Las filas de `R9_ADD_PET` **no** van aquí. Entran en el rojo de T10 + T11,
cuando el código ya puede usarlas (lección «candados agregados de #65 R18»).

- [ ] (1) Test rojo: 11 `it` rojos en dos ficheros.
  - En `src/components/__tests__/celebration.test.tsx`, el catálogo se lee
    como en `empty-state.test.tsx`: `import { en, es } from '../../i18n/catalog';`
    y `const enCatalog: Record<string, string> = en;` (igual `esCatalog`). Así
    las claves que aún no existen no rompen el typecheck. Se asevera sobre el
    valor tal cual, por ejemplo `expect(esCatalog['addPet.celebrateTitle'])`,
    sin `?? ''` ni `String(…)`: el rojo es el matcher sobre `undefined`.
  - `describe('#171 R12: copy de la variante sin collar')`, 10 `it`:

  | it | Rojo esperado |
  |---|---|
  | R12.1 `it.each` sobre las cuatro filas de [[design]] §6 en ese orden, como `[clave, en, es]`, con nombre `'%s tiene su literal en los dos idiomas'`: `expect(enCatalog[clave]).toBe(en)` y `expect(esCatalog[clave]).toBe(es)`. Son **4 `it`** | **por aserción** |
  | R12.2 `it('addPet.celebrateTitle exclama con ¡…! en español')`: casa con `/^¡.*!$/` | **por aserción** |
  | R12.2 `it('addPet.celebrateTitle exclama con …! en inglés')`: casa con `/!$/` | **por aserción** |
  | R12.2 `it('body, pair y later no exclaman en ningún idioma')`: ninguno de los seis valores casa con `/[!¡]/` | **por aserción** |
  | R12.2 `it('ninguna de las cuatro lleva emoji')`: ninguno de los ocho valores casa con `/\p{Extended_Pictographic}/u` | **por aserción** |
  | R12.2 `it('addPet.celebrateBody termina en punto en los dos idiomas')`: los dos casan con `/\.$/` | **por aserción** |
  | R12.3 `it('registra las cuatro claves en §2.24 de mobile-ui-language')`: ver abajo | **por aserción** |

  R12.3 lee `join(process.cwd(), '..', 'specs', 'mobile-ui-language', 'design.md')`
  con el `readFileSync` de `jest.requireActual<typeof import('fs')>('fs')`.
  El `#` de `#171` se escribe `\u0023` (reglas comunes):

  ```ts
  const SECTION = [
    '### §2.24 — Añadidos por \u0023171 — Celebraciones',
    '',
    '| # | Clave | `en` | `es` | Origen |',
    '|---|---|---|---|---|',
    '| — | `addPet.celebrateTitle` | `{{petName}} is home!` | `¡{{petName}} ya está en casa!` | ← añadida por \u0023171 (R12) |',
    "| — | `addPet.celebrateBody` | `I'll help you look after {{petName}}. Pair a collar and I'll keep track of where they are.` | `Te ayudo a cuidar de {{petName}}. Vincula un collar y estaré pendiente de dónde está.` | ← añadida por \u0023171 (R12) |",
    '| — | `addPet.celebratePair` | `Pair a collar` | `Vincular un collar` | ← añadida por \u0023171 (R12) |',
    '| — | `addPet.celebrateLater` | `Not now` | `Ahora no` | ← añadida por \u0023171 (R12) |',
  ].join('\n');
  expect(doc.split(SECTION)).toHaveLength(2);
  expect(doc.indexOf(SECTION)).toBeGreaterThan(doc.indexOf('### §2.23 '));
  expect(doc.indexOf('## 3. La infraestructura')).toBeGreaterThan(doc.indexOf(SECTION));
  ```

  - En `src/providers/__tests__/language-provider.test.tsx`, dentro de
    `it('mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas'`,
    se inserta la línea `        + 4 // #171 R12` justo antes de
    `        - 1, // #159 R2` (ancla `grep -cF -- "- 1, // #159 R2"` → `1`).
    Es el `it` rojo número 11, **por aserción**.

  Cuenta: +10 `it` en `celebration.test.tsx` y +0 en `language-provider`.
- [ ] (2) Verde:
  - En `src/i18n/catalog.ts`, las cuatro claves de [[design]] §6 en ese orden,
    justo después de `'addPet.savePet': 'Save pet',` en `en` y de
    `'addPet.savePet': 'Guardar mascota',` en `es` (cada ancla `grep -cF` →
    `1`). Los valores con apóstrofo van entre comillas dobles, como
    `'reminders.emptyBody'`.
  - En `specs/mobile-ui-language/design.md`, tras la última fila de §2.23 (la
    de `home.activityNeedsCollar`) van una línea en blanco y las ocho líneas
    de `SECTION`. La línea en blanco que ya precede a
    `## 3. La infraestructura` se conserva.
- [ ] (3) Refactor: nada.

## T10 + T11 — R4 y R5: primera mascota y variante sin collar

R4 y R5 comparten el verde: la celebración de R4 no existe sin la variante de
R5. Van en un commit rojo (los dos `describe` y los candados de copy) y en un
commit verde, precedidos por un refactor del arnés.

- [ ] (0) Refactor previo del arnés de `src/screens/add-pet/index.test.tsx`.
  Va en su propio commit, `test(mobile): add-pet renderiza con QueryClient (R4)`,
  con la suite **verde** y los mismos 26 `it`.
  - `renderAddPet` pasa de `render(` a `renderWithProviders(`, importado de
    `'../../../test/render-with-providers'`. El árbol no cambia
    (`HeroUINativeProvider` > `LanguageProvider initial="es"` >
    `HeaderHeightContext.Provider value={91}` > `AddPetScreen`) y la función
    devuelve su resultado, `queryClient` incluido. `render` sale del import de
    RNTL, porque no queda otro uso (lint).
  - El doble de pets pasa a
    `jest.mock('../../api/pets', () => ({ createPet: jest.fn(), listPets: jest.fn() }));`.
    `listPets` se suma al import existente de `'../../api/pets'` y se declara
    `const mockListPets = jest.mocked(listPets);` junto a `mockCreatePet`.
  - Al final del `beforeEach` raíz, el que rearma el picker, van
    `mockListPets.mockReset();` y
    `mockListPets.mockResolvedValue({ kind: 'ok', pets: [{ id: 'pet-1', name: 'Milo' } as never] });`.
  - Se añade el `jest.mock('expo-haptics', …)` de las reglas comunes, y nada
    más. El import con nombre de `notificationAsync` y el de `petKeys` llegan
    en el rojo, cuando se usan: un import sin uso rompe el lint.

  Hoy la pantalla no llama a `listPets`, así que el doble solo queda armado.
  Si un `it` existente cambia de color, **para**.
- [ ] (1) Test rojo: 15 `it` rojos.
  - En `src/screens/add-pet/index.test.tsx` entran
    `import { petKeys } from '../../api/query-keys';`,
    `import { notificationAsync } from 'expo-haptics';` y
    `const mockNotificationAsync = jest.mocked(notificationAsync);`.
  - Los dos `describe` nuevos copian el `beforeEach` de
    `describe('R7: foto opcional tras alta'` (ancla `grep -cF` → `1`):
    `jest.clearAllMocks()`, `EXPO_PUBLIC_API_URL`, `mockUseAuth` con
    `token: 'jwt-token'` y `mockUseSelectedPet` con `selectedPetId: null`.
    `jest.clearAllMocks()` no borra la implementación que el `beforeEach`
    raíz da a `mockListPets`. Cada `it` la sobrescribe con la suya.
  - El recorrido de guardar sin foto es el de
    `it('posts selected fields, numeric months, and omits blank optionals'`
    (ancla → `1`), con el nombre `Nala` y
    `mockCreatePet.mockResolvedValue({ kind: 'ok', pet: { id: 'pet-new', name: 'Nala' } as never })`.
    El de foto es el de
    `it('uploads a chosen preview only after createPet succeeds'` (ancla →
    `1`).
  - **Compuerta de la lista.** Todos los `it` salvo R4.1 y R4.5 pendiente
    toman `queryClient` de `renderAddPet()`. Antes de pulsar `add-pet-submit`,
    esperan a que la caché tenga la lista que el propio `it` arma:
    `await waitFor(() => expect(queryClient.getQueryData(petKeys.list())).toEqual(<el valor que resuelve mockListPets>));`.
    Sin la compuerta, R4.4–R4.6 pasarían en verde aunque la pantalla no
    consultara la lista. En el rojo la pantalla no consulta nada, así que la
    compuerta falla **por aserción**: ese es el rojo esperado de esos `it`.

  `describe('#171 R4: primera mascota')`:

  | it | Rojo esperado |
  |---|---|
  | R4.1 tras `await renderAddPet()`: `await waitFor(() => expect(mockListPets).toHaveBeenCalledTimes(1))` y `toHaveBeenCalledWith('http://example.test/v1', 'jwt-token')` | **por aserción** (0 llamadas) |
  | R4.3 lista `{ kind: 'ok', pets: [] }`, sin foto: tras guardar, `await screen.findByTestId('add-pet-celebration-modal')`; `mockRouter.back` 0 y `mockNotificationAsync` 1 | **por aserción** (compuerta) |
  | R4.3 igual, con la foto subida bien | **por aserción** (compuerta) |
  | R4.4 lista con un pet, `{ kind: 'ok', pets: [{ id: 'pet-1', name: 'Milo' } as never] }`: `await waitFor(() => expect(mockRouter.back).toHaveBeenCalledTimes(1))`, sin `add-pet-celebration-modal` y `mockNotificationAsync` 0 | **por aserción** (compuerta). Sonda tras el verde: `wasFirst = true` fijo lo pone rojo, junto con las cuatro R4.5 y los dos `it` existentes que esperan `back` una vez; la línea `Tests:` se anota, no se fija |
  | R4.5 lista pendiente (`mockListPets.mockReturnValue(new Promise(() => {}))`), **sin** compuerta: `back` 1 y sin modal | nace **verde**. Sonda: `wasFirst = pets.data?.kind !== 'ok' \|\| pets.data.pets.length === 0` lo pone rojo, junto con las otras tres R4.5; la línea `Tests:` se anota, no se fija |
  | R4.5 lista `{ kind: 'error' }`, en un **`it` propio**: igual | **por aserción** (compuerta). Misma sonda |
  | R4.5 lista `{ kind: 'unreachable', message: 'offline' }`, en un **`it` propio** | igual |
  | R4.5 lista `{ kind: 'unauthorized' }`, en un **`it` propio** | igual |
  | R4.6 lista vacía, foto elegida y `mockUploadPhotoToUrl.mockResolvedValue({ kind: 'error' })`: `await screen.findByText('Se creó la mascota, pero no se pudo subir la foto')`, sin modal y `back` 0 | **por aserción** (compuerta). Sonda: celebrar antes de comprobar la subida lo pone rojo |

  `describe('#171 R5: variante sin collar')`, con lista `{ kind: 'ok', pets: [] }`,
  compuerta, sin foto y con el nombre `Nala`:

  | it | Rojo esperado |
  |---|---|
  | R5.1 `add-pet-celebration-title` tiene el texto exacto `¡Nala ya está en casa!` y `add-pet-celebration-body`, `Te ayudo a cuidar de Nala. Vincula un collar y estaré pendiente de dónde está.` | **por aserción** (compuerta) |
  | R5.1 `add-pet-celebration` existe (`getByTestId`) y `queryByTestId('add-pet-celebration-details')` es `null` | **por aserción** (compuerta) |
  | R5.2 `add-pet-celebration-pair` tiene el texto `Vincular un collar`; al pulsarlo, `mockRouter.replace` se llama 1 vez con `'/pairing'` y `back`, 0 | **por aserción** (compuerta) |
  | R5.3 `add-pet-celebration-later` tiene el texto `Ahora no`; al pulsarlo, `back` 1 y `replace` 0 | **por aserción** (compuerta) |
  | R5.3 `await fireEvent(screen.getByTestId('add-pet-celebration-modal'), 'requestClose')`: `back` 1 y `replace` 0 | **por aserción** (compuerta) |

  En el mismo commit rojo se mueven los candados de copy:
  - en `src/__tests__/ui-copy-table.ts`, al final de `R9_ADD_PET` (ancla
    `grep -cF "export const R9_ADD_PET: UseRow[] = ["` → `1`), cuatro filas
    `{ file: 'src/screens/add-pet/index.tsx', key: 'addPet.celebrateTitle' },`,
    una por clave y en el orden de [[design]] §6;
  - en `src/__tests__/ui-language.test.ts`,
    `it('resuelve las 41 ocurrencias normativas'` (ancla → `1`) pasa a
    `it('resuelve las 45 ocurrencias normativas'`, y su longitud, a
    `expect(R9_ADD_PET).toHaveLength(42 + 1 - 2 + 4); // +1 #95 R4, -2 #95 R5, +4 #171 R12`.

  Rojos: 13 en `add-pet` (R4.5 pendiente nace verde) y 2 en `ui-language`:
  `resuelve las 45 ocurrencias normativas` y
  `resuelve cada ocurrencia de la tabla contra la clave exacta`, los dos en
  `checkUses` y **por aserción**. Cuenta: +14 `it` en `add-pet` y +0 en
  `ui-language`.
- [ ] (2) Verde: [[design]] §2 y §3.2. El código usa cada clave una vez con
  `t('addPet.celebrate…'`, que es lo que cuenta `checkUses`.
- [ ] (3) Refactor: nada.

## T12 — R10: Pingo flota en los vacíos

- [ ] (1) Test rojo: 9 `it` rojos en dos ficheros.
  - En `src/components/__tests__/empty-state.test.tsx` entran:
    - el doble de Reanimated de las reglas comunes, con
      `const mockUseReducedMotion = jest.fn<boolean, []>(() => false);`
      declarado antes del `jest.mock`, como en la bienvenida;
    - `import { getAnimatedStyle, withRepeat } from 'react-native-reanimated';`
      y `const mockWithRepeat = jest.mocked(withRepeat);`;
    - `act` en el import existente de `@testing-library/react-native`.
  - Nuevo `describe('#171 R10: Pingo flota')`. Su `beforeEach` hace
    `mockWithRepeat.mockClear()`, `mockUseReducedMotion.mockReturnValue(false)`
    y `jest.useFakeTimers()`, y su `afterEach`, `jest.useRealTimers()`. Monta
    con `renderProbe()`, que ya hace `await render(...)`. +4 `it`:

  | it | Rojo esperado |
  |---|---|
  | R10.1 la fuente de `empty-state.tsx` contiene la línea `export type EmptyStatePose = 'talk' \| 'sleep' \| 'clipboard' \| 'health' \| 'collar' \| 'food';` exactamente una vez | nace **verde** (regresión). Sonda tras el verde: añadir `\| 'celebrate'` lo pone rojo |
  | R10.2 `probe-float` existe y contiene a `probe-pose` (`within(float).getByTestId('probe-pose')`); al montar, `getAnimatedStyle(float)` es igual a `{ width: 160, height: 160, transform: [{ translateY: 0 }] }` y `probe-pose` tiene `props.style` igual a `{ width: 160, height: 160 }` | **por consulta** (`probe-float`) |
  | R10.3 `mockWithRepeat` se llamó 1 vez y con `(expect.anything(), -1, true)` | **por aserción** (0 llamadas) |
  | R10.3 tras `await act(async () => { jest.advanceTimersByTime(1200); })` (`MOTION_FLOAT_TIMING.duration`), `getAnimatedStyle(probe-float)` es igual a `{ width: 160, height: 160, transform: [{ translateY: -4 }] }` (`-MOTION_FLOAT_OFFSET_Y`) | **por consulta** (`probe-float`) |

  El doble deja `withRepeat` como identidad: el bucle corre una sola vez y
  los temporizadores falsos no giran sin fin.

  En el mismo commit rojo se mueven los candados de [[design]] §7:

  | Candado | Cambio | Rojo esperado |
  |---|---|---|
  | `it('con acción pinta pose, título, cuerpo y botón como hijos directos, en ese orden'` | `'probe-pose'` → `'probe-float'` en el array, con `// #171 R10` al final de la línea | **por aserción** |
  | `it('sin acción pinta pose, título y cuerpo como hijos directos, en ese orden'` | igual | **por aserción** |
  | `it('EmptyState no anima', ()` | se **elimina** | — |
  | `it('EmptyState solo importa de react, react-native, expo-image y heroui-native'` | pasa a `it('EmptyState solo importa de react, react-native, expo-image, heroui-native, Reanimated y el tema de movimiento'`, y la lista admitida suma `'react-native-reanimated'` y `'../theme/motion'` | nace **verde** (la fuente vieja cumple la lista ampliada) |
  | `it('EmptyState importa exactamente Image, Button, Text y View'` | pasa a `it('EmptyState importa exactamente lo de la flotación'`; el array es el de las seis líneas de [[design]] §4.5, en ese orden, y `require(` sigue en `6` | **por aserción** |
  | `it('EmptyState no anima con Animated, LayoutAnimation ni transiciones'` | pasa a `it('EmptyState no anima con LayoutAnimation, transiciones ni entering/exiting'`, con `not.toMatch(/LayoutAnimation\|transition\|animate-\|entering=\|exiting=/)` | nace **verde** |

  - En `src/screens/docs/index.test.tsx`, dentro de
    `describe('en el vacío'`, la línea
    `'docs-empty-pose', 'docs-empty-title', 'docs-empty-body',` (ancla
    `grep -cF` → `1`) pasa a
    `'docs-empty-float', 'docs-empty-title', 'docs-empty-body', // #171 R10`.
    Es un `it.each` de tres roles (#158 R4): **3 `it` rojos por aserción**.
    Este cambio es esperado y no es parada; sí lo es cualquier otro rojo en
    Docs.

  Rojos: 6 en `empty-state` (R10.2, R10.3 ×2 y los tres de la tabla de
  candados marcados por aserción) y 3 en `docs`. Cuenta: +4 −1 = +3 `it` en
  `empty-state` (95 → 98) y +0 en `docs`.
- [ ] (2) Verde: [[design]] §4.5, arrancando el bucle **sin** mirar reduce
  motion. El condicional llega en T13.
- [ ] (3) Refactor: nada.

**Parada:** si tras el verde alguna suite consumidora de `EmptyState` (Inicio,
Mapa, Salud, Docs, Zonas, Recordatorios, Alertas, Comidas) se pone roja fuera
de los 3 `it` de Docs de arriba, o excede su timeout, **para** y reporta.
También para si «A worker process has failed to exit gracefully» sale en
la medida o en las guardas. Ese aviso no cuenta cuando sale una sola vez al
final del ALL completo: sale así en todos los ALL desde la base, antes de
#171 (Reanudación 4 del handoff). No se añaden mocks en suites ajenas sin
enmienda. Medido por el leader en un spike fuera del árbol: las 22 suites
consumidoras corren en el mismo tiempo que la base y sin avisos de worker.

## T13 — R11: reduce motion en los vacíos

- [ ] (1) Test rojo: `describe('#171 R11: reduce motion en los vacíos')`. Su
  `beforeEach` hace `mockWithRepeat.mockClear()`,
  `mockUseReducedMotion.mockReturnValue(true)` y `jest.useFakeTimers()`; su
  `afterEach`, `mockUseReducedMotion.mockReturnValue(false)` y
  `jest.useRealTimers()`. +2 `it`:

  | it | Rojo esperado |
  |---|---|
  | R11.1 `mockWithRepeat` no se llamó | **por aserción** (1 llamada desde T12) |
  | R11.1 a los 1200 ms y a los 10000 ms, `probe-float` sigue en `translateY: 0` (**dos aserciones** en el mismo `it`) | **por aserción** (-4 a los 1200) |

- [ ] (2) Verde: `if (!reduceMotion)` alrededor del arranque.
- [ ] (3) Refactor: nada.

## T15 — R15: enmienda a la carta

- [ ] (1) Test rojo, en `celebration.test.tsx`:
  `it('#171 R15: docs/ui-guidelines.md declara la enmienda del confeti')`.
  Lee `../docs/ui-guidelines.md` desde `process.cwd()` y asevera que
  contiene el bloque literal de [[design]] §8 **sin su última línea** (la
  casilla) exactamente una vez y que su encabezado va después de
  `## Checklist de autocrítica`. La casilla se comprueba aparte: lo que
  sigue al bloque casa con
  `/^\n\n- \[[ xX]\] Aprobada por humano \(fecha: [^)\n]*\)(?:\n|$)/`, para
  que el candado siga verde cuando el humano la marque (corrección del
  leader en el handoff; #65 R19 y #167 cometieron el mismo error). En el literal, el
  `#` de `#171` se escribe `\u0023` (`'## Enmienda \u0023171 — confeti de celebración'`),
  como en R12.3. **No** asevera que
  sea la última sección: #167 añade otra enmienda al final y, si mergea
  después, lo pondría rojo. Rojo **por aserción**.
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

## E2 — Ronda 2: candados que muestrean la curva (Enmienda E2)

Tras el rechazo de la ronda 1 ([[requirements]] §Enmienda E2). Solo toca
tres ficheros de test; **producción no cambia**. Los cinco `it` nacen
**verdes**: son candados de una implementación que ya cumple, como los de
R13. El rojo de cada uno ante su mutación lo midió la spike del leader
(tabla de la Enmienda E2) y lo repite el reviewer. Cada bloque es un commit
`test(mobile): …` propio, con el fichero de test entero en verde antes de
commitear.

Los valores son literales medidos: el test no los calcula con las fórmulas
ni con constantes de producción (sería un candado tautológico).

### E2.1 — R6.5: el confeti a los 1200 ms

En `src/components/__tests__/celebration.test.tsx`, justo después de la línea
`const COLORS = [...]` (la de `'bg-accent', 'bg-category-amber-strong'`), el
bloque siguiente, literal:

```ts
// #171 R6 (E2): [opacidad, translateY, grados] de cada pieza a los 1200 ms, medidos en la spike de la enmienda.
const CONFETTI_AT_1200 = [
  [0.154, 1178.4, 465.3],
  [0.194, 1127.3, 445.8],
  [0.236, 1073.5, 425.2],
  [0.28, 1017.6, 403.9],
  [0.325, 960, 381.9],
  [0.371, 901.3, 359.5],
  [0.418, 841.8, 336.8],
  [0.465, 781.9, 313.9],
  [0.512, 721.8, 290.9],
  [0.381, 889.8, 355.1],
  [0.44, 813.4, 325.9],
  [0.501, 736.7, 296.6],
  [0.561, 660.1, 267.4],
  [0.621, 584.3, 238.4],
  [0.679, 509.8, 210],
  [0.736, 436.9, 182.1],
  [0.792, 366.1, 155.1],
  [0.846, 297.6, 128.9],
  [0.803, 351.9, 149.7],
  [0.877, 258.2, 113.9],
  [0.947, 169.4, 80],
  [0.89, 85.9, 48.1],
  [0.336, 7.5, 18.2],
  [0.275, 1024.4, 406.5],
];

function sampleConfetti(testID: string) {
  const style = getAnimatedStyle(screen.getByTestId(testID, { includeHiddenElements: true })) as unknown as {
    opacity: number;
    transform: [{ translateY: number }, { rotate: string }];
  };
  return [style.opacity, style.transform[0].translateY, Number.parseFloat(style.transform[1].rotate)];
}

function expectSamples(actual: number[][], expected: number[][], digits: number[]) {
  expect(actual).toHaveLength(expected.length);
  actual.forEach((row, i) => row.forEach((value, k) => expect(value).toBeCloseTo(expected[i][k], digits[k])));
}
```

Y como **último `it`** de `describe('#171 R6: confeti')`, tras el de R6.4:

```ts
  it('R6.5 a los 1200 ms cada pieza sigue su retardo, su duración y su curva', async () => {
    await renderProbe();
    await act(async () => { jest.advanceTimersByTime(1200); });
    expectSamples(Array.from({ length: 24 }, (_, i) => sampleConfetti(`probe-confetti-${i}`)), CONFETTI_AT_1200, [2, 0, 0]);
  });
```

Commit: `test(mobile): el confeti muestrea cada pieza en vuelo (R6, E2)`.

### E2.2 — R7.4: el rebote del pop

En el mismo fichero, justo después del bloque de E2.1 (tras la función
`expectSamples`):

```ts
// #171 R7 (E2): [opacidad, escala] a 50, 100, 150 y 200 ms del arranque de cada pop.
const POP_SAMPLES = [
  [0.682, 0.944],
  [0.925, 1.06],
  [0.986, 1],
  [0.999, 0.992],
];

function samplePop(testID: string) {
  const style = getAnimatedStyle(screen.getByTestId(testID, { includeHiddenElements: true })) as unknown as {
    opacity: number;
    transform: [{ scale: number }];
  };
  return [style.opacity, style.transform[0].scale];
}
```

Y como **dos últimos `it`** de `describe('#171 R7: pop')`, tras el de R7.3
a los 2400 ms:

```ts
  it('R7.4 Pingo rebota por encima de 1 y se asienta a los 50, 100, 150 y 200 ms', async () => {
    await renderProbe();
    const samples: number[][] = [];
    for (let step = 0; step < 4; step++) {
      await act(async () => { jest.advanceTimersByTime(50); });
      samples.push(samplePop('probe-pingo'));
    }
    expectSamples(samples, POP_SAMPLES, [2, 2]);
  });

  it('R7.4 la insignia repite el rebote a los 450, 500, 550 y 600 ms', async () => {
    await renderProbe();
    await act(async () => { jest.advanceTimersByTime(400); });
    const samples: number[][] = [];
    for (let step = 0; step < 4; step++) {
      await act(async () => { jest.advanceTimersByTime(50); });
      samples.push(samplePop('probe-badge'));
    }
    expectSamples(samples, POP_SAMPLES, [2, 2]);
  });
```

Commit: `test(mobile): el pop muestrea el rebote de Pingo y la insignia (R7, E2)`.

### E2.3 — R10.4: la curva del flote

En `src/components/__tests__/empty-state.test.tsx`, como **último `it`** de
`describe('#171 R10: Pingo flota')`, tras `R10.3 sube cuatro puntos en 1200 ms`:

```ts
  it('R10.4 sigue la curva de 1200 ms a los 300, 600 y 900 ms', async () => {
    await renderProbe();
    const samples: number[] = [];
    for (let step = 0; step < 3; step++) {
      await act(async () => { jest.advanceTimersByTime(300); });
      const style = getAnimatedStyle(screen.getByTestId('probe-float')) as unknown as { transform: [{ translateY: number }] };
      samples.push(style.transform[0].translateY);
    }
    expect(samples).toHaveLength(3);
    samples.forEach((value, i) => expect(value).toBeCloseTo([-0.579, -2, -3.421][i], 2));
  });
```

Commit: `test(mobile): el flote muestrea su curva (R10, E2)`.

### E2.4 — R5.4: el nombre sale de la respuesta

En `src/screens/add-pet/index.test.tsx`, como **último `it`** de
`describe('#171 R5: variante sin collar')`, que es el final del fichero, tras
`R5.3 requestClose vuelve una sola vez`:

```ts
  it('R5.4 toma el nombre de la respuesta y no el del formulario', async () => {
    mockCreatePet.mockResolvedValue({ kind: 'ok', pet: { id: 'pet-new', name: 'Kira' } as never });
    await celebrateNala();
    expect(screen.getByTestId('add-pet-celebration-title').props.children).toBe('¡Kira ya está en casa!');
    expect(screen.getByTestId('add-pet-celebration-body').props.children).toBe('Te ayudo a cuidar de Kira. Vincula un collar y estaré pendiente de dónde está.');
  });
```

Commit: `test(mobile): la celebración toma el nombre de la respuesta (R5, E2)`.

### E2.5 — Trazabilidad

En [[traceability]], la columna de tests ya nombra los cinco `it` (la
rellenó el leader). Codex añade en la columna de commits de R5, R6, R7 y R10
el hash y el mensaje de su commit de E2, con la marca `(E2, nace verde)`.
