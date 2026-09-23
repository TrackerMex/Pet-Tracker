---
feature: "mobile-detail-screens-to-stack"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-detail-screens-to-stack]] (#95)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente | pendiente |
| R2 | pendiente | pendiente |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |

| Enmienda | Comprobación | Commit de firma / de aplicación |
|---|---|---|
| A11 (`docs/conventions.md`, `docs/ui-guidelines.md`) | `grep -c 'enmienda A11 de #95'` → `1` en cada doc | pendiente |
| A12 (`specs/mobile-device-pairing/design.md` §Enmienda #95) | casilla marcada en ese fichero | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`; el rojo previo va como
`test(<scope>): <desc> (R1)`. R2 y R3 comparten el commit verde.
Rutas de test relativas a `mobile-pet-tracker/`. Cada fila cita el `describe`
completo con su prefijo `#95 R<n>` (los ficheros comparten R-ids con otras
specs) y, para R6, también las aserciones heredadas que se actualizan
([[design]] D10).
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
