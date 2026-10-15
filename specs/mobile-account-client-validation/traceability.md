---
feature: "mobile-account-client-validation"
status: spec_ready
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-account-client-validation]] (#183)

Rutas de test relativas a `mobile-pet-tracker/`. H0: `56a0b84a67ff6594e5a149d91561e5fca376f36a`. Evidencia completa de gates y 33 sondas en [[../../progress/impl_mobile-account-client-validation|informe de implementación]].

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | Lista R1 abajo: 1 it nuevo + candado de longitud. | Rojo: `20a548ab9bf43b9be28515144e483028cc826d16` — `test(mobile): copy de validación (#183 R1)`<br>Verde: `ca6a57d9b05d59399c94ad766a17d1cbb109555e` — `feat(mobile): copy de validación (#183 R1)` |
| R2 | Lista R2 abajo: 66 casos puros + 3 candados de idioma. | Rojo: `b310900b7fc217a2f712a7b98cf5572d6fd3be55` — `test(mobile): reglas de cuenta iguales a los DTO (#183 R2)`<br>Verde: `109e3da9d3642e5efc210c23342d64b18832082a` — `feat(mobile): reglas de cuenta iguales a los DTO (#183 R2)` |
| R3 | Lista R3 abajo: 10 casos. | Rojo: `725e47065bd83d78e30537ca1cda3112e5d946e5` — `test(mobile): login valida en cliente (#183 R3)`<br>Verde: `5c951711f5625a2da9ec5f321ddb70948b90eaf1` — `feat(mobile): login valida en cliente (#183 R3)` |
| R4 | Lista R4 abajo: 28 casos + retirada de fila de idioma. | Rojo: `87b4fcb20164c1e87959168a210ed3d011d3c0a0` — `test(mobile): registro valida en cliente (#183 R4)`<br>Verde: `ac7ab536776545029eabe928447c5d6473203b78` — `feat(mobile): registro valida en cliente (#183 R4)` |
| R5 | Lista R5 abajo: 6 casos. | Rojo: `a8fc62c074868a6199ff9591eca2af91064c83d2` — `test(mobile): recuperar valida en cliente (#183 R5)`<br>Verde: `4d87b606ce918cf3d2d3d8ce9cae1bb3dd4fa6e9` — `feat(mobile): recuperar valida en cliente (#183 R5)` |
| R6 | Lista R6 abajo: 6 casos + ajuste del heredado del 400. | Rojo: `f874ad4d6fef7ca6e8254eeeaf7de591ffe76192` — `test(mobile): nueva contraseña valida en cliente (#183 R6)`<br>Verde: `3a25aa5b11a57f2211d02307c031a0161161cfa0` — `feat(mobile): nueva contraseña valida en cliente (#183 R6)` |
| R7 | Lista R7 abajo: 10 observaciones reescritas: 6 del 400, 1 legado de campos y 3 de idioma. | Rojo: `31341795456c9ca7b919c9e79cdb17e0c437b308` — `test(mobile): un 400 pinta el aviso genérico (#183 R7)`<br>Verde: `8b5406bb5748096c203756dd862190351a01fa7f` — `feat(mobile): un 400 pinta el aviso genérico (#183 R7)` |
| R8 | pendiente (humano): prueba de humo Android, casilla en requirements R8 | pendiente (humano) |

## R1 — it y candados

- `src/providers/__tests__/language-provider.test.tsx::#183 R1: declara las claves de validación en los dos idiomas y su registro`
- `src/providers/__tests__/language-provider.test.tsx::mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas`

## R2 — it y candados

- `src/utils/account-rules.test.ts::#183 R2: EMAIL_PATTERN decide «%s» como z.email() de zod 4.4.3 (%s)`
- `src/utils/account-rules.test.ts::#183 R2: validateLogin %s`
- `src/utils/account-rules.test.ts::#183 R2: validateRegister %s`
- `src/utils/account-rules.test.ts::#183 R2: validateForgot %s`
- `src/utils/account-rules.test.ts::#183 R2: validateResetPassword %s`
- `src/__tests__/ui-language.test.ts::resuelve las 51 ocurrencias normativas` — 50 en c3/c4; 49 en c7/c8; 51 desde c13
- `src/__tests__/ui-language.test.ts::resuelve cada ocurrencia de la tabla contra la clave exacta`
- `src/__tests__/ui-language.test.ts::no deja ningún valor fijo del catálogo como literal entero en las pantallas`

## R3 — it y candados

- `src/screens/login/index.test.tsx::#183 R3: «%s» en login-email no llama a la API y marca el campo`
- `src/screens/login/index.test.tsx::#183 R3: sin contraseña no llama a la API y marca login-password`
- `src/screens/login/index.test.tsx::#183 R3: con los dos campos mal pinta los dos mensajes a la vez`
- `src/screens/login/index.test.tsx::#183 R3: una contraseña de un espacio pasa como en el DTO`
- `src/screens/login/index.test.tsx::#183 R3: envía a la API el correo sin espacios alrededor`
- `src/screens/login/index.test.tsx::#183 R3: en inglés los dos mensajes dicen «Enter a valid email address» y «Enter your password»`
- `src/screens/login/index.test.tsx::#183 R3: corregir y reenviar quita los mensajes y llama una vez a la API`

## R4 — it y candados

- `src/screens/register/index.test.tsx::#183 R4: %s con %p pinta «%s» solo en ese campo y no llama a la API`
- `src/screens/register/index.test.tsx::#183 R4: %s con %p pasa como en el DTO y llama a la API`
- `src/screens/register/index.test.tsx::#183 R4: con el formulario vacío pinta los siete mensajes a la vez y no llama a la API`
- `src/screens/register/index.test.tsx::#183 R4: en inglés los siete mensajes salen en inglés`
- `src/screens/register/index.test.tsx::#183 R4: envía el correo sin espacios a register y al login que le sigue`
- `src/__tests__/ui-language.test.ts::resuelve las 51 ocurrencias normativas` — 49 en c7/c8; retirada de la fila register forgot.invalidEmail

## R5 — it y candados

- `src/screens/forgot/index.test.tsx::#183 R5: «%s» no llama a la API y marca forgot-email con «%s»`
- `src/screens/forgot/index.test.tsx::#183 R5: un correo de 320 caracteres pasa como en el DTO y llama a la API`
- `src/screens/forgot/index.test.tsx::#183 R5: corregir el correo quita el mensaje y envía el recortado`

## R6 — it y candados

- `src/screens/reset-password/index.test.tsx::#183 R6: %p pinta «%s» en %s y no llama a la API`
- `src/screens/reset-password/index.test.tsx::#183 R6: las dos reglas a la vez pintan los dos mensajes`
- `src/screens/reset-password/index.test.tsx::#183 R6: %p pasa como en el DTO y llama a la API`
- `src/screens/reset-password/index.test.tsx::#183 R7: un 400 de validación pinta el aviso genérico y no el texto del servidor` — submitReset válido desde c11

## R7 — it y candados

- `src/screens/login/index.test.tsx::#183 R7: un 400 de validación pinta el aviso genérico y nunca el texto del servidor`
- `src/screens/register/index.test.tsx::#183 R7: un 400 de validación pinta el aviso genérico y ningún campo`
- `src/screens/reset-password/index.test.tsx::#183 R7: un 400 de validación pinta el aviso genérico y no el texto del servidor`
- `src/screens/register/index.test.tsx::#172 R10: cada campo con error lleva icono y texto seleccionable` — disparo de cliente
- `src/screens/forgot/index.test.tsx::mapea %p a «%s» en forgot-error, seleccionable, y deja el formulario en pie` — fila validation
- `src/screens/forgot/index.test.tsx::un reintento desde el formulario que vuelve a fallar pinta el copy del nuevo kind`
- `src/screens/forgot/index.test.tsx::un %p al reenviar pinta «%s» en forgot-error sin salir de «Revisa tu correo»` — fila validation
- `src/__tests__/ui-language.test.ts::resuelve las 51 ocurrencias normativas`
- `src/__tests__/ui-language.test.ts::resuelve las 17 ocurrencias normativas`
- `src/__tests__/ui-language.test.ts::resuelve cada ocurrencia de la tabla contra la clave exacta`

## Verificación de cierre

- Guardas: 124 passed; typecheck exit 0, con guarda de router exit 0; lint exit 0 y log vacío.
- Siete suites de la feature con timeout por defecto: 330 passed.
- Suite móvil completa, una ejecución: 111 suites y 3506 tests verdes (+1 suite, +117 it respecto de H0).
- Las 33 sondas produjeron los títulos y tipos esperados; todas se restauraron con exit=0 y cached=0.
- Anclas del par sites-99: HomeEntrance=4 y mockIcon=2; diff de ambos mocks=0; backend=0 ficheros cambiados.
- c15 no aplica: RegisterFieldErrors se eliminó con el mapeo en R7.
- R8 permanece pendiente del humano. No se cambia su casilla, ni se declara la feature done. init.sh y el cierre del leader quedan fuera de este handoff.
