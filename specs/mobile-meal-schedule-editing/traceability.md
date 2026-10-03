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
| R3 | `mobile-pet-tracker/src/api/__tests__/nutrition.test.ts`::`#147 R3: moveMealTime publica el PATCH y mapea por kind` › `publica PATCH /meal-times/:from con body { mealTime: to }, y 200 es ok`; `trata un 201 como error`; `comparte el mapeo de errores de addMealTime`.<br>E4-c (E4.3): `PATCH mapea $label como la tabla de R2` añade las cuatro filas 422: `NUTRITION_PLAN_REQUIRED`, `MEAL_TIMES_LIMIT_REACHED`, `SOMETHING_ELSE` y JSON inválido. Vía (b): las sondas 3–6 caen solo en su fila, por matcher; evidencia en el informe, Reanudacion 4. | `befe2220` — `test(mobile-meal-schedule-editing): lock moveMealTime request and state mapping (R3)`<br>`0438799b` — `feat(mobile-meal-schedule-editing): add moveMealTime api client (R3)`<br>`f170159f` — `test(mobile-meal-schedule-editing): lock the remaining R2 table rows on the PATCH mapping (R3)` |
| R4 | `mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx`::`#147 R4: solo el owner ve Editar y Añadir comida` › `el owner ve Editar en cada fila y Añadir comida bajo la lista`; `%s no ve controles de edición` (family, walker, vet); `sin el detalle de la mascota resuelto no hay controles`; `con el detalle de la mascota en error no hay controles`.<br>E1-a: `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`::`#98 R10` › `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`, y `#64 R9` › `conserva los usos de bg-accent-soft que sí son acento` (16 + 2). | `9c88290b` — `test(mobile-meal-schedule-editing): lock owner-only meal time controls (R4)`<br>`3c497607` — `feat(mobile-meal-schedule-editing): show edit and add meal controls to owners (R4)`<br>`1526db05` — `test(mobile-meal-schedule-editing): count the meal time controls among accent-soft uses (R4)` |
| R5 | `mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx`::`#147 R5: Editar abre el selector en la hora de la fila y publica el PATCH` › `abre un único selector de hora con la hora local de la fila`; `al elegir una hora nueva llama a moveMealTime con la hora local y cierra el selector`; `al cerrar el selector sin elegir no llama a nada`; `elegir la misma hora de la fila no llama a nada`.<br>E1.2: TZ sobre process real; sonda setUTCHours roja tras el refactor autorizado.<br>E4-d (E4.4): en este describe, `Editar en la primera fila abre el selector con su hora y la publica como origen` canda el selector a las 07:30 y el PATCH con origen `'07:30'`. Vía (b): la sonda 7 cae solo en este it por matcher de la hora; evidencia en el informe, Reanudacion 4. | `4a9c91d5` — `test(mobile-meal-schedule-editing): lock edit time picker and PATCH call (R5)`<br>`fc2c792a` — `feat(mobile-meal-schedule-editing): edit a meal time with the native time picker (R5)`<br>`2c873c47` — `refactor(mobile-meal-schedule-editing): apply picker test timezone to Node process (R5,R6)`<br>`81e26781` — `test(mobile-meal-schedule-editing): lock the first row's time as the edit origin (R5)` |
| R6 | `mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx`::`#147 R6: Añadir comida abre el selector a las 12:00 y publica el POST` › `abre el selector a las 12:00 locales`; `al elegir una hora llama a addMealTime con la hora local rellenada a dos dígitos`; `al cerrar el selector sin elegir no llama a nada`.<br>E1.2: TZ sobre process real; sonda setUTCHours roja tras el refactor autorizado. | `2860d495` — `test(mobile-meal-schedule-editing): lock add meal picker and POST call (R6)`<br>`fd48f9c3` — `feat(mobile-meal-schedule-editing): add a meal time with the native time picker (R6)`<br>`2c873c47` — `refactor(mobile-meal-schedule-editing): apply picker test timezone to Node process (R5,R6)` |
| R7 | `mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx`::`#147 R7: tras un éxito refetchea plan y mascota, sin estado optimista` › `tras ok refetchea el plan y el detalle de la mascota y repinta con la hora nueva`; `mientras la edición vuela, todos los controles están deshabilitados y la lista no cambia`; `los controles siguen deshabilitados hasta que termina el refetch`; `un resultado que no es ok no refetchea`.<br>Último it: vía (b); pasa por construcción en el rojo C4. La sonda «refetch en finally» lo hace caer: Expected 1 llamada, Received 2; 1 test rojo / 38 omitidos / 39 total, 1 suite, exit 1. Evidencia en [[../../progress/impl_mobile-meal-schedule-editing\|informe]].<br>E2-a (E2.2): en `#147 R8: cada error del contrato tiene su mensaje`, las diez filas de `$label muestra «$literal»` (invalid, forbidden, NUTRITION_PLAN_REQUIRED, MEAL_TIME_NOT_IN_PLAN, MEAL_TIME_DUPLICATE, MEAL_TIMES_LIMIT_REACHED, unreachable, error, missing-config, rechazo) y `401 cierra sesión sin mensaje` candan una sola llamada a `mockGetNutritionPlan` y `mockGetPet` tras la espera de cierre.<br>E2-b (E2.1): en este describe de R7, `tras ok de Añadir refetchea el plan y el detalle de la mascota y repinta con la fila nueva`; `mientras Añadir vuela, todos los controles están deshabilitados y no aparece la fila nueva`; `tras ok de Añadir los controles siguen deshabilitados y sin fila nueva hasta que termina el refetch`. Vía (b): las 13 sondas de E2 y su control fallan exactamente por los matchers prescritos; diffs y primeras líneas rojas en el informe, sección Reanudación 2.<br>E3-a (E3.1): en este describe de R7, `los controles siguen deshabilitados hasta que termina también el refetch de la mascota`; `tras ok de Añadir los controles siguen deshabilitados hasta que termina también el refetch de la mascota`. Retienen la segunda llamada a getPet en Editar y Añadir: plan repintado, todos los controles deshabilitados y rehabilitación solo al resolver la mascota. Vía (b): las dos sondas de E3 caen exactamente en ambos it por matcher de disabled: true; evidencia en el informe, sección Reanudación 3.<br>E4-a (E4.1): `los controles siguen deshabilitados hasta que termina el refetch` canda también la ausencia de `20:05` y la fila 1 con `19:30` mientras el refetch del plan está retenido. Vía (b): la sonda 1 cae solo en este it por matcher de ausencia de la hora nueva; evidencia en el informe, Reanudacion 4. | `13363d1b` — `test(mobile-meal-schedule-editing): lock refetch after success without optimistic state (R7)`<br>`a6a85313` — `feat(mobile-meal-schedule-editing): refetch plan and pet after a meal time edit (R7)`<br>`e277b810` — `test(mobile-meal-schedule-editing): lock no refetch on every failed meal time edit (R7)`<br>`bf81642a` — `test(mobile-meal-schedule-editing): lock refetch and disabled controls for added meal times (R7)`<br>`e184ab68` — `test(mobile-meal-schedule-editing): lock disabled controls until the pet detail refetch ends (R7)`<br>`a9406528` — `test(mobile-meal-schedule-editing): lock unchanged list while the edit refetch is in flight (R7)` |
| R8 | `mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx`::`#147 R8: cada error del contrato tiene su mensaje` › `$label muestra «$literal»` (invalid, forbidden, NUTRITION_PLAN_REQUIRED, MEAL_TIME_NOT_IN_PLAN, MEAL_TIME_DUPLICATE, MEAL_TIMES_LIMIT_REACHED, unreachable, error, missing-config, rechazo); `401 cierra sesión sin mensaje`; `una nueva edición retira el error anterior`.<br>`mobile-pet-tracker/src/__tests__/ui-language.test.ts`::`#65 R6` (inventario de common.*).<br>E1-b: `mobile-pet-tracker/src/__tests__/design-drift.test.ts`::`#87 R19` › `preserves every mutation sign-out with zero delta` (meal-schedule: 2).<br>E4-b (E4.2): en este describe, `una nueva llamada de Añadir retira el error anterior` canda la retirada del error durante la llamada pendiente de Añadir, con los controles deshabilitados.<br>E4-e (E4.5): `401 en Añadir cierra sesión sin mensaje` canda signOut una vez, rehabilitación, ausencia de mensaje y ningún refetch. Vía (b): las sondas 2 y 8 caen solo en su it, por matcher; evidencia en el informe, Reanudacion 4. | `b343c919` — `test(mobile-meal-schedule-editing): lock meal time edit error messages (R8)`<br>`3d79a82c` — `feat(mobile-meal-schedule-editing): show inline errors for meal time edits (R8)`<br>`e8789628` — `test(mobile-meal-schedule-editing): count the meal schedule 401 sign-out (R8)`<br>`12730ded` — `test(mobile-meal-schedule-editing): lock error clearing when a new add starts (R8)`<br>`0e56c182` — `test(mobile-meal-schedule-editing): lock sign-out on 401 from add (R8)` |
| R9 | `mobile-pet-tracker/src/__tests__/ui-language.test.ts`::`#147 R9: el copy del horario editable queda registrado` › `nombra las nueve ocurrencias nuevas y las resuelve en su fichero`; candado `#65 R6` › `resuelve las 50 ocurrencias normativas` (38 + 3 + 9). | `f134d9d4` — `test(mobile-meal-schedule-editing): lock meal schedule editing copy registration (R9)`<br>`ddd0ba67` — `feat(mobile-meal-schedule-editing): register meal schedule editing copy uses (R9)` |

Cada fila lleva los **dos** commits del par C4: el `test(...)` (rojo) y el
`feat(...)` (verde), con su hash y su mensaje literal tal como los fija
[[tasks]]. En R7, la fila cita también la sonda de vía (b) del último `it`.

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Verificación de implementación, E1 y E2

Los 18 commits C4 conservan su orden y los mensajes literales. Los refactors
`2c873c47` (R5/R6, TZ autorizado y ratificado por E1.2) y `b5d46054` (R1,
formato de §2.16) están después de sus verdes; E1-a y E1-b son commits de test
con un fichero cada uno. La producción no cambia durante Reanudación 1.

E1 parte de 2 suites / 108 tests, 3 fallos, exit 1; tras E1-a queda 1 fallo,
exit 1; tras E1-b pasan los 108, exit 0. Sus tres sondas detectan los fallos
prescritos y se restauran con índice vacío. El informe conserva sus diffs,
los bloques rojos y los resúmenes, así como todas las sondas originales.

Cierre móvil de E1: `bun run test` — 88 suites / 1759 tests, exit 0;
`bun run lint` — exit 0; `test ! -e .expo/types/router.d.ts && bun run typecheck`
— exit 0. Los tres grep-clean de §Cierre salen vacíos. No se añaden suites ni
dependencias. H0 sigue siendo `b367ed44`.

La prueba de humo Android queda a cargo del humano y no se marca realizada.
`./init.sh` queda a cargo del leader antes del reviewer, según el handoff.
Esta tabla documenta evidencia de implementación; el reviewer valida C5/C8.

## Verificación de la Enmienda E2

`e277b810` (E2-a) añade las aserciones de ningún refetch a las diez filas de
R8 y al 401: 1 suite / 51 tests, exit 0 antes y después. `bf81642a` (E2-b)
añade los tres tests de R7 sobre Añadir: 1 suite / 54 tests, exit 0. Ambos
commits llevan solo `mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx`.

Las 13 sondas y el control de tasks.md §Enmienda E2 se ejecutaron por
separado sobre el verde: todas fallan exactamente en los tests y matchers
prescritos, con exit 1. Tras cada una se restaura producción desde HEAD;
índice y status quedan vacíos. Ninguna sonda queda omitida.

Cierre de Reanudación 2: gate de procesos vacío; `bun run test` — 88 suites /
1762 tests, exit 0; `bun run lint` — exit 0;
`test ! -e .expo/types/router.d.ts && bun run typecheck` — exit 0;
los tres grep-clean vacíos. H0 sigue siendo `b367ed44`. Son 26 commits
propios y los mismos 13 ficheros de design.md; los tres commits del leader y
sus seis ficheros se identifican por separado en el informe. La producción
coincide con `f26f85fd`; no se rebasea ni se enmienda ningún commit.

## Verificación de la Enmienda E3

`e184ab68` (E3-a) añade los dos it de R7 que retienen el refetch de la
mascota, uno para Editar y otro para Añadir. Base: 1 suite / 54 tests, exit 0;
tras E3-a: 1 suite / 56 tests, exit 0. El commit lleva solo
`mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx` y copia el
bloque literal de tasks.md.

Las dos sondas de E3 se ejecutaron por separado sobre el verde: cada una
falla únicamente en los dos it nuevos, por matcher de disabled: true frente
a false, con 2 fallos / 54 verdes / 56 total y exit 1. Tras cada sonda se
restaura producción desde HEAD y el índice y el status quedan vacíos.

Cierre de Reanudación 3: gate de procesos vacío; `bun run test` — 88 suites /
1764 tests, exit 0; `bun run lint` — exit 0;
`test ! -e .expo/types/router.d.ts && bun run typecheck` — exit 0;
los tres grep-clean vacíos. H0 sigue siendo `b367ed44`. Son 28 commits
propios y los mismos 13 ficheros de design.md; los cinco commits del leader
y sus seis ficheros se identifican por separado en el informe. La producción
coincide con `39174fe7`; no se rebasea ni se enmienda ningún commit.

## Verificación de la Enmienda E4

Los cinco commits de test son literales y vía (b), con un solo fichero por
commit: E4-a `a9406528` (R7), E4-b `12730ded` (R8), E4-c `f170159f`
(R3), E4-d `81e26781` (R5) y E4-e `0e56c182` (R8). No cambian producción.
Base: pantalla 56/56 y API 58/58, exit 0. Tras E4-a…E4-e: pantalla
59/59 y API 62/62, exit 0; +7 tests y ninguna suite nueva.

Las ocho sondas de E4 se ejecutaron por separado sobre el verde. Cada una
falla solo en el it o fila prescritos, por matcher, con exit 1. Después de
cada sonda se restaura el fichero de producción desde HEAD; índice y status
quedan vacíos. El informe, sección Reanudacion 4, conserva los ocho diffs,
las primeras líneas rojas, los recuentos y los comandos.

Cierre de Reanudacion 4: gate de procesos vacío; `bun run test` — 88 suites /
1771 tests, exit 0; `bun run lint` — exit 0;
`test ! -e .expo/types/router.d.ts && bun run typecheck` — exit 0;
los tres grep-clean vacíos. H0 sigue en `b367ed44`. Son 34 commits propios,
13 ficheros propios y 19 rutas totales, incluidos los seis ficheros del
leader que se identifican por separado en el informe. La producción coincide
con `f64a3c60`. No se rebasea ni se enmienda ningún commit. El smoke Android
y el lifecycle posterior siguen a cargo del humano y del leader.
