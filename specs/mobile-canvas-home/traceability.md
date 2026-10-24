---
feature: "mobile-canvas-home"
status: approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-canvas-home]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/screens/home/index.test.tsx::#198 R1 viste summary-card con padding 14/8, hueco 12 y la sombra card` | `b28c3b7c feat(#198): R1 match summary card to canvas` |
| R2 | `src/screens/home/index.test.tsx::#198 R2 da a cada mosaico su hueco y su tinta` | `5512133c feat(#198): R2 render the summary metric tiles` |
| R3 | `src/screens/home/index.test.tsx::#198 R3 ordena círculo, columna de estado y barra, y porcentaje` | `05ef6a2c feat(#198): R3 compose the collar status and battery row` |
| R4 | `src/screens/home/index.test.tsx::#198 R4 tiñe barra y cifra por umbral ($pct)` | `97e88f32 feat(#198): R4 match battery size and semantic colors` |
| R5 | `src/screens/home/index.test.tsx::#198 R5 viste cada tile con 92 de alto, radio 20 y su labio interior ($id)` | `3f632c3b feat(#198): R5 apply the quick action canvas tiles` |
| R6 | `src/screens/home/index.test.tsx::#198 R6 escalona los bloques con los retardos del canvas` | `3d899f91 feat(#198): R6 use the canvas entrance indices` |
| R7 | `src/screens/home/weekly-activity-chart.test.tsx::#198 R7 viste la tarjeta con padding 14/16 y la sombra card` | `da6fe70a feat(#198): R7 apply the weekly card canvas surface` |
| R8 | `src/screens/home/weekly-activity-chart.test.tsx::#198 R8 pinta la métrica elegida con 12/800 en accent-strong` | `22996eef feat(#198): R8 style metric selection and tooltip emphasis` |
| R9 | `src/screens/home/weekly-activity-chart.test.tsx::#198 R9 atenúa a 0.35 las barras no seleccionadas` | `40fdc7be feat(#198): R9 apply bar selection opacity and day detail styling` |
| R10 | `src/screens/home/index.test.tsx::#198 R10 viste cada fila como tarjeta con la sombra card ($testID)` | `ad3078ed feat(#198): R10 apply reminder card shadows and typography` |
| R11 | `src/screens/home/index.test.tsx::#198 R11 viste la última posición sin borde ni sombra` | `53f7629d feat(#198): R11 apply the last position canvas surface` |
| R12 | `src/__tests__/home-canvas-fidelity.test.ts::#198 R12 solo Inicio y su gráfica importan las sombras en esta feature` | `4b512015 test(#198): R12 lock the two home shadow imports` |
| R13 | `src/screens/home/index.test.tsx::#198 R13 pinta el collar sin dispositivo en columna` | `55689d42 feat(#198): R13 apply the no-collar canvas layout` |
| R14 | `src/screens/home/index.test.tsx::#198 R14 pinta el esqueleto con la forma del canvas y sin título` | `0fbebebd feat(#198): R14 render the canvas loading skeleton` |
| R15 | `src/components/__tests__/empty-state-hero.test.tsx::#198 R15 tone danger pinta disco rosa, huellas danger y título de 22` | `1d1a90b8 feat(#198): R15 render the home error hero with danger tone`; inventario: `6d0264a5 test(#198): R15 amend the catalog key inventory` |
| R16 | `src/screens/home/index.test.tsx::#198 R16 conserva el vacío hero sin badge ni tono de error` | `c8ea9185 test(#198): R16 preserve the existing home empty hero` |
| R17 | `src/__tests__/home-canvas-fidelity.test.ts::#198 R17 $artboard dibuja «$canvas» y $file lo aplica` | `cd75ab9b test(#198): R17 lock all 46 frozen canvas literals` |
| R18 | `src/components/__tests__/empty-state-hero.test.tsx::#198 R18 el badge es el último hijo del escenario` | `81166c33 feat(#198): R18 add optional empty state badge icon and body` |

Cada R tiene más `it` (requirements §Requisitos); la fila cita el principal. Los hashes se rellenan al cerrar; no rebasear después.

Cierre del leader (2026-10-24): el `./init.sh` del leader sobre `158f4e91` sale con exit 0 (móvil 144/144 suites, 4875/4875 tests, 1 snapshot; 0 `^FAIL`), y los rojos de tinte `#0D1117` de la suite de Codex no se reproducen. Reviewer APROBADO sobre `158f4e91` (`progress/review_mobile-canvas-home.md`). Los candados de R16 (N9) y de la cláusula «únicos» de R12 (N10) son los prescritos y no detectan las mutaciones del reviewer; queda como deuda de spec. El smoke de R1, R3 a R7, R10, R11 y R13 a R16 lo cierra el humano en el lote `progress/smoke_canvas-parity.md` (plan §6).
