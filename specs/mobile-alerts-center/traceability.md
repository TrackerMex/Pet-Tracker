---
feature: "mobile-alerts-center"
status: approved     # draft | approved  (enmendado por E1-E8 de [[requirements]])
tags: [harness, spec]
---

# Trazabilidad — [[mobile-alerts-center]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/api/__tests__/alerts.test.ts :: #78 R1: listAlerts mapea la respuesta por kind` | rojo `ee17732b` (`test(mobile-alerts-center): cover alert listing (R1)`); verde pendiente |
| R2 | pendiente | pendiente |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |
| R11 | pendiente | pendiente |
| R12 | pendiente | pendiente |
| R13 | pendiente (verificación — se cierra con la evidencia de mutación de `progress/impl_mobile-alerts-center.md` §R13) | pendiente |
| R14 | pendiente (gate humano — sin test automatizado; evidencia en `progress/impl_mobile-alerts-center.md` §R14) | pendiente |
| E1 | pendiente (documental — la premisa derogada; sin test) | pendiente |
| E2 | pendiente — `src/api/__tests__/query-keys.test.ts` (dos filas nuevas del array `cases`) | pendiente |
| E3 | pendiente — `src/screens/alerts/index.test.tsx :: #78 R9` | pendiente |
| E4 | pendiente — `src/screens/alerts/index.test.tsx :: #78 R4` | pendiente |
| E5 | pendiente — `src/screens/alerts/index.test.tsx :: #78 R8` | pendiente |
| E6 | pendiente — `src/screens/home/index.test.tsx :: #78 R11` | pendiente |
| E7 | pendiente (documental — referencias de línea reapuntadas; sin test) | pendiente |
| E8 | pendiente — `src/__tests__/design-drift.test.ts :: #87 R19` (fila nueva del mapa `screenSignOutCalls`) | pendiente |

Tests esperados por requisito (rutas desde `mobile-pet-tracker/`):

| R | Fichero de test | `describe` |
|---|---|---|
| R1 | `src/api/__tests__/alerts.test.ts` | `#78 R1: listAlerts mapea la respuesta por kind` |
| R2 | `src/api/__tests__/alerts.test.ts` | `#78 R2: ackAlert mapea la respuesta por kind` |
| R3 | `src/providers/__tests__/language-provider.test.tsx` | `#78 R3: el catálogo trae las claves del centro de alertas` |
| R4 | `src/screens/alerts/index.test.tsx` | `#78 R4: la pantalla pinta su esqueleto, su error, su vacío y sus filas` |
| R5 | `src/app/(tabs)/__tests__/alerts.test.tsx` | `#78 R5: la ruta delega en la pantalla y no es pestaña` |
| R6 | `src/screens/alerts/index.test.tsx` | `#78 R6: cada fila de alerta trae su icono, su hueco, su tinta y sus tres hijos en orden` |
| R7 | `src/screens/alerts/index.test.tsx` | `#78 R7: pinta las abiertas primero y conserva la posición tras el ack` |
| R8 | `src/screens/alerts/index.test.tsx` | `#78 R8: el ack cambia la fila sin recargar la lista` |
| R9 | `src/screens/alerts/index.test.tsx` | `#78 R9: pagina por nextCursor y se para cuando no hay` |
| R10 | `src/screens/home/index.test.tsx` | `#78 R10: la campana vive en el hero y lleva al centro de alertas` |
| R11 | `src/screens/home/index.test.tsx` | `#78 R11: el punto rojo sigue a las alertas abiertas` |
| R12 | `src/__tests__/ui-language.test.ts` | `#78 R12: el centro de alertas resuelve su copy por clave` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente". Las filas E1-E8
son las **enmiendas post-#87** de [[requirements]] §Enmiendas: el reviewer
comprueba además que su casilla humana está marcada, como con cualquier enmienda
a una spec aprobada.
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
