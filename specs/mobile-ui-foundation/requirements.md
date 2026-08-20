---
feature: "mobile-ui-foundation"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-ui-foundation]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas (D1–D10, todas cerradas).
> Las capas de `docs/architecture.md` son de backend y NO aplican a esta app;
> sí aplican kebab-case, tests que nombran su R-id y conventional commits.
> Toda referencia de API de paquetes fue verificada contra los tarballs
> publicados en npm el 2026-08-20 (ver [[design]] §Verificación de APIs).

## Contexto fijo (no reabrir)

- Stack decidido por el humano (2026-08-20): **HeroUI Native 1.0.8** +
  **uniwind** (Tailwind v4 para RN) + **reicon-react-native** +
  **expo-dev-client**. Animaciones con **Reanimated 4** ya instalado
  (`react-native-reanimated@4.5.1` en `mobile-pet-tracker/package.json`).
- **Motion (motion.dev) está descartado**: no soporta React Native.
- **nitro-theme-transition queda FUERA**: va en la feature #43
  `mobile-theme-transition`. El toggle de tema de esta feature cambia el tema
  en seco (sin fade, sin transición animada).
- La app vive en `mobile-pet-tracker/` (isla bun, Expo SDK 57, expo-router,
  jest-expo). El humano usa bun **1.3.14** en Windows 11 y un Android físico.
- **La prueba de humo humana es con Expo Go** (restricción del humano
  2026-08-20: sin Android Studio ni builds por ahora). Todo el stack está
  verificado compatible con Expo Go (ver [[design]] §Compatibilidad Expo Go):
  heroui-native/uniwind/reicon son JS puro y los módulos nativos que usan
  (svg, blur, reanimated 4, worklets, gesture-handler) vienen bundleados en
  el SDK 57. `expo-dev-client` y `eas.json` se instalan/configuran igual
  (R7) pero **quedan fuera del camino de validación de #32** — la dev build
  se usará cuando haga falta (p.ej. #43 con nitro).
- `init.config.sh` ya integra la app (install/lint/typecheck/test vía
  `bun ... --cwd mobile-pet-tracker`) desde #31 — **no se toca** en esta
  feature.

## Excepción a C4 (archivos de configuración)

Los archivos de pura configuración (`metro.config.js`, `eas.json`,
`src/theme/global.css`, `src/uniwind-env.d.ts`, bloques `jest` y deps de
`package.json`) no nacen por TDD: los verifica el spike R1 (que falla sin
ellos), el typecheck, o el reviewer estructuralmente. Todo componente/pantalla
escrito a mano (R4, R5) sí sigue TDD estricto y **cada test nuevo debe verse
rojo al menos una vez** antes de verde.

## Requisitos funcionales

### Dependencias y configuración base

- **R1**: WHEN jest ejecuta el test de spike
  `mobile-pet-tracker/src/__tests__/heroui-smoke.test.tsx` que renderiza
  `<HeroUINativeProvider><Button testID="spike-button" className="bg-accent">Spike</Button></HeroUINativeProvider>`
  (imports: `HeroUINativeProvider` y `Button` desde `'heroui-native'`)
  THE SYSTEM SHALL renderizar sin lanzar y `getByTestId('spike-button')`
  SHALL encontrar el elemento, gracias a la configuración jest exacta de
  [[design]] §D6 (`transformIgnorePatterns` extendido + stub de `.css` vía
  `moduleNameMapper`).
  *Test: `mobile-pet-tracker/src/__tests__/heroui-smoke.test.tsx` →
  `describe('R1: HeroUI Button con className renderiza en jest', ...)`.
  Debe verse ROJO primero (sin `transformIgnorePatterns` el import de
  `heroui-native`/`uniwind` revienta el transform).*

- **R2**: WHEN metro compila la app THE SYSTEM SHALL tener
  `mobile-pet-tracker/metro.config.js` que exporta
  `withUniwindConfig(getDefaultConfig(__dirname), { cssEntryFile: './src/theme/global.css', dtsFile: './src/uniwind-types.d.ts' })`
  (import: `const { withUniwindConfig } = require('uniwind/metro')`), y
  `mobile-pet-tracker/src/theme/global.css` SHALL existir con exactamente
  esta estructura (contenido completo en [[design]] §D4):
  `@import 'tailwindcss';` + `@import 'uniwind';` +
  `@import 'heroui-native/styles';` +
  `@source '../../node_modules/heroui-native/lib';` + un bloque
  `@layer theme { :root { @variant light {...} @variant dark {...} } }` que
  define `--accent: #208AEF` y `--accent-foreground: #ffffff` en ambas
  variantes (paleta minimalista: el resto de tokens hereda los defaults de
  `heroui-native/styles`).
  *Verificación: estructural (reviewer, excepción C4) + gate humano R10 —
  jest no ejecuta metro.*

- **R3**: WHEN se ejecuta `bun run --cwd mobile-pet-tracker typecheck`
  THE SYSTEM SHALL pasar con las props `className` tipadas: existe
  `mobile-pet-tracker/src/uniwind-env.d.ts` (tracked) con el contenido
  exacto `/// <reference types="uniwind/types" />`, y
  `mobile-pet-tracker/.gitignore` SHALL ignorar `src/uniwind-types.d.ts`
  (archivo generado por metro; el typecheck SHALL pasar aunque no exista).
  *Verificación: `typecheck` exit 0 con `className` usado en `index.tsx` y
  `_layout.tsx`; el reviewer comprueba `git ls-files` (uniwind-env.d.ts sí,
  uniwind-types.d.ts no).*

### Provider raíz

- **R4**: WHEN la app monta su layout raíz
  (`mobile-pet-tracker/src/app/_layout.tsx`) THE SYSTEM SHALL importar
  `../theme/global.css` y envolver el `<Stack />` de expo-router en
  `<GestureHandlerRootView style={{ flex: 1 }}>` (de
  `'react-native-gesture-handler'`) y dentro `<HeroUINativeProvider>` (de
  `'heroui-native'`), en ese orden (GestureHandlerRootView por fuera).
  *Verificación: estructural (reviewer) — el render del provider en jest ya
  lo cubre R1; el render real lo cubre el gate humano R10.*

### Migración de la pantalla health

- **R5**: WHEN la ruta `/` (`mobile-pet-tracker/src/app/index.tsx`) renderiza
  THE SYSTEM SHALL estar migrada a componentes HeroUI + `className` (cero
  `StyleSheet.create` y cero colores hex en el archivo):
  - el estado se muestra en un `<Chip testID="health-state">` (de
    `'heroui-native'`) cuyo contenido de texto es exactamente el `kind`
    (`ok` | `error` | `unreachable` | `missing-config`), coloreado por
    tokens semánticos: `ok`→success, `error`→danger, `unreachable`→warning,
    `missing-config`→muted (mapeo exacto de classNames en [[design]] §D7);
  - el retry es un `<Button testID="health-retry">` (de `'heroui-native'`)
    que reejecuta `fetchHealth`;
  - los `testID` `health-state` y `health-retry` se conservan y la suite
    existente `mobile-pet-tracker/src/app/__tests__/index.test.tsx`
    (`describe('R7: ...')` de #31) SHALL pasar **sin modificar sus asserts**
    (solo se permite tocar ese archivo para añadir el describe de R6).
  *Test: la suite existente `index.test.tsx` verde es el test de regresión;
  el reviewer verifica con grep la ausencia de `StyleSheet.create` y de
  `#[0-9a-f]` en `src/app/index.tsx`.*

### Toggle de tema

- **R6**: WHEN el usuario pulsa el control con `testID="theme-toggle"` en
  `mobile-pet-tracker/src/app/index.tsx` THE SYSTEM SHALL llamar
  `Uniwind.setTheme(<tema opuesto>)` (import `{ Uniwind, useUniwind }` desde
  `'uniwind'`): si `useUniwind().theme === 'dark'` pasa a `'light'`, en
  cualquier otro caso pasa a `'dark'` — cambio en seco, sin animación de
  transición (nitro va en #43). El control SHALL mostrar el icono `Moon` (en
  tema light) o `Sun` (en tema dark) de `'reicon-react-native'`.
  *Test: `mobile-pet-tracker/src/app/__tests__/index.test.tsx` →
  `describe('R6: theme toggle', ...)` con
  `jest.spyOn(Uniwind, 'setTheme').mockImplementation(() => {})`:
  press sobre `theme-toggle` con tema `light` → `setTheme` llamado con
  `'dark'`. Debe verse ROJO primero.*

### EAS y development build

- **R7**: WHEN se corre `eas build --profile development` THE SYSTEM SHALL
  encontrar `mobile-pet-tracker/eas.json` (tracked) con el contenido exacto
  de [[design]] §D8: perfil `build.development` con
  `"developmentClient": true`, `"distribution": "internal"` y
  `"bun": "1.3.14"` (pin — salda la deuda #3 de #31), y
  `mobile-pet-tracker/package.json` SHALL incluir `expo-dev-client`
  (instalado vía `bunx expo install`, versión alineada a SDK 57).
  *Verificación: estructural (reviewer: `node -e "JSON.parse(...)"` sobre
  eas.json + diff de package.json). **Ninguna build se ejecuta en #32**:
  eas.json + expo-dev-client quedan configurados para el futuro (#43, dev
  builds), no son requisito para validar esta feature — el gate R10 es
  Expo Go.*

### Documentación

- **R8**: WHEN un desarrollador consulta `docs/conventions.md` THE SYSTEM
  SHALL encontrar una sección nueva `## Convenciones de la app móvil`
  (insertada después de `## Variables de entorno`, salda la deuda #1 de #31)
  que documenta como mínimo: estilos solo con `className`/tokens de
  `src/theme/global.css` (prohibido `StyleSheet.create` y colores hex en
  componentes nuevos), componentes HeroUI Native como base de UI, iconos de
  `reicon-react-native`, animaciones con Reanimated 4 (Motion descartado),
  tests con jest-expo nombrando R-ids, y bun como package manager de la isla.
  *Verificación: estructural (reviewer).*

### Contención e integración

- **R9**: WHILE la feature #32 esté en curso THE SYSTEM SHALL NOT modificar
  ningún archivo bajo `backend-pet-tracker/` ni `infra/`, y NOT modificar
  `init.config.sh` ni `.github/workflows/ci.yml` (ya integran la app desde
  #31), y WHEN se ejecuta `./init.sh` tras los cambios THE SYSTEM SHALL
  terminar con exit 0 (install/lint/typecheck/test de la app verdes vía bun).
  *Verificación: el reviewer ejecuta `./init.sh` y
  `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/` (vacío).*

### Prueba de humo del humano

- **R10**: WHEN el humano ejecuta la prueba de humo **en Expo Go** THE
  SYSTEM SHALL mostrar en Android físico la pantalla health con el nuevo
  stack. Pasos (PC y teléfono en la misma WiFi, `.env` con la IP LAN ya
  configurado desde #31):

  1. Backend arriba: `docker compose up -d` en la raíz y
     `pnpm -C backend-pet-tracker run start:dev`.
  2. Desde `mobile-pet-tracker/`: `bunx expo start --go` — el flag `--go` es
     **obligatorio**: con `expo-dev-client` instalado, `expo start` a secas
     arranca en modo dev-client y el QR no abriría en Expo Go (alternativa:
     tecla `s` en el bundler para cambiar de modo).
  3. Escanear el QR con Expo Go en el Android.
  4. Verificar: pantalla health renderiza con componentes HeroUI (Chip de
     estado + Button de retry), estados `ok`/`error`/`unreachable` siguen
     funcionando contra el backend LAN (mismo flujo que el smoke de #31).
  5. Pulsar el toggle de tema: la UI cambia light↔dark en seco usando los
     tokens de `global.css` (sin fade — eso es #43).

  No se ejecuta ninguna build (ni EAS ni `expo run:android`) para validar
  esta feature.

  - [ ] Smoke ejecutado por el humano (fecha: ____)

## Fuera de alcance

- **nitro-theme-transition** y cualquier animación de transición de tema →
  feature #43 `mobile-theme-transition`.
- Motion / motion.dev (descartado: no soporta React Native).
- Cualquier pantalla nueva más allá de la migración de la pantalla health.
- Cambios a `backend-pet-tracker/`, `infra/`, `init.config.sh` o CI (R9).
- Perfiles EAS `preview`/`production`, `eas submit`, credenciales de firma
  gestionadas — solo el perfil `development`.
- **Ejecutar cualquier build nativa** (EAS o `expo run:android` / Android
  Studio): la validación de #32 es 100% Expo Go; la dev build entra en juego
  cuando un paquete con nativos propios lo exija (#43).
- Fuentes custom (Inter, etc.): los tokens `--font-*` de HeroUI quedan con
  sus defaults del sistema.
- Tematización avanzada (temas extra vía `extraThemes` de uniwind, tema
  `vibrant` de HeroUI): solo `light`/`dark` estándar.
- `react-native-keyboard-controller` (lo usa el example app de HeroUI; aquí
  no hay inputs todavía — YAGNI).

## Decisiones pendientes de humano

*(ninguna — el plan aprobado 2026-08-20 + la entrada de `feature_list.json`
cierran todas las decisiones; las elecciones menores de esta spec —
accent `#208AEF` tomado del splash de `app.json`, `Chip`/`Button` como
componentes de la migración, `testID="theme-toggle"` — se registran en
[[design]] y se pueden objetar en este gate de aprobación)*

## Aprobación

- [x] Aprobado por humano (fecha: 2026-08-20) ← gate obligatorio antes de implementar
