# Sesión activa

> Este archivo describe el estado de la sesión en curso.
> Al cerrar la sesión, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Plantilla (sesión sin iniciar)

```
feature: —
inicio: —
agentes lanzados: —
estado: sin sesión activa
```

---

```
feature: alerts-engine (#12)
inicio: 2026-08-07
agentes lanzados: spec_author (spec_ready) → implementer (lanzado)
estado: in_progress — spec aprobada por humano 2026-08-07 (D1=A, D2-D5 confirmados íntegros en specs/alerts-engine/requirements.md)
plan breve: worker SQS geofence-events (nuevo) consumiendo position.updated/battery.low del bus; evaluate() de geofence-eval.ts (#11, sin modificar) para exit/enter; alert_events con índice único parcial anti-spam; cierre de battery_low con batería ≥30; encola en SQS notifications. TDD por R-id sobre specs/alerts-engine/requirements.md.
```
