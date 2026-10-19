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
| R3 | `src/components/__tests__/field-error-message.test.tsx::#186 R3: FieldErrorMessage` (10 it); sondas S3.1–S3.5 verificadas | Rojo: `6e20aea15a37bf36bff241be0ca725244b9ee47d` — `test(mobile): FieldErrorMessage (#186 R3)`; verde: `a8bd53e285426113279d68efc64789d6e941e85f` — `feat(mobile): FieldErrorMessage (#186 R3)` |
| R4 | `src/screens/add-pet/index.test.tsx::#186 R4:` (candados 1–9); 52 it totales, 11 nuevos; sondas S4.1–S4.5 verificadas; copy en ui-language | Rojo: `062d5c217242481864ce84ebca2d34635d422be0` — `test(mobile): validación por campo en añadir mascota (#186 R4)`; verde: `02eb1dbcc568daa9ad90d8c977452572185400f9` — `feat(mobile): validación por campo en añadir mascota (#186 R4)` |
| R5 | `src/screens/add-reminder/index.test.tsx::#186 R5:`; rojo previsto 6/59/65, intento verde 2/63/65 por dos it antiguos #125 no declarados | Rojo: `a7f8e58a401c43605f9989251b5e8737fc554a53` — `test(mobile): validación por campo en recordatorios (#186 R5)`; verde pendiente, producción sin commit por parada obligatoria |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(mobile): <qué> (#186 Rn)` y `feat(mobile): <qué> (#186 Rn)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5). R10 se cierra con la casilla del humano de `requirements.md`.

Sesión 2026-10-19: la primera parada R2 se resolvió en `26c58911`; la lectura auxiliar de R3 se aclaró en `2c8a8a35`. R1–R4 completos. Nueva parada durante el intento verde R5 por dos it de validación cliente de #125 que todavía esperan add-reminder-error; ver reporte. R6–R9 no iniciados y R10 reservado al humano. Esta tabla no acredita implementación completa. Todos los hashes TDD consignados se verificaron con `git cat-file -e`. La actualización se concentra en el commit de documentación por instrucción expresa del handoff.
