---
feature: "mobile-alerts-attended-section"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-alerts-attended-section]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente — `hooks/use-alerts-list.test.tsx::#223 R1: con drain pide cada página con su cursor, de una en una, hasta nextCursor null` | pendiente |
| R2 | pendiente — `hooks/use-alerts-list.test.tsx::#223 R2: sin drain pide una sola página aunque haya nextCursor y usa la clave ['alerts','list']` | pendiente |
| R3 | pendiente — `hooks/use-alerts-list.test.tsx::#223 R3: %s corta el drenado y conserva las páginas previas` | pendiente |
| R4 | pendiente — `screens/alerts/index.test.tsx::#223 R4: data contiene solo las abiertas, por sección y en el orden del servidor` | pendiente |
| R5 | pendiente — `screens/alerts/index.test.tsx::#223 R5: la insignia espera al último cursor y suma las abiertas de todas las páginas` | pendiente |
| R6 | pendiente — `screens/alerts/index.test.tsx::#223 R6: la fila marcada leída conserva su sitio y pasa a Atendidas en el siguiente refetch` | pendiente |
| R7 | pendiente — `screens/alerts/index.test.tsx::#223 R7: pinta «Atendidas» colapsada con su contador solo asentada y con atendidas` | pendiente |
| R8 | pendiente — `screens/alerts/index.test.tsx::#223 R8: el encabezado alterna la sección y recuerda cuántas filas había` | pendiente |
| R9 | pendiente — `screens/alerts/index.test.tsx::#223 R9: la fila atendida es compacta, sin ack y abre su detalle` | pendiente |
| R10 | pendiente — `screens/alerts/index.test.tsx::#223 R10: «Ver más» suma 10 y el pie cuenta N de M` | pendiente |
| R11 | pendiente — `screens/alerts/index.test.tsx::#223 R11: sin abiertas pinta «Todo en calma» con el nombre de la mascota más reciente` | pendiente |
| R12 | pendiente — `screens/alerts/index.test.tsx::#223 R12: sin alertas conserva el vacío de Pingo y el error de la primera página conserva el reintento` | pendiente |
| R13 | pendiente — `screens/alerts/index.test.tsx::#223 R13: mientras drena sin abiertas pinta el esqueleto, no el vacío ni la tarjeta de calma` | pendiente |
| R14 | pendiente — `screens/alerts/index.test.tsx::#223 R14: si falla la segunda página conserva lo descargado, muestra el error y no pide más` | pendiente |
| R15 | pendiente — `screens/alerts/index.test.tsx::#223 R15: la lista no declara onEndReached y el drenado pide las páginas` | pendiente |
| R16 | pendiente — `__tests__/alerts-attended-canvas-fidelity.test.ts::#223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una` | pendiente |
| R17 | pendiente — `__tests__/alerts-attended-canvas-fidelity.test.ts::#223 R17: … (un it por fila de la tabla de clases)` | pendiente |
| R18 | pendiente — `suite completa verde + __tests__/alerts-attended-canvas-fidelity.test.ts::#223 R18: los candados enmendados nombran su enmienda` | pendiente |
| R19 | pendiente — `__tests__/alerts-attended-canvas-fidelity.test.ts::#223 R19: la carta declara los radios de la sección Atendidas (solo tras la casilla G4)` | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" (R19 incluida,
una vez firmada la casilla G4; si el humano no firma G4, se deja constancia
explícita y el leader decide el cierre).
Convención de commit: `feat(mobile): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
Cuidado: no rebasear tras escribir los hashes.
