---
feature: "mobile-reminders-upcoming-past"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-reminders-upcoming-past]] (#227)

Rutas relativas a `mobile-pet-tracker/src/`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts::#227 R1: las cuatro claves existen en es y en con su literal, una invocación cada una y su fila en §2.40` | `abf97b14` test(mobile): copy and canvas classes of reminders sections (R1, R11); `3ffb6b75` feat(mobile): reminders split into Upcoming and collapsed Past (R4, R5, R6, R7, R12); `e4db6d58` feat(mobile): empty upcoming box above Past (R8) |
| R2 | `utils/reminder-dates.test.ts::#227 R2: %s` | `c5736b68` test(mobile): splitReminders splits by civil day and status (R2); `c54e6d8f` feat(mobile): splitReminders splits by civil day and status (R2) |
| R3 | `utils/reminder-dates.test.ts::#227 R3: ordena próximos ascendente y pasados descendente, con empate por id` | `94bb456d` test(mobile): splitReminders orders upcoming ascending and past descending (R3); `4065cc5f` feat(mobile): splitReminders orders upcoming ascending and past descending (R3) |
| R4 | `screens/reminders/index.test.tsx::#227 R4: pinta «Próximos» y debajo sus filas en orden ascendente` | `98b02bb3` test(mobile): upcoming heading and ascending list (R4); `3ffb6b75` feat(mobile): reminders split into Upcoming and collapsed Past (R4, R5, R6, R7, R12) |
| R5 | `screens/reminders/index.test.tsx::#227 R5: «Pasados» empieza colapsada con su contador y el chevron abajo`; `screens/reminders/index.test.tsx::#227 R5: sin pasados no pinta la sección` | `cbd7a1f2` test(mobile): collapsed Past section with count and chevron (R5); `3ffb6b75` feat(mobile): reminders split into Upcoming and collapsed Past (R4, R5, R6, R7, R12) |
| R6 | `screens/reminders/index.test.tsx::#227 R6: el encabezado alterna «Pasados» y sus filas van atenuadas de la más reciente a la más antigua` | `db2b9c12` test(mobile): Past header toggles and dims rows newest first (R6); `3ffb6b75` feat(mobile): reminders split into Upcoming and collapsed Past (R4, R5, R6, R7, R12) |
| R7 | `screens/reminders/index.test.tsx::#227 R7: la opacidad sigue a la sección y el resto de la fila sigue al status` | `08541523` test(mobile): opacity follows the section, the rest follows status (R7); `3ffb6b75` feat(mobile): reminders split into Upcoming and collapsed Past (R4, R5, R6, R7, R12) |
| R8 | `screens/reminders/index.test.tsx::#227 R8: sin próximos pinta la caja «Nada pendiente por ahora» encima de «Pasados»` | `8ab788c5` test(mobile): empty upcoming box above Past (R8); `e4db6d58` feat(mobile): empty upcoming box above Past (R8) |
| R9 | `screens/reminders/index.test.tsx::#227 R9: sin recordatorios conserva el vacío sin secciones` (nace verde; sonda de mutación en el reporte) | `96e183c5` test(mobile): empty list keeps EmptyState without sections (R9) |
| R10 | `theme/__tests__/motion.test.ts::#227 R10: declara el paso de 30 ms de las filas pasadas`; `screens/reminders/index.test.tsx::#227 R10: escalona los próximos cada 70 ms y los pasados cada 30 ms desde 0` | `97bf13c6` test(mobile): past reminders rise with a 30 ms step (R10); `c4c60215` feat(mobile): past reminders rise with a 30 ms step (R10) |
| R11 | `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts::#227 R11: %s`; `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts::#227 R11: inventario del fuente` | `abf97b14` test(mobile): copy and canvas classes of reminders sections (R1, R11); `3ffb6b75` feat(mobile): reminders split into Upcoming and collapsed Past (R4, R5, R6, R7, R12); `e4db6d58` feat(mobile): empty upcoming box above Past (R8); `c4c60215` feat(mobile): past reminders rise with a 30 ms step (R10) |
| R12 | `screens/reminders/index.test.tsx::#227 R12: Eliminar y Cancelar serie siguen en su fila en las dos secciones y solo para el dueño` | `83637841` test(mobile): row actions stay in their row in both sections (R12); `3ffb6b75` feat(mobile): reminders split into Upcoming and collapsed Past (R4, R5, R6, R7, R12) |
| R13 | `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts::#227 R13: los candados enmendados nombran su enmienda y las specs enmendadas llevan su casilla`, suite completa requerida (`./init.sh`, a cargo del leader; no ejecutada por este implementador) | `e16a4e31` test(mobile): amended locks name their amendment (R13); `6d4ad407` test(mobile): suffix amended locks with #227 R13 (R13) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Preparación y verificación

- T0 (solo tests, verde): `7fffbd60` test(mobile): icon doubles, relative default date and fixed clocks for reminders (T0).
- Línea base: 73 suites y 1842 tests verdes.
- Final R13 (3): 74 suites y 1877 tests verdes.
- R9 nace verde por D4; sonda de mutación roja, revertida, documentada en `progress/impl_mobile-reminders-upcoming-past.md`.
- `./init.sh` queda a cargo del leader por instrucción del handoff; no lo ejecutó el implementador. G2 sigue siendo gate humano, sin cambios.

## Cadena de commits (1–19)

| N.º | Hash | Mensaje |
|---|---|---|
| 1 | `7fffbd60` | test(mobile): icon doubles, relative default date and fixed clocks for reminders (T0) |
| 2 | `c5736b68` | test(mobile): splitReminders splits by civil day and status (R2) |
| 3 | `c54e6d8f` | feat(mobile): splitReminders splits by civil day and status (R2) |
| 4 | `94bb456d` | test(mobile): splitReminders orders upcoming ascending and past descending (R3) |
| 5 | `4065cc5f` | feat(mobile): splitReminders orders upcoming ascending and past descending (R3) |
| 6 | `abf97b14` | test(mobile): copy and canvas classes of reminders sections (R1, R11) |
| 7 | `98b02bb3` | test(mobile): upcoming heading and ascending list (R4) |
| 8 | `cbd7a1f2` | test(mobile): collapsed Past section with count and chevron (R5) |
| 9 | `db2b9c12` | test(mobile): Past header toggles and dims rows newest first (R6) |
| 10 | `08541523` | test(mobile): opacity follows the section, the rest follows status (R7) |
| 11 | `83637841` | test(mobile): row actions stay in their row in both sections (R12) |
| 12 | `3ffb6b75` | feat(mobile): reminders split into Upcoming and collapsed Past (R4, R5, R6, R7, R12) |
| 13 | `8ab788c5` | test(mobile): empty upcoming box above Past (R8) |
| 14 | `e4db6d58` | feat(mobile): empty upcoming box above Past (R8) |
| 15 | `96e183c5` | test(mobile): empty list keeps EmptyState without sections (R9) |
| 16 | `97bf13c6` | test(mobile): past reminders rise with a 30 ms step (R10) |
| 17 | `c4c60215` | feat(mobile): past reminders rise with a 30 ms step (R10) |
| 18 | `e16a4e31` | test(mobile): amended locks name their amendment (R13) |
| 19 | `6d4ad407` | test(mobile): suffix amended locks with #227 R13 (R13) |

Verificación adicional del implementador: guardas ampliadas 80 suites, 1658 tests y 1 snapshot en verde; TypeScript exit 0 y lint LINT_OK, ambos con log vacío.
