---
feature: "mobile-canvas-home"
status: approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-canvas-home]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/screens/home/index.test.tsx::#198 R1 viste summary-card con padding 14/8, hueco 12 y la sombra card` | pendiente |
| R2 | `src/screens/home/index.test.tsx::#198 R2 da a cada mosaico su hueco y su tinta` | pendiente |
| R3 | `src/screens/home/index.test.tsx::#198 R3 ordena círculo, columna de estado y barra, y porcentaje` | pendiente |
| R4 | `src/screens/home/index.test.tsx::#198 R4 tiñe barra y cifra por umbral ($pct)` | pendiente |
| R5 | `src/screens/home/index.test.tsx::#198 R5 viste cada tile con 92 de alto, radio 20 y su labio interior ($id)` | pendiente |
| R6 | `src/screens/home/index.test.tsx::#198 R6 escalona los bloques con los retardos del canvas` | pendiente |
| R7 | `src/screens/home/weekly-activity-chart.test.tsx::#198 R7 viste la tarjeta con padding 14/16 y la sombra card` | pendiente |
| R8 | `src/screens/home/weekly-activity-chart.test.tsx::#198 R8 pinta la métrica elegida con 12/800 en accent-strong` | pendiente |
| R9 | `src/screens/home/weekly-activity-chart.test.tsx::#198 R9 atenúa a 0.35 las barras no seleccionadas` | pendiente |
| R10 | `src/screens/home/index.test.tsx::#198 R10 viste cada fila como tarjeta con la sombra card ($testID)` | pendiente |
| R11 | `src/screens/home/index.test.tsx::#198 R11 viste la última posición sin borde ni sombra` | pendiente |
| R12 | `src/__tests__/home-canvas-fidelity.test.ts::#198 R12 solo Inicio y su gráfica importan las sombras en esta feature` | pendiente |
| R13 | `src/screens/home/index.test.tsx::#198 R13 pinta el collar sin dispositivo en columna` | pendiente |
| R14 | `src/screens/home/index.test.tsx::#198 R14 pinta el esqueleto con la forma del canvas y sin título` | pendiente |
| R15 | `src/components/__tests__/empty-state-hero.test.tsx::#198 R15 tone danger pinta disco rosa, huellas danger, badge y título de 22` | pendiente |
| R16 | `src/screens/home/index.test.tsx::#198 R16 conserva el vacío hero sin badge ni tono de error` | pendiente |
| R17 | `src/__tests__/home-canvas-fidelity.test.ts::#198 R17 $artboard dibuja «$canvas» y $file lo aplica` | pendiente |

Cada R tiene más `it` (requirements §Requisitos); la fila cita el principal. Los hashes se rellenan al cerrar; no rebasear después.
