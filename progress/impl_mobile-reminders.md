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

## R12 — hallazgo del smoke humano y rework pre-cierre

El smoke humano de 2026-08-24 llegó al paso 8 y detectó que, al cambiar de
mascota, `Reminders` mantenía visibles los recordatorios de la mascota anterior
mientras cargaba la nueva selección. La causa estaba en el hook compartido
`src/hooks/use-api.ts`: el stale-while-revalidate devolvía `resolved.value` sin
comprobar que `resolved.fn` correspondiera al `fn` actual. Por tanto, el defecto
también estaba latente en Home, Food, Health y cualquier otro consumidor del
hook.

- Rojo `6a2aa9b`: el test del hook cambió el contrato del swap de `fn` y falló
  1/6 porque recibió todavía `{ kind: 'ok', value: 'pet-1' }`. El test vecino
  siguió cubriendo que un `refetch()` por `tick` con el mismo `fn` conserva el
  valor stale y marca `isRefreshing`.
- Verde `19aa304`: `data` e `isRefreshing` solo reutilizan `resolved` cuando
  `resolved.fn === fn`. Un `fn` nuevo obtiene `data: undefined` hasta resolver,
  por lo que las pantallas muestran sus Skeletons. No cambió la API pública del
  hook ni código de pantallas.
- La primera suite completa tras el fix encontró una única aserción histórica
  en Home que exigía ver las cards de Luna después de seleccionar Milo. Se
  corrigió para exigir Skeletons y ausencia de datos de Luna en `f11a32c`; el
  cuerpo del commit documenta la excepción C4 solicitada.
- Verificación móvil posterior: test focal del hook 6/6, Home 22/22, suite
  completa 36/36 y 424/424, `bun run typecheck` exit 0 y `bun run lint` exit 0.
- `./init.sh` final: exit 0 y mensaje `Todo verde`; incluyó backend 145/145
  suites y 1114/1114 tests, infra 2/2 y 14/14, móvil 36/36 y 424/424, y e2e
  20 suites y 327 tests pasados (2 suites/6 tests omitidos por gate), además de
  build, lint y typecheck.

R12 no se marca completado: el humano debe repetir el smoke, en especial el
paso 8, sobre este fix antes del cierre de la feature.

### Segundo hallazgo smoke — UX de confirmación de borrado

El humano pidió sustituir el `Alert.alert` de confirmación por el
`BottomSheet` universal de `@expo/ui`, manteniendo intacto el DELETE y su
degradación por `kind`.

- Rojo `a6f3a56`: la suite R7 dejó de espiar `Alert.alert` y pasó a exigir el
  contrato observable del sheet (`Host`, `isPresented`, `onDismiss`,
  `snapPoints={['half']}`), la referencia al reminder, la acción Delete con
  color `danger` y Cancel/dismiss sin DELETE. La corrida contra la
  implementación anterior dio 8 fallos esperados y conservó 11 tests verdes.
- Excepción C4: se retiraron los asserts del array interno de botones de
  `Alert.alert` porque esa interfaz quedó sustituida por pedido humano. El
  cuerpo del commit rojo documenta la excepción; la suite conserva las
  aserciones previas de DELETE, refetch en `ok`/`not-found`, mensajes por
  error y deshabilitado por fila, ahora detrás del sheet observable.
- Verde `21e769d`: `RemindersScreen` importa `BottomSheet`, `Host`, `Column`,
  `Text` y `Button` desde la raíz de `@expo/ui`; usa exclusivamente
  `isPresented`/`onDismiss` y `snapPoints={['half']}` (sin props de gorhom),
  con testIDs nuevos `reminders-delete-host`, `reminders-delete-sheet`,
  `reminders-delete-reference`, `reminders-delete-confirm` y
  `reminders-delete-cancel`. Delete cierra el sheet y delega en el
  `handleDelete` existente; Cancel y el dismiss nativo solo limpian la
  selección.
- Verificación final: suite focal 19/19; `bun run test -- --runInBand
  --silent`, 36/36 suites y 425/425 tests; `bun run typecheck` y
  `bun run lint`, ambos con exit 0. `bunx expo export --platform android`
  generó correctamente el bundle de 5.265 módulos y resolvió los assets de
  `@expo/ui`, comprobación de empaquetado para Expo Go SDK 57.
- `./init.sh`: exit 0 y mensaje `Todo verde`; incluyó backend 145/145 suites
  y 1114/1114 tests, infraestructura 2/2 y 14/14, móvil 36/36 y 425/425,
  e2e 20 suites y 327 tests pasados (2 suites/6 tests omitidos por gate),
  además de build, lint y typecheck.

R12 continúa pendiente del re-smoke humano en Expo Go SDK 57; este rework no
auto-aprueba el gate.
