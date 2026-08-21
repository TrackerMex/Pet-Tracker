# Implementación — mobile-home-dashboard (#35)

- Fecha: 2026-08-21
- Branch: `feature/35-mobile-home-dashboard`
- Alcance de Codex: R1–R12
- Estado: R1–R12 implementados y verificados; R13 queda pendiente del smoke
  humano con Expo Go en Android físico.

## Resultado

- `src/api/pets.ts` y `src/api/activity.ts` implementan clientes GET puros con
  `fetchFn` inyectable, bearer token, URL saneada y estados discriminados por
  `kind`. El 402 de actividad se modela como `no-tracking`, no como error.
- `src/api/types.ts` contiene los contratos manuales ratificados en D11. No se
  añadió codegen OpenAPI, `src/api/devices.ts` ni ninguna dependencia.
- `useApi` mantiene carga, refetch y guard de carrera sin cache; cualquier
  resultado `unauthorized` ejecuta el `signOut` global.
- `SelectedPetProvider` comparte exclusivamente `selectedPetId` y `selectPet`
  entre tabs, sin storage ni fetch dentro del context.
- Home carga las mascotas reales, selecciona la primera válida y permite
  cambiar entre ellas. La pantalla presenta estados loading/error/retry/empty.
- La pet card muestra foto o inicial, nombre y raza; la collar card distingue
  Free, Online y Offline y conserva batería ausente como `—`.
- Today's Summary usa la última entrada de `days`, formatea actividad, descanso
  y distancia, conserva toda métrica `null` como `—` y degrada 402/error con
  notas específicas.
- La card de última posición solo aparece con collar, informa el último contacto
  o la ausencia de datos y navega a `/map` sin mini-mapa.
- El padding inferior dinámico usa `style` inline; no se usaron utilidades
  `left-*`, `right-*` o `bottom-*` de uniwind.

## Evidencia TDD y commits de implementación

| R-id | Rojo | Verde / implementación |
|---|---|---|
| R1 | `9a5d592` | `baf5f64` |
| R2 | `2a09620` | `6983a75` |
| R3 | `43fac2d` | `f9ba3cc` |
| R4 | `d054d82` | `66a8057` (refactor lint-safe `f57323a`) |
| R5 | `0f909aa` | `cb91276` |
| R6 | `1af4eda` | `bfeb8a7` |
| R7 | `d51a437` | `97c9167` |
| R8 | `27da0de` | `8375941` |
| R9 | `c374bfa` | `747938e` |
| R10 | `894554b` | `19f48d3` |

Cada commit rojo precede al verde correspondiente. La retirada del caso Home
de `screens.test.tsx` y el montaje del provider en `(tabs)/_layout.tsx` siguen
las excepciones C4 aprobadas en `requirements.md`; los asserts heredados de
las otras tabs y de los guards permanecen intactos.

## Verificación R11

- `bun run --cwd mobile-pet-tracker typecheck`: exit 0.
- `bun run --cwd mobile-pet-tracker lint`: exit 0.
- `useApi` tiene 26 líneas no vacías dentro del cuerpo de la función y no
  incorpora react-query ni cache.

## Verificación R12

- Suite móvil completa: 18 suites, 129 tests, todos verdes mediante
  `bun run --cwd mobile-pet-tracker test --runInBand --silent`.
- `./init.sh`: exit 0 y mensaje `Todo verde`.
  - backend: 143 suites, 1111 tests;
  - infra: 2 suites, 14 tests;
  - harness env drift: 11 suites, 28 tests;
  - móvil: 18 suites, 129 tests;
  - build, lint y typecheck: verdes.
- E2E: omitidos por el harness porque LocalStack no respondía en el puerto
  4566; mobile-home-dashboard no requiere recursos AWS para sus tests.
- `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/`
  devolvió salida vacía.
- `mobile-pet-tracker/package.json` y `mobile-pet-tracker/bun.lock` no tienen
  diff contra `main`; cero dependencias nuevas.
- Greps de contención: sin imports de React o `expo-secure-store` bajo
  `src/api/`; sin `StyleSheet.create`, colores hex ni utilidades de offsets
  absolutos en el código nuevo de Home.
- `git diff --check main...HEAD`: exit 0.

## Pendiente humano

- R13: ejecutar exactamente los pasos 1–8 de `requirements.md` con Expo Go en
  un Android físico, incluyendo mascotas con/sin collar, cambio de selector,
  datos ausentes y recuperación mediante Retry.
- La feature permanece `in_progress` y no se marca `done` antes de ese gate y
  la revisión posterior.

## Estado del worktree

Los cambios locales preexistentes en `.gitignore`, `init.sh`,
`init.config.sh`, `.agents/`, skills y `skills-lock.json` se preservaron y no
se incluyeron en los commits de mobile-home-dashboard.

## Fixes post-smoke (2026-08-21)

Reporte del humano tras smoke R13 en Android físico (Expo Go):

1. **Título "Home" pegado a la barra de estado** — `home.tsx` aplicaba
   `paddingBottom` con insets pero no `paddingTop`. Fix: `paddingTop:
   insets.top + 12` en el `contentContainerStyle`. Test rojo `84a7762`,
   verde `4e93518` (R6).
2. **Flash al cambiar de mascota** — `useApi` reseteaba `data` a `undefined`
   al cambiar la identidad de `fn` o en `refetch`, desmontando las cards un
   instante. Fix: stale-while-revalidate mínimo en `use-api.ts` (conserva el
   último valor resuelto y expone `isRefreshing`); el skeleton de home solo
   aparece en la carga inicial sin data previa. Los datos de la mascota
   anterior se muestran un instante durante el refresco (estándar y
   aceptado en el reporte). Sin dependencias nuevas. Test rojo `f896be3`,
   verde `028ba86` (R4,R9).

Verificación: `bun run test` 132/132 verdes (18 suites), `bun run lint`
exit 0, `bun run typecheck` exit 0. Solo se tocaron `home.tsx`,
`use-api.ts` y sus tests.
