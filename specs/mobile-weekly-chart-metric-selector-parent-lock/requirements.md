---
feature: "mobile-weekly-chart-metric-selector-parent-lock"
status: spec_ready         # draft | spec_ready | approved  ← se firma dentro de la spec de #131
tags: [harness, spec, mobile, puntero]
---

# Requisitos — [[mobile-weekly-chart-metric-selector-parent-lock]] (#135)

> **Este fichero es un puntero, no una spec.** Existe para que la
> comprobación de `init.sh` que exige `specs/<nombre>/requirements.md` a toda
> feature `in_progress` o `done` (`grep -n "tiene spec (requirements.md)" init.sh`)
> encuentre algo cierto en vez de emitir su aviso «probablemente anterior a la
> adopción de specs», que en el caso de #135 sería falso.

## Dónde vive la spec de verdad

En **[[../mobile-weekly-day-row-layout-lock/requirements|specs/mobile-weekly-day-row-layout-lock/requirements.md]]**.
La firma del humano va en su §Aprobación, no aquí.

El humano decidió el 2026-09-30 juntar #131 y #135 en **un solo ciclo**: los
dos son solo test, tocan el mismo fichero
(`mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`), añaden
sus bloques al final del mismo fichero y se prueban con las mismas acciones
sobre la gráfica. Por separado, cada uno tendría su propio gate humano, su
propio Codex y su propia revisión, y el segundo en mergear resolvería un
conflicto al final del fichero.

| Entrada | Requisitos que le pertenecen |
|---|---|
| **#131** `mobile-weekly-day-row-layout-lock` | R1, R2 y R3 |
| **#135** `mobile-weekly-chart-metric-selector-parent-lock` | **R4** |
| las dos | R5 (cierre medido) |

## Qué cierra #135

**R4**: un `describe` nuevo, `#135 R4`, último del fichero, con tres `it`. En
cada estado que la tarjeta puede tomar (sin comparación antes y después de
medir, con otra métrica y con un día seleccionado; con comparación; y sin
ningún día medido), asevera con `toEqual` la lista cerrada de los `testID` de
los hijos host de `weekly-activity-card`. Un `<View accessible>` (o un
`Pressable`) alrededor de `<MetricSelector`, o alrededor de cualquier otro hijo
de la tarjeta, la pone en rojo **por aserción**.

Es **requisito de verificación por la vía (b) de C4**: la estructura ya es
correcta, así que su commit rojo lleva la mutación `wrapmetric` (el
`<View accessible>` alrededor del selector) y el verde la revierte. El diff
neto de la gráfica es cero.

Trazabilidad, veredicto y reporte: los de #131, en
`specs/mobile-weekly-day-row-layout-lock/traceability.md`,
`progress/impl_mobile-weekly-day-row-layout-lock.md` y
`progress/review_mobile-weekly-day-row-layout-lock.md`.

## Por qué #135 se queda en `spec_ready` mientras se implementa

`init.sh` aborta con más de **una** feature en `in_progress`
(`grep -n 'fail "Más de 1 feature en in_progress' init.sh`). Al ser un
solo ciclo con una sola branch
(`feature/131-mobile-weekly-day-row-layout-lock`), la que lo representa es
#131; #135 pasa de `spec_ready` a `done` de golpe, con el mismo veredicto. No
es un atajo: el harness modela una feature por ciclo y aquí hay dos entradas
compartiendo uno.
