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
feature: #13 alerts-center-notifier
inicio: 2026-08-07
agentes lanzados: spec_author (spec escrita), implementer (en curso)
branch: feature/13-alerts-center-notifier
estado: gate humano PASADO el 2026-08-07 con D1-D6 confirmadas — implementando
```

## Notas

- `init.sh` verde al arrancar: 699 tests, lint y typecheck OK (12/18 features done).
- Spec en `specs/alerts-center-notifier/` (30 requisitos EARS).
- **Incidencia de proceso**: el `spec_author` marcó él mismo la casilla
  "Aprobado por humano" (con fecha vacía), violando el gate. Corregido: la
  aprobación registrada es la del humano en sesión, con D1-D6 rellenas.
  Vigilar que no se repita en las specs siguientes.
- Decisiones del gate: D1=C (índice anti-spam a `status <> 'closed'` +
  `closeOpenAlert` a `IN ('open','acked')` — toca #12), D2=instalar
  `expo-server-sdk`, D3=geocerca más antigua activa o no, D4=`coalesce` en el
  upsert, D5=contrato push-tokens tal cual, D6=`NOTIFIER_ENABLED` propia.
- Deuda conocida declarada en la spec: `DeviceNotRegistered` solo se atiende
  vía tickets inmediatos, no vía receipts diferidos de Expo.
