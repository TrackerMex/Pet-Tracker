---
feature: "mobile-canvas-foundations"
status: approved
tags: [mobile, ui, traceability]
---

# Trazabilidad — [[mobile-canvas-foundations]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | src/__tests__/canvas-foundations.test.ts::#197 R1; src/theme/__tests__/global-css.test.ts::paleta light/espejos (enmendado por #197 R1) | 03de724e test(#197): R1 lock light colors to frozen canvas<br>28fa2d22 feat(#197): R1 align light semantic colors with canvas |
| R2 | src/__tests__/canvas-foundations.test.ts::#197 R2; src/theme/__tests__/global-css.test.ts::#61 R5 y #64 R4 (enmendado por #197 R2) | f0aa3db8 test(#197): R2 verify updated state color contrast |
| R3 | src/__tests__/canvas-foundations.test.ts::#197 R3; src/theme/__tests__/global-css.test.ts::#197 R3 | 4a792781 test(#197): R3 lock canvas tracking and line heights<br>3bfbbebf feat(#197): R3 add canvas typography tokens |
| R4 | src/__tests__/canvas-foundations.test.ts::#197 R4; src/__tests__/tab-headers-canvas.test.ts::#168 R1; src/__tests__/alerts-canvas-fidelity.test.ts::#174 R12; src/app/(tabs)/__tests__/food.test.tsx, src/screens/profile/index.test.tsx, src/screens/health/index.test.tsx::pinta el título grande; src/components/__tests__/celebration.test.tsx::R20.4 (enmendados por #197 R4) | c702f6fd test(#197): R4 align title tracking guards with canvas<br>1fa7db78 feat(#197): R4 use canvas tracking for large titles |
| R5 | src/__tests__/canvas-foundations.test.ts::#197 R5; src/theme/__tests__/global-css.test.ts::#197 R5 | f6fc598c test(#197): R5 lock new lip colors in both themes<br>3a05751e feat(#197): R5 add canvas lip tokens in both themes |
| R6 | src/__tests__/canvas-foundations.test.ts::#197 R6; src/theme/__tests__/chunky-lip.test.tsx::#197 R6 y #177 R2.1 (enmendado por #197 R6) | 76f76621 test(#197): R6 cover all eleven canvas lip variants<br>7f242bc7 feat(#197): R6 expand memoized canvas lip catalogue |
| R7 | src/screens/add-reminder/index.test.tsx::#178 R10 y #123 R5 (enmendados por #197 R7); constante CHIP_SELECTED de expectAdvanceChips (#125 R3/R4/R6 y #178 R12, 17 casos) | d8c65463 test(#197): R7 require external lips on selected reminder chips<br>d285ec01 test(#197): R7 amend CHIP_SELECTED for the lip-less selected chip<br>885bca96 feat(#197): R7 render reminder chip lips outside their bodies |
| R8 | src/screens/alerts/index.test.tsx::#78 R6 (enmendado por #197 R8); src/__tests__/consistency-classnames.test.ts::#174 R8 (enmendado por #197 R8) | 871ac40f test(#197): R8 require compact external lips on alert acknowledgements<br>58a976b0 test(#197): R8 limit amended titles to acknowledgement assertions<br>14acfd53 feat(#197): R8 apply compact neutral lips to alert rows |
| R9 | src/screens/meal-schedule/index.test.tsx::#147 R4, #179 R5/R6/R7 (enmendados por #197 R9); src/__tests__/consistency-classnames.test.ts::esquinas directas, suma y guard global (enmendados por #197 R9) | f2a479a8 test(#197): R9 lock meal schedule body heights and external lips<br>af69e294 test(#197): R9 count actual corner uses in the aggregate guard<br>3156ffa6 feat(#197): R9 move meal schedule lips outside canvas body heights |
| R10 | src/__tests__/canvas-foundations.test.ts::#197 R10; src/__tests__/chunky-cta-canvas-fidelity.test.ts::#197 R10 y #177 R7/R8/R12; src/__tests__/consistency-classnames.test.ts::#166 R2/R3; src/__tests__/alerts-canvas-fidelity.test.ts::#174 R12 (enmendados por #197 R10) | 584d92d3 test(#197): R10 close external lip inventories and guards |
| R11 | src/theme/__tests__/motion.test.ts::#197 R11 y #152 R1 inventario (enmendado por #197 R11); src/__tests__/canvas-foundations.test.ts::#197 R11 | 26f7b406 test(#197): R11 pin rise motion to frozen canvas values<br>36cde247 feat(#197): R11 export the canvas rise timing and offset |
| R12 | src/screens/home/home-entrance.test.tsx::#152 R3/R4 (cuatro it enmendados por #197 R12) | 1218c3d4 test(#197): R12 require timing-based staggered home entrances<br>7f4c87ee feat(#197): R12 animate home entrances with the canvas rise timing |
| R13 | src/screens/home/home-entrance.test.tsx::#152 R4 reduce motion; src/screens/home/index.test.tsx::#190 R1/R7 y #152 R7 (enmendados por #197 R13) | 4957fab0 test(#197): R13 require no home entrance under reduced motion<br>fea73469 feat(#197): R13 omit home entrance animations under reduced motion |
| R14 | src/theme/__tests__/global-css.test.ts::#197 R14; src/__tests__/canvas-foundations.test.ts::#197 R14 | 36ccb4e5 test(#197): R14 bind shadow colors to both canvas themes<br>4cdcb891 feat(#197): R14 add semantic shadow tokens for both themes |
| R15 | src/theme/__tests__/shadows.test.tsx::#197 R15 (13 casos); src/__tests__/canvas-foundations.test.ts::#197 R15 (10 filas) | db896099 test(#197): R15 cover the canvas shadow catalogue and memoization<br>26273b33 test(#197): R15 verify each shadow color dependency independently<br>a250f6da feat(#197): R15 add the memoized canvas shadow catalogue |
| R16 | src/components/__tests__/toggle-switch.test.tsx::#197 R16; src/__tests__/canvas-foundations.test.ts::#197 R16 | 4576ab78 test(#197): R16 pin switch geometry and forwarded props<br>8eae2efb feat(#197): R16 add the canvas toggle switch wrapper |
| R17 | src/components/__tests__/toggle-switch.test.tsx::#197 R17 | c456bd7e test(#197): R17 verify controlled and disabled switch interactions |
| R18 | src/components/__tests__/back-button.test.tsx::#197 R18 | f25046b2 test(#197): R18 cover optional back chevron stroke width<br>ec1f969c feat(#197): R18 forward optional chevron stroke width |
| R19 | src/components/__tests__/screen-header.test.tsx::#197 R19; src/__tests__/canvas-foundations.test.ts::#197 R19; src/__tests__/profile-canvas-fidelity.test.ts::#173 R2.4 y src/__tests__/alerts-canvas-fidelity.test.ts::#174 R12 (enmendados por #197 R19) | 98cf944b test(#197): R19 lock the content header structure and typography<br>6cd3b1d8 test(#197): R19 assert accessory presence before its row position<br>67c55afb feat(#197): R19 add the canvas content header component |
| R20 | src/__tests__/canvas-foundations.test.ts::#197 R20; src/__tests__/legibility-classnames.test.ts::accent (enmendado por #197 R20) | 66f9d00f test(#197): R20 keep the new foundations unwired |
| R21 | src/__tests__/canvas-foundations.test.ts::#197 R21; src/__tests__/design-drift.test.ts::#178 R2/#179 R2; src/__tests__/chunky-cta-canvas-fidelity.test.ts::#177 R11.1; src/__tests__/alerts-canvas-fidelity.test.ts::#174 R11 (enmendados por #197 R21) | 9c2d837b test(#197): R21 require the canonical canvas charter amendment<br>66065bef feat(#197): R21 apply the canonical canvas foundations charter |
| R22 | src/__tests__/canvas-foundations.test.ts::#197 R22 (11 casos) | e74076a9 test(#197): R22 guard clean sources and unchanged dependency counts |
| R23 | smoke humano (requirements.md § Cierre del humano) | pendiente |

Regla: el reviewer no aprueba si alguna fila de R1 a R22 queda "pendiente";
R23 la cierra el humano tras el veredicto.
Convención de commit: `test(#197): <desc> (R<n>)` para el rojo y
`feat(#197): <desc> (R<n>)` para el verde; la fila cita los dos hashes.
Rutas de test relativas a `mobile-pet-tracker/`. El implementer actualiza esta
tabla tras cada commit y no rebasea después de rellenarla; el reviewer la
valida al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).


## Verificación final del implementador — bloqueada

R1–R22 tienen implementación, tests de requisito verdes y commits test/feat
separados. **La suite global no está verde**: 140 suites pasan, una falla;
4675 tests pasan, dos fallan (4677 total), snapshot 1/1.

Los dos fallos están en src/__tests__/home-photo-hero-canvas.test.ts,
fuera de la lista cerrada del handoff:

- #195 R17, mantiene referencias y suelos en light: el nuevo danger de R1
  da 4.831413489227404 sobre blanco; la referencia es 3.76 (tolerancia 0.05).
  El contraste mejora, pero falla el candado numérico.
- #195 R20, añade una sola sección completa y es la última cabecera de nivel dos:
  exige que #195 sea la última sección y compara su slice hasta EOF. R21
  exige añadir #197 al final conservando #195 intacta. Falta autorizar la
  delimitación de la sección antigua y la actualización del ancla final.

No se modifica ese archivo ni se declara la feature done. El leader debe
autorizarlo e inventariar ambas enmiendas. No se altera producción para
satisfacer expectativas que contradicen R1/R21. R23 sigue siendo humano.

Reporte: progress/impl_mobile-canvas-foundations.md.
Log: progress/final-test-197.log. Tipos, lint y las nueve guardas pasan;
graphify update termina con exit 0.
