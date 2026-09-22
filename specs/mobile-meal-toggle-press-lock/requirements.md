---
feature: "mobile-meal-toggle-press-lock"
status: approved         # draft | spec_ready | approved  ← firmada dentro de la spec de #106, en ca13a804 (2026-09-21)
tags: [harness, spec, mobile, puntero]
---

# Requisitos — [[mobile-meal-toggle-press-lock]] (#107)

> **Este fichero es un puntero, no una spec.** Existe para que
> `init.sh:165` —que exige `specs/<nombre>/requirements.md` a toda feature
> `in_progress` o `done`— encuentre algo cierto en vez de emitir su aviso
> «probablemente anterior a la adopción de specs», que en el caso de #107
> sería falso.

## Dónde vive la spec de verdad

En **[[../mobile-meals-bar-motion/requirements|specs/mobile-meals-bar-motion/requirements.md]]**,
firmada por el humano en `ca13a804` el 2026-09-21.

El humano decidió el 2026-09-21 juntar #106 y #107 en **un solo ciclo**: tocan
el mismo `Pressable` y la misma pantalla, y #107 por su cuenta son dos líneas
de aserción que no justifican su propio gate humano, su propio Codex y su
propia revisión.

| Entrada | Requisitos que le pertenecen |
|---|---|
| **#106** `mobile-meals-bar-motion` | R1, R2, R3, R4 |
| **#107** `mobile-meal-toggle-press-lock` | **R5** |

## Qué cierra #107

**R5** — el candado del feedback de pulsado del botón por franja
(`mobile-pet-tracker/src/app/(tabs)/food.tsx`). Es **requisito de verificación
por la vía (b) de C4**: el `style` ya estaba en producción, así que su commit
rojo contiene la mutación —quitarlo— y el verde la revierte. El diff neto de
`food.tsx` por R5 es cero.

Trazabilidad, veredicto y prueba de humo: los de #106, en
`specs/mobile-meals-bar-motion/traceability.md` y
`progress/review_mobile-meals-bar-motion.md`.

## Por qué #107 se quedó en `spec_ready` mientras se implementaba

`init.sh:156` aborta con más de **una** feature en `in_progress`. Al ser un
solo ciclo con una sola branch, la que lo representa es #106; #107 pasa de
`spec_ready` a `done` de golpe, con el mismo veredicto y la misma prueba de
humo. No es un atajo: es que el harness modela una feature por ciclo y aquí
hay dos entradas compartiendo uno.
