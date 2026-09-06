# Implementación — #65 mobile-ui-language

Fecha: 2026-09-06
Branch: `feature/65-mobile-ui-language`
Worktree: `/home/claude/sites/Pet-Tracker-wt-ui`

## Estado

Implementación reanudada tras resolver el bloqueo de proceso en R18 contra
`CHECKPOINTS.md` C4. Antes de la aprobación no se modificó ningún archivo de
`mobile-pet-tracker/`, backend ni infraestructura.

## Gate previo

- Skills leídas antes de escribir código: `expo-overview`, `expo-native-ui` y
  `appllama-app-design-skill`; de Appllama solo aplica el patrón, nunca su
  sistema de estilos.
- Documentación oficial leída en su versión fijada: Expo SDK 57 y SecureStore
  para SDK 57.
- Se leyeron completos `requirements.md`, `design.md`, `tasks.md`,
  `traceability.md` y `copy-review.md` de la feature, además de
  `docs/ui-guidelines.md` y `CHECKPOINTS.md` C4/C7/C8.
- Primer `./init.sh`: falló por contaminación concurrente del Postgres y las
  colas LocalStack compartidas (3 fallos e2e ajenos al móvil). La repetición,
  sin cambios en el árbol, terminó con exit code 0: build, `cdk synth`, tests,
  e2e, lint y typecheck verdes. La suite móvil de baseline pasó 59 suites y
  891 tests.

## Bloqueo C4

R17 puede producir un rojo legítimo: sus seis `testID` no existen todavía y el
test falla por una aserción de consulta. No necesita excepción.

R18, en cambio, solo comprueba mecánicamente propiedades que R1-R11 ya exigen
dejar en el árbol: 320 usos de `t('<clave>')` y ausencia de copy literal. En el
orden aprobado (`R1-R11 -> R17 -> R18`) una implementación correcta hace que
el test de R18 nazca verde. La spec aprobada:

- no declara R18 como requisito de verificación;
- no elige por escrito la vía C4(b) de prueba por mutación;
- sigue pidiendo un «Test rojo» en `tasks.md`;
- no contiene una excepción firmada por el humano.

Por tanto no existe un rojo honesto para R18 en la posición obligatoria.
Provocarlo mediante un helper inexistente sería el `ReferenceError` que C4
prohíbe; dejar copy suelta a propósito hasta R18 incumpliría R1-R11. Se para
antes de escribir el primer test, tal como ordena el handoff.

## Enmienda necesaria antes de reanudar

El humano debe aprobar por escrito una de estas dos vías en la spec:

1. Declarar R18 requisito de verificación por C4(b) y exigir evidencia de
   mutación: reintroducir temporalmente un literal conocido, observar que el
   test R18 falla por su aserción, revertir la mutación y dejar la suite verde.
2. Cambiar el orden para escribir el candado R18 antes de las migraciones que
   verifica, de modo que su rojo sea real.

La primera vía conserva el orden y el alcance ya aprobados.

## Resolución del bloqueo

El humano aprobó explícitamente el 2026-09-06 la primera vía: R18 queda
declarado requisito de verificación C4(b) y se probará por mutación temporal.
La firma y el procedimiento quedaron registrados en `requirements.md` y
`tasks.md` antes de reanudar la implementación.

## R-ids y commits

| R-id | Rojo | Verde |
|---|---|---|
| R12 | `ac158f6` | `20397ad` |
| R13 | `e237589` | `ff15b5b` |
| R16 | `5f4e718` | `81a12fd` |
| R14 | `c77fcab` | `8d97da2` |
| R15 | `103353b` | `71015b1` |
| R1 | `8c67895` | `0dcf6bf` |
| R2 | `d6cb58a` | `fd04a3e` |
| R3 | `51bc7ed` | `40f9f6e` |
| R4 | `fc77f22` | `45fd835` |

## Copy o layout no previstos

No evaluados: la implementación no comenzó. No se inventó ninguna cadena.

## Verificación

- `bun run test`: cubierto por el baseline de `./init.sh`; 59 suites / 891
  tests móviles verdes antes de cualquier cambio.
- `./init.sh`: exit code 0 en la repetición completa de baseline.
