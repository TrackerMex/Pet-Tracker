---
feature: "media-docs-download-test-locks"
status: draft        # draft | approved
tags: [harness, spec, backend, media, tests]
---

# Trazabilidad — [[media-docs-download-test-locks]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/modules/media/infrastructure/photo-storage.object-exists.spec.ts::#162 R1 (a)` y `::#162 R1 (b)` | rojo `dc4a2dd7` — `test(media): red getObjectSize decides 404 by status (#162 R1)` → verde `eb222afd` — `feat(media): revert M1, 404 stays decided by status (#162 R1)` |
| R2 | `src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts::#162 R2` | rojo `b0af8ba5` — `test(media): red list keeps repository order on out-of-order URLs (#162 R2)` → verde `b79e78e4` — `feat(media): revert M2, list keeps index order (#162 R2)` |
| R3 | `test/media-docs.e2e-spec.ts::#162 R3` | rojo `ac79cf93` — `test(media): red markUploaded keeps confirmed uploaded_at (#162 R3)` → verde `e9688050` — `feat(media): revert M3, markUploaded keeps the first confirm (#162 R3)` |
| R4 | verificación (lint, unit, e2e, greps, diffs; control P16 del reviewer) | sin commit propio: impl §Verificación R4 (./init.sh y las sondas los corren el leader y el reviewer) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: [[tasks]] fija el mensaje exacto de cada commit.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
