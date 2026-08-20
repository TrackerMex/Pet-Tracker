---
feature: "mobile-ui-foundation"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-ui-foundation]]

> Ver [[requirements]] para los requisitos. Esta spec es autosuficiente para
> Codex CLI: rutas, símbolos y versiones exactas. Las capas de
> `docs/architecture.md` son de backend y no aplican aquí.

## Verificación de APIs (2026-08-20)

Todo lo siguiente se verificó descargando los tarballs publicados en npm
(`heroui-native@1.0.8`, `uniwind@1.11.0`, `reicon-react-native@1.0.102`) y el
repo `heroui-inc/heroui-native-example`:

- `heroui-native` exporta desde su raíz `HeroUINativeProvider` (también en
  `heroui-native/provider`), `Button`, `Chip` y el resto de componentes.
  Export CSS: `heroui-native/styles` (define todos los tokens `--color-*` en
  `@theme` con variantes light/dark; trae su propio `@source ".."`).
- `heroui-native@1.0.8` peerDependencies: `@gorhom/bottom-sheet ^5.2.9`,
  `expo-blur >=14`, `react >=19`, `react-native >=0.81`,
  `react-native-gesture-handler ^2.28`, `react-native-reanimated ^4.1.1`,
  `react-native-safe-area-context ^5.6`, `react-native-screens >=4`,
  `react-native-svg ^15.12.1`, `react-native-worklets >=0.5.1`,
  `tailwind-merge ^3.4`, `tailwind-variants ^3.2.2`.
- `uniwind/metro` exporta `withUniwindConfig(config, { cssEntryFile, dtsFile?, extraThemes?, polyfills?, debug?, isTV? })`.
- `uniwind` (raíz) exporta `Uniwind` (con `setTheme('light'|'dark'|'system')`
  — lanza si el tema no está registrado, por eso el test lo mockea con
  `mockImplementation`) y `useUniwind(): { theme, hasAdaptiveThemes }`.
- `uniwind/types` es un `.d.ts` que añade `className` a los componentes RN
  (se activa con `/// <reference types="uniwind/types" />`).
- El example app oficial importa el css de entrada **también en JS**
  (`import '../../global.css'` en `_layout.tsx`) — de ahí el stub de `.css`
  en jest.
- El runtime nativo de uniwind (`src/core/native/`) solo importa APIs JS de
  react-native (Appearance, Dimensions, StyleSheet…) — carga en jest sin
  metro; los estilos simplemente no resuelven, suficiente para render tests.
- `reicon-react-native` exporta iconos nombrados (`Sun`, `Moon`, `Refresh`,
  …) con props `{ color?, size?, weight?: 'Filled'|'Outline', ... }`; peer:
  `react-native-svg`.

## Compatibilidad Expo Go (verificada 2026-08-20)

La prueba de humo humana es con **Expo Go** (restricción del humano: sin
Android Studio ni builds por ahora). Verificación paquete a paquete contra
los tarballs npm y `mobile-pet-tracker/node_modules/expo/bundledNativeModules.json`
(SDK 57):

| Paquete | Nativo propio | Veredicto |
|---|---|---|
| `heroui-native@1.0.8` | ninguno (sin podspec/gradle/codegen/deps) | JS puro ✔ |
| `uniwind@1.11.0` | ninguno en device; sus deps (`@tailwindcss/oxide`, `lightningcss`) corren dentro de metro en la PC | JS puro ✔ |
| `reicon-react-native@1.0.102` | ninguno; dibuja con `react-native-svg` | JS puro ✔ |
| `@gorhom/bottom-sheet@5.2.14` | ninguno (deps: `@gorhom/portal`, `invariant`) | JS puro ✔ |
| `react-native-svg` | bundleado en Expo Go (SDK 57 → 15.15.4) | ✔ |
| `expo-blur` | bundleado (SDK 57 → ~57.0.2) | ✔ |
| `react-native-reanimated` 4.5.1 + `react-native-worklets` 0.10.1 | bundleados (SDK 57) | ✔ |
| `react-native-gesture-handler` ~2.32.0 | bundleado (SDK 57) | ✔ |
| `expo-dev-client` | bundleado como dep; **no se usa** en #32 | ✔ (ver nota) |

Nota operativa: con `expo-dev-client` en `package.json`, `expo start`
arranca por defecto en modo dev-client. El smoke usa `bunx expo start --go`
(o la tecla `s` en el bundler) para que el QR abra en Expo Go.

## Decisiones técnicas

- **D1 — Instalación de dependencias** (R1, R7). Dos comandos, en este orden,
  desde `mobile-pet-tracker/`:

  ```
  bunx expo install react-native-svg expo-dev-client expo-blur
  bun add heroui-native@1.0.8 uniwind@^1.11.0 tailwindcss@^4.3.3 tailwind-variants@^3.3.1 tailwind-merge@^3.6.0 reicon-react-native@^1.0.102 @gorhom/bottom-sheet@^5.2.14
  ```

  `expo install` alinea los paquetes con SDK 57; `heroui-native` se pinea
  **exacto** a 1.0.8 (decisión del humano); `@gorhom/bottom-sheet` se añade
  explícito en vez de confiar en la auto-instalación de peers de bun
  (reproducibilidad del lockfile). Los demás peers ya están en el
  `package.json` de #31 (reanimated 4.5.1, gesture-handler 2.32, etc.).

- **D2 — Metro** (R2). `mobile-pet-tracker/metro.config.js` (archivo nuevo,
  la app usa hoy el default implícito de Expo):

  ```js
  const { getDefaultConfig } = require('expo/metro-config');
  const { withUniwindConfig } = require('uniwind/metro');

  module.exports = withUniwindConfig(getDefaultConfig(__dirname), {
    cssEntryFile: './src/theme/global.css',
    dtsFile: './src/uniwind-types.d.ts',
  });
  ```

- **D3 — Sin babel.config.js nuevo**: uniwind trabaja en el transformer de
  metro, no necesita plugin babel propio; jest-expo ya trae el preset babel
  que la app usa hoy. No se crea `babel.config.js`.

- **D4 — Tokens de tema** (R2). `mobile-pet-tracker/src/theme/global.css`
  (archivo nuevo, contenido completo):

  ```css
  @import 'tailwindcss';
  @import 'uniwind';
  @import 'heroui-native/styles';

  @source '../../node_modules/heroui-native/lib';

  @layer theme {
    :root {
      @variant light {
        --accent: #208AEF;
        --accent-foreground: #ffffff;
      }

      @variant dark {
        --accent: #208AEF;
        --accent-foreground: #ffffff;
      }
    }
  }
  ```

  Paleta minimalista: solo se pisa `--accent` (azul `#208AEF`, el mismo del
  splash en `app.json` — coherencia de marca sin inventar paleta nueva);
  todo lo demás (background, foreground, success, warning, danger, muted,
  radios, fuentes) hereda los defaults light/dark de `heroui-native/styles`.
  El patrón `@layer theme { :root { @variant ... } }` es el del example app
  oficial.

- **D5 — Tipos** (R3). `mobile-pet-tracker/src/uniwind-env.d.ts` (tracked):

  ```ts
  /// <reference types="uniwind/types" />
  ```

  `src/uniwind-types.d.ts` lo genera metro en runtime (`dtsFile` de D2) y se
  añade a `mobile-pet-tracker/.gitignore`. El `include` del tsconfig actual
  (`**/*.ts`) ya cubre ambos; `tsc --noEmit` pasa aunque el generado no
  exista. No se toca `tsconfig.json`.

- **D6 — Jest** (R1). En el bloque `jest` de
  `mobile-pet-tracker/package.json` (hoy solo `"preset": "jest-expo"`):

  ```json
  "jest": {
    "preset": "jest-expo",
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|uniwind|heroui-native|reicon-react-native|tailwind-variants|tailwind-merge|@gorhom/bottom-sheet)"
    ],
    "moduleNameMapper": {
      "\\.css$": "<rootDir>/test/css-stub.js"
    }
  }
  ```

  El patrón es el default de jest-expo + 6 paquetes nuevos al final.
  `mobile-pet-tracker/test/css-stub.js` (archivo nuevo):
  `module.exports = {};` — absorbe el `import '../theme/global.css'` del
  layout. uniwind resuelve en jest vía su export condition `react-native`
  (TS fuente), por eso necesita el whitelist del transform.

- **D7 — Migración de la pantalla** (R5). Mapeo exacto de estados a tokens
  en `src/app/index.tsx` (reemplaza al objeto `stateColors` de hexes):

  | kind | className del Chip |
  |---|---|
  | `ok` | `bg-success text-success-foreground` |
  | `error` | `bg-danger text-danger-foreground` |
  | `unreachable` | `bg-warning text-warning-foreground` |
  | `missing-config` | `bg-muted text-background` |

  Estructura de la pantalla: `View className="flex-1 items-center justify-center gap-4 bg-background p-6"`,
  título `Text className="text-2xl font-semibold text-foreground"`,
  `<Chip testID="health-state">` con el `kind` como texto,
  `<Button testID="health-retry" onPress={...}>Retry</Button>`,
  URL en `Text className="text-muted"`. Cero `StyleSheet.create`, cero hex.
  La suite `index.test.tsx` de #31 no cambia sus asserts: `toHaveTextContent`
  busca en el subtree del Chip y `fireEvent.press` funciona sobre el Button
  de HeroUI (es un pressable).

- **D8 — eas.json** (R7). `mobile-pet-tracker/eas.json` (archivo nuevo,
  contenido completo):

  ```json
  {
    "cli": {
      "version": ">= 16.0.0"
    },
    "build": {
      "development": {
        "developmentClient": true,
        "distribution": "internal",
        "bun": "1.3.14"
      }
    }
  }
  ```

  `"bun": "1.3.14"` pinea la versión en los builders de EAS a la de la
  máquina del humano (deuda #3 de #31; mismo pin que `ci.yml`). Solo perfil
  `development` — el resto cuando exista una feature de release.
  **eas.json y expo-dev-client son configuración para el futuro** (#43 y dev
  builds): en #32 no se ejecuta ninguna build y no son requisito de la
  validación — el gate R10 corre en Expo Go.

- **D9 — Toggle de tema** (R6). En `index.tsx`:

  ```tsx
  import { Uniwind, useUniwind } from 'uniwind';
  import { Moon, Sun } from 'reicon-react-native';
  // dentro del componente:
  const { theme } = useUniwind();
  // control:
  // onPress={() => Uniwind.setTheme(theme === 'dark' ? 'light' : 'dark')}
  // icono: theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />
  ```

  El control es un `<Button testID="theme-toggle">` de HeroUI (variante
  discreta a criterio del implementador, p.ej. secundaria/ghost). Sin
  persistencia del tema elegido (arranca en el del sistema): persistir es
  scope de #43 junto con la transición.

- **D10 — Spike primero** (R1, orden de [[tasks]]). La task 1 deja el
  provider + un Button renderizando en jest **antes** de migrar la pantalla:
  si el stack no rinde en jest o en la dev build, se descubre con la
  pantalla de #31 intacta y el rollback es barato.

## Archivos afectados

Todos en la isla móvil salvo docs:

- `mobile-pet-tracker/package.json` — deps de D1, bloque jest de D6
- `mobile-pet-tracker/bun.lock` — regenerado por bun
- `mobile-pet-tracker/metro.config.js` — nuevo (D2)
- `mobile-pet-tracker/src/theme/global.css` — nuevo (D4)
- `mobile-pet-tracker/src/uniwind-env.d.ts` — nuevo (D5)
- `mobile-pet-tracker/.gitignore` — añade `src/uniwind-types.d.ts` (D5)
- `mobile-pet-tracker/test/css-stub.js` — nuevo (D6)
- `mobile-pet-tracker/src/__tests__/heroui-smoke.test.tsx` — nuevo (R1)
- `mobile-pet-tracker/src/app/_layout.tsx` — provider + import css (R4)
- `mobile-pet-tracker/src/app/index.tsx` — migración + toggle (R5, R6)
- `mobile-pet-tracker/src/app/__tests__/index.test.tsx` — añade describe R6
  (los asserts existentes de R7/#31 no se tocan)
- `mobile-pet-tracker/eas.json` — nuevo (D8)
- `docs/conventions.md` — sección `## Convenciones de la app móvil` (R8)

Prohibido tocar: `backend-pet-tracker/`, `infra/`, `init.config.sh`,
`.github/workflows/ci.yml` (R9).

## Alternativas descartadas

- **Motion (motion.dev)**: no soporta React Native — descartado por el
  humano en el plan; las animaciones usan Reanimated 4 ya instalado.
- **NativeWind** en lugar de uniwind: HeroUI Native 1.x está construido
  sobre uniwind (su provider importa `Uniwind` directamente); mezclar dos
  runtimes de Tailwind no tiene sentido.
- **nitro-theme-transition ahora**: aislado en #43 para que un paquete
  nativo experimental no bloquee la fundación.
- **Dev build como camino de validación de #32**: descartada por el humano
  (evitar Android Studio/EAS por ahora). El stack completo es JS puro o usa
  nativos bundleados en SDK 57 (§Compatibilidad Expo Go), así que Expo Go
  basta; la dev build queda configurada (eas.json, expo-dev-client) para
  cuando #43 (nitro, incompatible con Expo Go) la exija.
- **Extender `env-drift`/`init.config.sh`**: nada que extender — la
  integración bun quedó hecha en #31.
- **Pantalla de toggle separada o menú de settings**: YAGNI — un botón en la
  única pantalla existente basta para probar los tokens.
