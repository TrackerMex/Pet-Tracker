---
feature: "mobile-theme-transition"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-theme-transition]] (feature #43)

> Disciplina TDD (C4 de CHECKPOINTS.md): **commits test-primero explícitos** —
> cada requisito deja historial rojo→verde (commit del test que falla, o test
> y fix en commits separados dentro de la misma tarea; nunca "todo en uno").
> Branch: `feature/43-mobile-theme-transition`. Convención de commit:
> `feat(mobile-theme): <desc> (R<n>)`.
>
> Prerrequisito: spec aprobada por humano CON una opción marcada en
> [[requirements]] §Decisión del gate humano. Si la opción marcada es
> **(b) descartar**, no se ejecuta ninguna tarea: se registra la decisión y se
> cierra la feature sin tocar código.

## R5 — Deps nitro + toolchain verde (primero: el resto importa el paquete)

- [ ] (1) Test rojo: en `src/theme/__tests__/theme-transition.test.tsx`, un
      `import { THEME_FADE } from '../theme-transition'` con aserción de shape
      exacto `{ kind: 'fade', durationMs: 400, settleFrames: 4 }` (R5/R1) —
      falla porque ni las deps ni el archivo existen.
- [ ] (2) Implementación mínima: `bun add react-native-nitro-theme-transition@1.0.0
      react-native-nitro-modules@0.37.0` desde `mobile-pet-tracker/`; añadir
      ambos paquetes a `transformIgnorePatterns`; crear `theme-transition.ts`
      con `THEME_FADE` exportado.
- [ ] (3) Refactor con tests verdes; `./init.sh` completo verde.

## R1 — `useThemeTransition` invoca el fade

- [ ] (1) Test rojo (mismo archivo, mock degradado de [[design]] §6): renderizar
      el hook (`renderHook` de @testing-library/react-native), llamar
      `switchTheme('dark')`, asertar `withThemeTransition` llamado una vez con
      (callback, `THEME_FADE`) y que ejecutar ese callback llama
      `Uniwind.setTheme('dark')`. Nombra R1.
- [ ] (2) Implementación mínima del hook.
- [ ] (3) Refactor con tests verdes.

## R3 — Reduced motion salta la animación

- [ ] (1) Test rojo: con `useReducedMotion` mockeado a `true`,
      `switchTheme('light')` aplica `Uniwind.setTheme('light')` y
      `withThemeTransition` NO es llamado. Nombra R3.
- [ ] (2) Implementación mínima (branch por `useReducedMotion()`).
- [ ] (3) Refactor con tests verdes.

## R4 — Degradación: tema y persistencia nunca dependen de la animación

- [ ] (1) Test rojo: con el mock degradado (`isThemeTransitionAvailable` →
      `false`), `switchTheme` aplica el tema exactamente una vez, llama
      `setStoredTheme` y no lanza; asertar además que
      `isThemeTransitionAvailable` no fue consultado. Nombra R4.
- [ ] (2) Implementación mínima.
- [ ] (3) Refactor con tests verdes.

## R2 — Toggle de Profile delega en el hook, comportamiento conservado

- [ ] (1) Test rojo: en `src/screens/profile/index.test.tsx` añadir el mock
      degradado del paquete y una aserción nueva: press en `theme-toggle` →
      `withThemeTransition` llamado (fade en camino no-reduced). Nombra R2.
      Las aserciones existentes (setTheme, setStoredTheme, labels) NO se tocan.
- [ ] (2) Implementación mínima: `onPress` usa `switchTheme` del hook;
      limpiar imports muertos del screen.
- [ ] (3) Refactor con tests verdes; suite completa de profile verde.

## R6 — Gate humano (sin código; lo ejecuta el humano tras el merge del PR)

- [ ] Humano: pasos 1-5 de [[requirements]] §Decisión del gate humano opción
      (a) — `eas login`, `eas init`, `eas build --profile development
      --platform android` sobre la branch con las deps, instalar APK, verificar
      fade sin crash. Smoke Expo Go adicional: toggle sigue instantáneo y sin
      crash (R4).
- [ ] Humano: registrar decisión mantener/descartar en [[requirements]]
      (§Decisión, registro final) — el leader la refleja en
      `feature_list.json`.
- [ ] Si el build falla por nitro (criterio de [[requirements]] §Criterio de
      salida): revert de deps + `theme-transition.ts` + cambios de profile en
      la misma branch, cerrar como descartada. Máximo 1 reintento de build.
