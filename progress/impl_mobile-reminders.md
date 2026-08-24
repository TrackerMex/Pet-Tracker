# Implementación — feature #39 mobile-reminders

Fecha: 2026-08-24
Branch: `feature/39-mobile-reminders`
Estado: implementación terminada; lista para reviewer y smoke humano, aún
`in_progress`.

## Resultado

- Se añadió el cliente móvil tipado para listar, crear y borrar recordatorios,
  siguiendo el contrato `fetchFn`/`kind` y sin dependencias de React o
  SecureStore en `src/api/`.
- La pantalla `Reminders` permite cambiar de mascota, representa loading,
  error, vacío y resultados, resume recordatorios por periodo, recarga al
  recuperar foco y confirma el borrado real con degradación por `kind`.
- La pantalla `Add reminder` ofrece los siete tipos, título, pickers nativos de
  fecha y hora, antelación y validación local; un alta correcta vuelve a la
  lista.
- Las rutas `reminders.tsx` y `add-reminder.tsx` son wrappers de cinco líneas;
  Profile conserva su contenido y solo incorpora el enlace mínimo
  `reminders-link`.
- Se instaló exclusivamente `@react-native-community/datetimepicker@9.1.0`
  mediante `bunx expo install`; Expo registró además su plugin en `app.json`.
  No se añadió `expo-notifications`.

## TDD y trazabilidad

| Requisito | Rojo | Verde |
|---|---|---|
| R1 | `377cdef test(mobile-reminders): define reminder listing in red (R1)` | `8e6ae26 feat(mobile-reminders): list reminders by pet (R1)` |
| R2 | `9ecd3c5 test(mobile-reminders): define reminder creation in red (R2)` | `e7b8c5c feat(mobile-reminders): create reminders (R2)` |
| R3 | `0cac973 test(mobile-reminders): define reminder deletion in red (R3)` | `1bf95a9 feat(mobile-reminders): delete reminders (R3)` |
| R4 | `4e39f3d test(mobile-reminders): define reminder dates in red (R4)` | `d0b9d92 feat(mobile-reminders): add reminder date helpers (R4)` |
| R5 | `847996a test(mobile-reminders): define reminders screen states in red (R5)` | `bb40613 feat(mobile-reminders): add reminder list states (R5)` |
| R6 | `b6621a2 test(mobile-reminders): define reminder rows in red (R6)` | `16940ae feat(mobile-reminders): render reminder summaries and rows (R6)` |
| R7 | `70c645a test(mobile-reminders): define reminder deletion UI in red (R7)` | `c343cb8 feat(mobile-reminders): delete reminders from list (R7)` |
| R8 | `cb2b566 test(mobile-reminders): define add reminder form in red (R8)` | `50ec673 feat(mobile-reminders): add reminder form and native pickers (R8)` |
| R9 | `7ff5114 test(mobile-reminders): define reminder submission in red (R9)` | `7eaed26 feat(mobile-reminders): submit reminder form (R9)` |
| R10 | `43d3e5f test(mobile-reminders): define profile reminder link in red (R10)` | `716d604 feat(mobile-reminders): expose reminder routes from profile (R10)` |

Cada rojo se ejecutó y falló antes de su implementación. Después de cada verde
se actualizaron `tasks.md` y `traceability.md`. La primera ejecución de la suite
completa descubrió que el import estático de Expo Router rompía el smoke
histórico de rutas; `6f0cc05` dejó el import de navegación diferido, conservó
ese test y eliminó las advertencias de lint de la feature.

## Verificación R11

- `bun run test -- --runInBand --silent`: 36/36 suites y 423/423 tests.
- `bun run typecheck`: exit 0.
- `bun run lint`: exit 0, sin errores ni warnings.
- `./init.sh`: exit 0 y mensaje `Todo verde`; ejecutó build, tests backend
  (145 suites, 1114 tests), infra (2 suites, 14 tests), harness (28 tests),
  móvil (36 suites, 423 tests), e2e (20 suites y 327 tests pasados; 2 suites y
  6 tests omitidos por su gate de entorno), lint y typecheck.
- `git diff --stat origin/main...HEAD -- backend-pet-tracker infra`: vacío.
- El diff de `mobile-pet-tracker/package.json` contiene solo
  `@react-native-community/datetimepicker@9.1.0` como dependencia nueva.
- `_layout.tsx` y `floating-tab-bar.tsx` no tienen diff; las dos rutas nuevas
  tienen cinco líneas cada una.
- Los greps de `expo-notifications`, imports de React/SecureStore en el cliente
  API, `StyleSheet` y colores hexadecimales en los screens de la feature no
  devolvieron coincidencias.

Warnings no bloqueantes ya presentes: AWS SDK anuncia el futuro requisito de
Node >=22; las suites móviles imprimen avisos de tokens de tema. Ninguno cambia
el exit code. `STATUS.md` conserva el aviso 37/46 vs 39/47 porque el cierre de
bookkeeping corresponde al reviewer después de R12.

## Pendiente R12

El smoke de los diez pasos en Expo Go debe ejecutarlo el humano. No se marca
R12, la feature no pasa a `done` y la trazabilidad permanece pendiente hasta
que ese gate se complete.

## Rework R8 post-review — Expo UI DateTimePicker

Decisión humana aplicada el 2026-08-24:

- El test ajustado se ejecutó primero contra la implementación anterior:
  11 fallos y 6 tests pasados. El rojo quedó aislado en
  `8042a80 test(mobile-reminders): define Expo UI picker swap in red (R8)`.
- `AddReminderScreen` usa ahora el drop-in
  `@expo/ui/community/datetime-picker`; los árboles de fecha y hora están
  envueltos en `Host` importado desde `@expo/ui`, con
  `presentation="dialog"`, `onValueChange` y `onDismiss`.
- Se conservan todos los testIDs y contratos accesibles de R8. El test añade
  cobertura del `Host`, de la selección y del cierre por dismiss; el verde
  quedó en `02f02ae fix(mobile-reminders): use Expo UI native pickers (R8)`.
- El manifest instalado de `@expo/ui@57.0.11` no contiene
  `@react-native-community/datetimepicker` en `dependencies` ni en
  `peerDependencies`. `bun pm why` confirmó que era solo una dependencia
  directa de la app. Expo validó la versión replacement mediante
  `bunx expo install '@expo/ui@~57.0.11' --bun`; como Expo CLI no ofrece
  subcomando uninstall, Bun retiró la dependencia directa. También se
  eliminaron su entrada de `bun.lock` y su config plugin de `app.json`.
- La documentación y la fila R8 se actualizaron en
  `254dda2 docs(mobile-reminders): trace Expo UI picker rework (R8)`.

Verificación final:

- Test focal R8/R9: 1 suite, 17/17 tests.
- `bun run test -- --runInBand --silent`: 36/36 suites, 424/424 tests.
- `bun run typecheck`: exit 0.
- `bun run lint`: exit 0, sin warnings.
- `bunx expo export --platform android`: bundle correcto de 5.265 módulos;
  resolvió los assets de `@expo/ui`. Junto con la marca oficial “Included in
  Expo Go” para el drop-in de SDK 57, conserva el flujo 100% Expo Go.
- `./init.sh`: exit 0 y mensaje `Todo verde`; e2e 20 suites y 327 tests
  pasados (2 suites/6 tests omitidos por gate de entorno).
- Los diffs de `backend-pet-tracker/` e `infra/` contra `origin/main` están
  vacíos. `mobile-pet-tracker/package.json` queda sin diff de dependencias
  contra `origin/main`; los greps de
  `@react-native-community/datetimepicker` y `expo-notifications` bajo la app,
  excluyendo `node_modules`, no devuelven coincidencias.

R12 sigue pendiente del smoke del humano en un dispositivo físico con Expo
Go; no se cambia el estado `in_progress` ni se ejecuta el cierre de feature.
