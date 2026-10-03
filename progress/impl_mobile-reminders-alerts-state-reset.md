# Implementación — mobile-reminders-alerts-state-reset (#97)

Fecha: 2026-09-15
Branch: `feature/97-mobile-reminders-alerts-state-reset`
Base: `0e4aa810`

## Progreso TDD

| Requisito | Rojo | Verde |
|---|---|---|
| R1 | `e4b77d28` | `958bc293` (aserción exacta del sheet: `7f8fad59`) |
| R2 | `642fc42d` | `b0d17b5c` |
| R3 | `c1705c44` | `9bbf664f` |
| R4 | `2c0cfe31` | `b5436b8c` |
| R5 | `9eec5bad` | `f838fe96` |
| R6 | `f8cc86ed` | `3d12a476` |
| R7 | `773f5b4d` | `7d1034a6` |
| R8 | `3ea45ed6` | `cf436661` |

## Sondas de mutación

### R3 — `setDeletingId(null)` en el cleanup

Comando:

```bash
npx jest src/screens/reminders/index.test.tsx -t '#97 R3' --runInBand
```

Salida roja relevante (`c1705c44`):

```text
Expected: true
Received: false
Test Suites: 1 failed, 1 total
Tests:       1 failed, 24 skipped, 25 total
```

Después de retirar la mutación:

```bash
git diff b0d17b5c -- mobile-pet-tracker/src/screens/reminders/index.tsx
# sin salida
```

El fichero completo quedó verde: 1 suite, 25 tests.

### R5 — `setAckingId(null)` y `ackingIdRef.current = null`

Comando para las dos sondas:

```bash
npx jest src/screens/alerts/index.test.tsx -t '#97 R5' --runInBand
```

Primera salida roja, con las dos mutaciones (`9eec5bad`):

```text
mantiene bloqueado el ack que sigue en vuelo
  Received instance is not disabled (disabled: false)
no resetea el estado ni el ref desde el cleanup de foco
  Expected substring: not "AckingId"
  Received string: "... setAckingId(null); ackingIdRef.current = null; ..."
Test Suites: 1 failed, 1 total
Tests:       2 failed, 27 skipped, 29 total
```

Segunda salida roja, dejando solo `ackingIdRef.current = null`:

```text
✓ mantiene bloqueado el ack que sigue en vuelo
✕ no resetea el estado ni el ref desde el cleanup de foco
  Expected substring: not "ackingIdRef"
  Received string: "... ackingIdRef.current = null; ..."
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 skipped, 1 passed, 29 total
```

Después de retirar las dos mutaciones:

```bash
git diff b5436b8c -- mobile-pet-tracker/src/screens/alerts/index.tsx
# sin salida
```

El fichero completo quedó verde: 1 suite, 29 tests.

### R6 — `setAcked({})` en el cleanup

Comando:

```bash
npx jest src/screens/alerts/index.test.tsx -t '#97 R6' --runInBand
```

Salida roja relevante (`f8cc86ed`):

```text
Unable to find an element with testID: alert-row-alert-1-status
La pantalla volvió a mostrar alert-row-alert-1-ack con disabled: false.
Test Suites: 1 failed, 1 total
Tests:       1 failed, 29 skipped, 30 total
```

Después de retirar la mutación:

```bash
git diff f838fe96 -- mobile-pet-tracker/src/screens/alerts/index.tsx
# sin salida
```

El fichero completo quedó verde: 1 suite, 30 tests.

## Verificación final

```text
npx tsc --noEmit
exit 0, sin salida

npx expo lint
exit 0, sin salida
```

Comando dirigido, ejecutado sin pipe y con los paréntesis escapados:

```bash
npx jest src/screens/reminders src/screens/alerts \
  'src/app/\(tabs\)/__tests__/alerts' \
  src/providers/__tests__/language-provider
```

Salida de cierre:

```text
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/app/(tabs)/__tests__/alerts.test.tsx
PASS src/screens/alerts/index.test.tsx
PASS src/screens/reminders/index.test.tsx
Test Suites: 4 passed, 4 total
Tests:       66 passed, 66 total
Snapshots:   0 total
Time:        6.624 s
```

`traceability.md` no tiene filas de requisitos pendientes. No se añadieron
claves de i18n ni se tocaron rutas, layout, componentes o theme. El
`./init.sh` de entrada terminó verde; conforme a la spec, el gate completo de
cierre queda para el reviewer por compartir Postgres entre worktrees.

## Alcance del diff

La lista de nueve ficheros descrita en `tasks.md` está completa y no contiene
ningún fichero prohibido. El comando literal contra `0e4aa810` muestra once
ficheros después de versionar este reporte: además de esos nueve aparecen
`feature_list.json` (ya modificado por el commit de aprobación/inicio
`784ac942`) y este reporte, que el propio cierre exige. Antes de empezar la
implementación la rama ya difería de la base en seis ficheros, incluido
`feature_list.json`; por eso el total literal no puede ser nueve sin deshacer
bookkeeping aprobado o dejar el reporte sin versionar.

## Gate humano — cerrado el 2026-09-15

Smoke en dev build de Android ejecutado por el humano. **Los cuatro pasos
pasaron.**

1. Recordatorios: abrir la hoja de confirmación de borrado, salir por la barra
   de tabs y volver deja la hoja cerrada y el recordatorio intacto.
2. Recordatorios: el mensaje de error de un borrado fallido (modo avión) ya no
   está al volver.
3. Alertas: una alerta atendida desde la app **sigue** atendida al volver, sin
   parpadear a "sin atender".
4. Alertas: una alerta atendida **desde fuera de la app** aparece ya atendida
   al entrar, sin reiniciar.

Los pasos 3 y 4 son los que cierran la decisión de diseño en dispositivo real:
el 3 confirma que `acked` sobrevive —la divergencia deliberada respecto al
arreglo de #63— y el 4 que el refetch al ganar el foco lo mantiene coherente,
que es la contrapartida sin la cual esa supervivencia no se sostiene. Juntos
justifican en la práctica la enmienda E9 a la spec de #78.

Nota de método: el entorno no tenía ninguna alerta (solo las produce el motor,
tipos `geofence_exit` y `battery_low`, sin endpoint de creación), así que el
humano insertó dos filas de prueba en `alert_events` de su base de desarrollo
—de tipos distintos, porque el índice único anti-spam solo admite una alerta
activa por `(pet_id, type, geofence_id)`— y usó una para el paso 3 y la otra
para el paso 4.
