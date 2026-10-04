---
feature: "mobile-keyboard-avoiding-forms"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-keyboard-avoiding-forms]]

Rutas relativas a `mobile-pet-tracker/`. El nombre del test es
`describe` › `it`, literal de [[requirements]].

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente — `src/app/(auth)/__tests__/login.test.tsx::#148 R1: login se aparta del teclado en Android › el host screen-login añade paddingBottom 200 al abrir el teclado` | pendiente |
| R2 | pendiente — `src/app/(auth)/__tests__/register.test.tsx::#148 R2: register se aparta del teclado en Android › el host screen-register añade paddingBottom 200 al abrir el teclado` | pendiente |
| R3 | pendiente — `src/screens/reset-password/index.test.tsx::#148 R3: reset-password se aparta del teclado en Android › el host screen-reset-password añade paddingBottom 200 al abrir el teclado` | pendiente |
| R4 | pendiente — `src/screens/add-pet/index.test.tsx::#148 R4: add-pet se aparta del teclado en Android › el host screen-add-pet añade paddingBottom 291 al abrir el teclado` | pendiente |
| R5 | pendiente — `src/screens/add-reminder/index.test.tsx::#148 R5: add-reminder se aparta del teclado en Android › el host screen-add-reminder añade paddingBottom 291 al abrir el teclado` | pendiente |
| R6 | pendiente — `src/screens/pairing/index.test.tsx::#148 R6: pairing se aparta del teclado en Android › el host screen-pairing añade paddingBottom 291 al abrir el teclado` | pendiente |
| R7 | pendiente — `src/screens/weight-log/index.test.tsx::#148 R7: weight-log se aparta del teclado en Android › el host screen-weight-log añade paddingBottom 291 al abrir el teclado` | pendiente |
| R8 | pendiente — cuatro filas: `src/screens/{add-pet,add-reminder,pairing,weight-log}/index.test.tsx::#148 R8: <pantalla> entrega el primer toque con el teclado abierto › el scroll <x>-form declara keyboardShouldPersistTaps handled` | pendiente |
| R9 | pendiente — sin test nuevo: medición del reviewer (diff ⊆ lista cerrada, `grep -c Platform` = 0 ×7, `<TextInput` = base, 5 suites globales verdes) | pendiente (commit de cierre) |
| R10 | gate humano — 7 casillas de [[requirements]] §Prueba de humo | n/a (firma del humano) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(mobile): … (#148 R<n>)` → `feat(mobile): … (#148 R<n>)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
