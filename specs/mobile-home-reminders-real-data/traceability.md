---
feature: "mobile-home-reminders-real-data"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-home-reminders-real-data]]

Base de medición: **`20c7b3c`** (merge del PR #116, #70).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 — copy en los dos idiomas | pendiente | pendiente |
| R2 — `localDayOf` | pendiente | pendiente |
| R3 — `upcomingReminders` | pendiente | pendiente |
| R4 — la Home pide los recordatorios | pendiente | pendiente |
| R5 — las filas y su cardinalidad | pendiente | pendiente |
| R6 — icono, hueco y tinta por tipo | pendiente | pendiente |
| R7 — cruce de dato y posición | pendiente | pendiente |
| R8 — no pulsables y accesibilidad | pendiente | pendiente |
| R9 — carga y fallo de `listReminders` | pendiente | pendiente |
| R10 — estilo y tokens | pendiente | pendiente |
| R11 — cero claves y cero ocurrencias nuevas | pendiente | pendiente |
| R12 — bloque de drift de estilo | pendiente | pendiente |
| R13 — deltas de candados globales | pendiente | pendiente |
| R14 — suite, typecheck y grep-clean | pendiente | pendiente |
| R15 — prueba de mutación (M1-M13) | pendiente | pendiente |

## Enmiendas a #70 (se registran igual que un requisito)

| Enmienda | Qué se tocó | Commit |
|---|---|---|
| A1 — R15 pasa de 3 a 4 llamadas | pendiente | pendiente |
| A2 — `vaccineCountdown` → `dueCountdown` | pendiente | pendiente |
| A3 — cardinalidad del cuerpo `1` → `1 + n` | pendiente | pendiente |
| A4 — D8 revertida: copy restaurada | pendiente | pendiente |
| A5 — claves `home.nextVaccine*` sirven a dos filas | pendiente | pendiente |
| A6 — andamiaje de test gana `listReminders` | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

**Nota para el reviewer**: R15 es un requisito de **verificación**
(`CHECKPOINTS.md` C4 vía (b)). Su fila se cierra con la ruta del informe
`progress/impl_mobile-home-reminders-real-data.md` §prueba de mutación, no con
un `describe`. M1, M9, M10 y M13 deben aparecer **versionadas en un commit rojo
y revertidas en el verde siguiente**; las otras nueve, como evidencia escrita.
