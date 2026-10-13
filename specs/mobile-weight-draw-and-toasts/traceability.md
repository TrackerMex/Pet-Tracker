---
feature: "mobile-weight-draw-and-toasts"
status: draft        # draft | approved
tags: [mobile, ui, motion, spec]
---

# Trazabilidad — [[mobile-weight-draw-and-toasts]] (#169)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/components/__tests__/weight-chart.test.tsx::#169 R1: la línea se dibuja al montarse` (con la Enmienda E1, incluye `con progreso 0.25 el desplazamiento es tres cuartos de L`, `con tres pesos no alineados la longitud es la suma de los dos segmentos` y `p parte de 0: con una animación que no avanza, la línea y los puntos siguen ocultos`; con la Enmienda E2, `con tres pesos no alineados y progreso 0.25 el desplazamiento es tres cuartos de la suma de los segmentos`) | rojo → verde: `98db0006 test(mobile): la línea de la gráfica de peso se dibuja (#169 R1)` → `ba30d410 feat(mobile): dibujo de la línea de peso con strokeDashoffset (#169 R1)`; Enmienda E1: `ab183a46 test(mobile): progreso intermedio, longitud y origen del dibujo de la gráfica de peso (#169 R1, R2)` → `cbbe7986 feat(mobile): la gráfica de peso vuelve a dibujarse en continuo desde 0 (#169 R1, R2)`; sondas M2 y H1b; Enmienda E2: `b03fe344 test(mobile): el desplazamiento del dibujo usa la suma de los segmentos (#169 R1)` → `27f256e1 feat(mobile): el desplazamiento del dibujo vuelve a usar la suma de los segmentos (#169 R1)`; sondas X3b, H1 y H1b |
| R2 | `src/components/__tests__/weight-chart.test.tsx::#169 R2: los puntos aparecen con el mismo progreso` (con la Enmienda E1, incluye `con progreso 0.25 la opacidad de los puntos es 0.25`; el origen `0` de la opacidad lo vigila el `it` `p parte de 0` de R1) | rojo → verde: `9d4c3b51 test(mobile): los puntos de peso aparecen con el trazo (#169 R2)` → `af6322d5 feat(mobile): puntos de peso con opacidad animada (#169 R2)`; Enmienda E1: `ab183a46 test(mobile): progreso intermedio, longitud y origen del dibujo de la gráfica de peso (#169 R1, R2)` → `cbbe7986 feat(mobile): la gráfica de peso vuelve a dibujarse en continuo desde 0 (#169 R1, R2)`; sondas M2 y H1b |
| R3 | `src/components/__tests__/weight-chart.test.tsx::#169 R3: bajo reduce motion la gráfica sale completa` (con la Enmienda E1, incluye `p arranca en 1 bajo reduce motion`) | rojo → verde: `e68d6579 test(mobile): la gráfica de peso respeta reduce motion (#169 R3)` → `8aaab5bc feat(mobile): reduce motion en el dibujo de la gráfica (#169 R3)`; Enmienda E1: `cf038d68 test(mobile): bajo reduce motion el progreso del dibujo arranca en 1 (#169 R3)` → `59cef5a9 feat(mobile): bajo reduce motion la gráfica vuelve a arrancar completa (#169 R3)` |
| R4 | `src/components/__tests__/weight-chart.test.tsx::#169 R4: cuándo se vuelve a dibujar` | `9f78ebbc test(mobile): la gráfica de peso no repite el dibujo al cambiar datos (#169 R4)`; nace verde; sondas S4a y S4b |
| R5 | `src/utils/monthly-weight-delta.test.ts::#169 R5: monthlyWeightDelta` (filas 1-11; con la Enmienda E1, filas 12-15) | rojo → verde: `5830f1cf test(mobile): delta mensual de peso en cliente (#169 R5)` → `f1df1f73 feat(mobile): monthlyWeightDelta (#169 R5)`; Enmienda E1: `feee3406 test(mobile): el delta del mes elige por posición y redondea a 2 decimales (#169 R5)` → `0697b117 feat(mobile): monthlyWeightDelta vuelve a elegir por posición y a redondear a 2 decimales (#169 R5)`; sondas M3a-M3d y H3b |
| R6 | `src/screens/weight-log/index.test.tsx::#169 R6: resumen del peso en la card de la gráfica` | rojo → verde: `b10d1dab test(mobile): resumen de peso actual y delta del mes (#169 R6)` → `825abbc7 feat(mobile): resumen de peso en la card de la gráfica (#169 R6)` |
| R7 | `src/screens/weight-log/index.test.tsx::#169 R7: tono del delta del mes` | rojo → verde: `d5dc7b21 test(mobile): tono del delta mensual de peso (#169 R7)` → `250a45b5 feat(mobile): color e icono del delta mensual (#169 R7)`; refactor: `4c627233 refactor(mobile): tono compartido entre filas y resumen de peso (#169 R7)` |
| R8 | `src/screens/weight-log/index.test.tsx::#169 R8: chip de delta por entrada` | rojo → verde: `6569bd89 test(mobile): candado del chip de delta por entrada de peso (#169 R8)` → `b294c719 feat(mobile): testIDs del chip de delta por entrada (#169 R8)` |
| R9 | `src/providers/__tests__/language-provider.test.tsx::#169 R9: claves de peso nuevas` | rojo → verde: `c832b4d8 test(mobile): claves de catálogo del resumen y el toast de peso (#169 R9)` → `9c9c9382 feat(mobile): claves weightLog.weightLogged y monthDelta (#169 R9)` |
| R10 | `src/screens/weight-log/index.test.tsx::#169 R10: toast y háptico tras un alta correcta` | rojo → verde: `467b3551 test(mobile): toast y háptico al registrar un peso (#169 R10)` → `04a9bbf4 feat(mobile): toast y háptico tras registrar un peso (#169 R10)` |
| R11 | `src/screens/weight-log/index.test.tsx::#169 R11: ni toast ni háptico fuera de la rama ok` | `c8c9dfbb test(mobile): sin toast ni háptico en altas fallidas (#169 R11)`; nace verde; sonda S11 |
| R12 | `src/screens/weight-log/index.test.tsx::#169 R12: el toast se va solo` | rojo → verde: `e4f543df test(mobile): el toast de peso se oculta solo (#169 R12)` → `926968a3 feat(mobile): auto-ocultado del toast de peso (#169 R12)` |
| R13 | `src/screens/weight-log/index.test.tsx::#169 R13: movimiento del toast` | rojo → verde: `7edd9fac test(mobile): fundido de entrada y salida del toast de peso (#169 R13)` → `ea4f372d feat(mobile): toast de peso con FadeIn y FadeOut (#169 R13)` |
| R14 | pendiente (prueba de humo humana, dev build de Android) | pendiente (firma humana en requirements.md §Aprobación) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente", salvo R14,
que la cierra el humano después del veredicto.

En R4 y R11 (filas que nacen verdes), la columna Commit cita el commit de
tests y la sonda apuntada en `progress/impl_mobile-weight-draw-and-toasts.md`.

Convención de commit: `feat(<scope>): <desc> (R1,R2)`.

El implementer actualiza esta tabla tras cada commit, y el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
