---
feature: "mobile-theme-transition"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-theme-transition]] (feature #43, P3)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas (API exacta de la librería, mocks
> de jest, config) y [[traceability]] para el test que prueba cada R-id.
>
> **Restricciones globales de esta feature**:
> - Polish 100% prescindible (P3). El toggle light/dark de #40 ya funciona sin
>   fade; esta feature solo añade el fade nativo. Si algo rompe, la salida
>   prevista es descartar (ver §Criterio de salida).
> - `react-native-nitro-theme-transition` es **código nativo**: el fade solo es
>   visible en un **dev build**, nunca en Expo Go. El smoke del humano es SOLO
>   Expo Go (decisión 2026-08-20: sin Android Studio, sin dev builds locales) —
>   por eso el camino de verificación del fade es una **decisión del gate
>   humano** (ver §Decisión del gate humano), no del implementador.
> - En Expo Go / jest / web la librería **degrada a cambio de tema instantáneo
>   sin crash** (garantía documentada: "applyTheme runs exactly once in every
>   path"; verificada contra el README de npm el 2026-08-25). El smoke Expo Go
>   actual no se ve afectado.
> - Cumple `docs/ui-guidelines.md` (C8 de CHECKPOINTS.md): duración de la carta
>   (400ms superficie grande), reduced motion respetado, cero hex fuera de
>   `src/theme/`.

## Requisitos funcionales

- **R1 — Fade nativo en el toggle**: WHEN el usuario pulsa el botón
  `theme-toggle` de la pantalla Profile y "reducir movimiento" del sistema está
  inactivo, THE SYSTEM SHALL invocar `withThemeTransition` de
  `react-native-nitro-theme-transition` con (1) un callback **síncrono** que
  ejecuta exactamente `Uniwind.setTheme(next)` — donde `next` es el tema
  opuesto al activo — y (2) el objeto de opciones exportado
  `THEME_FADE = { kind: 'fade', durationMs: 400, settleFrames: 4 }` desde
  `mobile-pet-tracker/src/theme/theme-transition.ts`.

- **R2 — Persistencia y comportamiento conservado**: WHEN el cambio de tema se
  dispara desde el toggle (con o sin animación), THE SYSTEM SHALL aplicar el
  nuevo tema **exactamente una vez**, persistirlo vía `setStoredTheme(next)`
  (`src/utils/theme-preference.ts`), y conservar el comportamiento existente de
  la pantalla: testID `theme-toggle`, label "Use light theme"/"Use dark theme"
  según tema activo — la suite existente
  `src/screens/profile/index.test.tsx` sigue verde sin relajar aserciones.

- **R3 — Reduced motion**: WHILE el usuario tiene "reducir movimiento" activo
  a nivel de sistema (`useReducedMotion()` de `react-native-reanimated`
  devuelve `true`), THE SYSTEM SHALL aplicar el cambio de tema de forma
  instantánea ejecutando el callback directamente, **sin invocar**
  `withThemeTransition`. (La librería documenta explícitamente que NO maneja
  Reduce Motion; la carta de UI lo exige.)

- **R4 — Degradación sin módulo nativo**: WHILE la app corre en un runtime sin
  el módulo nativo (Expo Go, jest, web), THE SYSTEM SHALL completar el cambio y
  la persistencia del tema de forma instantánea sin lanzar excepción; el código
  de la app SHALL NOT condicionar el cambio de tema al resultado de
  `isThemeTransitionAvailable()` (la degradación es responsabilidad de la
  librería y el cambio de tema nunca depende de la animación).

- **R5 — Toolchain verde con nitro instalado**: WHEN `./init.sh` o CI se
  ejecuta con `react-native-nitro-theme-transition@1.0.0` y
  `react-native-nitro-modules@0.37.0` declarados en
  `mobile-pet-tracker/package.json`, THE SYSTEM SHALL terminar verde
  (install, lint, typecheck y jest vía bun), con ambos paquetes añadidos al
  whitelist de `transformIgnorePatterns` de jest.

- **R6 — Fade verificado en dev build (gate humano)**: WHEN el humano pulsa el
  toggle de tema en el dev build EAS instalado en su Android físico, THE
  SYSTEM SHALL mostrar el fade (~400ms) sin crash, y la decisión
  mantener/descartar SHALL quedar registrada en §Decisión del gate humano de
  este archivo y reflejada en `feature_list.json`. Este requisito solo puede
  cerrarlo el humano (no hay test automatizable).

## Fuera de alcance

- Otros `kind` de transición (circularReveal, ripple, etc.) y el `origin`
  desde el punto de toque — el alcance de #43 es solo `fade`.
- Animar la aplicación del tema inicial en `src/app/_layout.tsx` (ocurre antes
  del primer render, tras el gate `themeReady`; no hay nada que transicionar).
- Fade en web (la librería es no-op en web por diseño).
- Seguir el tema del sistema (modo "automatic") — el toggle manual de #40 se
  mantiene tal cual.
- Cualquier build o recurso que cueste dinero ejecutado por una IA: el build
  EAS lo lanza el humano (regla de CLAUDE.md §Excepciones).

## Decisión del gate humano — camino de verificación del fade

El fade NO puede verificarse en Expo Go (código nativo). El humano debe marcar
**una** opción al aprobar esta spec; sin opción marcada la spec no está
aprobada y la feature no pasa a `in_progress`:

Ya estamos corriendo la app en android, de aqui en adelante se va utilzar correr en android para verificar el fade en la app real.

- [ ] **(a) Dev build vía EAS cloud** (sin Android Studio local, compatible
  con la decisión 2026-08-20). Pasos, todos ejecutados por el humano desde
  `mobile-pet-tracker/` en la branch de la feature (con las deps nitro ya
  añadidas — un dev build anterior NO contiene el módulo):
  1. `eas login` (requiere cuenta Expo).
  2. `eas init` — el proyecto aún no está linkeado (no hay
     `extra.eas.projectId` en `app.json`); este paso lo añade.
  3. `eas build --profile development --platform android` (perfil
     `development` de `eas.json`, creado en #32: `developmentClient: true`,
     `distribution: internal`, bun 1.3.14). El build corre en la nube de EAS
     (el free tier de EAS incluye builds Android; colas/costes son del humano).
  4. Instalar el APK resultante en el Android físico y correr
     `bunx expo start` para conectar el dev client.
  5. Verificar R6 y registrar la decisión mantener/descartar abajo.
- [ ] **(b) Descartar la feature** sin implementar (o tras fallo de build):
  queda el toggle sin fade de #40, salida ya prevista en la descripción de
  #43. Se registra la decisión abajo y en `feature_list.json` y no se toca
  código. 

Registro de la decisión final (rellena el humano al cerrar el gate):

- Fecha: 2026-08-26
- Resultado: mantener / descartar — mantener
- Evidencia (build id de EAS, dispositivo, observaciones): dispositivo android note que las animaciones no se hace como lo muestra en el prototipo de la libreria

## Criterio de salida — riesgo reactCompiler / build nativo roto

`app.json` tiene `experiments.reactCompiler: true` (experimental). Riesgo
conocido de #43: interacción de nitro-modules con ese flag o con el build
nativo (SDK 57 es New Architecture only; nitro-modules la requiere — a favor,
pero el riesgo queda hasta ver un build verde).

Si el build EAS de development **falla con las deps nitro y pasa sin ellas**
(o el dev build crashea al abrir, criterio de aceptación 1):

1. La feature se cierra como **descartada**: se revierten los cambios de
   `package.json`/`bun.lock` y el código de `theme-transition.ts`, quedando el
   toggle sin fade de #40 intacto.
2. La decisión se registra en §Decisión del gate humano y en
   `feature_list.json` (description anotada "descartada <fecha>: <motivo>",
   status `done` al cerrar el ciclo con esa nota).
3. No se invierte en diagnóstico profundo: es polish P3 100% prescindible; un
   (1) reintento de build tras leer el log de error es el máximo esfuerzo
   previsto antes de descartar. No se desactiva `reactCompiler` para salvar
   esta feature (el flag pertenece al proyecto, no a este polish).

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-26) ← gate obligatorio antes de implementar
      (incluye marcar UNA opción en §Decisión del gate humano)
