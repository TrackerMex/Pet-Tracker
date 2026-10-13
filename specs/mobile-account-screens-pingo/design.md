---
feature: "mobile-account-screens-pingo"
status: approved   # draft | spec_ready | approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-account-screens-pingo]] (#167)

> Rutas relativas a `mobile-pet-tracker/` salvo las que empiezan por `../`.
> Base congelada: `d2b8b0ae`. Requisitos en [requirements.md](requirements.md).

---

## Decisiones

1. **Primero se mueve, después se cambia (N4).** El commit c1 es un `git mv` de
   Login y Registro (fuente y tests) a `src/screens/<x>/index.tsx`, con la ruta
   delgada y los candados que nombran rutas actualizados. No cambia
   comportamiento y la suite entera queda verde. Todo lo visual va en commits
   posteriores, así el diff del movimiento se revisa solo. Patrón: el de
   `src/screens/forgot/index.tsx` (#39, `docs/conventions.md`).

2. **«Rise» = `HomeEntrance`, sin componente nuevo.** El canvas pide que la
   cabecera y el cuerpo entren escalonados desde abajo con fundido.
   `src/screens/home/home-entrance.tsx` ya hace eso: entrada de Reanimated con
   `MOTION_STAGGER_MS` y `MOTION_ENTRANCE_OFFSET_Y`, sin desplazamiento con
   reduce motion. Lo único que le falta es poder maquetar a sus hijos, así que
   gana una prop `className` (R4) y no se mueve de sitio.

3. **«Pop» = `PopIn`, componente nuevo y pequeño.** No hay en la base un
   envoltorio que entre con escala y fundido tras un retardo. `PopIn`
   (`src/components/pop-in.tsx`) anima `opacity` y `scale` (solo transform y
   opacity) con un muelle por duración: `MOTION_POP_SPRING`, 400 ms de la escala
   de la carta con `dampingRatio: 0.6`. Ese pequeño rebote es lo que distingue
   el «pop» de la entrada normal. Con reduce motion conserva el fundido, que
   explica el cambio de estado, y quita la escala (skill `expo-animation` §9).
   Lo usan dos sitios: el tile del candado de Recuperar y la tarjeta de estado
   de Nueva contraseña.

4. **Anillos de ping = bucle de reposo declarado.** Los tres anillos de la
   Bienvenida son una animación continua, y la carta (§Animación punto 7) solo
   permite flotar y parpadear. Por eso R11 enmienda la carta en el mismo PR:
   amplía la viñeta y añade `## Enmienda #167` con su casilla de firma. Cada
   anillo anima `scale` y `opacity` con `withRepeat(withTiming(...), -1, false)`,
   escalonados `duration / 3`. Con reduce motion no se montan, así que no hay
   `withRepeat` que cancelar y los candados de la base
   (`not.toHaveBeenCalled()`) siguen valiendo.

5. **Error general de Registro con icono.** `AlertCircle` de
   `reicon-react-native` (la familia de iconos de la app), de 14 px y color
   `danger` vía `useThemeColors`, en una fila con el texto. El texto pasa a
   `text-sm font-semibold` para que pese lo mismo que el icono. Los
   `FieldError` no cambian (P4).

6. **Tarjeta de estado de Nueva contraseña.** Card `secondary` (la misma
   superficie que la burbuja de Pingo en la Bienvenida) con un disco
   `bg-accent` de 32 px y un `Check` en `accent-foreground`. El texto pasa a
   tinta `text-accent-strong` (#61 R4: el acento como tinta siempre es
   `accent-strong`). Entra con `PopIn`.

7. **Burbuja de Login.** Misma receta que la de la Bienvenida (Card
   `secondary`, `px-4 py-3`), en fila con Pingo a la izquierda. El copy es una
   clave nueva (`login.pingoGreeting`) registrada en
   `../specs/mobile-ui-language/design.md` §2.24.

---

## Archivos afectados por capa

La app móvil no tiene capas domain/application/infrastructure: todo es
presentación, y no se toca `src/api/` ni ningún provider.

| Capa | Fichero | Cambio | R |
|---|---|---|---|
| Rutas | `src/app/(auth)/login.tsx` | pasa a ruta delgada | R1 |
| Rutas | `src/app/(auth)/register.tsx` | pasa a ruta delgada | R1 |
| Pantallas | `src/screens/login/index.tsx` (nuevo, `git mv`) | `LoginScreen`, después entrada, Pingo y burbuja | R1, R6 |
| Pantallas | `src/screens/register/index.tsx` (nuevo, `git mv`) | `RegisterScreen`, después cabecera con Pingo y fila de error | R1, R7, R8 |
| Pantallas | `src/screens/forgot/index.tsx` | Pingo y `PopIn` en el tile | R9 |
| Pantallas | `src/screens/reset-password/index.tsx` | cabecera, cuerpo, tarjeta de estado | R10 |
| Pantallas | `src/screens/welcome/index.tsx` | `welcome-stage` y anillos | R12, R13 |
| Pantallas | `src/screens/home/home-entrance.tsx` | prop `className` | R4 |
| Componentes | `src/components/pop-in.tsx` (nuevo) | `PopIn` | R3 |
| Tema | `src/theme/motion.ts` | cuatro tokens | R2 |
| i18n | `src/i18n/catalog.ts` | `login.pingoGreeting` en en y es | R5 |
| Tests | `src/screens/login/index.test.tsx`, `src/screens/register/index.test.tsx` (`git mv`) | rutas relativas y render de la ruta; después R6, R7, R8 | R1, R6–R8 |
| Tests | `src/screens/forgot/index.test.tsx`, `src/screens/reset-password/index.test.tsx`, `src/screens/welcome/index.test.tsx` | candados nuevos | R9–R13 |
| Tests | `src/components/__tests__/pop-in.test.tsx` (nuevo), `src/screens/home/home-entrance.test.tsx`, `src/theme/__tests__/motion.test.ts` | candados nuevos | R2–R4 |
| Tests (candados globales) | `src/__tests__/ui-copy-table.ts`, `ui-language.test.ts`, `consistency-classnames.test.ts`, `legibility-classnames.test.ts`, `design-drift.test.ts`, `src/providers/__tests__/language-provider.test.tsx` | ver requirements.md §Deltas de candados | R1, R5, R6, R10, R14 |
| Docs | `../docs/ui-guidelines.md` | §7 y `## Enmienda #167` | R11 |
| Specs | `../specs/mobile-ui-language/design.md` | §2.24 | R5 |

No hay dependencias nuevas. `reicon-react-native`, `expo-image`,
`react-native-reanimated` y `heroui-native` ya están instaladas.

---

## Poses usadas

Solo los 8 assets de `assets/images/pingo-*.webp` (B27). No hace falta ninguna
pose nueva.

| Pantalla | testID | Pose | Tamaño | Giro |
|---|---|---|---|---|
| Login | `login-pingo` | `pingo-wave.webp` | 88 × 88 | `-8deg` |
| Registro | `register-pingo` | `pingo-clipboard.webp` | 56 × 56 | — |
| Recuperar | `forgot-pingo` | `pingo-talk.webp` | 120 × 120 | `6deg` |
| Nueva contraseña | `reset-pingo` | `pingo-clipboard.webp` | 72 × 72 | — |
| Bienvenida | `welcome-pingo` (base, sin cambios) | `pingo-wave.webp` | 200 × 200 | — |

Son 4 usos nuevos con 3 poses distintas. El reparto es la pregunta abierta P2.

---

## Dobles de prueba (intención, no copia)

- **`HomeEntrance` y `PopIn` en tests de pantalla.** Un doble que pinta un
  `View` de `react-native` con `testID`, `className` y `style` recibidos,
  renderiza `children` y registra sus props en un `jest.fn`. La factoría
  construye con `jest.requireActual('react')` + `React.createElement`, sin JSX
  (es lo que ya hace el mock de `reicon-react-native` en
  `src/screens/welcome/index.test.tsx`). Así el test de pantalla candea la
  estructura y las props, y la animación real se candea una sola vez, en
  `pop-in.test.tsx` y `home-entrance.test.tsx`. Para `forgot` es obligatorio:
  `lockTile()` busca el tile entre los hijos host del padre de `forgot-title`
  por `className`, y el doble debe dejar ahí un host con esa `className`.
- **`reicon-react-native` en Registro y Nueva contraseña.** El patrón de
  `src/screens/welcome/index.test.tsx`: `{ ...actual, AlertCircle: mockIcon('icon-alert-circle') }`
  y `{ ...actual, Check: mockIcon('icon-check') }`. Cada icono es un `View` con
  el `testID` y todas las props, para poder leer `size` y `color`.
- **`useThemeColors`.** `jest.mock('../../theme/use-theme-colors', ...)`, que
  devuelve `color:${token}` por token, como en `src/components/__tests__/pet-map.test.tsx`
  (el de la Bienvenida devuelve `['accent-strong-ink']`; corrección del leader en H0). El color esperado
  es entonces `'color:danger'` o `'color:accent-foreground'`, un literal.
- **Reanimated en `pop-in.test.tsx`.** `{ ...actual, __esModule: true, useReducedMotion: () => mockUseReducedMotion() }`.
  Sin `__esModule: true`, `Animated.View` sale `undefined` (lección de #152 E1).
  No se dobla `withSpring`, `withTiming` ni `withDelay`: los candados son de
  línea de tiempo.
- **Reanimated en la Bienvenida.** Se reutiliza el doble existente
  (`withRepeat` = identidad) sin tocarlo.

---

## Timers

Todos los instantes se derivan de las duraciones reales y llevan un margen de
al menos 100 ms para absorber la cuantización de frames. Si un candado falla
por poco, se amplía la ventana, nunca se afloja la aserción.

**`PopIn` (R3).**

- Retardo: `MOTION_TRANSITION_MS` = 250 ms.
- Opacidad: `MOTION_FADE_TIMING`, 250 ms, termina a los 500 ms.
- Escala: muelle de `duration: 400`. En Reanimated 4 el muelle por duración
  puede tardar hasta 1,5 × su duración en asentarse, así que termina como
  tarde a los 250 + 600 = 850 ms.
- Muestras: 200 ms (antes del retardo, todo inicial) y 1500 ms (todo final,
  con 650 ms de margen).

**Anillos (R12).** Duración 2400 ms. Escalonado `2400 / 3` = 800 ms. Con
`withRepeat` = identidad, cada anillo hace un solo `withTiming`:

| Anillo | Arranca | Termina |
|---|---|---|
| ring-0 | 0 | 2400 |
| ring-1 | 800 | 3200 |
| ring-2 | 1600 | 4000 |

Muestras:

- 700 ms: ring-0 a mitad, los otros sin arrancar (100 ms antes de los 800).
- 1500 ms: ring-0 y ring-1 en marcha, ring-2 sin arrancar (100 ms antes de los 1600).
- 2500 ms: ring-0 terminado (100 ms después de los 2400), ring-1 y ring-2 en marcha.
- 3300 ms: ring-0 y ring-1 terminados (100 ms después de los 3200), ring-2 en marcha.
- 4100 ms: todos terminados.

El easing es `bezier(0.23, 1, 0.32, 1)`, donde `y = 1 - (1 - t)³`. A los
1700 ms de los 2400 (ring-1 a los 2500 y ring-2 a los 3300) el progreso es de
≈ 0,996: la opacidad vale ≈ 0,002 y no es 0, así que «≠ final» se cumple sin
tolerancias.

---

## Alternativas descartadas

- **Mover `HomeEntrance` a `src/components/`.** Sería lo limpio si lo usan
  tres pantallas fuera de Inicio, pero mueve un fichero ajeno y sus candados
  (#153, #155) por un beneficio de nombre. Se importa desde
  `'../home/home-entrance'`, y moverlo es trabajo futuro.
- **Un `View` interior dentro de `HomeEntrance` en vez de la prop `className`.**
  Añade un nivel al árbol en tres pantallas y deja `HomeEntrance` sin poder
  maquetar. La prop es una línea.
- **Animaciones reales en los tests de pantalla.** Mezcla dos cosas en cada
  test (estructura y línea de tiempo), y los timers falsos de una pantalla con
  red y providers son la fuente de flakes de #72. Se candean una vez en el
  componente.
- **Anillos en versión estática con reduce motion.** Tres círculos quietos no
  explican nada y añaden ruido. Con reduce motion no se pintan.
- **Restyle del tile de Recuperar a `bg-accent` con labio.** Toca los recuentos
  globales de `consistency-classnames` y `rounded-xl bg-accent` de #166 R2. Se
  deja como pregunta (P3).
- **`overflow-hidden` en `welcome-scene` para recortar los anillos.** Cortaría
  la sombra y el borde de la Card. Pregunta P7.
