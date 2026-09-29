---
feature: "mobile-push-registration-r15-named-import-lock"
status: approved           # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Trazabilidad — [[mobile-push-registration-r15-named-import-lock]] (#137 y #139)

Todos los tests viven en
`mobile-pet-tracker/src/hooks/use-push-registration.test.tsx`.

| Requisito | Entrada | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|---|
| R1 | #137 | `use-push-registration.test.tsx::R15: importar el modulo no toca expo-notifications › no accede a expo-notifications al importar el modulo` (existente; cambia su fábrica) | `814f90ffc7782cc06557c2aef11b1ec0c3d08c15` | `e106aceee622d91c3b8318dcb1f70d80689c5447` |
| R2 | #139 | `use-push-registration.test.tsx::#139 R2: tras R15, expo-notifications vuelve a ser el objeto de la cabecera › jest.requireMock devuelve el mismo objeto, no una copia` | `5ed27bee4f30c5b06979f0dd69578910fde3937d` | `942bfc137856b7d316fe423209016980ec362aca` |
| R3 | #137 y #139 | sin test: cierre medido ([[tasks]] §R3 y `progress/impl_mobile-push-registration-r15-named-import-lock.md`) | no aplica | `942bfc137856b7d316fe423209016980ec362aca` |

Regla: el reviewer no aprueba si alguna fila queda «pendiente».

## Convención de commit

Mensajes exactos, en este orden:

1. Rojo de R1: `test(mobile): expose the R15 named import blind spot with a versioned mutation (R1)`.
   Cambia la fábrica de R15 en el test y aplica la mutación S3 en el hook.
2. Verde de R1: `test(mobile): lock R15 against a named expo-notifications import (R1)`.
   Solo revierte S3 en el hook.
3. Rojo de R2: `test(mobile): expose the R15 restore identity gap with a versioned mutation (R2)`.
   Añade `headerNotificationsModule`, el `describe` de `#139 R2` y la
   mutación O1 en el `finally` de R15.
4. Verde de R2: `test(mobile): lock the R15 restore to the header module identity (R2)`.
   Solo revierte O1.
5. Evidencia: `docs(mobile): record the R15 named import and restore identity evidence (R1,R2,R3)`.
   Solo toca `progress/impl_mobile-push-registration-r15-named-import-lock.md`
   y esta tabla.

## Notas

- R1 y R2 son candados sobre código ya correcto (C4, vía **b**, quinto
  punto): su commit rojo lleva una mutación versionada y su verde la revierte
  ([[design]] D4). Sus filas citan esos dos commits.
- **R3** se verifica con las medidas de [[tasks]] §R3. Su fila cita el verde
  de R2, no el de evidencia: el commit de evidencia no lleva código.

El implementer rellena esta tabla en el commit de evidencia y el reviewer la
valida al aprobar (ver [[../../docs/specs|specs]] y
[[../../CHECKPOINTS|CHECKPOINTS]] C5). **No rebasees** la branch después de
rellenarla: los hashes dejarían de valer. Si hace falta, reapunta cada hash y
comprueba con `git merge-base --is-ancestor <hash> HEAD` que sigue en la
historia.
