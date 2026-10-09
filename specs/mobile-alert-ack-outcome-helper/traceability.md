---
feature: "mobile-alert-ack-outcome-helper"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-alert-ack-outcome-helper]] (#134)

| Requisito | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 | `src/screens/alerts/index.test.tsx` :: `#134 R1: caracterización de las ramas sin candado del ack` (C1 y C2) | `759b16c1 test(mobile-alert-ack-outcome-helper): characterize centro ack branches (R1)` | `55ed823d fix(mobile-alert-ack-outcome-helper): revert R1 characterization mutations (R1)` |
| R2 | `src/screens/alert-detail/index.test.tsx` :: `#134 R2: caracterización de la rama sin candado del ack` (D1) | `e1c3b589 test(mobile-alert-ack-outcome-helper): characterize detail sign-out failure (R2)` | `bd912c99 fix(mobile-alert-ack-outcome-helper): revert R2 characterization mutation (R2)` |
| R3 | `src/utils/alert-ack-outcome.test.ts` :: `#134 R3: el helper entrega las ramas delegadas a la pantalla` | `1ede917d test(mobile-alert-ack-outcome-helper): helper delegated outcomes (R3)` | `cd84db14 feat(mobile-alert-ack-outcome-helper): delegate ok, already-closed and not-found (R3)` |
| R4 | `src/utils/alert-ack-outcome.test.ts` :: `#134 R4: el helper resuelve las ramas comunes en los dos idiomas` | `590df00a test(mobile-alert-ack-outcome-helper): helper common outcomes (R4)` | `e832e42d feat(mobile-alert-ack-outcome-helper): resolve common ack outcomes (R4)` |
| R5 | `src/utils/alert-ack-outcome.test.ts` :: `#134 R5: el helper convierte toda excepción en el error genérico` | `5ca4a8fc test(mobile-alert-ack-outcome-helper): helper never rejects (R5)` | `9b0d756b feat(mobile-alert-ack-outcome-helper): catch every ack failure (R5)` |
| R6 | `src/__tests__/design-drift.test.ts` :: `#134 R6: el resultado del ack se clasifica en un solo sitio` y `#87 R19: use-api no deja huella`; `src/__tests__/ui-language.test.ts` :: `#78 R12: el centro de alertas resuelve su copy por clave`, `#100 R10: el detalle de alerta resuelve su copy por clave`, `#65 R18: los sitios resuelven por clave y no queda copy suelta` | `97da5745 test(mobile-alert-ack-outcome-helper): move ack inventories to the helper (R6)` | `cd514792 refactor(mobile-alert-ack-outcome-helper): screens delegate the ack outcome (R6)` |
| R7 | `src/__tests__/design-drift.test.ts` :: `#134 R7: el ack no toca la caché de la lista` | `2dc58df1 test(mobile-alert-ack-outcome-helper): guard the alert list cache (R7)` | `168f0479 fix(mobile-alert-ack-outcome-helper): revert R7 cache mutation (R7)` |
| R4 (E1) | `src/utils/alert-ack-outcome.test.ts` :: `#134 R4: el helper resuelve las ramas comunes en los dos idiomas` (W1 y W2) | `afd1b4fb test(mobile-alert-ack-outcome-helper): helper awaits sign-out either way (R4)` | `d3c2b7eb fix(mobile-alert-ack-outcome-helper): revert R4 sign-out wait mutation (R4)` |
| R1 (E1) | `src/screens/alerts/index.test.tsx` :: `#78 R8: el ack cambia la fila sin recargar la lista › #134 R1: caracterización de las ramas sin candado del ack` (C3 y C4) | `c19c7ca6 test(mobile-alert-ack-outcome-helper): centro ack errors in english (R1)` | `bfca523f fix(mobile-alert-ack-outcome-helper): revert R1 translator mutation (R1)` |
| R2 (E1) | `src/screens/alert-detail/index.test.tsx` :: `#100 R5: el detalle marca leída la alerta › #134 R2: caracterización de la rama sin candado del ack` (D2 y D3) | `63f91569 test(mobile-alert-ack-outcome-helper): detail ack errors in english (R2)` | `190cb1cc fix(mobile-alert-ack-outcome-helper): revert R2 translator mutation (R2)` |
| R1 y R2 (E1.7) | `src/screens/alerts/index.test.tsx` :: `#78 R8: el ack cambia la fila sin recargar la lista › #134 R1: caracterización de las ramas sin candado del ack` (C5); `src/screens/alert-detail/index.test.tsx` :: `#100 R5: el detalle marca leída la alerta › #134 R2: caracterización de la rama sin candado del ack` (D4) | `670fd9f5 test(mobile-alert-ack-outcome-helper): screens keep ack disabled until sign-out settles (R1, R2)` | `c6ec5d8c fix(mobile-alert-ack-outcome-helper): revert R1 and R2 sign-out wrapper mutations (R1, R2)` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Rutas de test relativas a `mobile-pet-tracker/`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
