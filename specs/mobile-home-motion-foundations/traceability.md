---
feature: "mobile-home-motion-foundations"
status: draft        # draft | approved
tags: [mobile, ui, motion, spec]
---

# Trazabilidad — [[mobile-home-motion-foundations]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/theme/__tests__/motion.test.ts::#152 R1: las duraciones y el preset de movimiento viven en un solo sitio` (6 `it`) | Rojo: `f110abac test(mobile-home): #152 R1 red, motion constants`<br>Verde: `a588f1d8 feat(mobile-home): #152 R1 motion constants in theme/motion.ts` |
| R2 | `src/theme/__tests__/motion.test.ts::#152 R2: la carta apunta a motion.ts` (3 `it`) | Rojo: `595665b3 test(mobile-home): #152 R2 red, charter points to motion.ts`<br>Verde: `40ef31a7 docs(mobile-home): #152 R2 charter amendment A21 for motion.ts` |
| R3 | `src/screens/home/home-entrance.test.tsx::#152 R3: la receta de entrada de la Home` (2 `it`) | Rojo: `de2bab96 test(mobile-home): #152 R3 red, home entrance recipe`<br>Verde: `0b2ba0da feat(mobile-home): #152 R3 homeEntering worklet` |
| R4 | `src/screens/home/home-entrance.test.tsx::#152 R4: HomeEntrance escalona por índice y respeta reduce motion` (4 `it`) | Rojo: `3f42c163 test(mobile-home): #152 R4 red, staggered HomeEntrance`<br>Rojo E1: `891bc4f6 test(mobile-home): #152 R4 red, reanimated double declares __esModule`<br>Verde: `a34c2712 feat(mobile-home): #152 R4 HomeEntrance wrapper` |
| R5 | `src/screens/home/index.test.tsx::#152 R5: la Home envuelve cada bloque en su entrada escalonada` (23 casos) y los cuatro tests de orden movidos de P8 | Rojo: `557ce704 test(mobile-home): #152 R5 red, staggered Home blocks`<br>Verde: `60371e0a feat(mobile-home): #152 R5 wrap Home blocks in HomeEntrance`<br>Verde compartido R7 A: `630a611e feat(mobile-home): #152 R7 fade in the summary row`<br>Rojo E4: `8f680bcf test(mobile-home): #152 R5 R7 R8 red, wrappers, fade and battery copy locked on every branch`<br>Verde E4: `3406b9d6 feat(mobile-home): #152 R5 R7 R8 green, revert the probe mutation` |
| R6 | `src/screens/home/index.test.tsx::#152 R6: la entrada se reproduce una vez por montaje` (2 `it`) | Rojo: `29eba7b1 test(mobile-home): #152 R6 red, entrance plays once per mount`<br>Rojo E2: `bb7f3194 test(mobile-home): #152 R6 red, weight wait matches the full text`<br>Verde compartido R7 A: `630a611e feat(mobile-home): #152 R7 fade in the summary row` |
| R7 | `src/screens/home/index.test.tsx::#152 R7: las cifras del resumen aparecen con un fundido` (12 casos) | Rojo A: `a7cbd7d7 test(mobile-home): #152 R7 red, summary reveal fade`<br>Verde A: `630a611e feat(mobile-home): #152 R7 fade in the summary row`<br>Rojo B: `c872a3e1 test(mobile-home): #152 R7 red, no fade over the skeleton`<br>Verde B: `b25535eb feat(mobile-home): #152 R7 keep the skeleton without fade`<br>Rojo E4: `8f680bcf test(mobile-home): #152 R5 R7 R8 red, wrappers, fade and battery copy locked on every branch`<br>Verde E4: `3406b9d6 feat(mobile-home): #152 R5 R7 R8 green, revert the probe mutation` |
| R8 | `src/screens/home/index.test.tsx::#152 R8: la batería del collar se dibuja como barra` (12 casos: `it.each` de 4 filas y 8 `it`; R8.3 y R8.4 leen el ancho del primer render con `toHaveStyle`, según E3) | Rojo A: `5606d328 test(mobile-home): #152 R8 red, collar battery bar`<br>Verde A: `6da3a9c7 feat(mobile-home): #152 R8 collar battery bar`<br>Rojo B: `26092abf test(mobile-home): #152 R8 red, no bar without percentage or collar`<br>Verde B: `b0ab47fc feat(mobile-home): #152 R8 bar only with a numeric percentage`<br>Ajuste E3 con R9 rojo: `11dffcf4 test(mobile-home): #152 R9 red, R8 reads the fill width without StyleSheet`<br>Rojo E4: `8f680bcf test(mobile-home): #152 R5 R7 R8 red, wrappers, fade and battery copy locked on every branch`<br>Verde E4: `3406b9d6 feat(mobile-home): #152 R5 R7 R8 green, revert the probe mutation` |
| R9 | `src/__tests__/design-drift.test.ts::#152 R9: el movimiento de la Home no mete drift de estilo` › `mantiene sus ficheros sin escapes de estilo literales` | Rojo: `4daff5ff test(mobile-home): #152 R9 red, no style drift in Home motion`<br>Rojo E3: `11dffcf4 test(mobile-home): #152 R9 red, R8 reads the fill width without StyleSheet`<br>Verde: `86f4b6ed fix(mobile-home): #152 R9 cite the feature with its R-id` |
| R10 | Smoke humano en dev build de Android (`requirements.md` §Gate humano) | pendiente (humano) |

Rutas relativas a `mobile-pet-tracker/`. Cada fila lleva los hashes de **todos**
sus commits rojos y verdes. R5 y R6 comparten verde con R7 (A): `tasks.md`
lo declara.

La enmienda E3 del handoff sustituye en R8.3 y R8.4
`StyleSheet.flatten(fill.props.style).width` por `toHaveStyle` sobre el relleno:
se lee el mismo `props.style` del primer render, sin cambiar los guards
históricos ni reescribir `requirements.md`. Su commit figura también en R9
porque se registra manteniendo rojo el comentario mutado de producción.

Regla: el reviewer no aprueba si alguna fila queda "pendiente". La excepción
es R10, que cierra solo el humano.
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
