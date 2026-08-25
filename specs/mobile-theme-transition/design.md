---
feature: "mobile-theme-transition"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[mobile-theme-transition]] (feature #43)

> Ver [[requirements]] para los R-ids. Spec autosuficiente para Codex CLI:
> rutas, símbolos, valores y mocks exactos. Skills a cargar antes de
> implementar: `expo-overview` → `expo-animation` (plugin expo de Codex).
> Solo se toca `mobile-pet-tracker/` (capa cliente; no aplica el corte
> domain/application/infrastructure del backend).

## Hechos verificados (registry npm, 2026-08-25)

Paquete `react-native-nitro-theme-transition@1.0.0` (única 1.x publicada;
peerDeps: `react-native-nitro-modules >= 0.36.0`; sin dependencies propias):

- **API completa**: `withThemeTransition(applyTheme, options)`. El callback
  `applyTheme` debe ser **síncrono** y la librería garantiza que corre
  **exactamente una vez en todo camino**: módulo nativo ausente (Expo Go,
  jest), captura fallida, o web → cambio instantáneo sin animación y sin
  crash. También exporta `isThemeTransitionAvailable()`,
  `THEME_TRANSITION_KINDS` y `THEME_TRANSITION_DIRECTIONS`.
- Opciones relevantes: `kind` (default `'circularReveal'`; usamos `'fade'`),
  `durationMs` (default 650; mínimo clampeado para `fade`: 200),
  `settleFrames` (default 2; el README recomienda subirlo cuando el tema es
  React-driven, porque el callback solo *programa* el re-render y revelar
  antes de que pinte anima hacia los colores viejos).
- **Reduce Motion NO lo maneja la librería** (documentado como decisión): la
  app debe saltarse la animación ella misma.
- Ships código nativo (Core Animation iOS / animators Android), sin config
  plugin: autolinking normal + `nitrogen/generated/` committeado en el
  paquete. Requiere rebuild nativo: en este repo eso es **EAS prebuild en la
  nube** (no hay carpetas `android/`/`ios/`: proyecto CNG puro).
- Sin Skia, sin Reanimated, sin dependencia de librería de estilos: compatible
  con uniwind sin integración especial.

## Estado del repo verificado

- Toggle actual (#40): `mobile-pet-tracker/src/screens/profile/index.tsx`
  líneas ~317-330 — `Button` testID `theme-toggle` cuyo `onPress` hace
  `Uniwind.setTheme(nextTheme)` + `void setStoredTheme(nextTheme)`.
- Persistencia: `src/utils/theme-preference.ts` (SecureStore, best-effort).
- Tema inicial: `src/app/_layout.tsx` lo aplica antes del primer render
  (gate `themeReady`) — sin transición, fuera de alcance.
- `app.json`: `experiments.reactCompiler: true` (el riesgo documentado);
  sin `extra.eas.projectId` (→ paso `eas init` del humano en el gate).
- `eas.json`: perfil `development` de #32 (`developmentClient: true`,
  `distribution: internal`, bun `1.3.14`).
- SDK 57 / RN 0.86 = New Architecture only; nitro-modules la requiere —
  compatible en papel.
- jest: preset jest-expo, `transformIgnorePatterns` con whitelist explícito,
  setup con mock de worklets + `reanimated.setUpTests()` (→ `useReducedMotion`
  es mockeable/estable en jest).
- Suites que montan el screen real de Profile: solo
  `src/screens/profile/index.test.tsx` (la del route,
  `src/app/(tabs)/__tests__/profile.test.tsx`, mockea el screen entero;
  `design-drift.test.ts` solo lee fuentes).

## Decisiones técnicas

1. **Hook wrapper `useThemeTransition` en `src/theme/theme-transition.ts`**
   (R1-R4): único punto de la app que importa la librería. Exporta:

   ```ts
   export const THEME_FADE = {
     kind: 'fade',
     durationMs: 400,
     settleFrames: 4,
   } as const;

   export function useThemeTransition(): (next: ThemePreference) => void
   ```

   Comportamiento del callback devuelto (`switchTheme`):
   - `apply = () => { Uniwind.setTheme(next); }` (síncrono, sin awaits).
   - Si `useReducedMotion()` (de `react-native-reanimated`) es `true` →
     ejecuta `apply()` directamente (R3).
   - Si no → `withThemeTransition(apply, THEME_FADE)` (R1).
   - Después (fuera del callback síncrono): `void setStoredTheme(next)` (R2).
   - Nunca consulta `isThemeTransitionAvailable()` para decidir si cambiar el
     tema (R4) — la degradación es de la librería.

   El toggle de Profile queda:
   `onPress={() => switchTheme(theme === 'dark' ? 'light' : 'dark')}`.

2. **`durationMs: 400`, no el default 650** (R1): la carta de UI fija 400ms
   para superficies grandes y un cambio de tema es pantalla completa; 400 ≥
   mínimo 200 del kind `fade`. Se queda como const TS (un solo uso — la regla
   de promover a token `--motion-*` en `global.css` aplica cuando se repite).

3. **`settleFrames: 4`, no el default 2** (R1): `Uniwind.setTheme` dispara un
   re-render React (no un commit nativo síncrono estilo Unistyles); el README
   recomienda exactamente 4 para temas React-driven en árboles grandes, para
   no revelar antes de que el tema nuevo haya pintado.

4. **Reduced motion con `useReducedMotion()` de Reanimated** (R3): ya
   instalada y con soporte jest en el setup del proyecto; evita el
   `AccessibilityInfo.isReduceMotionEnabled()` asíncrono (Promise) que
   obligaría a cachear estado. La librería no lo maneja por diseño.

5. **Dependencias** (R5): añadir a `mobile-pet-tracker/package.json`
   `react-native-nitro-theme-transition@1.0.0` y
   `react-native-nitro-modules@0.37.0` (pineado exacto; satisface el peer
   `>=0.36.0` y es la última estable a 2026-08-25). Instalación con `bun add`
   desde `mobile-pet-tracker/` (isla bun; expo no publica versión canónica de
   estos paquetes, no hace falta `expo install`). Sin cambios en `app.json`
   (sin config plugin) ni en `eas.json` (el perfil de #32 ya sirve).

6. **Estrategia jest** (R2, R5):
   - `transformIgnorePatterns`: añadir
     `react-native-nitro-theme-transition|react-native-nitro-modules` al
     whitelist existente.
   - Mock degradado por suite (en `src/screens/profile/index.test.tsx` y en
     el test nuevo del hook), factory hoisted para que el módulo real nunca
     se evalúe en jest:

     ```ts
     jest.mock('react-native-nitro-theme-transition', () => ({
       withThemeTransition: jest.fn((apply: () => void) => {
         apply();
       }),
       isThemeTransitionAvailable: jest.fn(() => false),
     }));
     ```

     Este mock reproduce el contrato degradado documentado (callback corre
     exactamente una vez), así las aserciones existentes de
     `Uniwind.setTheme` + `setStoredTheme` siguen verdes sin relajarse.
   - Test nuevo del hook: `src/theme/__tests__/theme-transition.test.tsx`
     (patrón del proyecto: tests de theme en `src/theme/__tests__/`).
     `useReducedMotion` se mockea por caso
     (`jest.spyOn(require('react-native-reanimated'), 'useReducedMotion')` o
     `jest.mock` parcial, como prefiera el implementador) para cubrir R1 vs
     R3.

## Qué se testea en jest y qué queda para el gate humano

| Verificación | Dónde |
|---|---|
| R1 llamada a `withThemeTransition` con callback síncrono + `THEME_FADE` exacto | jest (mock) |
| R2 tema aplicado 1 vez + persistido + suite existente intacta | jest |
| R3 reduced motion → apply directo, `withThemeTransition` no llamado | jest (mock de `useReducedMotion`) |
| R4 camino degradado no lanza y no consulta availability | jest (mock degradado) + smoke Expo Go del humano (toggle instantáneo, sin crash) |
| R5 init.sh / CI verdes con las deps | `./init.sh` |
| R6 fade real visible sin crash | SOLO gate humano: dev build EAS en Android físico ([[requirements]] §Decisión del gate humano) |

El fade en sí **no es testeable en jest ni visible en Expo Go**: no hay
assertion posible sobre la animación nativa. Por eso R6 es un requisito de
verificación humana explícito, no una fila de test.

## Archivos afectados

- `mobile-pet-tracker/package.json` — deps nuevas + `transformIgnorePatterns`.
- `mobile-pet-tracker/bun.lock` — regenerado por `bun add`.
- `mobile-pet-tracker/src/theme/theme-transition.ts` — NUEVO: `THEME_FADE` +
  `useThemeTransition`.
- `mobile-pet-tracker/src/theme/__tests__/theme-transition.test.tsx` — NUEVO.
- `mobile-pet-tracker/src/screens/profile/index.tsx` — `onPress` del toggle
  delega en `switchTheme`; se elimina el import directo de `Uniwind`/
  `setStoredTheme` si queda sin otros usos.
- `mobile-pet-tracker/src/screens/profile/index.test.tsx` — mock degradado +
  aserciones nuevas de R1/R2 (las existentes no se relajan).

## Alternativas descartadas

- **Crossfade con Reanimated/JS** (overlay que fotografíe la pantalla): sin
  módulo nativo no hay snapshot de pantalla; remontar el árbol con opacidad
  animada duplica el render y jankea en JS thread — exactamente lo que la
  librería evita usando el render thread del OS.
- **`kind: 'circularReveal'` con `origin` del touch**: más vistoso, pero la
  descripción de #43 fija fade y esto es P3; ampliar kinds sería scope creep
  (queda en Fuera de alcance).
- **`expo run:android` local** para verificar el fade: prohibido por la
  decisión del humano 2026-08-20 (sin Android Studio ni builds locales); el
  camino es EAS cloud o descartar ([[requirements]] §Decisión del gate humano).
- **Esperar a una adopción general de dev builds**: pospone indefinidamente
  una feature ya P3; la decisión de invertir en el primer dev build (o no) es
  precisamente el gate humano de esta spec.
- **Manejar Reduce Motion dentro de la librería / con
  `AccessibilityInfo.isReduceMotionEnabled()`**: la librería lo delega a la
  app por diseño y la API de RN es asíncrona; `useReducedMotion()` de
  Reanimated da el valor síncrono y ya está en el proyecto.
