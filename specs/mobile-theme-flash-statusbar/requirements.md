---
feature: "mobile-theme-flash-statusbar"
status: draft
tags: [harness, spec]
---

# Requisitos — [[mobile-theme-flash-statusbar]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y el inventario cerrado de candados, y
> [[../../docs/architecture|architecture]] para las reglas de arquitectura.
> Origen: `progress/plan_ui-2026-10-26.md` §1 (decisiones cerradas), §2 entrada #217
> (puntos 2 y 7 del plan de mejoras de UI) y `progress/explore_ui-tema-barra-drawer-2026-10-26.md`.
> Todas las rutas son relativas a `mobile-pet-tracker/src/` salvo que se diga otra cosa.

## Contexto y decisiones del humano (cerradas, plan §1)

- **Flash al cambiar de pestaña**: se arregla poniendo el fondo de escena por tokens
  con un `ThemeProvider` raíz (el `sceneStyle` por pestaña queda como contingencia, no
  como alcance) y se **desinstalan** `react-native-nitro-theme-transition` y
  `react-native-nitro-modules`. El cambio de tema pasa a ser instantáneo (estilo de #40,
  sin fade). Retirar el módulo nativo exige reconstruir el dev build: **lo hace el
  humano (gate G3)**; ninguna IA lanza `eas build` ni lo prescribe a otra IA.
- **Barra de estado**: `StatusBar style="auto"` global (iconos según el tema) y iconos
  claros en las pantallas con hero.
- Hipótesis de la causa del flash (de la exploración, **sin medir en dispositivo**):
  la escena de las pestañas se pinta con el fondo del tema de React Navigation
  (`DefaultTheme`: `rgb(242, 242, 242)` claro, `rgb(1, 1, 1)` oscuro) y no con el token
  `background` de la app; con `animation: 'fade'` el cruce deja ver esa diferencia.
  Esta spec prueba **la fuente de pintura** (R3), no la ausencia de parpadeo, que solo se
  mide en el smoke G2.

## Desviación consciente del plan (dejar a la vista del humano)

El plan dice «claro en pantallas hero según la ruta activa» y lo situaba en
`app/(tabs)/_layout.tsx`. Verificado contra el árbol: Inicio sin mascotas
(`home-no-pets-screen`, fondo `bg-background`, sin hero) y Perfil sin mascotas
(`showHero` falso, título `text-foreground`) **no tienen hero**. Una elección por ruta
dejaría iconos claros sobre fondo claro, invisibles. Por eso la barra clara la declara
un componente propio **dentro de las ramas con hero** y solo mientras su pantalla tiene
el foco (R5, R6). `app/(tabs)/_layout.tsx` queda sin cambio (R7).

## Contrato de los símbolos nuevos

| Símbolo | Fichero | Contrato |
|---|---|---|
| `useNavigationTheme()` | `theme/navigation-theme.ts` (export nombrado) | Devuelve un `Theme` de React Navigation (tipo `Theme` de `expo-router`). |
| `HeroStatusBar` | `components/hero-status-bar.tsx` (export nombrado) | Sin props. Devuelve `null` sin foco; con foco, `<StatusBar style="light" />` de `expo-status-bar`. |

## Requisitos funcionales

### Tema de navegación y fondo de escena

- **R1**: WHEN `useNavigationTheme()` se llama THE SYSTEM SHALL devolver un objeto
  `Theme` con `dark` igual a `useUniwind().theme === 'dark'`, `fonts` igual por
  identidad a `DefaultTheme.fonts` (de `expo-router`) y `colors` resueltos con
  `useThemeColors` desde los tokens: `primary` ← `accent`, `background` ← `background`,
  `card` ← `surface`, `text` ← `foreground`, `border` ← `border`, `notification` ←
  `danger`. Sin ningún literal de color en el fichero.
  - Test: `theme/__tests__/navigation-theme.test.tsx`,
    `it('#217 R1: mapea los seis colores del tema desde los tokens')` y
    `it('#217 R1: dark sigue al tema de uniwind y fonts es la de DefaultTheme')`
    (doble de `uniwind` con `useUniwind` y `Uniwind.getCSSVariable` por nombre de
    variable, como `theme/__tests__/use-theme-colors.test.tsx`; el doble devuelve un
    valor distinto por token para que un mapeo cruzado falle).

- **R2**: WHEN `RootLayout` pinta el árbol estable (`themeReady` verdadero) THE SYSTEM
  SHALL envolverlo en `<ThemeProvider value={navigationTheme}>` de `expo-router`, con
  `navigationTheme` salido de `useNavigationTheme()` llamado en `RootLayout` **antes** del
  `if (!themeReady)`, y colocar ese proveedor por fuera de `<HeroUINativeProvider>`.
  - Test: `app/__tests__/layout.test.tsx`,
    `it('#217 R2: el ThemeProvider raíz recibe el tema de navegación')` (el doble de
    `expo-router` añade `ThemeProvider: jest.fn(({ children }) => children)`; el de
    `../../theme/navigation-theme` devuelve un objeto centinela; se afirma que el último
    `ThemeProvider` recibió `value` idéntico al centinela) y
    `it('#217 R2: el orden de la fuente es hook, proveedor, HeroUINativeProvider')`
    (`indexOf('useNavigationTheme()')` < `indexOf('if (!themeReady)')` <
    `indexOf('<ThemeProvider value={navigationTheme}>')` < `indexOf('<HeroUINativeProvider>')`).

- **R3**: WHILE la app está montada con `RootLayout`, `TabsLayout` y una pestaña THE
  SYSTEM SHALL entregar a cada pantalla del navegador, por `useTheme()` de `expo-router`,
  el tema de R1: `colors.background` igual al token `background`, `colors.text` igual a
  `foreground` y `dark` según el tema de uniwind. React Navigation pinta la escena de
  las pestañas con `colors.background` (`elements/Background`), de modo que el fondo de
  escena deja de ser el de `DefaultTheme`.
  - Test: `app/__tests__/theme-scene.test.tsx` (nuevo),
    `it('#217 R3: la pestaña lee el fondo de los tokens, no el de DefaultTheme')` e
    `it('#217 R3: con tema oscuro la pestaña lee dark verdadero')`. Monta con
    `renderRouter` y `_layout: RootLayout`, `(tabs)/_layout: TabsLayout`, `(auth)/_layout:
    AuthLayout` y una ruta `(tabs)/home` cuyo componente es una sonda que llama a
    `useTheme()` y guarda el resultado; copia los dobles de
    `app/__tests__/alert-detail.navigation.test.tsx` (`standard-navigation`, `expo-font`,
    preferencias, `heroui-native`, `react-native-gesture-handler`, `use-push-registration`,
    `floating-tab-bar`, `auth-provider`, y `../../theme/use-theme-colors` que devuelve
    `token:<nombre>`). Aserciones: `colors.background === 'token:background'`, `!==
    DefaultTheme.colors.background`, `colors.text === 'token:foreground'`; el segundo `it`
    sustituye `uniwind` con `jest.requireActual` más `useUniwind: () => ({ theme: 'dark' })`.
    Mutación plantada que debe ponerlo rojo: quitar el `ThemeProvider` de `RootLayout`
    (la sonda lee `rgb(242, 242, 242)`).

### Barra de estado

- **R4**: WHEN `RootLayout` pinta el árbol estable THE SYSTEM SHALL montar una única
  `<StatusBar style="auto" />` de `expo-status-bar`, dentro del `ThemeProvider` y
  **antes** de `<HeroUINativeProvider>` en el orden del árbol (`expo-status-bar` fusiona
  las instancias por orden de montaje y gana la última; la global debe ser la primera
  para que las instancias de hero la sobrescriban).
  - Test: `app/__tests__/layout.test.tsx`,
    `it('#217 R4: monta una sola StatusBar auto antes del proveedor de HeroUI')`
    (doble `jest.mock('expo-status-bar', () => ({ StatusBar: jest.fn(() => null) }))`;
    afirma una sola llamada con props `{ style: 'auto' }` y, por lectura de fuente,
    `indexOf('<ThemeProvider value={navigationTheme}>')` < `indexOf('<StatusBar style="auto" />')`
    < `indexOf('<HeroUINativeProvider>')`, con `split('<StatusBar').length === 2`).

- **R5**: WHEN `HeroStatusBar` se pinta THE SYSTEM SHALL declarar
  `<StatusBar style="light" />` mientras `useIsFocused()` de `expo-router` sea verdadero,
  y no declarar ninguna `StatusBar` (devolver `null`) mientras sea falso.
  - Test: `components/__tests__/hero-status-bar.test.tsx` (nuevo),
    `it('#217 R5: con foco declara la barra clara')` y
    `it('#217 R5: sin foco no declara ninguna barra')` (dobles: `expo-router` con
    `useIsFocused: jest.fn()`, `expo-status-bar` con `StatusBar: jest.fn(() => null)`;
    un `rerender` con el foco cambiado comprueba que la barra aparece y desaparece).

- **R6**: WHILE `Inicio` tiene mascotas (`hasPets`) o `Perfil` muestra el hero
  (`showHero`) THE SYSTEM SHALL renderizar `<HeroStatusBar />` en esa pantalla, y WHILE
  no las tiene (`home-no-pets-screen`; Perfil con `showHero` falso) THE SYSTEM SHALL NOT
  renderizarla.
  - Test: `screens/home/index.test.tsx`,
    `it('#217 R6: con mascotas pide la barra clara')` e
    `it('#217 R6: sin mascotas no pide ninguna barra')`; `screens/profile/index.test.tsx`,
    `it('#217 R6: con hero pide la barra clara')` e
    `it('#217 R6: sin mascotas no pide ninguna barra')`. Ambos ficheros añaden
    `jest.mock('expo-status-bar', () => ({ StatusBar: jest.fn(() => null) }))`; sus dobles
    de `expo-router` ya traen `useIsFocused: jest.fn(() => true)`. Con hero se afirma una
    llamada a `StatusBar` con `{ style: 'light' }`; sin hero, cero llamadas. La
    colocación en la fuente es un hermano condicional **antes** del condicional del hero
    existente (`{hasPets ? <HeroStatusBar /> : null}` en Inicio; `{showHero ? <HeroStatusBar
    /> : null}` en Perfil), sin tocar la estructura del hero; `StatusBar` no pinta nodo.

- **R7**: THE SYSTEM SHALL dejar sin cambio `app/(tabs)/_layout.tsx` (los
  `screenOptions` siguen siendo exactamente `{ headerShown: false, animation: 'fade' }`).
  - Test: los dos candados existentes, **sin editar**:
    `app/(tabs)/__tests__/layout.test.tsx` y `app/__tests__/tabs-layout.test.tsx` (ambos
    afirman `screenOptions` con `toEqual`). Verificación en el reporte:
    `git diff --stat origin/dev -- 'mobile-pet-tracker/src/app/(tabs)/_layout.tsx'` vacío.

### Retirada de las dependencias nitro

- **R8**: THE SYSTEM SHALL no declarar `react-native-nitro-theme-transition` ni
  `react-native-nitro-modules` en `package.json` (ni en `dependencies` ni en la
  expresión `jest.transformIgnorePatterns[0]`, que termina en `...|blobatar)`) ni en
  `bun.lock` (ni en el bloque del workspace ni en `packages`), sin añadir ninguna
  dependencia ni cambiar ninguna otra versión.
  - Comando exacto (lo corre Codex, desde `mobile-pet-tracker/`):
    `bun remove react-native-nitro-theme-transition react-native-nitro-modules`; después
    editar a mano la expresión de `transformIgnorePatterns` para quitar
    `|react-native-nitro-theme-transition|react-native-nitro-modules` (`bun remove` no
    toca `jest`). No `npm`, no `bun install` suelto.
  - Test: `src/__tests__/design-drift.test.ts`, nuevo `describe('#217 R8: las dependencias
    nitro no existen')` con `it('package.json no nombra nitro en dependencias ni en
    transformIgnorePatterns')` e `it('bun.lock no nombra nitro')`. El nombre se arma con
    `['react-native', 'nitro'].join('-')` para que el propio test no contenga el
    literal. Cada patrón se prueba también contra una cadena plantada
    (`'"react-native-nitro-modules": "0.37.0"'` debe dar coincidencia) antes de aplicarse
    a los ficheros reales. Verificación en el reporte: `git diff origin/dev --
    mobile-pet-tracker/bun.lock | grep -E '^[-+][^-+]'` muestra **exactamente 4 líneas
    eliminadas y 0 añadidas**, las cuatro con `nitro` (hoy hay 4 líneas con `nitro` en el
    lock: dos en el bloque del workspace y dos en `packages`), y
    `git diff origin/dev -- mobile-pet-tracker/package.json` muestra solo las dos líneas
    de `dependencies` y la cola de la expresión.

- **R9**: THE SYSTEM SHALL no contener los ficheros `theme/theme-transition.ts`,
  `theme/nitro-availability.ts`, `theme/__tests__/theme-transition.test.tsx` ni
  `theme/__tests__/theme-transition.degraded.test.tsx`, y ningún fichero de producción de
  `src/` (sin `__tests__` ni tests colocados) SHALL mencionar `nitro`,
  `theme-transition`, `useThemeTransition`, `THEME_FADE` ni `isThemeTransitionAvailable`.
  - Test: `src/__tests__/design-drift.test.ts`, `it('#217 R9: los cuatro ficheros de la
    transición no existen')` (`existsSync` falso en las cuatro rutas) e `it('#217 R9:
    ninguna fuente de producción nombra la transición')` (recorre `src/` sin
    `__tests__`; los literales se arman con `join` para no auto-coincidir; el patrón se
    prueba contra una cadena plantada). Anclas negativas probadas con la mutación
    plantada: reintroducir `import { useThemeTransition } from '../../theme/theme-transition'`
    en `screens/profile/index.tsx` debe poner rojo este `it`.

- **R10**: WHEN el usuario conmuta `theme-toggle` en Perfil THE SYSTEM SHALL llamar
  `Uniwind.setTheme(next)` y a continuación `void setStoredTheme(next)` (con `next` igual
  a `'dark'` si el interruptor queda seleccionado y `'light'` si no), sin fade ni
  disponibilidad de módulos nativos. `screens/profile/index.tsx` importa `Uniwind` de
  `uniwind` y `setStoredTheme` de `../../utils/theme-preference`, y no importa
  `theme-transition`.
  - Test: `screens/profile/index.test.tsx`: se **conservan sin relajar** los dos `it`
    de `describe('R4: toggle persiste')` (`'switches light to dark and persists it'`,
    `'switches dark to light and persists it'`) y el `it.each` `'#196 R7: con tema $0 el
    interruptor pide $1'` (que ya afirma `mockSetTheme` una vez y `mockSetStoredTheme`);
    se **elimina** `it('R2: el toggle dispara el fade vía withThemeTransition')`; y se
    añade `it('#217 R10: el interruptor aplica el tema antes de persistirlo')`, que usa
    `mock.invocationCallOrder` para afirmar que `Uniwind.setTheme` se llamó antes que
    `setStoredTheme` y, por lectura de fuente, que `screens/profile/index.tsx` no contiene
    `theme-transition`.

- **R11**: THE SYSTEM SHALL no mockear en ningún test ni nombrar el módulo nitro: se
  retiran de `screens/profile/index.test.tsx` el `import { withThemeTransition }`, el
  `jest.mock` de `react-native-nitro-theme-transition` y el `jest.mock` de
  `../../theme/nitro-availability`, y de `app/(tabs)/__tests__/screens.test.tsx` el
  `jest.mock` de `react-native-nitro-theme-transition`.
  - Test: `src/__tests__/design-drift.test.ts`, `it('#217 R11: ningún test mockea
    nitro')`: recorre **todos** los ficheros `.test.ts`/`.test.tsx` de `src/` (excepto
    `__tests__/design-drift.test.ts`, que arma el literal con `join`) y exige cero
    coincidencias de `nitro`; el patrón se prueba contra una cadena plantada.

### Candados y alcance

- **R12**: THE SYSTEM SHALL no añadir ninguna clave de catálogo, ninguna clase de
  estilo ni ningún literal de color: los candados de copy (`ui-language`,
  `ui-copy-table`, `language-provider.test.tsx`), de clases (`consistency-classnames`,
  `legibility-classnames`) y `design-drift` pasan **sin edición** salvo las adiciones de
  esta spec, y los dos ficheros nuevos de producción (`theme/navigation-theme.ts`,
  `components/hero-status-bar.tsx`) no contienen hex, `StyleSheet` ni clases con
  corchetes.
  - Test: `src/__tests__/design-drift.test.ts`, `describe('#217 R12: los ficheros
    nuevos no escapan del sistema de estilo')` con `it('navigation-theme.ts y
    hero-status-bar.tsx no tienen hex, StyleSheet ni clases con corchetes')` (patrón
    `/#[0-9A-Fa-f]{3,8}\b|StyleSheet|\b[a-z-]+-\[[^\]]+\]/` probado contra una cadena
    plantada). Verificación en el reporte: `git diff --stat origin/dev --
    mobile-pet-tracker/src/i18n mobile-pet-tracker/src/providers
    mobile-pet-tracker/src/__tests__/ui-copy-table.ts
    mobile-pet-tracker/src/__tests__/ui-language.test.ts
    mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
    mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
    mobile-pet-tracker/src/providers/__tests__` vacío; y el jest completo, sin pipe, verde.

## Fuera de alcance

- Las hojas inferiores y el fondo de superficie (#218) y el scrim de `confirm-dialog`.
- `sceneStyle` por pestaña y quitar `animation: 'fade'` de `app/(tabs)/_layout.tsx`:
  **contingencia** del plan §3 si el smoke G2 muestra que el parpadeo persiste con el
  `ThemeProvider`; sería otra spec. Del mismo modo, si G2 muestra que
  `style="auto"` no sigue el interruptor de tema de la app, la contingencia es derivar
  el estilo de `useUniwind().theme`; también otra spec.
- Reconstruir el dev build (G3) y medir el parpadeo en dispositivo (G2): el humano.
  Ninguna IA lanza `eas build`.
- Editar `docs/ui-guidelines.md` (G4 del plan) y `docs/conventions.md`. Nota para el
  leader: `docs/conventions.md` (sección de dobles de Reanimated) cita
  `theme-transition.test.tsx:18`, fichero que esta feature borra; es prosa histórica sin
  candado y queda como seguimiento del cierre.
- La spec histórica `specs/mobile-theme-transition/` y las entradas de `progress/`:
  no se tocan. Anotar #43 en `feature_list.json` (retirada de la librería) es del
  leader al cerrar.
- Cambiar `app.json`, `eas.json` o plugins (no hay plugin nitro; verificado).
- Cualquier pantalla distinta de Inicio y Perfil: las demás no tienen hero y heredan
  la `StatusBar` automática.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
  (firma delegada en el leader por el mandato del 2026-10-23, ampliado el 2026-10-26,
  tras la checklist de `progress/plan_canvas-parity-2026-10-23.md` §4 y
  `progress/plan_ui-2026-10-26.md` §4).
- [ ] Smoke G2 hecho y aprobado por el humano (cierre, no gate de implementación; fecha: ____)
  Va en `progress/smoke_ui.md`. Debe cubrir, en tema claro y oscuro y con el SO en claro y
  en oscuro: (a) cambiar entre Inicio, Salud, Mapa y Perfil sin parpadeo blanco ni negro;
  (b) el interruptor de tema de Perfil cambia el tema al instante, sin fundido; (c) los
  iconos y el reloj de la barra de estado se leen en Inicio y Perfil con mascotas (hero),
  en Mapa, en Inicio y Perfil sin mascotas, y en una pantalla de detalle; (d) al volver de
  Perfil a Mapa la barra recupera el estilo automático.
- [ ] G3 hecho por humano: dev build reconstruido sin `react-native-nitro-*` (fecha: ____)
  (espera al merge de #217; el binario anterior sigue funcionando porque el código ya no
  importa nitro, pero hay dos binarios en circulación hasta entonces).
