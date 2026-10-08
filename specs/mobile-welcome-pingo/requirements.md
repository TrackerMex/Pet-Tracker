---
feature: "mobile-welcome-pingo"
status: approved     # draft | approved
tags: [harness, spec, mobile, ui-delight]
---

# Requisitos — [[mobile-welcome-pingo]] (#153)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.

## Contexto

La bienvenida de #118 (`mobile-pet-tracker/src/screens/welcome/index.tsx`) es
lo primero que ve quien abre la app sin sesión: `src/app/index.tsx` redirige a
`/welcome` cuando `status === 'unauthenticated'`. Hoy pinta, en este orden, el
logo `splash-icon.png` a 160×160 (`welcome-hero`), la marca, tres chips, el
tagline, dos CTA y el aviso legal, y entra con un fundido de 240 ms.

Esta feature es la candidata B de `progress/explore_ui-delight-appllama.md` §4,
un fichero que vive en `origin/feature/152-mobile-home-motion-foundations` y
que se lee con `git show 36f91e6e:progress/explore_ui-delight-appllama.md`. Lo
que hace:

- sustituye el logo por una **escena con Pingo**, la mascota, y un bocadillo
  que habla con su voz;
- da **cuerpo** al CTA primario con un labio inferior;
- hace que Pingo entre, flote y parpadee, con las constantes de movimiento
  que crea #152 en `src/theme/motion.ts`;
- escribe la voz de Pingo en `docs/ui-guidelines.md`.

La referencia visual es el artboard «Bienvenida» del canvas aprobado el
2026-10-06 (`https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j`), copiado en
`specs/mobile-welcome-pingo/design-src/welcome.dc.html`. **Es referencia y no
fuente.** Su copy no está aprobado y su mascota es provisional
(`design-src/README.md`). Lo que el canvas tiene y esta spec no pinta está en
§Fuera de alcance.

**Base congelada.** El código de la app se lee en `66aaf981` (origin/main del
2026-10-07). Las constantes de #152 se leen en `36f91e6e`, un commit de la
rama de #152 que solo contiene la spec y el progreso: el código de #152 aún no
existe en ningún commit. Por eso la implementación **espera al merge de #152**
(design.md §Dependencia de #152). Al mergear, el leader revisa esta spec contra
main y, si algo cambió, la enmienda y reabre el gate solo para las enmiendas.

## Decisiones del humano

Relatadas por el leader de la sesión Backend el 2026-10-07 al leader de la
sesión Frontend, que se las pasó al spec_author. Las frases entre comillas
latinas son literales del humano.

- **D1 (2026-10-07). Nombre y voz.** «el nombre de la mascota va hacer Pingo y
  el tono de voz va hacer B guardian sereno». La voz B se escribe en la carta
  (R2) y rige el copy nuevo (R1).
- **D2. Poses.** El humano generó 12 poses PNG de 1024×1024 RGBA en
  `/home/claude/pet-tracker-mascot/`, y el leader de Backend las validó:
  transparencia, escala, antena y ausencia de marcas. Son 00-base, 01-wave,
  01-wave-blink, 02-talk, 03-celebrate-v2, 04-sleep, 05-search, 06-collar,
  07-health, 08-food, 09-clipboard y 10-worried-v2. Las v1 de celebrate y
  worried quedan descartadas. **Las poses entran al repo como WebP.** Esta
  spec mete solo las dos que pinta la bienvenida (R3); si deben entrar las
  doce, lo decide el humano en el gate (pregunta G1).
- **D3 (2026-10-07). Técnica.** «Reanimated + PNG». Sin Rive, sin Lottie y sin
  dependencias nuevas (R13).
- **D4 (2026-10-07). CTA con cuerpo.** Va «solo en welcome y celebraciones».
  El `Button` global de heroui no cambia: el labio se declara en el sitio de
  uso (R7).
- **D5 (onboarding antes del registro) y D6 (hero con frase del día).**
  Siguen abiertas y quedan fuera de alcance.
- **Nota sobre el nombre.** «Pingo» tiene otro significado coloquial en
  España. El humano lo eligió sabiéndolo, y la búsqueda en el IMPI la hace él.
  Esta spec no la exige ni la registra.

## Copy final (en/es)

Una sola clave nueva. Las ocho de #118 (`welcome.brand`, `welcome.chipGps`,
`welcome.chipHealth`, `welcome.chipNutrition`, `welcome.tagline`,
`welcome.getStarted`, `welcome.haveAccount` y `welcome.legalNotice`) no
cambian ni de nombre ni de valor.

| Clave | `en` | `es` |
|---|---|---|
| `welcome.pingoGreeting` | `Hi, I'm Pingo. I'll help you know where your pet is and how they're doing.` | `Hola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.` |

Cómo cumple la voz B (R2):

- habla en primera persona;
- en español tutea;
- termina en punto, porque un saludo no celebra;
- no lleva emoji;
- en inglés usa registro neutro.

No usa `{{petName}}` porque sin sesión todavía no hay mascota.

El literal entra al catálogo, a los tests y a la tabla de
`specs/mobile-ui-language/design.md` **byte a byte como está en esta tabla**:

- el apóstrofo es el ASCII `'` (U+0027);
- los acentos son los precompuestos (`á` es U+00E1);
- no hay espacio final.

El canvas decía «¡Guau! Soy [NOMBRE]». No se usa, porque lleva una
exclamación sin celebrar nada y no está aprobado. Si el humano quiere otra
frase, la cambia aquí en el gate, y con ella cambian R1 y la fila de §2.20.

## Requisitos funcionales

Convenciones de todos los requisitos:

- **Rutas.** Las rutas sin prefijo cuelgan de `mobile-pet-tracker/`. «El test
  de la bienvenida» es `mobile-pet-tracker/src/screens/welcome/index.test.tsx`.
- **Nombres de describe.** Los describes nuevos se llaman `#153 R<n>: …`, para
  no chocar con los `R3`…`R10` desnudos de #118 que ya viven en ese fichero.
- **Comentarios.** En el código de producción, toda cita a esta feature se
  escribe `#153 R<n>`. Un `#153` suelto lo caza `HEX_LITERAL` de
  `src/__tests__/design-drift.test.ts` como si fuera un color.
- **Literales.** Todo valor que un test comprueba se escribe en el test como
  literal. Ningún test compara contra un símbolo importado de producción.

### R1 — El saludo de Pingo existe en los dos idiomas

THE SYSTEM SHALL declarar la clave `welcome.pingoGreeting` en los objetos `en`
y `es` de `src/i18n/catalog.ts`, con los literales de §Copy final, en la línea
siguiente a `'welcome.legalNotice': …` de cada idioma. La bienvenida la
resuelve con `t('welcome.pingoGreeting')` una sola vez.

Observable en el test de la bienvenida, describe
`#153 R1: el saludo de Pingo existe en los dos idiomas`. Importa `en` y `es`
de `'../../i18n/catalog'` y tiene estos `it`:

- `declara el saludo en inglés y en español`:
  - `en['welcome.pingoGreeting']` es
    `'Hi, I\'m Pingo. I\'ll help you know where your pet is and how they\'re doing.'`;
  - `es['welcome.pingoGreeting']` es
    `'Hola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.'`.
- `no exclama ni lleva emoji en ningún idioma`: ninguno de los dos valores
  casa con `/[!¡]/` ni con `/\p{Extended_Pictographic}/u`.
- `pinta el saludo en el bocadillo en español`: con `renderWelcome('es')`,
  `screen.getByText('Hola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.').props.testID`
  es `'welcome-bubble-text'`.
- `pinta el saludo en el bocadillo en inglés`: con `renderWelcome('en')`,
  `screen.getByText('Hi, I\'m Pingo. I\'ll help you know where your pet is and how they\'re doing.').props.testID`
  es `'welcome-bubble-text'`.
- `registra la clave en la tabla de mobile-ui-language`:
  - lee `join(process.cwd(), '..', 'specs', 'mobile-ui-language', 'design.md')`;
  - contiene `### §2.20 — Añadidos por #153 — Pingo en la bienvenida`;
  - casa con
    `new RegExp('\\| — \\| `welcome\\.pingoGreeting`[^\\n]*← añadida por #153 \\(R1\\)')`.

La fila nueva de `specs/mobile-ui-language/design.md` va en una subsección
`### §2.20 — Añadidos por #153 — Pingo en la bienvenida`. Esa subsección se
coloca tras la tabla de §2.19 y antes de `## 3. La infraestructura`, con las
mismas columnas que §2.19:

```
| # | Clave | `en` | `es` | Origen |
|---|---|---|---|---|
| — | `welcome.pingoGreeting` | `Hi, I'm Pingo. I'll help you know where your pet is and how they're doing.` | `Hola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.` | ← añadida por #153 (R1) |
```

Además, la clave nueva mueve tres candados de catálogo (design.md §Candados
existentes que se mueven, filas C1 a C3):

- el recuento de `language-provider.test.tsx`;
- la fila nueva de `R16_WELCOME`;
- el título del `it` que la cuenta.

### R2 — La voz de Pingo queda escrita en la carta

THE SYSTEM SHALL añadir a `docs/ui-guidelines.md`, §Dirección de arte, un
punto 7. Va inmediatamente antes de la línea
`## Checklist de autocrítica (cierra toda pantalla nueva o modificada)`, es
decir, tras los tres corolarios del punto 6 «Idioma». Su texto es exactamente
este:

```
**7. Voz de Pingo: guardián sereno.** Decidido por el humano el 2026-10-07
(D1 de la feature #153): la mascota se llama **Pingo** y habla con la voz B,
«guardián sereno». Rige todo texto que la app pone en boca de Pingo
(bocadillos, estados vacíos, celebraciones, avisos); el resto del copy sigue el
punto 6 sin más. Cada frase nueva de Pingo entra con su clave en los dos
idiomas, como cualquier otra copy.

- **Tono:** tranquilo y cálido; da seguridad. En español, tutea.
- **Persona:** Pingo habla en primera persona («te ayudo», «te recomiendo») y
  llama a la mascota del usuario por su nombre, con el marcador `{{petName}}`.
- **Sin emoji**, en ningún idioma.
- **Exclamaciones solo para celebrar.** Un saludo, un aviso o un estado vacío
  terminan en punto.
- **Sin bromas en las alertas.** Una alerta de Pingo dice qué pasa y qué hacer.
- **En inglés, registro neutro.**
- **Bucles de reposo.** Flotar y parpadear son las únicas animaciones
  continuas de Pingo, y una excepción declarada a §Animación: animan
  `translateY` y `opacity` con timing y duraciones fuera de 150/250/400,
  porque no entran, ni salen, ni responden a un gesto. Sus constantes viven en
  `src/theme/motion.ts` y no arrancan con reduce motion.
```

Las cuatro frases de muestra que el humano relató para la voz (§Decisiones del
humano) **no** entran en la carta: orientan el tono y no son copy aprobado.

Observable en el test de la bienvenida, describe
`#153 R2: la carta escribe la voz de Pingo`. El describe lee
`join(process.cwd(), '..', 'docs', 'ui-guidelines.md')` y tiene estos `it`:

- `declara el punto 7 tras el punto 6 y antes del checklist`:
  - el índice de `**7. Voz de Pingo: guardián sereno.**` es mayor que el de
    `**6. Idioma:`;
  - y es menor que el de `## Checklist de autocrítica`;
  - las tres cadenas aparecen una sola vez en la carta.
- `fija las reglas de la voz`: la carta contiene cada una de estas cadenas:
  - `- **Sin emoji**, en ningún idioma.`
  - `- **Exclamaciones solo para celebrar.**`
  - `- **Sin bromas en las alertas.**`
  - `- **En inglés, registro neutro.**`
  - `` con el marcador `{{petName}}` ``
- `declara la excepción de los bucles de reposo`: la carta contiene
  `- **Bucles de reposo.**` y `` `src/theme/motion.ts` y no arrancan con reduce motion. ``

### R3 — Las dos poses de la bienvenida entran como WebP

THE SYSTEM SHALL añadir a `assets/images/` exactamente dos ficheros nuevos:

- `pingo-wave.webp`, que es `mascot-01-wave.png`;
- `pingo-wave-blink.webp`, que es `mascot-01-wave-blink.png`.

Los dos salen de `/home/claude/pet-tracker-mascot/` convertidos con el
comando de design.md §Assets. Cada uno es un WebP con canal alfa de
1024×1024 y pesa como mucho 100 000 bytes. Ninguna otra pose ni ningún PNG de
la mascota entra al repo. `assets/images/splash-icon.png` se queda, porque lo
siguen usando `src/app/index.tsx` y el splash.

Observable en el test de la bienvenida, describe
`#153 R3: las poses entran como WebP`, con
`it.each(['pingo-wave.webp', 'pingo-wave-blink.webp'])` y el título
`%s es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes`. Lee el
fichero con
`readFileSync(join(process.cwd(), 'assets', 'images', name))` y comprueba,
sobre los bytes:

- `toString('ascii', 0, 4)` es `'RIFF'`;
- `toString('ascii', 8, 12)` es `'WEBP'`;
- `toString('ascii', 12, 16)` es `'VP8X'`, la cabecera extendida que Pillow
  escribe para RGBA;
- `(bytes[20] & 0x10) !== 0`, el bit de alfa de VP8X;
- `bytes.readUIntLE(24, 3) + 1` es `1024`, el ancho;
- `bytes.readUIntLE(27, 3) + 1` es `1024`, el alto;
- `bytes.length` es como mucho `100000`.

Un segundo `it`, `no mete otras poses de Pingo`, comprueba que
`readdirSync(join(process.cwd(), 'assets', 'images')).filter((name) => /^(pingo|mascot)-/.test(name)).sort()`
es `['pingo-wave-blink.webp', 'pingo-wave.webp']`.

### R4 — Las constantes de Pingo viven en `motion.ts`

THE SYSTEM SHALL añadir a `src/theme/motion.ts`, el módulo que crea #152, estas
cinco constantes, y ninguna más:

| Símbolo | Valor exacto |
|---|---|
| `MOTION_ENTRANCE_SCALE` | `0.9` |
| `MOTION_FLOAT_OFFSET_Y` | `4` |
| `MOTION_FLOAT_TIMING` | `{ duration: 1200, easing: Easing.bezier(0.37, 0, 0.63, 1), reduceMotion: ReduceMotion.System }` |
| `MOTION_BLINK_INTERVAL_MS` | `4000` |
| `MOTION_BLINK_TIMING` | `{ duration: 0, reduceMotion: ReduceMotion.System }` |

Qué es cada una:

- `MOTION_FLOAT_TIMING` es medio ciclo de la flotación. El ciclo completo dura
  2,4 s, el `float 3s` del canvas recortado al ±4 px y 2,4 s de
  `explore_ui-delight-appllama.md` §4. La curva es la sinusoidal ease-in-out
  escrita como bezier, para que el doble de `Easing.bezier` que ya usa
  `motion.test.ts` la compare con un literal.
- `MOTION_BLINK_TIMING` es el cambio instantáneo de pose del parpadeo.
- El ojo cerrado dura `MOTION_FEEDBACK_MS` (150, de #152), que se reutiliza
  sin redeclararlo.

Observable en `src/theme/__tests__/motion.test.ts`, describe nuevo
`#153 R4: las constantes de Pingo viven en motion.ts`, con estos `it`:

- `declara la escala de entrada y el recorrido de la flotación`: `0.9` y `4`.
- `declara medio ciclo de flotación ease-in-out`: `toEqual` con
  `{ duration: 1200, easing: { bezier: [0.37, 0, 0.63, 1] }, reduceMotion: ReduceMotion.System }`.
- `declara el intervalo y el cambio instantáneo del parpadeo`: `4000`, y
  `toEqual` con `{ duration: 0, reduceMotion: ReduceMotion.System }`.

En ese mismo fichero, el `it` `no exporta nada más` del describe
`#152 R1: las duraciones y el preset de movimiento viven en un solo sitio`
pasa de la lista literal de ocho nombres a la de trece: los ocho de #152 más
los cinco de la tabla, todo ordenado alfabéticamente (design.md
§Candados existentes que se mueven, fila C4).

### R5 — La escena de Pingo sustituye al logo

THE SYSTEM SHALL pintar dentro de `welcome-content` exactamente siete hijos,
en este orden:

1. `welcome-scene`
2. `welcome-chips`
3. `welcome-brand`
4. `welcome-tagline`
5. `welcome-get-started`
6. `welcome-have-account`
7. `welcome-legal`

Es el orden del canvas: escena, chips, marca, tagline, CTA y aviso legal.
`welcome-hero` desaparece de la bienvenida, y con él su
`require('../../../assets/images/splash-icon.png')`.

La escena y el bocadillo son el `Card` compartido, importado de
`'../../components/card'`. Así heredan `rounded-card` y `CONTINUOUS_CORNER`
sin declararlos en la pantalla:

| Nodo | Componente | Props exactas | Hijos, en orden |
|---|---|---|---|
| `welcome-scene` | `Card` | `variant="secondary"`, `className="w-full items-center gap-3 py-6"` | `welcome-bubble`, `welcome-pingo` |
| `welcome-bubble` | `Card` | `variant="surface"`, `className="px-4 py-3"` | `welcome-bubble-text` |
| `welcome-bubble-text` | `Text` de `react-native` | `className="text-center text-sm font-semibold text-foreground"`; su único hijo es `t('welcome.pingoGreeting')` | — |

`welcome-chips`, `welcome-brand`, `welcome-tagline`, `welcome-have-account` y
`welcome-legal` no cambian ni de props ni de hijos: siguen cerrados por los
`it` de #118 que ya los comprueban.

Observable en el test de la bienvenida, describe
`#153 R5: la escena de Pingo sustituye al logo`, con estos `it`:

- `apila la escena y los seis bloques de #118 en orden`:
  `screen.getByTestId('welcome-content').children` tiene longitud 7, y sus
  `props.testID` son la lista de arriba.
- `ya no pinta el logo`: `screen.queryByTestId('welcome-hero')` es `null`, y
  `readSource('screens/welcome/index.tsx')` no contiene `splash-icon`.
- `pinta la escena como card secundaria con el bocadillo y Pingo`:
  - `props.className.split(' ')` de `welcome-scene` es
    `expect.arrayContaining(['rounded-card', 'bg-surface-secondary', 'w-full', 'items-center', 'gap-3', 'py-6'])`;
  - los `props.testID` de sus `children` son `['welcome-bubble', 'welcome-pingo']`.
- `pinta el bocadillo como card de superficie con el saludo`:
  - `props.className.split(' ')` de `welcome-bubble` es
    `expect.arrayContaining(['rounded-card', 'bg-surface', 'shadow-sm', 'px-4', 'py-3'])`;
  - sus `children` son uno solo, con `props.testID` `'welcome-bubble-text'`;
  - `welcome-bubble-text` tiene `props.className`
    `'text-center text-sm font-semibold text-foreground'`.

El `it` de #118 `R5 > apila los siete bloques en orden` y el de
`R5 > pinta hero, marca, tagline y legal con sus clases` cambian (design.md
§Candados existentes que se mueven, filas C5 y C6).

### R6 — Pingo se pinta con su pose y una capa de parpadeo encima

THE SYSTEM SHALL pintar `welcome-pingo` como un `Animated.View` con
`style={[pingoStyle, { width: 200, height: 200 }]}` y dos hijos, en este
orden:

1. `welcome-pingo-wave`, un `Image` de `expo-image` con
   `source={require('../../../assets/images/pingo-wave.webp')}`,
   `style={{ width: 200, height: 200 }}` y `contentFit="contain"`;
2. `welcome-pingo-blink`, un `Animated.View` con
   `style={[blinkStyle, { position: 'absolute', top: 0, left: 0 }]}`. Su único
   hijo es `welcome-pingo-blink-image`, otro `Image` de `expo-image` con
   `source={require('../../../assets/images/pingo-wave-blink.webp')}`,
   `style={{ width: 200, height: 200 }}` y `contentFit="contain"`.

Las dos imágenes son decorativas, porque el sentido lo lleva el bocadillo:
ninguna declara `accessibilityLabel`. `pingoStyle` y `blinkStyle` se definen
en R9 a R11.

Observable en el test de la bienvenida, describe
`#153 R6: Pingo se pinta con su pose y su capa de parpadeo`, con estos `it`:

- `deja en Pingo la pose y la capa de parpadeo, en ese orden`:
  - los `props.testID` de los `children` de `welcome-pingo` son
    `['welcome-pingo-wave', 'welcome-pingo-blink']`;
  - los de `welcome-pingo-blink` son `['welcome-pingo-blink-image']`.
- Un `it.each` con dos filas y el título
  `%s pinta su pose a 200×200, sin etiqueta de accesibilidad`. Cada fila es
  `[testID, patrón]`:
  - `['welcome-pingo-wave', /assets\/images\/pingo-wave\.webp$/]`;
  - `['welcome-pingo-blink-image', /assets\/images\/pingo-wave-blink\.webp$/]`.

  Para cada fila comprueba:
  - `props.style` es `{ width: 200, height: 200 }`;
  - `props.contentFit` es `'contain'`;
  - `props.source` es
    `[expect.objectContaining({ testUri: expect.stringMatching(patrón) })]`,
    la forma con que #118 ya comprueba `welcome-hero`;
  - `props.accessibilityLabel` es `undefined`.
- `coloca la capa de parpadeo encima de Pingo, cerrada`: sin avanzar timers,
  `getAnimatedStyle(screen.getByTestId('welcome-pingo-blink'))` hace
  `toEqual` con `{ position: 'absolute', top: 0, left: 0, opacity: 0 }`.
  `getAnimatedStyle` se importa de `'react-native-reanimated'`, que lo exporta
  desde sus `jestUtils`. Devuelve el estilo en línea y el animado mezclados,
  así que `toEqual` cierra todas las claves.

### R7 — El CTA primario tiene cuerpo

THE SYSTEM SHALL declarar en el `Button` `welcome-get-started` la clase exacta
`w-full rounded-xl bg-accent border-b-4 border-black/25`, sin cambiar su
`Button.Label` (`font-bold text-accent-foreground`) ni su destino. WHEN el
usuario lo pulsa THE SYSTEM SHALL llamar una vez a `router.push('/register')`
y ninguna a `router.replace`, como en #118.

El labio sale de cómo pinta React Native un borde: el fondo `bg-accent`
también ocupa el área del borde, y un borde inferior negro al 25 % lo
oscurece en una franja de 4 px. Como `accent` vale `#178255` en los dos temas,
el labio sale en torno a `#11613F` en claro y en oscuro. El canvas lo pide
`#0E5E3C` en claro y `#0B4D31` en oscuro. No se crea ningún token, ningún
`View` ni ningún `CONTINUOUS_CORNER`. Por D4, el `Button` de heroui no
cambia: el labio vive en el sitio de uso. El CTA secundario no lleva labio.

Observable en dos sitios del test de la bienvenida:

1. En el `it` de #118 `R7 > es el botón primario del repo`, el `toBe` de
   `className` pasa de `'w-full rounded-xl bg-accent'` a
   `'w-full rounded-xl bg-accent border-b-4 border-black/25'` (design.md
   §Candados existentes que se mueven, fila C7). El resto del `it` no cambia,
   ni tampoco el `it` `R7 > empuja a registro sin reemplazar`.
2. En el describe nuevo `#153 R7: el CTA primario tiene cuerpo`, con estos
   `it`:
   - `declara el labio en el CTA primario`: el `props.className` de
     `welcome-get-started` es
     `'w-full rounded-xl bg-accent border-b-4 border-black/25'`, y el de
     `screen.getByText('Comenzar ahora')` es
     `'font-bold text-accent-foreground'`, con `renderWelcome('es')`.
   - `deja el CTA secundario sin labio`: el `props.className` de
     `welcome-have-account` no contiene `border-b-4` ni `border-black`.

### Cómo se prueba el movimiento (rige R8 a R12)

- **Dobles de Reanimated.** El `jest.mock('react-native-reanimated', …)` del
  test de la bienvenida ya hace `...actual` y sustituye `useReducedMotion`.
  Añade un doble más, y ninguno otro:
  `withRepeat: jest.fn((animation: unknown) => animation)`. Es el doble de
  `src/components/__tests__/pet-hero-header.test.tsx`. Con él, cada bucle
  corre **una sola pasada real** y se para: la flotación sube una vez y el
  parpadeo cierra y abre una vez. La repetición se comprueba en los
  argumentos de la llamada, no en el tiempo.

  `withTiming`, `withSpring`, `withSequence`, `withDelay` y `cancelAnimation`
  se quedan reales.
- **Contadores.** El `beforeEach` global del fichero ya hace
  `jest.clearAllMocks()` y `mockUseReducedMotion.mockReturnValue(false)`.
  Por eso `mockWithRepeat` empieza en cero llamadas en cada `it`, y reduce
  motion empieza desactivado. El alias se declara a nivel de fichero, después
  de los imports: `const mockWithRepeat = jest.mocked(withRepeat);`, con
  `withRepeat` importado de `'react-native-reanimated'`.
  Todos los `it` de R8 a R12 renderizan con `await renderWelcome()`, que usa español por defecto.
- **Lectura.** Los estilos se leen con `getAnimatedStyle` de
  `'react-native-reanimated'` y `toEqual`, o con `toHaveAnimatedStyle(…, { shouldMatchAllProps: true })`.
  Nunca se usa `toHaveAnimatedStyle` sin esa opción.
- **Timers.** Los `it` que avanzan el tiempo usan `jest.useFakeTimers()` en
  `beforeEach`, `jest.useRealTimers()` en `afterEach` y
  `await act(async () => { jest.advanceTimersByTime(ms); })`, como el describe
  `R10` de #118.
- **Ventanas.** Cada ventana declara de dónde sale:
  - un muelle de `MOTION_SETTLE_SPRING` tarda unas 1,5 × 250 ms en asentarse
    (PL5 de #152), y la ventana de 1000 ms le da más del doble;
  - la flotación dura 1200 ms, y la ventana de 2000 ms le da 800 de margen;
  - los puntos de control del parpadeo dejan al menos 50 ms a cada lado del
    cambio esperado.

  **Si un test necesita más margen, se amplía la ventana y nunca la
  aserción.**
- **Fuente.** Las comprobaciones sobre el código leen
  `readSource('screens/welcome/index.tsx')` y usan expresiones que toleran el
  salto de línea de prettier: `\s*` tras cada `(` y cada `,`, y `,?\s*` antes
  de cada `)`. Cada expresión se escribe tal cual en el test y se cuenta con
  `(source.match(re) ?? []).length`.

### R8 — El contenido entra con las constantes de `motion.ts`

THE SYSTEM SHALL animar `welcome-content` así:

- **Opacidad.** Parte de `useSharedValue(0)` y, al montar, recibe
  `opacity.set(withTiming(1, MOTION_FADE_TIMING))`, haya o no reduce motion.
  `MOTION_FADE_TIMING` lleva `ReduceMotion.Never`.
- **Desplazamiento.** Parte de
  `useSharedValue(reduceMotion ? 0 : MOTION_ENTRANCE_OFFSET_Y)`, con
  `reduceMotion = useReducedMotion()` como en #118.
  - WHILE reduce motion está desactivado, al montar recibe
    `translateY.set(withSpring(0, MOTION_SETTLE_SPRING))`.
  - WHILE reduce motion está activo, no recibe ninguna animación y se queda
    en 0.
- **Estilo.** `style={[entranceStyle, { alignItems: 'center', gap: 16 }]}`
  no cambia.
- **Exports retirados.** `WELCOME_ENTRANCE_MS` y `WELCOME_ENTRANCE_EASING` se
  borran. El módulo `src/screens/welcome/index.tsx` exporta solo
  `WelcomeScreen`. Su código no declara ninguna clave `duration:`, `easing:`
  ni `reduceMotion:`, e importa sus constantes de `'../../theme/motion'`.

El describe `R10` de #118 se sustituye entero por este (design.md §Candados
existentes que se mueven, fila C8).

Observable en el test de la bienvenida, describe
`#153 R8: el contenido entra con las constantes de motion.ts`, con estos `it`:

- `exporta solo la pantalla`: `Object.keys(require('./index'))` es
  `['WelcomeScreen']`.
- `usa el fundido y el muelle de motion.ts`. Sobre la fuente, cada una de
  estas expresiones casa exactamente una vez:
  - `/opacity\.set\(\s*withTiming\(\s*1,\s*MOTION_FADE_TIMING,?\s*\),?\s*\)/g`
  - `/translateY\.set\(\s*withSpring\(\s*0,\s*MOTION_SETTLE_SPRING,?\s*\),?\s*\)/g`
  - `/useSharedValue\(\s*reduceMotion \? 0 : MOTION_ENTRANCE_OFFSET_Y,?\s*\)/g`
  - `/from '\.\.\/\.\.\/theme\/motion'/g`

  Y estas casan cero veces:
  - `/\b(?:duration|easing|reduceMotion):/g`
  - `/WELCOME_ENTRANCE_/g`
- `arranca invisible y desplazado 12 puntos sin reduce motion`: sin avanzar
  timers, `welcome-content` tiene
  `toHaveAnimatedStyle({ alignItems: 'center', gap: 16, opacity: 0, transform: [{ translateY: 12 }] }, { shouldMatchAllProps: true })`.
- `termina visible y en su sitio sin reduce motion`: tras 1000 ms,
  `{ alignItems: 'center', gap: 16, opacity: 1, transform: [{ translateY: 0 }] }`
  con la misma opción.
- `con reduce motion aparece sin desplazarse`: con
  `mockUseReducedMotion.mockReturnValue(true)`,
  - a 0 ms vale `{ alignItems: 'center', gap: 16, opacity: 0, transform: [{ translateY: 0 }] }`;
  - tras 1000 ms vale `{ alignItems: 'center', gap: 16, opacity: 1, transform: [{ translateY: 0 }] }`.

### R9 — Pingo entra con un muelle de escala

THE SYSTEM SHALL definir:

```
pingoStyle = useAnimatedStyle(() => ({
  transform: [{ translateY: pingoFloatY.get() }, { scale: pingoScale.get() }],
}))
```

con `pingoScale = useSharedValue(reduceMotion ? 1 : MOTION_ENTRANCE_SCALE)`.

- WHILE reduce motion está desactivado, al montar, `pingoScale` recibe
  `pingoScale.set(withSpring(1, MOTION_SETTLE_SPRING))`.
- WHILE reduce motion está activo, `pingoScale` nace en 1 y no recibe
  ninguna animación.

`pingoFloatY` se define en R10.

Observable en el test de la bienvenida, describe
`#153 R9: Pingo entra con un muelle de escala`, con estos `it`:

- `arranca al 90 % sin reduce motion`: sin avanzar timers,
  `getAnimatedStyle(screen.getByTestId('welcome-pingo'))` hace `toEqual` con
  `{ width: 200, height: 200, transform: [{ translateY: 0 }, { scale: 0.9 }] }`.
- `termina a tamaño completo sin reduce motion`: tras 1000 ms hace `toEqual`
  con
  `{ width: 200, height: 200, transform: [{ translateY: expect.any(Number) }, { scale: 1 }] }`.
  La flotación sigue en curso y la cierra R10.
- `con reduce motion nace a tamaño completo y no escala`: con reduce motion,
  hace `toEqual` con
  `{ width: 200, height: 200, transform: [{ translateY: 0 }, { scale: 1 }] }`
  a 0 ms y otra vez tras 5000 ms.
- `usa el muelle de motion.ts`: sobre la fuente, cada una de estas
  expresiones casa exactamente una vez:
  - `/pingoScale\.set\(\s*withSpring\(\s*1,\s*MOTION_SETTLE_SPRING,?\s*\),?\s*\)/g`
  - `/useSharedValue\(\s*reduceMotion \? 1 : MOTION_ENTRANCE_SCALE,?\s*\)/g`

### R10 — Pingo flota en bucle

THE SYSTEM SHALL definir `pingoFloatY = useSharedValue(0)`.

- WHILE reduce motion está desactivado, al montar recibe
  `pingoFloatY.set(withRepeat(withTiming(-MOTION_FLOAT_OFFSET_Y, MOTION_FLOAT_TIMING), -1, true))`.
  Es decir: sube 4 puntos en 1200 ms, baja en otros 1200 y repite sin fin.
- WHILE reduce motion está activo, no recibe ninguna animación y se queda
  en 0.

Observable en el test de la bienvenida, describe
`#153 R10: Pingo flota en bucle`, con estos `it`:

- `sube 4 puntos en medio ciclo sin reduce motion`: tras 2000 ms,
  `getAnimatedStyle(screen.getByTestId('welcome-pingo'))` hace `toEqual` con
  `{ width: 200, height: 200, transform: [{ translateY: -4 }, { scale: 1 }] }`.
  Con el doble de `withRepeat`, la pasada única termina exactamente en -4.
- `repite la flotación sin fin y en vaivén`: tras renderizar,
  `mockWithRepeat.mock.calls.map((call) => call.slice(1))` contiene
  exactamente un elemento igual a `[-1, true]`. `mockWithRepeat` es
  `jest.mocked(withRepeat)`.
- `con reduce motion no flota`: con reduce motion, tras 5000 ms, hace
  `toEqual` con
  `{ width: 200, height: 200, transform: [{ translateY: 0 }, { scale: 1 }] }`,
  y `mockWithRepeat` no se ha llamado.
- `usa la flotación de motion.ts`: sobre la fuente, esta expresión casa
  exactamente una vez:
  `/pingoFloatY\.set\(\s*withRepeat\(\s*withTiming\(\s*-MOTION_FLOAT_OFFSET_Y,\s*MOTION_FLOAT_TIMING,?\s*\),\s*-1,\s*true,?\s*\),?\s*\)/g`.

### R11 — Pingo parpadea cada cuatro segundos

THE SYSTEM SHALL definir:

- `pingoBlink = useSharedValue(0)`;
- `blinkStyle = useAnimatedStyle(() => ({ opacity: pingoBlink.get() }))`.

WHILE reduce motion está desactivado, al montar `pingoBlink` recibe:

```
pingoBlink.set(
  withRepeat(
    withSequence(
      withDelay(MOTION_BLINK_INTERVAL_MS, withTiming(1, MOTION_BLINK_TIMING)),
      withDelay(MOTION_FEEDBACK_MS, withTiming(0, MOTION_BLINK_TIMING)),
    ),
    -1,
  ),
)
```

Cada 4000 ms, la capa `welcome-pingo-blink` (R6) tapa la pose con los ojos
cerrados durante 150 ms. `withRepeat` recibe exactamente dos argumentos.
WHILE reduce motion está activo, `pingoBlink` no recibe ninguna animación y se
queda en 0.

Observable en el test de la bienvenida, describe
`#153 R11: Pingo parpadea cada cuatro segundos`, con estos `it`:

- `cierra los ojos a los 4 s y los abre 150 ms después`. Se avanza en tres
  pasos acumulados, y tras cada uno
  `getAnimatedStyle(screen.getByTestId('welcome-pingo-blink'))` hace
  `toEqual` con `{ position: 'absolute', top: 0, left: 0, opacity: X }`:
  - 3900 ms: `X = 0`;
  - 200 ms más, 4100 en total: `X = 1`;
  - 200 ms más, 4300 en total: `X = 0`.
- `repite el parpadeo sin fin`: tras renderizar,
  `mockWithRepeat.mock.calls.map((call) => call.slice(1))` contiene
  exactamente un elemento igual a `[-1]`.
- `con reduce motion no parpadea`: con reduce motion, tras 4100 ms la capa
  vale `{ position: 'absolute', top: 0, left: 0, opacity: 0 }`, y
  `mockWithRepeat` no se ha llamado.
- `usa el intervalo y el cambio de motion.ts`: sobre la fuente, cada una de
  estas expresiones casa exactamente una vez:
  - `/withDelay\(\s*MOTION_BLINK_INTERVAL_MS,\s*withTiming\(\s*1,\s*MOTION_BLINK_TIMING,?\s*\),?\s*\)/g`
  - `/withDelay\(\s*MOTION_FEEDBACK_MS,\s*withTiming\(\s*0,\s*MOTION_BLINK_TIMING,?\s*\),?\s*\)/g`

### R12 — La parada de los bucles al desmontar la hace Reanimated

WHEN la bienvenida se desmonta, THE SYSTEM SHALL parar la flotación y el
parpadeo **sin código propio**. Lo hace Reanimated 4.5.1: cada
`useSharedValue` registra un efecto que, al desmontar, llama a
`cancelAnimation` sobre su propio valor
(`node_modules/react-native-reanimated/src/hook/useSharedValue.ts`).

Por eso `src/screens/welcome/index.tsx` no importa ni llama a
`cancelAnimation`, y su efecto de montaje no devuelve función de limpieza.
La regla deja escrito que esto es una decisión y no un olvido: una limpieza
a mano repetiría la del hook. El precedente de
`src/components/pet-hero-header.tsx` sí limpia a mano, pero por otro motivo:
su efecto se relanza cuando cambia una prop, y la bienvenida no tiene
ninguna que relance el suyo.

Observable en el test de la bienvenida, describe
`#153 R12: la parada de los bucles la hace Reanimated`, con este `it`:

- `no cancela a mano ni devuelve limpieza`: sobre la fuente, estas dos
  expresiones casan cero veces:
  - `/\bcancelAnimation\b/g`
  - `/return \(\) =>/g`

### R13 — Sin dependencias nuevas y sin drift de estilo

THE SYSTEM SHALL implementar #153 sin añadir dependencias. En concreto:

- `mobile-pet-tracker/package.json` y `mobile-pet-tracker/bun.lock` no
  cambian respecto del HEAD del handoff;
- ni Lottie, ni Rive, ni `expo-linear-gradient` entran al proyecto.

Además, THE SYSTEM SHALL mantener verde, sin tocarlo, el describe de #118
`#118 R11: la bienvenida no mete drift de estilo` de
`src/__tests__/design-drift.test.ts`. Ese describe prohíbe en la bienvenida:

- hex, clases arbitrarias, `StyleSheet` y sombras legacy;
- `rounded-2xl`, `rounded-lg`, `rounded-md` y `rounded-sm`;
- `text-accent` suelto, `useThemeColor` y emoji;
- `expo-linear-gradient` y `expo-symbols`.

Observable en el test de la bienvenida, describe
`#153 R13: Pingo no trae dependencias nuevas`, con este `it`:

- `no declara Lottie, Rive ni expo-linear-gradient`: lee
  `JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'))`.
  Ninguna clave de `dependencies` ni de `devDependencies` casa con
  `/^(?:lottie-react-native|rive-react-native|@rive-app\/.+|expo-linear-gradient)$/`.

La parte del diff la comprueba el reviewer con
`git diff --stat <hash-del-handoff> -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock`.
La salida esperada es vacía.

### R14 — Smoke del humano en dev build de Android

WHEN Codex termina y el reviewer aprueba, THE SYSTEM SHALL quedar validado
por el humano en un **dev build de Android, nunca Expo Go**. El smoke no se
delega a ninguna IA, y el humano lo firma en su propia casilla de
§Aprobación.

1. **Llegar a la bienvenida.** Sin sesión, abre la app y comprueba que llega
   a la bienvenida. Si hay sesión, cierra sesión desde Profile. Para empezar
   de cero, usa Ajustes → Aplicaciones → Pet Tracker → Almacenamiento →
   Borrar datos: `pm clear` está denegado en ColorOS.
2. **Tema claro.** Comprueba que se ven:
   - la escena verde suave con el bocadillo blanco encima de Pingo;
   - Pingo sin cuadro blanco alrededor, es decir, con la transparencia del
     WebP;
   - el saludo legible;
   - el CTA «Comenzar ahora» con una franja inferior más oscura de unos 4 px
     y sus esquinas redondeadas intactas;
   - «Ya tengo una cuenta» sin franja.
3. **Tema oscuro.** Pon el teléfono en tema oscuro y repite el paso 2.
   Además, la escena y el bocadillo tienen que distinguirse del fondo.
4. **Movimiento.** Comprueba que:
   - al entrar, Pingo crece un poco hasta su tamaño;
   - flota despacio, unos 4 px arriba y abajo, con un ciclo de unos 2,4 s;
   - cada unos 4 s cierra los ojos un instante, sin saltos de posición entre
     las dos poses y sin destello.
5. **Reduce motion.** Activa Ajustes → Accesibilidad → Quitar animaciones,
   cierra la app del todo y vuelve a abrirla. Pingo no crece, no flota ni
   parpadea, y el contenido aparece con un fundido sin desplazarse.
   Desactívalo al terminar.
6. **Navegación.** Pulsa «Comenzar ahora» y comprueba que lleva a registro.
   Vuelve atrás, pulsa «Ya tengo una cuenta» y comprueba que lleva a inicio
   de sesión.
7. **Pantalla pequeña.** En el teléfono de pruebas, o con el tamaño de letra
   del sistema al máximo, la pantalla hace scroll y no corta ni el aviso
   legal ni los CTA.

## Preguntas abiertas para el gate

Cada pregunta trae la opción que la spec ya toma. Si el humano no la cambia,
se queda así.

- **G1 — Poses.** D2 habla de 12 poses en WebP. Esta spec mete solo las dos
  que la bienvenida pinta (R3). Las otras entran con la feature que las
  pinte (E, D, F o G de explore §4).
  Si el humano las quiere todas ya, R3 cambia su lista cerrada.
- **G2 — Quién convierte los WebP.** El leader corre el comando de design.md
  §Assets antes del handoff, con salida en `/home/claude/pet-tracker-mascot/webp/`.
  Codex los copia al árbol en el paso verde de T3, y así el rojo de R3 existe.
  Si el sandbox de Codex no puede leer fuera del repo, los copia el humano.
- **G3 — Color del labio.** El labio usa `border-black/25` de la paleta por
  defecto de Tailwind. Da un verde más oscuro que el acento en los dos temas,
  de unos `#11613F` frente al `#0E5E3C` / `#0B4D31` del canvas.
  La alternativa es un token `--accent-lip` en `global.css` tras el merge de
  #152, cuando la feature E lo reutilice: con un solo uso, la carta no pide
  token.
- **G4 — Excepción a §Animación.** El punto 7 de la carta (R2) permite
  timings sobre `translateY` y opacidad, y duraciones fuera de 150/250/400,
  solo para los bucles de reposo de Pingo. ¿Se acepta la excepción, o se
  prefiere otro mecanismo?
- **G5 — Dónde viven las constantes.** Las cinco constantes de Pingo van a
  `src/theme/motion.ts` (R4), como pide la carta tras #152, y no locales en la
  pantalla.
- **G6 — Tagline y chips.** Se conservan los dos bloques de #118 bajo la
  escena (R5). El canvas no los pinta.
- **G7 — Bocadillo.** Es una `Card` de superficie centrada y sin cola (R5).
  El canvas lo pone arriba a la derecha y con cola, lo que pediría una
  forma a mano fuera de la escala de radios.
- **G8 — Tamaño de Pingo.** 200 × 200 (R6), frente a los 220 del canvas. Es
  un número redondo sin medición detrás, y lo valida el paso 7 del smoke R14.
- **G9 — Parpadeo.** Es un cambio de pose instantáneo (0 ms) cada 4000 ms
  fijos (R11). Las alternativas descartadas son un fundido y un intervalo
  aleatorio de 3 a 5 s.
- **G10 — Copy del saludo.** Hay que aprobar el literal en/es de §Copy final
  y la voz del punto 7 (R2), en su casilla propia de §Aprobación.
- **G11 — Revalidar tras #152.** La spec se escribió contra 66aaf981 y contra
  la rama de #152 (36f91e6e). El leader la revalida contra `main` cuando
  #152 mergee y antes del handoff, con las anclas de T0.

## Fuera de alcance

Cada viñeta dice si es una **delimitación** (no se hace y no hace falta
registrarla) o una **deuda** (candidata a feature posterior). Ninguna se
registra en `feature_list.json` desde esta spec: eso lo decide el leader.

- **Anillos de pulso, órbita o escalonado de los chips, y «pop» del
  bocadillo** del canvas. *Delimitación*: la bienvenida ya tiene tres
  movimientos (entrada, flotación y parpadeo), y la carta pide contención.
- **Compresión al pulsar el CTA y labio gris en el CTA secundario.**
  *Delimitación*: D4 dice «con cuerpo» solo para el primario, y el `Button`
  de heroui ya da su respuesta al pulsar.
- **El `Button` global de heroui.** *Delimitación*: D4 dice que no cambia.
  El labio vive solo en la `className` de `welcome-get-started`.
- **Celebraciones (E), estados vacíos (D), hero de mascota (F) y onboarding
  (G) de explore §4.** *Deuda*: son las features que pintarán las otras
  poses.
- **`src/screens/home/**`, `src/theme/global.css`, el final de
  `src/__tests__/design-drift.test.ts` y `docs/ui-guidelines.md` §Animación.**
  *Delimitación*: son de #152, por el reparto.
- **Las otras diez poses** (G1). *Deuda*: entran con su feature.
- **Parpadeo aleatorio y pausa de los bucles al perder el foco.**
  *Delimitación*: la bienvenida es la pantalla raíz sin sesión y no se queda
  debajo de ninguna otra. Al navegar a registro o login, la bienvenida queda
  tapada en la pila y sus dos bucles siguen corriendo en el hilo de UI. Son
  dos valores compartidos y no tocan el hilo de JS. Al desmontar los para
  Reanimated (R12). Pasa a ser *deuda* si el perfilado muestra coste.
- **Migrar a `motion.ts` las demás constantes de movimiento** del repo
  (`MEALS_BAR_*` y similares). *Deuda*: #153 solo retira las de la
  bienvenida.
- **La búsqueda del nombre en el IMPI** y el significado coloquial de
  «pingo» en España. *Delimitación*: lo lleva el humano y no cambia el
  código. Si el nombre cambia, cambian el literal de §Copy final y los
  nombres de fichero de R3.
- **Texto alternativo de Pingo.** *Delimitación*: las dos imágenes son
  decorativas y el saludo ya está en texto (R6).

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-07) ← gate obligatorio antes de implementar
- [x] Voz de Pingo (R2) y copy final (R1) aprobados (fecha: 2026-10-07)
- [X] Smoke R14 superado en dev build de Android (fecha: 2026-10-08)

## Premisas falsas

Estas son premisas de los documentos de entrada que no se sostienen contra el
árbol. La spec no las usa.

- **P-a.** `progress/explore_ui-delight-appllama.md` P3 (en 36f91e6e) dice
  que el labio del CTA usa «un token de acento oscuro». No existe ese token.
  En tema oscuro, `accent-strong` (`#2AB87C`) es **más claro** que `accent`,
  así que no sirve de labio. R7 usa `border-black/25` (G3).
- **P-b.** El candidato B de explore §4 da al óvalo de la escena
  `bg-accent-soft`. El canvas aprobado usa `surface2`, que en el repo es
  `bg-surface-secondary`, y eso es lo que fija R5.
- **P-c.** Explore y el canvas nombran las poses sin el prefijo real. Los
  ficheros son `mascot-01-wave.png` y `mascot-01-wave-blink.png`, en
  `/home/claude/pet-tracker-mascot/`.
- **P-d.** La enmienda de #152 a la carta dice que `WELCOME_ENTRANCE_MS`
  migra «a motion.ts en una feature posterior». #153 no lo migra: lo borra
  (R8) y usa `MOTION_FADE_TIMING` y `MOTION_SETTLE_SPRING`. Esa frase de la
  carta queda parcialmente caducada. #153 no podía editarla mientras #152
  estaba en vuelo. Tras el merge la corrige la Enmienda E1.
- **P-e.** La descripción de #153 en `feature_list.json` dice que «las 12
  poses … entran al repo como WebP». Esta spec mete dos (G1).

## Enmienda E1 — la carta deja de anunciar que `WELCOME_ENTRANCE_MS` migra

#152 se mergeó en `main` el 2026-10-07 (`36c8050d`, PR #198). Su enmienda a
la carta, la sección `## Enmienda #152 — el movimiento vive en src/theme/motion.ts`
de `docs/ui-guidelines.md`, cuenta `WELCOME_ENTRANCE_MS` entre las constantes
que «migran a `motion.ts` en una feature posterior». R8 no la migra: la borra.
Con #153 mergeada, esa frase de la carta diría algo falso (P-d). El leader de
#152 decidió el 2026-10-07 que la corrige #153 tras el merge, y no #152.

La revalidación de G11 contra `36c8050d` no encontró nada más que cambiar.
Las anclas A1-A20 de T0 y los bloques de design.md §Guards dan su
«Esperado», y #152 no tocó ningún fichero de #153. R2 y R8 no cambian: esta
enmienda añade un requisito y su candado.

**THE SYSTEM SHALL** sustituir, en esa sección de `docs/ui-guidelines.md`, el
párrafo que empieza por `Las constantes anteriores a #152 (` y acaba en
`fuera del alcance de esta.` (cuatro líneas) por este texto exacto:

```
Las constantes anteriores a #152 (`MEALS_BAR_TIMING`, `KCAL_BAR_TIMING`,
`BAR_ENTRY_*`, `METRIC_TAB_SPRING` y `TAB_INDICATOR_SPRING`) migran a
`motion.ts` en una feature posterior, fuera del alcance de esta.
`WELCOME_ENTRANCE_MS` no está en la lista: la retiró #153, cuya bienvenida
usa `MOTION_FADE_TIMING` y `MOTION_SETTLE_SPRING` (enmienda E1 de #153).
```

El resto de la sección no cambia: ni el encabezado, ni el texto de A21, ni la
casilla `- [X] Enmienda aprobada por humano`. Los leen los `it` de
`#152 R2: la carta apunta a motion.ts` en `src/theme/__tests__/motion.test.ts`.

Observable en el test de la bienvenida, describe
`#153 E1: la carta retira WELCOME_ENTRANCE_MS de la migración pendiente`. Lee
la carta como el describe de R2 y tiene un `it`,
`deja en la lista solo las cinco constantes pendientes`. El `it` recorta la
sección así:

```ts
const heading = '## Enmienda #152 — el movimiento vive en src/theme/motion.ts';
const start = charter.indexOf(heading);
const next = charter.indexOf('\n## ', start + heading.length);
const amendment = charter.slice(start, next === -1 ? undefined : next);
```

Y comprueba:

- `start` es mayor que `-1`;
- `amendment` contiene el bloque de arriba entero, escrito en el test como
  sus cinco líneas en un array de literales con comillas simples, unido con
  `.join('\n')`;
- `` `WELCOME_ENTRANCE_MS` `` aparece una sola vez en `amendment`:
  ``amendment.split('`WELCOME_ENTRANCE_MS`').length`` es `2`.

Ninguna cadena nueva del test lleva un guion pegado a `[` (design.md §Guards,
test colocado).

**Sondas del reviewer.** Cada una se aplica sobre la carta en verde y debe
poner el `it` en rojo por aserción. Se probaron en un spike fuera del árbol el
2026-10-08: la base da rojo, el verde da verde y las tres sondas dan rojo.

| Sonda | Mutación | Qué la caza |
|---|---|---|
| S1 | Deja el párrafo viejo y añade el bloque nuevo debajo | La cuenta: 2 |
| S2 | Quita `` `MEALS_BAR_TIMING`, `` del bloque nuevo | `toContain` |
| S3 | Borra el párrafo viejo y pone el bloque antes de `## Checklist de autocrítica` | `toContain` y la cuenta: 0 |

Tras cada sonda se restaura con `git checkout HEAD -- docs/ui-guidelines.md`
y se comprueba que `git diff --cached --stat` y `git diff --stat` quedan
vacíos.

- [x] Enmienda E1 aprobada por humano (fecha: 2026-10-08)
