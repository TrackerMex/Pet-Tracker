---
feature: "mobile-home-motion-foundations"
status: approved     # draft | approved
tags: [mobile, ui, motion, spec]
---

# Requisitos — [[mobile-home-motion-foundations]]

> Feature #152. Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.

## Contexto y base medida

Base congelada: `origin/main` en `37f6362c`; la branch
`feature/152-mobile-home-motion-foundations` solo añade sobre ella el registro
de la feature (`a783a2fa`) y esta spec. Fuentes: `feature_list.json` #152,
`progress/explore_ui-delight-appllama.md` (§1 D3-D4, §3 P7, §4 C; los
candidatos A, B, D, E, F y G quedan fuera), `docs/ui-guidelines.md`
(§Animación, §Micro-reglas, §Dirección de arte 3, §Decisiones fijas 1-3) y
`progress/audit_animations_mobile.md` (A1 y A2, solo como referencia de
valores; el audit está parcialmente obsoleto y aquí no se cita nada de él sin
medirlo).

La feature da a la Home tres cosas que hoy no tiene (explore D4: "no hay
entrada de cards, ni transición de skeleton, ni revelado de datos"):

1. una entrada escalonada de sus bloques, una sola vez por montaje;
2. un fundido de las cifras del resumen cuando sustituyen a su skeleton;
3. una barra de batería del collar que se llena al llegar el dato;

y deja las duraciones y el preset de movimiento en un solo sitio
(`src/theme/motion.ts`), con la enmienda A21 de la carta que lo autoriza.

### Premisas verificadas

Todas las órdenes se ejecutan desde `mobile-pet-tracker/` en la base
congelada. Antes de tocar nada, Codex las vuelve a ejecutar; si una salida no
coincide, **para y reporta** en `progress/impl_mobile-home-motion-foundations.md`
en vez de adaptar la spec por su cuenta.

| # | Orden | Salida esperada | Qué demuestra |
|---|---|---|---|
| P1 | `grep -rlF 'entering=' src \| wc -l` | `0` | Ninguna pantalla usa hoy animaciones de layout de Reanimated |
| P2 | `test -e src/theme/motion.ts; echo $?` | `1` | El módulo de movimiento no existe |
| P3 | `grep -cF -- '--motion' src/theme/global.css` | `0` | No hay tokens `--motion-*` en global.css |
| P4 | `grep -rlF 'home-entrance' src \| wc -l` | `0` | Ningún testID ni fichero de la entrada existe |
| P5 | `` grep -cF 'promueven a tokens `--motion-*` en global.css' ../docs/ui-guidelines.md `` | `1` | La línea de la carta que A21 sustituye |
| P6 | `grep -cF 'unmountOnBlur' 'src/app/(tabs)/_layout.tsx'` | `0` | Las tabs no desmontan la Home: volver a la tab es un foco, no un montaje |
| P7 | `grep -cF "expect(mockWithTiming).not.toHaveBeenCalled()" src/screens/home/index.test.tsx` | `1` | El candado de #106 R3 que exige que, bajo reduce motion, nada llame a `withTiming` en la Home |
| P8 | `grep -cF '.children.flatMap((child) =>' src/screens/home/index.test.tsx` | `4` | Los cuatro tests de orden que leen los hijos directos de `home-content` (R5 los mueve) |
| P9 | `grep -cF 'BAR_ENTRY_STAGGER_MS = 40' src/screens/home/weekly-activity-chart.tsx` | `1` | La gráfica semanal ya anima sus barras al entrar; esta feature no le añade nada dentro |
| P10 | `grep -cF "dot: 'bg-success'" src/components/pet-hero-header.tsx` y `grep -cF "dot: 'bg-warning-strong'" src/components/pet-hero-header.tsx` | `1` y `1` | Las dos clases de relleno de la barra de batería ya existen y no chocan con el guard `text-warning` de #61 R5 (que solo mira `text-`) |

Premisas de la librería, leídas en `react-native-reanimated` 4.5.1 y
`test-renderer` (el renderer de RNTL 14). Son la razón de la arquitectura de
R3-R7. Si en la práctica alguna falla, Codex **para y reporta**; no la
sortea:

- **PL1. Un estilo animado que empieza en `opacity: 0` rompería la suite.** En
  jest, `PropsFilter` deja en `props.style` del nodo host los valores del
  primer render (`_initialPropsMap`) y las actualizaciones solo llegan a
  `jestAnimatedStyle`. Un envoltorio con `useSharedValue(0)` en la opacidad
  dejaría a todos sus descendientes con opacidad 0 para `toBeVisible`, y
  `index.test.tsx` usa `toBeVisible` en casi todos sus tests. Por eso la
  entrada usa `entering` y no un estilo animado.
- **PL2. `entering` no se invoca en jest.**
  `AnimatedComponent._configureLayoutAnimation` pasa la receta a
  `updateLayoutAnimations` (módulo nativo, sin efecto en jest) sin llamarla.
  La receta no llama por tanto a `withTiming` en la suite, y P7 sigue verde.
- **PL3. El nodo host recibe `entering` tal cual.**
  `PropsFilter.filterNonAnimatedProps` copia sin tocar toda prop que no sea
  `style` ni `animatedProps`. Los tests leen
  `screen.getByTestId(id).props.entering` y la invocan ellos mismos.
- **PL4. El mismo nodo host devuelve el mismo objeto.** `test-renderer`
  guarda en un `WeakMap` (`instanceMap`) el elemento de cada instancia host.
  Mientras el nodo no se desmonta, `getByTestId` devuelve el mismo objeto; si
  se vuelve a montar, devuelve otro. R6 se apoya en esa identidad.
- **PL5. La duración de un muelle es perceptual.** Con `duration`, el muelle
  de Reanimated tarda en asentarse unas 1,5 veces esa duración
  (`perceptualCoefficient = 1.5`). Ningún test de jest ejecuta los frames de
  `entering`; el dato solo importa para el smoke.

## Siete preguntas de la Home (carta §Dirección de arte 3)

Ninguna pregunta cambia de contenido: la feature solo cambia **cómo llega** el
dato a la pantalla, no qué dato se muestra ni dónde.

| Pregunta | Dónde se responde hoy | Qué cambia con #152 |
|---|---|---|
| ¿Está segura? | Hero (`PetHeroHeader`), punto de estado | Nada; el hero no se mueve |
| ¿Dónde está? | `last-position-card` | Entra con su escalón (R5) |
| ¿El collar está conectado? | `collar-status` en `collar-card` | Entra con su escalón (R5) |
| ¿Tiene batería? | `collar-battery` en `collar-card` | Mismo texto y mismo umbral; se añade una barra con el mismo dato (R8) |
| ¿Tiene algún recordatorio pendiente? | `reminders-section` | Entra con su escalón (R5) |
| ¿Cómo fue su actividad hoy? | `summary-card` y la gráfica semanal | La fila del resumen aparece con un fundido al sustituir a su skeleton (R7); la gráfica ya anima sus barras (P9) |
| ¿Hay alguna alerta? | Hero (alertas abiertas) | Nada |

## Requisitos funcionales

Convenciones de todos los tests:

- Los valores esperados son **literales** escritos en el test (`250`,
  `'bg-success'`, `[0.23, 1, 0.32, 1]`), nunca el símbolo importado de
  producción. Las únicas excepciones son R8.3 y R8.7, que comprueban con `toBe`
  que la barra **usa** el preset compartido; R8.3 añade además los literales.
- Las esperas van sobre el árbol renderizado (`docs/conventions.md` §Esperas):
  se espera a un texto o nodo visible, no a un contador de mock. Una aserción
  de ausencia se ancla siempre a un nodo positivo presente en el mismo render.
- En los comandos de jest, toda ruta con `(tabs)` va escapada como
  `\(tabs\)`. Esta spec no la necesita: sus ficheros de test no la contienen.

### R1 — Las duraciones y el preset de movimiento viven en un solo sitio

THE SYSTEM SHALL exponer en `mobile-pet-tracker/src/theme/motion.ts` estas
constantes y ninguna otra:

| Símbolo | Valor exacto |
|---|---|
| `MOTION_FEEDBACK_MS` | `150` |
| `MOTION_TRANSITION_MS` | `250` |
| `MOTION_SURFACE_MS` | `400` |
| `MOTION_STAGGER_MS` | `60` |
| `MOTION_ENTRANCE_OFFSET_Y` | `12` |
| `MOTION_SETTLE_SPRING` | `{ duration: 250, dampingRatio: 1, reduceMotion: ReduceMotion.System }` |
| `MOTION_FADE_TIMING` | `{ duration: 250, easing: Easing.bezier(0.23, 1, 0.32, 1), reduceMotion: ReduceMotion.Never }` |
| `MOTION_FILL_TIMING` | `{ duration: 250, easing: Easing.bezier(0.77, 0, 0.175, 1), reduceMotion: ReduceMotion.System }` |

Los tres objetos usan `MOTION_TRANSITION_MS` para su `duration`, sin repetir el
número. El módulo no importa nada de `global.css` ni de `uniwind` y no declara
colores, espaciados ni radios.

Observable con `mobile-pet-tracker/src/theme/__tests__/motion.test.ts`,
describe `#152 R1: las duraciones y el preset de movimiento viven en un solo sitio`.
El test sustituye `Easing.bezier` de `react-native-reanimated` por un doble
que devuelve sus cuatro puntos de control, `{ bezier: [x1, y1, x2, y2] }`, para
poder comparar la curva con un literal. Tiene estos `it`:

- `declara las tres duraciones de la carta` — `150`, `250` y `400`.
- `declara el escalonado y el desplazamiento de la entrada` — `60` y `12`.
- `declara un muelle de asentamiento sin rebote` — `toEqual` con el literal
  de la tabla.
- `declara un fundido ease-out que sobrevive a reduce motion` — `toEqual`
  con `easing: { bezier: [0.23, 1, 0.32, 1] }`.
- `declara el relleno de barra ease-in-out` — `toEqual` con
  `easing: { bezier: [0.77, 0, 0.175, 1] }`.
- `no exporta nada más` — `Object.keys(require('../motion')).sort()` es
  igual a la lista literal de los ocho nombres de la tabla.

### R2 — La carta apunta a `motion.ts` (enmienda A21)

THE SYSTEM SHALL dejar en `docs/ui-guidelines.md`:

1. en §Animación, la frase `se promueven a tokens` + `` `--motion-*` `` +
   `en global.css` sustituida por:
   `viven en ` + `` `src/theme/motion.ts` `` + ` (enmienda A21 de #152)`;
2. al final del fichero, una sección `## Enmienda #152 — el movimiento vive en src/theme/motion.ts`
   que diga:
   - que Reanimated consume números y la propia §Animación prohíbe pasarle
     variables CSS;
   - que `motion.ts` no es un segundo sistema de estilos en el sentido de
     §Decisiones fijas 1: no contiene colores, espaciados, radios ni clases,
     solo duraciones y configuraciones de Reanimated, con los precedentes
     `native-styles.ts` y `touch-target.ts` en la misma carpeta;
   - que las constantes de movimiento anteriores a #152 (`MEALS_BAR_TIMING`,
     `KCAL_BAR_TIMING`, `WELCOME_ENTRANCE_MS`, `BAR_ENTRY_*`,
     `METRIC_TAB_SPRING`, `TAB_INDICATOR_SPRING`) migran a `motion.ts` en una
     feature posterior y no en esta;
   - y terminar con la casilla `- [ ] Enmienda aprobada por humano`.

Observable con `mobile-pet-tracker/src/theme/__tests__/motion.test.ts`,
describe `#152 R2: la carta apunta a motion.ts`. El describe lee la carta con
`join(process.cwd(), '..', 'docs', 'ui-guidelines.md')`, como
`consistency-classnames.test.ts`, y tiene estos `it`:

- `la carta nombra motion.ts en §Animación y ya no promete tokens --motion-*` —
  la carta contiene `` `src/theme/motion.ts` (enmienda A21 de #152) `` y no
  contiene `promueven a tokens`.
- `la carta declara la enmienda #152 con su casilla` — contiene
  `## Enmienda #152 — el movimiento vive en src/theme/motion.ts`, y tras ese
  encabezado aparece una línea que empieza por `- [` y contiene
  `Enmienda aprobada por humano`.
- `global.css no declara tokens de movimiento` — `global.css` no contiene
  `--motion`.

### R3 — La receta de entrada de la Home

THE SYSTEM SHALL exportar desde
`mobile-pet-tracker/src/screens/home/home-entrance.tsx` una función
`homeEntering(delayMs: number, offsetY: number)`. Devuelve una animación de
layout personalizada de Reanimated: una función con la directiva
`'worklet'` en su primera línea. Esa función, al invocarse, devuelve
exactamente esto:

```
{
  initialValues: { opacity: 0, transform: [{ translateY: offsetY }] },
  animations: {
    opacity: withDelay(delayMs, withTiming(1, MOTION_FADE_TIMING), ReduceMotion.Never),
    transform: [{ translateY: withDelay(delayMs, withSpring(0, MOTION_SETTLE_SPRING), ReduceMotion.Never) }],
  },
}
```

`homeEntering(...)` no llama a `withDelay`, `withTiming` ni `withSpring` al
crearse; solo lo hace la función que devuelve, cuando Reanimated (o un test) la
invoca. P7 depende de esto.

Observable con `mobile-pet-tracker/src/screens/home/home-entrance.test.tsx`,
describe `#152 R3: la receta de entrada de la Home`. El fichero sustituye en
`react-native-reanimated` cuatro funciones por dobles que registran sus
argumentos:

- `withDelay` por `(delayMs, animation, reduceMotion) => ({ delayMs, animation, reduceMotion })`;
- `withTiming` y `withSpring` por `(toValue, config) => ({ toValue, config })`;
- `Easing.bezier` por el doble de R1;
- y `useReducedMotion` por un `jest.fn` que el test controla.

Tiene estos `it`:

- `parte invisible y desplazada y llega opaca y en su sitio` — invoca
  `homeEntering(180, 12)({})` y hace `toEqual` con el objeto entero en
  literales. En él van `delayMs: 180`, `reduceMotion: 'never'`,
  `config: { duration: 250, easing: { bezier: [0.23, 1, 0.32, 1] }, reduceMotion: 'never' }`
  y `config: { duration: 250, dampingRatio: 1, reduceMotion: 'system' }`
  (los valores de cadena de `ReduceMotion.Never` y `ReduceMotion.System`).
- `no anima nada hasta que se invoca` — `homeEntering(180, 12)` sin invocar
  deja los tres dobles sin llamadas.

### R4 — `HomeEntrance` escalona por índice y respeta reduce motion

THE SYSTEM SHALL exportar desde `home-entrance.tsx` el componente
`HomeEntrance({ index, testID, children })`. Renderiza un único nodo host:
un `Animated.View` con ese `testID`, sin `style` ni `className`, con los
`children` dentro y con:

- `entering={homeEntering(index * MOTION_STAGGER_MS, MOTION_ENTRANCE_OFFSET_Y)}`
  WHILE reduce motion está desactivado (`useReducedMotion()` devuelve `false`);
- `entering={homeEntering(index * MOTION_STAGGER_MS, 0)}`
  WHILE reduce motion está activado. Se conservan el fundido y el escalonado;
  desaparece el desplazamiento (decisión D3).

Observable con `home-entrance.test.tsx`, describe
`#152 R4: HomeEntrance escalona por índice y respeta reduce motion`, con los
dobles de R3. Tiene estos `it`:

- `el índice 0 entra sin espera y desplazado 12` — `index={0}`;
  `props.entering({})` invocada sobre el nodo de `getByTestId` da
  `delayMs: 0` en los dos `withDelay` y `translateY: 12` en `initialValues`.
- `el índice 5 espera 300 ms` — `index={5}`; los dos `withDelay` llevan
  `delayMs: 300`.
- `bajo reduce motion conserva el fundido y el escalonado y no desplaza` —
  `useReducedMotion` a `true` e `index={5}`. `toEqual` del objeto entero:
  `initialValues: { opacity: 0, transform: [{ translateY: 0 }] }`, el fundido
  con `delayMs: 300` y la config de fundido de R3.
- `no añade estilo propio` — el nodo host tiene `props.style` y
  `props.className` `undefined`, y un único hijo no-string, que es el hijo
  renderizado.

### R5 — La Home envuelve cada bloque en su entrada escalonada

WHEN la Home pinta uno de estos seis bloques, THE SYSTEM SHALL pintarlo dentro
de un `HomeEntrance` que es hijo directo de `home-content`, con este índice y
este `testID`:

| Bloque (testID actual) | Envoltorio | `index` | Espera |
|---|---|---|---|
| `summary-card` | `home-entrance-summary` | 0 | 0 ms |
| `collar-card` | `home-entrance-collar` | 1 | 60 ms |
| `quick-actions` | `home-entrance-quick-actions` | 2 | 120 ms |
| `weekly-activity-skeleton` o `weekly-activity-card` | `home-entrance-weekly` | 3 | 180 ms |
| `reminders-section` | `home-entrance-reminders` | 4 | 240 ms |
| `last-position-card` | `home-entrance-last-position` | 5 | 300 ms |

- Cada envoltorio se pinta exactamente bajo la misma condición que su bloque,
  para no dejar envoltorios vacíos que sumen un `gap: 16` de más.
  `home-entrance-weekly` se pinta WHEN `selectedPetId` existe y la actividad
  está pendiente o es `ok`. Envuelve el skeleton y, al llegar el dato, la
  gráfica, **en la misma posición de JSX**, para que el envoltorio no se
  vuelva a montar al cambiar de uno a otro.
- `pet-hero-error` y `weekly-activity-day-map` siguen siendo hijos directos de
  `home-content`, sin envoltorio. El primero es un error; el segundo aparece
  por una pulsación del usuario, no al entrar.
- El hero (`PetHeroHeader`) y `home-states` no cambian.

Observable con `mobile-pet-tracker/src/screens/home/index.test.tsx`, describe
`#152 R5: la Home envuelve cada bloque en su entrada escalonada`. Tiene estos
`it`:

- `pinta los seis envoltorios como hijos directos y en orden` — con una
  mascota con collar, actividad `ok` y recordatorios, y sin ningún día
  seleccionado. Los `testID` de los hijos no-string de `home-content`
  (`toEqual` exacto, sin filtrar) son los seis de la tabla, en orden.
- `cada envoltorio contiene su bloque` — `within(<envoltorio>).getByTestId(<bloque>)`
  para los seis pares de la tabla. El de la actividad se prueba con
  `weekly-activity-card`.
- `escalona las entradas cada 60 ms en el orden de los bloques` — por cada
  envoltorio: limpia el mock de `withDelay` (el `jest.fn` del mock de
  reanimated del fichero), invoca `props.entering({})` y comprueba que las
  esperas de las dos llamadas son `[d, d]`, con `d` el literal de la tabla.
- `el envoltorio de la actividad envuelve también su skeleton` — con la
  actividad pendiente (`pending()`): `home-entrance-weekly` contiene
  `weekly-activity-skeleton`.
- `no pinta los envoltorios del collar ni de la última posición si el detalle falla` —
  `home-entrance-collar` y `home-entrance-last-position` ausentes, con
  `home-entrance-summary` presente como ancla.
- `no pinta el envoltorio de la última posición sin collar` — con
  `device: null`, `home-entrance-last-position` ausente y
  `home-entrance-collar` presente.
- `no pinta el envoltorio de la actividad si la actividad falla` —
  `home-entrance-weekly` ausente y `home-entrance-reminders` presente.

**Candados que esta R mueve.** Los cuatro tests de orden de P8 leen
`child.props.testID` de los hijos de `home-content`. Con los envoltorios,
esos hijos dejan de ser los bloques. En los cuatro, cada `testID` de bloque
se sustituye por el de su envoltorio según la tabla, **tanto en el filtro como
en el array esperado**, sin cambiar el orden ni quitar ninguno. Ningún otro
cambio:

| describe | it |
|---|---|
| `R14: la Home monta la actividad semanal sin pedir nada nuevo` | `queda entre el resumen y la última posición en el árbol` |
| `#69 R1: la tira de hoy tiene cuatro celdas con tres divisores` | `coloca la tira sobre la tarjeta del collar` |
| `#71 R1: la Home dibuja la rejilla de accesos rápidos` | `coloca la rejilla entre el collar y la actividad semanal` |
| `#70 R14: posición y condición de la sección` | `coloca la sección entre la actividad semanal y la última posición` |

### R6 — La entrada se reproduce una vez por montaje

WHEN la Home vuelve al foco (y con ello refresca mascotas, detalle y alertas),
THE SYSTEM SHALL conservar montados los seis envoltorios de R5 y el de R7, de
modo que ninguna entrada se repite. Volver a la tab es un foco (P6), y el test
lo cubre con la misma llamada al `useFocusEffect` simulado.

WHEN el usuario cambia de mascota, THE SYSTEM SHALL conservar montados
`home-entrance-summary`, `home-entrance-quick-actions`, `home-entrance-weekly`
y `home-entrance-reminders`. Se vuelven a montar, y por tanto repiten su
entrada, solo los envoltorios cuyo bloque desaparece mientras llega el dato
de la otra mascota: `home-entrance-collar`, `home-entrance-last-position` y
`summary-reveal` (decisión D2).

Observable con `index.test.tsx`, describe
`#152 R6: la entrada se reproduce una vez por montaje`. Tiene estos `it`:

- `no repite la entrada al volver al foco` — guarda los siete nodos
  (`getByTestId`). Hace que `getPet` devuelva la batería `81` en vez de `82`.
  Invoca el callback de foco como el describe `R10: refetch al foco`. Espera
  a que `collar-battery` muestre `81%`. Cada uno de los siete nodos es
  `toBe` el guardado (PL4).
- `al cambiar de mascota solo repiten los bloques que se vuelven a montar` —
  dos mascotas con collar, cada una con su batería. Guarda los siete nodos,
  pulsa `pet-chip-pet-2` como el test `selects a pressed pet and reloads its detail and activity`
  y espera a la batería de la segunda mascota y a `summary-weight`. Los
  cuatro conservados son `toBe` el guardado; `home-entrance-collar`,
  `home-entrance-last-position` y `summary-reveal` son `not.toBe` el guardado.

### R7 — Las cifras del resumen aparecen con un fundido

WHEN la fila del resumen sustituye a `summary-skeleton`, THE SYSTEM SHALL
pintarla dentro de un `Animated.View` con `testID="summary-reveal"`, sin
`style` ni `className` y con `entering={homeEntering(0, 0)}`: un fundido de
opacidad 0 a 1 en 250 ms ease-out, sin espera ni desplazamiento, igual con o
sin reduce motion. Ese `Animated.View` envuelve la fila desde fuera: la fila
conserva su `View` con `className="flex-row"` y sus celdas siguen siendo sus
hijos directos. El skeleton se desmonta en el acto, sin fundido cruzado.

Observable con `index.test.tsx`, describe
`#152 R7: las cifras del resumen aparecen con un fundido`. Tiene estos `it`:

- `envuelve la fila del resumen sin tocarla` — con
  `row = getByTestId('summary-weight').parent.parent`: `row.props.className`
  es `'flex-row'`, `row.parent` es `toBe(getByTestId('summary-reveal'))`, y
  `summary-reveal` tiene un único hijo no-string.
- `funde sin espera ni desplazamiento` — limpia el mock de `withDelay`, invoca
  `props.entering({})` de `summary-reveal` y comprueba dos cosas. El
  resultado, con los mocks instantáneos del fichero, es `toEqual`
  `{ initialValues: { opacity: 0, transform: [{ translateY: 0 }] }, animations: { opacity: 1, transform: [{ translateY: 0 }] } }`.
  Y las esperas registradas son `[0, 0]`.
- `no monta el fundido mientras el skeleton ocupa su sitio` — con la
  actividad pendiente, `summary-skeleton` presente y `summary-reveal` ausente.

### R8 — La batería del collar se dibuja como barra

WHEN `collar-card` muestra un `batteryPct` numérico, THE SYSTEM SHALL añadir,
en la misma fila que `collar-battery` y detrás de ese texto, el componente
`CollarBatteryBar({ pct })` de
`mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx`, que pinta:

| Nodo | testID | className exacto |
|---|---|---|
| Pista (`View`) | `collar-battery-track` | `h-1.5 flex-1 overflow-hidden rounded-full bg-surface` |
| Relleno (`Animated.View`, único hijo de la pista), `pct > 60` | `collar-battery-fill` | `h-full rounded-full bg-success` |
| Relleno, `pct <= 60` | `collar-battery-fill` | `h-full rounded-full bg-warning-strong` |

El umbral es el mismo `> 60` que ya colorea el icono y el texto. La pista es
`bg-surface` porque `collar-card` es `bg-default` y una pista `bg-default` no
se vería. Las dos clases del relleno se escriben como literales completos.

El relleno anima su ancho, `width: \`${valor}%\``, con un valor compartido
siguiendo el mismo patrón que la barra de comidas de #106:

- WHILE reduce motion está desactivado: el valor nace en `0` al montarse el
  componente, y un efecto le asigna `withTiming(pct, MOTION_FILL_TIMING)`, así
  que la barra se llena desde vacía cada vez que se monta. Un cambio de `pct`
  sin desmontaje, por ejemplo tras un refresco, anima del valor anterior al
  nuevo.
- WHILE reduce motion está activado: el valor nace en `pct` y el efecto le
  asigna `pct` directamente, sin `withTiming`.

IF `batteryPct` es `null` o no hay collar, THEN THE SYSTEM SHALL no pintar
`CollarBatteryBar`. La barra no añade texto ni copy; el lector de pantalla
sigue leyendo `collar-battery`.

Observable con `index.test.tsx`, describe
`#152 R8: la batería del collar se dibuja como barra`. Tiene estos `it`:

1. `pinta %i% con %s` (`it.each` de `[82, 'bg-success']`, `[61, 'bg-success']`,
   `[60, 'bg-warning-strong']` y `[12, 'bg-warning-strong']`). Comprueba los
   `className` literales de la pista y del relleno, que el relleno es el único
   hijo de la pista, y
   `toHaveAnimatedStyle({ width: '<pct>%' }, { shouldMatchAllProps: true })`.
2. `pone la barra detrás del porcentaje en su fila` — `collar-battery-track`
   tiene el mismo `parent` que `collar-battery`, y aparece después de él entre
   los hijos no-string de esa fila.
3. `llena la barra desde vacía con el preset de barra` —
   `StyleSheet.flatten(fill.props.style).width` es `'0%'` (el estilo del
   primer render, PL1). `mockWithTiming` tiene una llamada con primer
   argumento `82` cuya config es `toBe(MOTION_FILL_TIMING)` **y** también
   `expect.objectContaining({ duration: 250, reduceMotion: ReduceMotion.System })`.
4. `bajo reduce motion fija el ancho sin animar` — `mockUseReducedMotion`
   devuelve `true`. Ninguna llamada a `mockWithTiming` tiene `82` como primer
   argumento, el ancho del primer render es `'82%'` y `toHaveAnimatedStyle`
   da `'82%'`. El test devuelve el mock a `false` al terminar, como #106 R3.
5. `no pinta la barra sin porcentaje` — con `batteryPct: null`,
   `collar-battery` muestra `—` y `collar-battery-track` está ausente.
6. `no pinta la barra sin collar` — con `device: null`, `collar-status`
   presente y `collar-battery-track` ausente.
7. `anima del valor anterior al nuevo al refrescar` — con la batería `82`,
   guarda `collar-battery-fill` (`getByTestId`) y limpia `mockWithTiming`. Hace
   que `getPet` devuelva `81`, invoca el callback de foco como el describe
   `R10: refetch al foco` y espera a que `collar-battery` muestre `81%`. El
   relleno es `toBe` el guardado (no se ha vuelto a montar, PL4),
   `mockWithTiming` tiene una llamada con primer argumento `81` cuya config es
   `toBe(MOTION_FILL_TIMING)`, y
   `toHaveAnimatedStyle({ width: '81%' }, { shouldMatchAllProps: true })`.
8. `bajo reduce motion salta al nuevo valor al refrescar` — el mismo
   recorrido que el 7 con `mockUseReducedMotion` devolviendo `true`. El
   relleno es `toBe` el guardado, ninguna llamada a `mockWithTiming` tiene
   `81` como primer argumento, y
   `toHaveAnimatedStyle({ width: '81%' }, { shouldMatchAllProps: true })`.
   Cierra la rama «el efecto le asigna `pct` directamente» en una
   actualización, no solo en el montaje que cubre el 4: una barra que bajo
   reduce motion solo nace en `pct` y luego no se mueve pasaría el 4 en verde.
   El test devuelve el mock a `false` al terminar.

### R9 — El movimiento de la Home no mete drift de estilo

THE SYSTEM SHALL mantener `theme/motion.ts`, `screens/home/home-entrance.tsx`,
`screens/home/collar-battery-bar.tsx` y `screens/home/index.tsx` libres de
escapes de estilo literales.

Observable con `mobile-pet-tracker/src/__tests__/design-drift.test.ts`, describe
`#152 R9: el movimiento de la Home no mete drift de estilo`, it
`mantiene sus ficheros sin escapes de estilo literales`. Es una copia de la
forma de `#98 R10: la barra de comidas no mete drift de estilo`, con esos
cuatro ficheros y reutilizando la constante `MEALS_BAR_STYLE_ESCAPES` ya
declarada. No se declara ningún patrón nuevo, porque `#108 R1` exige que los
patrones compartidos se declaren una sola vez. Toda cita a la feature en los
comentarios de esos ficheros se escribe `#152 R<n>`, la forma que
`#108 R2` distingue de un color hex.

### R10 — Smoke del humano en dev build de Android

WHEN Codex termina y el reviewer aprueba, THE SYSTEM SHALL superar la prueba
de §Gate humano. Solo el humano cierra este requisito, marcando su casilla.
Ni Codex ni el reviewer lo marcan.

## Fuera de alcance

Cada viñeta dice si es una **delimitación** (no hace falta en ningún
momento) o una **deuda** (habrá que hacerla en otra feature).

- **Delimitación.** Los candidatos A, B, D, E, F y G de
  `progress/explore_ui-delight-appllama.md` §4. Esta feature es solo el
  candidato C, y de él solo la Home y las fundaciones.
- **Delimitación.** `PressableScale` (audit A1) y cualquier cambio del
  feedback de pulsación. Ningún `Pressable` de la Home cambia.
- **Delimitación.** El hero (`PetHeroHeader`), `pet-hero-error`,
  `home-states` y `weekly-activity-day-map` no reciben entrada (R5).
- **Delimitación.** Fundido skeleton→contenido fuera de la fila del resumen
  (decisión D5):
  - la gráfica semanal ya anima sus barras al entrar (P9);
  - el cuerpo de recordatorios tiene candados de recuento de hijos
    (`reminders-section-body` con `.children` y `toHaveLength`) que un
    envoltorio rompería sin aportar una pregunta nueva;
  - los skeletons del hero pertenecen al hero.
- **Delimitación.** Animaciones de salida (`exiting`) al desmontarse un bloque
  al cambiar de mascota, y fundidos cruzados skeleton/contenido.
- **Delimitación.** Cifras que cuentan hacia arriba (count-up). Exigen un
  `setState` por frame o texto animado, y el lector de pantalla leería cada
  valor intermedio.
- **Delimitación.** Háptica. La entrada no es una acción del usuario, y la
  carta (§Animación, regla de la skill expo-animation §8) prohíbe háptica en
  una entrada.
- **Delimitación.** Otras pantallas. El escalonado de `meal-schedule` (audit
  A2) solo presta sus valores.
- **Delimitación.** Un test de jest que ejecute los frames de `entering`. No
  es posible (PL2); lo cubren R3 y R4 por la receta, y R10 en el dispositivo.
- **Deuda.** Migrar a `motion.ts` las constantes de movimiento anteriores a
  #152: `MEALS_BAR_*` y `KCAL_BAR_TIMING`, `WELCOME_ENTRANCE_MS`,
  `BAR_ENTRY_*` y `METRIC_TAB_SPRING`, y `TAB_INDICATOR_SPRING`. La enmienda
  A21 lo deja escrito (R2). Mientras tanto, `motion.ts` convive con ellas.

## Decisiones del humano

La spec las deja cerradas con el valor por defecto que se indica. Al aprobar,
el humano firma esos valores; si quiere otro, lo dice en el gate y la spec se
enmienda antes del handoff.

- **D1 — Dónde viven las duraciones.** Por defecto, en
  `src/theme/motion.ts` (constantes JS) con la enmienda A21, y `global.css`
  no se toca, aunque `feature_list.json` lo listaba en `files_affected`. Motivo:
  Reanimated consume números y §Animación prohíbe pasarle variables CSS. La
  alternativa descartada son tokens `--motion-*` en `global.css` leídos con
  `Uniwind.getCSSVariable` y parseados de `"250ms"` a número en cada uso.
- **D2 — "Una vez por montaje".**
  - Volver al foco, volver a la tab o refrescar nunca repite la entrada.
  - Cambiar de mascota la repite solo en collar, última posición y cifras del
    resumen, porque esos bloques desaparecen mientras llega el dato.
  - Lo descartado: suprimir también esa repetición. Exige recordar fuera del
    componente qué ya entró y no aporta ninguna pregunta.
- **D3 — Reduce motion.** Se conservan el fundido de opacidad y el escalonado.
  Se quitan el desplazamiento de 12 px y el llenado de la barra de batería,
  que aparece ya llena. No hay escala en ningún sitio. Lo descartado: quitar
  también el escalonado, o quitarlo todo y que la Home aparezca de golpe.
- **D4 — Valores.**
  - Escalonado de 60 ms y desplazamiento de 12 px.
  - Muelle `{ duration: 250, dampingRatio: 1 }`, sin rebote: unos 375 ms
    reales (PL5).
  - Fundido de 250 ms ease-out.
  - La cascada completa dura unos 675 ms (300 ms de espera del último bloque
    más 375 ms).
  - Lo descartado: el preset del explore,
    `FadeInDown.springify().damping(16).stiffness(180)`. Con esa amortiguación
    rebota, y la skill expo-animation pide el muelle por `duration` y
    `dampingRatio`, sin rebote en lo que no viene de un gesto.
- **D5 — Alcance del fundido skeleton→contenido.** Solo la fila del resumen
  (R7). La gráfica semanal ya anima; recordatorios y hero quedan fuera (ver
  §Fuera de alcance). El criterio de `feature_list.json` "el Skeleton se
  desvanece en contenido" queda acotado a esa fila.
- **D6 — La barra de batería es UI nueva.** Va en línea, detrás del
  porcentaje, sobre una pista `bg-surface`, con relleno `bg-success`
  (> 60 %) o `bg-warning-strong` (≤ 60 %). El dato y el umbral son los
  mismos que los del texto. El contraste de la pista sobre `bg-default` en
  claro y en oscuro se valida en el smoke (R10, paso 5).

## Gate humano: smoke en dev build de Android

La feature no añade dependencias nativas ni cambia `app.json`, así que sirve
el dev build de Android actual sin regenerarlo. Nunca Expo Go. La prueba usa
la cuenta y la mascota habituales del smoke, con collar emparejado y batería
conocida.

1. **Entrada.** Arranca la app y entra en la Home. Los bloques (resumen,
   collar, accesos rápidos, actividad, recordatorios, última posición)
   aparecen en cascada de arriba abajo: cada uno sube unos 12 px mientras
   aparece. Ninguno rebota, y la cascada termina en menos de un segundo. El
   hero no se mueve.
2. **Volver a la tab.** Ve a otra tab y vuelve a la Home. No se repite nada.
3. **Volver al foco.** Abre el mapa desde "Última posición" y vuelve atrás.
   No se repite nada, aunque los datos se refresquen.
4. **Cambiar de mascota.** Con dos mascotas, pulsa la otra en el selector.
   Solo el collar y la última posición vuelven a entrar, y las cifras del
   resumen aparecen con un fundido al sustituir a su skeleton.
5. **Barra de batería.**
   - Al entrar en la Home, la barra se llena desde vacía hasta el porcentaje
     que muestra el texto: verde por encima del 60 % y ámbar en el 60 % o por
     debajo.
   - La pista se distingue de la tarjeta del collar en tema claro y en
     oscuro.
6. **Reduce motion.** Activa *Ajustes > Accesibilidad > Quitar animaciones*
   y repite el paso 1. Los bloques aparecen con fundido y en cascada, sin
   subir. La barra aparece ya llena. Desactívalo al terminar.
7. **Fluidez.** En el teléfono del smoke, la cascada y la barra no dan
   tirones, ni al arrancar en frío ni al volver de segundo plano.

- [ ] Smoke R10 superado por humano (fecha: ____, dispositivo: ____)

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-06, vía Notion: página 3f16115a-9b27-8135-a964-f9a857f75cd8, `page_last_edited_at` 2026-10-06T21:46:24.330Z) ← gate obligatorio antes de implementar

Al marcar esta casilla el humano firma también, explícitamente, las decisiones
D1-D6 con sus valores por defecto y la enmienda A21 a `docs/ui-guidelines.md`
(R2), que Codex escribe y que el humano aprueba marcando su propia casilla en
la sección de la enmienda.

## Enmienda E4 — cláusulas de R5, R7 y R8 sin candado

El reviewer rechazó #152 en `c7ac5ceb`
(`progress/review_mobile-home-motion-foundations.md` §Observaciones,
bloqueantes B1-B3). Antes de la firma, el reviewer pre-verificó el primer
borrador de esta enmienda con un barrido cláusula × rama × candado × sonda
(§Pre-verificación E4 (ronda 1b) del mismo fichero) y encontró cuatro
cláusulas más en la misma situación (H1-H4). Su segunda pre-verificación
(§Pre-verificación E4 (ronda 1c)) dio H1-H4 por cerrados y encontró tres más
(H5-H7): ramas de las mismas cláusulas que los candados de H2-H4 no
alcanzaban. La tercera (§Pre-verificación E4 (ronda 1d)) dio H5-H7 y X42 por
cerrados y encontró dos más (H8 y H9), de nuevo porque los candados de H6 y H7
se paraban antes que su cláusula. La producción cumple R5, R7 y R8.
El hueco está en las listas de `it` de esta spec, que candan cada cláusula en
una sola rama o en ninguna. Con cada una de estas mutaciones,
`src/screens/home/index.test.tsx` sigue en 192/192:

| Cláusula | Ramas sin candado | Mutaciones que pasan en verde |
|---|---|---|
| R5: «cada envoltorio se pinta exactamente bajo la misma condición que su bloque» | `selectedPetId` nulo, para los cuatro envoltorios que dependen de él. Y para `home-entrance-weekly`, los `kind` de la actividad que no son `ok` ni `error` | X2b, X2, X2c y X2d (envoltorio montado sin mascota). X21 (`kind !== 'error'` en vez de `=== 'ok'`) |
| R5: «`pet-hero-error` y `weekly-activity-day-map` siguen siendo hijos directos de `home-content`, sin envoltorio» | Las dos ramas: ningún test pinta esos nodos y mira su padre | X18 (`pet-hero-error` dentro de un `HomeEntrance`) y X17 (el botón del mapa dentro de un `HomeEntrance`) |
| R7: «igual con o sin reduce motion» | Con reduce motion | X1 (`entering={reduceMotion ? undefined : homeEntering(0, 0)}`) |
| R5: «cada envoltorio se pinta exactamente bajo la misma condición que su bloque» (H1) | `home-entrance-collar` y `home-entrance-last-position` con el detalle en `unauthorized`, `unreachable` o `missing-config`. El único candado usa `error` | X23u, X23a y X23m (envoltorio del collar vacío con ese `kind`). X24u, X24a y X24m (lo mismo con el de la última posición) |
| R5: «El hero (`PetHeroHeader`) y `home-states` no cambian» (H3) | Las dos: ningún test mira si reciben entrada | X27 (el hero dentro de un `HomeEntrance`) y X28 (`home-states` dentro de un `HomeEntrance`) |
| R7: «WHEN la fila del resumen sustituye a `summary-skeleton`» (H2) | La fila con la actividad en `no-tracking`, `error`, `unreachable` o `missing-config`. Los `it` de R7 usan `ok` | X25 (`entering` solo con `ok`) y X25w (`testID` solo con `ok`) |
| R8: «La barra no añade texto ni copy; el lector de pantalla sigue leyendo `collar-battery`» (H4) | Toda: nada mira lo que va detrás de la pista ni sus props de accesibilidad | X30t (un `<Text>` detrás de la pista) y X30a (`accessible` y `accessibilityLabel` en la pista) |
| R5: «El hero (`PetHeroHeader`), `pet-hero-error`, `home-states` y `weekly-activity-day-map` no reciben entrada» (H5) | Una entrada dentro de `pet-hero-error` o del botón del mapa, o en el propio nodo. Y el hero con alertas abiertas: E4.6 lo pinta sin `home-alerts-dot` | X18i y X18p (`pet-hero-error`), X17i y X17p (el botón del mapa), X27d (`home-alerts-dot` con entrada) |
| R7: «envuelve la fila desde fuera, sin `style` ni `className`» (H6) | Con los `kind` que no son `ok` y con reduce motion. E4.4 y E4.7 solo miran `entering` | X39s2, X39c, X39r2 y X39c2 (`style` o `className` en el reveal), X43s y X43r (otro hijo en el reveal), X44r (la fila cambia de clase) |
| R8: «La barra no añade texto ni copy; el lector de pantalla sigue leyendo `collar-battery`» (H7) | Un `<Text>` dentro del relleno, props de accesibilidad que no son `string` en la pista, y la fila agrupada con nombre propio | X30x, X30v, X30n y X37r |
| R7: «sus celdas siguen siendo sus hijos directos» (H8) | Con reduce motion. #69 R12 lo canda sin reduce motion y #77 R2 con los `kind` que no son `ok`; E4.10 solo mira la celda del peso | X45r (las tres celdas de `ok` dentro de un `View` solo bajo reduce motion) |
| R8: «el lector de pantalla sigue leyendo `collar-battery`» (H9) | Un ancestro por encima de la fila agrupado con nombre propio. E4.11 se para en la fila | X46c (`accessible` y `accessibilityLabel` en `collar-card`) y X46e (lo mismo en el `Animated.View` de `HomeEntrance`) |

R5, R7 y R8 no cambian, salvo una precisión de lectura en R7 (E4.12). Esta
enmienda solo añade los candados que les faltaban.

### E4.1 — R5 sin mascota seleccionada

**WHEN** se cierra #152, **THE SYSTEM SHALL** tener en
`describe('#152 R5: …')` el `it('no pinta ningún envoltorio sin mascota seleccionada')`.
Con `listPets` → `{ kind: 'ok', pets: [] }`, espera a `home-empty` y comprueba
que los seis envoltorios de la tabla de R5 están ausentes.

### E4.2 — `home-entrance-weekly` en cada `kind` que no es `ok`

**WHEN** se cierra #152, **THE SYSTEM SHALL** tener en el mismo describe un
`it.each` `no pinta el envoltorio de la actividad con $kind` con cuatro filas:
`no-tracking`, `unauthorized`, `unreachable` y `missing-config`. `error` ya
tiene su `it`. Cada fila espera a que `summary-card` esté visible **y**
`summary-skeleton` ausente en el mismo `waitFor`. Así sabe que hay mascota y
que la actividad ya llegó, sin depender de otro envoltorio. Después comprueba
`home-entrance-reminders` visible y `home-entrance-weekly` ausente.

Con un ancla más débil (`findByTestId('home-entrance-reminders')` y luego
`summary-skeleton` ausente), la espera pasa antes de que haya mascota si el
envoltorio de recordatorios se monta siempre. El leader lo midió en el spike
(sonda X2d, fila `unauthorized`).

### E4.3 — los dos nodos sin envoltorio

**WHEN** se cierra #152, **THE SYSTEM SHALL** tener en el mismo describe:

- `it.each` `deja el error del detalle ($kind) como hijo directo de home-content y sin entrada`,
  con dos filas de `getPet`: `{ kind: 'error' }` y
  `{ kind: 'unreachable', message: 'network down' }`, las dos ramas que pintan
  `pet-hero-error`. Comprueba que `(await findByTestId('pet-hero-error')).parent`
  es `toBe(getByTestId('home-content'))` y, desde E4.9, que
  `enteringIds(pet-hero-error)` es `toEqual([])`.
- `it('deja el botón del mapa del día como hijo directo de home-content y sin entrada')`.
  Con el arreglo de `setupHomeMotion`, pulsa `weekly-activity-day-2026-08-21`
  (el último día, es decir, hoy). Comprueba que
  `getByTestId('weekly-activity-day-map').parent` es `toBe(getByTestId('home-content'))`
  y, desde E4.9, que `enteringIds(weekly-activity-day-map)` es `toEqual([])`.

### E4.4 — R7 bajo reduce motion

**WHEN** se cierra #152, **THE SYSTEM SHALL** tener en
`describe('#152 R7: …')` el `it('funde igual bajo reduce motion')`. Hace lo
mismo que `funde sin espera ni desplazamiento`, pero con
`mockUseReducedMotion.mockReturnValue(true)` antes de renderizar, y comprueba
primero `entering` `toEqual(expect.any(Function))`. Así la sonda X1 cae por
aserción y no por `TypeError`.

### E4.5 — R5: collar y última posición con cada detalle fallido (H1)

**WHEN** se cierra #152, **THE SYSTEM SHALL** tener en
`describe('#152 R5: …')` un `it.each`
`no pinta los envoltorios del collar ni de la última posición con el detalle en $kind`
con tres filas de `getPet`: `{ kind: 'unauthorized' }`,
`{ kind: 'unreachable', message: 'network down' }` y
`{ kind: 'missing-config' }`. `error` ya tiene su `it`. Cada fila espera, en
el mismo `waitFor`, a `reminders-section` visible y a
`reminders-section-skeleton` ausente. Ese skeleton solo se pinta con el
detalle pendiente, así que la espera depende del dato que se prueba. Después
comprueba que `home-entrance-collar` y `home-entrance-last-position` están
ausentes.

### E4.6 — R5: el hero y `home-states` no reciben entrada (H3)

**WHEN** se cierra #152, **THE SYSTEM SHALL** tener en el mismo describe una
función `enteringIds(node)`. Recorre el árbol desde `screen.container` y
devuelve, en preorden, el `testID` de cada nodo que tiene `props.entering`. Y
estos `it`:

- `solo da entrada a los envoltorios, al fundido y al avatar del selector` —
  con `renderMotionHome`, `toEqual` exacto con
  `pet-avatar-fallback-pet-1`, `home-entrance-summary`, `summary-reveal`,
  `home-entrance-collar`, `home-entrance-quick-actions`,
  `home-entrance-weekly`, `home-entrance-reminders` y
  `home-entrance-last-position`. `pet-avatar-fallback-pet-1` es el
  `Avatar.Fallback` de heroui-native que pinta `pet-switcher.tsx` dentro del
  hero. Ya traía su propia entrada antes de #152: es el hero tal como estaba.
- `it.each` `no da entrada a home-states con %s`, con las tres ramas de
  `home-states`:
  - `home-loading`, con `listPets` pendiente. Espera `['home-loading']`: el
    `Skeleton` de heroui-native trae su propia entrada.
  - `home-error`, con `{ kind: 'error' }`. Espera `[]`.
  - `home-empty`, con `{ kind: 'ok', pets: [] }`. Espera `[]`.

Se recorre el árbol entero y no solo los ancestros. Una entrada dentro del
hero (X27i) o dentro de una sola rama de `home-states` (X28e, X28l) también
cambia lo que R5 dice que no cambia.

### E4.7 — R7: la fila funde igual con cada actividad (H2)

**WHEN** se cierra #152, **THE SYSTEM SHALL** tener en
`describe('#152 R7: …')` un `it.each`
`funde igual la fila con la actividad en $kind` con cuatro filas:
`{ kind: 'no-tracking' }`, `{ kind: 'error' }`,
`{ kind: 'unreachable', message: 'network down' }` y
`{ kind: 'missing-config' }`. Cada fila espera a `summary-reveal` con
`findByTestId`, porque aparece justo cuando llega la actividad. Después hace
las mismas comprobaciones que `funde igual bajo reduce motion`. Con
`unauthorized` la fila no se pinta (#77 R3).

### E4.8 — R8: la barra no añade texto ni nombre accesible (H4)

**WHEN** se cierra #152, **THE SYSTEM SHALL** tener en
`describe('#152 R8: …')` el
`it('no añade texto ni nombre accesible a la fila')`. Con `renderMotionHome`
comprueba dos cosas:

- `collar-battery-track` es `toBe` el último hijo de su fila.
- En la pista y en el relleno, las únicas props de tipo `string` son
  `testID` y `className`, en ese orden.

Así cae cualquier canal de copy: `accessibilityLabel`, `aria-label`,
`accessibilityHint` o un `<Text>` detrás de la pista.

### E4.9 — R5: ni `pet-hero-error`, ni el botón del mapa, ni el hero con alertas reciben entrada (H5)

**WHEN** se cierra #152, **THE SYSTEM SHALL**:

- Declarar `enteringIds` (E4.6) y una constante `homeEnteringIds` con la lista
  exacta de ocho de E4.6 **antes** de los `it` de E4.3, y usarla en el `it` de
  la lista exacta de E4.6.
- Comprobar en los `it` de E4.3 que `enteringIds` del propio nodo
  (`pet-hero-error` en sus dos filas, `weekly-activity-day-map` tras pulsar el
  día) es `toEqual([])`. `enteringIds` incluye el propio nodo, así que cae
  tanto una entrada dentro (X18i, X17i) como en el nodo (X18p, X17p).
- Tener en `describe('#152 R5: …')` el
  `it('no da entrada al hero con alertas abiertas')`. Con `listAlerts` →
  `{ kind: 'ok', items: [makeAlert()], nextCursor: null }` y
  `renderMotionHome`, espera a `home-alerts-dot` y comprueba que
  `enteringIds(screen.container)` es `toEqual(homeEnteringIds)`.

### E4.10 — R7: la fila sigue intacta con cada actividad y bajo reduce motion (H6)

**WHEN** se cierra #152, **THE SYSTEM SHALL** tener en
`describe('#152 R7: …')`, antes de los `it` de E4.4 y E4.7, una función
`expectRowUntouched(reveal)` con las cinco comprobaciones de
`envuelve la fila del resumen sin tocarla`:

- la fila (`summary-weight` → `.parent?.parent`) tiene `className` `'flex-row'`;
- su padre es `toBe(reveal)`;
- el único hijo no-`string` del reveal es la fila;
- `reveal.props.style` y `reveal.props.className` son `toBeUndefined()`.

`funde igual bajo reduce motion` y cada fila de
`funde igual la fila con la actividad en $kind` la llaman al final. Con los
`kind` que no son `ok`, `summary-weight` se pinta igual y su abuelo sigue
siendo la fila.

### E4.11 — R8: ningún canal de copy ni de accesibilidad en la barra (H7)

**WHEN** se cierra #152, **THE SYSTEM SHALL** ampliar el `it` de E4.8 con:

- `collar-battery-fill` sin hijos: `fill.children` es `toEqual([])`;
- en la pista, en el relleno y en la fila (`track.parent`), ninguna prop cuyo
  nombre case con `/^(accessib|aria-|role$|importantForAccessibility)/`.

En producción no hay ninguna: la pista lleva `testID`, `className` y
`children`; el relleno, `testID`, `className`, `style` y las props del mock
de Reanimated; la fila, `className` y `children`. Así caen también los canales
que no son `string` (`accessibilityValue`, `accessible`) y la fila agrupada
con nombre propio, que haría que el lector la leyese a ella en vez de
`collar-battery`.

### E4.12 — R7: el skeleton no estrena fundido de salida (X42)

R7 dice «El skeleton se desmonta en el acto, sin fundido cruzado». Leída al
pie de la letra no la cumplía la producción ni antes de #152: el `Skeleton`
de heroui-native trae de serie `entering` FadeIn y `exiting` FadeOut
(`skeleton.animation.js`). Se lee así: **#152 no envuelve `summary-skeleton`
ni le añade un fundido de salida propio**; el de heroui-native queda fuera.

**WHEN** se cierra #152, **THE SYSTEM SHALL** tener en
`describe('#152 R7: …')` el
`it('monta el skeleton directamente en la tarjeta, sin fundido de salida propio')`.
Con la actividad pendiente comprueba que
`(await findByTestId('summary-skeleton')).parent` es
`toBe(getByTestId('summary-card'))`.

### E4.13 — R7: las celdas siguen siendo hijos directos bajo reduce motion (H8)

**WHEN** se cierra #152, **THE SYSTEM SHALL** ampliar
`funde igual bajo reduce motion` (E4.4). Detrás de `expectRowUntouched(reveal)`
comprueba que los hijos no-`string` de la fila (`summary-weight` →
`.parent?.parent`) son `toEqual` a los padres de `summary-weight`,
`summary-activity`, `summary-sleep` y `summary-distance`, en ese orden. Así
cae un envoltorio de las celdas que solo aparezca con reduce motion (X45r).

### E4.14 — R8: ningún ancestro de la barra agrupa la fila (H9)

**WHEN** se cierra #152, **THE SYSTEM SHALL** ampliar el `it` de E4.8 con un
recorrido por `.parent` desde `collar-battery` hasta la raíz del árbol. Ningún
nodo del camino tiene una prop cuyo nombre case con la regex de E4.11. El
bucle de E4.11 se queda para la pista y el relleno, que no son ancestros.

El recorrido no se para en `home-content`: la cláusula vale para cualquier
ancestro, y un nombre propio en `home-content` o en `screen-home` también
haría que el lector leyese ese nodo en vez de `collar-battery`. En producción
ningún nodo del camino tiene una prop que case: `collar-battery`, la fila,
`collar-card`, `home-entrance-collar`, `home-content`, `screen-home` y los
nodos por encima. Caen X46c, X46e y, además, X46h y X46s (nombre propio en
`home-content` y en `screen-home`) y X37l (`accessibilityLabel` en el propio
`collar-battery`).

### Cifras y alcance

Las ediciones literales, los mensajes de commit y la mutación del rojo están
en `progress/handoff_mobile-home-motion-foundations.md` §Enmienda E4. El
leader las verificó en un worktree desechable sobre `f2bc714c`, cuyo `src/` es
el de `c7ac5ceb`:

- **Verde:**
  - `index.test.tsx`: 215/215.
  - Jest móvil entero: 96 suites / 2232 tests.
  - typecheck y lint: exit 0.
- **Rojo** (con la mutación de sonda en `index.tsx` y
  `collar-battery-bar.tsx`):
  - `index.test.tsx`: exactamente los 23 `it` nuevos fallan y 192 pasan, todos
    por aserción.
  - typecheck y lint: exit 0.
  - design-drift, legibility-classnames y consistency-classnames: 144/144.
    ui-language: 30/30.
- **Sondas:**
  - Las ocho de la ronda 1 caen por aserción (el reviewer lo verificó en la
    ronda 1b).
  - Las doce de H1-H4 y seis variantes del leader (X25d, X27i, X28e, X28l,
    X30h y X30f) caen una a una. Diecisiete caen por aserción.
  - X25w cae por consulta: `findByTestId` no encuentra el `testID`. Es el
    rojo esperado para esa sonda.
  - Las dieciséis de H5-H7 y X42 caen una a una, todas por aserción.
  - Las seis de H8-H9 (X45r, X46c, X46e, X46h, X46s y X37l) caen una a una,
    todas por aserción.

Cifras:

- `index.test.tsx`: de 192 a **215**. E4.1 suma 1, E4.2 suma 4, E4.3 suma 3,
  E4.4 suma 1, E4.5 suma 3, E4.6 suma 4, E4.7 suma 4, E4.8 suma 1, E4.9 suma 1
  y E4.12 suma 1. E4.10, E4.11, E4.13 y E4.14 amplían `it` que ya existían.
- Comparación de cierre con la base: de 320 a **343**.
- Jest móvil: de 2209 a **2232**.
- La lista cerrada no cambia: sigue en 11 ficheros. E4 toca solo
  `index.test.tsx`, `index.tsx` y `collar-battery-bar.tsx`. Los dos últimos
  vuelven en el verde a su contenido de `c7ac5ceb`.

- [ ] Enmienda E4 aprobada por humano (fecha: ____, en el chat del leader; commit de firma: el que marca esta casilla)
