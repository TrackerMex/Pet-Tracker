# Implementación — mobile-tab-glass (#50)

- Fecha: 2026-08-25
- Branch: `feature/50-mobile-tab-glass`
- Estado: R1–R7 implementados y verificados; pendiente de review independiente.
- PR: no abierto, por instrucción expresa del handoff.

## Resultado

- La barra usa `GlassView` regular cuando Liquid Glass está disponible y el
  fallback explícito `BlurView` + overlay translúcido en el resto de runtimes.
- El fallback respeta el tema light/dark de uniwind y usa exactamente
  `intensity={80}` y `blurMethod="dimezisBlurViewSdk31Plus"`.
- Los nuevos tokens `glass-surface` y `tab-pill` existen en las variantes
  light y dark de `src/theme/global.css`.
- El indicador pill se crea solo después de conocer el ancho del contenedor,
  usa la geometría fijada por la spec y se mueve mediante un shared value y
  `useAnimatedStyle`.
- Los cambios de tab retargetean el mismo `withSpring` interruptible con
  `duration: 250`, `dampingRatio: 1` y `ReduceMotion.System`.
- Las escenas de Tabs usan `animation: 'fade'`, sin `transitionSpec` propio.
- Se conservan navegación, eventos prevenibles, accesibilidad, orden de tabs y
  offsets de safe area de la barra existente.
- La carta C8 queda protegida con un test genérico contra clases Tailwind
  arbitrarias. Las dos ocurrencias preexistentes `size-[72px]` de Home se
  reemplazaron por la clase equivalente `size-18`.

## Evidencia TDD

| Requisito | Test rojo | Implementación verde |
|---|---|---|
| R1 | `7e60fa6` | `de26438` |
| R2 | `5ebd84f` | `b75e8bf` |
| R3 | `bbe4052` | `409c02d` |
| R4 | `b0aa293` | `9f0cb15` |
| R5 | `806989b` | `f00d207` |
| R6 | `757dcec` | `3da2d36` |
| R7 | suite heredada (`9f7d634`→`e306135`, `f30952c`→`cf99e35`) | regresión completa estabilizada en `ce9d2b0` |
| C8 | `d065acd` | `cdf4c87` |

Cada test rojo se commiteó antes de su implementación. La trazabilidad exacta
por nombre de test y commit está completa en
`specs/mobile-tab-glass/traceability.md`, sin filas pendientes.

## Archivos principales

- `mobile-pet-tracker/src/components/floating-tab-bar.tsx` y su test: fondos
  glass/blur, pill, spring, reduced motion y regresión R7.
- `mobile-pet-tracker/src/app/(tabs)/_layout.tsx`, su test heredado y
  `src/app/__tests__/tabs-layout.test.tsx`: transición fade R6.
- `mobile-pet-tracker/src/theme/global.css` y su test: tokens R2/R3.
- `mobile-pet-tracker/src/__tests__/design-drift.test.ts` y
  `src/app/(tabs)/home.tsx`: guard C8 y eliminación de clases arbitrarias.
- `specs/mobile-tab-glass/{tasks,traceability}.md`: cierre de tareas y
  trazabilidad R1–R7.

No hay diff en `mobile-pet-tracker/package.json` ni en su lockfile:
`expo-glass-effect@~57.0.1` y `expo-blur@~57.0.2` ya estaban instaladas. No se
tocó `backend-pet-tracker/`, no se crearon recursos AWS y no hay variables de
entorno nuevas versionadas.

## Verificación

- Suite móvil final: 39 suites, 458 tests, todos verdes.
- `npm run lint` en la app móvil: exit 0.
- `npm run typecheck` en la app móvil: exit 0.
- Grep C8 en código de producción: cero hex fuera de `src/theme/`, cero
  clases `[...]`, cero `StyleSheet.create` y cero propiedades legacy de
  shadow/elevation.
- `git diff --check`: exit 0.
- `./init.sh`: exit 0, mensaje `Todo verde`:
  - backend: 145 suites / 1114 tests;
  - infraestructura: 2 suites / 14 tests;
  - harness env-drift: 28 tests;
  - móvil: 39 suites / 458 tests;
  - e2e: 20 suites ejecutadas / 327 tests verdes; 2 suites y 6 tests
    omitidos por sus gates existentes;
  - build, lint y typecheck: verdes.

## Notas para el reviewer

- La primera ejecución local de `init.sh` encontró el puerto 5432 ocupado por
  otro Postgres. El `.env` ignorado se apuntó al Postgres del proyecto ya
  publicado en 5433; no hay cambio versionado de configuración.
- El handoff nombraba las skills `expo-native-ui` y `expo-animation`, pero no
  estaban expuestas en esta sesión de Codex. Se siguieron directamente la spec
  aprobada, sus mocks exactos y `docs/ui-guidelines.md`; no se improvisaron APIs
  ni dependencias.
- #50 permanece `in_progress` hasta el veredicto del reviewer; el implementador
  no la marca `done`.
