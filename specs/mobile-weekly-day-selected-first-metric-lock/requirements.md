---
feature: "mobile-weekly-day-selected-first-metric-lock"
status: approved           # draft | spec_ready | approved  ← se firma dentro de la spec de #141
tags: [harness, spec, mobile, puntero]
---

# Requisitos — [[mobile-weekly-day-selected-first-metric-lock]] (#143)

> **Este fichero es un puntero, no una spec.** Existe para que la
> comprobación de `init.sh` que exige `specs/<nombre>/requirements.md` a toda
> feature `in_progress` o `done` (`grep -n "tiene spec (requirements.md)" init.sh`)
> encuentre algo cierto en vez de emitir su aviso «probablemente anterior a la
> adopción de specs», que en el caso de #143 sería falso.

## Dónde vive la spec de verdad

En **[[../mobile-weekly-day-column-value-cross-lock/requirements|specs/mobile-weekly-day-column-value-cross-lock/requirements.md]]**.
La firma del humano va en su §Aprobación, no aquí.

El humano decidió el 2026-09-30 juntar #141, #142 y #143 en **un solo ciclo**:
las tres son solo test, tocan el mismo fichero
(`mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`), añaden
sus bloques al final del mismo fichero y se prueban con las mismas acciones
sobre la gráfica. Por separado, cada una tendría su propio gate humano, su
propio Codex y su propia revisión, y las dos últimas en mergear resolverían un
conflicto al final del fichero.

| Entrada | Requisitos que le pertenecen |
|---|---|
| **#141** `mobile-weekly-day-column-value-cross-lock` | R1 |
| **#142** `mobile-weekly-card-children-strict-lock` | R2 |
| **#143** `mobile-weekly-day-selected-first-metric-lock` | **R3** |
| las tres | R4 (cierre medido) |

## Qué cierra #143

**R3**: un `describe` nuevo, `#143 R3`, último del fichero, con un `it`. Con la
primera métrica (minutos activos) y un día seleccionado, primero un día medido
y después el día sin datos, asevera con `toStrictEqual`, columna por columna y
por posición, la clase de cada columna y el `testID` y la clase de sus dos
hijos. La sonda `z_labelselfirstmetric` (la etiqueta en `text-foreground`
solo con la primera métrica y un día seleccionado) lo pone en rojo **por
aserción**.

`#140 R1` y `#140 R2` **no se tocan**: R3 es un `describe` nuevo en vez de dos
estados más en ellos (decisión D5 del `design.md` de la spec de verdad, punto 3
de su §Qué firma el humano). La tercera métrica con un día seleccionado sigue
sin candado de clases (`z_labelselwalks`, verde): queda declarada como (D).

Es **requisito de verificación por la vía (b) de C4**: las clases ya son
correctas, así que su commit rojo lleva la mutación `P3red` (la sonda
`z_labelselfirstmetric`, blob `6eda3dd1`) y el verde la revierte. El diff
neto de la gráfica es cero.

Una premisa de la entrada **se amplió**: con la misma condición, el valor en
`text-muted` (`z_valueselfirstmetric`), la raya en `text-foreground`
(`z_dashselfirstmetric`), la columna seleccionada sin su borde
(`z_colselfirstmetric`) y un hijo de más en la columna seleccionada
(`z_childselfirstmetric`) también dan verde en la base. Los cuatro entran en
R3, junto con la etiqueta. Está en §Premisas de la spec de verdad.

Trazabilidad, veredicto y reporte: los de #141, en
`specs/mobile-weekly-day-column-value-cross-lock/traceability.md`,
`progress/impl_mobile-weekly-day-column-value-cross-lock.md` y
`progress/review_mobile-weekly-day-column-value-cross-lock.md`.

## Por qué #143 se queda en `spec_ready` mientras se implementa

`init.sh` aborta con más de **una** feature en `in_progress`
(`grep -n 'fail "Más de 1 feature en in_progress' init.sh`). Al ser un
solo ciclo con una sola branch
(`feature/141-mobile-weekly-day-column-value-cross-lock`), la que lo
representa es #141; #143 pasa de `spec_ready` a `done` de golpe, con el mismo
veredicto. No es un atajo: el harness modela una feature por ciclo y aquí hay
tres entradas compartiendo uno.
