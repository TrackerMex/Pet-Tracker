# Spec — alerts-engine (#12)

`spec_author` dejó la spec en `spec_ready`, pendiente del gate humano.

- `specs/alerts-engine/requirements.md` — R1-R20 (EARS) + decisiones
  abiertas D1-D5 que requieren confirmación humana en el gate.
- `specs/alerts-engine/design.md` — decisiones técnicas, estructura de
  capas, archivos afectados, alternativas descartadas.
- `specs/alerts-engine/tasks.md` — checklist TDD (1 test rojo / 2 impl. /
  3 refactor) por requisito.
- `specs/alerts-engine/traceability.md` — 20 filas "pendiente", a llenar
  por el implementer.

## Resumen de decisiones clave (para el humano que aprueba)

- **Anti-spam = idempotencia (mismo mecanismo)**: el índice único parcial
  `(pet_id, type, coalesce(geofence_id, uuid_nil)) WHERE status='open'`
  hace que un `INSERT` repetido (por anti-spam real, o por redelivery del
  mismo mensaje SQS) falle igual con `23505`; el worker solo encola una
  notificación cuando la escritura en `alert_events` tomó efecto de verdad
  (insert exitoso o `UPDATE` que afectó una fila), nunca por el solo hecho
  de haber recibido un evento `exit`/`enter`. Ese único invariante resuelve
  a la vez el anti-spam del brief §12 y la idempotencia ante redelivery del
  criterio de aceptación.
- **`geofence_state` se escribe DESPUÉS de `alert_events`, nunca antes**
  (D3): si el proceso cae entre ambas escrituras, dejar el estado sin
  avanzar es lo que permite que la redelivery vuelva a intentar (y esta vez
  complete) la escritura en `alert_events` — invertir el orden pierde la
  apertura para siempre en ese escenario de caída.
- **Cierre por batería ≥30** ocurre dentro del mismo handler de
  `position.updated` (no hay un evento `battery.recovered` — el productor
  de #8 nunca lo emite), chequeando `batteryPct` contra la nueva constante
  `BATTERY_RECOVERY_THRESHOLD_PCT`, e independiente del bucle de evaluación
  de geocercas.
- **Infra nueva no prevista por #2**: esta feature añade una 5ª cola SQS
  (`geofence-events` + DLQ) y una regla EventBridge (sin las cuales el
  worker no tiene forma de "consumir" el bus en LocalStack), y reubica 3
  constantes de contrato (`EVENT_SOURCE`, `DETAIL_TYPE_*`) de
  `workers/ingestion.constants.ts` a `aws/constants.ts` para evitar que la
  capa de infraestructura compartida dependa de una carpeta de feature —
  ver D2 en requirements.md, marcado explícitamente para confirmación
  porque toca (mínimamente) un archivo de una feature ya `done` (#8).

Ruta principal para el gate: `specs/alerts-engine/requirements.md` §Aprobación.
