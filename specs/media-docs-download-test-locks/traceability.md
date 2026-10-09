---
feature: "media-docs-download-test-locks"
status: draft        # draft | approved
tags: [harness, spec, backend, media, tests]
---

# Trazabilidad — [[media-docs-download-test-locks]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente — `src/modules/media/infrastructure/photo-storage.object-exists.spec.ts::#162 R1 (a)` y `::#162 R1 (b)` | pendiente (rojo c1 con M1, verde c2) |
| R2 | pendiente — `src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts::#162 R2` | pendiente (rojo c3 con M2, verde c4) |
| R3 | pendiente — `test/media-docs.e2e-spec.ts::#162 R3` | pendiente (rojo c5 con M3, verde c6) |
| R4 | pendiente — verificación (lint, unit, e2e, greps, diffs; control P16 del reviewer) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: [[tasks]] fija el mensaje exacto de cada commit.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
