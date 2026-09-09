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
| R3 — `upcomingReminders` | `src/screens/home/format.test.ts`::`describe('#85 R3: upcomingReminders filtra, ordena y acota')` | `37f7d74 feat(mobile-home-reminders-real-data): lock upcoming reminder selection (R3)` + `4788104 feat(mobile-home-reminders-real-data): select upcoming reminders (R3)`; M3..M6 validadas en el informe según A8/A9 |
| R4 — la Home pide los recordatorios | `src/screens/home/index.test.tsx`::`describe('#85 R4: la Home pide los recordatorios de la mascota')` + adaptación de `#70 R15` | `c2d5dfd feat(mobile-home-reminders-real-data): lock home reminder request (R4)` + `fc7a31d feat(mobile-home-reminders-real-data): fetch home reminders (R4)`; A10 adapta el doble posicional |
| R5 — las filas y su cardinalidad | `src/screens/home/index.test.tsx`::`describe('#85 R5: la sección pinta los recordatorios reales')` | `10c9636 feat(mobile-home-reminders-real-data): lock real reminder rows (R5)` + `4262348 feat(mobile-home-reminders-real-data): render real reminder rows (R5)` + candado M2 `ad08010` + refactor `a7733b8`; M2/M7/M8/M11 en el informe |
| R6 — icono, hueco y tinta por tipo | `src/screens/home/index.test.tsx`::`describe('#85 R6: cada tipo trae su icono, su hueco y su tinta')` | `bb83edc test(mobile-home-reminders-real-data): expose missing row icons (R6)` + `d4733ef feat(mobile-home-reminders-real-data): identify reminder types (R6)`; M12 validada en el informe |
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
| A1 — R15 pasa de 3 a 4 llamadas | recuento reforzado a `{ pets: 1, detail: 1, activity: 1, reminders: 1 }` | `c2d5dfd` + `fc7a31d` |
| A2 — `vaccineCountdown` → `dueCountdown` | helper renombrado y compartido por vacuna y recordatorios | `4262348` |
| A3 — cardinalidad del cuerpo `1` → `1 + n` | título heredado adaptado; sus tres aserciones intactas | `a7733b8` |
| A4 — D8 revertida: copy restaurada | valores bilingües de `home.reminders` / `home.remindersSeeAll` y literales de `#70 R1` | `5ad5bc6` + `41e7a99` |
| A5 — claves `home.nextVaccine*` sirven a dos filas | `dueCountdown` compartido sin añadir ocurrencias de copy | `4262348` |
| A6 — andamiaje de test gana `listReminders` | mock con respuesta vacía por defecto; doble posicional adaptado por A10 y valor repuesto por A11 | `c2d5dfd` + `fc7a31d` + `4262348` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

**Nota para el reviewer**: R15 es un requisito de **verificación**
(`CHECKPOINTS.md` C4 vía (b)). Su fila se cierra con la ruta del informe
`progress/impl_mobile-home-reminders-real-data.md` §prueba de mutación, no con
un `describe`. M1, M9, M10 y M13 deben aparecer **versionadas en un commit rojo
y revertidas en el verde siguiente**; las otras nueve, como evidencia escrita.
