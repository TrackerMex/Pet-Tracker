# Implementación — Feature #42 `mobile-device-pairing`

- Fecha: 2026-09-03
- Branch: `feature/42-mobile-device-pairing`
- HEAD inicial: `c0d342a`
- Spec aprobada por humano: `6d32094`
- Resultado: R1–R11 implementados y verificados; G1 sigue pendiente del
  smoke humano en un dev build de Android.

## Resultado implementado

- `claimDevice` y `releaseDevice` exponen estados discriminados para todos
  los status HTTP fijados en D1, además de red inalcanzable y configuración
  ausente.
- `getPetTracking` deriva el entitlement del `402` de
  `GET /pets/:id/positions/last`, sin añadir endpoints ni tocar el backend.
- `/pairing` es un route de 5 líneas y delega en `PairingScreen`.
- La pantalla contiene las tres vistas de D5: formulario manual, confirmación
  `Tracker is ready` y estado del dispositivo con plan tracked/free.
- Claim y unpair presentan los mensajes exactos, cierran sesión ante `401`,
  permiten reintentar y bloquean la acción mientras la petición está en vuelo.
- El unpair usa `Alert.alert` nativo con Cancel/Unpair y refetchea mascotas al
  terminar. La sonda de plan se ejecuta solo con collar en fase `idle` y no se
  duplica cuando el refetch de foco entrega un objeto `device` nuevo.
- Perfil y Home enlazan a `/pairing` en los dos puntos de entrada de R10 sin
  cambiar textos ni testIDs anteriores.
- El describe de R11 protege componentes compartidos, dimensiones uniformes y
  grep-clean. El guion humano D11 está en `docs/verification.md`.

## Fuentes y límites Expo/UI

Se cargaron en el orden requerido las skills del plugin Expo 1.12.3:
`expo-overview`, `expo-router` y `expo-native-ui`; después se consultaron
`expo-ui`, `expo-data-fetching` y la skill local
`appllama-app-design-skill`. También se leyó la documentación oficial
versionada de Expo SDK 57 en `https://docs.expo.dev/versions/v57.0.0/`.

Eso mantuvo la ruta delgada, los efectos de foco bajo Expo Router, la carga
con Skeleton dimensionado, el diálogo destructivo nativo y los estilos
semánticos definidos por `docs/ui-guidelines.md`. No se añadió cámara,
permiso, config plugin, animación, haptics ni dependencia.

## Historial TDD

| Requisito | Test primero | Implementación verde |
|---|---|---|
| R1 | `7218959 test(mobile-device-pairing): cover claim device mapping (R1)` | `28a2b77 feat(mobile-device-pairing): implement claim device mapping (R1)` |
| R2 | `21e5171 test(mobile-device-pairing): cover device release mapping (R2)` | `bc31f31 feat(mobile-device-pairing): implement device release mapping (R2)` |
| R3 | `c7314cf test(mobile-device-pairing): cover tracking entitlement probe (R3)` | `aa49edd feat(mobile-device-pairing): derive tracking entitlement (R3)` |
| R4 | `9148d10 test(mobile-device-pairing): cover pairing route loading states (R4)` | `c6fd268 feat(mobile-device-pairing): add pairing route shell (R4)` |
| R5 | `05ece6c test(mobile-device-pairing): cover collar claim form (R5)` | `9aadc39 feat(mobile-device-pairing): add collar claim form (R5)` |
| R6 | `8a941d6 test(mobile-device-pairing): cover claim error states (R6)` | `bad3d92 feat(mobile-device-pairing): handle claim error states (R6)` |
| R7 | `a3b6ced test(mobile-device-pairing): cover tracker ready view (R7)` | `eafccdd feat(mobile-device-pairing): add tracker ready view (R7)` |
| R8 | `e4cb936 test(mobile-device-pairing): cover device and plan status (R8)` | `b2cbe61 feat(mobile-device-pairing): show device and plan status (R8)` |
| R8, deduplicación al foco | `6cda534 test(mobile-device-pairing): prevent duplicate plan probe (R8)` | `b5d365a fix(mobile-device-pairing): avoid duplicate plan probes (R8)` |
| R9 | `332c778 test(mobile-device-pairing): cover native unpair flow (R9)` | `767b056 feat(mobile-device-pairing): add native unpair flow (R9)` |
| R10 | `417f1a3 test(mobile-device-pairing): cover pairing entry points (R10)` | `44deb23 feat(mobile-device-pairing): add pairing entry points (R10)` |
| R11 | `cb82c1b test(mobile-device-pairing): guard pairing design conventions (R11)` | `8f1779b feat(mobile-device-pairing): consolidate pairing status rows (R11)` |

La prueba R11 nació verde, excepción prevista expresamente por `tasks.md`
cuando R4 ya había establecido las dimensiones y componentes correctos; se
commiteó antes del refactor final igualmente.

## Verificación automática

La primera invocación de `./init.sh` con la configuración por defecto del
worktree llegó a e2e y falló al intentar Postgres en `localhost:5432`; la
infraestructura local activa usa el entorno de desarrollo existente. El
script había creado un `.env` ignorado a partir del ejemplo; se eliminó al
cierre para restaurar el estado inicial y D10. La baseline y el gate final se
repitieron exportando en el proceso las variables del entorno local existente,
sin editar ni commitear `.env`.

| Comando | Exit | Resultado |
|---|---:|---|
| `git fetch && git checkout feature/42-mobile-device-pairing && git pull` | 0 | Branch correcta, HEAD inicial `c0d342a`, al día. |
| `./init.sh` antes del código, con el entorno local activo | 0 | Baseline completa verde: backend 163/1235; infra 2/14; harness 28; móvil 53/613 + 1 snapshot; e2e 25/353, con 3 suites/8 tests omitidos por gates existentes. |
| Tests Jest dirigidos de R1–R10 antes de cada implementación | 1 esperado | Cada rojo falló por el contrato aún ausente; los hashes están en la tabla TDD y `traceability.md`. |
| Tests Jest dirigidos después de cada implementación | 0 | R1–R11 verdes; pantalla pairing 47/47 y design drift 20/20 en la última corrida dirigida. |
| `bun run test -- --runInBand --silent` | 0 | 56/56 suites, 707/707 tests, 1/1 snapshot. |
| `bun run lint` | 0 | `expo lint` sin errores. |
| `bun run typecheck` | 0 | `tsc --noEmit` sin errores. |
| `./init.sh` final | 0 | `✅ Todo verde`: build; backend 163/1235; infra 2/14; harness 28/28; móvil 56/707 + 1 snapshot; e2e 25/353, con 3 suites/8 tests omitidos; lint y typecheck verdes. |

El warning de Node 20 del AWS SDK anuncia un requisito futuro de Node 22; no
afectó el exit ni pertenece a esta feature.

## Contención y C8

```text
$ grep -rn "expo-camera" mobile-pet-tracker/src mobile-pet-tracker/package.json
exit 1 esperado; 0 coincidencias

$ git diff --stat main -- backend-pet-tracker/
(vacío)

$ git diff --stat c0d342a -- backend-pet-tracker/
(vacío)
```

- `git status` no contiene `.env`; el archivo ignorado creado por el primer
  init se retiró y no se modificó ningún `.env` existente.
- `src/app/(tabs)/pairing.tsx` tiene 5 líneas.
- No hay hex, clases arbitrarias, `StyleSheet.create` ni shadow/elevation
  legacy en la pantalla de pairing; C8 y R11 están verdes.
- No se modificaron `package.json`, locks, `global.css`, backend o infra.
- No se creó ningún recurso AWS y no se ejecutó `cdk deploy`.

## Gate humano G1

**Pendiente (humano).** Las pruebas automáticas no sustituyen el recorrido en
el dev build Android con `SIM_MODE`. El guion completo está en
`docs/verification.md` § `Feature 42 — mobile-device-pairing`: código
inválido, claim exitoso, collar ya reclamado, tracked/free, 402, unpair y owner.

Hasta que el humano registre ese resultado aquí con fecha, la feature se
mantiene `in_progress`; no se marca `done` ni se cierra G1 en
`traceability.md`.

Las pruebas salieron exitosas.
Para validar tambien realice las pruebas en un dispositivo fisico collar real.
El mapa muestra la ubicación del collar en el mapa de la app.
