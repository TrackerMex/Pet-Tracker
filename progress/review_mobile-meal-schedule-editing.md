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
