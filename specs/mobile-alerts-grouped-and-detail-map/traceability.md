---
feature: "mobile-alerts-grouped-and-detail-map"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-alerts-grouped-and-detail-map]]

Rutas de test relativas a `mobile-pet-tracker/`. La columna de test da el
`describe` de cada requisito (cada `it` dentro lleva el R-id por su
`describe`), comprobado con `grep -cF "describe('<nombre>'"` = 1 en
`3719eb75`; la de commit, los hashes rojo y verde.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/providers/__tests__/language-provider.test.tsx::#170 R1: claves de alertas agrupadas y mini-mapa > #170 R1: declara los 7 pares exactos y su registro` | rojo: 8caef1f0 test(mobile-alerts-grouped-and-detail-map): #170 R1 red alert grouping and mini-map keys → verde: 9e686a3e feat(mobile-alerts-grouped-and-detail-map): #170 R1 alert grouping and mini-map keys |
| R2 | `src/utils/alert-sections.test.ts::#170 R2: alertSection en hora local` | rojo: f17eb585 test(mobile-alerts-grouped-and-detail-map): #170 R2 red alertSection in local time → verde: 488db1ad feat(mobile-alerts-grouped-and-detail-map): #170 R2 alertSection in local time |
| R3 | `src/screens/alerts/index.test.tsx::#170 R3: agrupa la lista en Hoy, Esta semana y Anteriores` | rojo: fe0ca64a test(mobile-alerts-grouped-and-detail-map): #170 R3 red list sections → verde: 16e05f8e feat(mobile-alerts-grouped-and-detail-map): #170 R3 list sections; E3: 1fba836c test(mobile-alerts-grouped-and-detail-map): #170 E3 R3 section header before its first row |
| R4 | `src/screens/alerts/index.test.tsx::#170 R4: cuenta las alertas nuevas` | rojo: 6ff10527 test(mobile-alerts-grouped-and-detail-map): #170 R4 red new alerts counter → verde: cea0b4ba feat(mobile-alerts-grouped-and-detail-map): #170 R4 new alerts counter |
| R5 | `src/screens/alerts/index.test.tsx::#170 R5: la fila abierta lleva el borde de su tipo` | rojo: b86a93c8 test(mobile-alerts-grouped-and-detail-map): #170 R5 red severity border on open rows → verde: 9736d80b feat(mobile-alerts-grouped-and-detail-map): #170 R5 severity border on open rows; E3: d1ff55b6 test(mobile-alerts-grouped-and-detail-map): #170 E3 R5 R6 local ack drops the severity border |
| R6 | `src/screens/alert-detail/index.test.tsx::#170 R6: la tarjeta abierta lleva el borde de su tipo` | rojo: cc383882 test(mobile-alerts-grouped-and-detail-map): #170 R6 red severity border on open detail → verde: e661b37d feat(mobile-alerts-grouped-and-detail-map): #170 R6 severity border on open detail; E3: d1ff55b6 test(mobile-alerts-grouped-and-detail-map): #170 E3 R5 R6 local ack drops the severity border |
| R7 | `src/utils/alert-location.test.ts::#170 R7: alertPosition valida la posición del payload` + `::#170 R7: distanceMeters` + `::#170 R7: formatDistance` | rojo: 58848da1 test(mobile-alerts-grouped-and-detail-map): #170 R7 red position, distance and format → verde: 0a1d3d6d feat(mobile-alerts-grouped-and-detail-map): #170 R7 position, distance and format |
| R8 | `src/screens/alert-detail/index.test.tsx::#170 R8: pinta el mini-mapa con la posición de la alerta` | rojo: fd7a129f test(mobile-alerts-grouped-and-detail-map): #170 R8 red alert mini-map → verde: 5ecccaee feat(mobile-alerts-grouped-and-detail-map): #170 R8 alert mini-map; E2: 0359fe6c test(mobile-alerts-grouped-and-detail-map): #170 E2 pet-map double in the alert detail navigation test; E3: b91c815c test(mobile-alerts-grouped-and-detail-map): #170 E3 R8 rows without a map carry a zone |
| R9 | `src/screens/alert-detail/index.test.tsx::#170 R9: ningún fondo encima del mapa` + `src/app/__tests__/layout.test.tsx::… > #170 R9: pinta el fondo del tema bajo el detalle de alerta` (un `it` dentro de un `describe` previo) | rojo: 1affc889 test(mobile-alerts-grouped-and-detail-map): #170 R9 red no background above the map → verde: 80f3f603 feat(mobile-alerts-grouped-and-detail-map): #170 R9 no background above the map |
| R10 | `src/screens/alert-detail/index.test.tsx::#170 R10: pinta la zona y la distancia a su borde` | rojo: e1ac4901 test(mobile-alerts-grouped-and-detail-map): #170 R10 red zone and distance to its edge → verde: 7c48b404 feat(mobile-alerts-grouped-and-detail-map): #170 R10 zone and distance to its edge; E3: 4f4cfbdb test(mobile-alerts-grouped-and-detail-map): #170 E3 R10 zones come from the alert pet, dc074638 test(mobile-alerts-grouped-and-detail-map): #170 E3 R10 distance threshold rounds to the meter |
| R11 | `src/screens/alert-detail/index.test.tsx::#170 R11: sin geofenceId pinta el mapa sin zona` | 6ae611e6 test(mobile-alerts-grouped-and-detail-map): #170 R11 alert without zone (nace verde tras R10) |
| R12 | `src/screens/alert-detail/index.test.tsx::#170 R12: sin la zona de la alerta no pinta zona` | 7a03853a test(mobile-alerts-grouped-and-detail-map): #170 R12 alert zone no longer exists (nace verde tras R10) |
| R13 | `src/screens/alert-detail/index.test.tsx::#170 R13: si la consulta de zonas no da ok, mapa sin zona y sin error` | 7fbf5b31 test(mobile-alerts-grouped-and-detail-map): #170 R13 zone query not ok (nace verde tras R10) |
| R14 | `src/screens/alert-detail/index.test.tsx::#170 R14: dentro o en el borde no dice distancia` | dfa09ead test(mobile-alerts-grouped-and-detail-map): #170 R14 inside or on the edge (nace verde tras R10) |
| R15 | `src/screens/alert-detail/index.test.tsx::#170 R15: Ver en el mapa lleva al Mapa con la mascota de la alerta` | rojo: 0d90d684 test(mobile-alerts-grouped-and-detail-map): #170 R15 red view on map CTA → verde: e63bbba4 feat(mobile-alerts-grouped-and-detail-map): #170 R15 view on map CTA; E3: 3361aea0 test(mobile-alerts-grouped-and-detail-map): #170 E3 R15 view on map CTA keeps min-h-11 |
| R16 | `src/__tests__/ui-language.test.ts` (R12/R13) + `src/__tests__/consistency-classnames.test.ts` (`#62 R14`, `#62 R15` › `#69 R10: mantiene la base cerrada más los deltas medidos`, `#98 R10`, `#166 R3`), sin `it` propio: comentarios `// #170 R16` en las cuentas que mueve, como prescribe tasks.md | fe0ca64a test(mobile-alerts-grouped-and-detail-map): #170 R3 red list sections; 6ff10527 test(mobile-alerts-grouped-and-detail-map): #170 R4 red new alerts counter; fd7a129f test(mobile-alerts-grouped-and-detail-map): #170 R8 red alert mini-map; e1ac4901 test(mobile-alerts-grouped-and-detail-map): #170 R10 red zone and distance to its edge; 0d90d684 test(mobile-alerts-grouped-and-detail-map): #170 R15 red view on map CTA |
| R17 | prueba de humo en dev build de Android (humano), casilla `## Smoke R17` de requirements.md | firmada por el humano el 2026-10-13 (OnePlus Nord 5, tema claro y oscuro): `33a4bcde Record Android R17 smoke verification` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(mobile-alerts-grouped-and-detail-map): #170 R<n> red …`
seguido de `feat(mobile-alerts-grouped-and-detail-map): #170 R<n> …`.

El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
