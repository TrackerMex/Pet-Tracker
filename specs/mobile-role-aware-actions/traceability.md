---
feature: "mobile-role-aware-actions"
status: approved     # draft | approved
tags: [mobile, roles, spec]
---

# Trazabilidad — [[mobile-role-aware-actions]] (#216)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/screens/weight-log/index.test.tsx::#216 R1: Peso solo deja registrar al dueño › #216 R1 con el rol %s el formulario se pinta: %s` (4 filas) y `› #216 R1 mientras la mascota carga no pinta el formulario` | rojo `3a43f090` test(mobile): #216 weight form only for the owner (R1); verde `aafcb08e` feat(mobile): #216 weight form only for the owner (R1) |
| R2 | `mobile-pet-tracker/src/screens/home/index.test.tsx::#216 R2: el tile Recordatorio es solo del dueño › #216 R2 con el rol %s los tiles son %j` (4 filas) | rojo `612f4219` test(mobile): #216 reminder tile only for the owner (R2); verde `72eb564a` feat(mobile): #216 reminder tile only for the owner (R2) |
| R3 | `mobile-pet-tracker/src/screens/home/index.test.tsx::#216 R3: Vincular collar en Inicio es solo del dueño › #216 R3 con el rol %s el enlace para vincular se pinta: %s` (4 filas) | rojo `e7388a2c` test(mobile): #216 home collar pairing link only for the owner (R3); verde `51a17821` feat(mobile): #216 home collar pairing link only for the owner (R3) |
| R4 | `mobile-pet-tracker/src/screens/reminders/index.test.tsx::#216 R4: Nuevo es solo del dueño › #216 R4 con el rol %s y recordatorios la cabecera tiene %i hijos` (4 filas), `› #216 R4 con el rol %s y sin recordatorios Nuevo se pinta: %s` (4 filas) y `› #216 R4 al pasar a una mascota que no es del dueño, Nuevo se va` | rojo `b7d2d7af` test(mobile): #216 new reminder action only for the owner (R4); verde `99d986a2` feat(mobile): #216 new reminder action only for the owner (R4) |
| R5 | `mobile-pet-tracker/src/screens/reminders/index.test.tsx::#216 R5: borrar y cancelar serie son solo del dueño › #216 R5 con el rol %s cada fila tiene %i hijos` (4 filas) | rojo `a8d8bc4e` test(mobile): #216 delete and cancel series only for the owner (R5); verde `5c951a03` feat(mobile): #216 delete and cancel series only for the owner (R5) |
| R6 | `mobile-pet-tracker/src/screens/pairing/index.test.tsx::#216 R6: el formulario de vincular es solo del dueño › #216 R6 con el rol %s el formulario se pinta: %s` (4 filas); guardas `mobile-pet-tracker/src/__tests__/ui-language.test.ts::#65 R10 › resuelve las ocurrencias normativas y el delta de conectividad (enmendado por #216 R6)` y `::#65 R18 › resuelve cada ocurrencia de la tabla contra la clave exacta` | rojo `9a25520b` test(mobile): #216 pairing form only for the owner (R6); verde `9424f976` feat(mobile): #216 pairing form only for the owner (R6) |
| R7 | `mobile-pet-tracker/src/screens/pairing/index.test.tsx::#216 R7: desvincular es solo del dueño › #216 R7 con el rol %s desvincular se pinta: %s` (4 filas) | rojo `792ae211` test(mobile): #216 unpair only for the owner (R7); verde `25ad085d` feat(mobile): #216 unpair only for the owner (R7) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(mobile): <desc> (R<n>)` para el rojo y
`feat(mobile): <desc> (R<n>)` para el verde, en ese orden (C4).
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
No se rebasea la rama después de rellenar esta tabla: un rebase cambia los
hashes de la columna de commits.
