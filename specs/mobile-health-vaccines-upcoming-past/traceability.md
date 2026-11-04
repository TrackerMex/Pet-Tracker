---
feature: "mobile-health-vaccines-upcoming-past"
status: approved        # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-health-vaccines-upcoming-past]] (#241)

Rutas relativas a `mobile-pet-tracker/src/`. Los `it` de pantalla van dentro
del `describe('#241: vacunas próximas y pasadas'` de
`screens/health/index.test.tsx`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `__tests__/health-vaccines-upcoming-past.test.ts::#241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41` | Rojo: `9d7e5874` test(mobile): copy and #227 recipe locks for the health sections (R1, R11); verde: `f3207c10` feat(mobile): split health vaccines into Upcoming and collapsed Past (R1, R4, R5, R6, R7, R8, R9, R10, R11) |
| R2 | `utils/__tests__/vaccine-dates.test.ts::#241 R2: hoy %s, próxima dosis %s, va a %s` | Rojo: `4e312a3a` test(mobile): splitVaccines puts each vaccine on its side of today (R2); verde: `97def26e` feat(mobile): splitVaccines partitions vaccines around today (R2) |
| R3 | `utils/__tests__/vaccine-dates.test.ts::#241 R3: ordena próximas ascendente y pasadas descendente por su fecha, con empate por id` | Rojo: `df70c6f0` test(mobile): splitVaccines orders both sections with an id tie-break (R3); verde: `5d46f1b6` feat(mobile): splitVaccines sorts upcoming ascending and past descending (R3) |
| R4 | `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R4: pinta «Próximas» y debajo sus filas de la más cercana a la más lejana` | Rojo: `fe73ae05` test(mobile): health paints Upcoming with its rows nearest first (R4); verde: `f3207c10` feat(mobile): split health vaccines into Upcoming and collapsed Past (R1, R4, R5, R6, R7, R8, R9, R10, R11) |
| R5 | `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R5: «Pasadas» empieza colapsada con su contador y el chevron abajo` | Rojo: `7b3506b7` test(mobile): health Past starts collapsed with its count (R5); verde: `f3207c10` feat(mobile): split health vaccines into Upcoming and collapsed Past (R1, R4, R5, R6, R7, R8, R9, R10, R11) |
| R5 | `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R5: sin pasadas no pinta la sección` | Rojo: `7b3506b7` test(mobile): health Past starts collapsed with its count (R5); verde: `f3207c10` feat(mobile): split health vaccines into Upcoming and collapsed Past (R1, R4, R5, R6, R7, R8, R9, R10, R11) |
| R6 | `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R6: el encabezado alterna «Pasadas» y sus filas van de la más reciente a la más antigua` | Rojo: `99642b5b` test(mobile): health Past toggles and sorts most recent first (R6); verde: `f3207c10` feat(mobile): split health vaccines into Upcoming and collapsed Past (R1, R4, R5, R6, R7, R8, R9, R10, R11) |
| R7 | `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R7: $id conserva su tile en $list y entra a los $delay ms` | Rojo: `8d0230db` test(mobile): vaccine rows keep their tile and per-section delay (R7); verde: `f3207c10` feat(mobile): split health vaccines into Upcoming and collapsed Past (R1, R4, R5, R6, R7, R8, R9, R10, R11) |
| R8 | `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R8: la dosis de hoy sale en «Próxima dosis» y en «Pasadas», no en «Próximas»` | Rojo: `dd56132d` test(mobile): a dose due today shows in the hero and in Past (R8); verde: `f3207c10` feat(mobile): split health vaccines into Upcoming and collapsed Past (R1, R4, R5, R6, R7, R8, R9, R10, R11) |
| R9 | `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R9: sin próximas no pinta su cabecera ni su lista` | Rojo: `8c20896c` test(mobile): health omits Upcoming when nothing is ahead (R9); verde: `f3207c10` feat(mobile): split health vaccines into Upcoming and collapsed Past (R1, R4, R5, R6, R7, R8, R9, R10, R11) |
| R9 | `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R9: sin vacunas conserva el vacío sin secciones` (nace verde; sonda de mutación en `progress/impl_mobile-health-vaccines-upcoming-past.md`) | Sonda de mutación sin commit (ver reporte); verde: `c67d5531` test(mobile): empty vaccines keep the empty state without sections (R9) |
| R10 | `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R10: a las $hora en $tz la dosis del $dosis va a $seccion` | Rojo: `b70a43fa` test(mobile): health splits vaccines by the local day (R10); verde: `f3207c10` feat(mobile): split health vaccines into Upcoming and collapsed Past (R1, R4, R5, R6, R7, R8, R9, R10, R11); tipado de la tabla: `14627906` test(mobile): type the local-date fixture as a tuple (R10) |
| R11 | `__tests__/health-vaccines-upcoming-past.test.ts::#241 R11: %s` | Rojo: `9d7e5874` test(mobile): copy and #227 recipe locks for the health sections (R1, R11); verde: `f3207c10` feat(mobile): split health vaccines into Upcoming and collapsed Past (R1, R4, R5, R6, R7, R8, R9, R10, R11) |
| R11 | `__tests__/health-vaccines-upcoming-past.test.ts::#241 R11: inventario del fuente` | Rojo: `9d7e5874` test(mobile): copy and #227 recipe locks for the health sections (R1, R11); verde: `f3207c10` feat(mobile): split health vaccines into Upcoming and collapsed Past (R1, R4, R5, R6, R7, R8, R9, R10, R11) |
| R12 | `__tests__/health-vaccines-upcoming-past.test.ts::#241 R12: los candados enmendados nombran su enmienda y la spec enmendada lleva su casilla` | Rojo: `cedba517` test(mobile): amended locks name their amendment (R12); verde: `722d4f26` test(mobile): suffix amended locks with #241 R12 (R12) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Evidencia de implementación

- Base de producción H0: `2313669a`; base del diff de implementación: `7fe02383`.
- T0: 1746 pasados, 0 fallidos, 68 suites. Final: 1787 pasados, 0 fallidos, 69 suites.
- El import prescrito de `ui-copy-table.ts` registra sus dos tests en la suite nueva: los totales desde R1/R11 son los previstos más 2. El reporte detalla esta diferencia y los flakes repetidos.
- R9 vacío nació verde y detectó la mutación prescrita; restauración con diffs de producción e índice vacíos.
- R12 cubre los diez candados previstos. No se añadieron enmiendas por la Regla de cierre.
- El smoke G2 y `./init.sh` corresponden al humano/leader. Este cambio no los marca ni los ejecuta.
