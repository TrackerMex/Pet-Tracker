# review: mobile-meal-schedule-editing (#147)
Fecha: 2026-10-02T22:51Z
Veredicto: RECHAZADO

Revisado en HEAD `d05d8725` (`feature/147-mobile-meal-schedule-editing`), base
`origin/main` = `cb14497c`, H0 = `b367ed44`. El leader corrió `./init.sh` en ese
HEAD y yo leí su log. No lo relancé, por instrucción y por el Postgres compartido.

**Motivo único del rechazo:** R7 tiene dos cláusulas sin candado. Hay 13 sondas
de producción que dejan `src/screens/meal-schedule` en 51/51 verde (detalle
en §Observaciones, 1).

- **El flujo Añadir (la llamada de R6) no tiene ningún test de R7.** Pasan en
  verde tres cosas: la fila optimista, los controles habilitados durante el
  vuelo y la ausencia de refetch tras el ok.
- **«Ningún refetch si el kind no es ok» solo está candado para
  `MEAL_TIME_DUPLICATE`.** Las otras 9 ramas de error están ciegas.

La producción cumple R7 hoy: el defecto está en el candado, no en el código.
Tampoco lo causó el implementer. `tasks.md` §R7 prescribió los cuatro `it` solo
sobre el flujo Editar, y la tabla de sondas solo pedía «refetch en `finally`».
Codex hizo lo prescrito. Cerrarlo cambia las cifras de §Cifras (1759), así que
hace falta una enmienda de spec antes de volver al implementer.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: solo #147)
- [x] progress/current.md describe la sesión activa (lo modifica el leader, sin commit; no es mío)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: N/A en móvil. El cliente HTTP está en `src/api/nutrition.ts` y la pantalla lo consume vía TanStack Query
- [x] repositories/contratos en domain son interfaces puras: N/A, sin capa domain en móvil
- [x] application depende de interfaces, no implementaciones: N/A
- [x] infrastructure sin lógica de negocio: `editMealTimeState` solo mapea status a kind; los mensajes viven en la pantalla

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra (`#147 R1` … `#147 R9`, más los candados globales de E1)
- [x] El historial muestra test primero. Medí cada par en un worktree temporal (ya borrado) con `bunx jest` sin pipe:

  | Par | Rojo (commit test) | Verde (commit feat) |
  |---|---|---|
  | R1 `0cbb155e`→`a131c0cc` | 2/12 rojos por matcher (`#65 R12` y `#147 R1`), exit 1 | 12/12, exit 0 |
  | R2 `f559d77a`→`35ed6ada` | 15/55 rojos por `TypeError: (0 , _nutrition.addMealTime) is not a function`, exit 1. Lo acepta `tasks.md` §R2: el sujeto es la propia función, no un helper de test | 55/55, exit 0 |
  | R3 `befe2220`→`0438799b` | 3/58 rojos por `TypeError … moveMealTime is not a function`, exit 1. Aceptado igual en `tasks.md` §R3 | 58/58, exit 0 |
  | R4 `9c88290b`→`3c497607` | 6/28 rojos, exit 1 | 28/28, exit 0 |
  | R5 `4a9c91d5`→`fc2c792a` | 4/32 rojos por matcher, exit 1 | 32/32, exit 0 |
  | R6 `2860d495`→`fd48f9c3` | 3/35 rojos por matcher, exit 1 | 35/35, exit 0 |
  | R7 `13363d1b`→`a6a85313` | 3/39 rojos (its 1-3), exit 1. El it 4 va por vía (b) | 39/39, exit 0 |
  | R8 `b343c919`→`3d79a82c` (3 ficheros) | 14/90 rojos, exit 1 | 90/90, exit 0 |
  | R9 `f134d9d4`→`ddd0ba67` | 2/28 rojos por matcher (41 frente a 50, y el filtro), exit 1 | 28/28, exit 0 |
  | E1 `d8edb20e`→`1526db05`→`e8789628` (2 ficheros) | 3/108 rojos, luego 1/108 | 108/108, exit 0 |

  Ningún rojo cae por `ReferenceError` de un helper de test ni por mutar un doble.
- [x] El it 4 de R7 cierra por vía (b). Mi sonda «refetch en `finally`» lo pone rojo por matcher: `Expected number of calls: 1 / Received number of calls: 2`.
- [ ] **El candado de R7 no cubre todo el requisito** (§Observaciones, 1). C4 exige que los tests vigilen el requisito, y aquí 13 mutaciones de R7 sobreviven.
- [x] Refactors sin cambio de conducta ni de cifras:
  - `2c873c47` solo cambia `process.env` por `hostProcess.env` en dos `it`, y la cuenta queda en 51/51 antes y después. Además, en su padre la sonda `setUTCHours` daba 51/51 verde (la técnica vieja era ciega) y en HEAD da 2 rojos. Eso confirma E1.2.
  - `b5d46054` solo toca `specs/mobile-ui-language/design.md` (formato de §2.16, el mismo que §2.14 y §2.15).

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente"
- [x] Los 22 hashes citados son ancestros de HEAD (`git merge-base --is-ancestor`, todos ok), y todos los nombres de test citados existen
- [x] Los commits siguen `feat|test|refactor(mobile-meal-schedule-editing): … (R-ids)`

## Checklist C6 — Spec aprobada
- [x] requirements.md tiene `status: approved` y la casilla humana marcada (2026-10-02)
- [x] Enmienda E1 firmada (`d8edb20e`, casilla marcada). Su diff (`98cc1154`) solo añade §Enmienda E1 y no toca R1-R9

## Checklist C7 — Sin código huérfano
- [x] N/A: la feature no reemplaza nada existente

## Checklist C8 — UI móvil (carta `docs/ui-guidelines.md`)
- [x] Grep-clean: los tres grep de §Cierre salen vacíos. No hay hex nuevo, ni `StyleSheet.create`, ni clases arbitrarias, ni shadow/elevation
- [x] Dimensiones intactas: `contentContainerStyle` sigue con `padding: 24`, `gap: 16` y `paddingBottom: insets.bottom + 24`
- [x] Sin estado de carga nuevo: mientras `getPet` está pendiente se ocultan los controles, que es lo que pide R4
- [x] Reutiliza `Card` y heroui `Button` sin forks locales. El selector es `@expo/ui/community/datetime-picker` dentro de `Host`, como manda la carta
- [x] Touch target: la fila usa `min-h-11` (la sonda lo pone rojo), con `rounded-xl` y tokens `bg-accent-soft` / `text-accent-strong`. El feedback pressed lo da heroui `Button`
- [x] Sin animaciones nuevas

## Lista cerrada y dependencias
- [x] El diff H0..HEAD toca exactamente 18 rutas (13 de Codex y 5 del leader), las mismas de la lista cerrada de design.md con E1
- [x] No cambian ni `package.json` ni `bun.lock`

## Sondas de mutación

Corrí 79 sondas desde `mobile-pet-tracker/`:

- con `pgrep` vacío antes de cada tanda;
- con `bunx jest` sin pipe;
- restaurando cada una con `git checkout HEAD -- <ruta>`.

Al final `git diff --cached` queda vacío y `git status` solo muestra el
`progress/current.md` del leader. Los logs están en el scratchpad de la sesión
(`…/scratchpad/probes/<id>.log`).

- **R2/R3 (15 sondas), todas rojas:**
  - okStatus 200 y 201 cruzados;
  - 400, 401 y 403 remapeados;
  - un 422 desconocido pasado tal cual, y `LIMIT_REACHED` quitado;
  - URL, body y método cambiados, y `encodeURIComponent(from)` (la spec fija la URL sin codificar);
  - sin `missing-config`, y `unreachable` convertido en `error`.
- **R4 (11 sondas), todas rojas:**
  - `kind` negado, rojo en los dos `it` (pendiente y error);
  - solo pendiente, rojo en su `it`;
  - solo error, rojo en su `it`;
  - family, walker y vet, cada uno por separado y cada uno rojo en su fila;
  - Editar siempre visible y Añadir siempre visible, 5 rojos cada uno;
  - sin `min-h-11`;
  - parámetro y `accessibilityLabel` cambiados o quitados.
- **R5/R6 (9 sondas), todas rojas:**
  - `setUTCHours`, rojo en el it 1 de R5 y de R6 (E1.2 funciona);
  - `getUTCHours` y `getUTCMinutes`;
  - sin `padStart`;
  - valor por defecto `00:00`;
  - misma hora que llama a la API;
  - selector que no se cierra;
  - `onDismiss` vacío;
  - `presentation="inline"`.
- **R7, 10 sondas rojas:**
  - edición optimista con rollback;
  - sin refetch del plan, y sin refetch de la mascota;
  - refetch en `finally`;
  - `setEditing(false)` antes de los refetch;
  - refetch sin `await`;
  - quitar `isDisabled` en la fila, y en Añadir;
  - refetch en `MEAL_TIME_DUPLICATE`;
  - control: añadido optimista **sin** rollback, rojo en 5 filas `add` de R8 (demuestra que la mutación pinta la fila).
- **R7, 13 sondas verdes:** ver §Observaciones, 1.
- **R8 (14 sondas), todas rojas:**
  - las 6 claves de dominio cambiadas, cada una roja en su fila;
  - `unreachable`, `missing-config`, `error` y `catch` remapeados;
  - mensaje en el 401;
  - sin `setEditError(null)`;
  - sin `selectable`;
  - error oculto.
- **E1 (4 sondas), todas rojas:**
  - sin el `signOut()` del 401: rojos `#87 R19` y `#147 R8`;
  - un `signOut(` de más: rojo `#87 R19`;
  - un `bg-accent-soft` de más en el error, o uno de menos en Añadir: rojos `#98 R10` y `#64 R9`.
- **R1/R9 (3 sondas), todas rojas:**
  - el literal `es` de `errorMealLimit`: rojo `#147 R1`;
  - un uso extra de `common.somethingWentWrong`: rojos `#65 R6` y `#65 R18`;
  - un uso de `mealSchedule.addMeal` de menos: rojos `#65 R6`, `#65 R18` y `#147 R9`.

## Observaciones

### 1. Bloqueante: dos cláusulas de R7 sin candado

R7 dice «**WHILE** una llamada de R5 **o R6** está en curso…» y «**IF** la
llamada devuelve cualquier otro `kind`, **THEN THE SYSTEM SHALL NOT**
refetchear ninguna de las dos claves». Las 13 mutaciones siguientes van sobre
`src/screens/meal-schedule/index.tsx` en HEAD. Con cada una,
`bunx jest src/screens/meal-schedule` da **51/51 verde, exit 0**.

**a) El flujo Añadir (la llamada de R6). Los 4 `it` de R7 solo editan la fila 1 con `moveMealTime`:**

| Sonda (en la rama `from === null` de `onValueChange`) | Cláusula de R7 que viola |
|---|---|
| `setQueryData(nutritionKeys.plan(petId), …)` añade la fila nueva antes de `addMealTime`, con rollback al snapshot si el kind no es ok o si rechaza | «ni la fila nueva aparecen antes de que el refetch resuelva» |
| `setEditing(false)` justo después de `void runMealTimeEdit(...)`: los controles quedan habilitados mientras `addMealTime` vuela | «pintar **todos** los `meal-time-edit-*` y `add-meal-time-button` con `disabled === true`» |
| Llamar a `addMealTime` fuera de `runMealTimeEdit` y delegar en él solo los kinds no ok y el rechazo, sin refetch tras el ok | «WHEN ok: `await plan.refetch()`, `await refetchQueries(petKeys.detail)`, rehabilitar solo al terminar» |

Las filas `add` del `it.each` de R8 solo cazan la variante optimista
**sin** rollback (la del control de la tabla de sondas). Ningún test de R6 mira
el refetch ni el estado deshabilitado.

**b) «Ningún refetch si el kind no es ok».** Solo lo vigila el it 4 de R7, que usa `MEAL_TIME_DUPLICATE`. Plantar `await plan.refetch()` en cada una de las otras 9 ramas de `runMealTimeEdit` deja la suite verde:

- `invalid`
- `forbidden`
- `NUTRITION_PLAN_REQUIRED`
- `MEAL_TIME_NOT_IN_PLAN`
- `MEAL_TIMES_LIMIT_REACHED`
- `unauthorized`
- `unreachable`
- `error|missing-config`
- `catch`

Plantar `refetchQueries(petKeys.detail)` en `forbidden` también queda verde.
En `MEAL_TIME_DUPLICATE` la misma sonda sale roja. El `it.each` de R8 recorre
las 10 ramas de error y no comprueba las llamadas a `getNutritionPlan` ni a
`getPet`.

**Criterio de cierre:**

- las 13 sondas verdes tienen que ponerse rojas por matcher;
- las 66 rojas tienen que seguir rojas;
- como cualquier test nuevo mueve las cifras de `tasks.md` §Cifras (88/1759),
  el cambio pasa por enmienda firmada (E2) antes de volver a Codex.

### 2. No bloqueante: rojo de suite completa a mitad de branch, ya cerrado por E1

Desde `3c497607` (R4 feat) hasta `1526db05`/`e8789628`, `bun run test`
estaba rojo por los inventarios globales `#98 R10`, `#64 R9` y `#87 R19`.
Lo reconoce y lo cierra la enmienda E1 firmada. En HEAD los 108 tests de esos
dos ficheros pasan, exit 0. Solo lo dejo anotado para la historia del branch.

### 3. No bloqueante: `<Host matchContents>` es nuevo en el repo

Hasta ahora solo `add-reminder` usaba `Host`, y sin `matchContents`. La skill
`expo:expo-ui` lo respalda para tamaño intrínseco. Ningún test lo distingue:
el doble de `Host` ignora la prop. La única verificación es la prueba de humo
Android, que corre a cargo del humano y sigue pendiente.

### 4. No bloqueante: doble línea en blanco en `nutrition.ts`

Está antes de `export async function moveMealTime` en
`mobile-pet-tracker/src/api/nutrition.ts`. Es cosmético y el lint sale verde.

### 5. Fuera de mi alcance

La prueba de humo en dev build Android es del humano y no la marco.

## Output de ./init.sh
Lo corrió el leader. Leí `init-review.log`: `review-head.txt` = `d05d8725` y
`init-review.exit` = `exit=0`.
```
✅ Build exitoso
Test Suites: 174 passed, 174 total
Tests:       1335 passed, 1335 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
A worker process has failed to exit gracefully and has been force exited. …
Test Suites: 88 passed, 88 total
Tests:       1759 passed, 1759 total
✅ Tests pasados
Test Suites: 3 skipped, 28 passed, 28 of 31 total
Tests:       8 skipped, 423 passed, 431 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

## Ronda 2

Fecha: 2026-10-02T23:54Z
Veredicto: RECHAZADO

Revisado en HEAD `c918e756`, tras la Enmienda E2 (firma `f26f85fd`; E2-a
`e277b810`, E2-b `bf81642a`, trazabilidad `c918e756`). El leader corrió
`./init.sh` en ese HEAD (exit 0). Yo leí el log y no lo relancé.

**E2 cumple lo que prometía.** Las 13 sondas de la ronda 1 y el control caen
rojas por matcher. Ninguna de las 24 sondas rojas que volví a muestrear
(R7/R8) regresa.

**Motivo del rechazo:** queda una tercera cláusula de R7 sin candado. Dos
sondas nuevas dejan `src/screens/meal-schedule` en 54/54 verde, exit 0. La
cláusula es «rehabilitar los controles solo cuando hayan terminado **los
dos**», junto con el WHILE «desde `onValueChange` hasta que terminan los
refetch». Ningún test mantiene pendiente el refetch del detalle de la mascota
(`getPet`), así que nadie vigila esa ventana. Detalle en §R2-Observaciones 1.

El hueco existe desde `a6a85313` (el feat de R7). También estaba en
`d05d8725` y **no lo detecté en la ronda 1**: mis sondas «habilitar antes del
refetch» y «refetch sin `await`» tocaban los dos refetch a la vez o solo el
del plan. El fallo de cobertura de la ronda 1 es mío, no de Codex ni de E2.

### Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (#147)
- [x] progress/current.md lo lleva el leader (modificación sin commitear; no la toqué)

### Checklist C3 — Arquitectura
- [x] Sin cambios: `f26f85fd..HEAD` no toca producción (abajo)

### Checklist C4 — TDD
- [x] E2-a y E2-b son vía (b) y nacen verdes, como prescribe tasks.md §Enmienda E2:
  - con el `index.test.tsx` de `e277b810` sobre la producción de HEAD: 51/51, exit 0;
  - en HEAD: 54/54, exit 0.
- [x] Las ediciones son literales: comparé las líneas añadidas por cada commit con los bloques `ts` de tasks.md §Enmienda E2.
  - E2-a: las 2 líneas aparecen 2 veces, tras la espera de cierre del `it.each` de `#147 R8` y tras la de `401 cierra sesión sin mensaje`.
  - E2-b: las 54 líneas del bloque, idénticas, más 1 línea en blanco de separación, dentro del `describe` de `#147 R7` y después de `un resultado que no es ok no refetchea`.
- [x] Los mensajes de commit son los literales de tasks.md.
- [x] Las 13 sondas de la ronda 1 caen rojas por matcher (tabla abajo).
- [ ] **R7 sigue sin candado completo:** hay 2 sondas verdes (§R2-Observaciones 1).

### Checklist C5 — Trazabilidad
- [x] La fila R7 cita `e277b810` y `bf81642a`. Los tres nombres de `it` de E2-b existen tal cual en `index.test.tsx` (líneas 826, 843 y 862 en HEAD), y E2-a nombra las 10 filas de R8 y el 401.
- [x] Los 26 hashes citados en traceability.md son ancestros de HEAD (`git merge-base --is-ancestor`, 26 ok)
- [x] Ninguna fila «pendiente». La única aparición de la palabra es la regla de la línea 25.

### Checklist C6 — Spec aprobada
- [x] El diff de `f26f85fd` en requirements.md solo añade §Enmienda E2, y su casilla humana está marcada (2026-10-02)

### Checklist C7 — Sin código huérfano
- [x] N/A

### Checklist C8 — UI móvil
- [x] Sin cambios de UI: E2 solo toca tests

### Lista cerrada
- [x] `git diff --name-only b367ed44..HEAD` da 19 rutas:
  - 13 de Codex: los 10 ficheros de `mobile-pet-tracker/`, `specs/mobile-ui-language/design.md`, traceability.md e impl.
  - 6 del leader: current.md, handoff, review, y design.md, requirements.md y tasks.md de #147.
- [x] `git diff --name-only f26f85fd..HEAD` da solo `index.test.tsx`, el informe impl y traceability.md. No hay ningún cambio de producción.

### Sondas de la ronda 2

Las corrí en HEAD desde `mobile-pet-tracker/`:

- `pgrep` vacío antes de cada tanda;
- `bunx jest src/screens/meal-schedule` sin pipe;
- cada sonda restaurada con `git checkout HEAD -- src/screens/meal-schedule/index.tsx`.

Al terminar, `git diff --cached` está vacío y `git status` solo muestra el
`progress/current.md` del leader. Los logs están en el scratchpad de la sesión
(`…/scratchpad/probes2/<id>.log`).

Salen 48 sondas: 46 rojas y 2 verdes.

**Las 13 de la ronda 1 y el control: todas rojas por matcher.**

| Sonda | Rojo en | Primera línea roja |
|---|---|---|
| Añadido optimista con rollback | E2-b it 2 y it 3 | `expect(screen.queryByTestId('meal-time-row-2')).toBeNull()` |
| `setEditing(false)` tras lanzar el añadido | E2-b it 2 y it 3 | `waitFor` de `disabled: true` (`toEqual`) |
| `addMealTime` fuera de `runMealTimeEdit`, sin refetch tras el ok (mi variante mantiene `editing` durante el vuelo, por eso el it 2 sigue verde) | E2-b it 1 y it 3 | `queryByText('08:05')` `not.toBeNull()` |
| `await plan.refetch()` en `invalid` | fila `invalid` | `Expected number of calls: 1 / Received: 2` |
| … en `forbidden` | fila `forbidden` | igual |
| … en `NUTRITION_PLAN_REQUIRED` | su fila | igual |
| … en `MEAL_TIME_NOT_IN_PLAN` | su fila | igual |
| … en `MEAL_TIMES_LIMIT_REACHED` | su fila | igual |
| … en `unauthorized` | `401 cierra sesión sin mensaje` (línea 931, `mockGetNutritionPlan`) | igual |
| … en `unreachable` | su fila | igual |
| … en `error`/`missing-config` | filas `error` y `missing-config` | igual |
| … en el `catch` | fila `rechazo` | igual |
| `refetchQueries(petKeys.detail)` en `forbidden` | fila `forbidden` (línea 915, `mockGetPet`) | igual |
| Control: `await plan.refetch()` en `MEAL_TIME_DUPLICATE` | R7 it 4 y fila `MEAL_TIME_DUPLICATE` | igual |

**Variantes nuevas (11): 9 rojas y 2 verdes.**

| Sonda | Resultado |
|---|---|
| `void plan.refetch()` (sin `await`) en `invalid` | rojo, fila `invalid`, 2 frente a 1 |
| `void queryClient.invalidateQueries({ queryKey: nutritionKeys.plan(petId) })` en `MEAL_TIMES_LIMIT_REACHED` | rojo, su fila |
| `setTimeout(() => void plan.refetch(), 0)` en `forbidden` | rojo, su fila |
| Refetch del detalle de la mascota en el `catch` | rojo, fila `rechazo` |
| Refetch del detalle de la mascota en `unauthorized` | rojo, 401 |
| Refetch tras un no-ok solo en el flujo Añadir (envolviendo la petición) | rojo, 4 filas `add` |
| Refetch tras un no-ok solo en el flujo Editar | rojo, 5 filas `edit`, el 401 y el R7 it 4 |
| Añadir que tras el ok solo refetchea el plan | rojo, E2-b it 1 (`mockGetPet`: Expected 2, Received 1) |
| `void plan.refetch()` con `await` del detalle de la mascota | rojo, R7 it 3 y E2-b it 3 |
| **`setEditing(false)` entre `await plan.refetch()` y `await queryClient.refetchQueries(petKeys.detail)`** | **verde, 54/54, exit 0** |
| **`void queryClient.refetchQueries({ queryKey: petKeys.detail(petId) })` (sin `await`) en la rama `ok`** | **verde, 54/54, exit 0** |

**Sin regresión: las 24 sondas rojas de la ronda 1 sobre R7 y R8 siguen
todas rojas**, con la misma forma que en la ronda 1. Son 23 que volví a
ejecutar aquí más el control, que ya está en la tabla de arriba.

- R7, 9 sondas:
  - añadido optimista sin rollback: 7 rojos;
  - edición optimista con rollback: 1 rojo, R7 it 2;
  - sin refetch del plan: 4 rojos;
  - sin refetch de la mascota: 2 rojos;
  - refetch en `finally`: 14 rojos;
  - habilitar antes del refetch: 2 rojos;
  - refetch sin `await`: 2 rojos;
  - quitar `isDisabled` en la fila: 5 rojos;
  - quitar `isDisabled` en Añadir: 5 rojos.
- R8, 14 sondas:
  - las 6 claves de dominio cambiadas: un rojo en su fila cada una (la de `MEAL_TIME_DUPLICATE`, en 2 tests);
  - `unreachable`, `missing-config`, `error` y `catch` remapeados;
  - mensaje en el 401;
  - sin limpiar el error anterior;
  - sin `selectable`: 10 rojos;
  - error oculto: 11 rojos.

La edición optimista con rollback cae por consulta (`Unable to find an
element with text: 19:30`), y lo mismo hacía en la ronda 1 (log
`probes/R7-optimistic-move-rollback.log`). Es la aserción del it 2 de R7 sobre
la fila 1, sin cambios. El error oculto también cae por consulta
(`meal-time-error`), como en la ronda 1.

### R2-Observaciones

1. **Bloqueante: «rehabilitar solo cuando hayan terminado los dos» no tiene
   candado sobre el refetch del detalle de la mascota.**

   Con cualquiera de estas dos mutaciones en la rama `ok` de `runMealTimeEdit`
   (`src/screens/meal-schedule/index.tsx`), la suite de la pantalla queda en
   54/54 verde, exit 0:

   ```ts
   await plan.refetch();
   setEditing(false);                                                      // a) rehabilita antes del refetch de la mascota
   await queryClient.refetchQueries({ queryKey: petKeys.detail(petId) });
   ```

   ```ts
   await plan.refetch();
   void queryClient.refetchQueries({ queryKey: petKeys.detail(petId) });   // b) no espera al refetch de la mascota
   ```

   La causa es que los tres `it` que retienen algo después del ok (R7 it 3 y
   E2-b it 3) solo retienen la segunda llamada a `getNutritionPlan`. Ningún
   test hace `mockGetPet.mockReturnValueOnce(<promesa pendiente>)` para la
   segunda llamada, así que la ventana entre el fin del refetch del plan y el
   fin del refetch del detalle de la mascota no la mira nadie. Los dos
   `toHaveBeenCalledTimes(2)` sobre `mockGetPet` (R7 it 1 y E2-b it 1) solo
   prueban que el refetch se lanza, no que se espera.

   El origen también es la spec: tasks.md §R7 y §Enmienda E2 solo prescriben
   retener el refetch del plan. La producción cumple R7 hoy, porque espera
   los dos refetch antes del `finally`.

   **Criterio de cierre:**
   - las 2 sondas tienen que ponerse rojas por matcher;
   - las 46 sondas rojas de esta ronda tienen que seguir rojas.

   La forma natural es un `it` gemelo de R7 it 3 que retenga la segunda
   llamada a `getPet` en lugar de la de `getNutritionPlan`. Afirmaría
   `disabled: true` en los tres controles mientras está pendiente, y su
   rehabilitación al resolverla. Si se pone uno por flujo (Editar y Añadir),
   igual que hizo E2 con los tres primeros `it`, las cifras pasan de
   88/1762 a 88/1764. Con uno solo, a 88/1763.

   Como mueve §Cifras, el cambio pasa por enmienda firmada antes de volver a
   Codex. La decisión es del leader.

2. **No bloqueante:** se mantienen las observaciones 2 a 5 de la ronda 1:
   - el rojo de suite completa a mitad de branch, ya cerrado por E1;
   - `<Host matchContents>`, pendiente de la prueba de humo;
   - la doble línea en blanco en `nutrition.ts`;
   - la prueba de humo Android, que es del humano.

### Output de ./init.sh (ronda 2)
Lo corrió el leader entre las 23:39:12Z y las 23:43:28Z. Leí
`init-review2.log`: `review2-head.txt` = `c918e756` e
`init-review2.exit` = `exit=0`.
```
✅ Build exitoso
Test Suites: 174 passed, 174 total
Tests:       1335 passed, 1335 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
A worker process has failed to exit gracefully and has been force exited. …
Test Suites: 88 passed, 88 total
Tests:       1762 passed, 1762 total
✅ Tests pasados
Test Suites: 3 skipped, 28 passed, 28 of 31 total
Tests:       8 skipped, 423 passed, 431 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

### Pre-verificación del borrador E3

Fecha: 2026-10-03T00:05Z. HEAD `c918e756`. El borrador está en `specs/mobile-meal-schedule-editing/tasks.md` §Enmienda E3, sin commitear. Producción no se ha tocado. No se ha corrido `init.sh`, ni e2e, ni la suite entera. Antes de cada tanda, `pgrep -af 'init\.sh|test:e2e|jest-e2e'` salió vacío.

**Resultado: cierra.** Los dos `it` de E3-a compilan. Sin mutar pasan 56/56, y las dos sondas verdes de R2-Observaciones 1 salen rojas en los dos `it`, por matcher sobre `disabled: true`.

**Montaje.** Pegué los dos `it` del bloque `ts` de E3-a de forma temporal, literales, extraídos por script de tasks.md, en `src/screens/meal-schedule/index.test.tsx`. Van tras el `});` del último `it` de E2-b («tras ok de Añadir los controles siguen deshabilitados y sin fila nueva hasta que termina el refetch») y antes del cierre de `describe('#147 R7: …')`, que es lo que dice tasks.md. Quedaron en las líneas 881 y 905 del pegado. `PetState` ya está importado en la línea 22 (`import { getPet, type PetState } from '../../api/pets'`), así que el bloque no necesita imports nuevos.

**Línea base sin mutar**

| Comprobación | Resultado |
|---|---|
| `bunx jest src/screens/meal-schedule`, corrida 1 (sin pipe) | 56/56, exit 0 |
| `bunx jest src/screens/meal-schedule`, corrida 2 (sin pipe) | 56/56, exit 0 |
| `bunx jest src/screens/meal-schedule`, corrida 3 (sin pipe) | 56/56, exit 0 |
| `bunx tsc --noEmit`, tras `test ! -e .expo/types/router.d.ts` | exit 0 |
| `bunx eslint src/screens/meal-schedule/index.test.tsx` | exit 0 |

Los dos `it` nuevos salen ✓ en las tres corridas, con 94 ms y 117 ms en la primera.

**Sondas de R2-Observaciones 1.** Cada una se corrió dos veces y dio el mismo resultado las dos veces.

| Sonda (rama `ok` de `runMealTimeEdit`) | Suite | `it` E3-a 1 (Editar) | `it` E3-a 2 (Añadir) |
|---|---|---|---|
| 1: `setEditing(false)` entre `await plan.refetch()` y `await queryClient.refetchQueries(...)` | 2 failed / 56, exit 1 | ✗ | ✗ |
| 2: `void queryClient.refetchQueries(...)` (sin `await`) | 2 failed / 56, exit 1 | ✗ | ✗ |

La primera línea roja es la misma en las cuatro celdas. Falla el primer `waitFor` de cada `it` (`index.test.tsx:891:18` en el `it` 1 y `:915:18` en el `it` 2, numeración del pegado temporal), en la aserción `expect(screen.getByTestId(id).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }))`:

```
expect(received).toEqual(expected) // deep equality
- ObjectContaining {
-   "disabled": true,
+ Object {
+   "busy": undefined,
+   "checked": undefined,
+   "disabled": false,
```

Es un rojo por matcher, no por consulta. Ninguna celda dice «Unable to find». Con las dos sondas fallan solo los dos `it` de E3-a. Los otros 54 siguen verdes, igual que en la ronda 2, donde los 54 tests seguían en verde.

**Muestra de regresión en R7.** Las sondas se corrieron con los `it` pegados y se compararon con los logs de la ronda 2, que eran sobre 54 tests.

| Sonda | Ronda 2 (54) | Con E3 (56) | ¿Pierde algún `it` rojo? |
|---|---|---|---|
| `R7-enable-before-refetch` | 2 failed | 4 failed (+ los 2 de E3-a) | no |
| `R7-no-await-refetch` | 2 failed | 4 failed (+ los 2 de E3-a) | no |
| `R7-refetch-finally` | 14 failed | 14 failed, mismo conjunto | no |
| `R7-add-not-disabled` | 2 failed | 3 failed (+ E3-a `it` 2) | no |

En las cuatro, el conjunto de `it` rojos con E3 contiene al de la ronda 2. El diff de los nombres de los `●` no tiene ninguna línea `<`. Las primeras líneas rojas se mantienen: `toEqual … disabled` en tres sondas y `not.toBeNull()` / `Received: null` en `R7-refetch-finally`.

**Restauración.** `git checkout HEAD -- src/screens/meal-schedule/index.tsx src/screens/meal-schedule/index.test.tsx`. Después, `git diff --cached --stat` sale vacío y `git status --short` lista solo `progress/current.md`, `progress/review_mobile-meal-schedule-editing.md`, `specs/mobile-meal-schedule-editing/requirements.md` y `specs/mobile-meal-schedule-editing/tasks.md`.

**Ajustes.** El bloque no necesita ninguno. Una nota que no bloquea: los dos `it` fijan el orden plan → mascota, porque esperan el plan repintado con la mascota todavía retenida. Esto coincide con los pasos 1 y 2 del **WHEN** ok de R7, así que no constriñe más de lo que pide la spec.

## Ronda 3

Fecha: 2026-10-03T04:05Z
Veredicto: RECHAZADO

Revisado en HEAD `57757499`, tras la Enmienda E3 (firma `39174fe7`; E3-a
`e184ab68`, trazabilidad `0b0f856c`; `57757499` solo toca
`progress/current.md`). El leader corrió `./init.sh` en `0b0f856c` (exit 0).
Yo leí el log y no lo relancé.

**E3 cumple lo que prometía.** E3-a es literal respecto a tasks.md y su
mensaje de commit también. Las 2 sondas de §R2-Observaciones 1 caen rojas por
matcher, y solo en los dos `it` de E3-a. En la muestra de 18 sondas rojas de
la ronda 2 (R7 y R8) ninguna regresa.

**Motivo del rechazo:** al repasar cada «o», «cualquier», «todos» y «los dos»
de R7 y R8 aparecen dos cláusulas más sin candado. Cada una tiene una sonda
que deja `src/screens/meal-schedule` en 56/56 verde, exit 0:

- **R7:** la lista no cambia mientras el refetch del plan está retenido, pero
  solo se vigila en el flujo Añadir, no en Editar.
- **R8:** «una nueva llamada de R5 o R6 retira el error» solo se vigila con
  R5 (Editar), no con R6 (Añadir).

Detalle en §R3-Observaciones 1.

Producción cumple las dos cláusulas. Los huecos vienen de la prescripción de
tasks.md: §R7 `it('los controles siguen deshabilitados hasta que termina el
refetch')` y §R8 `it('una nueva edición retira el error anterior')`. No los
introdujo Codex, que siguió la prescripción al pie de la letra. Existen desde
la ronda 1 y **no los detecté ni en la ronda 1 ni en la 2**. Ese fallo de
cobertura es mío.

### Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: #147 en `feature_list.json`
- [x] progress/current.md lo lleva el leader (`57757499`); no lo toqué

### Checklist C3 — Arquitectura
- [x] Sin cambios: `39174fe7..HEAD` no toca producción (abajo)

### Checklist C4 — TDD
- [x] E3-a es vía (b) y nace verde, como prescribe tasks.md §Enmienda E3. La producción no cambia desde `39174fe7`, y en HEAD da 56/56, exit 0.
- [x] La edición es literal:
  - `git show e184ab68` tiene un solo hunk `@@ -879,0 +880,48 @@` y solo toca `index.test.tsx`;
  - son las 47 líneas del bloque `ts` de tasks.md §Enmienda E3-a, idénticas, más 1 línea en blanco delante, con 0 líneas borradas;
  - la doble línea en blanco antes del `describe` de R8 ya existía en `c918e756`.
- [x] El mensaje de commit es el literal de tasks.md (línea 917 de §Enmienda E3).
- [x] Las 2 sondas de §R2-Observaciones 1 caen rojas por matcher (tabla abajo).
- [ ] **R7 y R8 siguen sin candado completo:** quedan 2 sondas verdes (§R3-Observaciones 1).

### Checklist C5 — Trazabilidad
- [x] La fila R7 cita `e184ab68`, y los dos nombres de `it` de E3-a existen tal cual en `index.test.tsx` (líneas 881 y 905 en HEAD)
- [x] Los 28 hashes citados en traceability.md son ancestros de HEAD (`git merge-base --is-ancestor`, 28 ok)
- [x] Ninguna fila «pendiente». La única aparición de la palabra es la regla de la línea 25.

### Checklist C6 — Spec aprobada
- [x] La casilla humana de §Enmienda E3 está marcada en `39174fe7` (2026-10-03, «en el chat del leader»)
- [ ] La casilla del smoke sigue sin marcar. Es el gate humano de siempre y no bloquea este veredicto.

### Checklist C7 — Sin código huérfano
- [x] N/A

### Checklist C8 — UI móvil
- [x] Sin cambios de UI: E3 solo toca tests

### Lista cerrada
- [x] `git diff --name-only b367ed44..HEAD` da 19 rutas, el mismo conjunto que en la ronda 2:
  - 13 de Codex: los 10 ficheros de `mobile-pet-tracker/`, `specs/mobile-ui-language/design.md`, traceability.md e impl.
  - 6 del leader: current.md, handoff, review, y design.md, requirements.md y tasks.md de #147.
- [x] Son 34 commits: 28 de Codex y 6 del leader (`98cc1154`, `d8edb20e`, `f26f85fd`, `65b7434b`, `39174fe7`, `57757499`).
- [x] `git diff --name-only 39174fe7..HEAD` da solo `index.test.tsx`, current.md, el informe impl y traceability.md. No hay ningún cambio de producción.
- [x] El informe impl solo añade «## Reanudación 3» (hunk `@@ -6918,3 +6918,388 @@`).

### Sondas de la ronda 3

Las corrí en HEAD desde `mobile-pet-tracker/`, siempre con jest dirigido
(`bunx jest src/screens/meal-schedule`), sin pipe y con `pgrep` vacío antes de
cada tanda. Después de cada sonda restauré con `git checkout HEAD --` sobre el
fichero mutado. Al final, `git diff --cached --stat` sale vacío y
`git status --short` también.

**Línea base.** HEAD da 56/56, exit 0 (03:44:20–03:44:28Z).

**Sondas de E3 (§R2-Observaciones 1)**, entre las 03:44:30Z y las 03:44:59Z:

| Sonda | Resultado | `it` E3-a 1 (Editar) | `it` E3-a 2 (Añadir) |
|---|---|---|---|
| `N-enable-between-refetches` | 2 failed / 56, exit 1 | ✗ `:891:18` | ✗ `:915:18` |
| `N-no-await-pet-refetch` | 2 failed / 56, exit 1 | ✗ `:891:18` | ✗ `:915:18` |

Las cuatro celdas fallan en la misma aserción,
`toEqual(expect.objectContaining({ disabled: true }))`, con Received
`"disabled": false`. Son rojos por matcher y ninguno dice «Unable to find».
Los otros 54 `it` siguen verdes.

**Barrido de cláusulas de R7 y R8.** Son sondas nuevas en `index.tsx`:

| Sonda | Cláusula | Resultado | Primer rojo |
|---|---|---|---|
| `N3-move-patch-after-ok`: en Editar, tras el ok, `queryClient.setQueryData(nutritionKeys.plan(petId), …)` cambia la hora `from` por la nueva antes del refetch | R7 WHILE «ni la hora nueva … antes de que el refetch resuelva», flujo R5 | **56/56 verde, exit 0** | — |
| `N3-add-patch-after-ok`: el mismo parche en Añadir (control) | la misma cláusula, flujo R6 | 1 failed / 56 | E2-b `it` 3, `:875:53`, `queryByTestId('meal-time-row-2')).toBeNull()` |
| `N3-clear-error-edit-only`: quita `setEditError(null)` de `runMealTimeEdit` y lo pone solo antes de la llamada de Editar | R8 «nueva llamada de R5 o R6», rama R6 | **56/56 verde, exit 0** | — |
| `N3-clear-error-add-only`: lo mismo, pero solo antes de Añadir (control) | la misma cláusula, rama R5 | 1 failed / 56 | `una nueva edición retira el error anterior`, `:994:18`, `toBeNull()` |
| `N3-parallel-refetch`: `await Promise.all([plan.refetch(), refetchQueries(pet)])` | R7 orden de los pasos 1 y 2 | 56/56 verde | — (§R3-Observaciones 2) |
| `N3-reverse-order`: primero el refetch de la mascota y luego el del plan | R7 pasos 1 y 2, y «los dos» | 2 failed / 56 | los dos `it` de E3-a, `:897:18` y `:921:18`, `not.toBeNull()` |
| `N3-third-row-enabled`: `isDisabled={editing && index < 2}` | R7 «**todos** los `meal-time-edit-*`» | 1 failed / 56 | E3-a `it` 2, `:923:63` (`meal-time-edit-2`) |

Ninguno de los rojos de esta tabla dice «Unable to find».

**Corridas que coincidieron con el `./init.sh` de Backend en wt-146.** Ese
init.sh arrancó a las 03:46:52Z. La primera tanda de 5 sondas N3
(03:46:47–03:47:41Z) se solapó con él:

- `N3-move-patch-after-ok`: verde;
- `N3-add-patch-after-ok`: 1 rojo;
- `N3-clear-error-edit-only`: verde;
- `N3-clear-error-add-only`: 1 rojo;
- `N3-parallel-refetch`: verde.

Repetí las 7 sondas N3 con `pgrep` vacío y la CPU libre (03:54:46–03:55:50Z),
y dieron exactamente lo mismo. Las dos sondas verdes que sostienen el rechazo
las volví a correr sobre HEAD limpio a las 04:02:24–04:02:43Z. Las dos dieron
`Tests: 56 passed, 56 total`, exit 0. La línea base, las sondas de E3 y la
muestra de regresión corrieron fuera de esa ventana.

**Medida de los candados que faltan.** Los pegué en `index.test.tsx` solo para
medir y después restauré con `git checkout HEAD --`.

- **Hueco 1.** En R7 `it('los controles siguen deshabilitados hasta que
  termina el refetch')` añadí dos líneas tras la primera espera conjunta y
  antes de `resolve(...)`:
  ```ts
  expect(screen.queryByText('20:05')).toBeNull();
  expect(within(screen.getByTestId('meal-time-row-1')).getByText('19:30')).toBeVisible();
  ```
  - Línea base con el candado: 57/57, exit 0, medida dos veces.
  - Con `N3-move-patch-after-ok`, el `it` cae rojo en `:808:41`, `toBeNull()`, con Received `<Text …>20:05</Text>`. Es un rojo por matcher.
  - **El orden importa.** Con la línea `getByText('19:30')` primero, la misma sonda cae rojo por consulta (`:808:58`, «Unable to find»). La aserción de matcher tiene que ir delante.
- **Hueco 2.** Añadí un `it` espejo de `una nueva edición retira el error anterior`, llamado `una nueva llamada de Añadir retira el error anterior`:
  - edita la fila 1 con `moveMealTime → MEAL_TIME_DUPLICATE` y espera a ver el error;
  - añade con `addMealTime → pending()`;
  - espera conjunta: los tres controles deshabilitados **y** `queryByTestId('meal-time-error')` null;
  - resuelve con ok y termina con la espera de cierre.

  Línea base: 57/57. Con `N3-clear-error-edit-only` cae rojo en `:1017:18` por matcher: `toBeNull()` con Received el `Text` «Ya hay una comida a esa hora».

**Muestra de regresión sobre las rojas de la ronda 2.** Son 18 sondas, corridas
entre las 03:57:06Z y las 04:00:23Z con `pgrep` vacío:

- R7: `R7-optimistic-add-rollback`, `R7-optimistic-move-rollback`, `R7-add-no-refetch`, `R7-no-plan-refetch`, `R7-no-pet-refetch`, `R7-refetch-on-forbidden`, `R7-pet-refetch-on-forbidden`, `R7-refetch-on-401`, `R7-row-not-disabled` y `R7-add-btn-not-disabled`.
- N: `N-add-ok-plan-only`, `N-edit-nonok-refetch` y `N-no-await-plan-refetch`.
- R8: `R8-limit-key`, `R8-no-error-clear`, `R8-401-message`, `R8-error-after-add` y `R8-catch-key`.

Las 18 salen rojas, exit 1. Comparé los nombres de los `●` con el log de la
ronda 2 de cada sonda:

- ninguna pierde un `it` rojo (diff sin líneas `<`);
- 6 ganan los `it` de E3-a: `R7-add-no-refetch`, `R7-no-plan-refetch`, `R7-no-pet-refetch`, `R7-row-not-disabled`, `R7-add-btn-not-disabled` y `N-add-ok-plan-only`;
- el número de «Unable to find» es idéntico al de la ronda 2 en las 18. Es 1 en `R7-optimistic-move-rollback` y 11 en `R8-error-after-add`, igual que antes; E3 no añade ninguno.

### R3-Observaciones

#### 1. Bloqueante: dos cláusulas sin candado, una de R7 y otra de R8

**Hueco 1, R7 en el flujo Editar.** La cláusula es el WHILE de R7: «seguir
pintando las horas del plan que había en caché. Ni la hora nueva ni la fila
nueva aparecen antes de que el refetch resuelva». La ventana «hasta que
terminan los refetch» solo se vigila en Añadir (E2-b `it` 3). En Editar,
`it('los controles siguen deshabilitados hasta que termina el refetch')`
(línea 795 en HEAD) retiene la segunda llamada a `getNutritionPlan` y asevera
solo `disabled` y el número de llamadas. No mira la lista.

Sonda `N3-move-patch-after-ok`: tras el ok de `moveMealTime`, se parchea la
caché del plan con `setQueryData` cambiando `19:30` por `20:05` antes del
refetch. Es estado optimista colado después del ok. Resultado: 56/56 verde. El
test del rollback optimista de Editar no lo ve porque mira la ventana en vuelo,
antes del ok, no la del refetch.

Origen: tasks.md §R7 (líneas 435–440) prescribe ese `it` sin aserción sobre la
lista.

Candado medido: las dos líneas de arriba, con `queryByText('20:05')).toBeNull()`
**delante** y `within(meal-time-row-1).getByText('19:30')` detrás, insertadas
tras la primera espera conjunta. Base 57/57; sonda roja por matcher.

**Hueco 2, R8 con una nueva llamada de R6.** La cláusula es «**WHEN** empieza
una nueva llamada de R5 **o** R6 **THE SYSTEM SHALL** quitar el
`meal-time-error` anterior» (requirements.md línea 241). El único candado es
`it('una nueva edición retira el error anterior')` (línea 983 en HEAD), que
siempre provoca el error con Añadir y lo retira con una nueva llamada de
**Editar** (R5). Nadie comprueba que una nueva llamada de **Añadir** (R6) lo
retire.

Sonda `N3-clear-error-edit-only`: quita `setEditError(null)` de
`runMealTimeEdit` y lo pone solo antes de la llamada de Editar. Resultado:
56/56 verde. El control, que retira el error solo en Añadir, cae rojo en el
`it` existente, así que la rama R5 está vigilada y la R6 no.

Origen: tasks.md §R8 (líneas 513–518) prescribe solo la combinación «añade y
luego edita». Es el mismo patrón que en `clausulas-universales-candadas-en-un-caso`:
un «o» con un solo candado.

Candado medido: el `it` espejo descrito arriba, «edita con DUPLICATE y luego
añade con `pending()`». Base 57/57; sonda roja por matcher en `toBeNull()`.

Ninguno de los dos huecos pide cambiar producción: `index.tsx` ya cumple las
dos cláusulas. Basta con un candado por rama en `index.test.tsx` (vía b, nace
verde), como en E2 y E3.

#### 2. No bloqueante: el orden plan → mascota no está candado frente a ejecutarlos en paralelo

R7 numera los pasos 1 (`await plan.refetch()`) y 2 (`await
refetchQueries(pet)`). `N3-parallel-refetch` (`Promise.all` de los dos) queda
en 56/56 verde. El orden invertido sí cae rojo (`N3-reverse-order`, 2 rojos en
E3-a), y con `Promise.all` los dos refetch terminan antes de rehabilitar, así
que ninguna cláusula observable de R7 cambia: ni el bloqueo, ni la lista, ni
el número de llamadas. Si el leader quiere fijar la secuencia estricta, haría
falta un test que retenga el plan y asevere que `getPet` no se ha llamado
todavía. Lo anoto como límite y no lo exijo.

#### 3. No bloqueante: los mensajes de R8 y el 401 se candan por `kind` en un solo flujo

El `it.each` de R8 y `401 cierra sesión sin mensaje` recorren cada `kind` en un
solo flujo. Un remapeo por flujo en el callsite pasaría sin que nadie lo viera.
Hoy es improbable, porque el mapeo vive en `runMealTimeEdit`, que comparten los
dos flujos. Lo anoto como límite: si algún día el mapeo se separa por flujo,
hará falta candarlo por rama.

### Output de ./init.sh (ronda 3)
Lo corrió el leader entre las 03:38:11Z y las 03:42:48Z. Leí
`init-review3.log`: `review3-head.txt` = `0b0f856c` e
`init-review3.exit` = `exit=0`. `0b0f856c..HEAD` solo toca
`progress/current.md`.
```
✅ Build exitoso
Test Suites: 174 passed, 174 total
Tests:       1335 passed, 1335 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
A worker process has failed to exit gracefully and has been force exited. …
Test Suites: 88 passed, 88 total
Tests:       1764 passed, 1764 total
✅ Tests pasados
Test Suites: 3 skipped, 28 passed, 28 of 31 total
Tests:       8 skipped, 423 passed, 431 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

### Pre-verificación del borrador E4 y barrido de cláusulas

Fecha: 2026-10-03, entre las 04:07Z y las 04:22Z. HEAD `57757499`. El borrador E4
está sin commitear en requirements.md (§Enmienda E4) y tasks.md (§Enmienda E4).
No toqué specs/ ni commiteé nada.

Todo lo corrí desde `mobile-pet-tracker/` con jest dirigido, sin pipe y sin
init.sh. Antes de cada tanda comprobé que `pgrep -af 'init\.sh|test:e2e|jest-e2e'`
salía vacío; lo estuvo siempre (la última vez, a las 04:21:25Z). Las mutaciones
fueron temporales. Al final restauré los cuatro ficheros con
`git checkout HEAD --`:

- `index.test.tsx` y `index.tsx`;
- `nutrition.test.ts` y `nutrition.ts`.

`git diff --cached --stat` sale vacío. `git status --short` solo muestra este
informe y los dos ficheros del borrador del leader.

**Resultado: E4 reproduce tal como está redactada, pero es insuficiente.** El
barrido encuentra 3 huecos más, todos de la misma familia: cláusulas con varios
miembros candadas en uno solo. Producción cumple las tres; ninguna pide cambiar
código. Las tres tienen candado medido (vía b, nace verde y su sonda cae roja
por matcher).

#### 1. E4 tal como está redactada

Pegué los bloques literales de tasks.md §E4-a y §E4-b en `index.test.tsx` con
las anclas que da el texto. Resultados:

| Medida | Resultado | Hora |
|---|---|---|
| Base con E4-a | 56/56, exit 0 | 04:07:54Z |
| Base con E4-a + E4-b | 57/57, exit 0 | 04:08:04Z |
| Sonda 1 (envoltura `.then` en el callsite de Editar) | 1 failed / 57, exit 1. Solo cae «los controles siguen deshabilitados hasta que termina el refetch», en `:808:41`, `expect(received).toBeNull()` (Received `<Text …>20:05</Text>`). Cae por matcher. | 04:08:25Z |
| Sonda 2 (`setEditError(null)` solo antes de Editar) | 1 failed / 57, exit 1. Solo cae «una nueva llamada de Añadir retira el error anterior», en `:1017:18`, `toBeNull` (Received el `Text` `meal-time-error` con «Ya hay una comida a esa hora»). Cae por matcher. | 04:08:35Z |

No encontré ningún paso ni sonda ambiguos. Las anclas de E4-a, el `});` del
primer `waitFor` y la línea `await act(async () => resolve({ kind: 'ok', plan: makePlan({ mealTimes: ['07:30', '20:05'] }) }));`
son únicas dentro de su `it`.

Hay una sola nota cosmética. tasks.md §E4-b no dice que haya que dejar una línea
en blanco antes del `it` nuevo. Yo la puse, igual que en E3-a. Si se omite, el
resultado no cambia.

#### 2. Regla del barrido

Es la misma regla que apliqué en las rondas 2 y 3. La dejo escrita para que no
cambie en la ronda 4.

1. **Miembros enumerados.** Cada miembro enumerado necesita al menos un `it` que
   lo ejercite y lo asevere, dentro de cada frase EARS que lo cuantifique. Un
   miembro cuenta como enumerado en cualquiera de estos casos:
   - aparece en un «o», en una lista o en una tabla;
   - se hereda por referencia: «la llamada» es la llamada «de R5 o R6», y «la
     misma tabla de R2» trae todas las filas de R2.
2. **Dos dimensiones en una frase.** Si una misma frase enumera dos dimensiones
   (por ejemplo flujo × resultado), basta con un candado por miembro de cada
   dimensión. No exijo el producto cartesiano.
3. **Cuantificador abierto.** Son frases como «cualquier otro status», «`kind`
   distinto de `ok`» o «fila `i`».
   - Si la salida es la misma para todo el conjunto, basta un representante.
   - Si la salida depende del miembro (la hora de la fila `i`), hacen falta dos
     muestras que distingan la función de una constante. Es la lección de
     `candados-tautologicos`.
4. **WHILE con ventana.** Cada propiedad se vigila, por miembro, en el último
   tramo de la ventana que tiene estado propio en producción. Los tramos son:
   en vuelo, refetch del plan y refetch de la mascota. Así se cerró el hueco 1
   de la ronda 3.
5. **SHALL sobre documentos.** Los que hablan de design.md los verifico
   leyendo; no exijo sonda.

**Hueco bloqueante** = un miembro sin `it`, más una sonda de un solo sitio que lo
viola y deja verde el jest dirigido.

#### 3. Tabla cláusula × rama × candado × sonda

Los nombres son los de los `it` de HEAD + E4. «—» significa que hace falta sonda
porque nadie lo canda.

| Cláusula | Rama / miembro | Candado (`it`) | Sonda | Estado |
|---|---|---|---|---|
| R1: 9 claves con su valor | es y en, ×9 | `#147 R1` «registra las nueve claves en los dos idiomas y en la tabla de la spec de idioma» | — | candado |
| R1: total base + 9 | en = 329; es con las mismas claves | `#65 R12` «mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas» | — | candado |
| R1: mismos `{{…}}` | cada clave | el mismo `it` (bucle `markerNames`) | — | candado |
| R1: design.md lista cada clave con su marca | ×9 | `#147 R1` (regex por clave) | — | candado |
| R1: design.md «con sus dos literales» | ×18 | la regex usa `[^\n]*` y no mira los literales | no medida (no toco specs/) | **no bloqueante** (regla 5). Leí las líneas 829–837: los 18 literales coinciden con el catálogo. Es el mismo candado que tienen #41, #70, #78 y #100. |
| R2: un fetch, POST, URL sin barra final, cabeceras, body | — | «publica POST /meal-times con el token y el body exacto, y 201 es ok». El `baseUrl` del test termina en `/`, así que la URL exacta canda el recorte. | — | candado |
| R2: tabla | 201, 400, 403, 422 ×4 códigos, 422 otro código, 422 no JSON, 401, otro status (200/404/500) | `it.each` «mapea $label a $kind» | — | candado |
| R2: fetch rechaza / sin baseUrl | unreachable con mensaje / missing-config sin fetch | «devuelve unreachable…» / «devuelve missing-config…» | — | candado |
| R3: un fetch, PATCH, URL con `from`, cabeceras, body | — | «publica PATCH /meal-times/:from…» | — | candado |
| R3: solo 200 es ok; 201 da error | — | el mismo `it` / «trata un 201 como error» | — | candado |
| R3: «la misma tabla de R2» | 400, 403, 422 NOT_IN_PLAN, 422 DUPLICATE, 401, otro status (500), rechazo, missing-config | «comparte el mapeo de errores de addMealTime» | — | candado |
| R3: «la misma tabla de R2» | **422 NUTRITION_PLAN_REQUIRED** | — | `S-r3-npr`: 58/58 verde | **HUECO H1** |
| R3: «la misma tabla de R2» | **422 MEAL_TIMES_LIMIT_REACHED** | — | `S-r3-limit`: 58/58 verde | **HUECO H1** |
| R3: «la misma tabla de R2» | **422 con otro código** | — | `S-r3-other`: 58/58 verde | **HUECO H1** |
| R3: «la misma tabla de R2» | **422 con body no JSON** | — | `S-r3-nojson`: 58/58 verde | **HUECO H1** |
| R4: el owner ve el botón como 4.º hijo, con testID, «Editar» y su `accessibilityLabel` | filas 0 y 1 (la etiqueta depende de la fila: dos muestras) | «el owner ve Editar en cada fila y Añadir comida bajo la lista» | — | candado |
| R4: el owner ve «Añadir comida» como último hijo, y la sección lleva su testID | — | el mismo `it` | — | candado |
| R4 IF: family / walker / vet | ×3 | `it.each` «%s no ve controles de edición» | — | candado |
| R4 IF: `kind` distinto de `ok` | representante `error` | «con el detalle de la mascota en error no hay controles» | — | **no bloqueante** (regla 3: la salida es la misma para cualquier `kind`, y producción hace una sola comparación `=== 'ok'`) |
| R4 IF: sin resolver | pending | «sin el detalle de la mascota resuelto no hay controles» | — | candado |
| R4 IF: cada fila conserva 3 hijos y la sección solo tiene título + filas | en los 3 casos IF | los tres `it` de arriba | — | candado |
| R5: un único picker en `Host`, con testID, mode y presentation | — | «abre un único selector de hora con la hora local de la fila» | — | candado |
| R5: `value` = hora local de la **fila i**; `moveMealTime(…, horaDeLaFila, …)` | **solo i = 1, que es la última fila** | ningún `it` pulsa otra fila | `S-row-last` (`from` = última franja): 57/57 verde | **HUECO H2** |
| R5: onValueChange desmonta y llama una vez con HH:MM local | — | «al elegir una hora nueva llama a moveMealTime con la hora local y cierra el selector» | — | candado |
| R5 IF: misma hora **o** onDismiss; ni move ni add | las 2 ramas × las 2 funciones | «elegir la misma hora de la fila no llama a nada» / «al cerrar el selector sin elegir no llama a nada» | — | candado |
| R6: 12:00 local, mode, presentation | — | «abre el selector a las 12:00 locales» | — | candado |
| R6: onValueChange desmonta y llama a add una vez | — | «al elegir una hora llama a addMealTime con la hora local rellenada a dos dígitos» | — | candado |
| R6 IF: onDismiss, ninguna de las dos | ×2 funciones | «al cerrar el selector sin elegir no llama a nada» (R6) | — | candado |
| R7 WHILE: **todos** deshabilitados | Editar × {en vuelo, refetch del plan, refetch de la mascota} | «mientras la edición vuela…» / «los controles siguen deshabilitados hasta que termina el refetch» / «…hasta que termina también el refetch de la mascota» | — | candado |
| R7 WHILE: **todos** deshabilitados | Añadir × los 3 tramos | «mientras Añadir vuela…» / «tras ok de Añadir los controles siguen deshabilitados y sin fila nueva…» / «tras ok de Añadir … refetch de la mascota» (incluye `edit-2`) | — | candado |
| R7 WHILE: **ni** la hora nueva | último tramo (refetch del plan) | E4-a en «los controles siguen deshabilitados hasta que termina el refetch»; en vuelo, «mientras la edición vuela…» y «mientras Añadir vuela…» (`08:05`) | E4-1 roja | candado |
| R7 WHILE: **ni** la fila nueva | último tramo | «tras ok de Añadir … sin fila nueva…» (`row-2`); en vuelo, «mientras Añadir vuela…» | — | candado |
| R7 WHILE: hora nueva en Añadir, tramo del refetch del plan | producto del miembro × flujo | sin `queryByText('08:05')` en ese `it` | `S-add-hour-plan-hold` (reescribe la franja 0 con `08:05` tras el ok): 57/57 verde | **no bloqueante** (reglas 2 y 4: el miembro ya está candado en su último tramo con Editar; el mutante no añade fila, reescribe una existente) |
| R7 WHEN ok: paso 1 `plan.refetch` | Editar / Añadir | «tras ok refetchea el plan…» / «tras ok de Añadir refetchea…» | — | candado |
| R7 WHEN ok: paso 2 refetch de la mascota | Editar / Añadir | los mismos dos `it` (`getPet` ×2) | — | candado |
| R7 WHEN ok: paso 3, rehabilitar solo tras los dos | Editar / Añadir | E3 ×2 (mascota retenida) + los dos `it` con el plan retenido | — | candado |
| R7 WHEN ok: orden 1 → 2 (obs. 2 de la ronda 3) | secuencia frente a paralelo | ninguno lo distingue. El orden invertido sí cae (N3-reverse-order, ronda 3). | `S-parallel` (`Promise.all`): 57/57 verde | **no bloqueante** (ver §5) |
| R7 IF: cualquier otro `kind`, sin refetch de ninguna clave | invalid, forbidden, 4 códigos 422, unreachable, error, missing-config, rechazo | `it.each` de R8 (aserciones E2.2) | — | candado |
| R7 IF: cualquier otro `kind` | unauthorized | «401 cierra sesión sin mensaje» | — | candado |
| R7 IF: cualquier otro `kind` | flujos Editar y Añadir | los dos aparecen en el `it.each` | — | candado |
| R8 WHEN error: 10 filas con literal, `selectable`, `className`, penúltimo hijo y único | ×10 | `it.each` «$label muestra «$literal»» | — | candado |
| R8 WHEN error: flujos | Editar (5 filas) / Añadir (5 filas) | el mismo `it.each` | — | candado |
| R8 WHEN error: `kind` × flujo (obs. 3 de la ronda 3, mensajes) | producto cartesiano | — | no medida | **no bloqueante** (regla 2, ver §5) |
| R8 IF 401: `signOut()` sin error | Editar | «401 cierra sesión sin mensaje» | — | candado |
| R8 IF 401: `signOut()` sin error | **Añadir** | — | `S-401-add` (el callsite de Añadir convierte `unauthorized` en `error`): 57/57 verde | **HUECO H3** |
| R8 WHEN nueva llamada: retira el error | R5 / R6 | «una nueva edición retira el error anterior» / E4-b «una nueva llamada de Añadir retira el error anterior» | N3 (ronda 3) / E4-2 rojas | candado |
| R9: 9 claves en `R6_FOOD` | ×9 | `#147 R9` «nombra las nueve ocurrencias nuevas y las resuelve en su fichero» | — | candado |
| R9: +1 `common.cannotReachServer`, +2 `common.somethingWentWrong`; 38 → 50 | — | `#65 R6` «resuelve las 50 ocurrencias normativas» (longitud 50 + `checkUses`, recuento exacto por fichero × clave) | — | candado |
| E1: `bg-accent-soft` / `signOut(` | — | «conserva los usos de bg-accent-soft que sí son acento» / «preserves every mutation sign-out with zero delta» | — | candado |
| E2, E3, E4 | — | ya están en las filas de R7 y R8 | — | candado |

Logs de las sondas en el scratchpad (`e4/S-*.log`), entre las 04:19:58Z y las
04:21:00Z. Las dos bases salen verdes en esa misma tanda: `src/screens/meal-schedule`
da 57/57 y `nutrition.test.ts` da 58/58, las dos con exit 0.

#### 4. Los 3 huecos, con su candado medido

Los tres son de vía (b): nacen verdes porque producción ya cumple. Los inserté
en una copia de trabajo de HEAD + E4. La base y las sondas corrieron entre las
04:21:25Z y las 04:22:06Z, con `pgrep` vacío:

- base: `src/screens/meal-schedule` da **59/59** y `nutrition.test.ts` da
  **62/62**, las dos con exit 0;
- cada sonda de la tabla cae roja en su `it` nuevo y solo en él, siempre por
  matcher (0 «Unable to find»).

**H1. R3, «la misma tabla de R2», 4 filas sin candado.** `addMealTime` y
`moveMealTime` comparten `editMealTimeState(response, okStatus)`. Aun así, R3
cuantifica sobre la tabla de R2 en su propia frase, y el `it` «comparte el mapeo
de errores de addMealTime» se salta 4 filas. Hay dos tipos de sonda que las dejan
pasar:

- una envoltura sobre el retorno de `moveMealTime` (`S-r3-npr`, `S-r3-limit`);
- una rama condicionada a `okStatus === 200` en el bloque 422 de
  `editMealTimeState` (`S-r3-other`, `S-r3-nojson`).

Las cuatro dan 58/58 verde. El candado medido va dentro de `describe('#147 R3…')`
de `src/api/__tests__/nutrition.test.ts`, detrás del `it` «comparte el mapeo de
errores de addMealTime», con una línea en blanco delante:

```ts
  it.each([
    { label: '422 NUTRITION_PLAN_REQUIRED', backend: response(422, { code: 'NUTRITION_PLAN_REQUIRED' }), expected: { kind: 'unprocessable', code: 'NUTRITION_PLAN_REQUIRED' } },
    { label: '422 MEAL_TIMES_LIMIT_REACHED', backend: response(422, { code: 'MEAL_TIMES_LIMIT_REACHED' }), expected: { kind: 'unprocessable', code: 'MEAL_TIMES_LIMIT_REACHED' } },
    { label: '422 SOMETHING_ELSE', backend: response(422, { code: 'SOMETHING_ELSE' }), expected: { kind: 'error' } },
    { label: '422 JSON inválido', backend: invalidJsonResponse(422), expected: { kind: 'error' } },
  ])('PATCH mapea $label como la tabla de R2', async ({ backend, expected }) => {
    const fetchFn = jest.fn().mockResolvedValue(backend) as unknown as typeof fetch;
    await expect(moveMealTime(baseUrl, 'jwt-token', 'pet-1', '19:30', '20:05', fetchFn)).resolves.toEqual(expected);
  });
```

Cada una de las 4 sondas cae en su fila y solo en ella, en `:497:99`, con
`expect(received).resolves.toEqual(expected)`. Son +4 tests.

**H2. R5, «la hora de la fila i», solo se prueba con la última fila.** Los cuatro
`it` de R5, el `it.each` de R8 y todos los de R7 pulsan `meal-time-edit-1`. Con
dos franjas, esa es la última. Por la regla 3, la salida depende de `i`, y una
sola muestra no distingue la función de una constante.

`S-row-last` cambia `onPress={() => setPicker({ from: mealTime })}` por la última
franja del plan. Da 57/57 verde. El candado medido va dentro de
`describe('#147 R5…')`, detrás del `it` «elegir la misma hora de la fila no llama
a nada», con una línea en blanco delante:

```ts
  it('Editar en la primera fila abre el selector con su hora y la publica como origen', async () => {
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('meal-time-edit-0'));
    const picker = screen.getByTestId('meal-time-picker');
    expect([picker.props.value.getHours(), picker.props.value.getMinutes()]).toEqual([7, 30]);
    await fireEvent(picker, 'onValueChange', {}, new Date(2026, 9, 2, 8, 5));
    await waitFor(() => expect(mockMoveMealTime).toHaveBeenCalledWith('http://example.test/v1', 'jwt-token', 'pet-1', '07:30', '08:05'));
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });
```

La sonda cae en `:698:78`, `expect(received).toEqual(expected)`, porque recibe
`[19, 30]`. Es +1 test.

**H3. R8, «IF la llamada devuelve unauthorized», solo se prueba en Editar.** «La
llamada» es la de la frase anterior, «la llamada de R5 o R6». Es el mismo caso
que el hueco 2 de la ronda 3, que E4-b cierra para la frase de retirar el error.

`S-401-add` envuelve el callsite de Añadir para convertir `unauthorized` en
`{ kind: 'error' }`. Da 57/57 verde. El candado medido va dentro de
`describe('#147 R8…')`, detrás de E4-b, con una línea en blanco delante:

```ts
  it('401 en Añadir cierra sesión sin mensaje', async () => {
    const signOut = jest.fn();
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut });
    mockAddMealTime.mockResolvedValue({ kind: 'unauthorized' });
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('add-meal-time-button'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 8, 5));
    await waitFor(() => {
      expect(signOut).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true }));
    });
    expect(screen.queryByTestId('meal-time-error')).toBeNull();
    expect(mockGetNutritionPlan).toHaveBeenCalledTimes(1);
    expect(mockGetPet).toHaveBeenCalledTimes(1);
  });
```

La sonda cae en el `waitFor` de `:1044:18`, en la aserción de la línea 1045, `expect(jest.fn()).toHaveBeenCalledTimes(expected)`,
con 0 llamadas recibidas. Es +1 test.

Este candado no cambia el recuento `signOut(` de `design-drift`
(«preserves every mutation sign-out with zero delta»), porque solo cuenta
producción.

**Cifras si entran los tres.** El total pasa de los 1765 de E4 §Cierre a **88
suites / 1771 tests**: +6 tests y +0 suites. La lista cerrada sigue en 13
ficheros, porque `nutrition.test.ts` ya está en ella.

Las copias de trabajo con los tres candados quedaron en el scratchpad:
`e4/cand/index.test.candidate.tsx` y `e4/cand/nutrition.test.candidate.ts`. No
están en el árbol.

#### 5. Observaciones 2 y 3 de la ronda 3, clasificadas por la letra

**Obs. 2, orden plan → mascota: no bloqueante.**

- R7 numera los pasos 1, 2 y 3, pero en este requirements.md la numeración no
  implica secuencia: R4 usa «1.» y «2.» para dos cosas que se pintan a la vez.
- La única restricción temporal que la frase escribe es el paso 3, «rehabilitar
  los controles solo cuando hayan terminado los dos», y está candada en los dos
  flujos.
- La forma `await …; await …;` está en design.md (línea 141) como guía de
  implementación, no en una cláusula EARS.

`S-parallel` (`Promise.all`) da 57/57 verde y no viola ninguna cláusula
escrita. En la ronda 4 no la bloquearé. Si el leader quiere la secuencia
estricta, primero tiene que escribirla en requirements.md.

**Obs. 3, mensajes por `kind` en un solo flujo: no bloqueante, salvo la parte del 401.**

- Los mensajes no bloquean. La frase WHEN de R8 enumera flujo × resultado. Cada
  una de las 10 filas tiene su candado, y cada flujo tiene 5 (regla 2). En la
  ronda 4 no exigiré el producto cartesiano.
- La parte del 401 sí bloquea. «IF la llamada devuelve unauthorized» es una
  frase aparte, con una sola dimensión enumerada (R5 o R6), y solo tiene
  candado en R5. Es **H3**. En la ronda 3 la clasifiqué como no bloqueante con
  el argumento de que `runMealTimeEdit` es compartida. Ese mismo argumento no
  salvó el hueco 2 de la ronda 3, que también vive en `runMealTimeEdit`. Lo
  corrijo aquí para que la regla sea una sola.

#### 6. Qué bloquearía en la ronda 4

Con E4 tal como está y nada más, la ronda 4 sale **RECHAZADO** por H1, H2 y H3.
Con E4 más los tres candados de §4, el barrido de R1–R9 y E1–E4 no deja ninguna
otra rama sin candado según la regla de §2. Los cuatro «no bloqueante» de la
tabla quedan clasificados aquí y no los convertiré en bloqueantes en la ronda 4:

- R1, los literales en design.md;
- R4, los `kind` distintos de `ok`;
- R7, la hora nueva en Añadir durante el refetch del plan;
- R7, el orden de los refetch.

## Ronda 4

Fecha: 2026-10-03T05:07Z
Veredicto: APROBADO

Revisado en HEAD `fe2505b3`, tras la Enmienda E4 (firma `f64a3c60`). Los
commits son E4-a `a9406528`, E4-b `12730ded`, E4-c `f170159f`, E4-d `81e26781`,
E4-e `0e56c182` y la trazabilidad `2f00b54e`. `4f988319` y `fe2505b3` son del
leader y solo tocan `progress/current.md`. El leader corrió `./init.sh` en
`4f988319` con exit 0. Yo leí el log y no lo relancé.

**E4 cierra los 5 huecos y no abre ninguno.** Los cinco commits son literales
respecto a tasks.md §Enmienda E4. Las 8 sondas de §Sondas de E4 caen rojas por
matcher, cada una solo en su `it`. Las 2 sondas que dejaron verde la ronda 3
ahora caen rojas en el `it` nuevo.

Repetí 37 sondas rojas de las rondas 1–3 y ninguna regresa:

- ninguna pierde un rojo;
- el número de «Unable to find» solo cambia donde la mutación borra el nodo.

Con la regla de barrido de §Pre-verificación §2 sin cambios, la tabla de
cláusulas queda sin ningún hueco bloqueante. Los cuatro «no bloqueante»
comprometidos allí siguen así y no bloquean.

### Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: #147 en `feature_list.json`
- [x] progress/current.md lo lleva el leader (`4f988319`, `fe2505b3`); no lo toqué

### Checklist C3 — Arquitectura
- [x] Sin cambios: `f64a3c60..HEAD` no toca producción (abajo)

### Checklist C4 — TDD
- [x] Los 5 commits de E4 son vía (b) y nacen verdes, como prescribe tasks.md §Enmienda E4. Producción no cambia desde `f64a3c60`. En HEAD, la pantalla da 59/59 y la API 62/62, las dos con exit 0.
- [x] Cada commit toca un solo fichero de test, con un solo hunk y 0 líneas borradas. Las líneas añadidas son idénticas al bloque `ts` de su paso en tasks.md; en b–e, más 1 línea en blanco delante:

  | Commit | Fichero | Hunk |
  |---|---|---|
  | E4-a `a9406528` | `index.test.tsx` | `@@ -805,6 +805,8 @@` (2 líneas) |
  | E4-b `12730ded` | `index.test.tsx` | `@@ -1002,4 +1002,25 @@` (21 líneas) |
  | E4-c `f170159f` | `nutrition.test.ts` | `@@ -486,4 +486,14 @@` (10 líneas) |
  | E4-d `81e26781` | `index.test.tsx` | `@@ -690,6 +690,16 @@` (10 líneas) |
  | E4-e `0e56c182` | `index.test.tsx` | `@@ -1033,4 +1033,20 @@` (16 líneas) |

- [x] Los cinco mensajes de commit son los literales de tasks.md §Enmienda E4, y van en el orden prescrito: a, b, c, d, e.
- [x] Cada `it` nuevo vive en el `describe('#147 R<n>…')` de su requisito:
  - E4-a en R7;
  - E4-b y E4-e en R8;
  - E4-c en R3;
  - E4-d en R5.
- [x] Las 8 sondas de §Sondas de E4 caen rojas por matcher, cada una solo en su `it` (tabla abajo).

### Checklist C5 — Trazabilidad
- [x] traceability.md cita los cinco commits de E4 junto a las citas anteriores, sin reescribir ninguna:
  - R3 `f170159f`;
  - R5 `81e26781`;
  - R7 `a9406528`;
  - R8 `12730ded` y `0e56c182`.

  Añade también la sección «## Verificación de la Enmienda E4».
- [x] Los 34 hashes citados son ancestros de HEAD (`git merge-base --is-ancestor`, 34 ok).
- [x] Ninguna fila «pendiente». La palabra solo aparece en dos sitios:
  - la regla de la línea 25;
  - la prosa «llamada pendiente de Añadir» de la fila R8 (línea 18), que describe el caso y no es un estado.

### Checklist C6 — Spec aprobada
- [x] La casilla humana de §Enmienda E4 está marcada en `f64a3c60` (2026-10-03, «en el chat del leader»)
- [ ] La casilla del smoke sigue sin marcar. Es el gate humano de siempre y no bloquea este veredicto.

### Checklist C7 — Sin código huérfano
- [x] N/A

### Checklist C8 — UI móvil
- [x] Sin cambios de UI: E4 solo toca tests

### Lista cerrada
- [x] `git diff --name-only b367ed44..HEAD` da 19 rutas, el mismo conjunto que en las rondas 2 y 3.
- [x] Son 44 commits: 34 de Codex y 10 del leader:
  - `98cc1154`, `d8edb20e`, `f26f85fd`, `65b7434b`, `39174fe7`;
  - `57757499`, `bec2d141`, `f64a3c60`, `4f988319`, `fe2505b3`.
- [x] `git diff --name-only f64a3c60..HEAD` da solo 5 ficheros, y ninguno es de producción:
  - `index.test.tsx` y `nutrition.test.ts`;
  - current.md, el informe impl y traceability.md.
- [x] El informe impl solo añade «## Reanudacion 4» (hunk `@@ -7303,3 +7303,836 @@`). Lo que declara coincide con lo que medí:
  - bases 56/58 antes y 59/62 después;
  - las 8 sondas con exit 1;
  - el cierre en 88/1771, con lint y typecheck en exit 0.

### Sondas de la ronda 4

Las corrí en HEAD desde `mobile-pet-tracker/` con jest dirigido, sin pipe y
sin init.sh. Antes de cada tanda comprobé que `pgrep -af 'init\.sh|test:e2e|jest-e2e'`
salía vacío, y lo estuvo siempre: antes de las bases y las 8 sondas de E4
(04:56:55Z) y antes de cada tanda de regresión (04:58:34Z y 05:03:58Z).

Las mutaciones fueron temporales. Tras cada sonda restauré con
`git checkout HEAD --`. `git diff --cached --stat` sale vacío. Al acabar,
`git status --short` solo muestra este informe.

**Base (04:56:55Z–04:57:06Z):** `src/screens/meal-schedule` da **59/59** y
`src/api/__tests__/nutrition.test.ts` da **62/62**, las dos con exit 0.

**Las 8 sondas de tasks.md §Sondas de E4 (04:57:09Z–04:57:53Z).** Todas
salen con exit 1 y 1 failed: 58/59 en la pantalla y 61/62 en la API. Cada una
cae solo en su `it`, y ninguna con «Unable to find».

| Sonda | `it` rojo | Sitio | Matcher / recibido |
|---|---|---|---|
| 1 (H-r3-1, R7 Editar) | «los controles siguen deshabilitados hasta que termina el refetch» | `:818:41` | `toBeNull`, recibe `<Text …>20:05</Text>` |
| 2 (H-r3-2, R8 Añadir) | «una nueva llamada de Añadir retira el error anterior» | `waitFor` `:1027:18`, línea 1031 | `toBeNull`, recibe el `Text` con «Ya hay una comida a esa hora» |
| 3 (H1 `NUTRITION_PLAN_REQUIRED`) | su fila de «PATCH mapea $label como la tabla de R2» | `:497:99` | `resolves.toEqual` |
| 4 (H1 `MEAL_TIMES_LIMIT_REACHED`) | su fila | `:497:99` | `resolves.toEqual` |
| 5 (H1 otro código) | su fila | `:497:99` | `resolves.toEqual` |
| 6 (H1 no JSON) | su fila | `:497:99` | `resolves.toEqual` |
| 7 (H2 primera fila) | «Editar en la primera fila abre el selector con su hora y la publica como origen» | `:698:78` | `toEqual`, recibe `[19, 30]` |
| 8 (H3 401 en Añadir) | «401 en Añadir cierra sesión sin mensaje» | `waitFor` `:1044:18`, línea 1045 | `toHaveBeenCalledTimes`, 0 llamadas |

**Las 2 sondas que dejaron verde la ronda 3 (04:58:34Z–05:02:02Z).** Las dos
salen ahora con exit 1, 58/59, por matcher y solo en el `it` nuevo de E4:

- `N3-move-patch-after-ok` cae en «los controles siguen deshabilitados hasta que termina el refetch», en `:818:41` (`toBeNull`);
- `N3-clear-error-edit-only` cae en «una nueva llamada de Añadir retira el error anterior», en `:1027:18` (`toBeNull`).

**Controles de los «no bloqueante».** Siguen verdes, como clasifiqué en
§Pre-verificación §3 y §5:

- `N3-parallel-refetch` y `S-parallel` (`Promise.all`): 59/59, exit 0;
- `S-add-hour-plan-hold`: 59/59, exit 0.

**Regresión: 37 sondas rojas de las rondas 1–3**, entre las 04:58:34Z y las
05:06:41Z. Para cada sonda comparé el conjunto de `it` rojos con el de su log
anterior más reciente: `r3/regression/`, `r3/`, `probes2/` o `probes/`. El
resultado:

- las 37 siguen con exit 1;
- ninguna pierde un `it` rojo;
- ninguna da `suiteFail`.

Las sondas, por requisito:

- R2/R3: `R2-422-drop-limit`, `R2-okStatus-200`, `R3-okStatus-201`, `R3-url-encoded`, `R3-body`.
- R4: `R4-family`, `R4-a11y-label-param`.
- R5/R6: `R5-same-hour-calls`, `R5R6-setUTCHours`, `R6-default-00`.
- R7:
  - `R7-optimistic-add-rollback`, `R7-optimistic-move-rollback`, `R7-refetch-finally`, `R7-enable-before-refetch`;
  - `R7-refetch-on-401`, `R7-row-not-disabled`, `R7-add-no-refetch`, `R7-no-pet-refetch`.
- R8:
  - `R8-limit-key`, `R8-duplicate-key`, `R8-catch-key`, `R8-401-message`;
  - `R8-no-error-clear`, `R8-not-selectable`, `R8-error-after-add`.
- E1/R1/R9: `E1b-no-401-signout`, `E1a-extra-accent-soft`, `R1-es-literal`, `R9-missing-addMeal-use`.
- N de la ronda 2: `N-enable-between-refetches`, `N-no-await-pet-refetch`, `N-edit-nonok-refetch`, `N-add-ok-plan-only`.
- N3 de la ronda 3: `N3-add-patch-after-ok`, `N3-clear-error-add-only`, `N3-reverse-order`, `N3-third-row-enabled`.

Nueve sondas ganan rojos en los `it` de E4, y lo hacen donde deben:

| Sonda | Rojo nuevo | Antes → ahora |
|---|---|---|
| `R7-optimistic-move-rollback` | «los controles siguen deshabilitados…» (`:818`, matcher) | 1 → 2 failed |
| `R7-refetch-finally` | «401 en Añadir cierra sesión sin mensaje» | 14 → 15 |
| `R7-refetch-on-401` | «401 en Añadir…» | 1 → 2 |
| `R8-401-message` | «401 en Añadir…» | 1 → 2 |
| `E1b-no-401-signout` | «401 en Añadir…» | 2 → 3 |
| `R7-row-not-disabled` | «una nueva llamada de Añadir retira el error anterior» | 7 → 8 |
| `R8-no-error-clear` | «una nueva llamada de Añadir…» | 1 → 2 |
| `R8-duplicate-key` | «una nueva llamada de Añadir…» | 2 → 3 |
| `R2-422-drop-limit` | «PATCH mapea 422 MEAL_TIMES_LIMIT_REACHED como la tabla de R2» | 1 → 2 |

Hay dos casos más:

- **`R8-error-after-add` pasa de 11 a 12 rojos.** Esa sonda borra el nodo del
  error (`{false ? (`), así que el único rojo posible es por consulta. El `it`
  nuevo de E4-b espera ese nodo antes de pulsar Añadir, y cae igual que los 11
  anteriores (`meal-time-error`, «Unable to find»). Con el nodo borrado, ese
  rojo por consulta es la propia aserción de presencia, y así lo acepté en las
  rondas 1–3.
- **`R7-optimistic-move-rollback` sigue con 1 «Unable to find»**, el mismo de
  la ronda 1 (`19:30` en «mientras la edición vuela…»). Ahora además cae por
  matcher en `:818`.

Ninguna otra sonda tiene rojos por consulta.

### Barrido de la ronda 4

Apliqué la regla de §Pre-verificación §2 sin cambios sobre la tabla de §3, en
HEAD. Las filas que cambian:

| Cláusula | Rama / miembro | Candado (`it`) | Sonda | Estado |
|---|---|---|---|---|
| R3: «la misma tabla de R2» | 422 `NUTRITION_PLAN_REQUIRED`, 422 `MEAL_TIMES_LIMIT_REACHED`, 422 otro código, 422 no JSON | E4-c «PATCH mapea $label como la tabla de R2» (4 filas) | sondas 3–6, rojas en `:497:99` | candado (era **H1**) |
| R5: `value` y `from` = hora de la fila `i` | fila 0 (además de la 1, la última) | E4-d «Editar en la primera fila abre el selector con su hora y la publica como origen» | sonda 7, roja en `:698:78` | candado (era **H2**) |
| R8 IF 401: `signOut()` sin error | Añadir | E4-e «401 en Añadir cierra sesión sin mensaje» | sonda 8, roja en `:1044:18` | candado (era **H3**) |
| R7 WHILE: ni la hora nueva, Editar, tramo del refetch del plan | — | E4-a en «los controles siguen deshabilitados hasta que termina el refetch» | sonda 1 y `N3-move-patch-after-ok`, rojas en `:818:41` | candado (hueco 1 de la ronda 3) |
| R8 WHEN nueva llamada: retira el error | R6 (Añadir) | E4-b «una nueva llamada de Añadir retira el error anterior» | sonda 2 y `N3-clear-error-edit-only`, rojas en `:1027:18` | candado (hueco 2 de la ronda 3) |

Las demás filas de §3 no cambian: siguen «candado», y sus sondas de la
muestra siguen rojas. Los cuatro «no bloqueante» se mantienen y no bloquean:

1. R1, los literales en design.md. Lo leí: design.md no cambia desde `f64a3c60`.
2. R4, un solo `kind` distinto de `ok` como representante.
3. R7, la hora nueva en Añadir durante el refetch del plan (`S-add-hour-plan-hold`, verde).
4. R7, el orden plan → mascota frente a `Promise.all` (`S-parallel` / `N3-parallel-refetch`, verdes).

Busqué alguna cláusula que mencione un miembro que los candados nuevos dejen
fuera, y no encontré ninguna:

- E4-e solo comprueba que se rehabilita `meal-time-edit-0`, pero R8 IF 401 no
  pide rehabilitar: pide `signOut()` y que no haya error, y las dos cosas
  están aseveradas.
- E4.5 es un SHALL sobre el contenido de los tests. Lo verifiqué leyendo:
  cada `it` asevera lo que su paso de tasks.md dice.

**No queda ningún hueco bloqueante.**

### R4-Observaciones

Ninguna bloquea.

1. **La casilla del smoke de requirements.md (línea 344) sigue sin marcar.**
   Es el gate humano en dev build de Android. El leader no debe marcar #147
   como `done` hasta que el humano la cierre (CLAUDE.md, reglas duras).
2. **La fila R8 de traceability.md dice «llamada pendiente de Añadir».** Es
   prosa que describe el caso, no un estado. No dispara C5, pero la palabra
   puede confundir a un grep futuro que busque filas «pendiente».
3. **E4-e solo mira la rehabilitación en `meal-time-edit-0`.** R8 IF 401 no la
   exige, así que no es hueco. Lo apunto por si algún día se enmienda R8 para
   pedirla.
4. **init.sh vuelve a dar el aviso de jest «A worker process has failed to exit
   gracefully» en la suite móvil.** Ya salía en las rondas 1–3. No cambia el
   exit ni los totales.

### Output de ./init.sh (ronda 4)
Lo corrió el leader entre las 04:48:57Z y las 04:52:54Z. Leí
`init-review4.log`: `review4-head.txt` = `4f988319` e
`init-review4.exit` = `exit=0`. `4f988319..HEAD` solo toca
`progress/current.md`.
```
✅ Build exitoso
Test Suites: 174 passed, 174 total
Tests:       1335 passed, 1335 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
A worker process has failed to exit gracefully and has been force exited. …
Test Suites: 88 passed, 88 total
Tests:       1771 passed, 1771 total
✅ Tests pasados
Test Suites: 3 skipped, 28 passed, 28 of 31 total
Tests:       8 skipped, 423 passed, 431 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
