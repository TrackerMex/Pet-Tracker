# Implementación — mobile-ui-foundation (#32)

- Fecha: 2026-08-20
- Branch: `feature/32-mobile-ui-foundation`
- Alcance de Codex: R1-R9
- Estado: R1-R9 implementados y verificados; R10 queda pendiente del smoke
  humano con Expo Go en Android físico.

## Resultado

- Se instalaron HeroUI Native 1.0.8, Uniwind, Tailwind CSS 4,
  tailwind-variants, tailwind-merge, Reicon, react-native-svg, expo-blur,
  expo-dev-client y el peer explícito de bottom sheet. `bun.lock` quedó
  regenerado.
- Metro usa `withUniwindConfig` y carga `src/theme/global.css`, con los tokens
  light/dark y accent `#208AEF` definidos por la spec.
- El layout raíz importa el CSS y monta
  `GestureHandlerRootView > HeroUINativeProvider > Stack`.
- La pantalla health usa `Chip`, `Button` y `className`, conserva
  `health-state`/`health-retry`, no contiene `StyleSheet.create` ni colores
  hex y añade el toggle light/dark con iconos Moon/Sun.
- Jest transforma el stack nuevo, absorbe CSS y carga los mocks oficiales de
  Worklets/Reanimated. La suite health mantiene intactos sus asserts y monta
  el provider real mediante el wrapper de render.
- `eas.json` contiene solo el perfil development, con development client,
  distribución internal y bun 1.3.14.
- `docs/conventions.md` documenta las convenciones de la isla móvil.

## Evidencia TDD y commits de implementación

| R-id | Rojo | Verde / implementación |
|---|---|---|
| R1 | `b03fb4c` — módulo `heroui-native` ausente | `a727f7a` — spike HeroUI verde |
| R2 | excepción C4 (config) | `0c91e7b` — Metro + tokens |
| R3 | excepción C4 (config) | `7a95b94` — tipos Uniwind + ignore del generado |
| R4 | suite existente verde antes del cambio | `56add4f` — provider raíz |
| R5 | suite heredada como regresión; falló sin el contexto HeroUI | `200bbc6` — pantalla health migrada y suite verde |
| R6 | `1cd1bae` — `theme-toggle` inexistente | `a76a572` — toggle light/dark verde |
| R7 | excepción C4 (config) | `3ac046a` — perfil EAS development |
| R8 | documentación | `153c3f1` — convenciones móviles |
| R9 | verificación | cierre de integración con este informe |

`specs/mobile-ui-foundation/traceability.md` se actualizó después de cada
commit de requisito y conserva R10 como gate humano pendiente.

## Verificación ejecutada

- `bun run typecheck` — exit 0.
- `bun run test -- --runInBand` — 3 suites, 15 tests verdes.
- `node` cargando `metro.config.js` — configuración válida.
- `git ls-files` — `src/uniwind-env.d.ts` tracked y
  `src/uniwind-types.d.ts` no tracked/ignorado.
- `JSON.parse` + asserts sobre `eas.json` y `expo-dev-client` — verde.
- grep de `src/app/index.tsx` — sin `StyleSheet.create` ni colores hex.
- `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/`
  — vacío.
- `./init.sh` — exit 0: build verde; backend 143 suites / 1111 tests;
  infraestructura 2 suites / 14 tests; harness 28 tests; móvil 3 suites /
  15 tests; lint y typecheck verdes.

Los e2e se omitieron porque `127.0.0.1:4566` no respondió, igual que en el
gate inicial. No se levantó LocalStack, no se ejecutó CDK y no se creó ningún
recurso AWS.

## Ajustes descubiertos por el spike

- Reanimated 4.5.1 / Worklets 0.10.1 requieren el mock oficial de Worklets y
  `setUpTests()` para cargar HeroUI en Jest; se añadió `test/jest-setup.js`.
- `reicon-react-native@1.0.102` publica solo la condición ESM `import`; Jest 29
  necesita un `moduleNameMapper` a su entrypoint, sin afectar Metro.
- TypeScript 6 no veía el import CSS porque el `tsconfig` limita `types` a
  Jest. `src/css-env.d.ts` referencia los tipos CSS oficiales de Expo y
  mantiene intacto el contenido exacto de `src/uniwind-env.d.ts`.
- HeroUI 1.0.8 exige su provider para renderizar Chip/Button en tests; la
  suite heredada usa `HeroUINativeProvider` como wrapper, sin cambiar asserts.

## Pendiente humano

Ejecutar exclusivamente el R10 documentado en requirements:

1. Backend y dependencias locales arriba.
2. Desde `mobile-pet-tracker/`, `bunx expo start --go`.
3. Abrir el QR con Expo Go en Android físico y comprobar health, retry y
   light/dark.
4. Marcar el checkbox R10 con fecha y pasar la feature al reviewer.

No se ejecutó ningún emulador, dev build, EAS build ni `expo run:android`.
