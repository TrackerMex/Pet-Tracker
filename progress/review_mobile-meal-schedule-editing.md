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
