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
| R1 | `screens/reminders/index.test.tsx::#240 R1: %s` (cuatro filas) | `9cdadea3` — `test(mobile): reminder row date shows the year outside the current year (R1, R2, R3, R5)`<br>`b14c20e7` — `feat(mobile): show the year in reminder row dates outside the current year (R1, R3, R5)` |
| R1 | `screens/reminders/index.test.tsx::#178 R6: fila del canvas › formatea la fecha y hora próxima y conserva sus días en text-13 (enmendado por #240 R1)` | `9cdadea3` — `test(mobile): reminder row date shows the year outside the current year (R1, R2, R3, R5)`<br>`b14c20e7` — `feat(mobile): show the year in reminder row dates outside the current year (R1, R3, R5)` |
| R1 | `screens/reminders/index.test.tsx::#178 R6: fila del canvas › formatea la hora lejana y la meta inactiva con su estado (enmendado por #227 R13) (enmendado por #240 R1)` | `9cdadea3` — `test(mobile): reminder row date shows the year outside the current year (R1, R2, R3, R5)`<br>`b14c20e7` — `feat(mobile): show the year in reminder row dates outside the current year (R1, R3, R5)` |
| R2 | `screens/reminders/index.test.tsx::#240 R2: %s` (cuatro filas) | `9cdadea3` — `test(mobile): reminder row date shows the year outside the current year (R1, R2, R3, R5)`<br>`b14c20e7` — `feat(mobile): show the year in reminder row dates outside the current year (R1, R3, R5)` |
| R3 | `screens/reminders/index.test.tsx::#240 R3: %s` (cinco filas) | `9cdadea3` — `test(mobile): reminder row date shows the year outside the current year (R1, R2, R3, R5)`<br>`b14c20e7` — `feat(mobile): show the year in reminder row dates outside the current year (R1, R3, R5)` |
| R4 | `screens/reminders/index.test.tsx::#240 R4: %s` (cinco filas) | `c281f522` — `test(mobile): series until text keeps its year rule with a January clock (R4)` |
| R5 | `screens/reminders/index.test.tsx::#240 R5: pasa es-MX y el año a toLocaleDateString para una fecha de otro año` | `9cdadea3` — `test(mobile): reminder row date shows the year outside the current year (R1, R2, R3, R5)`<br>`b14c20e7` — `feat(mobile): show the year in reminder row dates outside the current year (R1, R3, R5)` |
| R5 | `screens/reminders/index.test.tsx::#65 R15: la fecha del recordatorio se formatea con el locale del idioma › passes es-MX explicitly to the date formatter (enmendado por #240 R5)` | `edb52ddd` — `test(mobile): pin the clock of the es-MX date formatter lock (R5)`<br>`b14c20e7` — `feat(mobile): show the year in reminder row dates outside the current year (R1, R3, R5)` |

La columna de commit lleva el commit de test (rojo o verde, según
[[tasks]]) y el de producción cuando lo haya, cada uno con su hash y su
mensaje.

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
