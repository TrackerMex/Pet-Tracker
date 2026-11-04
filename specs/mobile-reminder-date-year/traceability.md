---
feature: "mobile-reminder-date-year"
status: approved      # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-reminder-date-year]] (#240)

Rutas relativas a `mobile-pet-tracker/src/`. Todos los tests nuevos viven en
`describe('#240: año en la fecha de la fila')` de
`screens/reminders/index.test.tsx`. Los enmendados se citan por su título
completo tras la enmienda.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `screens/reminders/index.test.tsx::#240 R1: %s` (cuatro filas) | pendiente |
| R1 | `screens/reminders/index.test.tsx::#178 R6: fila del canvas › formatea la fecha y hora próxima y conserva sus días en text-13 (enmendado por #240 R1)` | pendiente |
| R1 | `screens/reminders/index.test.tsx::#178 R6: fila del canvas › formatea la hora lejana y la meta inactiva con su estado (enmendado por #227 R13) (enmendado por #240 R1)` | pendiente |
| R2 | `screens/reminders/index.test.tsx::#240 R2: %s` (cuatro filas) | pendiente |
| R3 | `screens/reminders/index.test.tsx::#240 R3: %s` (cinco filas) | pendiente |
| R4 | `screens/reminders/index.test.tsx::#240 R4: %s` (cinco filas) | pendiente |
| R5 | `screens/reminders/index.test.tsx::#240 R5: pasa es-MX y el año a toLocaleDateString para una fecha de otro año` | pendiente |
| R5 | `screens/reminders/index.test.tsx::#65 R15: la fecha del recordatorio se formatea con el locale del idioma › passes es-MX explicitly to the date formatter (enmendado por #240 R5)` | pendiente |

La columna de commit lleva el commit de test (rojo o verde, según
[[tasks]]) y el de producción cuando lo haya, cada uno con su hash y su
mensaje.

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
