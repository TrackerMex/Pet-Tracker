---
feature: "mobile-push-registration-r15-domock-scope"
status: spec_ready       # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Trazabilidad — [[mobile-push-registration-r15-domock-scope]] (#133)

Todos los tests viven en
`mobile-pet-tracker/src/hooks/use-push-registration.test.tsx`.

| Requisito | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 | `use-push-registration.test.tsx::#133 R1: tras R15, el hook recibe el mock de expo-notifications de la cabecera › llama a cada jest.fn de la cabecera y registra el token` | pendiente | pendiente |
| R2 | `use-push-registration.test.tsx::R15: importar el modulo no toca expo-notifications › no accede a expo-notifications al importar el modulo` (existente; cierre por mutación, [[tasks]] §R2) | no aplica | pendiente |
| R3 | sin test: cierre medido ([[tasks]] §R3 y `progress/impl_mobile-push-registration-r15-domock-scope.md`) | no aplica | pendiente |

Regla: el reviewer no aprueba si alguna fila queda «pendiente».

## Convención de commit

Mensajes exactos, en este orden:

1. Rojo de R1: `test(mobile): expose the R15 expo-notifications mock leak to later describes (R1)`.
   Solo añade el `describe` nuevo.
2. Verde de R1: `test(mobile): scope the R15 expo-notifications doMock to its own test (R1)`.
   Solo cambia el `it` de R15.
3. Evidencia: `docs(mobile): record the R15 doMock scope evidence (R2,R3)`.
   Solo toca `progress/` y esta tabla.

## Requisitos sin commit rojo

- **R2** es de verificación (C4, vía **b**): el candado ya existe y producción
  ya cumple. Su evidencia son las sondas S1, S2 y S4 del reporte. Su fila cita
  el verde de R1, que es el commit que podría haberlo aflojado.
- **R3** se verifica con las medidas de [[tasks]] §R3. Su fila cita también el
  verde de R1, no el de evidencia: el commit de evidencia no lleva código.

El implementer rellena esta tabla en el commit de evidencia y el reviewer la
valida al aprobar (ver [[../../docs/specs|specs]] y
[[../../CHECKPOINTS|CHECKPOINTS]] C5). **No rebasees** la branch después de
rellenarla: los hashes dejarían de valer. Si hace falta, reapunta cada hash y
comprueba con `git merge-base --is-ancestor <hash> HEAD` que sigue en la
historia.
