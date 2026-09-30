---
feature: "mobile-weekly-card-children-strict-lock"
status: approved           # draft | spec_ready | approved  ← se firma dentro de la spec de #141
tags: [harness, spec, mobile, puntero]
---

# Requisitos — [[mobile-weekly-card-children-strict-lock]] (#142)

> **Este fichero es un puntero, no una spec.** Existe para que la
> comprobación de `init.sh` que exige `specs/<nombre>/requirements.md` a toda
> feature `in_progress` o `done` (`grep -n "tiene spec (requirements.md)" init.sh`)
> encuentre algo cierto en vez de emitir su aviso «probablemente anterior a la
> adopción de specs», que en el caso de #142 sería falso.

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
| **#142** `mobile-weekly-card-children-strict-lock` | **R2** |
| **#143** `mobile-weekly-day-selected-first-metric-lock` | R3 |
| las tres | R4 (cierre medido) |

## Qué cierra #142

**R2**: un `describe` nuevo, `#142 R2`, con tres `it`, uno por rama de la
tarjeta: sin comparación (antes y después de medir, en las tres métricas y con
un día seleccionado, medido o sin datos, también con la primera métrica), con
comparación (sin día seleccionado y con uno) y sin ningún día medido. En cada
estado asevera con `toStrictEqual` la lista cerrada de los `testID` de los
hijos host de `weekly-activity-card`. Un `<View />` de más al final de la
tarjeta (la sonda `cardtail`) lo pone en rojo **por aserción** en las tres
ramas.

`#135 R4` **no se toca**: sigue con `toEqual`, y R2 es un hermano estricto que
repite sus seis aserciones y añade cuatro estados (decisión D4 del `design.md`
de la spec de verdad, punto 2 de su §Qué firma el humano).

Es **requisito de verificación por la vía (b) de C4**: la estructura ya es
correcta, así que su commit rojo lleva la mutación `P2red` (la sonda
`cardtail`, blob `0ac97f35`) y el verde la revierte. El diff neto de la
gráfica es cero.

Una premisa de la entrada resultó **falsa**: los hermanos `#130 R2` y
`#131 R3` no tienen el mismo hueco. La fila de la columna la cierran ya
`#140 R1` y `#140 R2` (sonda `rowtail`, en rojo hoy), y fuera de la gráfica
las dos únicas listas cerradas que hay (la fila de accesos rápidos y el cuerpo
de recordatorios, en `src/screens/home/index.test.tsx`) ven un `<View />` de
más al final (`#71 R1` y `#81 R6`; `#70 R9`, `#85 R5` y `#85 R9`). Está en
§Premisas y §Fuera de alcance, (N), de la spec de verdad.

Trazabilidad, veredicto y reporte: los de #141, en
`specs/mobile-weekly-day-column-value-cross-lock/traceability.md`,
`progress/impl_mobile-weekly-day-column-value-cross-lock.md` y
`progress/review_mobile-weekly-day-column-value-cross-lock.md`.

## Por qué #142 se queda en `spec_ready` mientras se implementa

`init.sh` aborta con más de **una** feature en `in_progress`
(`grep -n 'fail "Más de 1 feature en in_progress' init.sh`). Al ser un
solo ciclo con una sola branch
(`feature/141-mobile-weekly-day-column-value-cross-lock`), la que lo
representa es #141; #142 pasa de `spec_ready` a `done` de golpe, con el mismo
veredicto. No es un atajo: el harness modela una feature por ciclo y aquí hay
tres entradas compartiendo uno.
