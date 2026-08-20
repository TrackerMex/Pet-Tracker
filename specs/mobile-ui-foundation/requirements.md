---
feature: "mobile-ui-foundation"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-ui-foundation]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas (D1–D10, todas cerradas) y los
> planes B. Las convenciones de capas de `docs/architecture.md` son de backend
> y NO aplican a esta app; sí aplican kebab-case, tests que nombran su R-id y
> conventional commits. Base: scaffold de la feature #31 (`mobile-pet-tracker/`).

## Contexto fijo (no reabrir)

- Stack UI decidido por el humano (2026-08-20, plan
  `para-el-plan-para-inherited-coral`): **heroui-native@1.0.8** (componentes) +
  **uniwind ^1.11** (motor de estilos, Tailwind CSS v4) +
  **reicon-react-native** (iconos) + **Reanimated 4** (ya instalado, 4.5.1).
  Motion/motion.dev descartado (no soporta RN);
  `react-native-nitro-theme-transition` FUERA (es la feature #43);
  `@gorhom/bottom-sheet` DIFERIDO (peer opcional de heroui-native, se
  instalará cuando un componente lo pida).
- **expo-dev-client desde esta feature**: el humano compila un development
  build una vez; **Expo Go deja de servir desde aquí** (decisión humana
  2026-08-20 — desbloquea #36 expo-maps y #43 nitro).
- Scaffold existente: Expo SDK ~57.0.14, RN 0.86.2, React 19.2.3, TS ~6.0.3
  strict, bun >= 1.2 (máquina del humano: 1.3.14), Expo Router en `src/app/`,
  experiments `typedRoutes` + `reactCompiler` en `app.json`, jest-expo ~57 +
  @testing-library/react-native ^14, eslint 9. CI/init.sh ya corren
  `bun run --cwd mobile-pet-tracker <lint|typecheck|test>` — no se toca
  `init.config.sh` ni `.github/workflows/ci.yml`.
- Peers de heroui-native@1.0.8 verificados contra npm el 2026-08-20: react
  >=19 ✓, react-native >=0.81 ✓, reanimated ^4.1.1 ✓ (4.5.1), worklets
  >=0.5.1 ✓ (0.10.1), gesture-handler ^2.28 ✓, safe-area ^5.6 ✓, screens >=4 ✓
  (opcional). Faltan y se instalan aquí: react-native-svg ^15.12.1,
  tailwind-variants ^3.2.2, tailwind-merge ^3.4.0, expo-blur (peer opcional,
  el plan lo incluye). uniwind NO es peer de heroui-native — la integración es
  vía CSS (`heroui-native/styles`).

## API verificada (2026-08-20 — Codex NO re-investiga esto)

Contra docs.uniwind.dev (uniwind 1.11.0) y heroui.com/deepwiki (heroui-native
1.0.8):

- Metro: `const { withUniwindConfig } = require('uniwind/metro');` —
  `withUniwindConfig(config, { cssEntryFile, dtsFile })`, debe ser el
  **wrapper más externo**; `cssEntryFile` es ruta relativa desde la raíz del
  proyecto (prohibido `path.resolve`).
- **No requiere preset de babel** (explícito en docs de uniwind). No se crea
  `babel.config.js`.
- El directorio del `cssEntryFile` define la raíz de escaneo de classNames;
  directorios fuera de él exigen `@source` (rutas relativas al propio .css).
- Imports de `global.css`: `@import 'tailwindcss';` + `@import 'uniwind';` +
  `@import 'heroui-native/styles';` (subpath export `./styles` verificado en
  npm) + `@source` hacia `node_modules/heroui-native/lib`.
- Tokens por tema: `@theme { ... }` para tokens Tailwind y
  `@layer theme { :root { @variant light { ... } @variant dark { ... } } }`
  para variables por tema. Temas pre-registrados: `light`, `dark`, `system`
  (default adaptativo) — sin `extraThemes` en esta feature.
- Tipos de `className`: uniwind los **genera** en el `dtsFile` (no hay
  `uniwind-env.d.ts` manual). CLI para CI/typecheck sin Metro:
  `uniwind generate-artifacts --css <css> --dts <dts>` (bin `uniwind`
  verificado en el paquete).
- **No existe transformer oficial de jest para uniwind** (docs y búsqueda
  2026-08-20) → estrategia: `transformIgnorePatterns` + stub de `.css` (R8).
- Provider: `import { HeroUINativeProvider } from 'heroui-native';` — prop
  `config` opcional. `KeyboardProvider` (react-native-keyboard-controller) NO
  se instala ni se usa (ver [[design]] §D4).
- reicon-react-native@1.0.102: exports `./icons/*` con **named exports**
  verificados (`import { Refresh } from 'reicon-react-native/icons/Refresh'`);
  código ESM sin transpilar → va en `transformIgnorePatterns`.

## Excepción a C4 (config nacida verde)

`metro.config.js`, `src/theme/global.css`, `eas.json`, el bloque `jest` de
`package.json` y el `dtsFile` generado son **configuración**: no nacen por
TDD. La doctrina de guardas se cumple así: el test spike de R6 se escribe y
se ve **ROJO primero** (falla con "Cannot find module 'heroui-native'" antes
de instalar deps y config) y solo se vuelve verde cuando deps + metro + css +
jest config están completos — ese rojo→verde es el historial que cubre
R1/R2/R3/R8. R7 es refactor bajo guarda ya existente (los tests de #31, que
ya se vieron rojos en su feature): no exige nuevo test rojo, y sus asserts
NO se reescriben. R4/R9/R10 son estructurales (reviewer).

## Requisitos funcionales

### Dependencias

- **R1**: WHEN el implementador instala las dependencias con exactamente
  `bunx expo install react-native-svg expo-dev-client expo-blur` seguido de
  `bun add heroui-native@1.0.8 uniwind tailwindcss tailwind-variants tailwind-merge reicon-react-native`
  (desde `mobile-pet-tracker/`) THE SYSTEM SHALL dejar en
  `mobile-pet-tracker/package.json` heroui-native pineado a `1.0.8`, uniwind
  resolviendo >=1.11, tailwindcss >=4, y SHALL NOT añadir `@gorhom/bottom-sheet`,
  `react-native-keyboard-controller`, `nativewind` ni paquete nitro alguno.
  `bun install` termina con exit 0 sin warnings de peers insatisfechos de
  heroui-native.
  *Verificación: estructural (reviewer — diff de `package.json`/`bun.lock` +
  `bun install`). Excepción C4; el rojo→verde lo aporta R6.*

### Configuración de estilos

- **R2**: WHEN Metro arranca THE SYSTEM SHALL cargar
  `mobile-pet-tracker/metro.config.js` que parte de
  `getDefaultConfig(__dirname)` de `expo/metro-config` y lo envuelve con
  `withUniwindConfig(config, { cssEntryFile: './src/theme/global.css', dtsFile: './src/uniwind-types.d.ts' })`
  como wrapper más externo, sin ningún otro wrapper.
  *Verificación: estructural (reviewer, código exacto en [[design]] §D2) +
  R6 verde. Excepción C4.*

- **R3**: WHEN se procesa `mobile-pet-tracker/src/theme/global.css` THE
  SYSTEM SHALL contener, en este orden: (a) `@import 'tailwindcss';`,
  `@import 'uniwind';`, `@import 'heroui-native/styles';`; (b)
  `@source '../';` (raíz de escaneo = `src/`, porque el css vive en
  `src/theme/`) y `@source '../../node_modules/heroui-native/lib';`; (c) un
  bloque `@theme` con el token de marca `--color-brand: #208AEF;`; (d) un
  bloque `@layer theme { :root { @variant light {...} @variant dark {...} } }`
  con la paleta minimalista exacta de [[design]] §D6 (neutros slate + acento
  `#208AEF`) sobre las variables base de heroui-native (`--background`,
  `--foreground`, `--surface`, `--overlay`, `--accent`, `--default`,
  `--muted`, `--border`, `--divider`, `--link`), y ambas variantes SHALL
  definir el mismo conjunto de variables.
  *Verificación: estructural (reviewer contra [[design]] §D6) + R6 verde +
  smoke R12 en light y dark. Excepción C4. Si los nombres reales de las
  variables en `node_modules/heroui-native/lib` (styles css) difieren de la
  lista, Codex adapta los NOMBRES conservando los VALORES y lo anota en
  `progress/impl_mobile-ui-foundation.md`.*

- **R4**: WHEN se ejecuta `bun run --cwd mobile-pet-tracker typecheck` sin
  Metro corriendo THE SYSTEM SHALL compilar con exit 0 los `className` de la
  app, porque `src/uniwind-types.d.ts` (generado con
  `bun run --cwd mobile-pet-tracker generate:styles`, script nuevo
  `"generate:styles": "uniwind generate-artifacts --css ./src/theme/global.css --dts ./src/uniwind-types.d.ts"`)
  está **commiteado**; y WHEN cambie `global.css` THE SYSTEM SHALL regenerar
  y commitear el `.d.ts` en el mismo commit (regla nueva en R10).
  *Verificación: `bun run --cwd mobile-pet-tracker typecheck` exit 0 en CI
  (que nunca arranca Metro).*

### Provider raíz

- **R5**: WHEN la app monta su layout raíz
  (`mobile-pet-tracker/src/app/_layout.tsx`) THE SYSTEM SHALL (a) importar
  `../theme/global.css` como primer import, (b) envolver el `<Stack />`
  existente exactamente así:
  `<GestureHandlerRootView style={{ flex: 1 }}>` →
  `<HeroUINativeProvider>` → `<Stack />`, sin `KeyboardProvider`; y THE
  SYSTEM SHALL NOT crear más carpetas nuevas que
  `mobile-pet-tracker/src/components/` y `mobile-pet-tracker/src/theme/`.
  *Verificación: estructural (reviewer, código exacto en [[design]] §D3) +
  los tests existentes siguen verdes + smoke R12 (la app arranca sin crash).*

### Spike — prueba de fuego del stack en jest

- **R6**: WHEN corre
  `mobile-pet-tracker/src/components/__tests__/heroui-smoke.test.tsx`
  (`describe('R6: ...')`) THE SYSTEM SHALL (a) renderizar un `Button` de
  `heroui-native` con `className` que use un token del tema (ej.
  `bg-accent`), dentro de `HeroUINativeProvider`, con `testID="spike-button"`,
  y verificar con asserts no vacíos que el botón está en pantalla, que su
  texto se renderiza y que `fireEvent.press` dispara el `onPress` exactamente
  una vez; y (b) renderizar un icono importado por subpath
  (`import { Refresh } from 'reicon-react-native/icons/Refresh'`) con
  `testID="spike-icon"` y verificar que está en pantalla. Este test SHALL
  verse ROJO antes de R1–R3/R8 (ver §Excepción a C4).
  *Test: el propio spike. La API exacta de children/label de `Button` se
  verifica contra `node_modules/heroui-native/lib/typescript/` al escribirlo
  (lookup, no decisión). Si el spike NO puede ponerse verde con la config de
  R8, se PARA y se escala al humano con la escalera de planes B de
  [[design]] §Riesgos — prohibido "arreglarlo" cambiando de motor en silencio.*

### Migración de la pantalla health

- **R7**: WHEN la app abre `/` (`mobile-pet-tracker/src/app/index.tsx`) THE
  SYSTEM SHALL renderizar la pantalla health con componentes de heroui-native
  y estilos `className` de forma que: (a) el control de retry es un `Button`
  de heroui-native que conserva `testID="health-retry"`; (b) el estado
  conserva `testID="health-state"` con el texto exacto del `kind` y colores
  por estado vía utilidades Tailwind con variante `dark:` (mapa exacto en
  [[design]] §D7); (c) el archivo no contiene `StyleSheet.create` ni el mapa
  `stateColors` por valores hex; (d) los tests existentes de
  `src/app/__tests__/index.test.tsx` y `src/api/__tests__/health.test.ts`
  pasan **sin modificar sus asserts de comportamiento** (solo se toleran
  ajustes de imports/render si RTL lo exige, anotados en el progress).
  *Test: los tests existentes de #31 son la guarda (refactor bajo verde).
  Verificación adicional del reviewer: `grep -n "StyleSheet" mobile-pet-tracker/src/app/index.tsx`
  vacío.*

### Jest

- **R8**: WHEN corre `bun run --cwd mobile-pet-tracker test` THE SYSTEM SHALL
  pasar todos los tests (los de #31 + el spike R6) con esta configuración en
  el bloque `jest` de `mobile-pet-tracker/package.json`: (a)
  `transformIgnorePatterns` = el patrón del preset copiado de
  `node_modules/jest-expo/jest-preset.js` (NO de memoria) con
  `heroui-native|uniwind|tailwind-variants|tailwind-merge|reicon-react-native`
  añadidos al grupo de excepciones (más `culori` u otros que el spike
  descubra, anotados en el progress); (b) `moduleNameMapper` con
  `"\\.css$": "<rootDir>/jest/css-stub.js"` y stub
  `mobile-pet-tracker/jest/css-stub.js` = `module.exports = {};`; (c)
  `setupFilesAfterEnv: ["<rootDir>/jest-setup.js"]` con
  `require('react-native-reanimated').setUpTests();` (API verificada en docs
  de Reanimated 4); (d) SOLO si el spike falla por gesture-handler, añadir
  `setupFiles: ["./node_modules/react-native-gesture-handler/jestSetup.js"]`.
  *Test: la suite completa verde; el rojo previo del spike (R6) es la prueba
  de que esta config hace trabajo real.*

### Development build

- **R9**: WHEN existe `mobile-pet-tracker/eas.json` THE SYSTEM SHALL definir
  el perfil `build.development` con `"developmentClient": true`,
  `"distribution": "internal"` y `"bun": "1.3.14"` (pin de la máquina del
  humano — salda la deuda #3 de #31), JSON exacto en [[design]] §D8. Ejecutar
  `eas build` / `eas login` / `bunx expo run:android` NO es tarea de Codex —
  es el gate humano R12.
  *Verificación: estructural (reviewer). Excepción C4.*

### Documentación

- **R10**: WHEN se cierra la feature THE SYSTEM SHALL añadir a
  `docs/conventions.md` la sección "Convenciones de la app móvil" que
  documente, como mínimo: patrón `src/api` (unions `{kind}`, `fetchFn`
  inyectable, nunca lanzar hacia el llamador); `EXPO_PUBLIC_*` leída en un
  solo punto; cuándo `className` y cuándo `StyleSheet` (default: `className`;
  `StyleSheet` solo donde uniwind no llegue, anotándolo); estructura de
  carpetas (`src/app` rutas, `src/components` UI compartida, `src/theme`
  tokens, `src/api` cliente HTTP); testID + R-ids en tests RTL; development
  build obligatorio desde #32 (Expo Go ya no sirve) con los comandos del gate
  humano; y la regla de regenerar `src/uniwind-types.d.ts` en el mismo commit
  que toque `global.css` (R4).
  *Verificación: reviewer.*

### Contención

- **R11**: WHILE la feature #32 esté en curso THE SYSTEM SHALL NOT modificar
  ningún archivo bajo `backend-pet-tracker/`.
  *Verificación: `git diff --stat main...HEAD -- backend-pet-tracker/`
  devuelve vacío en la review.*

### Prueba de humo del humano (gate)

- **R12**: WHEN el humano ejecuta la prueba de humo THE SYSTEM SHALL mostrar
  la pantalla health estilizada con HeroUI en un development build sobre
  Android físico. Pasos exactos:

  1. `bun install` dentro de `mobile-pet-tracker/` (deps nuevas).
  2. Compilar el dev build: `bunx expo run:android` con el teléfono conectado
     por USB (o `eas build --profile development --platform android` si se
     prefiere la nube; requiere `eas login` — cuenta del humano).
  3. Arrancar backend (`docker compose up -d` +
     `pnpm -C backend-pet-tracker run start:dev`) y
     `bun run --cwd mobile-pet-tracker start` → abrir con la app instalada
     (ya NO Expo Go).
  4. **Camino feliz**: pantalla health con estilos HeroUI, estado `ok`,
     botón retry operativo.
  5. **Tema**: cambiar el tema del sistema Android light↔dark → la pantalla
     cambia de paleta sin reiniciar.
  6. **Camino negativo**: parar Nest → retry → `unreachable` (la migración no
     rompió los estados).

  - [ ] Smoke ejecutado por el humano (fecha: ____) — estilos, tema y estados vistos

## Fuera de alcance

- Cualquier cambio a `backend-pet-tracker/` (R11), `init.config.sh`,
  `init.sh` o `.github/workflows/ci.yml` (ya corren la app vía bun desde #31).
- `@gorhom/bottom-sheet`, `react-native-keyboard-controller` y
  `KeyboardProvider` (se instalan cuando un componente los pida).
- `react-native-nitro-theme-transition` y nitro-modules → feature #43.
- Toggle de tema en la UI (vive en #40); aquí el tema sigue al sistema
  (`userInterfaceStyle: "automatic"` ya presente).
- Pantallas nuevas, tab bar, navegación más allá del `<Stack />` actual
  (#33–#34).
- `extraThemes` de uniwind (solo light/dark/system).
- Uniwind Pro (theme transitions de pago) — no se instala ni se licencia.
- Publicación en stores, perfiles `preview`/`production` de EAS.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
