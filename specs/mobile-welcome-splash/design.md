---
feature: mobile-welcome-splash
id: 118
status: draft
tags: [harness, spec, mobile, ui]
---

# Diseño — #118 mobile-welcome-splash

Base medida: `711cfd19` (origin/main `b2a9c2aa`). Todo ancla es por contenido
grepeable; ningún número de línea. Los recuentos se expresan como delta sobre
el valor que Codex mida en su branch tras `git fetch`.

## 1. Decisiones técnicas

### 1.1 Navegación

| Momento | Hoy | Con #118 |
| --- | --- | --- |
| `status === 'loading'` | `index` pinta `splash-logo` | igual |
| `status === 'authenticated'` | `index` → `Redirect /home` | igual |
| `status === 'unauthenticated'` | `index` → `Redirect /login` | `index` → `Redirect /welcome` |
| CTA primario | — | `router.push('/register')` |
| CTA secundario | — | `router.push('/login')` |
| Back hardware en welcome | — | sale de la app (`Redirect` es `router.replace`, welcome es la única entrada de la pila) |
| Back hardware en login/register | sale de la app | vuelve a welcome |
| Tras login/register OK | `router.replace('/home')` (sin cambio) | igual; welcome queda bajo `Stack.Protected guard={status !== 'authenticated'}` y el router la retira de la pila al cambiar la guarda; si aun así se renderiza, su cuerpo devuelve `Redirect /home` |

`Stack.Protected` ya se usa en `src/app/_layout.tsx` para la zona
autenticada; `Redirect` ya se usa en `src/app/(auth)/_layout.tsx` para la
misma puerta de un solo sentido. No hay API nueva.

Registro en `RootStack`: el nuevo bloque va **después** del
`<Stack.Protected guard={status === 'authenticated'}>` existente, como sexto
hijo del `Stack`. Motivo: `src/app/__tests__/layout.test.tsx` localiza la
guarda autenticada como `Children.toArray(stack.children)[4]` en tres
describes (`#95 R2`, `#114 R1`, `#100 R2`); colocarla antes los rompería
todos. Solo cambia el `expect(children).toHaveLength(5)` de `#95 R2`, que
recibe `+ 1 // #118 R3`.

### 1.2 Ficheros

| Acción | Ruta | Qué |
| --- | --- | --- |
| crear | `mobile-pet-tracker/src/app/welcome.tsx` | route delgado: `import { WelcomeScreen } from '../screens/welcome'; export default function WelcomeRoute() { return <WelcomeScreen />; }` (misma forma que `src/app/reset-password.tsx`) |
| crear | `mobile-pet-tracker/src/screens/welcome/index.tsx` | `export function WelcomeScreen()`, `export const WELCOME_ENTRANCE_MS = 240`, `export const WELCOME_ENTRANCE_EASING`, constante `WELCOME_CHIPS` |
| crear | `mobile-pet-tracker/src/screens/welcome/index.test.tsx` | R3–R10 |
| modificar | `mobile-pet-tracker/src/app/index.tsx` | `'/login'` → `'/welcome'` en el `Redirect` sin sesión |
| modificar | `mobile-pet-tracker/src/app/_layout.tsx` | bloque `Stack.Protected` + `Stack.Screen name="welcome"` (§1.1) |
| modificar | `mobile-pet-tracker/src/i18n/catalog.ts` | 8 claves `welcome.*` en `en` y `es` (R1) |
| modificar | `mobile-pet-tracker/src/app/__tests__/index.test.tsx` | `it` renombrado y `{ href: '/welcome' }` (R2) |
| modificar | `mobile-pet-tracker/src/app/__tests__/layout.test.tsx` | `toHaveLength(5)` → `+ 1`; nuevo `describe('#118 R3')` (R3) |
| modificar | `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` | `+ 8, // #118 R1` |
| modificar | `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` | bloque `R16_WELCOME`, `ALL_USES`, array `blocks` |
| modificar | `mobile-pet-tracker/src/__tests__/ui-language.test.ts` | `describe('#118 R1')` + `SCREEN_FILES` `+ 1` |
| modificar | `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` | `+ 1 // #118 R7` en los dos recuentos de `rounded-xl bg-accent` |
| modificar | `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts` | fila `welcome` en `inkSites` (2) y `+ 2 // #118 R11` en la suma |
| modificar | `mobile-pet-tracker/src/__tests__/design-drift.test.ts` | `describe('#118 R11')` |
| modificar | `specs/mobile-ui-language/design.md` | `### §2.19 — Añadidos por #118 — Bienvenida` |
| crear | `progress/impl_mobile-welcome-splash.md` | reporte de Codex |

Lista cerrada: ningún otro fichero de `mobile-pet-tracker/` cambia. La app
móvil no se divide en domain/application/infrastructure
(`docs/architecture.md`): route delgado + `src/screens/<nombre>/` es la capa.

### 1.3 Árbol de componentes

```
<ScrollView testID="screen-welcome" className="flex-1 bg-background"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24, gap: 16,
                                     paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }}>
  <Animated.View testID="welcome-content" style={[entranceStyle, { alignItems: 'center', gap: 16 }]}>
    <Image testID="welcome-hero" source={require('../../../assets/images/splash-icon.png')}
           style={{ width: 160, height: 160 }} contentFit="contain" />
    <Text testID="welcome-brand" className="text-3xl font-bold text-foreground">{t('welcome.brand')}</Text>
    <View testID="welcome-chips" className="flex-row justify-center gap-2">
      {WELCOME_CHIPS.map(({ testID, Icon, labelKey }) => (
        <View key={testID} testID={testID}
              className="flex-row items-center gap-1.5 rounded-full bg-surface-secondary px-3 py-1.5">
          <Icon size={14} color={chipInk} />
          <Text className="text-xs font-semibold text-accent-strong">{t(labelKey)}</Text>
        </View>
      ))}
    </View>
    <Text testID="welcome-tagline" className="text-center text-base text-muted">{t('welcome.tagline')}</Text>
    <Button testID="welcome-get-started" className="w-full rounded-xl bg-accent" onPress={() => router.push('/register')}>
      <Button.Label className="font-bold text-accent-foreground">{t('welcome.getStarted')}</Button.Label>
    </Button>
    <Button testID="welcome-have-account" className="w-full rounded-xl border border-accent bg-transparent" onPress={() => router.push('/login')}>
      <Button.Label className="font-semibold text-accent-strong">{t('welcome.haveAccount')}</Button.Label>
    </Button>
    <Text testID="welcome-legal" className="text-center text-xs text-muted">{t('welcome.legalNotice')}</Text>
  </Animated.View>
</ScrollView>
```

- `WELCOME_CHIPS` (módulo, fuera del componente): `[{ testID: 'welcome-chip-gps', Icon: Map, labelKey: 'welcome.chipGps' }, { testID: 'welcome-chip-health', Icon: Stethoscope, labelKey: 'welcome.chipHealth' }, { testID: 'welcome-chip-nutrition', Icon: ForkKnife, labelKey: 'welcome.chipNutrition' }] as const`. `labelKey:` es la forma que `checkUses` cuenta (`\blabelKey:\s*['"]clave['"]`), igual que `QUICK_ACTIONS` en Home.
- `const [chipInk] = useThemeColors(['accent-strong']);` — `useThemeColors` devuelve una tupla en el orden pedido (`src/theme/use-theme-colors.ts`). Pedir `'accent'` está prohibido por `#61 R4`; `'accent-strong'` no hace match con ese guard.
- Iconos: `import { ForkKnife, Map, Stethoscope } from 'reicon-react-native'` — los tres ya se importan en `src/screens/home/index.tsx`.
- Imports: `Image` de `expo-image`; `Redirect, router` de `expo-router`; `Button` de `heroui-native`; `useSafeAreaInsets` de `react-native-safe-area-context`; `useAuth` de `../../providers/auth-provider`; `useTranslate` de `../../providers/language-provider` (mismo hook que `src/app/(auth)/login.tsx`).
- Si `status === 'authenticated'`: `return <Redirect href="/home" />` antes de pintar nada (R4). Con `'loading'` no llega aquí (index no redirige), pero si llegara, se trata igual que `'unauthenticated'`: no hay tercer estado visual.

### 1.4 Clases prescritas contra los guards

| Clase | Dónde | Guard que la mira | Resultado |
| --- | --- | --- | --- |
| `rounded-xl bg-accent` | CTA primario | `consistency-classnames` `#62 R1` y `#98 R10` cuentan `rounded-xl bg-accent(?=[\s'"\`])` en todo `src/` | **mueve +1** en los dos (R7) |
| `rounded-xl` (hueco) | CTA secundario | `#62 R4` prohíbe `rounded-2xl|lg|md|sm` | pasa; `rounded-xl` es el radio de botón de la carta |
| `rounded-full` | chips | `#62 R14` exige que ningún `style={CONTINUOUS_CORNER}` lleve `rounded-full` | pasa; aquí no hay `CONTINUOUS_CORNER` (cápsula) |
| `text-accent-strong` ×2 | etiqueta de chip, label del CTA hueco | `legibility-classnames` `#61 R4`: lista cerrada `inkSites` por fichero + suma | no rompe por sí sola (fichero nuevo fuera de la lista); **se añade la fila** `[screens/welcome/index.tsx, 2]` y `+ 2` a la suma (R11) |
| `text-accent-foreground` | label del CTA primario | `#61 R4` `text-accent(?![-\w])` | pasa (sigue `-`) |
| `text-accent` suelto | — | `#61 R4` | **prohibido**; no se usa |
| `bg-accent`, `border-accent` | CTAs | ningún guard de recuento aparte del de `rounded-xl bg-accent` | `border-accent` tiene precedente en `src/components/pet-switcher.tsx` |
| `bg-surface-secondary` | chips | `#62 R4` `'lleva los tres tiles restantes a rounded-xl'` busca cadenas exactas en ficheros concretos | no afecta a un fichero nuevo |
| `bg-transparent`, `border` | CTA hueco | `#62 R12` busca `border border-border` solo en ficheros con `placeholder=` | n/a |
| `text-muted` | tagline, legal | ninguno (149 usos en `src/`) | pasa |
| `text-3xl`, `text-base`, `text-xs`, `font-bold`, `font-semibold`, `text-center` | textos | `design-drift` `R4` prohíbe `text-[10px]`; `C8` prohíbe `[` | pasan (sin corchetes) |
| `gap-2`, `gap-1.5`, `px-3`, `py-1.5`, `items-center`, `justify-center`, `flex-row`, `w-full`, `flex-1` | layout | `C8` | pasan (`gap-1.5` tiene 6 usos en `src/`: la escala fraccional compila) |
| `style={[entranceStyle, { alignItems: 'center', gap: 16 }]}` | `welcome-content` | `design-drift` busca `StyleSheet` y hex | pasa; ningún `Animated.View` del repo usa `className`, así que el layout del bloque animado va inline |
| `style={{ width: 160, height: 160 }}` | hero | `design-drift` busca `StyleSheet` y hex | pasa (mismo patrón que `splash-logo` en `index.tsx`) |

Candados que **no** se mueven y se comprueban al final: `count(/style=\{CONTINUOUS_CORNER\}/)`,
`count(/bg-accent-soft/)`, `directUses` de `#62 R14`, `'keeps the four Expo
Router entrypoints thin'` de `design-drift R9` (lista cerrada; no se añade
welcome ahí, R3 ya lo cubre).

### 1.5 Movimiento

| Ingrediente | Valor |
| --- | --- |
| Puerta de frecuencia | nivel «raro»: se ve una vez por sesión sin login; propósito: **evitar un corte brusco** tras el splash nativo |
| Herramienta | Reanimated 4 `useSharedValue` + `useAnimatedStyle` + `withTiming` (ya en `home/index.tsx`, `pet-hero-header.tsx`, `floating-tab-bar.tsx`) |
| Propiedades | `opacity` 0→1, `transform: [{ translateY }]` 16→0 (solo transform/opacity: hilo UI, sin layout) |
| Curva | `Easing.bezier(0.23, 1, 0.32, 1)` (ease-out fuerte de la carta/skill) |
| Duración | 240 ms (< 300 ms) |
| Disparo | `useEffect` al montar, una sola escritura: `opacity.value = withTiming(1, { duration: WELCOME_ENTRANCE_MS, easing: WELCOME_ENTRANCE_EASING })`; `translateY.value = withTiming(0, …)` solo si `!reduceMotion` |
| Reduce Motion | `useReducedMotion()`: `translateY` nace en 0 (`useSharedValue(reduceMotion ? 0 : 16)`) y no se anima; `opacity` sí |
| Press en CTAs | el de heroui `Button` (`feedbackVariant` por defecto `scale-highlight`, escala 0.985 en 300 ms según `button.styles.js`); **sin código propio** |
| Hápticos | ninguno |

En test: `setUpTests()` de Reanimated ya está en `test/jest-setup.js` y
`react-native-worklets` está mockeado ahí; `src/components/__tests__/floating-tab-bar.test.tsx`
es el precedente de `withTiming` **real** + `jest.useFakeTimers()` +
`jest.advanceTimersByTime` + `toHaveAnimatedStyle`. El mock parcial de
`react-native-reanimated` del test de welcome **solo** sustituye
`useReducedMotion` (como `home/index.test.tsx`), y deja `withTiming` real —
no se copia el `mockWithTiming` de Home ni el de `pet-hero-header.test.tsx`.
Ventana: `WELCOME_ENTRANCE_MS * 2 + 100` ms dentro de `act`.

### 1.6 Copy

Ocho claves en R1. `welcome.brand` vale `Pet Tracker` en los dos idiomas (la
marca no se traduce). Nada de «PRO». Un solo rótulo por intención:
«Comenzar ahora» es el único «empezar» de la app; `register.iAcceptTerms`
(«Acepto los términos») sigue siendo la aceptación real en el formulario; el
pie de welcome solo informa.

## 2. Tabla de mutaciones y sondas

| Mutación plantada | `it` que debe ponerse rojo | Consulta que lo detecta |
| --- | --- | --- |
| `index.tsx` sigue redirigiendo a `/login` | `index.test.tsx::#118 R2: redirects an unauthenticated session to welcome` | `mockRedirect.mock.calls[0][0].href` |
| `index.tsx` deja de pintar `splash-logo` en `loading` | `index.test.tsx::shows the centered logo while the session is loading` (preexistente) | `getByTestId('splash-logo')` |
| Quitar el `Stack.Protected` alrededor de `welcome` | `welcome/index.test.tsx::R3 registra welcome bajo su propio guard de no autenticado` | regex sobre `readFileSync(app/_layout.tsx)` |
| Poner `welcome` antes de la guarda autenticada | `layout.test.tsx::#95 R2 declara cuatro rutas abiertas…` y `#114 R1` | `children[4].type`, `children.slice(0,4)` |
| Route `welcome.tsx` con lógica dentro | `R3 deja el route de welcome delgado` | recuento de líneas no vacías + `from '../screens/welcome'` |
| Welcome pinta la pantalla con sesión | `R4 con sesión redirige a home y no pinta la pantalla` | `queryByTestId('screen-welcome')` no nulo |
| `paddingBottom: insets.bottom + 96` | `R5 aplica las dimensiones del grupo sin tab bar` | `props.contentContainerStyle` `toEqual` |
| Quitar el legal / cambiar orden de bloques | `R5 apila los siete bloques en orden` | `children.length`, `children[i].props.testID` |
| Hero a 120 px | `R5 pinta hero, marca, tagline y legal con sus clases` | `props.style` `toEqual({ width: 160, height: 160 })` |
| Dos chips / cuarto chip | `R6 cardinalidad` | `getByTestId('welcome-chips').children.length` |
| Chips en otro orden | `R6 fila 1 (testID) y fila 3 (icono)` | `children[i].props.testID`, `children[i].children[0].props.testID` (`icon-map`, `icon-stethoscope`, `icon-fork-knife` del mock) |
| Icono a 20 px | `R6 fila 4` | `children[i].children[0].props.size` |
| Icono con `color={muted}` | `R6 fila 5` | `props.color` igual al valor devuelto por el mock de `useThemeColors` y `useThemeColors` llamado con `['accent-strong']` |
| Etiqueta con `text-accent` suelto | `legibility-classnames::no deja ningún text-accent suelto` y `R6 fila 7` | `filesMatching(/text-accent(?![-\w])/)`; `children[i].children[1].props.className` |
| Chip pulsable | `R6 fila 10` | `children[i].props.onPress` `toBeUndefined()` |
| Tres chips escritos a mano (sin `map`) | `R6 fila 11` | recuento de `text-accent-strong` en el fuente ≠ 2 |
| CTA primario con `router.replace` | `R7 empuja a registro sin reemplazar` | `mockRouter.replace` llamado |
| CTA primario a `/login` | `R7 empuja a registro sin reemplazar` | `mockRouter.push.mock.calls[0][0]` |
| CTA primario `rounded-2xl` | `consistency #62 R4` y `R7 es el botón primario del repo` | `filesMatching`; `props.className` |
| CTA secundario sólido (`bg-accent`) | `R8 es un botón hueco…` y `consistency #62 R1` (recuento +2 en vez de +1) | `props.className`; `toHaveLength` |
| CTA secundario a `/register` | `R8 empuja a login sin reemplazar` | `mockRouter.push` arg |
| Literal `Comenzar ahora` escrito en el fuente | `ui-language::no deja ningún valor fijo del catálogo como literal entero` (una vez `welcome` está en `SCREEN_FILES`) y `#118 R1 checkUses` (0 usos de `welcome.getStarted`) | `wholeLiterals`; recuento `t('clave')` |
| Clave solo en `en` | `language-provider.test.tsx::mantiene la base…` y `tsc` (`es: Record<TranslationKey, string>`) | `Object.keys(es)` vs `en` |
| Traducción EN distinta a la tabla | `R9 muestra el copy en inglés` | `getByText(<literal>)` |
| `translateY` inicial 24 | `R10 arranca invisible y desplazado sin Reduce Motion` | `toHaveAnimatedStyle({ opacity: 0, transform: [{ translateY: 16 }] })` |
| Reduce Motion ignorado | `R10 con Reduce Motion no se desplaza` | `toHaveAnimatedStyle(... translateY: 0)` antes de avanzar |
| Duración 400 ms | `R10 fija la duración y la curva` | `toBe(240)` |
| Animación nunca llega a 1 | `R10 termina visible y en su sitio` | `toHaveAnimatedStyle({ opacity: 1, … })` tras la ventana |
| Hex o `StyleSheet.create` en la pantalla | `design-drift::#118 R11` | regex por fichero |
| `import … from 'expo-linear-gradient'` | `design-drift::#118 R11` y `bun.lock` sin diff (R12) | `not.toMatch`; `git diff` |

Rojos en cascada esperados (declarados para que nadie los lea como fallo):

- Al crear el CTA primario (T3) se ponen rojos los dos recuentos de
  `rounded-xl bg-accent` hasta aplicar `+ 1`; al añadir el bloque
  `Stack.Protected` se pone rojo `layout.test.tsx` `toHaveLength(5)` hasta
  `+ 1`. Los tres ajustes van en el mismo commit verde de T3.
- `#118 R1 checkUses(R16_WELCOME)` y `SCREEN_FILES` `+ 1` se escriben en T8,
  cuando la pantalla ya existe: antes darían ENOENT, no rojo útil.

## 3. Alternativas descartadas

| Alternativa | Por qué no |
| --- | --- |
| Reusar `index.tsx` con dos estados (splash y welcome) | `index` es la ruta ancla que decide por `status`; mezclar la UI de bienvenida ahí obliga a un `Redirect` condicional dentro de una pantalla con contenido y rompe el patrón «index decide, pantallas pintan». La ruta propia deja `index.tsx` con un cambio de un literal. |
| Flag «ya vi la bienvenida» en storage | Decisión (a): la pantalla es el punto de entrada sin sesión, no un onboarding; un flag añade persistencia, un estado más en `index` y una dependencia de storage que la spec no necesita. |
| `router.replace` en los CTAs | Back desde login saldría de la app en vez de volver a welcome; la ley «push profundiza, replace avanza» pide push aquí. |
| `expo-symbols` para los chips | `docs/conventions.md` §Móvil fija `reicon-react-native`; está instalado pero sin uso en `src/`; tres familias de iconos en una app son drift. |
| Sheet blanca con radio 28 sobre una banda/foto (diseño Make) | No hay foto en `assets/`; la banda tintada + sheet obliga a `rounded-card` + `CONTINUOUS_CORNER` fuera del componente `Card` (mueve `directUses` de `#62 R14`) y a un radio que la carta no tiene (28). Sin banda, no hay borde que redondear. |
| Hero con `logo-glow.png` | Es un halo azul; no es la marca ni casa con el acento verde. La mascota `splash-icon.png` ya es el logo del arranque. |
| Badge «PRO», chips con emoji, gradiente en el CTA, veladuras, blur | Carta: sin emojis como iconografía, sin gradientes (`expo-linear-gradient` vetado), sin blur animado; «PRO» no describe nada del producto. |
| Animación de press propia (`scale 0.97`) | heroui `Button` ya trae `scale-highlight`; dos animaciones de press sobre el mismo nodo compiten. |
| Link real en el pie legal | No existe URL de Términos ni Privacidad en el repo; un link muerto es peor que texto plano. |
| Lottie / hápticos en la entrada | Fuera del nivel «raro» justificado; el skill pide cero líneas cuando no hay propósito. |
