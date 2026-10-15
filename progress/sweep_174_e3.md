# sweep_174_e3: tests que montan la pantalla de Alertas y no tienen doble de reanimated

Fecha: 2026-10-15
Alcance: solo lectura, más una corrida aislada de `alert-detail.navigation.test.tsx` sobre el árbol de Codex (HEAD `be884964` + el cambio de c8 sin commitear). Rutas relativas a `mobile-pet-tracker/`.
Causa medida: `Uncaught error: TypeError: (0 , _reactNativeReanimated.useReducedMotion) is not a function`. `PopIn` (`src/components/pop-in.tsx`) y `HomeEntrance` (`src/screens/home/home-entrance.tsx`) llaman a `useReducedMotion()`; el mock de reanimated de jest (`node_modules/react-native-reanimated/src/mock.ts`, línea `// useReducedMotion: ADD ME IF NEEDED`) no lo exporta.
Corrección al barrido de E2: su fila 13 dio `alert-detail.navigation` por verde sin ejecutarlo. Era falso.

## Método

`grep` de `AlertsRoute`, `screens/alerts`, `from '../alerts'` y `require(…alerts…)` en todos los `*.test.ts(x)`, y lectura de cada hit para ver si monta la pantalla real o un stub.

## Montan la pantalla real (necesitan doble)

| # | Fichero | Cómo la monta | Doble hoy | Corrección |
|---|---|---|---|---|
| 1 | `src/app/__tests__/alert-detail.navigation.test.tsx` | `import AlertsRoute from '../alerts'` en el `walk` de rutas; `router.push('/alerts')` con dos alertas sin leer | ninguno de `react-native-reanimated` ni de `pop-in` | E3.1: `jest.mock('react-native-reanimated', …)` con `useReducedMotion: () => false`. Cubre R4 (c8) y R10 (c20) con un solo bloque |

## No la montan (sin cambio)

- `src/screens/alerts/index.test.tsx`: monta la pantalla real, ya dobla `PopIn` (`mockPopIn`); R10 añade `mockHomeEntrance` (c19, ya en la spec).
- `src/app/(tabs)/__tests__/alerts.test.tsx`: `jest.mock('../../../screens/alerts', …)`.
- `src/app/__tests__/{alert-detail.notification,reminders-alerts-stack.navigation,reminders-alerts-stack.notification,detail-stack.guard}.test.tsx`: su `walk` pinta `<Text>{key}</Text>` o un stub para `alerts`; no importan `AlertsRoute`.
- `src/hooks/use-push-registration{,.navigation}.test.tsx`: `Alerts` es un componente local con `testID="alerts-route"`.
- `src/app/__tests__/detail-stack.test.tsx` y `src/components/__tests__/empty-state.test.tsx`: solo leen rutas o el fichero como texto.
- `src/__tests__/{design-drift,consistency-classnames,profile-canvas-fidelity,ui-language}.test.ts`: leen el fichero como texto (ya barridos en E2).
- `src/screens/home/index.test.tsx` y `src/components/__tests__/floating-tab-bar.test.tsx`: nombran `alerts` como ruta o clave, no montan la pantalla.
