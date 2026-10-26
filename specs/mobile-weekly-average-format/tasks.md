---
feature: "mobile-weekly-average-format"
status: draft
tags: [harness, spec]
---

# Tareas — [[mobile-weekly-average-format]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. El diseño y el inventario de
> candados están en [[design]]. Rutas relativas a `mobile-pet-tracker/src/`.

## Cadena de commits (test primero, historial rojo a verde)

Cada commit `test(...)` deja tests rojos por la razón correcta y su `feat(...)` los pone
verdes. Ningún commit mezcla tests, implementación y docs. Cada commit corre
`bun run typecheck` y el jest de su alcance; el último `feat` corre el jest completo sin
pipe (memoria «Exit code tras un pipe»). Los tres literales de coma de la tendencia se
enmiendan en el commit de **test** de C2 (son la aserción roja, no un candado colateral).

| Commit | Tipo | Contenido | R | Estado esperado |
|---|---|---|---|---|
| C1 | test | `screens/home/format.test.ts`: `describe('#219 ...')` con R1, R2, R3 (`it.each`) | R1-R3 | 12 filas rojas de R1, 8 de R2; R3 y las filas «verde al nacer» verdes (declaradas en [[requirements]]) |
| C2 | test | `screens/home/weekly-activity-chart.test.tsx`: R4, R5, R6, R7 + tres literales de coma enmendados | R4-R7 | R4 rojo (formateadores aún sin cambiar), R6/R7 rojos; R5 y las filas verdes declaradas, verdes |
| C3 | feat | `screens/home/format.ts`: `fmtMinutes` y `fmtCount` | R1, R2 | C1 y R4 en verde; R6/R7 siguen rojos |
| C4 | feat | `screens/home/weekly-activity-chart.tsx`: `formatTrendPercent` | R6, R7 | todo verde |
| C5 | docs | `traceability.md` con hashes y `progress/impl_mobile-weekly-average-format.md` | todos | |

Por qué C2 va antes que C3: así R4 nace rojo por la razón correcta (el formateador viejo
da `Media 3h 30.333333333333343m`). Si R4 se escribiese después de C3 nacería verde y no
probaría nada.

Cuentas encadenadas: ningún inventario cambia (cero claves, cero ficheros, cero clases).
`git diff --stat` tras C1: 1 fichero; tras C2: 2; tras C3: 3; tras C4: 4 ficheros de `src/`.

Prueba de mutación obligatoria, registrada en el reporte (cada una se planta, se ve el
rojo concreto y se revierte): (a) quitar `Math.round` de `fmtMinutes`; (b) `fmtCount`
con `Math.round(count * 10) / 10`; (c) `fmtKm` devolviendo `'22 km'`; (d) `Math.round`
sobre `average` en el gráfico; (e) pasar `locale` de vuelta al constructor de la tendencia.

Prohibido para Codex: `./init.sh` (lo corre el leader), crear recursos AWS, tocar
`catalog.ts`, `ui-copy-table.ts`, `ui-language.test.ts`, `language-provider.test.tsx`,
`design-drift.test.ts`, `screens/map/index.tsx`, `global.css`. Skills: nombres del
catálogo de Codex del handoff, no los de Claude Code. Esperas sobre el árbol:
`docs/conventions.md` §Esperas sobre el árbol renderizado (`await` en `fireEvent`,
`renderRouter` y `act`; sin contadores de mock). Tras pulsar una métrica con
`await fireEvent.press`, leer la etiqueta con `await screen.findBy...` / `waitFor`, no con un
contador.

## R1 — `fmtMinutes` redondea antes de partir (19 filas)

- [ ] (1) Escribir test que falla para R1 (`screens/home/format.test.ts`, `it.each '#219 R1'`)
- [ ] (2) Implementación mínima que lo pasa (`Math.round` y luego horas/minutos)
- [ ] (3) Refactor con tests verdes

## R2 — `fmtCount` a un decimal sin `.0` (13 filas)

- [ ] (1) Escribir test que falla para R2 (`it.each '#219 R2'`, incluye `3.05`)
- [ ] (2) Implementación mínima que lo pasa (`String(Number(count.toFixed(1)))`)
- [ ] (3) Refactor con tests verdes

## R3 — `fmtKm` no cambia (8 filas, nacen verdes)

- [ ] (1) Escribir test de regresión para R3 (`it.each '#219 R3'`); declarar que nace verde y planta la mutación (c)
- [ ] (2) Sin implementación: `fmtKm` queda intacto
- [ ] (3) Refactor con tests verdes

## R4 — etiqueta de media con el formato nuevo (9 filas)

- [ ] (1) Escribir test que falla para R4 (`weekly-activity-chart.test.tsx`, `describe '#219 R4'`, regex anclada)
- [ ] (2) Implementación mínima que lo pasa (la cubre C3; sin cambio en el componente)
- [ ] (3) Refactor con tests verdes

## R5 — la línea de media usa el valor real

- [ ] (1) Escribir test de regresión para R5 (nace verde; mutación (d) lo pone rojo)
- [ ] (2) Sin implementación: `average` no se redondea
- [ ] (3) Refactor con tests verdes

## R6 — tendencia con punto decimal en los dos idiomas

- [ ] (1) Enmendar los tres literales de coma y escribir el `it.each '#219 R6'` (9 filas es) más el `it` en inglés
- [ ] (2) Implementación mínima que lo pasa (`formatTrendPercent` con `LOCALES.en`, `useGrouping: false`, sin `.replace`)
- [ ] (3) Refactor con tests verdes (retirar el parámetro `locale` si queda sin uso)

## R7 — la tendencia no depende del locale del entorno

- [ ] (1) Escribir test que falla para R7 (doble de `Intl.NumberFormat`, restaurado en `finally`)
- [ ] (2) Implementación mínima que lo pasa (la misma de R6)
- [ ] (3) Refactor con tests verdes

## R8 — no regresión de los demás consumidores

- [ ] (1) Sin test nuevo: ejecutar `home/index.test.tsx`, `weekly-activity-chart.test.tsx` y `pingo-phrase.test.ts`
- [ ] (2) Sin implementación; el reporte lista `git diff origin/dev` de esos ficheros (solo los tres literales)
- [ ] (3) Refactor con tests verdes

## R9 — sin claves, ficheros ni deps nuevas; grep-limpio

- [ ] (1) Sin test nuevo: ejecutar `design-drift`, `ui-language`, `language-provider` sin editar
- [ ] (2) Sin implementación; `git diff origin/dev --stat` solo lista los cuatro ficheros de [[design]]
- [ ] (3) `bun run typecheck`, `bun run lint` (con `> log 2>&1 && test ! -s log`) y `bun run test` completo sin pipe, código 0
