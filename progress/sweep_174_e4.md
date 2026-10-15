# sweep_174_e4: tests que importan `expo-router/testing-library` y doblan reanimated

Fecha: 2026-10-15
Alcance: solo lectura, más corridas aisladas del route test en copias desechables sobre el árbol de Codex (HEAD `bbc92473` + c8 y el c7b de E3.1 sin commitear). Rutas relativas a `mobile-pet-tracker/`.

## Causa medida

`expo-router/testing-library` hace `require("./mocks")` al importarse; `node_modules/expo-router/build/testing-library/mocks.js` registra `jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock') …)`. Eso pisa el `jest.mock('react-native-reanimated', …)` hoisteado del fichero de test (E3.1). Evidencia de las sondas: la fábrica de E3.1 no se ejecutó (su `console.log` no salió), `require('react-native-reanimated').useReducedMotion` era `undefined` (156 claves) y `require('react-native-reanimated') === jest.requireActual('react-native-reanimated')` daba `false`.

## Qué funciona (medido)

| Variante del doble en `alert-detail.navigation.test.tsx` | Resultado |
|---|---|
| E3.1: `jest.mock('react-native-reanimated', …)` | `Tests: 1 failed`, `TypeError … useReducedMotion is not a function` |
| E4.1: `jest.mock('react-native-reanimated/mock', …)` | `Tests: 1 passed, 1 total`; `tsc --noEmit` 0 errores; `eslint --no-cache` sin salida |

## Barrido

`grep -rlF "expo-router/testing-library" src` cruzado con `grep -E "jest\.mock\('react-native-reanimated'"`: **un solo fichero**, `src/app/__tests__/alert-detail.navigation.test.tsx`. Los otros siete ficheros con doble de reanimated (`pop-in`, `empty-state`, `celebration`, `pet-hero-header`, `weight-chart`, `theme-transition`, `pingo-float`) no importan `expo-router/testing-library`, así que su doble sigue vivo. `PopIn` (`src/components/pop-in.tsx:26`) y `HomeEntrance` (`src/screens/home/home-entrance.tsx:39`) importan `useReducedMotion` de `react-native-reanimated`, el mismo módulo que cubre el subpath `/mock`.

El barrido de pantallas que montan Alertas (`progress/sweep_174_e3.md`) no cambia: solo ese route test la monta de verdad.
