---
feature: "mobile-forms-validation-global"
status: approved        # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-forms-validation-global]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/providers/__tests__/language-provider.test.tsx::mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas` y `#186 R1: declara las claves de validación en los dos idiomas y su registro`; sondas S1.1 y S1.2 verificadas | Rojo: `41cb99f82f691250efeb3dde33db87b15fc64ce8` — `test(mobile): copy de validación en ambos idiomas (#186 R1)`; verde: `883d172244401c7241da72e7d687b7e995ab9e14` — `feat(mobile): copy de validación (#186 R1)` |
| R2 | `src/utils/form-rules.test.ts::#186 R2: reglas puras de los cuatro formularios` (89 it); los seis it de copy de `src/__tests__/ui-language.test.ts` declarados tras la corrección; sondas S2.1–S2.5 verificadas | Rojo: `b8c0a517298300fc385bb787513ac71a82878dbc` — `test(mobile): reglas de formulario y filas de copy (#186 R2)`; verde: `9c2c676f61c29e52fcc351a47a890ab2f0581ef6` — `feat(mobile): form-rules.ts (#186 R2)` |
| R3 | pendiente: test escrito sin commit, rojo declarado por módulo ausente; parada de invocación auxiliar | pendiente: no se inició la implementación; ver reporte |
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

Sesión 2026-10-19: la primera parada R2 se resolvió al corregir la spec en `26c58911`; R2 quedó completo. En la reanudación hubo una parada obligatoria por error de invocación de una lectura auxiliar, antes del commit rojo de R3. R4–R9 no iniciados y R10 reservado al humano. Esta tabla no acredita implementación completa. Los hashes TDD de R1 y R2 se verificaron con `git cat-file -e`. La actualización se concentra en el commit de documentación por instrucción expresa del handoff.
