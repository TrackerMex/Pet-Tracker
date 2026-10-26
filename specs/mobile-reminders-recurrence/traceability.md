---
feature: "mobile-reminders-recurrence"
status: draft        # draft | approved
tags: [mobile, reminders, recurrence, spec]
---

# Trazabilidad — [[mobile-reminders-recurrence]] (#213)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente | pendiente |
| R2 | pendiente | pendiente |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |
| R11 | pendiente | pendiente |
| R12 | pendiente | pendiente |
| R13 | pendiente | pendiente |
| R14 | pendiente | pendiente |
| R15 | pendiente | pendiente |
| R16 | pendiente | pendiente |
| R17 | pendiente | pendiente |
| R18 | pendiente | pendiente |
| R19 | pendiente | pendiente |
| R20 | pendiente | pendiente |
| R21 | pendiente | pendiente |
| R22 | pendiente | pendiente |

## `it` añadidos o renombrados por las erratas de la firma (2026-10-26)

Cada fila se rellena con el nombre completo y el hash como las de arriba.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R3 | `src/api/__tests__/reminders.test.ts::#213 R3: cancelReminderSeries devuelve unreachable si fetch lanza` | pendiente |
| R13 | `src/screens/add-reminder/index.test.tsx::#213 R13: sin nombre de mascota (%s) la nota usa la variante sin nombre` (filas `falla`, `sin la mascota`, `sin resolver`) | pendiente |
| R18 | `src/screens/reminders/index.test.tsx::#213 R18: confirmar con %s muestra su error`, fila `throws` | pendiente |
| R16 | `src/screens/reminders/index.test.tsx`: los siete `it` « (enmendado por #213 R16)» de `tasks.md` §R16 (3) | pendiente |
| R22 | las 18 enmiendas de `tasks.md` §R22 (3), con « (enmendado por #213 R22)» en el nombre salvo los `it.each` que solo ganan casos | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(mobile): <desc> (R<n>)` en rojo y después
`feat(mobile): <desc> (R<n>)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
