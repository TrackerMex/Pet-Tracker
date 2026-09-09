---
feature: "mobile-home-reminders-real-data"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-home-reminders-real-data]]

Base de medición: **`20c7b3c`** (merge del PR #116, #70).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 — copy en los dos idiomas | `src/screens/home/index.test.tsx`::`describe('#85 R1: la sección recupera su rótulo en los dos idiomas')` + adaptación de `#70 R1` | `5ad5bc6 feat(mobile-home-reminders-real-data): lock restored reminder copy (R1)` + `41e7a99 feat(mobile-home-reminders-real-data): restore reminder section copy (R1)` |
| R2 — `localDayOf` | `src/screens/home/format.test.ts`::`describe('#85 R2: localDayOf reduce el instante a día civil local')` | `109cdaa feat(mobile-home-reminders-real-data): lock local reminder day (R2)` + `2fb06c5 feat(mobile-home-reminders-real-data): derive local reminder day (R2)` + M1 `97e06c0`/`80595f9` |
| R3 — `upcomingReminders` | `src/screens/home/format.test.ts`::`describe('#85 R3: upcomingReminders filtra, ordena y acota')` | `37f7d74 feat(mobile-home-reminders-real-data): lock upcoming reminder selection (R3)` + `4788104 feat(mobile-home-reminders-real-data): select upcoming reminders (R3)`; ver bloqueo M3 en el informe |
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
| A4 — D8 revertida: copy restaurada | valores bilingües de `home.reminders` / `home.remindersSeeAll` y literales de `#70 R1` | `5ad5bc6` + `41e7a99` |
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
