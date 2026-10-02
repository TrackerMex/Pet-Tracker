---
feature: "meal-schedule-editing"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[meal-schedule-editing]]

> Rutas relativas a `backend-pet-tracker/`. Los tests nombran su requisito
> como `R<n> (meal-schedule-editing #103): …`. El módulo `nutrition` ya
> acumula R-ids de #17 y #83.
>
> Formato de cada fila:
> - columna de test: `archivo::título del describe`, con varios unidos por
>   `+`;
> - columna de commit: `rojo <hash>; verde <hash>`, más `docs <hash>` si lo
>   hay.
>
> R11 y R12 son candados sobre código ya correcto: su «rojo» es el commit que
> versiona la mutación de producción, y su «verde» el que la revierte.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/db/schema/nutrition.schema.spec.ts::R1 (meal-schedule-editing #103): columna engine_meals_per_day y migracion 0018` | rojo `1e4cb9630b07b17c532977fd3fccac5987565d5c` — `test(meal-schedule-editing): lock engine_meals_per_day column and 0018 migration (R1)`; verde `18fd98c40f9e60d73a4434730abd4c7f1b5088c9` — `feat(meal-schedule-editing): add engine_meals_per_day column and migration 0018 (R1)` |
| R2 | `src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts::R2 (meal-schedule-editing #103): engineMealCount y carriedSchedule deciden el horario del plan nuevo` + `test/meal-times.e2e-spec.ts::R2 (meal-schedule-editing #103): generate conserva el horario editado mientras el motor no cambie el numero de comidas` | rojo `02fee95d3715bee9f0195f491fe8572b7409ec31` — `test(meal-schedule-editing): lock carried meal schedule across generate (R2)`; verde `2798aa364911f07581839e3d37598c115d2add4c` — `feat(meal-schedule-editing): carry edited meal schedule while engine meal count holds (R2)` |
| R3 | `src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts::R3 (meal-schedule-editing #103): copyWithMealTimes ordena, recuenta y resuelve el numero del motor` + `test/meal-times.e2e-spec.ts::R3 (meal-schedule-editing #103): POST meal-times anade una franja como copia nueva del plan` | rojo `21bf4b2b1dfeeb95960d26efc6eab60c12df54d1` — `test(meal-schedule-editing): lock POST meal-times append-only copy (R3)`; verde `71ca28125c3ff9daf1f51ce7bae61ee528c77f89` — `feat(meal-schedule-editing): add POST meal-times endpoint (R3)`; ronda 2 (E3): rojo `ea73bb6dc0f0819f75d3f539a9126c802aa741de` — `test(meal-schedule-editing): lock objective and warnings on edited copy (R3)`; verde `45e744ce43ca5ff067d6412bddc39c5f019f6d1b` — `feat(meal-schedule-editing): restore copyWithMealTimes after R3 lock (R3)` |
| R4 | `test/meal-times.e2e-spec.ts::R4 (meal-schedule-editing #103): PATCH meal-times mueve una franja como copia nueva del plan` | rojo `a9475cf8bc97c1265a80606d5ef893d631c5d65d` — `test(meal-schedule-editing): lock PATCH meal-times move copy (R4)`; verde `b2689215dfbfe049339f509bad6457b5a2750d2c` — `feat(meal-schedule-editing): add PATCH meal-times endpoint (R4)` |
| R5 | `src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts::R5 (meal-schedule-editing #103): el use case mueve la servida del dia civil del owner` + `test/meal-times.e2e-spec.ts::R5 (meal-schedule-editing #103): la servida de hoy se mueve con su franja y los dias pasados no` | rojo `80694b44bd59880c3b7f72e97de08f2db93e3bf1` — `test(meal-schedule-editing): lock today's serving moving with its slot (R5)`; verde `9070f970d70f320a7c791908558f1b82fd238c81` — `feat(meal-schedule-editing): move today's serving with its slot in one transaction (R5)`; ronda 2 (E3): rojo `ae11f28e5ce4bfa34142e832a11f55573e45ca7c` — `test(meal-schedule-editing): lock serving move to the edited pet (R5)`; verde `888e07a6886cea74874467cc1733dff0dd9a4c70` — `feat(meal-schedule-editing): restore pet filter on serving delete after R5 lock (R5)`; ronda 3 (E4): rojo `eff86580e75ba3f115614533bc761560740dbae2` — `test(meal-schedule-editing): lock today-only destination check on serving move (R5)`; verde `f3254d701ac8d730c1b65c15c081243324dada19` — `feat(meal-schedule-editing): restore served_on in destination check after R5 lock (R5)` |
| R6 | `test/meal-times.e2e-spec.ts::R6 (meal-schedule-editing #103): si el destino ya tiene servida hoy, gana la del destino` | rojo `16a719d46c644d11ef8b12bbfabb9aead0df722c` — `test(meal-schedule-editing): lock destination-wins merge on slot collision (R6)`; verde `f1c23818ac3cf2a6ee74f9d8278c7b827e4b794f` — `feat(meal-schedule-editing): merge serving into destination slot on collision (R6)` |
| R7 | `src/modules/nutrition/application/use-cases/add-meal-time.use-case.spec.ts::R7 (meal-schedule-editing #103): meal_time.add se audita despues de escribir y nunca si falla` + `src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts::R7 (meal-schedule-editing #103): meal_time.move se audita despues de escribir y nunca si falla` + `test/meal-times.e2e-spec.ts::R7 (meal-schedule-editing #103): POST y PATCH dejan filas meal_time.add y meal_time.move en audit_log` | rojo `ffb56bd1df166eb6041cc6569e4bd593ee75b615` — `test(meal-schedule-editing): lock meal_time audit after write (R7)`; verde `78a855637692764811c364701215f40d0df5a3d0` — `feat(meal-schedule-editing): audit meal_time.add and meal_time.move (R7)` |
| R8 | `test/meal-times.e2e-spec.ts::R8 (meal-schedule-editing #103): body invalido responde 400 antes de leer el plan` | rojo `8bf834b0cc567a923a893931c81ba7be01cd9916` — `test(meal-schedule-editing): lock strict HH:MM validation on meal-times (R8)`; verde `d4d6d9c5efbbb12114e22cb2a3b2a17e9552feb4` — `feat(meal-schedule-editing): validate meal-times body with strict HH:MM (R8)` |
| R9 | `src/modules/nutrition/application/use-cases/add-meal-time.use-case.spec.ts::R9 (meal-schedule-editing #103): el POST lanza en orden sin escribir ni auditar` + `src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts::R9 (meal-schedule-editing #103): el PATCH lanza en orden sin escribir ni auditar` + `test/meal-times.e2e-spec.ts::R9 (meal-schedule-editing #103): 422 con code propio y sin persistir` | rojo `72d51b7ff82886efed27fc3d96928cdcffc577c6` — `test(meal-schedule-editing): lock meal-times 422 codes and order (R9)`; verde `0e03cd0faa1fa98ed24742d672e96e2b9f7a80ab` — `feat(meal-schedule-editing): reject duplicate and seventh meal times (R9)` |
| R10 | `test/meal-times.e2e-spec.ts::R10 (meal-schedule-editing #103): solo el owner edita; 404 del guard precede` | rojo `9c32efc4f04b1889edb16de77c95588f44b30e92` — `test(meal-schedule-editing): lock owner-only meal-times edits (R10)`; verde `7b44b6040cb855beb504cd105bfd5faed99c33db` — `feat(meal-schedule-editing): restrict meal-times edits to owner (R10)` |
| R11 | `test/meal-times.e2e-spec.ts::R11 (meal-schedule-editing #103): servir, deshacer, GET del plan y perfil leen el plan editado` | rojo `fd735a33161890ae75260c3fd11197028f3ea448` — `test(meal-schedule-editing): lock readers on edited plan (R11)`; verde `caa769d2c584552646429aa24ac63ccb0813222e` — `feat(meal-schedule-editing): restore pet-meals reader order after R11 lock (R11)` |
| R12 | `test/meal-times.e2e-spec.ts::R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve` | rojo `9545c71cf81d9a3fa52c228630a464683f43fca3` — `test(meal-schedule-editing): lock inputsHash and aiExplanation on edited copy (R12)`; verde `924fd21d5273028b2a348b39f06a0511131e3704` — `feat(meal-schedule-editing): restore copyWithMealTimes after R12 lock (R12)` |
| R13 | Verificación C4 vía (b): `progress/impl_meal-schedule-editing.md` §R13, comandos (a) 1–7; (a) 8–9 delegados al leader | docs `95f66de660c9205ca564c069117afb5f23ec7923` — `docs(meal-schedule-editing): document engine_meals_per_day and amend #83 D4 (R13)` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".

Convención de commit:
- `test(meal-schedule-editing): … (R<n>)` para el rojo;
- `feat(meal-schedule-editing): … (R<n>)` para el verde;
- `docs(meal-schedule-editing): … (R13)` para las docs.

El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
