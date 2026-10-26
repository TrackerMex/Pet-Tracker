---
feature: "mobile-sheet-surface-background"
status: approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-sheet-surface-background]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `screens/reminders/index.test.tsx::#218 R1: backgroundStyle del BottomSheet de borrar es exactamente el token surface` | Test `45557e98` (C1); implementación `e3def8e3` (C4). |
| R2 | `screens/pairing/index.test.tsx::#218 R2: backgroundStyle del BottomSheet de desvincular es exactamente el token surface` | Test `0f491fbd` (C2); implementación `a9b0ad93` (C5). |
| R3 | `__tests__/sheet-surface-background.test.ts::#218 R3: solo Recordatorios y Vinculación montan un BottomSheet` y las dos filas `#218 R3: %s monta un BottomSheet con backgroundStyle surface` | Test `f44ecb23` (C3); implementación `e3def8e3` (C4) y `a9b0ad93` (C5). |
| R4 | Sin test propio. Heredados de H0: `screens/reminders/index.test.tsx::confirmDelete()` y `centra los cinco hijos del sheet con el marco del canvas`; `screens/pairing/index.test.tsx::#203 R7.2: desvincular abre la hoja con su anatomía y sin diálogo nativo`. R1/R2 también asertan snapPoints. Todos verdes y tests existentes sin borrados. | Contratos existentes en `68a1f217`; implementación `e3def8e3` (C4) y `a9b0ad93` (C5). |
| R5 | Sin test propio. `__tests__/design-drift.test.ts`: `#193 R11::mantiene las tres pantallas sin escapes de estilo literales`; `R11 (mobile-device-pairing)::keeps pairing free of forbidden styling escapes`; `#68 R18::keeps arbitrary text, hex colors, and StyleSheet out of feature sources`; `#178 R13::no deja escapes de estilo, radios vetados ni text-accent suelto`. Más R1/R2. Los seis fallan con hex y pasan tras revertir. | Guards existentes en `68a1f217`; tests R1/R2 `45557e98` y `0f491fbd`; implementación `e3def8e3` (C4) y `a9b0ad93` (C5). |
| R6 | Sin test propio. Guards existentes `design-drift.test.ts`, `consistency-classnames.test.ts`, `legibility-classnames.test.ts`, `ui-language.test.ts` y contratos R4, sin enmiendas. Suite completa 158/158, tests 5553/5553; typecheck y lint limpios; numstat de cada pantalla `2/0`. Evidencia en `progress/impl_mobile-sheet-surface-background.md`. | Guards existentes en `68a1f217`; implementación `e3def8e3` (C4) y `a9b0ad93` (C5). |

## Commits de test e implementación

| Paso | Hash | Mensaje |
|---|---|---|
| C1 | `45557e98` | `test(#218): R1 lock the reminders delete sheet container to the surface token` |
| C2 | `0f491fbd` | `test(#218): R2 lock the pairing unpair sheet container to the surface token` |
| C3 | `f44ecb23` | `test(#218): R3 lock every BottomSheet to the surface background` |
| C4 | `e3def8e3` | `feat(#218): R1, R5, R6 paint the reminders delete sheet with the surface token` |
| C5 | `a9b0ad93` | `feat(#218): R2, R5, R6 paint the pairing unpair sheet with the surface token` |

El inventario de R3 nació verde; la sonda de tercer importador lo puso rojo. Las dos filas por pantalla nacieron rojas. Las cuatro sondas están medidas y revertidas en el reporte.

Smoke G2 Android reservado al humano: no se modifica su casilla en requirements.md. Sin push, PR, merge ni rebase; la integración corresponde a `dev`.

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
