---
feature: "mobile-forms-validation-global"
status: approved        # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-forms-validation-global]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/providers/__tests__/language-provider.test.tsx::mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas` y `#186 R1: declara las claves de validación en los dos idiomas y su registro`; sondas S1.1 y S1.2 verificadas | Rojo: `41cb99f82f691250efeb3dde33db87b15fc64ce8` — `test(mobile): copy de validación en ambos idiomas (#186 R1)`; verde: `883d172244401c7241da72e7d687b7e995ab9e14` — `feat(mobile): copy de validación (#186 R1)` |
| R2 | pendiente: tests escritos sin commit; parada por 6 it rojos de `ui-language.test.ts` frente a los 5 declarados | pendiente: no se commitea un rojo no declarado; ver `progress/impl_mobile-forms-validation-global.md` |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(mobile): <qué> (#186 Rn)` y `feat(mobile): <qué> (#186 Rn)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5). R10 se cierra con la casilla del humano de `requirements.md`.

Sesión 2026-10-19: parada obligatoria en R2 según el handoff; R3–R9 no iniciados y R10 reservado al humano. Esta tabla no acredita implementación completa. Los hashes de R1 se verificaron con `git cat-file -e`. La actualización se concentra en el commit final de documentación por instrucción expresa del handoff.
