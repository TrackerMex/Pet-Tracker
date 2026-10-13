---
feature: "mobile-account-screens-polish"
status: spec_ready
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-account-screens-polish]] (#172)

> Iniciar sesión, Crear cuenta y Recuperar contraseña pasan a verse como el
> canvas de `specs/mobile-account-screens-polish/canvas/*.dc.html`. Nueva
> contraseña entra solo para los puntos [F] 3 (flotación) y [F] 5
> (`liveRegion`) de #167. La carta (`docs/ui-guidelines.md`) manda sobre el
> canvas: los valores del canvas son datos y se traducen a tokens y clases que
> ya existen o que esta spec crea.
>
> Autorización del humano, literal: «si es necesario cambiar clases que
> tenemos hazlo para llegar al diseño final del artifact».

## Base medida

Medida una sola vez sobre el HEAD `b7284682` (punta de #167, branch
`feature/172-mobile-account-screens-polish`). Todos los comandos se ejecutan
desde `mobile-pet-tracker/` salvo que digan otra cosa. **Base congelada**: si
al arrancar (H0 del handoff) alguna salida difiere, la cifra futura es
`base medida en H0 + delta de esta spec`, nunca el número de esta tabla.
Otras features (#168–#171) tocan los mismos ficheros.

| # | Comando | Salida |
|---|---|---|
| B1 | `git rev-parse --short HEAD` | `b7284682` |
| B2 | `test -d node_modules; echo $?` | `1` (el worktree no trae dependencias; ver design.md §Entorno) |
| B3 | `grep -cF 'text-xs font-semibold text-foreground' src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx` | `2`, `7`, `1` |
| B4 | `grep -c 'selectable' src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx src/screens/reset-password/index.tsx` | `0`, `0`, `1`, `3` |
| B5 | `grep -c 'text-accent-strong' src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx src/screens/reset-password/index.tsx` | `2`, `0`, `1`, `3` |
| B6 | `grep -cF "'/login'" src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx src/screens/reset-password/index.tsx` | `0`, `1`, `1`, `2` |
| B7 | ocurrencias de `bg-accent-soft` en ficheros `.ts`/`.tsx` de `src` que no son test | `19` |
| B8 | igual que B7 con `\bborder-b-4\b` y con `border-black/25` | `19` y `19` |
| B9 | igual que B7 con `style=\{CONTINUOUS_CORNER\}` | `32` |
| B10 | `awk '/export const R1_AUTH/{f=1;next} f&&/^\];/{print n; exit} f&&/\{ file:/{n++}' src/__tests__/ui-copy-table.ts` | `37` |
| B11 | `grep -cE "^  '[a-zA-Z]+\.[a-zA-Z.]+':" src/i18n/catalog.ts` | `750` (375 por idioma) |
| B12 | `grep -c 'isInvalid={Boolean(fieldErrors\.' src/screens/register/index.tsx` | `7` |
| B13 | `grep -rl 'InputGroup' src \| wc -l` ; `grep -rl 'flex-2' src \| wc -l` | `0` ; `0` |
| B14 | `grep -c 'accessibilityLiveRegion' src/screens/reset-password/index.tsx` | `0` |
| B15 | `grep -cF '## Enmienda #172' ../docs/ui-guidelines.md` | `0` |
| B16 | último `### §2.N` de `../specs/mobile-ui-language/design.md` | `### §2.24 — Añadidos por #167 — Pingo en las pantallas de cuenta` |
| B17 | `grep -cF 'size-16 items-center justify-center rounded-xl bg-accent-soft' src/screens/forgot/index.test.tsx src/__tests__/consistency-classnames.test.ts` | `5`, `1` |
| B18 | `grep -rn -- '-message"' src/screens/register` ; regex de `getAllByTestId` con prefijo `register-` en los tests | sin salida ; ninguno |

`it` por fichero, medidos con `grep -cE '^\s*it(\.each)?[(<]' <fichero>`:

| Fichero | `it` en la base |
|---|---|
| `src/screens/login/index.test.tsx` | 21 |
| `src/screens/register/index.test.tsx` | 21 |
| `src/screens/forgot/index.test.tsx` | 28 |
| `src/screens/reset-password/index.test.tsx` | 27 |
| `src/__tests__/ui-language.test.ts` | 28 |
| `src/__tests__/design-drift.test.ts` | 51 |
| `src/__tests__/consistency-classnames.test.ts` | 33 |
| `src/__tests__/legibility-classnames.test.ts` | 12 |
| `src/theme/__tests__/global-css.test.ts` | 30 |
| `src/providers/__tests__/language-provider.test.tsx` | 17 |
| `src/theme/__tests__/motion.test.ts` | 16 |

Hechos verificados contra el árbol (no son premisas de explore):

- `Label` de heroui-native pone su `className` en la raíz `Pressable`, y el
  texto lo pinta `Label.Text`. Hoy los diez `<Label className="text-xs
  font-semibold text-foreground">` de login, registro y recuperar no
  afectan al texto.
- `Input` de heroui ya pinta el borde `danger` cuando su `TextField` lleva
  `isInvalid`. Registro ya pasa `isInvalid` a sus siete campos (B12).
- `FieldError` envuelve en texto solo los hijos `string`; cualquier otro hijo
  se pinta tal cual.
- `InputGroup` (con `InputGroup.Input` y `InputGroup.Suffix`) existe en
  heroui-native y no se usa todavía en el repo (B13).
- reicon-react-native exporta `ChevronLeft`, `Eye`, `EyeOff`, `AlertCircle` y
  `Lock`.
- Inter se carga en Regular, Medium, SemiBold, Bold y Black. **No hay
  ExtraBold**: el peso 800 del canvas no existe en la app (P2).
- `src/theme/motion.ts` ya trae `MOTION_FLOAT_OFFSET_Y = 4` y
  `MOTION_FLOAT_TIMING` (1200 ms, `ReduceMotion.System`). Solo los usa la
  bienvenida.
- Los tests de pantalla montan con `<LanguageProvider initial="es">` (o
  `"en"`), igual que `src/screens/login/index.test.tsx`.

## Convenciones

- **Anclas por contenido.** Ningún requisito, tarea ni handoff cita números de
  línea. Las anclas son `grep -cF '<literal>' <ruta>` con su salida esperada.
- **Comentarios con R.** Todo comentario en código o test que cite esta feature
  se escribe `#172 Rn` (con la R). Un `#172` suelto casa con `HEX_LITERAL` de
  `design-drift.test.ts`.
- **Dobles de pantalla.** Los tests de pantalla siguen el patrón de #167:
  `HomeEntrance` y `PopIn` se sustituyen por un `View` con el mismo `testID`,
  `className` y `style`. Esta spec añade un doble igual para `PingoFloat`
  (`View` con el mismo `testID` y sus `children`) en los tests de registro,
  recuperar y nueva contraseña. `BackButton` y `FormError` **no** se doblan en
  los tests de pantalla: se pintan de verdad.
- **Iconos.** Un test que asevera un icono lo sustituye por un `View` con
  `testID` fijo, con el mismo `jest.mock('reicon-react-native', …)` que ya usa
  `src/screens/register/index.test.tsx` para `AlertCircle`
  (`icon-alert-circle`). Los nuevos son `ChevronLeft` → `icon-chevron-left`,
  `Eye` → `icon-eye`, `EyeOff` → `icon-eye-off` y `Lock` → `icon-lock`.
  `useThemeColors` se dobla como en ese mismo fichero
  (`tokens.map((token) => \`color:${token}\`)`). Los tests de login y
  recuperar añaden los dos dobles, porque hoy no los tienen.
- **RNTL 14.** Siempre `await fireEvent.*`, `await act(...)` y
  `await render(...)`. `within(x)` no ve la raíz `x`. Las esperas siguen
  `docs/conventions.md` §Tests: `waitFor` con la aserción dentro, y nunca
  esperar a un contador de mock para consultar el árbol después.
- **Rojo por producción.** Cada sonda de esta spec muta **producción**; ninguna
  muta un doble. El rojo esperado nombra la consulta que falla.
- **Rutas con paréntesis.** Cualquier ruta `src/app/(auth)/...` que se pase a
  jest va escapada: `src/app/\(auth\)/...`.

## Requisitos funcionales

Cada requisito nombra su candado (fichero `::` título del `it`) y su sonda: dónde
se planta la mutación, qué rojo da y por qué consulta. Las sondas se plantan
una a una. Se corre **solo** el fichero del candado con `--testTimeout=30000`,
y se revierten con `git checkout HEAD -- <ruta>`.

### R1 — Tokens de tamaño de texto

THE SYSTEM SHALL declarar en el bloque `@theme` de `src/theme/global.css` los
tokens `--text-label: 13px`, `--text-body: 15px` y `--text-cta: 17px`.

- Candado: `src/theme/__tests__/global-css.test.ts` :: `#172 R1: define
  text-label, text-body y text-cta con sus valores exactos dentro de @theme`.
  Asevera `expect(parseVariables(extractTheme())).toMatchObject({ 'text-label':
  '13px', 'text-body': '15px', 'text-cta': '17px' })`, como el `it` de
  `R1: tokens rounded-card y text-2xs`. Las claves van sin `--` porque
  `parseVariables` lo quita.
- Sonda S1: `--text-label: 12px` en `global.css` pone rojo ese `it` por
  `toMatchObject`.

### R2 — Botón «Volver» compartido

THE SYSTEM SHALL ofrecer `BackButton` en `src/components/back-button.tsx`, con
props `testID: string` y `fallback: Href`. Importa
`import { router, type Href } from 'expo-router';`: el objeto `router`, como
las cuatro pantallas de cuenta, y no el hook `useRouter`, que ningún fichero de
producción usa y que los dobles de `expo-router` de los tests de pantalla no
traen. Pinta un `Pressable` con:

- `className="size-11 items-center justify-center rounded-full"`: 44×44 y
  cápsula, según carta §Radios («botón circular de volver»);
- `style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}`, la respuesta al
  pulsar con el patrón del repo;
- `accessibilityRole="button"` y `accessibilityLabel={t('common.back')}`;
- un único hijo `<ChevronLeft size={24} color={foreground} />` con
  `const [foreground] = useThemeColors(['foreground']);`.

WHEN el usuario pulsa `BackButton` AND `router.canGoBack()` devuelve `true`,
THE SYSTEM SHALL llamar `router.back()` una vez y no llamar `router.replace`.
WHEN el usuario pulsa `BackButton` AND `router.canGoBack()` devuelve `false`,
THE SYSTEM SHALL llamar `router.replace(fallback)` una vez y no llamar
`router.back()`.

- Candados en `src/components/__tests__/back-button.test.tsx`, fichero nuevo
  que dobla `expo-router` (`router: { back: jest.fn(), replace: jest.fn(),
  canGoBack: jest.fn() }`), el icono y `useThemeColors`, y monta dentro de
  `LanguageProvider`:
  - `#172 R2: es un botón de 44 con nombre accesible «Volver»`:
    `getByRole('button', { name: 'Volver' })` existe; su `className` es
    exactamente `size-11 items-center justify-center rounded-full`; tiene un
    solo hijo.
  - `#172 R2: en inglés se llama «Back»`: con `initial="en"`,
    `getByRole('button', { name: 'Back' })` existe.
  - `#172 R2: pinta ChevronLeft de 24 en foreground`: el hijo es
    `icon-chevron-left` con `size` 24 y `color` `color:foreground`.
  - `#172 R2: con historial vuelve atrás y no reemplaza`: con `canGoBack`
    devolviendo `true`, tras `await fireEvent.press` se llama a `back` 1 vez y a
    `replace` 0 veces.
  - `#172 R2: sin historial reemplaza por el fallback`: con `canGoBack`
    devolviendo `false` y `fallback="/welcome"`, se llama a `replace` 1 vez con
    `'/welcome'` y a `back` 0 veces.
- Sonda S2a: invertir el ternario (`canGoBack() ? replace : back`) pone rojos
  los dos últimos `it` por `toHaveBeenCalledTimes`.
- Sonda S2b: quitar `accessibilityLabel` pone rojos los dos primeros `it`,
  porque `getByRole` no encuentra el nombre.

### R3 — Fila «Volver» en Iniciar sesión, Crear cuenta y Recuperar

THE SYSTEM SHALL pintar un `BackButton` en:

| Pantalla | `testID` | `fallback` | Dónde |
|---|---|---|---|
| Iniciar sesión | `login-back` | `"/welcome"` | primer hijo de `login-header` |
| Crear cuenta | `register-back` | `"/welcome"` | primer hijo de `register-top`, que es el primer hijo de `register-header` |
| Recuperar | `forgot-back` | `"/login"` | único hijo de `View testID="forgot-top" className="w-full"`, que es el primer hijo del contenido del scroll `forgot-form`, en el formulario y en «Revisa tu correo» |

THE SYSTEM SHALL dejar `login-header` con exactamente tres hijos, en este
orden: `login-back`, `login-greeting` y el título.

THE SYSTEM SHALL dejar `register-header` con `className="gap-2"` y
exactamente dos hijos: `View testID="register-top" className="flex-row
items-center justify-between"` y el título. `register-top` tiene exactamente
dos hijos: `register-back` y `register-pingo-float` (R5).

Nueva contraseña **no** lleva «Volver», porque el canvas no lo dibuja.

- Candados:
  - `src/screens/login/index.test.tsx` :: `#172 R3: la cabecera lleva Volver,
    el saludo y el título`. Sustituye a `#167 R6: la cabecera lleva el saludo y
    después el título`. `header.children` tiene longitud 3: `[0]` es
    `login-back`, `[1]` es `login-greeting` y `[2]` es
    `within(header).getByText('Iniciar sesión')`.
  - `src/screens/login/index.test.tsx` :: `#172 R3: Volver de login vuelve a la
    bienvenida sin historial`. Con `canGoBack` devolviendo `false`, pulsar
    `login-back` llama a `mockRouter.replace` con `'/welcome'`.
  - `src/screens/register/index.test.tsx` :: `#172 R3: la cabecera lleva la fila
    Volver-Pingo y después el título`. Sustituye a `#167 R7: la cabecera lleva
    a Pingo y después el título`:
    - `header.children` tiene longitud 2: `[0]` es `register-top` y `[1]` es
      `within(header).getByText('Crear cuenta')`;
    - `register-top.children` tiene longitud 2: `[0]` es `register-back` y
      `[1]` es `register-pingo-float`;
    - `register-top.props.className` es exactamente
      `flex-row items-center justify-between`;
    - `header.props.className` es exactamente `gap-2`.
  - `src/screens/register/index.test.tsx` :: `#172 R3: Volver del registro
    vuelve a la bienvenida sin historial`. Igual que el de login, con
    `register-back`.
  - `src/screens/register/index.test.tsx` :: `#167 R7: la cabecera entra con
    rise` conserva su título, y el `className` de `'register-header'` en el mapa
    de `mockHomeEntrance` pasa de `'flex-row items-center justify-center
    gap-3'` a `'gap-2'`. El `index: 0` no cambia.
  - `src/screens/forgot/index.test.tsx` :: `#172 R3: la fila Volver encabeza el
    scroll en los dos estados`. Se comprueba en el formulario y otra vez tras
    enviar con `ok`:
    - `forgot-top.parent?.parent` tiene `testID` `forgot-form`;
    - `forgot-top.parent?.children[0]` es `forgot-top`;
    - `forgot-top.children` es `[forgot-back]`;
    - `forgot-top.props.className` es exactamente `w-full`.
  - `src/screens/forgot/index.test.tsx` :: `#172 R3: Volver de recuperar va al
    login sin historial`. Con `canGoBack` devolviendo `false`, pulsar
    `forgot-back` llama a `replace` con `'/login'`.
- Los mocks de `expo-router` de los tres ficheros de pantalla añaden
  `back: jest.fn()` y `canGoBack: jest.fn()` al objeto del router. Login y
  registro ya tienen `replace`; recuperar solo tiene `push` y añade también
  `replace: jest.fn()`.
- Sonda S3a: quitar `<BackButton testID="login-back" …/>` de login pone rojos
  los dos `it` de login, porque la longitud es 2 y no 3 y
  `getByTestId('login-back')` lanza.
- Sonda S3b: `fallback="/welcome"` en recuperar pone rojo `#172 R3: Volver de
  recuperar…` por `toHaveBeenCalledWith('/login')`.
- Sonda S3c: sacar `register-back` de `register-top` y ponerlo delante de
  `register-header` pone rojo `#172 R3: la cabecera lleva la fila…` por el
  `toHaveLength(2)` de `register-top.children`.

### R4 — Pingo flota: componente compartido

THE SYSTEM SHALL ofrecer `PingoFloat` en `src/components/pingo-float.tsx`, con
props `testID: string` y `children: ReactNode`. Pinta un `Animated.View` con
ese `testID` y el estilo animado `transform: [{ translateY }]`:

- WHILE `useReducedMotion()` devuelve `false`, THE SYSTEM SHALL arrancar al
  montar `translateY.set(withRepeat(withTiming(-MOTION_FLOAT_OFFSET_Y,
  MOTION_FLOAT_TIMING), -1, true))`, con las constantes de la bienvenida y sin
  constantes nuevas, y cancelarla al desmontar con `cancelAnimation`.
- WHILE `useReducedMotion()` devuelve `true`, THE SYSTEM SHALL dejar
  `translateY` en `0` y no arrancar ninguna animación.

- Candados en `src/components/__tests__/pingo-float.test.tsx`, fichero nuevo.
  Dobla `react-native-reanimated` igual que
  `src/components/__tests__/pop-in.test.tsx` (`...requireActual`,
  `__esModule: true` y `useReducedMotion` mockeado) y usa timers falsos:
  - `#172 R4: flota 4 px arriba y vuelve en bucle`. Comprueba
    `getAnimatedStyle(getByTestId('float')).transform[0].translateY` con
    `toBeCloseTo(valor, 0)`. Los tiempos son acumulados y cada avance va con
    `await act(async () => { jest.advanceTimersByTime(n); })`:

    | Tiempo | `translateY` |
    |---|---|
    | al montar | `0` |
    | 600 ms | `-2` |
    | 1200 ms | `-4` |
    | 2400 ms | `0` |
    | 3600 ms | `-4` |

    Los valores son literales del test, nunca la constante importada.
  - `#172 R4: con reduce motion no se mueve`. Con `useReducedMotion`
    devolviendo `true`, `translateY` vale exactamente `0` a 0, 600 y 1200 ms.
  - `#172 R4: pasa testID y children`. `within(getByTestId('float'))
    .getByText('Hijo')` existe.
- Sonda S4a: quitar el `if (!reduceMotion)` pone rojo `#172 R4: con reduce
  motion…`, porque a 600 ms vale `-2` y no `0`.
- Sonda S4b: quitar `withRepeat` y dejar solo `withTiming` pone rojo `#172 R4:
  flota…` a 2400 ms (`-4` en lugar de `0`).
- Sonda S4c: cambiar el signo, `withTiming(MOTION_FLOAT_OFFSET_Y, …)`, pone
  rojo `#172 R4: flota…` a 600 ms (`2` en lugar de `-2`).

### R5 — Pingo flota en Crear cuenta, Recuperar y Nueva contraseña

THE SYSTEM SHALL envolver la imagen de Pingo en `PingoFloat` en:

| Pantalla | Envoltorio | Imagen dentro | Dónde va el envoltorio |
|---|---|---|---|
| Crear cuenta | `register-pingo-float` | `register-pingo` | segundo hijo de `register-top` (R3) |
| Recuperar | `forgot-pingo-float` | `forgot-pingo` | donde hoy está `forgot-pingo`, justo antes de `forgot-lock-tile`, en los dos estados |
| Nueva contraseña | `reset-pingo-float` | `reset-pingo` | primer hijo de `reset-header`, en el formulario y en el éxito |

La imagen conserva la pose, el tamaño, la rotación y la falta de
`accessibilityLabel` que fijó #167. Iniciar sesión **no** flota: Pingo saluda
con su burbuja y el canvas no lo anima.

- Candados:
  - `src/screens/register/index.test.tsx` :: `#172 R5: Pingo del registro
    flota`. `getByTestId('register-pingo').parent` tiene `testID`
    `register-pingo-float`, y sus `children` son `[register-pingo]`.
  - `src/screens/forgot/index.test.tsx`: dos cambios.
    - El helper `expectPingoBeforeLock` cambia sus dos aserciones
      estructurales para mirar al envoltorio:
      `getByTestId('forgot-pingo-float').parent` es `title.parent`, y el índice
      del envoltorio es el del tile menos uno. Conserva las aserciones de pose,
      tamaño y accesibilidad sobre `forgot-pingo`. Lo usan los dos `it` `#167 R9:
      Pingo precede al tile del candado…`, que no cambian de título.
    - Un `it` nuevo, `#172 R5: Pingo de recuperar flota`, comprueba que
      `getByTestId('forgot-pingo').parent` tiene `testID` `forgot-pingo-float`.
  - `src/screens/reset-password/index.test.tsx`: dos cambios.
    - `#167 R10: la cabecera lleva a Pingo y después el título` y `#167 R10:
      el éxito conserva la cabecera del formulario` cambian
      `header.children[0]` a `testID` `reset-pingo-float`. Su
      `toHaveLength(2)` no cambia.
    - Un `it` nuevo, `#172 R5: Pingo de nueva contraseña flota en el formulario
      y en el éxito`, comprueba en las dos ramas que
      `getByTestId('reset-pingo').parent` tiene `testID` `reset-pingo-float`.
- Sonda S5: quitar el envoltorio en la rama del formulario de nueva contraseña
  pone rojo `#172 R5: Pingo de nueva contraseña…` por
  `toHaveProperty('props.testID', 'reset-pingo-float')`, y también
  `#167 R10: la cabecera lleva a Pingo…`.
- Registro: hasta que R3 crea `register-top`, el envoltorio es el primer hijo de
  `register-header`. Por eso T5 cambia el `children[0]` de `#167 R7: la cabecera
  lleva a Pingo y después el título` a `register-pingo-float`, y T6 sustituye
  ese `it` (tasks.md).

### R6 — Tipografía de títulos, etiquetas, cuerpos y CTA

THE SYSTEM SHALL pintar en Iniciar sesión, Crear cuenta y Recuperar estas
recetas, contadas por literal en la fuente de cada pantalla:

| Literal (`grep -cF`) | login | register | forgot |
|---|---|---|---|
| `className="text-3xl font-black text-foreground"` | 1 | 1 | 0 |
| `className="text-center text-3xl font-black text-foreground"` | 0 | 0 | 1 |
| `<Label.Text className="text-label font-semibold text-muted">` | 2 | 7 | 1 |
| `<Label>` | 2 | 7 | 1 |
| `<Label className=` | 0 | 0 | 0 |
| `className="text-body font-semibold text-foreground"` (burbuja) | 1 | 0 | 0 |
| `className="text-body font-medium text-foreground"` (términos) | 0 | 1 | 0 |
| `className="text-center text-body font-normal text-muted"` (`forgot-body`) | 0 | 0 | 1 |
| `<Button.Label className="text-cta font-bold text-accent-foreground">` | 1 | 1 | 1 |
| `<Button.Label className="text-cta font-bold text-foreground">` (`forgot-resend`) | 0 | 0 | 1 |
| `text-2xl` | 0 | 0 | 0 |
| `text-xs` | 0 | 0 | 0 |

Cada pantalla tiene un `<Label.Text …>` por `TextField`. Los títulos de
Iniciar sesión y Crear cuenta se alinean al inicio, como en el canvas. El de
Recuperar sigue centrado. El CTA usa `font-bold` (700) porque la app no carga
Inter ExtraBold (P2).

- Candado: `src/__tests__/account-screens-polish.test.ts` (nuevo) ::
  `#172 R6: %s pinta títulos, etiquetas, cuerpos y CTA con su receta`. Es un
  `it.each` sobre las tres pantallas, y cada fila de la tabla es un `expect` de
  conteo exacto con `split(literal).length - 1`.
- Candados de clase exacta que cambian:
  - En `src/screens/login/index.test.tsx`, `#167 R6: el título de la cabecera
    conserva su clase` pasa a `#172 R6: el título de la cabecera pesa 30/900 al
    inicio`, con `.toBe('text-3xl font-black text-foreground')`.
  - En `src/screens/register/index.test.tsx`, `#167 R7: el título de la
    cabecera conserva su clase` pasa a `#172 R6: el título de la cabecera pesa
    30/900 al inicio`, con el mismo valor.
  - En `src/screens/login/index.test.tsx`, `#167 R6: la burbuja dice el saludo
    en español` conserva su título, y su `.toBe('text-sm font-semibold
    text-foreground')` pasa a `.toBe('text-body font-semibold
    text-foreground')`.
- Sonda S6a: devolver una de las siete `Label.Text` de registro a
  `text-xs font-semibold text-foreground` pone roja la fila `register` del
  `it.each` (6 en lugar de 7).
- Sonda S6b: poner `font-bold text-accent-foreground` en `forgot-submit` pone
  roja la fila `forgot` (CTA 0 en lugar de 1).

### R7 — Enlaces de Iniciar sesión y Recuperar, y orden del cuerpo de login

THE SYSTEM SHALL pintar los enlaces así, con el `className` justo detrás de
`testID` en la etiqueta:

| Enlace | `className` del `LinkButton` | `LinkButton.Label` |
|---|---|---|
| `link-forgot` (login) | `min-h-11 self-end` | `text-sm font-semibold text-accent-strong` |
| `link-register` (login) | `h-13 w-full` | `text-base font-bold text-accent-strong` |
| `link-login` (forgot) | `h-13 w-full` | `text-base font-bold text-accent-strong` |

THE SYSTEM SHALL ordenar `login-body` así: campo de correo, campo de
contraseña, `link-forgot`, el error (solo si lo hay, R9), `login-submit` y
`link-register`.

- Candados:
  - `src/__tests__/account-screens-polish.test.ts` :: `#172 R7: los enlaces de
    login y recuperar llevan su receta`:
    - en login, `/testID="link-forgot"\s+className="min-h-11 self-end"/` y
      `/testID="link-register"\s+className="h-13 w-full"/` casan una vez cada
      uno;
    - en recuperar, `/testID="link-login"\s+className="h-13 w-full"/` casa una
      vez;
    - en login, `<LinkButton.Label className="text-sm font-semibold
      text-accent-strong">` cuenta 1 y `<LinkButton.Label className="text-base
      font-bold text-accent-strong">` cuenta 1;
    - en recuperar, el segundo literal cuenta 1;
    - en login, `self-center` cuenta 0.
  - Los tres `it` de orden de `src/screens/login/index.test.tsx` cambian de
    título y de array esperado. Su regex de `getAllByTestId` no cambia: el
    `^…$` no deja entrar ni `login-error-row` ni `login-password-toggle`.

    | `it` de hoy | `it` nuevo | Array esperado |
    |---|---|---|
    | `#167 R6: el cuerpo lleva el formulario en el orden de siempre` | `#172 R7: el cuerpo lleva correo, contraseña, olvido, envío y registro` | `['login-email', 'login-password', 'link-forgot', 'login-submit', 'link-register']` |
    | `#167 R6: con error, el error va entre la contraseña y el envío` | `#172 R7: con error, el error va entre el olvido y el envío` | `['login-email', 'login-password', 'link-forgot', 'login-error', 'login-submit', 'link-register']` |
    | `#167 R6: sin error, el cuerpo no lleva el error` | `#172 R7: sin error, el cuerpo no lleva el error` | `['login-email', 'login-password', 'link-forgot', 'login-submit', 'link-register']` |
- `links to register and forgot password` sigue verde: pulsa por `testID`, no
  depende del orden.
- `legibility-classnames.test.ts` no cambia (`inkSites`: login 2, forgot 1):
  cada pantalla conserva su número de `text-accent-strong` (B5).
- Sonda S7: dejar `link-forgot` al final del cuerpo, como hoy, pone rojos los
  tres `it` de orden por `toEqual`.

### R8 — Mostrar y ocultar la contraseña en Iniciar sesión

THE SYSTEM SHALL pintar el campo `login-password` dentro de un `InputGroup`:

- `InputGroup.Input` con `testID="login-password"`, `className="rounded-xl
  bg-default"` y `secureTextEntry={!passwordVisible}`;
- un `InputGroup.Suffix` sin `isDecorative`, con un `Pressable
  testID="login-password-toggle" className="size-11 items-center
  justify-center" accessibilityRole="button"`.

Comportamiento:

- WHILE la contraseña está oculta (el estado inicial), THE SYSTEM SHALL dar a
  `login-password-toggle` el nombre `t('login.showPassword')` y pintar dentro
  `<Eye size={20} color={muted} />`.
- WHILE la contraseña está visible, THE SYSTEM SHALL darle el nombre
  `t('login.hidePassword')` y pintar `<EyeOff size={20} color={muted} />`.
- WHEN el usuario pulsa `login-password-toggle`, THE SYSTEM SHALL invertir el
  estado.

`muted` sale de `const [muted] = useThemeColors(['muted']);`. Las dos claves
se escriben como dos llamadas literales
(`passwordVisible ? t('login.hidePassword') : t('login.showPassword')`) para
que `checkUses` las cuente.

- Candados en `src/screens/login/index.test.tsx`:
  - `#172 R8: la contraseña arranca oculta con «Mostrar contraseña»`:
    - `login-password` tiene `secureTextEntry` `true`;
    - `getByRole('button', { name: 'Mostrar contraseña' })` es
      `login-password-toggle`;
    - su único hijo es `icon-eye`, con `size` 20 y `color` `color:muted`.
  - `#172 R8: el ojo alterna mostrar y ocultar`:
    - tras un `await fireEvent.press`, `secureTextEntry` es `false`, el nombre
      es `Ocultar contraseña` y el hijo es `icon-eye-off`, con `size` 20 y
      `color` `color:muted`;
    - tras otra pulsación vuelve al estado inicial.
  - `#172 R8: en inglés el ojo dice «Show password» y «Hide password»`.
- Sonda S8a: arrancar con `useState(true)` pone rojo `#172 R8: la contraseña
  arranca oculta…`, porque `secureTextEntry` sale `false`.
- Sonda S8b: intercambiar `Eye` y `EyeOff` pone rojos los dos primeros `it` por
  el `testID` del hijo.

### R9 — Mensaje de error compartido, con icono y seleccionable

THE SYSTEM SHALL ofrecer `FormError` en `src/components/form-error.tsx`, con
props `testID: string` y `message: string`. Pinta
`View testID={\`${testID}-row\`} className="w-full flex-row items-center
gap-1.5"` con exactamente dos hijos, en este orden:

1. `<AlertCircle size={14} color={danger} />`, con
   `const [danger] = useThemeColors(['danger']);`;
2. `<Text testID={testID} selectable className="flex-1 text-label
   font-semibold text-danger">{message}</Text>`.

IF una pantalla de cuenta tiene un error general, THEN THE SYSTEM SHALL
pintarlo con `FormError` en el sitio donde hoy está su `Text`:

| Pantalla | `testID` | Fila |
|---|---|---|
| Iniciar sesión | `login-error` | `login-error-row` |
| Crear cuenta | `register-error` | `register-error-row` (sustituye a la fila propia de #167 R8) |
| Recuperar | `forgot-error` | `forgot-error-row` |

Con esto, `login-error` y `register-error` pasan a ser seleccionables (O5 de la
review de #167). Registro deja de importar `AlertCircle` y `useThemeColors`.
`reset-error` y `reset-missing-token` no cambian, porque Nueva contraseña solo
entra por [F] 3 y 5.

- Candados en `src/components/__tests__/form-error.test.tsx` (nuevo):
  - `#172 R9: la fila lleva el icono y después el texto`. La fila tiene el
    `className` exacto `w-full flex-row items-center gap-1.5`, y sus `children`
    mapeados a `testID` son `['icon-alert-circle', 'err']`.
  - `#172 R9: el icono mide 14 y usa danger`.
  - `#172 R9: el texto pesa 13/600 en danger, es seleccionable y dice el
    mensaje`. El `className` es exactamente `flex-1 text-label font-semibold
    text-danger`, `selectable` es `true` y cumple
    `toHaveTextContent('Algo falló')`.
- Candados de pantalla:
  - `src/screens/login/index.test.tsx` :: `#172 R9: el error de login va con
    icono en su fila`. Tras un login fallido, los `children` de
    `login-error-row` son `[icon-alert-circle, login-error]`, y `login-error`
    tiene `selectable` `true`.
  - `src/screens/forgot/index.test.tsx` :: `#172 R9: el error de recuperar va
    con icono en su fila`. Lo mismo con `forgot-error-row`, tras un `429`.
  - `src/screens/register/index.test.tsx`: en `#167 R8: el error general va en
    una fila con icono`, el `className` esperado pasa a
    `w-full flex-row items-center gap-1.5`. En `#167 R8: el texto del error pesa
    como el icono`, pasa a `flex-1 text-label font-semibold text-danger`. Los
    demás `it` de `#167 R8` siguen verdes sin cambios.
- Sonda S9a: quitar `selectable` en `form-error.tsx` pone rojos el tercer `it`
  de form-error y `#172 R9: el error de login…`.
- Sonda S9b: devolver login al `<Text testID="login-error"
  className="text-danger">` de hoy pone rojo `#172 R9: el error de login…`,
  porque `getByTestId('login-error-row')` lanza.

### R10 — Errores por campo en Crear cuenta

IF la API devuelve un error de validación para un campo de Crear cuenta, THEN
THE SYSTEM SHALL pintar un `FormError` dentro del `FieldError` de ese campo.
El `FieldError` conserva su `testID` `register-<campo>-error`, y el `FormError`
lleva el `testID` `register-<campo>-message`. Si el campo no tiene error, su
`FieldError` queda sin hijos.

Decisiones por campo. Las siete filas son el inventario, y se cuentan por
hijos, no por `testID`:

| Campo | `Input` | `FieldError` | `FormError` | `isInvalid` del `TextField` | `Label.Text` | Celda (R11) |
|---|---|---|---|---|---|---|
| nombre | `register-first-name` | `register-first-name-error` | `register-first-name-message` | `Boolean(fieldErrors.firstName)` | receta R6 | `flex-1` en `register-names-row` |
| apellidos | `register-last-name` | `register-last-name-error` | `register-last-name-message` | `Boolean(fieldErrors.lastName)` | receta R6 | `flex-1` en `register-names-row` |
| correo | `register-email` | `register-email-error` | `register-email-message` | `Boolean(fieldErrors.email)` | receta R6 | fila propia |
| teléfono | `register-phone` | `register-phone-error` | `register-phone-message` | `Boolean(fieldErrors.phone)` | receta R6 | `flex-2` en `register-contact-row` |
| país | `register-country` | `register-country-error` | `register-country-message` | `Boolean(fieldErrors.country)` | receta R6 | `flex-1` en `register-contact-row` |
| contraseña | `register-password` | `register-password-error` | `register-password-message` | `Boolean(fieldErrors.password)` | receta R6 | fila propia |
| confirmación | `register-password-confirmation` | `register-password-confirmation-error` | `register-password-confirmation-message` | `Boolean(fieldErrors.passwordConfirmation)` | receta R6 | fila propia |

El borde `danger` del campo lo pinta heroui con `isInvalid`, como hoy (B12).
Esta spec no lo reimplementa.

- Candados en `src/screens/register/index.test.tsx`:
  - `#172 R10: cada campo con error lleva icono y texto seleccionable`. Usa los
    errores de validación que ya monta el `it` `#167 R7` de hoy (`${path} no
    vale`). Para **cada uno** de los siete campos:
    - `within(getByTestId('register-<campo>-error')).getByTestId('register-<campo>-message-row')`
      tiene `children` `[icon-alert-circle, register-<campo>-message]`;
    - el texto es `<path> no vale`;
    - `selectable` es `true`.

    Además, `getAllByTestId(/^register-.+-message-row$/)` tiene longitud 7.
  - `#172 R10: sin errores ningún campo pinta mensaje`. Tras montar,
    `queryAllByTestId(/^register-.+-message(-row)?$/)` tiene longitud 0.
  - `maps validation errors to fields and unknown paths to the general error`
    sigue verde sin cambios, porque `toHaveTextContent` ve el texto del
    descendiente.
  - `src/__tests__/account-screens-polish.test.ts` :: `#172 R10: los siete
    campos del registro marcan isInvalid`. `isInvalid={Boolean(fieldErrors.`
    cuenta 7 en `register/index.tsx`.
- Los selectores `^register-.+-message(-row)?$` no casan con ningún `testID`
  de hoy (B18).
- Sonda S10a: dejar en el campo país `{fieldErrors.country}` como hijo de texto,
  como hoy, pone rojo `#172 R10: cada campo…`, porque la longitud es 6 y no 7
  y el `getByTestId` del país lanza.
- Sonda S10b: pintar `FormError` en apellidos con `message=""` aunque no haya
  error pone rojo `#172 R10: sin errores…` (longitud 2 en lugar de 0).

### R11 — Rejilla de Crear cuenta

THE SYSTEM SHALL ordenar los hijos del contenedor de contenido del scroll
`register-form` así:

1. `register-header`;
2. `View testID="register-names-row" className="flex-row gap-3"`, con los
   `TextField` de nombre y apellidos, cada uno con `className="flex-1"`;
3. el `TextField` del correo;
4. `View testID="register-contact-row" className="flex-row gap-3"`, con el
   `TextField` del teléfono (`className="flex-2"`) y después el del país
   (`className="flex-1"`);
5. el `TextField` de la contraseña;
6. el `TextField` de la confirmación;
7. la fila de términos;
8. `register-error-row`, solo cuando hay error general;
9. `register-submit`.

- Candados en `src/screens/register/index.test.tsx`:
  - `#167 R7: campos, errores, términos y envío cuelgan del scroll` pasa a
    `#172 R11: cabecera, rejilla, términos, error y envío cuelgan del scroll`.
    Con los errores de validación montados,
    `content = getByTestId('register-header').parent`, y `content.parent` es
    `register-form`. `content.children` tiene longitud 9, en este orden:
    1. `register-header`
    2. `register-names-row`
    3. `getByTestId('register-email').parent`
    4. `register-contact-row`
    5. `getByTestId('register-password').parent`
    6. `getByTestId('register-password-confirmation').parent`
    7. `getByTestId('register-terms').parent`
    8. `register-error-row`
    9. `register-submit`
  - `#172 R11: nombres a 1fr 1fr y teléfono-país a 2fr 1fr`:
    - los `children` de `register-names-row` son, en orden, el `.parent` de
      `register-first-name` y el de `register-last-name`;
    - los de `register-contact-row` son el `.parent` de `register-phone` y el
      de `register-country`;
    - las dos filas tienen el `className` exacto `flex-row gap-3`;
    - para cada raíz de campo, `props.className.split(' ')` contiene su clase
      de celda (`flex-1`, `flex-1`, `flex-2`, `flex-1`) y no la otra.
  - `#61 R7: conserva los campos del formulario como hijos directos del scroll`
    sigue verde sin cambios, porque su cuerpo no mira la estructura.
- Sonda S11a: poner `flex-1` en el teléfono pone rojo `#172 R11: nombres a 1fr
  1fr…`.
- Sonda S11b: poner el país antes que el teléfono pone rojo el mismo `it`, por
  el orden de `register-contact-row.children`.

### R12 — Validación del correo en el cliente (Crear cuenta)

WHEN el usuario pulsa `register-submit` AND el correo recortado no casa con
`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, THE SYSTEM SHALL pintar
`t('forgot.invalidEmail')` como error del campo correo (R10), dejar vacíos el
resto de errores y **no** llamar a `register` de `src/api/auth`.

El patrón es una constante de módulo `EMAIL_PATTERN` en
`src/screens/register/index.tsx`. La comprobación va después de limpiar los
errores y antes de marcar el envío en vuelo. Reutiliza la clave
`forgot.invalidEmail` («Ingresa un correo electrónico válido» / «Enter a valid
email address»), que ya es copy aprobado y coincide con el canvas. No hay
literal nuevo.

- Candados en `src/screens/register/index.test.tsx`:
  - `#172 R12: un correo sin arroba no llama a la API y marca el campo`.
    Rellena con `fillForm()`, que ya acepta los términos (no se vuelven a
    pulsar: otra pulsación los desmarca), cambia `register-email` a
    `alex.example.com` y envía con `submit()`. `register-email-message` dice
    `Ingresa un correo electrónico válido`, dentro de un `waitFor`, y después
    `mockRegister` tiene 0 llamadas.
  - `#172 R12: en inglés el correo inválido dice «Enter a valid email
    address»`.
  - `registers, logs in, persists the token and opens health` sigue verde,
    porque `alex@example.com` es válido.
- Sonda S12: quitar la comprobación pone rojos los dos `it`: `mockRegister` se
  llama 1 vez y `getByTestId('register-email-message')` lanza.

### R13 — La tarjeta de estado de Nueva contraseña se anuncia

THE SYSTEM SHALL dar a `reset-success-card` `accessibilityLiveRegion="polite"`,
para que Android anuncie «Contraseña actualizada» al aparecer.

- Candado: `src/screens/reset-password/index.test.tsx` :: `#172 R13: la
  tarjeta de estado avisa con liveRegion polite`. Tras un reset con éxito,
  `getByTestId('reset-success-card').props.accessibilityLiveRegion` es
  `'polite'`. `Card` reenvía sus `ViewProps` (`...rest`).
- Sonda S13: quitar la prop pone rojo el `it` por `toBe('polite')`.

### R14 — El candado de Recuperar es un tile acento con labio

THE SYSTEM SHALL pintar `forgot-lock-tile` con
`className="size-13 items-center justify-center rounded-xl border-b-4
border-black/25 bg-accent"`, conservando `style={CONTINUOUS_CORNER}` y la
entrada `PopIn`. Dentro pinta `<Lock size={26} color={accentForeground} />`,
con `const [accentForeground] = useThemeColors(['accent-foreground']);`.

El labio va **delante** de `bg-accent` a propósito. Así el tile no cae en el
recuento de primarios `rounded-xl bg-accent(?=[\s'"\`])` de #166, porque no es
un botón (Enmienda #172).

- Candados:
  - `src/screens/forgot/index.test.tsx` :: `#172 R14: el candado es un tile
    acento con labio y Lock de 26`. En los dos estados,
    `getByTestId('forgot-lock-tile').props.className` es el literal de arriba,
    y su único hijo es `icon-lock`, con `size` 26 y `color`
    `color:accent-foreground`.
  - En `src/screens/forgot/index.test.tsx`, el helper `lockTile()` pasa a buscar
    el tile por `testID` (`'forgot-lock-tile'`) entre los hermanos del título,
    y la constante `LOCK_TILE_CLASS` desaparece. Así, los 17 usos de
    `expectFormState` y `expectSentState` no caen en cascada al cambiar la
    clase. Los otros cuatro literales
    `'size-16 items-center justify-center rounded-xl bg-accent-soft'` (B17:
    los dos de `el tile Lock sigue en pie en los dos estados` y las dos
    entradas `'forgot-lock-tile'` del mapa del doble de `PopIn`) pasan al
    `className` nuevo.
  - Anclas al cerrar, en `src/screens/forgot/index.test.tsx`:
    - `grep -cF 'size-16 items-center justify-center rounded-xl bg-accent-soft'` da `0`;
    - `grep -c 'LOCK_TILE_CLASS'` da `0`;
    - `grep -cF 'size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent'`
      da `5`: los cuatro de arriba más el del `it` `#172 R14`.
  - §Deltas de candados recoge los cambios de `consistency-classnames.test.ts`.
- Sonda S14: poner `bg-accent-soft` en lugar de `bg-accent` pone rojo
  `#172 R14` por `toBe`, y también `consistency-classnames`, porque
  `bg-accent-soft` cuenta 19 y no 18.

### R15 — El error de login cuelga del scroll (E2-1 de la review de #167)

THE SYSTEM SHALL pintar `login-error` dentro del scroll `login-form`, y dejar
`screen-login` (el `KeyboardAvoidingView`) con un único hijo, que es el scroll.

- Candado: `src/screens/login/index.test.tsx` :: `#172 R15: el error cuelga del
  scroll y no del contenedor del teclado`. Tras un login fallido,
  `within(getByTestId('login-form')).getByTestId('login-error')` existe y
  `getByTestId('screen-login').children` es `[getByTestId('login-form')]`.
- Este `it` **nace verde**: hoy el error ya está dentro del scroll. Su rojo lo
  demuestra la sonda, no un commit de test previo (tasks.md T16).
- Sonda S15 (la Z2 de la review): mover el bloque del error justo después de
  `</ScrollView>` pone rojo el `it`, por `within(...).getByTestId` y por la
  longitud de `children`.

### R16 — Copy nuevo y tabla de usos

THE SYSTEM SHALL declarar en `src/i18n/catalog.ts`, en los dos idiomas, tres
claves nuevas. Los literales dependen de P1:

| Clave | `es` | `en` |
|---|---|---|
| `common.back` | `Volver` | `Back` |
| `login.showPassword` | `Mostrar contraseña` | `Show password` |
| `login.hidePassword` | `Ocultar contraseña` | `Hide password` |

THE SYSTEM SHALL registrarlas en `specs/mobile-ui-language/design.md` bajo un
encabezado nuevo, `### §2.N — Añadidos por #172 — Las pantallas de cuenta como
el canvas`. N es el siguiente número libre al implementar: hoy sería 25 (B16),
pero #168–#171 pueden ocuparlo antes. Cada clave lleva su fila
`| — | \`<clave>\` | \`<en>\` | \`<es>\` | ← añadida por #172 (R16) |`.

THE SYSTEM SHALL añadir cuatro filas a `R1_AUTH` de
`src/__tests__/ui-copy-table.ts`:

- login × `login.showPassword`;
- login × `login.hidePassword`;
- register × `forgot.invalidEmail`;
- `src/components/back-button.tsx` × `common.back`.

- Candados:
  - `src/providers/__tests__/language-provider.test.tsx` :: `#172 R16: declara
    las tres claves de cuenta en los dos idiomas y su registro`:
    - los valores son exactamente los de la tabla;
    - para cada clave, `languageDesign` casa
      ``'\\| — \\| `' + escapeRegExp(key) + '`[^\\n]*← añadida por #172 \\(R16\\)'``;
    - casa `/### §2\.\d+ — Añadidos por #172 — Las pantallas de cuenta como el canvas/`.
  - El `it` de longitud del catálogo del mismo fichero suma `+ 3, // #172 R16`.
    La línea `+ 1, // #167 R5` pierde su coma final.
  - En `src/__tests__/ui-language.test.ts`, `resuelve las 36 ocurrencias
    normativas` pasa a `resuelve las 41 ocurrencias normativas`, con
    `toHaveLength(29 + 7 + 1 + 4); // #117 R10, #167 R6, #172 R16`. Esto cierra
    también O6 de la review de #167: el título decía 36 y la cuenta era 37.
  - El sumatorio de `SCREEN_FILES` de `no deja ningún valor fijo del catálogo
    como literal entero en las pantallas` suma `+ 1 // #172 R16: back-button`.
    `back-button.tsx` es el único fichero nuevo con `t()`.
  - `resuelve cada ocurrencia de la tabla contra la clave exacta`
    (`checkUses(ALL_USES)`) y `mantiene el catálogo consistente entre los dos
    idiomas` siguen verdes con las filas nuevas.
- Sonda S16: en `src/components/back-button.tsx`, cambiar `t('common.back')` por
  el literal `'Volver'` pone rojos, en `ui-language.test.ts`:
  - `resuelve cada ocurrencia de la tabla contra la clave exacta`, con
    `uses: 0` en lugar de `1` para `back-button.tsx` × `common.back`;
  - `no deja ningún valor fijo del catálogo como literal entero en las
    pantallas`, con `looseCopy` `['es:common.back = Volver']` para
    `back-button.tsx`.

  `checkUses` solo cuenta las filas que existen: borrar una fila de `R1_AUTH` no
  lo pone rojo, y por eso la sonda muta producción.

### R17 — Los ficheros nuevos no traen deriva

THE SYSTEM SHALL someter `components/back-button.tsx`,
`components/form-error.tsx` y `components/pingo-float.tsx` a los cuatro `it`
`#167 R14: …` de `src/__tests__/design-drift.test.ts`, añadiéndolos a su lista
`featureFiles`.

THE SYSTEM SHALL subir de 1 a 2 la entrada `'screens/forgot/index.tsx'` del
inventario de `#149 R4: inventaría cada ruta a login en producción`, porque
`forgot-back` añade el literal `"/login"` (`fallback`). Las entradas de login,
registro, nueva contraseña y bienvenida no cambian.

- Sonda S17a: un hex (`'#FFFFFF'`) en `pingo-float.tsx` pone rojo `#167 R14:
  sin hex, clases arbitrarias, StyleSheet ni sombras sueltas`.
- Sonda S17b: `fallback="/welcome"` en recuperar pone rojo `#149 R4` (forgot 1
  en lugar de 2), además de S3b.

### R18 — Enmienda a la carta

THE SYSTEM SHALL añadir al final de `docs/ui-guidelines.md` la sección
§Enmienda a la carta de esta spec, palabra por palabra, con su casilla en el
estado en que esté en este fichero al implementar.

- Candado: `src/__tests__/account-screens-polish.test.ts` :: `#172 R18: la
  carta declara la enmienda #172 y su casilla`:
  - la carta contiene `## Enmienda #172 — Pingo flota en las pantallas de
    cuenta y el candado lleva labio`;
  - a partir de ese encabezado casa `/- \[[ xX]\] Enmienda aprobada por humano/`;
  - contiene los literales `PingoFloat`, `MOTION_FLOAT_OFFSET_Y` y
    `forgot-lock-tile`.
- Sonda S18: quitar la casilla de la carta pone rojo el `it` por `toMatch`.

### R19 — Prueba de humo del humano en Android

WHEN Codex termina y el reviewer aprueba, THE SYSTEM SHALL pasar la prueba de
humo del humano en un **dev build de Android** (no Expo Go), con la casilla de
`traceability.md` §Prueba de humo firmada. La lista de comprobaciones está en
esa sección.

- Sin candado automático: la cierra el humano.

## Deltas de candados

Todo candado existente que esta spec toca, con su valor antes y después. Las
cifras parten de la base. Si H0 mide otra cosa, se aplica el delta.

| Fichero | `it` (título de hoy) | Literal o cifra antes | Después | R |
|---|---|---|---|---|
| `src/__tests__/consistency-classnames.test.ts` | `lleva los tres tiles restantes a rounded-xl` | `'size-16 items-center justify-center rounded-xl bg-accent-soft'` | `'size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent'` | R14 |
| ídem | `resuelve el Lock de Forgot con accent-strong` | título; `"const [accentStrong] = useThemeColors(['accent-strong']);"`; `'<Lock size={28} color={accentStrong} />'` | título `resuelve el Lock de Forgot con accent-foreground`; `"const [accentForeground] = useThemeColors(['accent-foreground']);"`; `'<Lock size={26} color={accentForeground} />'`. El `import` no cambia | R14 |
| ídem | `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban` | `count(/bg-accent-soft/g)).toBe(16 + 2 + 1)` | `toBe(16 + 2 + 1 - 1)` con `// … #172 R14: forgot-lock-tile pasa a bg-accent`. Primarios (19) y `CONTINUOUS_CORNER` sin cambios | R14 |
| ídem | `conserva los usos de bg-accent-soft que sí son acento` | `toBe(16 + 2 + 1)` | `toBe(16 + 2 + 1 - 1)` con `// #147 R4, #105 R11, #172 R14` | R14 |
| ídem | `no deja la receta del labio fuera de un primario` | `toBe(19)` ×2 | título `no deja la receta del labio fuera de un primario salvo el candado de Recuperar`; `toBe(19 + 1)` ×2 con `// #172 R14: forgot-lock-tile (Enmienda #172)` | R14 |
| ídem | `inventaría los diecinueve primarios con labio, fichero a fichero` | forgot `1` | sin cambios: el tile no casa con `rounded-xl bg-accent` | R14 |
| `src/__tests__/legibility-classnames.test.ts` | `inkSites` y `suma las trece ocurrencias que enumera la spec` | login 2, forgot 1, reset 3 | sin cambios | R7 |
| `src/__tests__/design-drift.test.ts` | `#149 R4: inventaría cada ruta a login en producción` | `'screens/forgot/index.tsx': 1` | `2, // #172 R17: forgot-back` | R17 |
| ídem | lista `featureFiles` de los cuatro `#167 R14: …` | termina en `'theme/motion.ts',` | más `'components/back-button.tsx'`, `'components/form-error.tsx'` y `'components/pingo-float.tsx'` | R17 |
| `src/__tests__/ui-language.test.ts` | `resuelve las 36 ocurrencias normativas` | `toHaveLength(29 + 7 + 1)` | título con `41`; `toHaveLength(29 + 7 + 1 + 4)` | R16 |
| ídem | `no deja ningún valor fijo del catálogo como literal entero en las pantallas` | sumatorio de `SCREEN_FILES` | `+ 1 // #172 R16: back-button` | R16 |
| `src/__tests__/ui-copy-table.ts` | `R1_AUTH` | 37 filas (B10) | 41 filas | R16 |
| `src/providers/__tests__/language-provider.test.tsx` | `it` de longitud del catálogo | termina en `+ 1, // #167 R5` | `+ 1 // #167 R5` y `+ 3, // #172 R16` | R16 |
| `src/screens/login/index.test.tsx` | `#167 R6: la cabecera lleva el saludo y después el título` | 2 hijos | sustituido por `#172 R3: la cabecera lleva Volver, el saludo y el título` | R3 |
| ídem | `#167 R6: el título de la cabecera conserva su clase` | `'text-center text-2xl font-black text-foreground'` | sustituido por `#172 R6: el título de la cabecera pesa 30/900 al inicio` | R6 |
| ídem | `#167 R6: la burbuja dice el saludo en español` | `'text-sm font-semibold text-foreground'` | `'text-body font-semibold text-foreground'`; el título no cambia | R6 |
| ídem | los tres `it` de orden `#167 R6` | `link-register` antes que `link-forgot` | sustituidos por los tres `#172 R7` | R7 |
| `src/screens/register/index.test.tsx` | `#167 R7: la cabecera lleva a Pingo y después el título` | `[register-pingo, título]` | en T5, `children[0]` pasa a `register-pingo-float`; en T6, sustituido por `#172 R3: la cabecera lleva la fila Volver-Pingo y después el título` | R5, R3 |
| ídem | `#167 R7: la cabecera entra con rise` | `className: 'flex-row items-center justify-center gap-3'` | `className: 'gap-2'`; el título no cambia | R3 |
| ídem | `#167 R7: el título de la cabecera conserva su clase` | `'text-center text-2xl font-black text-foreground'` | sustituido por `#172 R6: el título de la cabecera pesa 30/900 al inicio` | R6 |
| ídem | `#167 R7: campos, errores, términos y envío cuelgan del scroll` | estructura plana | sustituido por `#172 R11: cabecera, rejilla, términos, error y envío cuelgan del scroll` | R11 |
| ídem | `#167 R8: el error general va en una fila con icono` | `'flex-row items-center gap-1.5'` | `'w-full flex-row items-center gap-1.5'` | R9 |
| ídem | `#167 R8: el texto del error pesa como el icono` | `'flex-1 text-sm font-semibold text-danger'` | `'flex-1 text-label font-semibold text-danger'` | R9 |
| `src/screens/forgot/index.test.tsx` | helper `lockTile()` y `LOCK_TILE_CLASS` | busca por `className` | busca por `testID`; la constante desaparece | R14 |
| ídem | `el tile Lock sigue en pie en los dos estados` y los dos `#167 R9: el tile entra con pop…` | 4 literales del tile viejo | 4 literales del tile nuevo | R14 |
| ídem | helper `expectPingoBeforeLock` | estructura sobre `forgot-pingo` | estructura sobre `forgot-pingo-float` | R5 |
| `src/screens/reset-password/index.test.tsx` | `#167 R10: la cabecera lleva a Pingo y después el título` y `#167 R10: el éxito conserva la cabecera del formulario` | `children[0]` es `reset-pingo` | `children[0]` es `reset-pingo-float` | R5 |
| `src/theme/__tests__/motion.test.ts` | `no exporta nada más` | 17 nombres | sin cambios: no hay constantes nuevas | R4 |

## Enmienda a la carta

R18 copia este texto al final de `docs/ui-guidelines.md`:

```markdown
## Enmienda #172 — Pingo flota en las pantallas de cuenta y el candado lleva labio

Los bucles de reposo de §Animación se amplían a tres pantallas de cuenta: en
Crear cuenta, Recuperar contraseña y Nueva contraseña, Pingo flota con el mismo
bucle de la bienvenida. El componente compartido `PingoFloat`
(`src/components/pingo-float.tsx`) anima `translateY` hasta
`-MOTION_FLOAT_OFFSET_Y` con `MOTION_FLOAT_TIMING`, en bucle infinito e
invertido, y lo cancela al desmontar. Con reduce motion no arranca. Iniciar
sesión no flota: Pingo saluda con su burbuja. Ninguna otra pantalla usa
`PingoFloat` sin una enmienda propia.

El tile del candado de Recuperar (`forgot-lock-tile`) es un tile acento con
labio: `rounded-xl border-b-4 border-black/25 bg-accent`. Es la única
excepción a la regla de que solo los botones llevan labio, y el labio va
delante de `bg-accent` para no contar como primario.

- [ ] Enmienda aprobada por humano
```

- [ ] Enmienda aprobada por humano (fecha: ____). La firma el humano aquí, en el
  gate de la spec. R18 copia en la carta esta casilla en el estado en que esté.

## Fuera de alcance

Cada viñeta está clasificada. **[D]** delimita esta spec y no es trabajo
pendiente. Las que podrían ser una feature futura remiten a su pregunta.

- [D] Tipografía, etiquetas, errores con icono y «Volver» en Nueva contraseña.
  El encargo la limita a [F] 3 y [F] 5 de #167. P7 pregunta si se abre una
  feature para el resto.
- [D] La rama sin token de Nueva contraseña (`reset-missing-token`): sin
  cambios, como en #167.
- [D] Altura de CTA (56) e inputs (52), y CTA anclada al pie con un espaciador
  flexible. Se conservan las alturas de heroui y el centrado de `#61 R8`. Lo
  recoge P5.
- [D] El ojo de la contraseña en Crear cuenta y Nueva contraseña: el canvas
  solo lo dibuja en Iniciar sesión. Lo recoge P6.
- [D] El peso 800 del CTA: no hay Inter ExtraBold en la app y se usa 700. Lo
  recoge P2.
- [D] Títulos de 28 px del canvas en Recuperar y Nueva contraseña: los títulos
  usan `text-3xl` (30 px), sin token para 2 px de diferencia (design.md D7).
- [D] La composición del canvas de Recuperar (mancha `surface2` de radio 40
  detrás de Pingo): no hay token de superficie con ese radio, y la carta
  prohíbe radios fuera de su escala.
- [D] Recetas de botón (#166), y cabecera, WeightChart y demás de #168–#171.
- [D] Anunciar el éxito en iOS (`AccessibilityInfo.announceForAccessibility`):
  la prueba de humo es en Android, y `accessibilityLiveRegion` es de Android.
- [D] Validar en el cliente otros campos de Crear cuenta: solo el correo, que es
  el error que dibuja el canvas.
- [D] Dependencias nuevas: ninguna. `InputGroup`, los iconos y Reanimated ya
  están instalados. `expo-linear-gradient` sigue vetado.
- [D] La bienvenida no cambia: su flotación sigue en su propio código, y sus
  candados no se tocan.

## Preguntas abiertas

- **P1 — Copy nuevo.** ¿Se aprueban `common.back` «Volver» / «Back»,
  `login.showPassword` «Mostrar contraseña» / «Show password» y
  `login.hidePassword` «Ocultar contraseña» / «Hide password»? Son nombres
  accesibles, no frases de Pingo, así que van sin primera persona.
- **P2 — Peso 800 del CTA.** El canvas pide 17/800 y la app no carga Inter
  ExtraBold, así que la spec usa 700. ¿Se añade `Inter-ExtraBold` (asset,
  `useFonts`, `--font-extrabold` y su candado de fuentes) en esta feature o en
  otra?
- **P3 — «País (código de 2 letras)» en una columna de 1fr.** La etiqueta se
  partirá en dos líneas. ¿Se acorta `register.country` a «País» / «Country»?
  Cambia copy aprobado, así que por defecto no se toca.
- **P4 — Partición propuesta, no decidida.** Hay tres opciones:
  - una sola feature;
  - tres features:
    - #172a, tipografía, «Volver», enlaces, errores, candado, E2-1 y copy:
      R1–R3, R6, R7, R9 y R14–R17;
    - #172b, Registro y ojo de login: rejilla, errores por campo, validación
      del correo y el ojo (R8 y R10–R12);
    - #172c, movimiento y accesibilidad: flotación, enmienda y `liveRegion` (R4,
      R5, R13 y R18);
  - otra división.
- **P5 — Alturas y anclaje del canvas.** ¿Se abre una feature para la CTA de
  56, los inputs de 52, la fila «Volver» pegada arriba y la CTA anclada al pie?
  Rompe el centrado vertical de `#61 R8`, así que aquí «Volver» va al principio
  del bloque centrado, no al borde superior.
- **P6 — El ojo en más campos.** ¿Se extiende a la contraseña y la confirmación
  de Crear cuenta y Nueva contraseña, aunque el canvas no lo dibuje?
- **P7 — El resto de Nueva contraseña.** ¿Se abre una feature para su
  tipografía, etiquetas, errores con icono y alineación con el resto?
- **P8 — Amplitud de la flotación.** El canvas flota 10 px en 3 s. La spec
  reutiliza los 4 px y 1,2 s de la bienvenida para no crear constantes nuevas.
  ¿Vale así?

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
