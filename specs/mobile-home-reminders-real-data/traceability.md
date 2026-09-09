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
| R7 — cruce de dato y posición | `src/screens/home/index.test.tsx`::`describe('#85 R7: ninguna fila lleva el dato ni el sitio de otra')` | `4078fdc test(mobile-home-reminders-real-data): catch crossed row data and order (R7)` + `c5e30e2 feat(mobile-home-reminders-real-data): keep row data and order aligned (R7)`; M9/M10 versionadas |
| R8 — no pulsables y accesibilidad | `src/screens/home/index.test.tsx`::`describe('#85 R8: las filas no son pulsables y se anuncian por partes')` | `7dac461 test(mobile-home-reminders-real-data): expose missing row labels (R8)` + `fecd8e8 feat(mobile-home-reminders-real-data): label row countdowns (R8)` |
| R9 — carga y fallo de `listReminders` | `src/screens/home/index.test.tsx`::`describe('#85 R9: la sección aguanta la carga y el fallo de los recordatorios')` | `1d8c3d5 test(mobile-home-reminders-real-data): prove reminder failures preserve vaccine slot (R9)` + `68b3d90 feat(mobile-home-reminders-real-data): preserve vaccine slot across reminder states (R9)`; sonda P9 documentada aparte de M1-M13 |
| R10 — estilo y tokens | `src/screens/home/index.test.tsx`::`describe('#85 R10: viste las filas con el Card compartido y los tokens')` | `7016683 test(mobile-home-reminders-real-data): prove countdown color means urgency (R10)` + `3b7bcfa feat(mobile-home-reminders-real-data): keep countdown urgency styling (R10)`; sonda P10 documentada aparte de M1-M13 |
| R11 — cero claves y cero ocurrencias nuevas | `src/screens/home/index.test.tsx`::`describe('#85 R1: la sección recupera su rótulo en los dos idiomas')` + seis recuentos de fuente | `ff4a627 test(mobile-home-reminders-real-data): prove english reminder copy guard (R11)` + `f80fac1 feat(mobile-home-reminders-real-data): preserve bilingual reminder copy (R11)`; M13 versionada |
| R12 — bloque de drift de estilo | `src/__tests__/design-drift.test.ts`::`describe('#85 R12: la sección de recordatorios reales no mete drift de estilo')` | `fce3ffc test(mobile-home-reminders-real-data): lock feature style drift (R12)`; sonda hex documentada en el informe |
| R13 — deltas de candados globales | candados existentes en `src/__tests__/consistency-classnames.test.ts` y recorrido de las 21 filas en el informe | `5febedb test(mobile-home-reminders-real-data): register tabular delta (R13)` |
| R14 — suite, typecheck y grep-clean | `bun run test`, `bun run typecheck`, cinco greps y `env -u FORCE_COLOR ./init.sh`; detalle en el informe §R14 | `f7814d3 docs(mobile-home-reminders-real-data): record R14 verification` |
| R15 — prueba de mutación (M1-M13) | `progress/impl_mobile-home-reminders-real-data.md` §Prueba de mutación | M1 `97e06c0`/`80595f9`; M9/M10 `4078fdc`/`c5e30e2`; M13 `ff4a627`/`f80fac1`; M2-M8/M11-M12 verificadas sin commit y restauradas con diff vacío |

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
