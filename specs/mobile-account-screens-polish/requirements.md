---
feature: "mobile-account-screens-polish"
status: approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-account-screens-polish]] (#172)

> Iniciar sesión, Crear cuenta, Recuperar contraseña y Nueva contraseña pasan
> a verse como el canvas de `specs/mobile-account-screens-polish/canvas/*.dc.html`.
> En Nueva contraseña entran, en sus dos ramas con token, la flotación, la
> tipografía, las etiquetas, el error con icono, los ojos, el `liveRegion` y
> la maqueta del canvas; la rama sin token no cambia (§Decisiones del
> humano). La carta (`docs/ui-guidelines.md`) manda sobre el
> canvas: los valores del canvas son datos y se traducen a tokens y clases que
> ya existen o que esta spec crea.
>
> Autorización del humano, literal: «si es necesario cambiar clases que
> tenemos hazlo para llegar al diseño final del artifact».

## Base medida

Medida el 2026-10-13 sobre el HEAD `3f9a60e2` de la branch
`feature/172-mobile-account-screens-polish`, que mezcla `origin/main` en
`788d1f89` (tras #170, PR #213). Esa mezcla trajo #168, #169 y #170. Todas
las filas se volvieron a medir sobre ese HEAD. Respecto a la medida anterior
(`b7284682`) cambian B7 (`19` → `18`, #168 R5), B9 (`32` → `37`), B11
(`750` → `768`), B16 (§2.24 → §2.26) y los `it` de
`language-provider.test.tsx` (`17` → `19`). Las demás salidas no cambian.
Todos los comandos se ejecutan desde `mobile-pet-tracker/` salvo que digan
otra cosa. **Base congelada**: si al arrancar (H0 del handoff) alguna salida
difiere, la cifra futura es `base medida en H0 + delta de esta spec`, nunca
el número de esta tabla. Otras features (#171 y las que mergeen después)
pueden tocar los mismos ficheros.

| # | Comando | Salida |
|---|---|---|
| B1 | `git rev-parse --short HEAD` | `3f9a60e2` |
| B2 | `test -d node_modules; echo $?` | `1` (el worktree no trae dependencias; ver design.md §Entorno) |
| B3 | `grep -cF 'text-xs font-semibold text-foreground' src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx` | `2`, `7`, `1` |
| B4 | `grep -c 'selectable' src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx src/screens/reset-password/index.tsx` | `0`, `0`, `1`, `3` |
| B5 | `grep -c 'text-accent-strong' src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx src/screens/reset-password/index.tsx` | `2`, `0`, `1`, `3` |
| B6 | `grep -cF "'/login'" src/screens/login/index.tsx src/screens/register/index.tsx src/screens/forgot/index.tsx src/screens/reset-password/index.tsx` | `0`, `1`, `1`, `2` |
| B7 | ocurrencias de `bg-accent-soft` en ficheros `.ts`/`.tsx` de `src` que no son test | `18` |
| B8 | igual que B7 con `\bborder-b-4\b` y con `border-black/25` | `19` y `19` |
| B9 | igual que B7 con `style=\{CONTINUOUS_CORNER\}` | `37` |
| B10 | `awk '/export const R1_AUTH/{f=1;next} f&&/^\];/{print n; exit} f&&/\{ file:/{n++}' src/__tests__/ui-copy-table.ts` | `37` |
| B11 | `grep -cE "^  '[a-zA-Z]+\.[a-zA-Z.]+':" src/i18n/catalog.ts` | `768` (384 por idioma) |
| B12 | `grep -c 'isInvalid={Boolean(fieldErrors\.' src/screens/register/index.tsx` | `7` |
| B13 | `grep -rl 'InputGroup' src \| wc -l` ; `grep -rl 'flex-2' src \| wc -l` | `0` ; `0` |
| B14 | `grep -c 'accessibilityLiveRegion' src/screens/reset-password/index.tsx` | `0` |
| B15 | `grep -cF '## Enmienda #172' ../docs/ui-guidelines.md` | `0` |
| B16 | último `### §2.N` de `../specs/mobile-ui-language/design.md` | `### §2.26 — Añadidos por #170 — Alertas agrupadas y mini-mapa` |
| B17 | `grep -cF 'size-16 items-center justify-center rounded-xl bg-accent-soft' src/screens/forgot/index.test.tsx src/__tests__/consistency-classnames.test.ts` | `5`, `1` |
| B18 | `grep -rn -- '-message"' src/screens/register` ; regex de `getAllByTestId` con prefijo `register-` en los tests | sin salida ; ninguno |
| B19 | `grep -rlF -e 'Country (2-letter code)' -e 'País (código de 2 letras)' src \| grep -v 'src/i18n/catalog.ts'` | sin salida |
| B20 | longitud de `SCREEN_FILES` (la suma de `no deja ningún valor fijo del catálogo como literal entero en las pantallas` de `src/__tests__/ui-language.test.ts`) | `30` |
| B21 | `grep -c '^export const' src/theme/motion.ts` | `17` |
| B22 | `grep -cF 'rounded-xl bg-default"'` en login, register, forgot y reset-password | `2`, `7`, `1`, `2` |
| B23 | `grep -cF "justifyContent: 'center'"` ; `grep -cF "alignItems: 'center'"`, en las mismas cuatro | `1`, `0`, `1`, `3` ; `0`, `0`, `1`, `2` |
| B24 | `ls assets/fonts \| wc -l` ; `grep -rlE 'extrabold\|ExtraBold' src \| wc -l` | `5` ; `0` |
| B25 | ficheros `.tsx` de `src` que no son test con `\bh-1[34]\b` | `0` |
| B26 | `grep -cF 'w-full rounded-xl bg-accent border-b-4 border-black/25'` ; `grep -cF 'w-full rounded-xl'`, en las mismas cuatro | `1`, `1`, `1`, `1` ; `1`, `1`, `2`, `1` |
| B27 | `grep -cF 'text-xs font-semibold text-foreground' src/screens/reset-password/index.tsx` | `2` |
| B28 | `grep -c 'secureTextEntry'` en las mismas cuatro | `1`, `2`, `0`, `2` |

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
| `src/providers/__tests__/language-provider.test.tsx` | 19 |
| `src/theme/__tests__/motion.test.ts` | 16 |
| `src/theme/__tests__/font-registration.test.ts` | 3 |

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
- Inter se carga en Regular, Medium, SemiBold, Bold y Black (B24). **No hay
  ExtraBold**: R6 lo añade como asset, sin dependencia nueva (P2).
- `src/theme/motion.ts` ya trae `MOTION_FLOAT_OFFSET_Y = 4` y
  `MOTION_FLOAT_TIMING` (1200 ms, `ReduceMotion.System`). Solo los usa la
  bienvenida, y siguen así: R4 añade constantes propias para las pantallas de
  cuenta (P8).
- `button__root--size-md` mide 48 de alto y `input__input` tiene un mínimo de
  48. Ninguna pantalla de producción usa hoy `h-13` ni `h-14` (B25).
- Los tests de pantalla montan con `<LanguageProvider initial="es">` (o
  `"en"`), igual que `src/screens/login/index.test.tsx`.

### Choques de integración

Medidos el 2026-10-13 sobre `3f9a60e2`. No se mide contra ramas sin
mergear: cada cifra absoluta que dependa de ellas se mide en H0 y la cifra
futura es `H0 + delta de #172`.

- **#168, #169 y #170, ya mergeadas en la base** (`788d1f89`, PR #213 la
  última). Lo que dejan en los ficheros de esta spec ya está en las cifras de
  §Base medida:
  - `specs/mobile-ui-language/design.md` termina en `### §2.26` (B16). La
    sección de #172 es la siguiente libre, §2.27 en la base, justo después de
    la tabla de §2.26 (R16).
  - La suma de longitud del catálogo de
    `src/providers/__tests__/language-provider.test.tsx` termina en
    `+ 2 // #169 R9` y `+ 7, // #170 R1`. El `+ 3, // #172 R16` va detrás,
    como último sumando, y `+ 7, // #170 R1` pierde su coma final. B11 al
    cerrar es B11 de H0 + 6 (en la base, 774).
  - En `src/__tests__/consistency-classnames.test.ts`, los dos recuentos de
    `bg-accent-soft` son `16 + 2 + 1 - 1` (#168 R5). #168, #169 y #170
    añadieron o cambiaron filas en `directUses` (`CONTINUOUS_CORNER`), en los
    secundarios de `#166 R3` y en los contadores de `#69 R10`. #172 no añade
    filas a ninguno de los tres: no crea ningún `style={CONTINUOUS_CORNER}` (B9 al cerrar = B9 de
    H0), no crea ningún secundario neutro (`forgot-resend` ya está, y su
    receta se busca con `toContain`) y no toca `counters`. El `it` `lleva los
    tres tiles restantes a rounded-xl` ya no lista el tile de `food.tsx`
    (#168 R8), pero conserva su título y el literal de Recuperar que cambia
    R14.
  - `src/__tests__/ui-copy-table.ts` (`R1_AUTH`, `R11_RESET`),
    `src/__tests__/ui-language.test.ts` (los dos `toHaveLength` que toca
    #172 y el sumatorio de `SCREEN_FILES`), las cuatro pantallas de cuenta,
    sus tests, `legibility-classnames`, `design-drift`, `motion.ts`,
    `global-css` y `font-registration` no cambiaron con la mezcla.
- Los deltas de #172 se escriben sobre la expresión que haya en H0,
  añadiendo su término al final.
- Toda tabla de esta spec con «antes» y «después» (Deltas de candados, las
  anclas de tasks.md) da el «después» como delta: si H0 mide otra cosa en un
  término ajeno a #172, ese término se conserva tal cual y solo se aplica el
  de #172.

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
  `register-header` pone rojos `#172 R3: la cabecera lleva la fila…`, por el
  `toHaveLength(2)` de `register-top.children`, y `#167 R7: campos, errores,
  términos y envío cuelgan del scroll`, porque `content.children[0]` deja de
  ser `register-header`.

### R4 — Pingo flota: constantes del canvas y componente compartido

THE SYSTEM SHALL declarar en `src/theme/motion.ts`, después de la sección
`#167 R2` (tras `MOTION_PING_TIMING`) y con el comentario `// #172 R4`, dos
constantes nuevas con los valores del canvas (`@keyframes float`: 10 px arriba
en un ciclo de 3 s, `ease-in-out`):

```ts
export const MOTION_PINGO_FLOAT_OFFSET_Y = 10;
export const MOTION_PINGO_FLOAT_TIMING = {
  duration: 1500,
  easing: Easing.bezier(0.42, 0, 0.58, 1),
  reduceMotion: ReduceMotion.System,
};
```

`duration` es medio ciclo, porque `withRepeat(…, -1, true)` sube y baja.
`Easing.bezier(0.42, 0, 0.58, 1)` es el `ease-in-out` de CSS. Las constantes de
la bienvenida (`MOTION_FLOAT_OFFSET_Y = 4`, `MOTION_FLOAT_TIMING` de 1200 ms) no
cambian, y la bienvenida sigue usándolas (P8).

THE SYSTEM SHALL ofrecer `PingoFloat` en `src/components/pingo-float.tsx`, con
props `testID: string` y `children: ReactNode`. Pinta un `Animated.View` con
ese `testID` y el estilo animado `transform: [{ translateY }]`:

- WHILE `useReducedMotion()` devuelve `false`, THE SYSTEM SHALL arrancar al
  montar `translateY.set(withRepeat(withTiming(-MOTION_PINGO_FLOAT_OFFSET_Y,
  MOTION_PINGO_FLOAT_TIMING), -1, true))` y cancelarla al desmontar con
  `cancelAnimation`.
- WHILE `useReducedMotion()` devuelve `true`, THE SYSTEM SHALL dejar
  `translateY` en `0` y no arrancar ninguna animación.

- Candados de las constantes en `src/theme/__tests__/motion.test.ts`:
  - `no exporta nada más` pasa de 17 a 19 nombres: añade
    `'MOTION_PINGO_FLOAT_OFFSET_Y'` y `'MOTION_PINGO_FLOAT_TIMING'`, en orden
    alfabético entre `'MOTION_PING_TO_SCALE'` y `'MOTION_POP_SPRING'`. El
    título no cambia.
  - `#172 R4: declara la flotación de Pingo del canvas: 10 px y medio ciclo de
    1500 ms ease-in-out`, en un `describe` nuevo `#172 R4: la flotación de
    Pingo en cuenta vive en motion.ts`. Asevera
    `expect(MOTION_PINGO_FLOAT_OFFSET_Y).toBe(10)` y
    `expect(MOTION_PINGO_FLOAT_TIMING).toEqual({ duration: 1500, easing: {
    bezier: [0.42, 0, 0.58, 1] }, reduceMotion: ReduceMotion.System })`, con
    la misma forma de `easing` que ya usan los `it` de `#153 R4` del fichero.
    También asevera que `MOTION_FLOAT_OFFSET_Y` sigue en `4` y que
    `MOTION_FLOAT_TIMING.duration` sigue en `1200`.
- Candados del componente en `src/components/__tests__/pingo-float.test.tsx`,
  fichero nuevo. Dobla `react-native-reanimated` igual que
  `src/components/__tests__/pop-in.test.tsx` (`...requireActual`,
  `__esModule: true` y `useReducedMotion` mockeado) y usa timers falsos:
  - `#172 R4: flota 10 px arriba en 1,5 s y vuelve en bucle`. Comprueba
    `getAnimatedStyle(getByTestId('float')).transform[0].translateY` con
    `toBeCloseTo(valor, 0)`. Los tiempos son acumulados y cada avance va con
    `await act(async () => { jest.advanceTimersByTime(n); })`:

    | Tiempo | `translateY` |
    |---|---|
    | al montar | `0` |
    | 750 ms | `-5` |
    | 1500 ms | `-10` |
    | 3000 ms | `0` |
    | 4500 ms | `-10` |

    Los valores son literales del test, nunca la constante importada. La
    curva es simétrica, así que a mitad de tramo el valor es la mitad.
  - `#172 R4: con reduce motion no se mueve`. Con `useReducedMotion`
    devolviendo `true`, `translateY` vale exactamente `0` a 0, 750 y 1500 ms.
  - `#172 R4: pasa testID y children`. `within(getByTestId('float'))
    .getByText('Hijo')` existe.
- Sonda S4a: quitar el `if (!reduceMotion)` pone rojo `#172 R4: con reduce
  motion…`, porque a 750 ms vale `-5` y no `0`.
- Sonda S4b: quitar `withRepeat` y dejar solo `withTiming` pone rojo `#172 R4:
  flota…` a 3000 ms (`-10` en lugar de `0`).
- Sonda S4c: cambiar el signo, `withTiming(MOTION_PINGO_FLOAT_OFFSET_Y, …)`,
  pone rojo `#172 R4: flota…` a 750 ms (`5` en lugar de `-5`).
- Sonda S4d: usar en `pingo-float.tsx` las constantes de la bienvenida
  (`MOTION_FLOAT_OFFSET_Y`, `MOTION_FLOAT_TIMING`) pone rojo `#172 R4: flota…`
  a 750 ms: el recorrido máximo es `-4`, así que nunca llega a `-5`.
- Sonda S4e: `MOTION_PINGO_FLOAT_OFFSET_Y = 4` en `motion.ts` pone rojo
  `#172 R4: declara la flotación de Pingo…` por `toBe(10)`, y también
  `#172 R4: flota…`.

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

### R6 — Tipografía de títulos, etiquetas, cuerpos y CTA, con Inter ExtraBold

THE SYSTEM SHALL cargar Inter ExtraBold (peso 800, P2):

- el asset `assets/fonts/Inter-ExtraBold.ttf` es `extras/ttf/Inter-ExtraBold.ttf`
  de `Inter-4.1.zip`, publicado en
  `https://github.com/rsms/inter/releases/download/v4.1/Inter-4.1.zip`. Mide
  421796 bytes y su sha256 es
  `e6756ad5690b77606aa62249a7b420d9902d45cae4b0048a24911fd4324b0a22`. Es la
  misma publicación de los cinco pesos que ya están en el repo: el sha256 de
  `Inter-Bold.ttf` y de `Inter-Black.ttf` coincide con los de `extras/ttf/` de
  ese zip;
- `src/app/_layout.tsx` añade a `useFonts`, justo después de la entrada
  `'Inter-Bold'`, la entrada
  `'Inter-ExtraBold': require('../../assets/fonts/Inter-ExtraBold.ttf'),`;
- el bloque `@theme` de `src/theme/global.css` añade, justo después de
  `--font-bold: 'Inter-Bold';`, la línea `--font-extrabold: 'Inter-ExtraBold';`.
  Así `font-extrabold` resuelve a la familia, igual que los otros pesos.

No hace falta ninguna dependencia: `expo-font` ya está instalado.

THE SYSTEM SHALL pintar en Iniciar sesión, Crear cuenta, Recuperar y Nueva
contraseña estas recetas, contadas por literal en la fuente de cada pantalla:

| Literal (`grep -cF`) | login | register | forgot | reset-password |
|---|---|---|---|---|
| `className="text-3xl font-black text-foreground"` | 1 | 1 | 0 | 0 |
| `className="text-center text-3xl font-black text-foreground"` | 0 | 0 | 1 | 0 |
| `className="flex-1 text-3xl font-black text-foreground"` | 0 | 0 | 0 | 2 |
| `<Label.Text className="text-label font-semibold text-muted">` | 2 | 7 | 1 | 2 |
| `<Label>` | 2 | 7 | 1 | 2 |
| `<Label className=` | 0 | 0 | 0 | 0 |
| `className="text-body font-semibold text-foreground"` (burbuja) | 1 | 0 | 0 | 0 |
| `className="text-body font-medium text-foreground"` (términos) | 0 | 1 | 0 | 0 |
| `className="text-center text-body font-normal text-muted"` (`forgot-body`) | 0 | 0 | 1 | 0 |
| `className="flex-1 text-body font-bold text-accent-strong"` (`reset-success`) | 0 | 0 | 0 | 1 |
| `<Button.Label className="text-cta font-extrabold text-accent-foreground">` | 1 | 1 | 1 | 1 |
| `<Button.Label className="text-cta font-extrabold text-foreground">` (`forgot-resend`) | 0 | 0 | 1 | 0 |
| `font-bold text-accent-foreground` | 0 | 0 | 0 | 0 |
| `text-2xl` | 0 | 0 | 0 | 1 |
| `text-xs` | 0 | 0 | 0 | 0 |

Cada pantalla tiene un `<Label.Text …>` por `TextField`. Los títulos de
Iniciar sesión y Crear cuenta se alinean al inicio, como en el canvas. El de
Recuperar sigue centrado. Los dos títulos de Nueva contraseña con token (el
formulario y el éxito) llevan `flex-1` porque comparten fila con Pingo (R19).
El único `text-2xl` de Nueva contraseña es el título de la rama sin token, que
no cambia. `forgot-resend` ocupa el sitio del CTA en «Revisa tu correo», así
que pesa como él.

- Candados:
  - `src/theme/__tests__/font-registration.test.ts` :: `#172 R6: carga Inter
    ExtraBold y la expone como font-extrabold`, en un `describe` nuevo `#172
    R6: el peso 800 del CTA es Inter ExtraBold`:
    - `existsSync(\`${projectRoot}/assets/fonts/Inter-ExtraBold.ttf\`)` es
      `true`;
    - `rootLayout` contiene
      `'Inter-ExtraBold': require('../../assets/fonts/Inter-ExtraBold.ttf')`;
    - `globalCss` contiene `--font-extrabold: 'Inter-ExtraBold';`.

    Los tres `it` de `R3: el layout registra los pesos estáticos de Inter sin
    bloquear` no cambian.
  - `src/__tests__/account-screens-polish.test.ts` (nuevo) :: `#172 R6: %s
    pinta títulos, etiquetas, cuerpos y CTA con su receta`. Es un `it.each`
    sobre las cuatro pantallas, y cada fila de la tabla es un `expect` de
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
  - En `src/screens/reset-password/index.test.tsx`, `#167 R10: el texto de
    éxito es tinta accent-strong y seleccionable` conserva su título, y su
    `.toBe('flex-1 font-bold text-accent-strong')` pasa a
    `.toBe('flex-1 text-body font-bold text-accent-strong')`.
- Sonda S6a: devolver una de las siete `Label.Text` de registro a
  `text-xs font-semibold text-foreground` pone roja la fila `register` del
  `it.each` (6 en lugar de 7).
- Sonda S6b: poner `text-cta font-bold text-accent-foreground` en
  `reset-submit` pone roja la fila `reset-password` (CTA 0 en lugar de 1, y
  `font-bold text-accent-foreground` 1 en lugar de 0).
- Sonda S6c: quitar `--font-extrabold: 'Inter-ExtraBold';` de `global.css`
  pone rojo `#172 R6: carga Inter ExtraBold…` por `toContain`.

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
`link-register`. R19 añade `login-spacer` entre el error y `login-submit`.

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
    `^…$` no deja entrar `login-error-row`, `login-password-group`,
    `login-password-toggle` ni `login-spacer` (R8, R9, R19).

    | `it` de hoy | `it` nuevo | Array esperado |
    |---|---|---|
    | `#167 R6: el cuerpo lleva el formulario en el orden de siempre` | `#172 R7: el cuerpo lleva correo, contraseña, olvido, envío y registro` | `['login-email', 'login-password', 'link-forgot', 'login-submit', 'link-register']` |
    | `#167 R6: con error, el error va entre la contraseña y el envío` | `#172 R7: con error, el error va entre el olvido y el envío` | `['login-email', 'login-password', 'link-forgot', 'login-error', 'login-submit', 'link-register']` |
    | `#167 R6: sin error, el cuerpo no lleva el error` | `#172 R7: sin error, el cuerpo no lleva el error` | `['login-email', 'login-password', 'link-forgot', 'login-submit', 'link-register']` |
- `links to register and forgot password` sigue verde: pulsa por `testID`, no
  depende del orden.
- En `legibility-classnames.test.ts`, las entradas de login (2) y forgot (1)
  de `inkSites` no cambian: cada pantalla conserva su número de
  `text-accent-strong` (B5). La de reset-password la sube R19.
- Sonda S7: dejar `link-forgot` al final del cuerpo, como hoy, pone rojos los
  tres `it` de orden por `toEqual`.

### R8 — Mostrar y ocultar la contraseña en los cinco campos de contraseña

THE SYSTEM SHALL ofrecer `PasswordInput` en `src/components/password-input.tsx`,
con prop `testID: string`. El resto de props se reenvían sin cambios a
`InputGroup.Input`, con el tipo
`Omit<ComponentProps<typeof InputGroup.Input>, 'testID' | 'secureTextEntry' | 'className'>`.
Pinta, en este orden:

- `InputGroup` con `testID={\`${testID}-group\`}`;
- dentro, `InputGroup.Input` con las props reenviadas y, después de ellas,
  `testID={testID}`, `className="h-13 rounded-xl bg-default"` y
  `secureTextEntry={!visible}`;
- dentro, un `InputGroup.Suffix` sin `isDecorative`, con un único `Pressable
  testID={\`${testID}-toggle\`} className="size-11 items-center
  justify-center" accessibilityRole="button"`.

Comportamiento:

- WHILE la contraseña está oculta (el estado inicial, `useState(false)`), THE
  SYSTEM SHALL dar al `Pressable` el nombre `t('common.showPassword')` y
  pintar dentro `<Eye size={20} color={muted} />`.
- WHILE la contraseña está visible, THE SYSTEM SHALL darle el nombre
  `t('common.hidePassword')` y pintar `<EyeOff size={20} color={muted} />`.
- WHEN el usuario pulsa el `Pressable`, THE SYSTEM SHALL invertir el estado de
  ese campo, y solo de ese campo.

`muted` sale de `const [muted] = useThemeColors(['muted']);`. Las dos claves se
escriben como dos llamadas literales
(`visible ? t('common.hidePassword') : t('common.showPassword')`) para que
`checkUses` las cuente. Las claves son `common.*` porque el ojo se usa en tres
pantallas (P6, R16).

THE SYSTEM SHALL pintar con `PasswordInput`, dentro de su `TextField` de hoy y
en el sitio de su `Input`, los cinco campos de contraseña:

| Pantalla | `testID` del campo | Grupo | Botón |
|---|---|---|---|
| Iniciar sesión | `login-password` | `login-password-group` | `login-password-toggle` |
| Crear cuenta | `register-password` | `register-password-group` | `register-password-toggle` |
| Crear cuenta | `register-password-confirmation` | `register-password-confirmation-group` | `register-password-confirmation-toggle` |
| Nueva contraseña | `reset-password` | `reset-password-group` | `reset-password-toggle` |
| Nueva contraseña | `reset-password-confirm` | `reset-password-confirm-group` | `reset-password-confirm-toggle` |

Cada campo conserva las props que pasa hoy (`value`, `onChangeText`,
`autoComplete`, etc.) salvo `secureTextEntry` y `className`, que ahora pone
`PasswordInput`. Ninguna de las tres pantallas importa ya `Eye`, `EyeOff` ni
`InputGroup`. `B13` mide hoy `0` ficheros con `InputGroup`; al cerrar, el único
es `src/components/password-input.tsx`.

- Candados del componente en `src/components/__tests__/password-input.test.tsx`
  (nuevo). Dobla `Eye` → `icon-eye` y `EyeOff` → `icon-eye-off` con
  `...requireActual`, como `src/screens/register/index.test.tsx` dobla
  `AlertCircle`, y `useThemeColors` como ese mismo fichero. Monta
  `<HeroUINativeProvider><LanguageProvider initial="es"><TextField><PasswordInput
  testID="pw" value="" onChangeText={jest.fn()} /></TextField></LanguageProvider></HeroUINativeProvider>`,
  con `HeroUINativeProvider` por fuera como en los tests de pantalla, porque
  `TextField` e `InputGroup` son de heroui:
  - `#172 R8: arranca oculta con «Mostrar contraseña» y el ojo`:
    - `pw` tiene `secureTextEntry` `true`;
    - `getByRole('button', { name: 'Mostrar contraseña' })` es `pw-toggle`;
    - su único hijo es `icon-eye`, con `size` 20 y `color` `color:muted`.
  - `#172 R8: el ojo alterna mostrar y ocultar`:
    - tras un `await fireEvent.press`, `secureTextEntry` es `false`, el nombre
      es `Ocultar contraseña` y el único hijo es `icon-eye-off`, con `size` 20
      y `color` `color:muted`;
    - tras otra pulsación vuelve al estado inicial.
  - `#172 R8: en inglés dice «Show password» y «Hide password»`. Con
    `initial="en"`, el nombre es `Show password` y, tras pulsar,
    `Hide password`.
  - `#172 R8: el grupo envuelve el campo de 52 y el botón de 44`:
    - `pw-group` contiene a `pw` y a `pw-toggle` (`toContainElement`);
    - `pw.props.className.split(' ')` contiene `h-13`, `rounded-xl` y
      `bg-default`;
    - `pw-toggle.props.className` es exactamente
      `size-11 items-center justify-center`.
- Candados de pantalla, uno por campo. Cada uno pulsa **su** botón con
  `await fireEvent.press` y comprueba, en este orden:
  1. antes de pulsar, el campo tiene `secureTextEntry` `true` y
     `getByTestId('<campo>-toggle').props.accessibilityLabel` es
     `Mostrar contraseña`;
  2. `getByTestId('<campo>-group')` contiene al campo y a su botón;
  3. tras pulsar, el campo tiene `secureTextEntry` `false` y el nombre es
     `Ocultar contraseña`;
  4. si la pantalla tiene otro campo de contraseña, ese otro sigue con
     `secureTextEntry` `true`.

  | Fichero | `it` |
  |---|---|
  | `src/screens/login/index.test.tsx` | `#172 R8: la contraseña de login lleva su ojo` |
  | `src/screens/register/index.test.tsx` | `it.each(['register-password', 'register-password-confirmation'])('#172 R8: %s lleva su propio ojo', …)`: dos filas, una por campo |
  | `src/screens/reset-password/index.test.tsx` | `it.each(['reset-password', 'reset-password-confirm'])('#172 R8: %s lleva su propio ojo', …)`: dos filas, una por campo |

  Con `getByRole` no basta en registro y nueva contraseña: hay dos botones con
  el mismo nombre. Por eso se busca por `testID`.
- `#167 R7: campos, errores, términos y envío cuelgan del scroll` de
  `src/screens/register/index.test.tsx` cambia en este mismo requisito, porque
  `register-password` y `register-password-confirmation` dejan de ser hijos
  directos de su `TextField`. Dentro del bucle `for (const field of fields)`,
  la raíz del campo pasa a ser el padre de su `FieldError`:

  ```ts
  const input = screen.getByTestId(`register-${field}`);
  const root = screen.getByTestId(`register-${field}-error`).parent;
  expect(root?.parent).toBe(content);
  expect(root).toContainElement(input);
  ```

  Sustituyen a las tres líneas de hoy del bucle, de
  `const input = screen.getByTestId(\`register-${field}\`);` a
  `expect(screen.getByTestId(\`register-${field}-error\`).parent).toBe(input.parent);`,
  para los siete campos. T12 sustituye después el `it` entero (R11).
- Sonda S8a: arrancar con `useState(true)` en `password-input.tsx` pone rojos
  ocho `it`: tres del componente (`#172 R8: arranca oculta…`, `#172 R8: el ojo
  alterna…` y `#172 R8: en inglés…`, porque el estado y el nombre salen
  invertidos) y los cinco candados de pantalla, porque `secureTextEntry` sale
  `false`. `#172 R8: el grupo envuelve…` sigue verde.
- Sonda S8b: intercambiar `Eye` y `EyeOff` pone rojos los dos primeros `it`
  del componente por el `testID` del hijo.
- Sonda S8c: sustituir `useState(false)` por un estado de módulo que comparten
  todas las instancias y que las repinta a todas al pulsar:

  ```ts
  let shared = false;
  const subs = new Set<() => void>();
  const subscribe = (cb: () => void) => { subs.add(cb); return () => { subs.delete(cb); }; };
  // dentro del componente:
  const visible = useSyncExternalStore(subscribe, () => shared);
  // onPress:
  shared = !shared; subs.forEach((cb) => cb());
  ```

  Pone rojas las cuatro filas de registro y nueva contraseña (2 failed en cada
  fichero): la primera de cada `it.each` en el paso 4, porque el otro campo
  sale `false`, y la segunda en el paso 1, porque la primera dejó el estado de
  módulo en `true`. Un `let shared` sin oyentes no vale como sonda: solo
  repinta la instancia pulsada y el paso 4 seguiría verde.
- Sonda S8d: en Nueva contraseña, dejar `reset-password-confirm` con el
  `Input` de hoy pone roja la fila `reset-password-confirm` del `it.each`,
  porque `getByTestId('reset-password-confirm-toggle')` lanza.

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
| Nueva contraseña | `reset-error` | `reset-error-row` |

Con esto, `login-error` y `register-error` pasan a ser seleccionables (O5 de la
review de #167). Registro deja de importar `AlertCircle` y `useThemeColors`.
`reset-error` ya era seleccionable; gana el icono y la receta 13/600 (P7). En
Nueva contraseña, `FormError` va en el sitio del
`<Text testID="reset-error" className="text-danger" selectable>` de hoy, y
su `message` es el texto que ese `Text` pinta hoy. `reset-missing-token` no
cambia (P7).

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
  - `src/screens/reset-password/index.test.tsx` :: `#172 R9: el error de nueva
    contraseña va con icono en su fila`. Lo mismo con `reset-error-row`, tras
    un `invalid-token`. El doble de `reicon-react-native` del fichero pasa de
    `{ ...actual, Check: mockIcon('icon-check') }` a
    `{ ...actual, AlertCircle: mockIcon('icon-alert-circle'), Check:
    mockIcon('icon-check') }`.
  - En `src/screens/reset-password/index.test.tsx`, el `it.each` `muestra el
    mensaje esperado para $kind y permite reintentar`, `une por salto de linea
    todos los mensajes de validacion` y los tres `#167 R10` que miran
    `reset-error` siguen verdes sin cambios: el `testID` sigue en el `Text`,
    `children` sigue siendo el mensaje, y la regex anclada
    `/^(reset-password|reset-password-confirm|reset-error|reset-submit)$/` no
    casa con `reset-error-row` ni con los `testID` de R8.
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
- Sonda S9c: lo mismo en Nueva contraseña pone rojo `#172 R9: el error de
  nueva contraseña…`.

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
    5. `getByTestId('register-password-group').parent`
    6. `getByTestId('register-password-confirmation-group').parent`
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
    Las raíces 5 y 6 se toman desde el grupo de R8, porque el campo de
    contraseña ya no es hijo directo de su `TextField`. Este `it` sustituye al
    `#167 R7` que R8 enmendó. R19 lo enmienda otra vez: añade
    `register-spacer` entre `register-error-row` y `register-submit`, y la
    longitud pasa a 10.
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
  `bg-accent-soft` cuenta 18 y no 17 (en la base).

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

### R16 — Copy nuevo, «País» y tabla de usos

THE SYSTEM SHALL declarar en `src/i18n/catalog.ts`, en los dos idiomas, tres
claves nuevas, con los literales que aprobó el humano (P1):

| Clave | `es` | `en` |
|---|---|---|
| `common.back` | `Volver` | `Back` |
| `common.showPassword` | `Mostrar contraseña` | `Show password` |
| `common.hidePassword` | `Ocultar contraseña` | `Hide password` |

Las dos del ojo son `common.*` porque `PasswordInput` (R8) las usa en tres
pantallas.

THE SYSTEM SHALL cambiar el valor de `register.country` (P3):

| Clave | `es` hoy | `es` al cerrar | `en` hoy | `en` al cerrar |
|---|---|---|---|---|
| `register.country` | `País (código de 2 letras)` | `País` | `Country (2-letter code)` | `Country` |

El campo conserva `autoCapitalize="characters"` y `maxLength={2}`. Ningún test
de hoy busca el literal viejo (B19).

THE SYSTEM SHALL registrar las cuatro claves en
`specs/mobile-ui-language/design.md`:

- bajo un encabezado nuevo, `### §2.N — Añadidos por #172 — Las pantallas de
  cuenta como el canvas`, justo después de la tabla de la última sección
  `### §2.N` que haya en H0 (en la base, §2.26; B16). N es el siguiente número
  libre, medido en H0: en la base, 27. Si otra feature ocupa §2.27 antes, N
  sube (§Choques de integración). El candado lo busca con `§2\.\d+`, así que
  no depende de N. La tabla lleva la cabecera de §2.24
  (`| # | Clave | \`en\` | \`es\` | Origen |`) y estas cuatro filas:

  ```
  | — | `common.back` | `Back` | `Volver` | ← añadida por #172 (R16) |
  | — | `common.showPassword` | `Show password` | `Mostrar contraseña` | ← añadida por #172 (R16) |
  | — | `common.hidePassword` | `Hide password` | `Ocultar contraseña` | ← añadida por #172 (R16) |
  | — | `register.country` | `Country` | `País` | ← cambiada por #172 (R16) |
  ```

- en la fila de hoy de `register.country`
  (`| 244 | \`register.country\` | \`Country (2-letter code)\` | \`País (código de 2 letras)\` |`),
  los dos valores pasan a `` `Country` `` y `` `País` ``, y la fila termina en
  `← literal cambiado por #172 (R16); antes \`Country (2-letter code)\` /
  \`País (código de 2 letras)\``, como la de `map.live` de #116.

THE SYSTEM SHALL añadir cuatro filas a `R1_AUTH` de
`src/__tests__/ui-copy-table.ts`, con el comentario `// #172 R16`:

- `{ file: 'src/components/password-input.tsx', key: 'common.showPassword' }`;
- `{ file: 'src/components/password-input.tsx', key: 'common.hidePassword' }`;
- `{ file: 'src/screens/register/index.tsx', key: 'forgot.invalidEmail' }`;
- `{ file: 'src/components/back-button.tsx', key: 'common.back' }`.

La fila de hoy `register/index.tsx` × `register.country` no cambia: la clave es
la misma.

- Candados:
  - `src/providers/__tests__/language-provider.test.tsx` :: `#172 R16: declara
    las claves de cuenta en los dos idiomas y su registro`, en un `describe`
    nuevo `#172 R16: el copy de las pantallas de cuenta como el canvas`:
    - los valores de las tres claves nuevas y los de `register.country` son
      exactamente los de las tablas, en `en` y en `es`;
    - para cada una de las cuatro claves, `languageDesign` casa
      ``'\\| — \\| `' + escapeRegExp(key) + '`[^\\n]*← (?:añadida|cambiada) por #172 \\(R16\\)'``;
    - casa `/### §2\.\d+ — Añadidos por #172 — Las pantallas de cuenta como el canvas/`.
  - El `it` de longitud del catálogo del mismo fichero suma `+ 3, // #172 R16`
    como último sumando. El sumando que cierre la suma en H0 pierde su coma
    final: en la base es `+ 7, // #170 R1`. `register.country` no suma:
    cambia de valor, no de número.
  - En `src/__tests__/ui-language.test.ts`, `resuelve las 36 ocurrencias
    normativas` pasa a `resuelve las 41 ocurrencias normativas`, con
    `toHaveLength(29 + 7 + 1 + 4); // #117 R10, #167 R6, #172 R16`. Esto cierra
    también O6 de la review de #167: el título decía 36 y la cuenta era 37.
  - El sumatorio de `SCREEN_FILES` de `no deja ningún valor fijo del catálogo
    como literal entero en las pantallas` suma
    `+ 2 // #172 R16: back-button y password-input` como último sumando. El
    sumando que cierre la suma en H0 pierde su coma final (en la base,
    `+ 2 - 2, // #167 R1: …`). `back-button.tsx` y `password-input.tsx` son
    los únicos ficheros nuevos con `t()`. La cuenta al cerrar es B20 medido en
    H0 + 2 (en la base, 30 + 2 = 32).
  - `resuelve las 41 ocurrencias normativas` (`checkUses(R1_AUTH)`),
    `resuelve cada ocurrencia de la tabla contra la clave exacta`
    (`checkUses(ALL_USES)`) y `mantiene el catálogo consistente entre los dos
    idiomas` siguen verdes con las filas nuevas.
- Sonda S16a: en `src/components/back-button.tsx`, cambiar `t('common.back')`
  por el literal `'Volver'` pone rojos, en `ui-language.test.ts`:
  - `resuelve las 41 ocurrencias normativas` y `resuelve cada ocurrencia de
    la tabla contra la clave exacta`, los dos por `checkUses`, con `uses: 0`
    en lugar de `1` para `back-button.tsx` × `common.back`;
  - `no deja ningún valor fijo del catálogo como literal entero en las
    pantallas`, con `looseCopy` `['es:common.back = Volver']` para
    `back-button.tsx`.
- Sonda S16b: en `src/components/password-input.tsx`, escribir el nombre como
  `t(visible ? 'common.hidePassword' : 'common.showPassword')` pone rojos
  `resuelve las 41 ocurrencias normativas` y `resuelve cada ocurrencia…`
  (`uses: 0` para las dos filas de `password-input.tsx`), aunque la pantalla
  siga diciendo lo mismo.
- Sonda S16c: dejar `register.country` en `País (código de 2 letras)` pone rojo
  `#172 R16: declara las claves…` por el valor `es`.

  `checkUses` solo cuenta las filas que existen: borrar una fila de `R1_AUTH`
  solo la pone roja por la longitud, no por el uso, y por eso las sondas mutan
  producción.

### R17 — Los ficheros nuevos no traen deriva

THE SYSTEM SHALL someter `components/back-button.tsx`,
`components/form-error.tsx`, `components/pingo-float.tsx` y
`components/password-input.tsx` a los cuatro `it` `#167 R14: …` de
`src/__tests__/design-drift.test.ts`, añadiéndolos al final de su lista
`featureFiles`, justo después de `'theme/motion.ts',`.

THE SYSTEM SHALL subir dos entradas del inventario `loginRoutes` de `#149 R4:
inventaría cada ruta a login en producción`:

| Entrada | Hoy (B6) | Al cerrar | Por qué |
|---|---|---|---|
| `'screens/forgot/index.tsx'` | `1` | `2, // #172 R17: forgot-back` | `forgot-back` añade el literal `"/login"` (`fallback`, R3) |
| `'screens/reset-password/index.tsx'` | `2` | `3, // #172 R19: link-login del formulario` | el formulario añade `router.push('/login')` (R19) |

Las entradas de registro y bienvenida no cambian, y el título del `describe`
(`solo cuatro ficheros de producción navegan a login`) sigue siendo cierto:
`back-button.tsx` no lleva ninguna ruta literal.

- Sonda S17a: un hex (`'#FFFFFF'`) en `pingo-float.tsx` pone rojo `#167 R14:
  sin hex, clases arbitrarias, StyleSheet ni sombras sueltas`.
- Sonda S17b: `className="h-[52px] rounded-xl bg-default"` en
  `password-input.tsx` pone rojo el mismo `it` por `ARBITRARY_CLASS`.
- Sonda S17c: `fallback="/welcome"` en recuperar pone rojo `#149 R4` (forgot 1
  en lugar de 2), además de S3b.
- Sonda S17d: quitar el `link-login` del formulario de nueva contraseña pone
  rojo `#149 R4` (reset 2 en lugar de 3), además de los candados de R19.

### R18 — Enmienda a la carta

THE SYSTEM SHALL añadir al final de `docs/ui-guidelines.md` la sección
§Enmienda a la carta de esta spec, palabra por palabra, con su casilla en el
estado en que esté en este fichero al implementar.

- Candado: `src/__tests__/account-screens-polish.test.ts` :: `#172 R18: la
  carta declara la enmienda #172 y su casilla`:
  - la carta contiene `## Enmienda #172 — Las pantallas de cuenta como el
    canvas`;
  - a partir de ese encabezado casa `/- \[[ xX]\] Enmienda aprobada por humano/`;
  - a partir de ese encabezado contiene los literales `PingoFloat`,
    `MOTION_PINGO_FLOAT_OFFSET_Y`, `forgot-lock-tile`, `font-extrabold`,
    `h-14`, `h-13` y `PasswordInput`.
- Sonda S18a: quitar la casilla de la carta pone rojo el `it` por `toMatch`.
- Sonda S18b: dejar en la carta `MOTION_FLOAT_OFFSET_Y` en lugar de
  `MOTION_PINGO_FLOAT_OFFSET_Y` pone rojo el `it` por `toContain`.

### R19 — La CTA se ancla al pie y el contenido deja de centrarse en vertical

Es la maqueta del canvas (P5): «Volver» arriba del todo (R3), la CTA anclada al
pie con un espaciador flexible y, en Nueva contraseña, el enlace de vuelta bajo
la CTA. Revierte el centrado vertical de `#61 R8` en las pantallas donde
cambia. **Solo cambia el centrado**: `ScrollView`,
`keyboardShouldPersistTaps="handled"`,
`contentInsetAdjustmentBehavior="automatic"`, el `KeyboardAvoidingView`, el
`padding`, el `gap` y los insets se quedan como están.

THE SYSTEM SHALL dejar el `contentContainerStyle` de cada scroll de cuenta
así:

| Scroll | Hoy | Al cerrar |
|---|---|---|
| `login-form` | `flexGrow: 1, justifyContent: 'center', padding: 24, gap: 16, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24` | `flexGrow: 1, padding: 24, gap: 16, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24` |
| `register-form` | `padding: 24, gap: 16, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96` | `flexGrow: 1, padding: 24, gap: 16, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96` |
| `forgot-form` (los dos estados) | `flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16, …` | `flexGrow: 1, alignItems: 'center', padding: 24, gap: 16, …` |
| `reset-password-form` (formulario) | `flexGrow: 1, justifyContent: 'center', padding: 24, gap: 16, …` | `flexGrow: 1, padding: 24, gap: 16, …` |
| `screen-reset-password` (éxito) | `flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16, …` | `flexGrow: 1, padding: 24, gap: 16, …` |
| `screen-reset-password` (sin token) | `flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16, …` | sin cambios |

Los `…` son los mismos `paddingTop: insets.top + 12` y
`paddingBottom: insets.bottom + 24` de hoy. Recuperar conserva
`alignItems: 'center'`: su canvas centra el bloque en horizontal.

THE SYSTEM SHALL pintar, como hermano inmediatamente anterior de la CTA, un
espaciador sin hijos escrito exactamente `<View testID="<id>" className="flex-1" />`,
con `testID` delante de `className` y autocerrado. Recuperar importa `View`
de `react-native` si R3 no lo ha importado ya:

| Pantalla y estado | Espaciador | Padre | Hermano anterior | Hermano siguiente |
|---|---|---|---|---|
| Iniciar sesión | `login-spacer` | `login-body` | `login-error-row` si hay error; si no, `link-forgot` | `login-submit` |
| Crear cuenta | `register-spacer` | contenido de `register-form` | `register-error-row` si hay error general; si no, la fila de términos | `register-submit` |
| Recuperar, formulario | `forgot-spacer` | contenido de `forgot-form` | `forgot-error-row` si hay error; si no, el campo de correo | `forgot-submit` |
| Recuperar, «Revisa tu correo» | `forgot-spacer` | contenido de `forgot-form` | `forgot-error-row` si hay error; si no, `forgot-body` | `forgot-resend` |
| Nueva contraseña, formulario | `reset-spacer` | `reset-body` | `reset-error-row` si hay error; si no, el campo de confirmación | `reset-submit` |
| Nueva contraseña, éxito | `reset-spacer` | contenido de `screen-reset-password` | `reset-success-pop` | `link-login` |

En Recuperar, el espaciador se pinta sin condición, delante de los dos
`{… ? <Button …/> : null}` de hoy, así que es el mismo nodo en los dos
estados. La rama sin token de Nueva contraseña no lleva espaciador.

Para que el espaciador crezca, su padre tiene que ocupar el alto libre:

- `login-body` pasa de `className="gap-4"` a `className="flex-1 gap-4"`;
- `reset-body` pasa de `className="gap-4"` a `className="flex-1 gap-4"`.

El contenido de `register-form`, `forgot-form` y `screen-reset-password` ya
crece por `flexGrow: 1`.

THE SYSTEM SHALL alinear al inicio la cabecera de Nueva contraseña, en el
formulario y en el éxito: `reset-header` pasa de `className="flex-row
items-center justify-center gap-3"` a `className="flex-row items-center
gap-3"`. El título lleva `flex-1` (R6).

THE SYSTEM SHALL pintar en Nueva contraseña el enlace de vuelta bajo la CTA,
como en el canvas (`canvas/NuevaContrasena.dc.html`):

- en el formulario, dentro de `reset-body` y justo después de `reset-submit`,
  un enlace nuevo:

  ```tsx
  <LinkButton testID="link-login" className="h-13 w-full" onPress={() => router.push('/login')}>
    <LinkButton.Label className="text-base font-bold text-accent-strong">
      {t('resetPassword.backToSignIn')}
    </LinkButton.Label>
  </LinkButton>
  ```

- en el éxito, el `link-login` de hoy cambia `className="self-center"` por
  `className="h-13 w-full"`, y su `LinkButton.Label` pasa de `font-semibold
  text-accent-strong` a `text-base font-bold text-accent-strong`.

El `link-login` de la rama sin token no cambia. La receta es la de
`link-login` de Recuperar (R7). Las tres ramas son excluyentes, así que nunca
hay dos `link-login` en pantalla.

- Candados de `contentContainerStyle`, en los tests de pantalla:
  - `src/screens/login/index.test.tsx`: `centra el contenido dentro de un
    ScrollView con los insets aplicados` pasa a `#172 R19: ancla el contenido
    al pie dentro de un ScrollView con los insets aplicados`. Su `toEqual`
    pierde `justifyContent: 'center'` y queda `{ flexGrow: 1, padding: 24,
    gap: 16, paddingTop: 52, paddingBottom: 48 }`. Las aserciones de
    `keyboardShouldPersistTaps` y `contentInsetAdjustmentBehavior` no cambian.
    `no centra horizontalmente, que no lo hacía el View de hoy` no cambia.
  - `src/screens/register/index.test.tsx`: `aplica el padding del
    contentContainerStyle con los safe-area insets` conserva su título, y su
    `toEqual` pasa a `{ flexGrow: 1, padding: 24, gap: 16, paddingTop: 52,
    paddingBottom: 120 }`.
  - `src/screens/forgot/index.test.tsx`: `conserva el centrado de hoy dentro
    de un ScrollView con insets` pasa a `#172 R19: centra en horizontal pero
    no en vertical dentro de un ScrollView con insets`. Su `toEqual` pierde
    `justifyContent: 'center'` y queda `{ flexGrow: 1, alignItems: 'center',
    padding: 24, gap: 16, paddingTop: 52, paddingBottom: 48 }`. El resto del
    `it` no cambia.
  - `src/screens/reset-password/index.test.tsx`, `describe` `#61 R8: las tres
    ramas de reset tienen contenedor de scroll`:
    - la constante `metrics` pierde `justifyContent: 'center'`;
    - `la rama sin token centra también en horizontal` conserva su título, y su
      `toEqual` pasa a `{ ...metrics, justifyContent: 'center', alignItems:
      'center' }`: el objeto esperado es el mismo de hoy;
    - `la rama de éxito centra también en horizontal` pasa a `#172 R19: la
      rama de éxito ancla el enlace al pie y no centra`, con
      `toEqual(metrics)`;
    - `la rama del formulario no centra en horizontal` pasa a `#172 R19: la
      rama del formulario ancla el envío al pie y no centra`, con
      `toEqual(metrics)`. La aserción de `keyboardShouldPersistTaps` no
      cambia.
- Candados del espaciador, uno por pantalla y uno por estado. Cada `it` toma
  `spacer = getByTestId('<id>')` y `cta = getByTestId('<CTA>')`, y comprueba:
  1. `spacer.parent` es `cta.parent`, y ese padre es el de la tabla;
  2. `spacer.parent.children.indexOf(spacer)` es
     `spacer.parent.children.indexOf(cta) - 1`;
  3. `spacer.props.className` es exactamente `flex-1`, y `spacer.children`
     tiene longitud 0;
  4. si el estado lleva error, `spacer.parent.children.indexOf(errorRow)` es
     el índice del espaciador menos uno.

  | Fichero | `it` | Estados que recorre |
  |---|---|---|
  | `src/screens/login/index.test.tsx` | `#172 R19: el espaciador empuja el envío al pie` | sin error, y otra vez tras un login fallido (paso 4 con `login-error-row`) |
  | `src/screens/register/index.test.tsx` | `#172 R19: el espaciador empuja el envío al pie` | sin error, y otra vez con un error general (paso 4 con `register-error-row`) |
  | `src/screens/forgot/index.test.tsx` | `#172 R19: el espaciador empuja la CTA al pie en los dos estados` | formulario con `forgot-submit`; «Revisa tu correo» tras `ok`, con `forgot-resend` |
  | `src/screens/reset-password/index.test.tsx` | `#172 R19: el espaciador empuja el envío al pie del formulario` | sin error, y otra vez tras `invalid-token` (paso 4 con `reset-error-row`) |
  | `src/screens/reset-password/index.test.tsx` | `#172 R19: el espaciador empuja el enlace al pie del éxito` | éxito, con `link-login` como CTA; paso 2 y además el hermano anterior es `reset-success-pop` |

  Los padres se comprueban así: en login, `spacer.parent` tiene `testID`
  `login-body`; en nueva contraseña, `reset-body` en el formulario y, en el
  éxito, `spacer.parent` es `getByTestId('reset-header').parent`; en registro,
  `getByTestId('register-header').parent`; en recuperar,
  `getByTestId('forgot-top').parent`.
- Candado del enlace del formulario:
  `src/screens/reset-password/index.test.tsx` :: `#172 R19: el formulario
  lleva el enlace de vuelta al login bajo el envío`:
  - `within(getByTestId('reset-body')).getByTestId('link-login')` existe y
    tiene el texto `Volver al inicio de sesión`;
  - su índice en `reset-body.children` es el de `reset-submit` más uno;
  - tras `await fireEvent.press`, `mockRouter.push` se llamó con `'/login'` y
    `mockResetPassword` no se llamó.
- Candado de fuente: `src/__tests__/account-screens-polish.test.ts` ::
  `#172 R19: el contenido de cuenta no se centra en vertical y el enlace de
  nueva contraseña lleva su receta`:

  | Literal o regex | login | register | forgot | reset-password |
  |---|---|---|---|---|
  | `justifyContent: 'center'` (`grep -cF`) | 0 | 0 | 0 | 1 |
  | `alignItems: 'center'` (`grep -cF`) | 0 | 0 | 1 | 1 |
  | `-spacer" className="flex-1" />` (`grep -cF`) | 1 | 1 | 1 | 2 |
  | `/testID="link-login"\s+className="h-13 w-full"/g` | 0 | 0 | 1 | 2 |
  | `<LinkButton.Label className="text-base font-bold text-accent-strong">` (`grep -cF`) | 1 | 0 | 1 | 2 |
  | `self-center` (`grep -cF`) | 0 | 0 | 0 | 0 |

  El único `justifyContent: 'center'` y el único `alignItems: 'center'` de
  nueva contraseña son los de la rama sin token. El literal del espaciador no
  casa con los `className="flex-1"` de los `KeyboardAvoidingView` ni de las
  celdas de R11.
- Candados que cambian de literal:
  - `src/screens/login/index.test.tsx` :: `#167 R6: entra en dos tiempos,
    cabecera y cuerpo`: en el mapa de `mockHomeEntrance`, `'login-body'` pasa de
    `className: 'gap-4'` a `className: 'flex-1 gap-4'`. El título y el
    `index: 1` no cambian.
  - `src/screens/reset-password/index.test.tsx` :: `#167 R10: el formulario
    entra en dos tiempos`: `'reset-header'` pasa a `className: 'flex-row
    items-center gap-3'` y `'reset-body'` a `className: 'flex-1 gap-4'`.
  - `src/screens/reset-password/index.test.tsx` :: `#167 R10: el éxito conserva
    la cabecera del formulario`: el `className` esperado pasa a `'flex-row
    items-center gap-3'`.
  - `src/screens/register/index.test.tsx` :: `#172 R11: cabecera, rejilla,
    términos, error y envío cuelgan del scroll`: `content.children` pasa de
    longitud 9 a 10, con `register-spacer` en la posición 9 y
    `register-submit` en la 10. El título no cambia.
  - `src/__tests__/legibility-classnames.test.ts`: en `inkSites`, la entrada
    de `reset-password` pasa de `3` a `4, // #172 R19: link-login del
    formulario`, y la suma de `suma las trece ocurrencias que enumera la spec`
    añade `+ 1, // #172 R19` como último sumando (el que cierre la suma en
    H0 pierde su coma final; en la base, `+ 1, // #167 R10`). El título no
    cambia.
  - `src/__tests__/ui-copy-table.ts`: `R11_RESET` añade al final
    `{ file: 'src/screens/reset-password/index.tsx', key: 'resetPassword.backToSignIn' }, // #172 R19`.
    En `src/__tests__/ui-language.test.ts`, `resuelve las 15 ocurrencias
    normativas` pasa a `resuelve las 16 ocurrencias normativas`, con
    `toHaveLength(15 + 1); // #172 R19`. Ese `it` llama a
    `checkUses(R11_RESET)`, así que sale rojo hasta que el formulario pinta su
    tercer `t('resetPassword.backToSignIn')`, igual que `resuelve cada
    ocurrencia de la tabla contra la clave exacta`.
  - `src/__tests__/design-drift.test.ts` :: `#149 R4`: en `loginRoutes`,
    `'screens/reset-password/index.tsx'` pasa de `2` a
    `3, // #172 R19: link-login del formulario`. R17 lo declara; lo cambia
    esta tarea, porque el enlace nuevo es de R19.
- Siguen verdes sin cambios: `#61 R8: … no centra horizontalmente…`, los
  tres `#172 R7` de orden de login (su regex anclada no deja entrar
  `login-spacer`), `#167 R10: la cabecera va antes que el cuerpo en el scroll`
  (el enlace nuevo vive dentro de `reset-body`), `#167 R10: el éxito pinta
  cabecera, tarjeta y enlace, sin cuerpo` (su regex anclada no deja entrar
  `reset-spacer`), `#167 R10: con error, el error va entre la confirmación y
  el envío`, y los tres `it` que pulsan `link-login` en la rama sin token y en
  el éxito.
- Sonda S19a: devolver `justifyContent: 'center'` al scroll de login pone rojo
  `#172 R19: ancla el contenido al pie…` por `toEqual`, y la fila `login` del
  candado de fuente.
- Sonda S19b: mover `login-spacer` detrás de `login-submit` pone rojo `#172
  R19: el espaciador empuja el envío al pie` de login, por el paso 2.
- Sonda S19c: pintar `forgot-spacer` solo en el formulario (`{!sent ? <View …/>
  : null}`) pone rojo el `it` de recuperar en «Revisa tu correo», porque
  `getByTestId('forgot-spacer')` lanza.
- Sonda S19d: dejar `reset-body` en `gap-4` pone rojo `#167 R10: el formulario
  entra en dos tiempos` por el `className` del mapa.
- Sonda S19e: poner el `link-login` del formulario fuera de `reset-body`,
  justo después de `</HomeEntrance>`, pone rojo `#172 R19: el formulario lleva
  el enlace…` (`within(reset-body)` lanza) y `#167 R10: la cabecera va antes
  que el cuerpo en el scroll` (tres hijos y no dos).
- Sonda S19f: dejar `register-form` sin `flexGrow: 1` pone rojo `aplica el
  padding del contentContainerStyle…` por `toEqual`.

### R20 — CTA de 56 e inputs de 52

THE SYSTEM SHALL dar a la CTA de las cuatro pantallas una altura de 56
(`h-14`), con la clase justo detrás de `w-full`:

| Botón | `className` hoy | `className` al cerrar |
|---|---|---|
| `login-submit`, `register-submit`, `forgot-submit`, `reset-submit` | `w-full rounded-xl bg-accent border-b-4 border-black/25` | `w-full h-14 rounded-xl bg-accent border-b-4 border-black/25` |
| `forgot-resend` | `w-full rounded-xl border-2 border-b-6 border-lip-gray bg-surface` | `w-full h-14 rounded-xl border-2 border-b-6 border-lip-gray bg-surface` |

`h-14` gana a la altura de `button__root--size-md` (48) por el mismo mecanismo
con el que `rounded-xl` gana a su radio. El `size` de los botones no cambia
(design.md D15).

THE SYSTEM SHALL dar a cada input de las cuatro pantallas una altura de 52
(`h-13`): todo `className="rounded-xl bg-default"` de un `Input` de cuenta pasa
a `className="h-13 rounded-xl bg-default"`. Los de contraseña ya la llevan por
`PasswordInput` (R8).

| Literal (`grep -cF`) | login | register | forgot | reset-password | `password-input.tsx` |
|---|---|---|---|---|---|
| `className="h-13 rounded-xl bg-default"` | 1 | 5 | 1 | 0 | 1 |
| `className="rounded-xl bg-default"` | 0 | 0 | 0 | 0 | 0 |
| `w-full h-14 rounded-xl bg-accent border-b-4 border-black/25` | 1 | 1 | 1 | 1 | 0 |
| `w-full rounded-xl` | 0 | 0 | 0 | 0 | 0 |
| `w-full h-14 rounded-xl border-2 border-b-6 border-lip-gray bg-surface` | 0 | 0 | 1 | 0 | 0 |

Base: B26 cuenta 1, 1, 2 y 1 `w-full rounded-xl` (el primario, más
`forgot-resend` en recuperar) y B22 cuenta 2, 7, 1 y 2 `rounded-xl bg-default"`;
los cinco campos de contraseña pasan a `PasswordInput` (R8), así que quedan 1,
5, 1 y 0. Los inputs de registro van a 52 y no a los 50 de su canvas
(decisión del humano, P5).

- Candado de fuente: `src/__tests__/account-screens-polish.test.ts` ::
  `#172 R20: %s pinta la CTA de 56 y los inputs de 52`. Es un `it.each` sobre
  los cinco ficheros de la tabla, con un `expect` de conteo exacto por fila
  (`split(literal).length - 1`).
- Candados de clase exacta que cambian. Los cuatro `it` de `#127 R1` conservan
  su título, y su `className` esperado inserta `h-14 ` justo después de
  `w-full `:

  | Fichero | `it` |
  |---|---|
  | `src/screens/login/index.test.tsx` | `pinta login-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente` |
  | `src/screens/register/index.test.tsx` | `pinta register-submit, deshabilitado al montar, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente` |
  | `src/screens/forgot/index.test.tsx` | `pinta forgot-submit, deshabilitado, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente` |
  | `src/screens/reset-password/index.test.tsx` | `pinta reset-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente` |

  Por ejemplo, el de login pasa a `'pressable-feedback__root button__root
  button__root--variant-primary button__root--size-md w-full h-14 rounded-xl
  bg-accent border-b-4 border-black/25'`.
- Siguen verdes sin cambios en `src/__tests__/consistency-classnames.test.ts`:
  la regex de primarios `rounded-xl bg-accent border-b-4
  border-black\/25(?=[\s'"\`])` de `#120` y el recuento de 19 primarios, porque
  `h-14` va delante de `rounded-xl`; y la receta de secundario de `#166 R3`,
  que se busca con `toContain` en la etiqueta de apertura.
- Sonda S20a: quitar `h-14` de `forgot-resend` pone roja la fila `forgot` del
  `it.each` (0 en lugar de 1).
- Sonda S20b: dejar el correo de login en `className="rounded-xl
  bg-default"` pone roja la fila `login` (`h-13` 0 en lugar de 1, y el literal
  sin altura 1 en lugar de 0).
- Sonda S20c: `size="lg"` en `reset-submit` con el `h-14` puesto pone rojo
  `pinta reset-submit con la clase exacta…`, porque la clase lleva
  `button__root--size-lg`.
- Sonda S20d: quitar `h-13 ` del `className` de `password-input.tsx` pone
  roja la fila `password-input` del `it.each` (`h-13` 0 en lugar de 1, y el
  literal sin altura 1 en lugar de 0) y `#172 R8: el grupo envuelve el campo
  de 52 y el botón de 44`. Esa fila nace verde en el rojo de R20, porque R8 ya
  puso la altura; esta sonda es su prueba de que mira.

### R21 — Prueba de humo del humano en Android

WHEN Codex termina y el reviewer aprueba, THE SYSTEM SHALL pasar la prueba de
humo del humano en un **dev build de Android** (no Expo Go), con la casilla de
`traceability.md` §Prueba de humo firmada. La lista de comprobaciones está en
esa sección.

- Sin candado automático: la cierra el humano.

## Deltas de candados

Todo candado existente que esta spec toca, con su valor antes y después. Las
cifras parten de la base. Si H0 mide otra cosa, se aplica el delta: los
términos ajenos a #172 se conservan y se añade el de #172 al final
(§Choques de integración). «Se
revierte» marca los candados de `#61 R8` cuyo centrado vertical deshace R19
(P5); el resto se actualiza.

| Fichero | `it` (título de hoy) | Literal o cifra antes | Después | R |
|---|---|---|---|---|
| `src/__tests__/consistency-classnames.test.ts` | `lleva los tres tiles restantes a rounded-xl` | `'size-16 items-center justify-center rounded-xl bg-accent-soft'` | `'size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent'` | R14 |
| ídem | `resuelve el Lock de Forgot con accent-strong` | título; `"const [accentStrong] = useThemeColors(['accent-strong']);"`; `'<Lock size={28} color={accentStrong} />'` | título `resuelve el Lock de Forgot con accent-foreground`; `"const [accentForeground] = useThemeColors(['accent-foreground']);"`; `'<Lock size={26} color={accentForeground} />'`. El `import` no cambia | R14 |
| ídem | `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban` | `count(/bg-accent-soft/g)).toBe(16 + 2 + 1 - 1)` (#168 R5) | `toBe(16 + 2 + 1 - 1 - 1)` con el comentario de hoy más `; #172 R14: forgot-lock-tile pasa a bg-accent`. Primarios (19) y `CONTINUOUS_CORNER` sin cambios | R14 |
| ídem | `conserva los usos de bg-accent-soft que sí son acento` | `toBe(16 + 2 + 1 - 1)` (#168 R5) | `toBe(16 + 2 + 1 - 1 - 1)` con el comentario de hoy más `; #172 R14` | R14 |
| ídem | `no deja la receta del labio fuera de un primario` | `toBe(19)` ×2 | título `no deja la receta del labio fuera de un primario salvo el candado de Recuperar`; `toBe(19 + 1)` ×2 con `// #172 R14: forgot-lock-tile (Enmienda #172)` | R14 |
| ídem | `inventaría los diecinueve primarios con labio, fichero a fichero` | forgot `1` | sin cambios: el tile no casa con `rounded-xl bg-accent`, y `h-14` va delante de `rounded-xl` | R14, R20 |
| `src/__tests__/legibility-classnames.test.ts` | `inkSites` (`%s pinta con text-accent-strong (%i)`) | reset-password `3` | `4, // #172 R19: link-login del formulario`. Login 2 y forgot 1 sin cambios | R19 |
| ídem | `suma las trece ocurrencias que enumera la spec` | termina en `+ 1, // #167 R10` | `+ 1, // #172 R19` como último sumando; el que cierre en H0 pierde su coma. El título no cambia | R19 |
| `src/__tests__/design-drift.test.ts` | `#149 R4: inventaría cada ruta a login en producción` | forgot `1`; reset-password `2` | forgot `2, // #172 R17: forgot-back`; reset-password `3, // #172 R19: link-login del formulario` | R17, R19 |
| ídem | lista `featureFiles` de los cuatro `#167 R14: …` | termina en `'theme/motion.ts',` | más `'components/back-button.tsx'`, `'components/form-error.tsx'`, `'components/pingo-float.tsx'` y `'components/password-input.tsx'` | R17 |
| `src/__tests__/ui-language.test.ts` | `resuelve las 36 ocurrencias normativas` | `toHaveLength(29 + 7 + 1)` | título con `41`; `toHaveLength(29 + 7 + 1 + 4)` | R16 |
| ídem | `resuelve las 15 ocurrencias normativas` | `toHaveLength(15)` | título con `16`; `toHaveLength(15 + 1); // #172 R19` | R19 |
| ídem | `no deja ningún valor fijo del catálogo como literal entero en las pantallas` | sumatorio de `SCREEN_FILES` (B20: 30) | `+ 2 // #172 R16: back-button y password-input` como último sumando (B20 de H0 + 2; en la base, 32) | R16 |
| `src/__tests__/ui-copy-table.ts` | `R1_AUTH` | 37 filas (B10) | B10 de H0 + 4 (en la base, 41) | R16 |
| ídem | `R11_RESET` | 15 filas | 16 filas: `resetPassword.backToSignIn` del formulario | R19 |
| `src/providers/__tests__/language-provider.test.tsx` | `it` de longitud del catálogo | termina en `+ 7, // #170 R1` | `+ 3, // #172 R16` como último sumando; `+ 7, // #170 R1` pierde su coma | R16 |
| `src/theme/__tests__/motion.test.ts` | `no exporta nada más` | 17 nombres (B21) | 19 nombres: `'MOTION_PINGO_FLOAT_OFFSET_Y'` y `'MOTION_PINGO_FLOAT_TIMING'` entre `'MOTION_PING_TO_SCALE'` y `'MOTION_POP_SPRING'` | R4 |
| `src/screens/login/index.test.tsx` | `#167 R6: la cabecera lleva el saludo y después el título` | 2 hijos | sustituido por `#172 R3: la cabecera lleva Volver, el saludo y el título` | R3 |
| ídem | `#167 R6: el título de la cabecera conserva su clase` | `'text-center text-2xl font-black text-foreground'` | sustituido por `#172 R6: el título de la cabecera pesa 30/900 al inicio` | R6 |
| ídem | `#167 R6: la burbuja dice el saludo en español` | `'text-sm font-semibold text-foreground'` | `'text-body font-semibold text-foreground'`; el título no cambia | R6 |
| ídem | los tres `it` de orden `#167 R6` | `link-register` antes que `link-forgot` | sustituidos por los tres `#172 R7` | R7 |
| ídem | `#167 R6: entra en dos tiempos, cabecera y cuerpo` | `'login-body'`: `className: 'gap-4'` | `className: 'flex-1 gap-4'` | R19 |
| ídem | `centra el contenido dentro de un ScrollView con los insets aplicados` (`#61 R8`) | `justifyContent: 'center'` en el `toEqual` | se revierte: sustituido por `#172 R19: ancla el contenido al pie dentro de un ScrollView con los insets aplicados`, sin `justifyContent` | R19 |
| ídem | `pinta login-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente` (`#127 R1`) | `… button__root--size-md w-full rounded-xl …` | `… button__root--size-md w-full h-14 rounded-xl …` | R20 |
| `src/screens/register/index.test.tsx` | `#167 R7: la cabecera lleva a Pingo y después el título` | `[register-pingo, título]` | en T5, `children[0]` pasa a `register-pingo-float`; en T6, sustituido por `#172 R3: la cabecera lleva la fila Volver-Pingo y después el título` | R5, R3 |
| ídem | `#167 R7: la cabecera entra con rise` | `className: 'flex-row items-center justify-center gap-3'` | `className: 'gap-2'`; el título no cambia | R3 |
| ídem | `#167 R7: el título de la cabecera conserva su clase` | `'text-center text-2xl font-black text-foreground'` | sustituido por `#172 R6: el título de la cabecera pesa 30/900 al inicio` | R6 |
| ídem | `#167 R7: campos, errores, términos y envío cuelgan del scroll` | estructura plana | en T10, la raíz de cada campo se toma del padre de su `FieldError` (R8); en T12, sustituido por `#172 R11: cabecera, rejilla, términos, error y envío cuelgan del scroll` (9 hijos); en T20, 10 hijos con `register-spacer` | R8, R11, R19 |
| ídem | `#167 R8: el error general va en una fila con icono` | `'flex-row items-center gap-1.5'` | `'w-full flex-row items-center gap-1.5'` | R9 |
| ídem | `#167 R8: el texto del error pesa como el icono` | `'flex-1 text-sm font-semibold text-danger'` | `'flex-1 text-label font-semibold text-danger'` | R9 |
| ídem | `aplica el padding del contentContainerStyle con los safe-area insets` (`#61 R7`) | `{ padding: 24, gap: 16, paddingTop: 52, paddingBottom: 120 }` | `{ flexGrow: 1, padding: 24, gap: 16, paddingTop: 52, paddingBottom: 120 }`; el título no cambia | R19 |
| ídem | `pinta register-submit, deshabilitado al montar, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente` (`#127 R1`) | `… w-full rounded-xl …` | `… w-full h-14 rounded-xl …` | R20 |
| `src/screens/forgot/index.test.tsx` | helper `lockTile()` y `LOCK_TILE_CLASS` | busca por `className` | busca por `testID`; la constante desaparece | R14 |
| ídem | `el tile Lock sigue en pie en los dos estados` y los dos `#167 R9: el tile entra con pop…` | 4 literales del tile viejo | 4 literales del tile nuevo | R14 |
| ídem | helper `expectPingoBeforeLock` | estructura sobre `forgot-pingo` | estructura sobre `forgot-pingo-float` | R5 |
| ídem | `conserva el centrado de hoy dentro de un ScrollView con insets` (`#61 R8`) | `justifyContent: 'center'` en el `toEqual` | se revierte: sustituido por `#172 R19: centra en horizontal pero no en vertical dentro de un ScrollView con insets`, sin `justifyContent` y con `alignItems: 'center'` | R19 |
| ídem | `pinta forgot-submit, deshabilitado, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente` (`#127 R1`) | `… w-full rounded-xl …` | `… w-full h-14 rounded-xl …` | R20 |
| `src/screens/reset-password/index.test.tsx` | `#167 R10: la cabecera lleva a Pingo y después el título` | `children[0]` es `reset-pingo` | `children[0]` es `reset-pingo-float` | R5 |
| ídem | `#167 R10: el éxito conserva la cabecera del formulario` | `children[0]` es `reset-pingo`; `className` `'flex-row items-center justify-center gap-3'` | `children[0]` es `reset-pingo-float` (T5); `className` `'flex-row items-center gap-3'` (T20) | R5, R19 |
| ídem | `#167 R10: el formulario entra en dos tiempos` | `'reset-header'`: `'flex-row items-center justify-center gap-3'`; `'reset-body'`: `'gap-4'` | `'flex-row items-center gap-3'` y `'flex-1 gap-4'` | R19 |
| ídem | `#167 R10: el texto de éxito es tinta accent-strong y seleccionable` | `'flex-1 font-bold text-accent-strong'` | `'flex-1 text-body font-bold text-accent-strong'`; el título no cambia | R6 |
| ídem | `describe` `#61 R8: las tres ramas de reset tienen contenedor de scroll`, constante `metrics` | con `justifyContent: 'center'` | sin `justifyContent` | R19 |
| ídem | `la rama sin token centra también en horizontal` (`#61 R8`) | `{ ...metrics, alignItems: 'center' }` | `{ ...metrics, justifyContent: 'center', alignItems: 'center' }`: el mismo objeto; el título no cambia | R19 |
| ídem | `la rama de éxito centra también en horizontal` (`#61 R8`) | `{ ...metrics, alignItems: 'center' }` | se revierte: sustituido por `#172 R19: la rama de éxito ancla el enlace al pie y no centra`, con `toEqual(metrics)` | R19 |
| ídem | `la rama del formulario no centra en horizontal` (`#61 R8`) | `toEqual(metrics)` con `justifyContent` | se revierte: sustituido por `#172 R19: la rama del formulario ancla el envío al pie y no centra`, con `toEqual(metrics)` sin `justifyContent` | R19 |
| ídem | `pinta reset-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente` (`#127 R1`) | `… w-full rounded-xl …` | `… w-full h-14 rounded-xl …` | R20 |

## Enmienda a la carta

R18 copia este texto al final de `docs/ui-guidelines.md`:

```markdown
## Enmienda #172 — Las pantallas de cuenta como el canvas

Iniciar sesión, Crear cuenta, Recuperar contraseña y Nueva contraseña siguen
el canvas de #172 (`specs/mobile-account-screens-polish/canvas/`).

**Pingo flota.** Los bucles de reposo de §Animación se amplían a tres
pantallas de cuenta: en Crear cuenta, Recuperar contraseña y Nueva contraseña,
Pingo flota con el componente compartido `PingoFloat`
(`src/components/pingo-float.tsx`). Anima `translateY` hasta
`-MOTION_PINGO_FLOAT_OFFSET_Y` (10) con `MOTION_PINGO_FLOAT_TIMING` (1500 ms
por tramo, `ease-in-out`), en bucle infinito e invertido, y lo cancela al
desmontar. Con reduce motion no arranca. La bienvenida conserva su flotación
de 4 px. Iniciar sesión no flota: Pingo saluda con su burbuja. Ninguna otra
pantalla usa `PingoFloat` sin una enmienda propia.

**El candado lleva labio.** El tile del candado de Recuperar
(`forgot-lock-tile`) es un tile acento con labio: `rounded-xl border-b-4
border-black/25 bg-accent`. Es la única excepción a la regla de que solo los
botones llevan labio, y el labio va delante de `bg-accent` para no contar como
primario.

**La CTA va al pie.** En las cuatro pantallas, la CTA se ancla al pie con un
espaciador `flex-1` y el contenido deja de centrarse en vertical. Esto revierte
el centrado de `#61 R8` en esas pantallas. El `ScrollView`,
`keyboardShouldPersistTaps` y el comportamiento de teclado no cambian. La rama
sin token de Nueva contraseña sigue centrada.

**Alturas.** La CTA de cuenta mide 56 (`h-14`) y los inputs de cuenta 52
(`h-13`).

**Peso 800.** `font-extrabold` (Inter ExtraBold) se usa solo en la etiqueta de
la CTA de cuenta y en la de `forgot-resend`, que ocupa su sitio.

**Ojo de contraseña.** Todo campo de contraseña de cuenta usa `PasswordInput`
(`src/components/password-input.tsx`), con un botón de 44 que alterna
«Mostrar contraseña» y «Ocultar contraseña».

- [x] Enmienda aprobada por humano
```

- [x] Enmienda aprobada por humano (fecha: 2026-10-13). La firma el humano aquí, en el
  gate de la spec. R18 copia en la carta esta casilla en el estado en que esté.

## Fuera de alcance

Cada viñeta está clasificada. **[D]** delimita esta spec y no es trabajo
pendiente.

- [D] La rama sin token de Nueva contraseña (`reset-missing-token`): sin
  cambios. Conserva su título `text-2xl`, su enlace y su centrado.
- [D] «Volver» arriba en Nueva contraseña: su canvas no lo dibuja. La vuelta
  es el enlace «Volver al inicio de sesión» bajo la CTA (R19).
- [D] El radio 16 de la CTA del canvas: la CTA sigue en `rounded-xl`, el radio
  de botón de la carta (§Radios).
- [D] Los inputs de 50 del canvas de Crear cuenta: van a 52, como en las otras
  tres pantallas (decisión del humano, P5).
- [D] El hueco de 14 entre Pingo y el título de Nueva contraseña: la cabecera
  usa `gap-3` (12), el de hoy, sin clase nueva para 2 px.
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
- [D] Dependencias nuevas: ninguna. El único fichero nuevo fuera de `src/` es el
  asset `assets/fonts/Inter-ExtraBold.ttf` (R6). `InputGroup`, los iconos,
  `expo-font` y Reanimated ya están instalados. `expo-linear-gradient` sigue
  vetado.
- [D] La bienvenida no cambia: su flotación sigue con `MOTION_FLOAT_*`, y sus
  candados no se tocan.

## Decisiones del humano (2026-10-13)

El humano respondió a P1–P8 el 2026-10-13. El leader las transmitió y se citan
literales. Cada una dice dónde entra en la spec.

- **P1 y P3 — «Aprobar y acortar a «País»».** «quedan aprobadas las tres
  claves (`common.back` «Volver» / «Back», «Mostrar contraseña» / «Show
  password», «Ocultar contraseña» / «Hide password»). Si el ojo se reutiliza
  fuera de login, puedes renombrar la clave a `common.*`… `register.country`
  pasa a «País» / «Country». Cambia copy aprobado y mueve candados de copy:
  `ui-copy-table.ts`, `checkUses(ALL_USES)`, `SCREEN_FILES` y la longitud del
  catálogo en `language-provider.test.tsx`.» Entra en R16. Las claves del ojo
  son `common.showPassword` y `common.hidePassword`, porque el ojo va en tres
  pantallas (R8).
- **P2 — «CTA en peso 800».** «añade Inter ExtraBold (asset, `useFonts`, token
  `--font-extrabold` …, y su candado de fuentes)… Si hace falta una dependencia
  o un asset nuevo, decláralo en la spec…» Entra en R6. Es un asset, sin
  dependencia nueva.
- **P4 — «Una sola feature».** «nada de partir.» La spec es una sola feature
  con R1–R21.
- **P5 — «Incluir en #172».** «la maqueta del canvas entra. Va «Volver» arriba
  del todo, la CTA anclada al pie con espaciador flexible, la CTA de 56 y los
  inputs de 52, en Login, Registro y Recuperar, y también en Nueva contraseña
  (ver P7). Se revierte el centrado de `#61 R8` … en las pantallas donde
  cambie. Por cada candado afectado, nombra el fichero, el título del `it` y el
  literal, y di si se revierte o se actualiza. Mantén `ScrollView`,
  `keyboardShouldPersistTaps` y el comportamiento de teclado de la carta …
  Solo cambia el centrado.» Entra en R19 (anclaje y centrado) y R20 (alturas).
  §Deltas de candados nombra cada candado. En Nueva contraseña, su canvas no
  dibuja «Volver» arriba: la vuelta es el enlace bajo la CTA (R19), como ya
  decía R3.
- **P6 — «Ojo en más campos».** «el ojo va también en la contraseña y la
  confirmación de Crear cuenta y de Nueva contraseña. Un candado por campo.»
  Entra en R8: cinco campos, cinco candados de pantalla.
- **P7 — «Resto de Nueva contraseña».** «entra. Tipografía, etiquetas, errores
  con icono y maqueta del canvas (`canvas/NuevaContrasena.dc.html`), en sus
  ramas con token. La rama sin token (`reset-missing-token`) no cambia…»
  Entra en R6 (tipografía y etiquetas), R9 (error con icono), R19 (maqueta) y
  R20 (alturas).
- **P8 — «Flotación 10 px / 3 s».** «usa los valores del canvas, con constantes
  nuevas en `src/theme/motion.ts`, y actualiza el recuento de exports y su
  candado. La bienvenida no cambia.» Entra en R4.

## Preguntas abiertas

Ninguna.
## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-13) ← gate obligatorio antes de implementar
