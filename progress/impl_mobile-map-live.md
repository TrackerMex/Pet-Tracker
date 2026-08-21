# Implementación — mobile-map-live (#36)

- Fecha: 2026-08-21
- Branch: `feature/36-mobile-map-live`
- Alcance de Codex: R1–R12
- Estado: R1–R12 implementados y verificados; R13 queda pendiente del smoke
  humano con Expo Go en Android físico.

## Resultado

- Se instaló la única dependencia aprobada, `react-native-maps` **1.27.2**
  exacta, mediante el instalador de Expo. No se añadieron `expo-maps`,
  react-query ni TanStack Query.
- `src/api/types.ts` amplía los contratos manuales con `LastPosition`,
  `StoredPosition`, `TripPoint`, `TripSummary` y `TripDetail`.
- `src/api/positions.ts` implementa `getLastPosition` y `listPositions` con
  `fetchFn` inyectable, bearer token, saneo de URL vía `getJson`, estados por
  `kind`, 402 como `no-tracking` y soporte explícito de posición `null`.
- `src/api/trips.ts` implementa `getDayRoute`: lista los trips de hoy sin query
  string, solicita los detalles en paralelo con `Promise.all`, incorpora sus
  paths y devuelve los trips ordenados por `index`.
- Map resuelve la mascota compartida o selecciona la primera válida, y cubre
  loading, lista vacía, error/retry y mascota free sin montar el mapa.
- El mapa usa `MapView` fullscreen, marker de última posición, región default
  CDMX sin datos y una `Polyline` por trip del día.
- Las stats muestran velocidad del último punto de la ventana, distancia total
  del día, antigüedad calculada por el backend y estado GPS Live/Stale/No
  signal. La ruta degrada de forma independiente a distancia `—`.
- `useFocusEffect` refresca last position y positions cada 15 s, refresca la
  ruta al enfocar y limpia el intervalo al perder foco o desmontar. `useApi`
  conserva el marker durante el refetch.
- El botón `Activate Lost Mode` está visible pero deshabilitado, con
  `accessibilityState.disabled` y el subtexto `Coming soon`; no existe handler.
- Todos los offsets absolutos están en `style` inline. El componente no usa
  `StyleSheet.create`, colores hex ni utilidades `left-*`/`right-*`/`bottom-*`.

## Evidencia TDD y commits

| R-id | Rojo | Verde / implementación |
|---|---|---|
| R1 | `57f354b` | `df5050f` |
| R2 | `b19f588` | `251eaa0` |
| R3 | `8632ced` | `43e4c37` (ajuste de checks `89ff665`) |
| R4 | `adc60d8` | `a152202` |
| R5 | `ff964cd` | `60d8195` |
| R6 | `a63d4e0` | `63815e3` |
| R7 | `d12ba6b` | `3095eea` |
| R8 | `3e243f2` | `55ca25c` |
| R9 | `fc26c4d` | `9375e10` (timer estable `f1f5489`, checks `89ff665`) |
| R10 | `86db2ff` | `cbe518c` |

Cada commit rojo precede al verde correspondiente. La retirada del caso Map
de `screens.test.tsx` es exactamente la excepción C4 aprobada; Food, Profile y
el resto de la suite heredada permanecen intactos.

## Verificación R11

- `bun run --cwd mobile-pet-tracker typecheck`: exit 0.
- `bun run --cwd mobile-pet-tracker lint`: exit 0, sin warnings.
- Suites específicas nuevas: 3 suites, 62 tests, todos verdes.

## Verificación R12

- Suite móvil completa mediante
  `bun run --cwd mobile-pet-tracker test --runInBand --silent`: **21 suites,
  193 tests**, todos verdes.
- `./init.sh`: exit 0 y mensaje `Todo verde`.
  - backend: 143 suites, 1111 tests;
  - infra: 2 suites, 14 tests;
  - harness env drift: 11 suites, 28 tests;
  - móvil: 21 suites, 193 tests;
  - build, lint y typecheck: verdes.
- E2E: omitidos por el harness porque LocalStack no respondía en el puerto
  4566; los tests de esta feature no requieren recursos AWS.
- `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/`
  devolvió salida vacía.
- El grep de `expo-secure-store` e imports de React bajo
  `mobile-pet-tracker/src/api/` devolvió salida vacía.
- `react-native-maps` está pinneado en `1.27.2`; los checks de dependencias
  confirmaron que `expo-maps`, `react-query` y `@tanstack/react-query` no están.
- `git diff --check main...HEAD`: exit 0.
- El grep de `StyleSheet.create`, hex y offsets uniwind sobre `map.tsx` no
  encontró resultados.

## Pendiente humano

- R13 no fue ejecutado ni modificado. El humano debe completar los pasos 1–9
  de `requirements.md` en Expo Go con Android físico y collar real o SIM_MODE.
- La feature permanece `in_progress`; no se marca `done` antes del smoke y la
  revisión humana.
- `init.sh` avisa que `STATUS.md` aún declara 34/44 frente a 34/45 después del
  alta de #45 en la spec. No se actualizó durante este handoff porque #36 no se
  cierra hasta R13.

## Estado del worktree

Se preservaron y excluyeron de todos los commits los cambios locales
preexistentes en `.gitignore`, `init.sh`, `init.config.sh`, `.agents/`, skills,
`skills-lock.json` y `progress/review_mobile-home-dashboard.md`.
