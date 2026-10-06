---
feature: "mobile-home-motion-foundations"
status: draft        # draft | approved
tags: [mobile, ui, motion, spec]
---

# Trazabilidad — [[mobile-home-motion-foundations]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/theme/__tests__/motion.test.ts::#152 R1: las duraciones y el preset de movimiento viven en un solo sitio` (6 `it`) | pendiente |
| R2 | `src/theme/__tests__/motion.test.ts::#152 R2: la carta apunta a motion.ts` (3 `it`) | pendiente |
| R3 | `src/screens/home/home-entrance.test.tsx::#152 R3: la receta de entrada de la Home` (2 `it`) | pendiente |
| R4 | `src/screens/home/home-entrance.test.tsx::#152 R4: HomeEntrance escalona por índice y respeta reduce motion` (4 `it`) | pendiente |
| R5 | `src/screens/home/index.test.tsx::#152 R5: la Home envuelve cada bloque en su entrada escalonada` (7 `it`) y los cuatro tests de orden movidos de P8 | pendiente |
| R6 | `src/screens/home/index.test.tsx::#152 R6: la entrada se reproduce una vez por montaje` (2 `it`) | pendiente |
| R7 | `src/screens/home/index.test.tsx::#152 R7: las cifras del resumen aparecen con un fundido` (3 `it`) | pendiente |
| R8 | `src/screens/home/index.test.tsx::#152 R8: la batería del collar se dibuja como barra` (10 casos: `it.each` de 4 filas y 6 `it`) | pendiente |
| R9 | `src/__tests__/design-drift.test.ts::#152 R9: el movimiento de la Home no mete drift de estilo` › `mantiene sus ficheros sin escapes de estilo literales` | pendiente |
| R10 | Smoke humano en dev build de Android (`requirements.md` §Gate humano) | pendiente (humano) |

Rutas relativas a `mobile-pet-tracker/`. Cada fila lleva los hashes de **todos**
sus commits rojos y verdes. R5 y R6 comparten verde con R7 (A): `tasks.md`
lo declara.

Regla: el reviewer no aprueba si alguna fila queda "pendiente". La excepción
es R10, que cierra solo el humano.
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
