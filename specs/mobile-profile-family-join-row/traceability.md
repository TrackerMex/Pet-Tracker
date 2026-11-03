---
feature: "mobile-profile-family-join-row"
status: spec_ready      # draft | spec_ready | approved
tags: [mobile, profile, ui, spec]
---

# Trazabilidad — [[mobile-profile-family-join-row]] (#229)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente | pendiente |
| R2 | pendiente | pendiente |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile): … (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

Tests previstos (archivo `src/screens/profile/index.test.tsx`):

- R1: `#229 R1: %s lleva flex-1` (2)
- R2: `#229 R2: con mascota ambas tarjetas van lado a lado en la fila 2` (1)
- R3: `#229 R3: %s conserva icono, texto y chevron` (2, nacen verdes)
- R4: `#229 R4: sin mascota Unirme con código lleva flex-1 en la fila 1` (1)
- R5: `#229 R5: las tres filas son flex-row gap-2 y las tarjetas no fijan alto` (1)
- R6: los tres `it` enmendados (`… (enmendado por #229 R2)`,
  `… (enmendado por #229 R1, R2)` ×2) y las anclas del handoff.
