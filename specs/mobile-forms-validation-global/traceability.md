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
| R5 | `src/screens/add-reminder/index.test.tsx::#186 R5:` y los dos casos cliente #125 autorizados en la enmienda; 65 it totales, 5 nuevos; sondas S5.1–S5.3 verificadas; copy en ui-language | Rojo inicial: `a7f8e58a401c43605f9989251b5e8737fc554a53` — `test(mobile): validación por campo en recordatorios (#186 R5)`; rojo adicional: `16d5421c0f4d0a228225eb3569d5938f591e40a0` — `test(mobile): migra dos it de #125 al mensaje de fecha (#186 R5)`; verde: `611e8cd54bf592bdb2a691db01e1f6ba7589ed18` — `feat(mobile): validación por campo en recordatorios (#186 R5)` |
| R6 | `src/screens/docs-upload-form/index.test.tsx::#186 R6:` y reescrituras de validación cliente #185 R9; 79 it totales, 6 nuevos; sondas S6.1–S6.4 verificadas | Rojo: `824d143b8ad8663e400aa476c47748f73d4761c0` — `test(mobile): validación por campo en documentos (#186 R6)`; verde: `7e8c048ad1baf9bbfbc9a3ac58d57f7d191acc2e` — `feat(mobile): validación por campo en documentos (#186 R6)` |
| R7 | `src/screens/weight-log/index.test.tsx::#186 R7:`; 70 it totales, 12 nuevos; sondas S7.1–S7.6 verificadas; copy en ui-language | Rojo: `71913afe044178d05ca9aff3902775a109cbba57` — `test(mobile): validación de peso y errores del servidor (#186 R7)`; verde: `f6c9f27c074e15a17033b2a7b00b2a7aa043c6b2` — `feat(mobile): validación de peso y errores traducidos (#186 R7)` |
| R8 | `src/__tests__/forms-validation-global.test.ts::#186 R8: conserva los conteos y ninguna pantalla importa FieldError` (1 nuevo); login 43, register 73, forgot 52, reset-password 52 y account-screens-polish 13, intactos y verdes; sondas S8.1–S8.3 verificadas | Rojo: `15c77b1c1fbd77360c0529b5d98352f5a0074fda` — `test(mobile): pantallas de cuenta usan FieldErrorMessage (#186 R8)`; verde: `729473d59d9c6952ac2733ece93691879c565e7d` — `feat(mobile): pantallas de cuenta usan FieldErrorMessage (#186 R8)` |
| R9 | `src/__tests__/forms-validation-global.test.ts::#186 R9:` preparado sin commit; rojo medido: 4 failed, 4 passed, 8 total | Pendiente: error de invocación al encadenar el registro con el commit rojo; no hay commit rojo ni verde R9, ni sondas S9.1–S9.4 |
| R10 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(mobile): <qué> (#186 Rn)` y `feat(mobile): <qué> (#186 Rn)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5). R10 se cierra con la casilla del humano de `requirements.md`.

Sesión 2026-10-19: la primera parada R2 se resolvió en `26c58911`; la lectura auxiliar de R3 se aclaró en `2c8a8a35`; la clasificación de los dos casos cliente #125 se corrigió en `e36c65da`. R1–R8 completos. Parada R9 por error de sintaxis de Bash en la cadena que debía registrar y commitear el rojo; sus tests se conservan sin commit y la carta aún no cambia. R10 sigue reservado al humano. Esta tabla no acredita implementación completa. Todos los hashes TDD consignados se verificaron con `git cat-file -e`. La actualización se concentra en el commit de documentación por instrucción expresa del handoff.
