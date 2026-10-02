---
feature: "mobile-meal-schedule-editing"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-meal-schedule-editing]] (#147)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`::`#147 R1: el catálogo trae las nueve claves del horario editable` › `registra las nueve claves en los dos idiomas y en la tabla de la spec de idioma`; también el candado heredado `#65 R12` › `mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas` (+9). | `0cbb155e` — `test(mobile-meal-schedule-editing): lock nine meal schedule editing catalog keys (R1)`<br>`a131c0cc` — `feat(mobile-meal-schedule-editing): add meal schedule editing copy in es and en (R1)`<br>`b5d46054` — `refactor(mobile-meal-schedule-editing): match language spec table format (R1)` |
| R2 | `mobile-pet-tracker/src/api/__tests__/nutrition.test.ts`::`#147 R2: addMealTime publica la franja y mapea por kind` › `publica POST /meal-times con el token y el body exacto, y 201 es ok`; `mapea $label a $kind` (400, 403, cuatro códigos 422 válidos, 422 desconocido/JSON inválido, 401, 200, 404, 500); `devuelve unreachable con el mensaje si fetch rechaza`; `devuelve missing-config sin llamar a fetch si falta la URL base`. 15 casos. | `f559d77a` — `test(mobile-meal-schedule-editing): lock addMealTime request and state mapping (R2)`<br>`35ed6ada` — `feat(mobile-meal-schedule-editing): add addMealTime api client (R2)` |
| R3 | `mobile-pet-tracker/src/api/__tests__/nutrition.test.ts`::`#147 R3: moveMealTime publica el PATCH y mapea por kind` › `publica PATCH /meal-times/:from con body { mealTime: to }, y 200 es ok`; `trata un 201 como error`; `comparte el mapeo de errores de addMealTime`. | `befe2220` — `test(mobile-meal-schedule-editing): lock moveMealTime request and state mapping (R3)`<br>`0438799b` — `feat(mobile-meal-schedule-editing): add moveMealTime api client (R3)` |
| R4 | `mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx`::`#147 R4: solo el owner ve Editar y Añadir comida` › `el owner ve Editar en cada fila y Añadir comida bajo la lista`; `%s no ve controles de edición` (family, walker, vet); `sin el detalle de la mascota resuelto no hay controles`; `con el detalle de la mascota en error no hay controles`.<br>E1-a: `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`::`#98 R10` › `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`, y `#64 R9` › `conserva los usos de bg-accent-soft que sí son acento` (16 + 2). | `9c88290b` — `test(mobile-meal-schedule-editing): lock owner-only meal time controls (R4)`<br>`3c497607` — `feat(mobile-meal-schedule-editing): show edit and add meal controls to owners (R4)`<br>`1526db05` — `test(mobile-meal-schedule-editing): count the meal time controls among accent-soft uses (R4)` |
| R5 | `mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx`::`#147 R5: Editar abre el selector en la hora de la fila y publica el PATCH` › `abre un único selector de hora con la hora local de la fila`; `al elegir una hora nueva llama a moveMealTime con la hora local y cierra el selector`; `al cerrar el selector sin elegir no llama a nada`; `elegir la misma hora de la fila no llama a nada`.<br>E1.2: TZ sobre process real; sonda setUTCHours roja tras el refactor autorizado. | `4a9c91d5` — `test(mobile-meal-schedule-editing): lock edit time picker and PATCH call (R5)`<br>`fc2c792a` — `feat(mobile-meal-schedule-editing): edit a meal time with the native time picker (R5)`<br>`2c873c47` — `refactor(mobile-meal-schedule-editing): apply picker test timezone to Node process (R5,R6)` |
| R6 | `mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx`::`#147 R6: Añadir comida abre el selector a las 12:00 y publica el POST` › `abre el selector a las 12:00 locales`; `al elegir una hora llama a addMealTime con la hora local rellenada a dos dígitos`; `al cerrar el selector sin elegir no llama a nada`.<br>E1.2: TZ sobre process real; sonda setUTCHours roja tras el refactor autorizado. | `2860d495` — `test(mobile-meal-schedule-editing): lock add meal picker and POST call (R6)`<br>`fd48f9c3` — `feat(mobile-meal-schedule-editing): add a meal time with the native time picker (R6)`<br>`2c873c47` — `refactor(mobile-meal-schedule-editing): apply picker test timezone to Node process (R5,R6)` |
| R7 | `mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx`::`#147 R7: tras un éxito refetchea plan y mascota, sin estado optimista` › `tras ok refetchea el plan y el detalle de la mascota y repinta con la hora nueva`; `mientras la edición vuela, todos los controles están deshabilitados y la lista no cambia`; `los controles siguen deshabilitados hasta que termina el refetch`; `un resultado que no es ok no refetchea`.<br>Último it: vía (b); pasa por construcción en el rojo C4. La sonda «refetch en finally» lo hace caer: Expected 1 llamada, Received 2; 1 test rojo / 38 omitidos / 39 total, 1 suite, exit 1. Evidencia en [[../../progress/impl_mobile-meal-schedule-editing\|informe]]. | `13363d1b` — `test(mobile-meal-schedule-editing): lock refetch after success without optimistic state (R7)`<br>`a6a85313` — `feat(mobile-meal-schedule-editing): refetch plan and pet after a meal time edit (R7)` |
| R8 | `mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx`::`#147 R8: cada error del contrato tiene su mensaje` › `$label muestra «$literal»` (invalid, forbidden, NUTRITION_PLAN_REQUIRED, MEAL_TIME_NOT_IN_PLAN, MEAL_TIME_DUPLICATE, MEAL_TIMES_LIMIT_REACHED, unreachable, error, missing-config, rechazo); `401 cierra sesión sin mensaje`; `una nueva edición retira el error anterior`.<br>`mobile-pet-tracker/src/__tests__/ui-language.test.ts`::`#65 R6` (inventario de common.*).<br>E1-b: `mobile-pet-tracker/src/__tests__/design-drift.test.ts`::`#87 R19` › `preserves every mutation sign-out with zero delta` (meal-schedule: 2). | `b343c919` — `test(mobile-meal-schedule-editing): lock meal time edit error messages (R8)`<br>`3d79a82c` — `feat(mobile-meal-schedule-editing): show inline errors for meal time edits (R8)`<br>`e8789628` — `test(mobile-meal-schedule-editing): count the meal schedule 401 sign-out (R8)` |
| R9 | `mobile-pet-tracker/src/__tests__/ui-language.test.ts`::`#147 R9: el copy del horario editable queda registrado` › `nombra las nueve ocurrencias nuevas y las resuelve en su fichero`; candado `#65 R6` › `resuelve las 50 ocurrencias normativas` (38 + 3 + 9). | `f134d9d4` — `test(mobile-meal-schedule-editing): lock meal schedule editing copy registration (R9)`<br>`ddd0ba67` — `feat(mobile-meal-schedule-editing): register meal schedule editing copy uses (R9)` |

Cada fila lleva los **dos** commits del par C4: el `test(...)` (rojo) y el
`feat(...)` (verde), con su hash y su mensaje literal tal como los fija
[[tasks]]. En R7, la fila cita también la sonda de vía (b) del último `it`.

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Verificación de implementación y E1

Los 18 commits C4 conservan su orden y los mensajes literales. Los refactors
`2c873c47` (R5/R6, TZ autorizado y ratificado por E1.2) y `b5d46054` (R1,
formato de §2.16) están después de sus verdes; E1-a y E1-b son commits de test
con un fichero cada uno. La producción no cambia durante Reanudación 1.

E1 parte de 2 suites / 108 tests, 3 fallos, exit 1; tras E1-a queda 1 fallo,
exit 1; tras E1-b pasan los 108, exit 0. Sus tres sondas detectan los fallos
prescritos y se restauran con índice vacío. El informe conserva sus diffs,
los bloques rojos y los resúmenes, así como todas las sondas originales.

Cierre móvil: `bun run test` — 88 suites / 1759 tests, exit 0;
`bun run lint` — exit 0; `test ! -e .expo/types/router.d.ts && bun run typecheck`
— exit 0. Los tres grep-clean de §Cierre salen vacíos. No se añaden suites ni
dependencias. H0 sigue siendo `b367ed44`.

La prueba de humo Android queda a cargo del humano y no se marca realizada.
`./init.sh` queda a cargo del leader antes del reviewer, según el handoff.
Esta tabla documenta evidencia de implementación; el reviewer valida C5/C8.
