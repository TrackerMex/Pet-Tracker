---
feature: "mobile-alerts-center"
status: approved     # draft | approved  (enmendado por E1-E8 de [[requirements]])
tags: [harness, spec]
---

# Trazabilidad — [[mobile-alerts-center]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/api/__tests__/alerts.test.ts :: #78 R1: listAlerts mapea la respuesta por kind` | rojo `ee17732b`; verde `f6062ed0` |
| R2 | `src/api/__tests__/alerts.test.ts :: #78 R2: ackAlert mapea la respuesta por kind` | rojo `d6803629`; verde `02593774` |
| R3 | `src/providers/__tests__/language-provider.test.tsx :: #78 R3: el catálogo trae las claves del centro de alertas` | rojo `0467146a`; verde `d2f10c67` |
| R4 | `src/screens/alerts/index.test.tsx :: #78 R4: la pantalla pinta su esqueleto, su error, su vacío y sus filas` | rojo `2dc14118`; verde `a8fa22d2` |
| R5 | `src/app/(tabs)/__tests__/alerts.test.tsx :: #78 R5: la ruta delega en la pantalla y no es pestaña` | rojo `8d7b5f13`; verde `e9f3b126` |
| R6 | `src/screens/alerts/index.test.tsx :: #78 R6: cada fila de alerta trae su icono, su hueco, su tinta y sus tres hijos en orden` | rojo `e2a10a0a`; verde `ccefd8fe` |
| R7 | `src/screens/alerts/index.test.tsx :: #78 R7: pinta las abiertas primero y conserva la posición tras el ack` | rojo `d72ba1dd`; verde `3e7bebb9` |
| R8 | `src/screens/alerts/index.test.tsx :: #78 R8: el ack cambia la fila sin recargar la lista` | rojo `290abc42`; verde `63faca32` |
| R9 | `src/screens/alerts/index.test.tsx :: #78 R9: pagina por nextCursor y se para cuando no hay` | rojo `b4cd1f97`; verde `288c8c72` |
| R10 | `src/screens/home/index.test.tsx :: #78 R10: la campana vive en el hero y lleva al centro de alertas` | rojo `73307e12`; verde `3ac78d34` |
| R11 | `src/screens/home/index.test.tsx :: #78 R11: el punto rojo sigue a las alertas abiertas` | rojo `bf3e6622`; verde `418bc7cd` |
| R12 | `src/__tests__/ui-language.test.ts :: #78 R12: el centro de alertas resuelve su copy por clave` | rojo `24d0426a`; verde `e1fb6ad6` |
| R13 | `src/__tests__/consistency-classnames.test.ts :: #64 R9: el color categórico solo se nombra en el módulo de paleta` + evidencia de mutación en `progress/impl_mobile-alerts-center.md` §R13 | rojo `7d1bff33`; verde `df3b4ea2`; ajuste de lint `adbfecc6` |
| R14 | Gate humano en dev build de Android; guion y estado en `progress/impl_mobile-alerts-center.md` §R14 | no aplica a IA — gate humano por ejecutar |
| E1 | `src/screens/alerts/index.test.tsx :: #78 R4` + `src/__tests__/design-drift.test.ts` (`#87 R1`/`R19`) | rojo `2dc14118`; verde `a8fa22d2` |
| E2 | `src/api/__tests__/query-keys.test.ts` (dos filas nuevas del array `cases`) | rojo `8e05f068`; verde `749cde81` |
| E3 | `src/screens/alerts/index.test.tsx :: #78 R9: pagina por nextCursor y se para cuando no hay` | rojo `b4cd1f97`; verde `288c8c72` |
| E4 | `src/screens/alerts/index.test.tsx :: #78 R4: la pantalla pinta su esqueleto, su error, su vacío y sus filas` | rojo `2dc14118`; verde `a8fa22d2` |
| E5 | `src/screens/alerts/index.test.tsx :: #78 R8: el ack cambia la fila sin recargar la lista` | rojo `290abc42`; verde `63faca32` |
| E6 | `src/screens/home/index.test.tsx :: #78 R11: el punto rojo sigue a las alertas abiertas` | rojo `bf3e6622`; verde `418bc7cd` |
| E7 | `requirements.md` §E7 (referencias contrastadas con el árbol post-#87) | actualización documental `ecb449ee`; aprobación humana `4f9298e0` (sin ciclo TDD aplicable) |
| E8 | `src/__tests__/design-drift.test.ts :: #87 R19: use-api no deja huella` (fila nueva del mapa `screenSignOutCalls`) | rojo `54b8932d`; verde `63faca32` |

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
