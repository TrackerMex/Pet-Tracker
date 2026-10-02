---
feature: "meal-schedule-editing"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[meal-schedule-editing]]

> Rutas relativas a `backend-pet-tracker/`. Los tests nombran su requisito
> como `R<n> (meal-schedule-editing #103): …`. El módulo `nutrition` ya
> acumula R-ids de #17 y #83.
>
> Formato de cada fila:
> - columna de test: `archivo::título del describe`, con varios unidos por
>   `+`;
> - columna de commit: `rojo <hash>; verde <hash>`, más `docs <hash>` si lo
>   hay.
>
> R11 y R12 son candados sobre código ya correcto: su «rojo» es el commit que
> versiona la mutación de producción, y su «verde» el que la revierte.

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
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |
| R11 | pendiente | pendiente |
| R12 | pendiente | pendiente |
| R13 | pendiente (requisito de verificación, C4 vía (b): evidencia en `progress/impl_meal-schedule-editing.md` §R13) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".

Convención de commit:
- `test(meal-schedule-editing): … (R<n>)` para el rojo;
- `feat(meal-schedule-editing): … (R<n>)` para el verde;
- `docs(meal-schedule-editing): … (R13)` para las docs.

El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
