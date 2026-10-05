---
feature: mobile-welcome-splash
id: 118
status: approved
tags: [harness, spec, mobile, ui]
base: 711cfd19 (origin/main b2a9c2aa)
---

# Requisitos — #118 mobile-welcome-splash

> Pantalla de bienvenida para quien abre la app sin sesión: hero con la
> mascota, marca, tres chips (GPS · Salud · Nutrición), tagline, CTA primario
> «Comenzar ahora» (registro) y secundario «Ya tengo una cuenta» (login), con
> aviso legal en texto plano. Con sesión no se ve nunca: `index` sigue
> redirigiendo a `/home` sin flicker.

## Contexto y decisiones cerradas

Codex no ve la conversación que originó esta spec. Toda decisión abierta en
`progress/explore_ui-appllama.md` §1 queda cerrada aquí:

| Decisión | Cierre |
| --- | --- |
| (a) Cuándo se muestra | **Siempre** que `useAuth().status === 'unauthenticated'`. Sin flag de primer arranque, sin persistencia, sin dependencia nueva. |
| Ruta | **Ruta propia** `src/app/welcome.tsx` (route delgado) + `src/screens/welcome/index.tsx` (cuerpo). `index.tsx` no cambia de forma: sigue pintando `splash-logo` mientras `status === 'loading'`; cambia **solo** el destino del `Redirect` sin sesión: `/login` → `/welcome`. |
| (b) Navegación | Los dos CTAs usan `router.push` (back hardware desde login/register vuelve a welcome). Welcome entra en la pila vía `Redirect` desde `index` (que es `router.replace`), así que back desde welcome **sale de la app**. Puerta de un solo sentido tras autenticarse: `welcome` se registra en `RootStack` dentro de `<Stack.Protected guard={status !== 'authenticated'}>` y, además, el cuerpo devuelve `<Redirect href="/home" />` si `status === 'authenticated'` (mismo patrón que `src/app/(auth)/_layout.tsx`). |
| (c) Pie legal | No existe URL real de Términos ni Privacidad en el repo (grep en `app.json`, `README.md`, `docs/*.md`: solo `brief.md` §6 y `terms_accepted_at` en el modelo). **Texto plano**, sin link, sin `Linking`. |
| Hero | `assets/images/splash-icon.png` (la mascota que ya usa `index.tsx`) vía `expo-image`, 160×160, `contentFit="contain"`. **Sin banda tintada ni sheet**: todo el contenido se apila sobre `bg-background`. `logo-glow.png` descartado (es un halo azul, no la marca). |
| Iconos de los chips | `reicon-react-native` (`docs/conventions.md` §Móvil: «Los iconos salen de reicon-react-native»). Los tres ya están importados en `src/screens/home/index.tsx`: `Map`, `Stethoscope`, `ForkKnife`. `expo-symbols` está instalado pero no se usa en `src/`; no se introduce aquí. |
| Movimiento | Nivel «raro» (se ve una vez por sesión sin login). **Una sola entrada** del bloque de contenido: `opacity 0→1` + `translateY 16→0`, `Easing.bezier(0.23, 1, 0.32, 1)`, **240 ms**, hilo UI (Reanimated `withTiming`). Con Reduce Motion solo opacidad (translateY arranca en 0). Feedback de pulsación: el que ya trae heroui `Button` (`feedbackVariant` por defecto `scale-highlight`); **no se escribe ninguna animación de press propia**. |
| Copy | 8 claves `welcome.*` con literal EN y ES fijado en R1. Todo texto visible pasa por `t()`. |
| Dependencias | **Cero nuevas.** `expo-image`, `expo-router`, `react-native-reanimated`, `heroui-native`, `reicon-react-native` ya están en `package.json`. `expo-linear-gradient` sigue vetado. |

Los números de candado se declaran como **delta sobre el valor actual** («+N»)
porque #117 toca los mismos ficheros en paralelo: Codex hace `git fetch` y mide
el valor base en su branch antes de tocarlo; nunca copia un número de esta
spec como absoluto.

## Requisitos

### R1 — Catálogo: ocho claves `welcome.*`

WHEN se compila el catálogo THEN THE SYSTEM SHALL exponer en
`mobile-pet-tracker/src/i18n/catalog.ts` estas ocho claves, en `en` y en `es`,
con exactamente estos literales (sin punto final, sin emojis):

| Clave | `en` | `es` |
| --- | --- | --- |
| `welcome.brand` | `Pet Tracker` | `Pet Tracker` |
| `welcome.chipGps` | `GPS` | `GPS` |
| `welcome.chipHealth` | `Health` | `Salud` |
| `welcome.chipNutrition` | `Nutrition` | `Nutrición` |
| `welcome.tagline` | `Your smart hub for canine wellness, tracking and nutrition` | `Tu centro inteligente de bienestar, rastreo y nutrición canina profesional` |
| `welcome.getStarted` | `Get started` | `Comenzar ahora` |
| `welcome.haveAccount` | `I already have an account` | `Ya tengo una cuenta` |
| `welcome.legalNotice` | `By continuing you accept our Terms and Privacy Policy` | `Al continuar aceptas nuestros Términos y Política de privacidad` |

Candados que esta R mueve (todos como delta):

- `src/providers/__tests__/language-provider.test.tsx`, el `toHaveLength(` de
  `englishKeys` dentro de `#65 R12`: se añade **un término `+ 8` con el
  comentario `// #118 R1`** a la suma existente (no se recalcula el resto).
- `src/__tests__/ui-copy-table.ts`: nuevo bloque `export const R16_WELCOME:
  UseRow[]` con **8 filas**, todas `file: 'src/screens/welcome/index.tsx'`,
  una por clave, y `...R16_WELCOME` añadido **al final** tanto de `ALL_USES`
  como del array `blocks` del `it('cuadra ALL_USES con la suma de sus
  bloques')`.
- `src/__tests__/ui-language.test.ts`: nuevo `describe('#118 R1: welcome
  resuelve su copy por clave')` con `it('resuelve las 8 ocurrencias de
  welcome', () => checkUses(R16_WELCOME))`; y el `toHaveLength(` de
  `SCREEN_FILES` recibe **un término `+ 1`** con comentario `// #118 R1`.
- `specs/mobile-ui-language/design.md` §2: nueva subsección `### §2.19 —
  Añadidos por #118 — Bienvenida` con las 8 filas en el formato de §2.18
  (`| — | \`clave\` | \`EN\` | \`ES\` | ← añadida por #118 (R1) |`).

Test: `src/providers/__tests__/language-provider.test.tsx::mantiene la base
más las claves de #68 y los mismos marcadores en ambos idiomas` (rojo hasta
que existan las 8 en los dos idiomas; `es` es `Record<TranslationKey,
string>`, así que una clave solo en `en` también rompe el typecheck) y
`src/__tests__/ui-language.test.ts::#118 R1: welcome resuelve su copy por
clave` (rojo con ENOENT hasta que exista la pantalla de R5; ese rojo en
cascada es el esperado en tasks.md).

### R2 — `index` redirige sin sesión a `/welcome`

WHEN `useAuth().status === 'unauthenticated'` THEN `src/app/index.tsx` SHALL
renderizar `<Redirect href="/welcome" />` y nada más.

WHILE `status === 'loading'` THE SYSTEM SHALL seguir pintando la `Image`
`testID="splash-logo"` centrada (sin cambio). WHEN `status ===
'authenticated'` THE SYSTEM SHALL seguir redirigiendo a `/home` (sin cambio).

Test: `src/app/__tests__/index.test.tsx`. El `it` existente `'redirects an
unauthenticated session to login'` pasa a llamarse **`'#118 R2: redirects an
unauthenticated session to welcome'`** y espera
`mockRedirect.mock.calls[0]?.[0]` igual a `{ href: '/welcome' }`. Los otros
dos `it` del describe `R5: splash navega según sesión` no cambian y siguen
verdes.

### R3 — Ruta `welcome` registrada fuera de la zona autenticada

WHEN el router construye `RootStack` THEN `src/app/_layout.tsx` SHALL
declarar `<Stack.Screen name="welcome" />` envuelto en su propio
`<Stack.Protected guard={status !== 'authenticated'}>`, colocado **después**
del `<Stack.Protected guard={status === 'authenticated'}>` existente (sexto
hijo del `Stack`; `src/app/__tests__/layout.test.tsx` localiza la guarda
autenticada como `children[4]` en tres describes y no debe moverse).

WHEN se importa `src/app/welcome.tsx` THEN SHALL ser un route delgado con la
forma de `src/app/reset-password.tsx`: `import { WelcomeScreen } from
'../screens/welcome';` y un `export default function WelcomeRoute()` que
devuelve `<WelcomeScreen />` (≤ 5 líneas no vacías).

Tests:

- `src/screens/welcome/index.test.tsx`, describe `R3` (candados de fuente con
  `readFileSync` desde `src/`):
  - `'registra welcome bajo su propio guard de no autenticado'`: el fuente de
    `app/_layout.tsx` hace match con
    `/<Stack\.Protected guard=\{status !== 'authenticated'\}>\s*<Stack\.Screen name="welcome" \/>\s*<\/Stack\.Protected>/`
    y contiene `name="welcome"` **exactamente una vez**.
  - `'deja el route de welcome delgado'`: `app/welcome.tsx` tiene ≤ 5 líneas
    no vacías y contiene `from '../screens/welcome'`.
- `src/app/__tests__/layout.test.tsx`: el `expect(children).toHaveLength(5)`
  de `#95 R2` recibe `+ 1 // #118 R3`; nuevo `describe('#118 R3: RootStack
  declara welcome bajo su propia guarda')` con `it('declara welcome como
  sexto hijo bajo Stack.Protected')`: `Children.toArray(stack.children)[5]`
  es `Stack.Protected` y `Children.toArray(sus children)` es exactamente
  `[[Stack.Screen, 'welcome']]`.

### R4 — Puerta de un solo sentido dentro del cuerpo

WHILE `useAuth().status === 'authenticated'` THEN `src/screens/welcome/index.tsx`
SHALL devolver `<Redirect href="/home" />` sin renderizar `screen-welcome` ni
ningún CTA.

Test: `src/screens/welcome/index.test.tsx::R4: con sesión redirige a home y no
pinta la pantalla` — `mockRedirect` llamado una vez con `{ href: '/home' }`,
`screen.queryByTestId('screen-welcome')` nulo,
`screen.queryByTestId('welcome-get-started')` nulo.

### R5 — Estructura de la pantalla

WHILE `status === 'unauthenticated'` THEN la pantalla SHALL renderizar este
árbol, con estos `testID` y estas clases en el tag de apertura:

```
ScrollView testID="screen-welcome" className="flex-1 bg-background"
           contentInsetAdjustmentBehavior="automatic"
           contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24, gap: 16,
                                    paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }}
└─ Animated.View testID="welcome-content" style={[entranceStyle, { alignItems: 'center', gap: 16 }]}
   ├─ Image     testID="welcome-hero"        source=splash-icon.png style={{ width: 160, height: 160 }} contentFit="contain"
   ├─ Text      testID="welcome-brand"       className="text-3xl font-bold text-foreground"            {t('welcome.brand')}
   ├─ View      testID="welcome-chips"       className="flex-row justify-center gap-2"                  (R6)
   ├─ Text      testID="welcome-tagline"     className="text-center text-base text-muted"               {t('welcome.tagline')}
   ├─ Button    testID="welcome-get-started" className="w-full rounded-xl bg-accent"                    (R7)
   ├─ Button    testID="welcome-have-account" className="w-full rounded-xl border border-accent bg-transparent" (R8)
   └─ Text      testID="welcome-legal"       className="text-center text-xs text-muted"                 {t('welcome.legalNotice')}
```

Misma receta de `contentContainerStyle` que `src/app/(auth)/login.tsx` (grupo
sin tab bar: `insets.bottom + 24`). Sin `StyleSheet.create`, sin hex, sin
clases arbitrarias `[...]`, sin `rounded-2xl|lg|md|sm`, sin `text-accent`
suelto, sin `CONTINUOUS_CORNER` (ninguna esquina no-cápsula dibujada aquí).

Tests (`src/screens/welcome/index.test.tsx`, describe `R5`, insets mockeados
`{ top: 40, right: 0, bottom: 24, left: 0 }`):

- `'aplica las dimensiones del grupo sin tab bar'`:
  `getByTestId('screen-welcome').props.contentContainerStyle` `toEqual`
  `{ flexGrow: 1, justifyContent: 'center', padding: 24, gap: 16, paddingTop: 52, paddingBottom: 48 }`
  y `props.className` `toBe('flex-1 bg-background')`.
- `'apila los siete bloques en orden'`:
  `getByTestId('welcome-content').children` tiene `length` **7** y, en orden,
  sus `props.testID` son `['welcome-hero', 'welcome-brand', 'welcome-chips',
  'welcome-tagline', 'welcome-get-started', 'welcome-have-account',
  'welcome-legal']`.
- `'pinta hero, marca, tagline y legal con sus clases'`: una aserción
  `toBe` por `className` de `welcome-brand`, `welcome-tagline` y
  `welcome-legal`; `StyleSheet.flatten(getByTestId('welcome-content').props.style)`
  `toMatchObject({ alignItems: 'center', gap: 16 })` (`Animated.View` no
  lleva `className`: ningún `Animated.View` del repo la usa, y el estilo de
  layout va inline como el `style` del `splash-logo`); `welcome-hero` tiene
  `props.contentFit === 'contain'` y `props.style` `toEqual({ width: 160,
  height: 160 })`; y **(Enmienda E5)** `welcome-hero` `props.source`
  `toEqual([expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/splash-icon\.png$/) })])`.
  Sin esta aserción, el hero con `logo-glow.png` (descartado arriba) queda
  verde.

### R6 — Tres chips, idénticos salvo icono y etiqueta

WHILE la pantalla está visible THEN `welcome-chips` SHALL contener
**exactamente 3** hijos, en este orden y con estas decisiones (Enmienda #70:
una aserción por invariante, contadas por `children`, no por `testID`):

| # | Decisión | GPS | Salud | Nutrición |
| --- | --- | --- | --- | --- |
| 1 | `testID` del chip | `welcome-chip-gps` | `welcome-chip-health` | `welcome-chip-nutrition` |
| 2 | `className` del chip | `flex-row items-center gap-1.5 rounded-full bg-surface-secondary px-3 py-1.5` | igual | igual |
| 3 | Componente del icono (reicon) | `Map` | `Stethoscope` | `ForkKnife` |
| 4 | `size` del icono | 14 | 14 | 14 |
| 5 | `color` del icono | `accent-strong` resuelto con `useThemeColors` del repo (`src/theme/use-theme-colors.ts`) | igual | igual |
| 6 | Clave de la etiqueta | `welcome.chipGps` | `welcome.chipHealth` | `welcome.chipNutrition` |
| 7 | `className` de la etiqueta | `text-xs font-semibold text-accent-strong` | igual | igual |
| 8 | Orden | 1.º | 2.º | 3.º |
| 9 | Hijos por chip | 2 (icono, etiqueta) | 2 | 2 |
| 10 | Pulsable | no (`View`, sin `onPress`, sin `accessibilityRole="button"`) | no | no |
| 11 | Origen de datos | constante `WELCOME_CHIPS` (3 entradas `{ testID, Icon, labelKey }`) recorrida con `map` — la clase de la etiqueta aparece **una vez** en el fuente | — | — |
| 12 | Cardinalidad | `children.length === 3` | — | — |

Tests (`src/screens/welcome/index.test.tsx`, describe `R6`): un `it` por
fila 1–10 que recorre los tres hijos de `welcome-chips` por índice, un `it`
para la fila 12, y un candado de fuente para la fila 11
(`text-accent-strong` aparece exactamente 2 veces en
`screens/welcome/index.tsx`: etiqueta de chip + label del CTA secundario de
R8). El icono se identifica mockeando `reicon-react-native` como hace
`src/screens/home/index.test.tsx` (`mockIcon(testID)` devuelve un `View` con
ese `testID` y los props recibidos): `Map` → `icon-map`, `Stethoscope` →
`icon-stethoscope`, `ForkKnife` → `icon-fork-knife`; el hijo 0 de cada chip
es ese nodo y el hijo 1 la etiqueta. La tinta (fila 5) se sonda mockeando
`../../theme/use-theme-colors` para que `useThemeColors` devuelva
`['accent-strong-ink']` y aseverando `props.color === 'accent-strong-ink'` y
`useThemeColors` llamado con `['accent-strong']`.

**(Enmienda E4)** El `it` de la fila 10 asevera, por cada hijo de
`welcome-chips`, `props.onPress`, `props.onClick` y `props.accessible`
`toBeUndefined()`, y `props.accessibilityRole` `not.toBe('button')`. Un
`Pressable` con `onPress` no pasa `onPress` a su nodo host, pero sí `onClick` y
`accessible: true`: sin esas dos aserciones, el chip convertido en `Pressable`
queda verde.

**(Enmienda E7)** El mismo `it` asevera además, por cada hijo,
`props.role` `toBeUndefined()`. `role="button"` es el prop moderno de RN y
tiene precedencia sobre `accessibilityRole`: sin esa aserción, los tres chips
con `role="button"` y sin `onPress` quedan verdes.

### R7 — CTA primario «Comenzar ahora» → registro

WHEN el usuario pulsa `welcome-get-started` THEN THE SYSTEM SHALL llamar
`router.push('/register')` exactamente una vez y **no** llamar
`router.replace`.

El botón es heroui `Button` con `className="w-full rounded-xl bg-accent"` y
`Button.Label className="font-bold text-accent-foreground"` con
`t('welcome.getStarted')` (misma receta que `login-submit`). Esto mueve el
candado `rounded-xl bg-accent`: **+1 sobre el valor actual** en los dos
sitios que lo cuentan en `src/__tests__/consistency-classnames.test.ts`
(`#62 R1` `'deja todos los botones primarios sólidos en un único radio'` y
`#98 R10` `count(/rounded-xl bg-accent.../)`), cada uno con un término `+ 1
// #118 R7`.

Tests (`describe('R7')`):
- `'empuja a registro sin reemplazar'`: `fireEvent.press` → `mockRouter.push`
  `toHaveBeenCalledTimes(1)` y `toHaveBeenCalledWith('/register')`;
  `mockRouter.replace` `not.toHaveBeenCalled()`.
- `'es el botón primario del repo'`: `getByTestId('welcome-get-started').props.className`
  `toBe('w-full rounded-xl bg-accent')`; `getByText(<literal ES de
  welcome.getStarted>)` existe.

### R8 — CTA secundario «Ya tengo una cuenta» → login

WHEN el usuario pulsa `welcome-have-account` THEN THE SYSTEM SHALL llamar
`router.push('/login')` exactamente una vez y **no** llamar `router.replace`.

El botón es heroui `Button` con `className="w-full rounded-xl border
border-accent bg-transparent"` (hueco; `border-accent` tiene precedente en
`src/components/pet-switcher.tsx`) y `Button.Label className="font-semibold
text-accent-strong"` con `t('welcome.haveAccount')` (tinta de acento sobre
fondo → `accent-strong`, #61 R4).

Tests (`describe('R8')`):
- `'empuja a login sin reemplazar'`: `fireEvent.press` → `mockRouter.push`
  `toHaveBeenCalledTimes(1)` con `'/login'`; `mockRouter.replace`
  `not.toHaveBeenCalled()`.
- `'es un botón hueco con tinta accent-strong'`: `className` del botón
  `toBe('w-full rounded-xl border border-accent bg-transparent')`;
  `getByText(<literal ES de welcome.haveAccount>).props.className`
  `toBe('font-semibold text-accent-strong')`.

R7 y R8 son dos `it` separados cada uno: «los dos CTAs» no se candará en un
solo caso.

### R9 — Copy en los dos idiomas

WHILE `LanguageProvider initial="es"` THEN la pantalla SHALL mostrar los
literales ES de `welcome.brand`, `welcome.tagline`, `welcome.getStarted`,
`welcome.haveAccount`, `welcome.legalNotice` y de los tres chips. WHILE
`initial="en"` THEN SHALL mostrar los literales EN de las mismas ocho claves.

Tests (`describe('R9')`): `'muestra el copy en español'` y `'muestra el copy
en inglés'`, cada uno con **8 `getByText`** contra los literales de la tabla
de R1 (no contra `t()` ni contra el catálogo importado: literal en el test).

### R10 — Entrada única del contenido y Reduce Motion

WHEN la pantalla monta con `useReducedMotion() === false` THEN
`welcome-content` SHALL arrancar en `opacity: 0`, `translateY: 16` y animar
con `withTiming` hasta `opacity: 1`, `translateY: 0` en **240 ms** con
`Easing.bezier(0.23, 1, 0.32, 1)`.

WHILE `useReducedMotion() === true` THEN `translateY` SHALL ser 0 desde el
primer frame y solo `opacity` SHALL animar 0→1 con la misma duración.

El cuerpo exporta `WELCOME_ENTRANCE_MS = 240` y
`WELCOME_ENTRANCE_EASING = Easing.bezier(0.23, 1, 0.32, 1)`; la animación se
dispara en un `useEffect` y escribe en los shared values una sola vez.

**(Enmiendas E1 y E2)** Los dos `withTiming` (fade y `translateY`) llevan
`duration: WELCOME_ENTRANCE_MS` y `easing: WELCOME_ENTRANCE_EASING`, nunca
literales. El del fade lleva además `reduceMotion: ReduceMotion.Never`: sin
él, con Reduce Motion de sistema activo Reanimated salta el fade a 1 sin
animar, y la rama WHILE de arriba deja de cumplirse. El de `translateY` no lo
lleva (bajo Reduce Motion no se dispara).

Tests (`describe('R10')`, `jest.useFakeTimers()` por `it`; mock parcial de
`react-native-reanimated` que **solo** sustituye `useReducedMotion` (como
`src/screens/home/index.test.tsx`) y deja `withTiming` real — precedente de
`withTiming` real + timers falsos + `toHaveAnimatedStyle`:
`src/components/__tests__/floating-tab-bar.test.tsx`; ventana de avance
`WELCOME_ENTRANCE_MS * 2 + 100` ms — derivada de la duración real con margen;
si hiciera falta se amplía la ventana, nunca la aserción):

- `'fija la duración y la curva'` **(Enmiendas E1, E2 y E6)**:
  `expect(WELCOME_ENTRANCE_MS).toBe(240)`; la curva contra una referencia
  construida en el test con los coeficientes **literales** (nunca contra un
  símbolo importado de producción), en nueve puntos, como
  `src/app/(tabs)/__tests__/food.test.tsx` (`expectKcalBarTiming`):
  `const expected = jest.requireActual<typeof import('react-native-reanimated')>('react-native-reanimated').Easing.bezier(0.23, 1, 0.32, 1).factory();`
  y, para cada `point` de `[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]`,
  `expect(WELCOME_ENTRANCE_EASING.factory()(point)).toBeCloseTo(expected(point), 6)`.
  Y un candado de cableado sobre `readSource('screens/welcome/index.tsx')`
  (el helper que ya usa el fichero), cada `source.match` con `?? []` para que
  el rojo diga «Received 0» y no un `TypeError` sobre `null`:
  `expect(source.match(/duration: WELCOME_ENTRANCE_MS,\s*easing: WELCOME_ENTRANCE_EASING,/g) ?? []).toHaveLength(2);`
  `expect(source.match(/\b(duration|easing):/g) ?? []).toHaveLength(4);`
  `expect(source.match(/reduceMotion: ReduceMotion\.Never/g) ?? []).toHaveLength(1);`
  **(Enmienda E6)** Y, en el mismo `it`, dos líneas que atan `reduceMotion`
  a su `withTiming`, una por rama de la cláusula (el fade lo lleva, el de
  `translateY` no lleva ninguno):
  `expect(source.match(/\breduceMotion:/g) ?? []).toHaveLength(1);`
  `expect(source).toMatch(/opacity\.set\(withTiming\(1, \{[^}]*reduceMotion: ReduceMotion\.Never,[^}]*\}\)\)/);`
  `toBeDefined()` pasaba con cualquier curva, `toBe(240)` miraba una
  constante que los `withTiming` podían no usar, y el recuento global de
  `ReduceMotion.Never` quedaba verde con la opción movida al `withTiming` de
  `translateY`.
- `'arranca invisible y desplazado sin Reduce Motion'`: antes de avanzar
  timers, `welcome-content` `toHaveAnimatedStyle({ opacity: 0, transform:
  [{ translateY: 16 }] })`.
- `'termina visible y en su sitio sin Reduce Motion'`: tras avanzar la
  ventana dentro de `act`, `toHaveAnimatedStyle({ opacity: 1, transform: [{
  translateY: 0 }] })`.
- `'con Reduce Motion no se desplaza'`: `mockUseReducedMotion` → `true`;
  antes de avanzar, `toHaveAnimatedStyle({ opacity: 0, transform: [{
  translateY: 0 }] })`; tras la ventana, `{ opacity: 1, transform: [{
  translateY: 0 }] }`.
- **(Enmienda E3)** Las **cinco** llamadas a `toHaveAnimatedStyle` de este
  describe añaden `alignItems: 'center', gap: 16` al objeto esperado y pasan
  `{ shouldMatchAllProps: true }` como segundo argumento (precedente:
  `food-plan-fill` en `src/app/(tabs)/__tests__/food.test.tsx`). Sin eso,
  `toHaveAnimatedStyle` solo compara las claves que se le pasan y una clave
  animada extra (p. ej. `marginTop`, que la carta prohíbe animar) queda verde.

### R11 — Grep-clean y candados de carta

WHEN se ejecuta la suite THEN los ficheros `src/app/welcome.tsx` y
`src/screens/welcome/index.tsx` SHALL estar libres de: hex `#[0-9a-f]{3,8}`,
clases arbitrarias `[...]`, `StyleSheet.create`, `shadow*` legacy,
`rounded-2xl|rounded-lg|rounded-md|rounded-sm`, `text-accent` suelto,
`useThemeColor` de heroui, emojis y cualquier import de `expo-linear-gradient`
o `expo-symbols`.

Candados que esta feature **no mueve** (su valor actual se conserva):
`count(/style=\{CONTINUOUS_CORNER\}/)`, `count(/bg-accent-soft/)` y la tabla
`directUses` de `#62 R14` en `consistency-classnames.test.ts`.

Candado que sí mueve además de R7: `src/__tests__/legibility-classnames.test.ts`
`#61 R4` recibe una fila `[join('screens', 'welcome', 'index.tsx'), 2]` en
`inkSites` y su suma un término `+ 2 // #118 R11`.

Tests: nuevo `describe('#118 R11: la bienvenida no mete drift de estilo')` en
`src/__tests__/design-drift.test.ts` con `featureFiles = ['src/app/welcome.tsx',
'src/screens/welcome/index.tsx']` y el mismo barrido de violaciones que `#98
R10` (hex, `[`, `StyleSheet`), más `expect(source).not.toMatch(/expo-linear-gradient|expo-symbols/)`.
Los `it` existentes `'no deja ningún text-accent suelto en las fuentes'` y
`#62 R4` `it.each([...radios])` cubren el resto sin cambios.

### R12 — Cero dependencias nuevas

WHEN se compara la branch con `origin/main` THEN `mobile-pet-tracker/package.json`
y `bun.lock` SHALL no tener diff (`git diff origin/main -- mobile-pet-tracker/package.json
mobile-pet-tracker/bun.lock` vacío). Verificación del reviewer, no test.

### R13 — Prueba de humo humana (dev build de Android, no Expo Go)

Cada comprobación tiene su casilla. El gate de cierre exige las ocho.

- [ ] S1 — Arranque en frío **sin sesión**: aparece welcome tras el splash
      nativo; en ningún frame se ve la pantalla de login.
- [ ] S2 — «Comenzar ahora» abre registro; back hardware vuelve a welcome.
- [ ] S3 — «Ya tengo una cuenta» abre login; back hardware vuelve a welcome.
- [ ] S4 — Login correcto aterriza en home; back hardware desde home **sale
      de la app** (no muestra welcome ni login).
- [ ] S5 — Arranque en frío **con sesión**: home directo; welcome no se ve
      en ningún frame.
- [ ] S6 — Ajustes → Accesibilidad → «Eliminar animaciones» activado: welcome
      aparece por fundido, sin desplazamiento vertical.
- [ ] S7 — Modo oscuro: marca, tagline, chips, los dos CTAs y el legal son
      legibles; el CTA hueco muestra su borde.
- [ ] S8 — Cerrar sesión desde perfil: anotar en `progress/impl_mobile-welcome-splash.md`
      dónde aterriza (si no es welcome, se registra como deuda; no bloquea
      esta feature).

## Enmienda E1–E5 (review de la ronda 1, 2026-10-05)

El `reviewer` rechazó la ronda 1 (`progress/review_mobile-welcome-splash.md`,
commit `e1690ede`) por cinco candados ciegos que esta spec prescribía al pie
de la letra. El código de producción cumple R1–R12 y **no cambia**: la
ronda 2 solo toca `src/screens/welcome/index.test.tsx` (más la trazabilidad y
el reporte). Los cinco arreglos ya se validaron en verde sobre `7789f722` y en
rojo contra su mutación.

| Id | Requisito | Hueco | Mutación que quedaba verde |
| --- | --- | --- | --- |
| E1 | R10 | duración y curva no ligadas a la animación | `duration: 400` a mano en los `withTiming`; `Easing.linear` |
| E2 | R10 (WHILE Reduce Motion) | el fade bajo Reduce Motion sin candado | quitar `ReduceMotion.Never`; fade de 0 ms con Reduce Motion |
| E3 | R10 | `toHaveAnimatedStyle` solo mira las claves pasadas | clave animada extra `marginTop` |
| E4 | R6 fila 10 | un `Pressable` no expone `onPress` en el host | chip como `Pressable` con `onPress` |
| E5 | R5 | `source` del hero sin aserción | hero con `logo-glow.png` |

Los textos normativos están en R5, R6 y R10, marcados «Enmienda E<n>».

## Enmienda E6–E7 (review de la ronda 2, 2026-10-05)

El `reviewer` rechazó la ronda 2 (`progress/review_mobile-welcome-splash.md`
§Ronda 2, commit `7dbef381`) por un candado que la Enmienda E2 prescribía al
pie de la letra: contaba `ReduceMotion.Never` en todo el fichero sin atarlo
al fade. E1, E3, E4 y E5 quedaron cerrados. Producción **no cambia**: la
ronda 3 solo toca `src/screens/welcome/index.test.tsx` (más la trazabilidad
y el reporte). El arreglo de E6 se validó con node sobre el fuente de
`f23345c3` contra X1, X2, M3, M4, M1 y M11; el de E7, en el spike del
reviewer (verde en `f23345c3`, rojo en X7 con `Received: "button"`).

| Id | Requisito | Hueco | Mutación que quedaba verde |
| --- | --- | --- | --- |
| E6 | R10 (E2: dónde va `reduceMotion`) | el recuento de `ReduceMotion.Never` es global | X1: `Never` movido al `withTiming` de `translateY`; X2: `reduceMotion: ReduceMotion.Always` añadido al de `translateY` |
| E7 | R6 fila 10 | `role` sin aserción | X7: `role="button"` en los tres chips, sin `onPress` |

Comportamiento medido por el reviewer: con X1 y Reduce Motion de sistema
activo, el fade salta a 1 sin animar; con X2 y sin Reduce Motion,
`translateY` salta a 0. Las dos incumplen R10.

La suite sigue en **28** `it`: E6 añade dos líneas dentro de `'fija la
duración y la curva'` y E7 una dentro de `'deja cada chip sin pulsación ni
rol de botón'`. Los textos normativos están en R6 y R10, marcados
«Enmienda E<n>».

## Fuera de alcance

- Flag de «primer arranque» o persistencia de haber visto la bienvenida
  (decisión (a): se muestra siempre sin sesión).
- Carrusel de onboarding, selección de idioma o de permisos en la bienvenida.
- Links reales a Términos y Política de privacidad: no existe URL en el
  repo; se añadirán cuando exista la página legal (feature aparte).
- Badge «PRO», foto a sangre con veladuras, gradientes, blur (descartados por
  la carta y por el veto a `expo-linear-gradient`).
- Hápticos, sonido, Lottie.
- Cambios en `(auth)/login.tsx`, `(auth)/register.tsx`, `(auth)/_layout.tsx`
  o en el flujo de `signOut` (S8 solo observa).
- Smoke en iOS (decisión de costo relatada en #60).
- Tipado de rutas: `.expo/types/router.d.ts` está gitignorado; se borra
  antes del typecheck (`test ! -e mobile-pet-tracker/.expo/types/router.d.ts`).

## Aprobación

> Cuatro casillas, cuatro gates (lección `gate-humano-sin-casilla-donde-firmar`).
> La de la spec autorizó la ronda 1; la de la Enmienda E1–E5, la ronda 2; la
> de la Enmienda E6–E7 autoriza la ronda 3 de Codex; la de R13 cierra la
> feature.

### Aprobación de la spec

- [x] Spec aprobada por humano (gate: nadie implementa antes de marcar esta casilla)

### Enmienda E1–E5 — candados de R5, R6 y R10 tras la review de la ronda 1

- [x] Enmienda E1–E5 aprobada por humano (fecha: 2026-10-05) ← gate obligatorio antes de la ronda 2 de Codex

### Enmienda E6–E7 — candados de R10 y R6 tras la review de la ronda 2

- [x] Enmienda E6–E7 aprobada por humano (fecha: 2026-10-05) ← gate obligatorio antes de la ronda 3 de Codex

### Prueba de humo

- [ ] R13 S1–S8 firmadas por humano en dev build de Android
