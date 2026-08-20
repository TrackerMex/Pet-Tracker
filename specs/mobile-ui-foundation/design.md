---
feature: "mobile-ui-foundation"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-ui-foundation]]

> Ver [[requirements]] para los requisitos. Toda la API citada aquí fue
> verificada contra docs.uniwind.dev, heroui.com/deepwiki y npm el
> 2026-08-20 — Codex no re-investiga, implementa esto.

## Decisiones técnicas

- **D1 — uniwind como motor de estilos (no NativeWind)**: heroui-native 1.0
  se integra con uniwind vía `@import 'heroui-native/styles'` y las docs de
  uniwind lo listan como kit recomendado ("deep integration with Uniwind's
  theme system"). Tailwind CSS v4 nativo (config CSS-first, sin
  `tailwind.config.js`), sin preset de babel. Sirve a R1–R4, R6–R8. Plan B en
  §Riesgos.

- **D2 — metro.config.js exacto** (R2):

  ```js
  const { getDefaultConfig } = require('expo/metro-config');
  const { withUniwindConfig } = require('uniwind/metro');

  const config = getDefaultConfig(__dirname);

  module.exports = withUniwindConfig(config, {
    cssEntryFile: './src/theme/global.css',
    dtsFile: './src/uniwind-types.d.ts',
  });
  ```

  `withUniwindConfig` debe ser el wrapper más externo; rutas relativas
  obligatorias (regla de las docs). El directorio del `cssEntryFile`
  (`src/theme/`) pasa a ser la raíz de escaneo de classNames — por eso
  `global.css` lleva `@source '../';` para cubrir todo `src/` (R3).

- **D3 — provider raíz exacto** (R5), `src/app/_layout.tsx`:

  ```tsx
  import '../theme/global.css';

  import { Stack } from 'expo-router';
  import { HeroUINativeProvider } from 'heroui-native';
  import { GestureHandlerRootView } from 'react-native-gesture-handler';

  export default function RootLayout() {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <HeroUINativeProvider>
          <Stack />
        </HeroUINativeProvider>
      </GestureHandlerRootView>
    );
  }
  ```

  El css se importa en el layout raíz (regla FAQ de uniwind para Expo Router:
  nunca en el entry `index.ts`). `style={{ flex: 1 }}` es el único
  `style` inline permitido aquí (GestureHandlerRootView necesita ocupar la
  pantalla antes de que exista el árbol de uniwind). Si TS exige el prop
  `config` del provider, pasar `config={{}}`.

- **D4 — sin KeyboardProvider ni bottom-sheet**: la doc de heroui-native los
  muestra en el setup "de producción", pero `react-native-keyboard-controller`
  no es peer requerido y no hay ningún TextField en esta feature;
  `@gorhom/bottom-sheet` es peer **opcional** (verificado en npm). Instalar
  infra sin consumidor es deuda gratis — se añadirán cuando #37+ los pida.
  `expo-blur` sí se instala (peer opcional que el plan aprobado incluye
  explícitamente, y `expo install` lo pina a SDK 57).

- **D5 — estrategia jest** (R8): no existe transformer oficial de uniwind
  para jest (verificado 2026-08-20). En jest no corre Metro, así que el
  transform de uniwind no se aplica y `className` queda inerte — suficiente
  para tests de estructura/testID/comportamiento, que es lo que este repo
  exige (los estilos visuales los cubre el gate humano R12). Piezas:
  - `transformIgnorePatterns`: copiar el patrón vigente de
    `node_modules/jest-expo/jest-preset.js` y añadir
    `heroui-native|uniwind|tailwind-variants|tailwind-merge|reicon-react-native`
    (heroui-native publica ESM en `lib/module`, reicon publica ESM crudo —
    verificado en npm/unpkg). Si el spike descubre otro paquete ESM (ej.
    `culori`, dependencia de uniwind), se añade y se anota en el progress.
  - `moduleNameMapper` `"\\.css$"` → `jest/css-stub.js` (`module.exports = {};`)
    para el `import '../theme/global.css'` del layout.
  - `jest-setup.js` con `require('react-native-reanimated').setUpTests();`
    vía `setupFilesAfterEnv` (API oficial Reanimated 4, jest >= 28).
  - gesture-handler `jestSetup.js` SOLO si el spike lo exige (jest-expo ya
    mockea buena parte; no añadir setup muerto).

- **D6 — paleta minimalista** (R3): neutros slate + un acento. El acento es
  `#208AEF` — ya es el color del splash en `app.json`, así la marca queda en
  un solo valor. Referencia visual: Dribbble del plan (minimal, para todo
  público). Valores exactos:

  ```css
  @theme {
    --color-brand: #208AEF;
  }

  @layer theme {
    :root {
      @variant light {
        --background: #ffffff;
        --foreground: #0f172a;
        --surface: #f8fafc;
        --overlay: #ffffff;
        --accent: #208AEF;
        --default: #e2e8f0;
        --muted: #64748b;
        --border: #e2e8f0;
        --divider: #f1f5f9;
        --link: #208AEF;
      }

      @variant dark {
        --background: #0f172a;
        --foreground: #f8fafc;
        --surface: #1e293b;
        --overlay: #1e293b;
        --accent: #4da6f5;
        --default: #334155;
        --muted: #94a3b8;
        --border: #334155;
        --divider: #1e293b;
        --link: #4da6f5;
      }
    }
  }
  ```

  Ambas variantes definen el mismo conjunto (regla dura de uniwind). Los
  NOMBRES se contrastan con el css real de
  `node_modules/heroui-native/lib` al implementar (R3): si heroui usa otros,
  se adaptan nombres conservando valores. Ajustes estéticos finos = feedback
  del gate humano R12, no re-diseño de la spec.

- **D7 — migración health screen** (R7): mismo comportamiento, solo piel.
  - `Pressable` retry → `Button` de heroui-native con
    `testID="health-retry"` y el mismo `onPress`.
  - `View`/`Text` con `className`; colores de estado vía utilidades con
    variante dark:

    ```tsx
    const stateClasses: Record<HealthState['kind'], string> = {
      ok: 'text-green-700 dark:text-green-400',
      error: 'text-red-700 dark:text-red-400',
      unreachable: 'text-orange-700 dark:text-orange-400',
      'missing-config': 'text-violet-700 dark:text-violet-400',
    };
    ```

  - Se elimina `StyleSheet.create` y el mapa `stateColors` hex.
  - `src/api/` no se toca (R7d: sus tests quedan intactos).
  - El icono `Refresh` de reicon puede ir dentro del Button (opcional, ya
    verificado por el spike); si complica los asserts existentes, se omite.

- **D8 — eas.json exacto** (R9):

  ```json
  {
    "cli": {
      "appVersionSource": "local"
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

  Sin perfiles `preview`/`production` (fuera de alcance). Si la versión de
  eas-cli del humano exige algún campo extra, lo añade el humano en su
  terminal y se anota en el progress — Codex no ejecuta `eas`.

- **D9 — dts commiteado + script `generate:styles`** (R4): CI corre
  `tsc --noEmit` sin Metro, así que el `.d.ts` generado debe vivir en git.
  `uniwind generate-artifacts` existe exactamente para esto ("useful in CI
  actions... before Metro or Vite starts" — docs). Regla de sincronía: mismo
  commit que toque `global.css` regenera el dts (documentada en R10).

- **D10 — reactCompiler queda ON**: `app.json` no se toca. Si el spike o el
  dev build revelan incompatibilidad uniwind↔reactCompiler, la primera
  palanca es apagar `"reactCompiler": false` en `app.json` — pero eso es
  decisión del gate humano (cambia el perf-profile de toda la app), no de
  Codex. Anotar el síntoma en el progress y PARAR.

## Archivos afectados

Todo en `mobile-pet-tracker/` salvo indicado. No hay capas
domain/application/infrastructure (app Expo, ver nota de #31).

| Archivo | Cambio |
|---|---|
| `package.json` | deps R1, bloque `jest` R8, script `generate:styles` R4 |
| `bun.lock` | regenerado por bun |
| `metro.config.js` | **nuevo** — D2 |
| `src/theme/global.css` | **nuevo** — R3/D6 |
| `src/uniwind-types.d.ts` | **nuevo, generado y commiteado** — R4/D9 |
| `src/app/_layout.tsx` | provider raíz — R5/D3 |
| `src/app/index.tsx` | migración HeroUI + className — R7/D7 |
| `src/components/__tests__/heroui-smoke.test.tsx` | **nuevo** — spike R6 |
| `jest/css-stub.js` | **nuevo** — R8/D5 |
| `jest-setup.js` | **nuevo** — R8/D5 |
| `eas.json` | **nuevo** — R9/D8 |
| `docs/conventions.md` (raíz del repo) | sección móvil — R10 |
| `specs/mobile-ui-foundation/*` | esta spec |

Carpetas nuevas permitidas: `src/components/`, `src/theme/` (y el dir
`jest/` del stub). Ninguna otra.

## Alternativas descartadas

- **NativeWind 4 como motor**: HeroUI Native 1.0 está construido contra
  uniwind/Tailwind v4; NativeWind queda como plan B, no como default (plan
  aprobado 2026-08-20).
- **Motion (motion.dev)**: solo web/DOM, no soporta RN — descartado en el
  plan; las animaciones son Reanimated 4.
- **react-native-nitro-theme-transition ahora**: exige nitro-modules
  (nativo) y mezclaría el riesgo del stack de estilos con el de nitro en un
  mismo PR imposible de bisecar → feature #43. El cambio de tema queda sin
  fade.
- **@gorhom/bottom-sheet / KeyboardProvider ahora**: sin consumidor en esta
  feature (D4).
- **tailwind.config.js**: Tailwind v4 con uniwind es CSS-first; crear el
  archivo sería config muerta.
- **Transformer jest de CSS real (compilar Tailwind en tests)**: no existe
  oficial; un transformer casero validaría estilos que el gate humano ya
  cubre — coste sin señal (D5).
- **Copiar SVGs a mano en vez de reicon**: innecesario — los imports por
  subpath `reicon-react-native/icons/*` existen y están verificados; queda
  como plan B si Metro se atraganta con el barrel (§Riesgos).

## Riesgos y planes B (escalera — cambiar de peldaño = decisión humana)

| Riesgo | Señal | Plan B |
|---|---|---|
| HeroUI 1.0.8 + uniwind 1.11 inmaduros sobre RN 0.86/React 19.2 | El spike R6 no se pone verde, o el dev build R12 crashea en el provider | (1) mismo HeroUI con **NativeWind 4** como motor (reescribir R2/R3/R8, misma paleta); (2) primitivas propias en `src/components/ui/` (Button/Card/Text con StyleSheet) — el roadmap #33+ referencia componentes propios, así que no se re-especifica nada aguas abajo |
| uniwind vs `reactCompiler` experimental | Errores de compilación RC en Metro o comportamiento raro de re-render | Apagar `reactCompiler` en `app.json` (gate humano, D10) |
| reicon: Metro empaqueta el barrel de 2674 iconos | Bundle gigante / build lenta pese a imports por subpath | Copiar ~20 SVGs propios a `src/components/icons/` y desinstalar reicon |
| Peers de heroui exigen versión que el scaffold no tiene | `bun install` warnings o crash runtime | Ya verificado que no (npm 2026-08-20); si una patch release lo rompe, pinear la versión anterior del peer y anotar |
| `eas build` en nube falla por bun/EAS | Error solo reproducible en la cuenta del humano | `bunx expo run:android` local es el camino primario del smoke; EAS puede esperar a #33+ |

## Deuda que esta feature salda / crea

- **Salda** (de #31): sección móvil en `docs/conventions.md` (R10); bun
  pineado en `eas.json` (R9).
- **Crea**: dts generado commiteado (deriva posible si alguien edita
  `global.css` sin regenerar — mitigada por la regla R4/R10); Expo Go
  inutilizable (asumida por decisión humana); paleta D6 sujeta a ajuste fino
  visual en features siguientes.
