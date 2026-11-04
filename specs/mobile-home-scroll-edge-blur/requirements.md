---
feature: "mobile-home-scroll-edge-blur"
status: approved      # draft | spec_ready | approved
tags: [mobile, home, ui, spike, native, spec]
---

# Requisitos — [[mobile-home-scroll-edge-blur]] (#242)

> Notación EARS. Capa: móvil (`mobile-pet-tracker/`). **Spike reversible**:
> prueba la librería nativa `expo-backdrop` 0.1.3 en Inicio. Sin backend, sin
> copy nuevo (ni i18n), **una dependencia nueva con módulo nativo** (exige
> rebuild del dev build: casilla G3 del humano), sin enmienda de
> `docs/ui-guidelines.md` (no hay G4) y sin artboard nuevo (no hay G1: el humano
> pidió el efecto, no un diseño). Diseño en [[design]]; plan TDD en [[tasks]];
> trazabilidad en [[traceability]]. Rutas relativas a `mobile-pet-tracker/`
> salvo que se diga otra cosa.

## Contexto

Petición del humano (2026-11-04), registrada en `feature_list.json` (#242):
probar `expo-backdrop` (https://github.com/rit3zh/expo-backdrop, v0.1.3, módulo
nativo Kotlin/Swift) en Inicio. El efecto buscado: cuando el contenido del
scroll pasa por debajo de la barra de estado se ve un difuminado progresivo en
el borde superior, y cuando pasa por detrás de la tab bar flotante se ve otro en
el borde inferior. «Header» no significa una barra con contenido: es solo el
efecto de borde bajo la barra de estado.

Hechos medidos en el árbol `25c8f0f6` (rama `feature/242-…`; `origin/dev`
`0f1ab26f`, la rama solo añade el registro de #242 en `feature_list.json`) y en
el paquete publicado `expo-backdrop@0.1.3` (README, `src/`, fuentes Kotlin):

1. `src/screens/home/index.tsx` tiene **dos** `return` de pantalla: el de
   mascotas vacías (`<View testID="home-no-pets-screen" …>`) y el principal, un
   `<ScrollView testID="screen-home" className="flex-1 bg-background"
   contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ gap: 14,
   paddingBottom: insets.bottom + 96 }}>` que cierra el componente. Los estados
   de carga (`home-loading`) y de error (`home-error`) viven **dentro** de ese
   ScrollView, no en returns propios.
2. `ProgressiveBlurView` (export de `expo-backdrop`) toma `edge`
   (`"top"` | `"bottom"`), `intensity`, `startOffset`, `tint`
   (`systemThinMaterialDark`, `systemThinMaterialLight`, … ; por defecto
   `systemUltraThinMaterial`), `tintColor` (por defecto: el fondo opaco del
   ancestro al 85 %), `scrollFallback` (true) y `fallbackColor`. En Android
   busca el scroll **entre sus hermanos anteriores**: por eso los overlays van
   **después** del `ScrollView`, como hermanos. Para que los toques atraviesen
   hay que pasar `pointerEvents: 'none'` **dentro de `style`**.
3. El módulo es nativo: no corre en Expo Go ni en el dev build actual. Hay que
   reconstruir el dev build (G3) y probar en Android (G2); ambas casillas son
   del humano.
4. La tab bar flotante (`src/components/floating-tab-bar.tsx`) se posiciona con
   `bottom: insets.bottom + 12` y su contenedor mide `h-16` (64 dp). No se toca.

## Decisiones cerradas (Codex no las reabre)

- **D1. Dependencia: `expo-backdrop` exacta `0.1.3`**, instalada con bun dentro
  de `mobile-pet-tracker/` (`bunx expo install expo-backdrop@0.1.3`; si
  `package.json` queda con `~` o `^`, se edita a mano a `"expo-backdrop": "0.1.3"`
  y se corre `bun install` para refrescar `bun.lock`). **No** se añade
  `expo-linear-gradient` ni `@react-native-masked-view/masked-view`. Nunca `npm`
  ni `npx`.
- **D2. Alcance de producción: solo `src/screens/home/index.tsx`** (más
  `package.json` y `bun.lock` por D1). No se toca `floating-tab-bar.tsx`,
  `src/app/(tabs)/_layout.tsx`, `src/app/(tabs)/home.tsx` ni ninguna otra
  pantalla. No hay `app.json`/config plugin: el paquete no trae `app.plugin.js`
  y el autolinking de Expo lo recoge.
- **D3. Estructura.** El `return` principal pasa a ser un `<View
  testID="home-screen-root" className="flex-1 bg-background">` con tres hijos,
  en este orden: el `ScrollView` actual (sin cambios, R8), el overlay superior y
  el overlay inferior. El `View` raíz lleva `bg-background` para que el lavado
  por defecto de la librería (fondo opaco del ancestro) sea determinista. El
  return de `home-no-pets-screen` **no cambia**.
- **D4. Overlay superior.** `ProgressiveBlurView` de `'expo-backdrop'` con
  `testID="home-edge-blur-top"`, `edge="top"`, `tint` por R6 y `style` =
  `{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top + 24,
  pointerEvents: 'none' }` (objeto plano, **no** array, **no** `StyleSheet`).
- **D5. Overlay inferior.** `ProgressiveBlurView` con
  `testID="home-edge-blur-bottom"`, `edge="bottom"`, `tint` por R6 y `style` =
  `{ position: 'absolute', bottom: 0, left: 0, right: 0, height: insets.bottom +
  12 + 64 + 24, pointerEvents: 'none' }`. Los números son: `12` = separación de
  la tab bar al borde (`insets.bottom + 12` de `floating-tab-bar.tsx`), `64` =
  alto de la tab bar (`h-16`), `24` = cola del degradado. Se declaran como
  constantes de módulo con nombre (nombres libres) en `index.tsx`.
- **D6. Props mínimas.** Cada overlay recibe **solo** `testID`, `edge`, `tint` y
  `style`. Ni `intensity`, ni `startOffset`, ni `tintColor`, ni `scrollFallback`,
  ni `fallbackColor`: se prueban los valores por defecto de la librería, que es
  lo que el spike quiere medir.
- **D7. Tema.** `tint` sale de `useUniwind().theme` (patrón de
  `floating-tab-bar.tsx`): `'dark'` da `'systemThinMaterialDark'`; cualquier otro
  valor da `'systemThinMaterialLight'`. `useUniwind()` se llama junto a
  `const insets = useSafeAreaInsets();`, **antes** del early return de mascotas
  vacías (reglas de hooks).
- **D8. Solo en el return principal.** Los overlays existen en carga, error y
  contenido (todo lo que pinta el ScrollView) y **no** existen en
  `home-no-pets-screen` (no hay scroll que difuminar).
- **D9. Sin copy ni i18n.** Los overlays son decorativos: sin `t()`, sin
  `accessibilityLabel`, sin texto. El test double no añade copy.
- **D10. Reversible.** Revertir el spike = quitar el import, el `useUniwind`,
  el `View` raíz y los dos overlays de `index.tsx`, y quitar `expo-backdrop` de
  `package.json`/`bun.lock` (y deshacer la enmienda `42 + 1 + 1` → `42 + 1` de
  R1). No queda nada más: ninguna otra pantalla, doc ni config depende de él.
- **D11. La feature no pasa a `done` con los tests verdes.** Se queda en
  `spec_ready` hasta que el humano cierre G2 y G3 (§Aprobación). El
  `reviewer` aprueba el código; el humano decide si el spike convence.
- **D12. `testID` pasa por spread tipado (enmienda del 2026-11-04).**
  `IProgressiveBlurViewProps` de `expo-backdrop` 0.1.3 solo declara `style` y
  `children`, así que `testID` como atributo explícito da TS2322. El componente
  hace `<Native {...props}>`, de modo que en ejecución `testID` llega igual. Los
  overlays pasan `testID` esparciendo un objeto con nombre
  (`{...TOP_EDGE_BLUR_PROPS}`), sin `@ts-ignore`, sin `as` y sin
  `declare module`: TypeScript no aplica el chequeo de propiedades sobrantes a un
  spread en JSX. Los props en ejecución son los mismos de R2 a R6, así que ningún
  test cambia.

## Convenciones de esta spec

- Cada test nuevo o enmendado nombra `#242 R<n>` (siempre seguido de ` R<n>`;
  `design-drift` exige ` R<n>` tras cada `#NNN` en código y tests). En
  `src/screens/home/index.tsx` no se escribe `#242` en comentarios salvo como
  `#242 R<n>`.
- Los `fireEvent`, `act` y `render` van con `await` (RNTL 14).
- Corre jest con rutas por prefijo sin paréntesis (`src/screens/home`,
  `src/__tests__`).
- Los tests de pantalla van en `describe('#242 R<n>: …')` **nuevos al final de**
  `src/screens/home/index.test.tsx` (después de `#216 R3`), con
  `await renderHome();`. Reutilizan los helpers del fichero (`renderHome`,
  `makePet`, `pending`, `mockListPets`, `mockGetPet`, `mockGetDailyActivity`,
  `mockUseAuth`) y el arranque de `describe('#216 R3: …')` (`beforeEach` con
  `jest.clearAllMocks()`, `mockUseAuth.mockReturnValue({ status:
  'authenticated', … })`, `mockGetDailyActivity.mockReturnValue(pending())`).
- **Doble de `expo-backdrop`** (prescrito por intención, a verificar contra el
  fichero destino): un `jest.mock('expo-backdrop', …)` **de nivel de fichero**
  en `index.test.tsx`, **sin** la opción `virtual` (la veta
  `jest-virtual-mock-lock.test.ts`: el módulo ya estará instalado, por eso el
  commit de la dependencia va antes), cuya fábrica exporta `ProgressiveBlurView`
  como componente que pinta un `View` de `react-native` con **todas** las props
  recibidas (`React.createElement(View, props)`), igual que el doble de
  `reicon-react-native` que ya existe en el fichero. No importa nada de
  producción.
- **Tema en el test:** `let mockTheme: 'light' | 'dark' = 'light';` y
  `jest.mock('uniwind', …)` de nivel de fichero que devuelve
  `{ ...jest.requireActual('uniwind'), useUniwind: () => ({ theme: mockTheme,
  hasAdaptiveThemes: false }) }` (patrón de `src/screens/profile/index.test.tsx`
  y `src/components/__tests__/floating-tab-bar.test.tsx`). El `Uniwind` real
  sigue siendo el mismo objeto, así que los `jest.spyOn(Uniwind,
  'getCSSVariable')` que ya hay no se rompen. Cada `describe` nuevo fija
  `mockTheme = 'light'` en su `beforeEach`.
- **Insets en el test:** el doble actual de `react-native-safe-area-context`
  devuelve el literal `{ top: 40, right: 0, bottom: 24, left: 0 }`. Pasa a
  `let mockInsets = { top: 40, right: 0, bottom: 24, left: 0 };` y
  `useSafeAreaInsets: () => mockInsets` (patrón `mockInsets` de los tests de
  vacunas). Los valores por defecto no cambian, así que los tests viejos no se
  mueven. Cada `describe` nuevo restaura `mockInsets` a esos valores en su
  `afterEach`.
- Los valores esperados (alturas, tints, estilos) se escriben **a mano** en los
  tests; no se importan constantes de producción como valor esperado.
- Los hijos de un nodo se leen con `node.children` y
  `typeof child === 'string' ? child : child.props.testID` (patrón de
  `profile` y de `home-loading`). Entre nodos se comparan `testID`, no con
  `toBe(nodo)`.
- `StyleSheet` no aparece en el fichero de test (lo veta la guarda
  `featureFiles` de `design-drift`): los estilos se leen de `props.style` y se
  comparan con `toEqual` contra un objeto literal.
- **Sin color ni clase de guarda nuevos.** El único literal de clase nuevo es
  `flex-1 bg-background` en el `View` raíz (ya existe en el `ScrollView`).
  Ninguna hex, ninguna clase arbitraria, ningún `StyleSheet.create`, ninguna
  sombra, ningún `\bBlurView\b` suelto (lo veta `#195 R19` en
  `home-photo-hero-canvas.test.ts`; `ProgressiveBlurView` no lo viola porque no
  tiene frontera de palabra antes de `BlurView`).

## Evidencia (medida en `25c8f0f6`)

Cuentas con `grep -cF -- "<literal>" <fichero>` desde `mobile-pet-tracker/`
(líneas que contienen el literal):

| Fichero | Literal | Hoy | Tras #242 |
|---|---|---|---|
| `src/screens/home/index.tsx` | `testID="screen-home"` | 1 | 1 |
| `src/screens/home/index.tsx` | `testID="home-no-pets-screen"` | 1 | 1 |
| `src/screens/home/index.tsx` | `<ScrollView` | 1 | 1 |
| `src/screens/home/index.tsx` | `</ScrollView>` | 1 | 1 |
| `src/screens/home/index.tsx` | `contentInsetAdjustmentBehavior` | 1 | 1 |
| `src/screens/home/index.tsx` | `const insets = useSafeAreaInsets();` | 1 | 1 |
| `src/screens/home/index.tsx` | `from 'uniwind'` | 0 | 1 |
| `src/screens/home/index.tsx` | `from 'expo-backdrop'` | 0 | 1 |
| `src/screens/home/index.tsx` | `testID="home-screen-root"` | 0 | 1 |
| `src/screens/home/index.tsx` | `testID="home-edge-blur-top"` | 0 | 1 |
| `src/screens/home/index.tsx` | `testID="home-edge-blur-bottom"` | 0 | 1 |
| `src/screens/home/index.tsx` | `edge="top"` | 0 | 1 |
| `src/screens/home/index.tsx` | `edge="bottom"` | 0 | 1 |
| `src/screens/home/index.tsx` | `StyleSheet` | 0 | 0 |
| `src/screens/home/index.tsx` | `systemThinMaterialDark` | 0 | 1 |
| `src/screens/home/index.tsx` | `systemThinMaterialLight` | 0 | 1 |
| `src/screens/home/index.tsx` | `intensity` | 0 | 0 |
| `src/screens/home/index.test.tsx` | `expo-backdrop` | 0 | 1 |
| `src/screens/home/index.test.tsx` | `mockInsets` | 0 | >= 2 |
| `src/screens/home/index.test.tsx` | `StyleSheet` | 0 | 0 |
| `package.json` | `"expo-backdrop": "0.1.3"` | 0 | 1 |
| `bun.lock` | `expo-backdrop` | 0 | >= 1 |

Cuenta de `grep -cE '\bBlurView\b' src/screens/home/index.tsx`: hoy 0, tras 0.
`grep -c "(enmendado por #242 R" src/__tests__/canvas-foundations.test.ts`:
hoy 0, tras 1. Dependencias de `package.json`: hoy 43 (`dependencies`) y 8
(`devDependencies`); tras 44 y 8.

Guards de la carta que **no se mueven** (el cambio no añade color, radio, copy,
`ChevronRight`, `signOut` ni `StyleSheet`): `design-drift.test.ts` (`#193 R11`,
`#68 R18`, `#69 R13`, `#71 R13`), `home-photo-hero-canvas.test.ts` (`#195 R19` y
los recuentos de `TABULAR_NUMS`, `CONTINUOUS_CORNER`, `text-accent-strong`),
`consistency-classnames.test.ts`, `legibility-classnames.test.ts`,
`ui-language.test.ts`, `ui-copy-table.ts`, `jest-virtual-mock-lock.test.ts`.
El handoff pone `T0` (suites `src/screens/home` y `src/__tests__` en verde
**antes** de editar) y la misma tras cada commit de producción.

## Requisitos funcionales

- **R1**: WHEN se instala la dependencia del spike, THE SYSTEM SHALL declarar en
  `package.json` `dependencies` la clave `expo-backdrop` con el valor exacto
  `"0.1.3"` (sin `~` ni `^`), dejar `bun.lock` consistente con ella y dejar
  `dependencies` con 44 claves y `devDependencies` con 8, sin
  `expo-linear-gradient` ni `@react-native-masked-view/masked-view`.
  - Test: `src/__tests__/canvas-foundations.test.ts` y, por la enmienda (c),
    `src/__tests__/zones-canvas-fidelity.test.ts`.
    (a) Se **enmienda** el `it` `#197 R22: no añade dependencias (enmendado por
    #217 R8) (enmendado por #214 R23)`: el título gana el sufijo
    ` (enmendado por #242 R1)`, la longitud pasa de `42 + 1` a `42 + 1 + 1` con el
    comentario `// #242 R1: expo-backdrop` (el comentario de `#214 R23` se
    conserva) y la de `devDependencies` sigue en 8.
    (b) Un `it` nuevo `#242 R1: expo-backdrop queda fijada exacta en 0.1.3`, en
    un `describe('#242 R1: dependencia del spike')` nuevo al final del fichero:
    lee `package.json` y aserta `manifest.dependencies['expo-backdrop']`
    `toBe('0.1.3')`, `manifest.dependencies['expo-linear-gradient']` y
    `manifest.dependencies['@react-native-masked-view/masked-view']`
    `toBeUndefined()`, y que `manifest.devDependencies['expo-backdrop']`
    `toBeUndefined()`. Nace rojo (la dependencia no existe; el recuento enmendado
    espera 44).
  - Test B (anclas, handoff): `grep -cF -- '"expo-backdrop": "0.1.3"'
    package.json` imprime `1`; `grep -cF expo-backdrop bun.lock` imprime al
    menos `1`; `bun install --frozen-lockfile` termina con exit 0.
  - Mutaciones plantadas (cada una se revierte): (a) `"~0.1.3"` o `"^0.1.3"` →
    rojo el `it` nuevo; (b) mover la clave a `devDependencies` (zona ciega) →
    rojo (`dependencies` pasa a 43 y `devDependencies['expo-backdrop']` existe);
    (c) añadir también `expo-linear-gradient` → rojo (recuento 45 y la ausencia
    explícita); (d) dejar el título sin el sufijo ` (enmendado por #242 R1)` →
    rojo el ancla `grep -c "(enmendado por #242 R"` (cuenta 0 en vez de 1).
    (e) **Enmienda del 2026-11-04 (candado omitido).** `src/__tests__/zones-canvas-fidelity.test.ts`
    tiene un segundo candado global de dependencias, el `it` `#202 R25:
    package.json no añade dependencias (enmendado por #217 R8) (enmendado por
    #214 R23)`, que espera `42 + 1`. Se enmienda igual que (a): el título gana
    el sufijo ` (enmendado por #242 R1)`, la longitud pasa a `42 + 1 + 1` con el
    comentario `// #242 R1: expo-backdrop` (el de `#214 R23` se conserva) y el
    resto del `it` no cambia. Mutación: devolver la cifra a `42 + 1` → rojo
    (la suite falla con 44 claves). Ancla: `grep -c "(enmendado por #242 R"
    src/__tests__/zones-canvas-fidelity.test.ts` pasa de 0 a 1.

- **R2**: WHILE Inicio pinta su `return` principal (el `ScrollView`, en los
  estados de carga, de error y de contenido), THE SYSTEM SHALL renderizar dos
  `ProgressiveBlurView` de `expo-backdrop`, uno con `testID="home-edge-blur-top"`
  y `edge="top"` y otro con `testID="home-edge-blur-bottom"` y `edge="bottom"`,
  cada uno recibiendo exactamente las props `testID`, `edge`, `tint` y `style`.
  - Test: `describe('#242 R2: Inicio pinta los dos bordes con blur')`.
    `it.each([['contenido'], ['carga'], ['error']])('#242 R2: el estado %s pinta
    ambos bordes')`, una rama por estado: contenido
    (`mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] })`,
    `mockGetPet.mockResolvedValue({ kind: 'ok', pet })`,
    `await screen.findByTestId('collar-card')`), carga
    (`mockListPets.mockReturnValue(pending<PetsState>())`, `await renderHome()`,
    `screen.getByTestId('home-loading')`) y error
    (`mockListPets.mockResolvedValue({ kind: 'error' })`,
    `await screen.findByTestId('home-error')`). En cada uno:
    `getByTestId('home-edge-blur-top').props.edge` `toBe('top')`,
    `getByTestId('home-edge-blur-bottom').props.edge` `toBe('bottom')`, y
    `Object.keys(props).sort()` de cada uno `toEqual(['edge', 'style', 'testID',
    'tint'])` (D6: ni `intensity` ni otra prop). El doble pinta `View` normales:
    se leen con `getByTestId` sin `includeHiddenElements`. Nace rojo (los
    overlays no existen).
  - Mutaciones plantadas: (a) quitar el overlay inferior → rojo en los tres
    estados; (b) `edge="top"` en ambos → rojo (`edge` del inferior); (c) añadir
    `intensity={50}` a uno de los dos (zona ciega: la lista exacta de props
    cubre a cada overlay por separado) → rojo; (d) montar los overlays solo en
    el estado de contenido (dentro de una rama) → rojo en carga y error.

- **R3**: WHEN Inicio pinta los dos overlays, THE SYSTEM SHALL darles el
  `style` exacto de D4 y D5: el superior
  `{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top + 24,
  pointerEvents: 'none' }` y el inferior `{ position: 'absolute', bottom: 0,
  left: 0, right: 0, height: insets.bottom + 12 + 64 + 24, pointerEvents: 'none'
  }`, calculados con los insets del dispositivo en cada render.
  - Test: `describe('#242 R3: la geometría sigue a los insets')`.
    `it.each([[{ top: 47, bottom: 31 }, 71, 131], [{ top: 0, bottom: 0 }, 24,
    100]])('#242 R3: con insets %j las alturas son %i y %i')`: fija `mockInsets`
    con esos `top`/`bottom` (y `left`/`right` 0) antes de `await renderHome()`;
    con la mascota de contenido, espera `home-edge-blur-top` y aserta
    `props.style` `toEqual({ position: 'absolute', top: 0, left: 0, right: 0,
    height: <altura superior>, pointerEvents: 'none' })` y para
    `home-edge-blur-bottom` `toEqual({ position: 'absolute', bottom: 0, left: 0,
    right: 0, height: <altura inferior>, pointerEvents: 'none' })`. Los valores
    `71`, `131`, `24` y `100` están escritos a mano; los insets de la primera
    rama (`47`/`31`) son distintos entre sí y de los por defecto (`40`/`24`)
    para que ninguna suma cruzada acierte por casualidad. Nace rojo.
  - Mutaciones plantadas: (a) altura fija `insets.top` sin `+ 24` → rojo ambas
    ramas; (b) altura inferior sin el `64` o sin el `12` → rojo ambas ramas
    (`131` y `100` los distinguen); (c) altura superior calculada con
    `insets.bottom` (zona ciega: con los insets por defecto `40`/`24` un cruce
    pasaría; con `47`/`31` no) → rojo; (d) `top: insets.top` en vez de `top: 0`
    → rojo (el estilo es exacto).

- **R4**: WHEN Inicio pinta los dos overlays, THE SYSTEM SHALL pasar
  `pointerEvents: 'none'` dentro de `style` en **cada** uno, de modo que los
  toques y el scroll atraviesen el efecto.
  - Test: `describe('#242 R4: los overlays no capturan toques')`.
    `it.each([['home-edge-blur-top'], ['home-edge-blur-bottom']])('#242 R4: %s
    lleva pointerEvents none en style')`: con la mascota de contenido,
    `screen.getByTestId(id).props.style.pointerEvents` `toBe('none')` y
    `screen.getByTestId(id).props.pointerEvents` `toBeUndefined()` (la
    librería lo lee del estilo; D6 prohíbe una prop extra). Nace rojo.
  - Mutaciones plantadas: (a) quitar `pointerEvents` del overlay superior →
    rojo solo la rama superior; (b) quitarlo del inferior → rojo solo la rama
    inferior (cada overlay tiene su rama: zona ciega de un candado agregado);
    (c) pasarlo como prop `pointerEvents="none"` en vez de dentro de `style` →
    rojo ambas ramas; (d) `'box-none'` → rojo.

- **R5**: WHEN Inicio pinta su `return` principal, THE SYSTEM SHALL ponerlo
  dentro de un `View` raíz con `testID="home-screen-root"` y clase exacta
  `flex-1 bg-background`, cuyos hijos, en este orden, son `screen-home`
  (el `ScrollView`), `home-edge-blur-top` y `home-edge-blur-bottom`, de modo
  que ambos overlays van **después** del scroll y como hermanos suyos.
  - Test: `describe('#242 R5: los overlays son hermanos posteriores al scroll')`,
    `it('#242 R5: la raíz contiene scroll, borde superior y borde inferior en
    ese orden')`: con la mascota de contenido, `const root =
    screen.getByTestId('home-screen-root')`; `root.props.className` `toBe('flex-1
    bg-background')`; `root.children` mapeados a `testID` `toEqual(['screen-home',
    'home-edge-blur-top', 'home-edge-blur-bottom'])` y `toHaveLength(3)`.
    Si el renderer expone un nodo intermedio en `children`, se ajusta la
    **lectura** (como en `profile`), nunca la aserción. Nace rojo.
  - Mutaciones plantadas: (a) overlays **antes** del `ScrollView` → rojo (orden;
    en Android la librería no encontraría el scroll); (b) overlays dentro del
    `ScrollView` → rojo (hijos de la raíz = 1); (c) `home-screen-root` sin
    `bg-background` (zona ciega del lavado por defecto) → rojo (clase exacta);
    (d) un `Fragment` en vez del `View` raíz → rojo (el testID no existe).

- **R6**: WHEN Inicio pinta los dos overlays, THE SYSTEM SHALL fijar `tint` en
  `'systemThinMaterialDark'` si `useUniwind().theme` es `'dark'` y en
  `'systemThinMaterialLight'` en cualquier otro caso, en **los dos** overlays.
  - Test: `describe('#242 R6: el tinte sigue al tema')`.
    `it.each([['light', 'systemThinMaterialLight'], ['dark',
    'systemThinMaterialDark']])('#242 R6: con tema %s el tint es %s')`: fija
    `mockTheme`, y aserta `props.tint` `toBe(<tint>)` en `home-edge-blur-top` y
    en `home-edge-blur-bottom` (escrito a mano en la tabla). Nace rojo.
  - Mutaciones plantadas: (a) tint fijo claro → rojo la rama `dark`; (b) tint
    fijo oscuro → rojo la rama `light`; (c) tema aplicado solo al superior
    (zona ciega: el candado mira ambos overlays en cada rama) → rojo; (d)
    invertir la condición → rojo ambas ramas.

- **R7**: WHILE Inicio pinta la pantalla de mascotas vacías
  (`home-no-pets-screen`), THE SYSTEM SHALL no renderizar ninguno de los dos
  overlays ni el `View` raíz `home-screen-root`.
  - Test: `describe('#242 R7: sin mascotas no hay blur')`,
    `it('#242 R7: la pantalla vacía no pinta overlays ni raíz del blur')`:
    `mockListPets.mockResolvedValue({ kind: 'ok', pets: [] })`,
    `await screen.findByTestId('home-no-pets-screen')`; luego
    `screen.queryByTestId('home-edge-blur-top', { includeHiddenElements: true })`,
    `…('home-edge-blur-bottom', …)` y `…('home-screen-root', …)` `toBeNull()`
    cada uno, y `screen.queryByTestId('screen-home')` `toBeNull()`.
    **Nace verde** (el overlay aún no existe cuando se escribe): es el candado
    de ausencia, declarado, y su prueba es la mutación (a).
  - Mutaciones plantadas: (a) poner los dos overlays también dentro del return
    de `home-no-pets-screen` → rojo; (b) subir el `View` raíz por encima del
    `if` del early return (envolver ambas ramas) → rojo (`home-screen-root`
    existiría); (c) poner solo el overlay inferior en la rama vacía (zona
    ciega: tres `queryByTestId` por separado) → rojo.

- **R8**: WHEN Inicio pinta su `return` principal, THE SYSTEM SHALL conservar el
  `ScrollView` sin cambios: `testID="screen-home"`, clase exacta
  `flex-1 bg-background`, `contentInsetAdjustmentBehavior="automatic"` y
  `contentContainerStyle` igual a `{ gap: 14, paddingBottom: insets.bottom + 96
  }`, y sin ninguna prop de scroll nueva.
  - Test: `describe('#242 R8: el ScrollView no cambia')`,
    `it('#242 R8: conserva clase, inset automático y relleno inferior')`: con
    la mascota de contenido y los insets por defecto, `screen.getByTestId('screen-home')`
    tiene `props.className` `toBe('flex-1 bg-background')`,
    `props.contentInsetAdjustmentBehavior` `toBe('automatic')` y
    `props.contentContainerStyle` `toEqual({ gap: 14, paddingBottom: 120 })`
    (`24 + 96`, escrito a mano), y `props.onScroll` `toBeUndefined()`,
    `props.scrollEventThrottle` `toBeUndefined()`. **Nace verde** (fija lo que
    R2–R5 no deben tocar); su prueba son las mutaciones.
  - Mutaciones plantadas: (a) quitar `bg-background` del ScrollView → rojo;
    (b) `paddingBottom: insets.bottom + 96` cambiado a `+ 24 + 12 + 64` → rojo;
    (c) añadir `onScroll` (zona ciega: no hace falta para la librería, que
    lee el scroll nativo) → rojo; (d) quitar `contentInsetAdjustmentBehavior`
    → rojo.

- **R9**: WHEN termina la implementación, THE SYSTEM SHALL limitar el cambio a
  `package.json`, `bun.lock`, `src/screens/home/index.tsx`,
  `src/screens/home/index.test.tsx` y
  `src/__tests__/canvas-foundations.test.ts`,
  `src/__tests__/zones-canvas-fidelity.test.ts` (solo la enmienda R1 (e)), no
  añadir copy, no tocar
  `floating-tab-bar.tsx` ni otra pantalla, y mantener verdes los guards de la
  carta.
  - Test A (anclas, handoff): las cifras de «Tras #242» de la tabla de
    Evidencia, medidas con `grep -cF --`; `grep -cE '\bBlurView\b'
    src/screens/home/index.tsx` imprime `0`.
  - Test B (alcance, por diff): `git diff --name-only <H0>..HEAD` solo lista
    `mobile-pet-tracker/package.json`, `mobile-pet-tracker/bun.lock`,
    `mobile-pet-tracker/src/screens/home/index.tsx`,
    `mobile-pet-tracker/src/screens/home/index.test.tsx`,
    `mobile-pet-tracker/src/__tests__/canvas-foundations.test.ts`,
    `mobile-pet-tracker/src/__tests__/zones-canvas-fidelity.test.ts` y ficheros
    bajo `progress/` y `specs/mobile-home-scroll-edge-blur/traceability.md`; ni
    `src/components/`, ni `src/app/`, ni `src/i18n/`, ni `ui-copy-table.ts`, ni
    `docs/`, ni `app.json`/`app.config.ts`. `git diff -w --numstat <H0>..HEAD --
    src/screens/home/index.tsx` borra como mucho 2 líneas (ignorando la
    sangría: el `ScrollView` y todo su contenido siguen presentes; el diff real
    es el import, el hook, las constantes, el `View` raíz y los dos overlays).
  - Test C (guards): `bunx jest src/screens/home src/__tests__` en verde con
    las mismas cifras que T0 salvo los `it` nuevos (R1: 1, R2: 3, R3: 2, R4: 2,
    R5: 1, R6: 2, R7: 1, R8: 1; total 13).
  - Mutación plantada: (a) añadir una `t('…')` o un literal de copy en un
    overlay → rojo `ui-language`/`ui-copy-table`; (b) escribir un `#242` sin
    ` R<n>` en un comentario de `index.tsx` → rojo `design-drift`; (c) usar
    `StyleSheet.create` para el estilo de los overlays → rojo `design-drift`
    (`#193 R11`) y `#195 R19`.

## Enmiendas a otras features

| Enmendado | Ruta | Qué cambia | Dónde se anota |
|---|---|---|---|
| #197 R22 (ya enmendado por #217 R8 y #214 R23) | `src/__tests__/canvas-foundations.test.ts`, `it` `#197 R22: no añade dependencias (enmendado por #217 R8) (enmendado por #214 R23)` | El recuento de `dependencies` pasa de `42 + 1` a `42 + 1 + 1` por `expo-backdrop`; `devDependencies` sigue en 8 | Sufijo ` (enmendado por #242 R1)` en el título del `it` y comentario `// #242 R1: expo-backdrop` junto a la cifra. El texto de la spec de #197 no se edita: la enmienda y su casilla viven aquí (§Aprobación) |
| #202 R25 (ya enmendado por #217 R8 y #214 R23) | `src/__tests__/zones-canvas-fidelity.test.ts`, `it` `#202 R25: package.json no añade dependencias (enmendado por #217 R8) (enmendado por #214 R23)` | El recuento de `dependencies` pasa de `42 + 1` a `42 + 1 + 1` por `expo-backdrop` | Sufijo ` (enmendado por #242 R1)` en el título del `it` y comentario `// #242 R1: expo-backdrop`. Candado omitido por la spec original; enmienda del 2026-11-04 |

## Paso de smoke nuevo (G2, humano) y rebuild (G3, humano)

**G3 primero**: el humano reconstruye el dev build de Android con el módulo
nativo (`expo prebuild` + build; la librería no corre en Expo Go ni en el dev
build actual). Sin G3 no hay G2.

**G2**, en el dev build de Android reconstruido, en tema **claro** y en
**oscuro** (anotar en `progress/` el resultado; lo registra el leader):

1. Abrir Inicio con una mascota: el contenido se ve completo; no hay franja ni
   lavado de color visible mientras el scroll está arriba del todo (o se
   anota cómo se ve).
2. Hacer scroll hacia abajo: cuando el contenido pasa por debajo de la barra de
   estado aparece el difuminado del borde superior, y se ve progresivo.
3. Con contenido por debajo de la tab bar flotante, el difuminado del borde
   inferior aparece detrás de ella y no tapa sus pestañas ni el indicador.
4. Los toques atraviesan ambos bordes: se puede pulsar un tile o un enlace justo
   bajo el difuminado, y el scroll no se atasca al arrastrar sobre él.
5. Sin tirones al hacer scroll rápido, sin cuelgues ni cierres de la app, y la
   pantalla sin mascotas (Inicio vacío) no muestra el efecto.
6. Repetir 1 a 5 en tema claro y en oscuro; apuntar si el tinte desentona con
   el fondo en alguno.

Si el humano rechaza el spike, se revierte por D10; extenderlo a otras
pantallas es decisión suya y otra feature.

## Fuera de alcance

- Cualquier otra pantalla, la tab bar flotante (`floating-tab-bar.tsx`, que
  sigue con `expo-blur`), `src/app/(tabs)/_layout.tsx` y los headers de
  navegación.
- Una barra de cabecera con contenido, títulos o iconos: el «header» es solo el
  efecto de borde.
- Tunear `intensity`, `startOffset`, `tintColor`, `scrollFallback` o
  `fallbackColor` (D6): el spike mide los valores por defecto.
- Reemplazar `expo-blur` en el resto de la app, `expo-linear-gradient` y
  `@react-native-masked-view/masked-view`.
- Copy, i18n, colores nuevos, iconos, animaciones, accesibilidad de los
  overlays (son decorativos).
- Enmiendas de `docs/ui-guidelines.md` y artboards del canvas.
- iOS: se prueba en Android (G2); si la librería funciona en iOS es una
  pregunta de otro smoke, sin compromiso de esta spec.
- Backend, `app.json`, `app.config.ts`, EAS y el rebuild del dev build
  (G3, del humano).

## Aprobación

- [X] Aprobado por humano (fecha: 2026-11-04; aprobación expresa del humano en la sesión @Frontend, no firma delegada: el spike queda fuera de los mandatos) ← gate obligatorio antes de implementar
  (R1 a R9)
- [X] Enmienda de #197 R22 aprobada (la firma de esta spec la cubre; casilla
  propia porque la checklist de firma pide dejar la casilla de la enmienda)
  (fecha: 2026-11-04)
- [X] Enmienda de #202 R25 (R1 (e)) aprobada por el leader con el permiso
  permanente de desbloquear a Codex; mecánica, mismo cambio que #197 R22
  (fecha: 2026-11-04)
- [X] **G3**: no aplica; el humano revirtió el spike por rendimiento antes de
  reconstruir el dev build (fecha: 2026-11-04)
- [X] **G2**: no aplica; decisión D10 tomada por el humano sin smoke: revertir
  (fecha: 2026-11-04). El código de Inicio y `expo-backdrop` se quitaron en la
  rama `feature/242-revert-home-edge-blur`; esta spec queda como registro.
- Base congelada: `25c8f0f6` (`feature/242-mobile-home-scroll-edge-blur`;
  `origin/dev` `0f1ab26f`, la rama solo añade el registro de #242 en
  `feature_list.json`). Si `dev` avanza antes del handoff, se mergea `dev` y se
  re-miden las anclas de §Evidencia.
