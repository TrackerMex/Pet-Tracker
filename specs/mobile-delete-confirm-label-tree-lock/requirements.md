---
feature: "mobile-delete-confirm-label-tree-lock"
status: spec_ready         # draft | spec_ready | approved  ← se firma dentro de la spec de #127
tags: [harness, spec, mobile, puntero]
---

# Requisitos — [[mobile-delete-confirm-label-tree-lock]] (#128)

> **Este fichero es un puntero, no una spec.** Existe para que la
> comprobación de `init.sh` que exige `specs/<nombre>/requirements.md` a toda
> feature `in_progress` o `done` (`grep -n "tiene spec (requirements.md)" init.sh`)
> encuentre algo cierto en vez de emitir su aviso «probablemente anterior a la
> adopción de specs», que en el caso de #128 sería falso.

## Dónde vive la spec de verdad

En **[[../mobile-classnames-own-tag-tree-lock/requirements|specs/mobile-classnames-own-tag-tree-lock/requirements.md]]**.
La firma del humano va en su §Aprobación, no aquí.

El humano decidió el 2026-10-01 juntar #127 y #128 en **un solo ciclo**: las
dos nacen de los dos hallazgos (F) de la spec de #120, las dos son solo test,
las dos cierran en el árbol un hueco del recorte de fuente, y las dos añaden
bloques al final de `mobile-pet-tracker/src/screens/reminders/index.test.tsx`.
Por separado, cada una tendría su propio gate humano, su propio Codex y su
propia revisión, y la segunda en mergear resolvería un conflicto al final de
ese fichero.

| Entrada | Requisitos que le pertenecen |
|---|---|
| **#127** `mobile-classnames-own-tag-tree-lock` | R1, R2 y R3 |
| **#128** `mobile-delete-confirm-label-tree-lock` | **R4** |
| las dos | R5 (la convención) y R6 (cierre medido) |

## Qué cierra #128

**R4**: un `describe` nuevo, `#128 R4`, con un `it` que abre el sheet de
borrado y asevera con `toBe` dos `className` del árbol: el de
`reminders-delete-confirm`, con la variante `danger` y `bg-danger`, y el de su
única etiqueta «Eliminar», buscada con `within` dentro del botón, con
`text-danger-foreground`. Los esperados son literales del test e incluyen las
clases que añade heroui-native.

Con eso, el señuelo de la entrada (la sonda `D-d`, blob `50cc3d89`, verde hoy
en el árbol y en `legibility-classnames.test.ts`) pasa a rojo **por
aserción**, en la etiqueta. Un señuelo que no se renderiza no está en el
árbol, y uno que se renderiza da dos etiquetas y rompe la consulta (`Z-d-dup`).

Es **requisito de verificación por la vía (b) de C4**: la estructura ya es
correcta, así que su commit rojo lleva una mutación versionada y el verde la
revierte. Esa mutación es `D-c` (un comentario JSX con la etiqueta correcta
delante de la real, blob `74fe6d45`) y no `D-d`, porque `D-d` rompe también
dos `it` de `ui-language.test.ts` (`#65 R8` y `#65 R18`) y el rojo de R4 debe
ser el único de la suite. Está en la decisión D5 del `design.md` de la spec de
verdad.

El `it` de `#61 R1 … (#120 R2)` de `legibility-classnames.test.ts` (variant y
`bg-danger` en el tag de apertura) **no se toca** y sigue en verde. R5 cambia
la frase de `docs/conventions.md` que daba este hueco por límite documentado.

Trazabilidad, veredicto y reporte: los de #127, en
`specs/mobile-classnames-own-tag-tree-lock/traceability.md`,
`progress/impl_mobile-classnames-own-tag-tree-lock.md` y
`progress/review_mobile-classnames-own-tag-tree-lock.md`.

## Por qué #128 se queda en `spec_ready` mientras se implementa

`init.sh` aborta con más de **una** feature en `in_progress`
(`grep -n 'fail "Más de 1 feature en in_progress' init.sh`). Al ser un solo
ciclo con una sola branch (`feature/127-mobile-classnames-own-tag-tree-lock`),
la que lo representa es #127. #128 pasa de `spec_ready` a `done` de golpe, con
el mismo veredicto. No es un atajo: el harness modela una feature por ciclo y
aquí hay dos entradas compartiendo uno.
