---
feature: "mobile-alerts-attended-section"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-alerts-attended-section]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `hooks/use-alerts-list.test.tsx::#223 R1: con drain pide cada página con su cursor, de una en una, hasta nextCursor null` | test `9c2af9ee` — test(mobile): drain option fetches each page with its cursor (R1); feat / comportamiento existente `71145acb` — feat(mobile): drain option fetches each page with its cursor (R1) |
| R2 | `hooks/use-alerts-list.test.tsx::#223 R2: sin drain pide una sola página aunque haya nextCursor y usa la clave ['alerts','list']` | test `32e74712` — test(mobile): hook without drain and non-ok pages stop the drain (R2, R3); feat / comportamiento existente `71145acb` — feat(mobile): drain option fetches each page with its cursor (R1); test nacido verde, sonda de mutación documentada en el reporte |
| R3 | `hooks/use-alerts-list.test.tsx::#223 R3: %s corta el drenado y conserva las páginas previas` | test `32e74712` — test(mobile): hook without drain and non-ok pages stop the drain (R2, R3); feat / comportamiento existente `71145acb` — feat(mobile): drain option fetches each page with its cursor (R1); el corte de páginas no-ok ya existía en H0 |
| R4 | `screens/alerts/index.test.tsx::#223 R4: data contiene solo las abiertas, por sección y en el orden del servidor` | test `35724cfb` — test(mobile): alerts data holds only open alerts, by section (R4); feat / comportamiento existente `b37242bc` — feat(mobile): alerts screen lists only open alerts and drains the list (R4) |
| R5 | `screens/alerts/index.test.tsx::#223 R5: la insignia espera al último cursor y suma las abiertas de todas las páginas` | test `a35ad7e3` — test(mobile): badge waits for the last cursor and sums every page (R5); feat / comportamiento existente `78b56b5b` — feat(mobile): badge appears only once the list is settled (R5) |
| R6 | `screens/alerts/index.test.tsx::#223 R6: la fila marcada leída conserva su sitio y pasa a Atendidas en el siguiente refetch` | test `bb171825` — test(mobile): marking read keeps the row and moves it to Attended after refetch (R6); feat / comportamiento existente `2a5b6b46` — feat(mobile): collapsed Attended section with total count (R7); test nacido verde, sonda de mutación documentada en el reporte |
| R7 | `screens/alerts/index.test.tsx::#223 R7: pinta «Atendidas» colapsada con su contador solo asentada y con atendidas` | test `77223d02` — test(mobile): collapsed Attended section with total count (R7); feat / comportamiento existente `2a5b6b46` — feat(mobile): collapsed Attended section with total count (R7) |
| R8 | `screens/alerts/index.test.tsx::#223 R8: el encabezado alterna la sección y recuerda cuántas filas había (enmendado por #223 R18)` | test `faf1da24` — test(mobile): Show more adds ten rows and the footer counts shown of total (R10); feat / comportamiento existente `d1019fe5` — feat(mobile): Show more adds ten rows and the footer counts shown of total (R10) |
| R9 | `screens/alerts/index.test.tsx::#223 R9: la fila atendida es compacta, sin ack y abre su detalle` | test `438f7a13` — test(mobile): compact attended row without ack that opens the detail (R9); feat / comportamiento existente `ab097e6b` — feat(mobile): compact attended row without ack that opens the detail (R9) |
| R10 | `screens/alerts/index.test.tsx::#223 R10: «Ver más» suma 10 y el pie cuenta N de M` | test `faf1da24` — test(mobile): Show more adds ten rows and the footer counts shown of total (R10); feat / comportamiento existente `d1019fe5` — feat(mobile): Show more adds ten rows and the footer counts shown of total (R10) |
| R11 | `screens/alerts/index.test.tsx::#223 R11: sin abiertas pinta «Todo en calma» con el nombre de la mascota más reciente` | test `c829a943` — test(mobile): all-calm card when there are no open alerts (R11); feat / comportamiento existente `fa521ba4` — feat(mobile): all-calm card when there are no open alerts (R11) |
| R12 | `screens/alerts/index.test.tsx::#223 R12: sin alertas conserva el vacío de Pingo y el error de la primera página conserva el reintento` | test `c7ac09a1` — test(mobile): no alerts keeps the Pingo empty state and the first-page error keeps the retry (R12); feat / comportamiento existente `fa521ba4` — feat(mobile): all-calm card when there are no open alerts (R11); test nacido verde, sonda de mutación documentada en el reporte |
| R13 | `screens/alerts/index.test.tsx::#223 R13: mientras drena sin abiertas pinta el esqueleto, no el vacío ni la tarjeta de calma` | test `6ab0dd22` — test(mobile): skeleton while draining with no open alerts yet (R13); feat / comportamiento existente `3dcf1d53` — feat(mobile): skeleton while the list drains with no open alerts yet (R13) |
| R14 | `screens/alerts/index.test.tsx::#223 R14: si falla la segunda página conserva lo descargado, muestra el error y no pide más` | test `33b2db81` — test(mobile): a late page failure keeps the downloaded alerts and shows the error (R14); feat / comportamiento existente `2a5b6b46` — feat(mobile): collapsed Attended section with total count (R7); test nacido verde, sonda de mutación documentada en el reporte |
| R15 | `screens/alerts/index.test.tsx::#223 R15: la lista no declara onEndReached y el drenado pide las páginas` | test `5c45080a` — test(mobile): the alerts list no longer declares onEndReached (R15); feat / comportamiento existente `cb7a45f9` — feat(mobile): remove onEndReached from the alerts list (R15) |
| R16 | `__tests__/alerts-attended-canvas-fidelity.test.ts::#223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una` | test `95f7aa9a` — test(mobile): attended-section copy keys exist in both languages (R16); feat / comportamiento existente `fa521ba4` — feat(mobile): all-calm card when there are no open alerts (R11) |
| R17 | `__tests__/alerts-attended-canvas-fidelity.test.ts::#223 R17: grep-limpio` y `#223 R17: las dianas táctiles llegan a 44 pt`, más los 18 tests de clases de R17 del mismo archivo | test `f1526efa` — test(mobile): attended section classes are clean and targets reach 44 pt (R17); feat / comportamiento existente `fa521ba4` — feat(mobile): all-calm card when there are no open alerts (R11) |
| R18 | `suite completa verde + __tests__/alerts-attended-canvas-fidelity.test.ts::#223 R18: los candados enmendados nombran su enmienda` | test `71c41948` — test(mobile): amended locks name their amendment (R18); enmienda `e6063116` — test(mobile): detail navigation reaches attended alerts (R18) |
| R19 | pendiente: G4; no se creó el test ni se enmendó la carta | pendiente: G4 |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" (R19 incluida,
una vez firmada la casilla G4; si el humano no firma G4, se deja constancia
explícita y el leader decide el cierre).
Convención de commit: `feat(mobile): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
Cuidado: no rebasear tras escribir los hashes.
