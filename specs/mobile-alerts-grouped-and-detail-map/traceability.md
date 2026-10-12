---
feature: "mobile-alerts-grouped-and-detail-map"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-alerts-grouped-and-detail-map]]

Rutas de test relativas a `mobile-pet-tracker/`. La columna de test da el
`describe` previsto en tasks.md; el implementer la completa con el nombre
exacto de cada `it` y el hash de sus commits rojo y verde.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/providers/__tests__/language-provider.test.tsx::#170 R1: declara los 7 pares exactos y su registro` (pendiente) | pendiente |
| R2 | `src/utils/alert-sections.test.ts::#170 R2: alertSection en hora local` (pendiente) | pendiente |
| R3 | `src/screens/alerts/index.test.tsx::#170 R3: agrupa la lista en Hoy, Esta semana y Anteriores` (pendiente) | pendiente |
| R4 | `src/screens/alerts/index.test.tsx::#170 R4: cuenta las alertas nuevas` (pendiente) | pendiente |
| R5 | `src/screens/alerts/index.test.tsx::#170 R5: la fila abierta lleva el borde de su tipo` (pendiente) | pendiente |
| R6 | `src/screens/alert-detail/index.test.tsx::#170 R6: la tarjeta abierta lleva el borde de su tipo` (pendiente) | pendiente |
| R7 | `src/utils/alert-location.test.ts::#170 R7: alertPosition / distanceMeters / formatDistance` (pendiente) | pendiente |
| R8 | `src/screens/alert-detail/index.test.tsx::#170 R8: pinta el mini-mapa con la posición de la alerta` (pendiente) | pendiente |
| R9 | `src/screens/alert-detail/index.test.tsx::#170 R9: ningún fondo encima del mapa` + `src/app/__tests__/layout.test.tsx::#170 R9: pinta el fondo del tema bajo el detalle de alerta` (pendiente) | pendiente |
| R10 | `src/screens/alert-detail/index.test.tsx::#170 R10: pinta la zona y la distancia a su borde` (pendiente) | pendiente |
| R11 | `src/screens/alert-detail/index.test.tsx::#170 R11: sin geofenceId pinta el mapa sin zona` (pendiente) | pendiente |
| R12 | `src/screens/alert-detail/index.test.tsx::#170 R12: sin la zona de la alerta no pinta zona` (pendiente) | pendiente |
| R13 | `src/screens/alert-detail/index.test.tsx::#170 R13: si la consulta de zonas no da ok, mapa sin zona y sin error` (pendiente) | pendiente |
| R14 | `src/screens/alert-detail/index.test.tsx::#170 R14: dentro o en el borde no dice distancia` (pendiente) | pendiente |
| R15 | `src/screens/alert-detail/index.test.tsx::#170 R15: Ver en el mapa lleva al Mapa con la mascota de la alerta` (pendiente) | pendiente |
| R16 | `src/__tests__/ui-language.test.ts` (R12/R13) + `src/__tests__/consistency-classnames.test.ts` (#62 R14/R15, #69 R10, #166 R3) (pendiente) | pendiente |
| R17 | pendiente (humano): smoke en dev build de Android, casilla `## Smoke R17` de requirements.md | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(mobile-alerts-grouped-and-detail-map): #170 R<n> red …`
seguido de `feat(mobile-alerts-grouped-and-detail-map): #170 R<n> …`.

El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
