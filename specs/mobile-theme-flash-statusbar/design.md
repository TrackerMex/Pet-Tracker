---
feature: "mobile-theme-flash-statusbar"
status: approved
tags: [harness, spec]
---

# Diseño — [[mobile-theme-flash-statusbar]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas.
> Solo toca `mobile-pet-tracker/` (presentación, tema y manifiesto de dependencias).
> Sin backend, contrato ni base de datos. Rutas relativas a `mobile-pet-tracker/src/`.
> Skills: en Claude Code `expo:expo-overview` y las de `docs/ui-guidelines.md`; en Codex
> (plugin `expo@openai-curated` v1.0.2) se nombran las de Codex en el handoff (deuda B5).

## Decisiones técnicas

- **`ThemeProvider` raíz con tema salido de los tokens** (R1-R3). `expo-router` exporta
  `ThemeProvider`, `useTheme`, `DefaultTheme`, `DarkTheme` y el tipo `Theme`. El
  `NavigationContainer` usa `DefaultTheme` si nadie lo sustituye, y las pantallas del
  navegador de pestañas se pintan con `colors.background` (`elements/Background`). Un
  proveedor raíz con los tokens de la app arregla las pestañas **y** las transiciones del
  `Stack` raíz con un solo cambio, sin tocar `(tabs)/_layout.tsx` (así los dos candados
  de `screenOptions` y la spec `mobile-tab-glass` no se mueven).
- **`useNavigationTheme()` en `theme/navigation-theme.ts`** (R1). Hook, no constante,
  porque los tokens cambian con el tema. Reutiliza `useThemeColors` (capa de tema ya
  existente, sin hex) y `useUniwind` para `dark`; `fonts` se toma de `DefaultTheme` porque
  `Theme` las exige y la app no las usa en navegación (la cabecera nativa lleva
  `title: ''`). Mapeo: `primary`←`accent`, `background`←`background`, `card`←`surface`,
  `text`←`foreground`, `border`←`border`, `notification`←`danger`. Todos son tokens de
  `theme/global.css` (`--accent`, `--background`, `--surface`, `--foreground`,
  `--border`, `--danger`).
- **Se llama antes del `if (!themeReady)`** (R2): los hooks no pueden ir tras un retorno
  temprano. Mientras `themeReady` es falso `RootLayout` sigue devolviendo `<></>`
  (el candado de `font-registration.test.ts` prohíbe el literal `return null` en este
  fichero; no se usa).
- **`StatusBar style="auto"` global en `RootLayout`, primera en el orden del árbol**
  (R4). `expo-status-bar` apila las instancias por orden de montaje y gana la última;
  `auto` usa el `useColorScheme()` de React Native, que sigue a `Appearance` y
  `Uniwind.setTheme` ya fija `Appearance.setColorScheme`, de modo que el interruptor de la
  app mueve la barra (se comprueba en G2; la contingencia queda en fuera de alcance).
- **`HeroStatusBar` con puerta de foco** (R5, R6). Las pestañas siguen montadas aunque
  no tengan el foco, y cada `StatusBar` montada queda en la pila. Si Inicio declarase
  `light` sin condición, seguiría ganando sobre la barra automática en Mapa. Con
  `useIsFocused()` la instancia de hero se desmonta (y sale de la pila) al perder el foco,
  y la global vuelve a mandar. Se coloca como **hermano condicional previo al hero**, no
  dentro de `PetHeroHeader`: ese componente se prueba y se usa fuera de un navegador y
  `useIsFocused` lanzaría sin contexto; además así no cambia ninguna estructura de hijos
  que los tests de Perfil cuentan (`StatusBar` no pinta nodo).
- **Quitar nitro es solo borrar** (R8-R11). `useThemeTransition` solo lo consume el
  interruptor de Perfil. El interruptor vuelve a su forma de #40:
  `Uniwind.setTheme(next); void setStoredTheme(next);`. La rama «reducir movimiento»
  de la librería deja de existir porque ya no hay fundido que evitar.
- **Sin dependencias nuevas.** `expo-status-bar ~57.0.1` y `expo-system-ui ~57.0.2` ya
  están declaradas; la dependencia retirada la autoriza el humano (plan §1).
  `bun remove` reescribe `bun.lock` con solo las cuatro líneas nitro.

## Archivos afectados

| Capa | Fichero | Cambio |
|---|---|---|
| tema | `theme/navigation-theme.ts` | nuevo (R1) |
| tema | `theme/theme-transition.ts`, `theme/nitro-availability.ts` | borrados (R9) |
| componente | `components/hero-status-bar.tsx` | nuevo (R5) |
| ruta | `app/_layout.tsx` | `useNavigationTheme`, `ThemeProvider`, `StatusBar` (R2, R4) |
| pantalla | `screens/home/index.tsx`, `screens/profile/index.tsx` | `<HeroStatusBar />` condicional (R6); Perfil: interruptor instantáneo, imports (R10) |
| manifiesto | `package.json`, `bun.lock` | R8 |
| tests nuevos | `theme/__tests__/navigation-theme.test.tsx`, `components/__tests__/hero-status-bar.test.tsx`, `app/__tests__/theme-scene.test.tsx` | R1, R5, R3 |
| setup de jest | `test/jest-setup.js` (bajo `mobile-pet-tracker/`) | doble global de `expo-status-bar` (enmienda del 2026-10-27) |
| tests editados | `app/__tests__/layout.test.tsx`, `screens/home/index.test.tsx`, `screens/profile/index.test.tsx`, `app/(tabs)/__tests__/screens.test.tsx`, `__tests__/design-drift.test.ts` | R2, R4, R6, R10, R11, R8, R9, R12 |
| tests borrados | `theme/__tests__/theme-transition.test.tsx` (6 `it`), `theme/__tests__/theme-transition.degraded.test.tsx` (1 `it`) | R9 |

## Inventario cerrado de candados (medido contra `origin/dev`)

Cada fila dice qué hace el candado, si esta feature lo mueve y cómo se resuelve.

| Candado | ¿Se mueve? | Resolución |
|---|---|---|
| `app/__tests__/layout.test.tsx` (mocks de `expo-router`, `uniwind` solo con `Uniwind.setTheme`, `use-theme-colors`) | **Sí**: `RootLayout` ahora importa `ThemeProvider`, `useNavigationTheme` y `StatusBar` | Se añaden dobles: `ThemeProvider: jest.fn(({ children }) => children)` en el de `expo-router`; `jest.mock('../../theme/navigation-theme', () => ({ useNavigationTheme: () => navigationThemeSentinel }))` (así `uniwind` no necesita `useUniwind`); `jest.mock('expo-status-bar', ...)`. Van en el commit `test` rojo, no en el `feat`. Los candados de fuente de ese fichero (`<AuthProvider>` < `<QueryProvider>` < `<Stack `; `<QueryProvider>`…`<RootStack />`) no se mueven: `ThemeProvider` y `StatusBar` van fuera de ellos. |
| Los seis tests con `renderRouter` y `RootLayout` real (`detail-stack.navigation`, `detail-stack.guard`, `alert-detail.navigation`, `alert-detail.notification`, `reminders-alerts-stack.navigation`, `reminders-alerts-stack.notification`, todos en `app/__tests__/`) | Probablemente no: no mockean `uniwind` ni `expo-router`, así que usan los reales (`RootStack` ya llama a `useThemeColors`, que usa `useUniwind`) | No se editan. Se miden tras el `feat` de `_layout.tsx`; si alguno cae, se anota como hallazgo. **Enmendado el 2026-10-27**: cayeron 3 tras C6 (ver §Enmienda del 2026-10-27); se resuelve con un doble global de `expo-status-bar` en `test/jest-setup.js`, porque el `<StatusBar>` real no renderiza `null` bajo `renderRouter`. |
| `app/(tabs)/__tests__/layout.test.tsx`, `app/__tests__/tabs-layout.test.tsx` | No | `(tabs)/_layout.tsx` no cambia (R7). |
| `theme/__tests__/font-registration.test.ts` | No | Lee `_layout.tsx`: exige `useFonts({`, el registro y `not.toContain('return null')`. No se usa `return null`. |
| `screens/home/index.test.tsx`, `screens/profile/index.test.tsx`, `app/(tabs)/__tests__/screens.test.tsx` | Sí, solo en lo de nitro y el doble de `expo-status-bar` | Sus dobles de `expo-router` ya traen `useIsFocused: jest.fn(() => true)`. Se añade el doble de `expo-status-bar` en Inicio y Perfil. `screens.test.tsx` solo pierde el `jest.mock` nitro. `profile/index.test.tsx` línea del `import { withThemeTransition }`, dos `jest.mock` y el `it('R2: …')` se retiran. |
| `__tests__/home-photo-hero-canvas.test.ts`, `__tests__/profile-photo-hero-canvas.test.ts`, `__tests__/no-pets-states.test.ts`, `__tests__/home-canvas-fidelity.test.ts`, `__tests__/profile-canvas-fidelity.test.ts` (leen la fuente de Inicio y Perfil) | No: no cuentan hijos ni líneas con `HeroStatusBar`; el conteo por línea de `home-photo-hero` usa literales que no se tocan | Se vigilan corriendo el jest completo tras el `feat` de R6. |
| `__tests__/design-drift.test.ts` | Solo se **añaden** `describe` | Nuevos `describe` de R8, R9, R11, R12. Los existentes no se tocan (`FEATURE_STYLE_ESCAPES`, `featureFiles`, «cuatro entrypoints finos», TanStack/`expo-notifications`: ninguno nombra nitro ni `_layout`). |
| `consistency-classnames` | No | Esta feature no añade clases ni radios. Su recorrido de `src/` incluye los dos ficheros nuevos y no encuentra nada. |
| `legibility-classnames` (`reserva las peticiones de accent a las huellas de EmptyState`, línea ~206) | **Sí, una línea** | `theme/navigation-theme.ts` pide `accent` (R1, color primario del tema) y la lista cerrada de huellas lo rechaza. Se añade `'theme/navigation-theme.ts'` entre `components/toggle-switch.tsx` y `theme/shadows.ts`, y `(enmendado por #217 R1)` al título. Omisión de la spec original, enmendada el 2026-10-27 (commit `test` propio, C9b). |
| `ui-language.test.ts`, `ui-copy-table.ts`, `providers/__tests__/language-provider.test.tsx` | No | Sin claves nuevas ni retiradas; sin copy. `SCREEN_FILES`, `ALL_USES` y la aritmética de claves se mantienen (delta `+0` en cada commit). |
| `__tests__/jest-virtual-mock-lock.test.ts` | No | Esta feature no añade `virtual: true`. Los `jest.mock` nitro eran de módulo real; al borrarlos desaparece el riesgo de «Cannot find module». |
| Resto de usos de `useUniwind` con doble (`floating-tab-bar`, `date-field`, `profile`) | No | `HeroStatusBar` no usa `uniwind`. |

## Alternativas descartadas

- **`sceneStyle` por pestaña en `(tabs)/_layout.tsx`**: pinta solo las pestañas, no el
  `Stack` raíz, y mueve dos candados de `screenOptions`. Queda de contingencia.
- **Quitar `animation: 'fade'`**: pierde la transición que el humano quiere conservar;
  último recurso del plan §3.
- **Iconos claros por ruta en `(tabs)/_layout.tsx`** (lo que decía el plan): deja iconos
  invisibles en Inicio y Perfil sin mascotas (ver Desviación en [[requirements]]).
- **`useIsFocused` dentro de `PetHeroHeader`**: lanza fuera de un navegador y rompe sus
  tests.
- **`StatusBar` calculada con `useUniwind().theme` en vez de `auto`**: decisión del
  humano fue `auto`; solo se reabre si G2 lo exige.
- **Mantener `react-native-nitro-theme-transition` y arreglar solo el fondo**: descartado
  por el humano (plan §1): quitarlo también simplifica el arranque (sin comprobación de
  módulo nativo).

## Enmienda del 2026-10-27: doble global de `expo-status-bar`

Medido tras C6 (`930ab8c4`): `detail-stack.navigation` (`#194 R4` apila), `detail-stack.guard`
(`#194 R4` expulsa; `#149 R2` cierra sesión) fallan (timeout de 5000 ms y «REPLACE … welcome
was not handled»). Sin C6 pasan 23/23. Diagnóstico en
`progress/explore_217-guards.md` (worktree de sondeo): el `<StatusBar>` real de
`expo-status-bar` usa `setImmediate`/`clearImmediate` estáticos; `renderRouter` activa timers
falsos y, al desmontar tras `useRealTimers`, se llama al `clearImmediate` real con un id falso,
lo que corrompe el contador de inmediatos de Node. Con `ThemeProvider` y `useNavigationTheme`
pero sin `StatusBar` pasan 23/23; con `StatusBar` y sin `ThemeProvider` fallan los mismos 3.

Premisa falsa de la fila anterior: «`expo-status-bar` real renderiza `null`». Resolución: un
`jest.mock('expo-status-bar', ...)` en `test/jest-setup.js` que conserva el resto del módulo y
sustituye `StatusBar` por `() => null` (8 líneas). Los ficheros que ya declaran su propio doble
(`layout.test.tsx`, `hero-status-bar.test.tsx`, y los de Inicio y Perfil en R6) lo sobrescriben
a nivel de fichero. La forma de R2, R3, R4 y R5 no cambia. Es un commit `test` propio (C6b),
posterior a C6.
