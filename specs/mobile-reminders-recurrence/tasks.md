---
feature: "mobile-reminders-recurrence"
status: approved     # draft | approved
tags: [mobile, reminders, recurrence, spec]
---

# Tareas — [[mobile-reminders-recurrence]] (#213)

> Disciplina TDD. Cada requisito de [[requirements]] tiene sus tres pasos.
> **Commits test-primero obligatorios**: por cada grupo, primero un commit
> `test(mobile): … (R<n>)` con el test en rojo y después un commit
> `feat(mobile): … (R<n>)` con la implementación; nunca test e implementación
> en el mismo commit (C4 de `CHECKPOINTS.md`). Rutas relativas a
> `mobile-pet-tracker/`. Comandos con `cd` explícito y `bunx`, nunca `npx`.
> Rutas con corchetes o paréntesis no se pasan como posicional a jest.

## Paso 0 — base

- [ ] `git -C /home/claude/sites/Pet-Tracker-wt-213 merge origin/dev` (merge,
  nunca rebase). Después:
  `grep -cF "backgroundStyle" /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker/src/screens/reminders/index.tsx`
  debe imprimir `1` (#218 ya en `dev`). Si imprime `0`, parar y anotarlo en
  `progress/impl_mobile-reminders-recurrence.md` (ver `design.md` §Orden de
  merge); no implementar R19.
- [ ] Si el merge trae #208, #209 o #214, re-medir las expresiones de mano de
  `#194 R1` y `#186 R5`, y los totales de esquinas de
  `consistency-classnames` (55 y 53 en la base), sumando sus deltas antes de
  añadir los de R22; y añadir `recurrence: null, recurrenceUntil: null` a los
  fixtures `Reminder` tipados que traigan (`design.md` §Orden de merge).

## R1 — tipos `Recurrence` y campos de `Reminder`

- [ ] (1) Test rojo `#213 R1: listReminders conserva recurrence y recurrenceUntil del backend` en `src/api/__tests__/reminders.test.ts`. **El rojo de R1 es de tipos, no de jest.** `listReminders` devuelve el JSON tal cual y `jest-expo` compila con babel sin comprobar tipos, así que el `it` nace verde en jest. El test lee los campos tipados del resultado (`const [reminder] = result.reminders;` tras estrechar `result.kind === 'ok'`, y `expect(reminder.recurrence).toEqual(…)` / `expect(reminder.recurrenceUntil).toBe(…)`), de modo que el rojo es
  `cd /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker && bunx tsc --noEmit; echo "exit=$?"`
  con salida distinta de 0 y un error `TS2339` («Property 'recurrence' does not exist on type 'Reminder'») en `src/api/__tests__/reminders.test.ts`. El commit `test(mobile): … (R1)` cita ese error y anota en `progress/impl_mobile-reminders-recurrence.md` que jest sale verde.
- [ ] (2) `Recurrence` y campos obligatorios en `src/api/types.ts`; añadir `recurrence: null, recurrenceUntil: null` a los fixtures tipados de `design.md` §Datos; `cd /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker && bunx tsc --noEmit` en 0.
- [ ] (3) Refactor con tests verdes.

## R2 — cuerpo de `createReminder`

- [ ] (1) Test rojo `#213 R2: createReminder envía el cuerpo %s`.
- [ ] (2) Spread condicional de `recurrence` y `recurrenceUntil`; los tests de cuerpo exacto existentes siguen verdes sin tocarlos.
- [ ] (3) Refactor.

## R3 — `cancelReminderSeries`

- [ ] (1) Tests rojos `#213 R3: …` (mapeo, PATCH, sin baseUrl y `#213 R3: cancelReminderSeries devuelve unreachable si fetch lanza`).
- [ ] (2) Función y `CancelReminderSeriesState` con `patchJson`.
- [ ] (3) Refactor (sin extraer helper común con `deleteReminder`).

## R4 — chips de Repetición

- [ ] (1) Tests rojos `#213 R4: …`. El doble de reicon del fichero añade `Repeat`, `Minus` y `Plus` con testID `add-reminder-icon-repeat`, `add-reminder-icon-minus`, `add-reminder-icon-plus`.
- [ ] (2) `REPEAT_OPTIONS` con `labelKey`, estado `repeat`, sección entre Fecha/Hora y Aviso.
- [ ] (3) Refactor.

## R5 — filas horizontales de Tipo y Aviso

- [ ] (1) Test rojo `#213 R5: Tipo y Aviso son filas horizontales sin salto de línea`.
- [ ] (2) `ScrollView horizontal` `type-chips-row` y `advance-chips-row` (`design.md` §Formulario). Ancla: `grep -cF "flex-row flex-wrap gap-2" src/screens/add-reminder/index.tsx` = 1. Los `it` existentes `renders all reminder types and selects vaccine by default` (`/^type-chip-/` → 7) y `renders alert choices and selects seven days by default` (`/^advance-chip-/` → 4) siguen verdes sin tocarlos.
- [ ] (3) Refactor.

## R6 — stepper de horas

- [ ] (1) Tests rojos `#213 R6: …`.
- [ ] (2) Stepper con `hourEvery` (8, límites 1–24), receta de `design.md`.
- [ ] (3) Refactor.

## R7 — stepper de meses y ausencia del stepper

- [ ] (1) Tests rojos `#213 R7: …`.
- [ ] (2) Mismo bloque con `monthEvery` (1, límites 1–12).
- [ ] (3) Refactor.

## R8 — Hasta

- [ ] (1) Tests rojos `#213 R8: …` (con `until-picker` y `until-field-clear`).
- [ ] (2) Sección «Hasta» con `DateField allowClear`; vaciado al mover la fecha.
- [ ] (3) Refactor.

## R9 — Aviso oculto con «Cada N horas»

- [ ] (1) Test rojo `#213 R9: Cada N horas oculta Aviso y envía advanceMinutes 0`.
- [ ] (2) Render condicional y `advanceMinutes: 0`.
- [ ] (3) Refactor.

## R10 — cuerpo al guardar

- [ ] (1) Test rojo `#213 R10: guarda %s con su cuerpo exacto`.
- [ ] (2) `handleSubmit` pasa `recurrence` / `recurrenceUntil` según el chip.
- [ ] (3) Refactor.

## R11 — frases de la nota por unidad

- [ ] (1) Tests rojos `#213 R11: …` con la tabla a–j de `requirements.md` (TZ y timers como `#178 R12`).
- [ ] (2) `summaryText(...)` y cambio de icono `Repeat` / `Bell`.
- [ ] (3) Refactor.

## R12 — tomas de «Cada N horas»

- [ ] (1) Test rojo `#213 R12: con %i horas la nota dice «%s»` (tabla a–h; `it.each(...)(name, fn, 15000)`; espera con `waitFor` sobre `add-reminder-preview-text`).
- [ ] (2) Regla N ∈ {6, 8, 12, 24} y frases de intervalo; unión con `t('addReminder.dosesJoin', { list, last })` en forma corta (`design.md` §Formulario). Ancla: `grep -cE "\b(last|first|odd|even):" src/screens/add-reminder/index.tsx` = 0, y `#62 R6 … variantes de posición` de `src/__tests__/consistency-classnames.test.ts` sigue verde sin tocarlo.
- [ ] (3) Refactor.

## R13 — nombre de la mascota

- [ ] (1) Test rojo `#213 R13: sin nombre de mascota (%s) la nota usa la variante sin nombre`, it.each de las tres filas de `requirements.md` R13 (`falla`, `sin la mascota`, `sin resolver`); las dos primeras esperan con `waitFor` sobre `add-reminder-preview-text`, la tercera aserta síncrono con `listPets` en `mockReturnValue(new Promise(() => {}))`. El render del fichero gana `QueryClientProvider` y el doble de `listPets` con `beforeEach` de nivel superior; los tests existentes del fichero siguen verdes.
- [ ] (2) `useQuery(petKeys.list())` y variante `summaryHoursDosesNoPet`.
- [ ] (3) Refactor.

## R14 — línea «Se repite …»

- [ ] (1) Tests rojos `#213 R14: …` (tabla a–j, hoy 30 dic 2026). El doble de reicon del fichero añade `Repeat: mockIcon('reminders-icon-repeat')`; `makeReminder` gana `recurrence: null, recurrenceUntil: null`; el doble de `../../api/reminders` gana `cancelReminderSeries: jest.fn()` y el fichero declara `const mockCancelReminderSeries = jest.mocked(cancelReminderSeries);` junto a `mockDeleteReminder`.
- [ ] (2) `cadenceText(...)` y línea con `isoToLocalDate` para el hasta.
- [ ] (3) Refactor.

## R15 — Cancelar serie / Eliminar

- [ ] (1) Tests rojos `#213 R15: …`.
- [ ] (2) Un solo `<Button>` con testID, texto, etiqueta y `onPress` según el caso. Ancla: `grep -cF "rounded-14 px-2.5" src/screens/reminders/index.tsx` = 1.
- [ ] (3) Refactor.

## R16 — badge «Hoy»

- [ ] (1) Test rojo `#213 R16: el badge Hoy y el borde ámbar solo marcan el día de hoy`.
- [ ] (2) `upcoming = !inactive && days === 0`; `reminders.upcoming` = «Hoy» / «Today».
- [ ] (3) Enmendar en `src/screens/reminders/index.test.tsx` esta lista cerrada de siete `it` del umbral de 10 días, añadiendo « (enmendado por #213 R16)» al final de cada nombre. El fixture compartido `canvasReminders` **no se toca** (lo usan varios `describe`; hoy es 2026-12-30T15:00Z y su fila `a` vence el 2027-01-02T15:00Z, a 3 días). Para los `it` que necesitan una fila de hoy se declara, justo después de `canvasReminders`, la constante nueva
  `const todayCanvasReminders = canvasReminders.map((reminder) => (reminder.id === 'a' ? { ...reminder, dueAt: '2026-12-30T23:00:00.000Z' } : reminder)); // #213 R16`
  (17:00 local del mismo día que `now`, 09:00 local). Lista:
  1. `R6: lista con pills, badges y refetch on focus` :: `renders summaries and reminder rows in API order`: `expect(screen.getByTestId('reminder-upcoming-upcoming')).toHaveTextContent('¡Próximo!')` pasa a `expect(screen.queryByTestId('reminder-upcoming-upcoming')).toBeNull(); // #213 R16` (la fila vence a 3 días).
  2. `#84 R3: …` :: `08:00 del 10 de septiembre: hoy a las 20:00, +7 y +10 días a las 09:00 cuentan 0, 7 y 10`: `week.getByTestId('reminder-upcoming-week-edge')).toBeVisible()` y `badge.getByTestId('reminder-upcoming-badge-edge')).toBeVisible()` pasan a `week.queryByTestId(…)).toBeNull(); // #213 R16` y `badge.queryByTestId(…)).toBeNull(); // #213 R16`; solo `today-later` conserva badge.
  3. `#84 R6: …` :: `08:00 del 10 de septiembre: +8 días queda fuera de la semana con badge y +11 días queda sin badge`: `screen.getByTestId('reminder-upcoming-plus-eight')).toBeVisible()` pasa a `screen.queryByTestId('reminder-upcoming-plus-eight')).toBeNull(); // #213 R16`.
  4. `#178 R6: fila del canvas` :: `distingue las recetas de fila próxima, lejana e inactiva (enmendado por #204 R7)`: primera línea del cuerpo, antes de `await renderReminders();`, `mockListReminders.mockResolvedValue({ kind: 'ok', reminders: todayCanvasReminders });`.
  5. `#178 R7: entrada escalonada y badge` :: `envuelve el badge próximo con PopIn y la receta del canvas (enmendado por #204 R7)`: la misma primera línea, y `expect(badge).toHaveTextContent('¡Próximo!')` pasa a `expect(badge).toHaveTextContent('Hoy')`.
  6. `#204 R7: ámbar de la fila próxima` :: `#204 R7: la fila próxima y su badge usan el ámbar del canvas`: la misma primera línea.
  7. `#178 R7: entrada escalonada y badge` :: `reserva el pop para la fila próxima y lo omite en la lejana` (con `canvasReminders`, sin la constante nueva): `expect(screen.getByTestId('reminder-upcoming-pop-a')).toBeVisible()` pasa a `expect(screen.queryByTestId('reminder-upcoming-pop-a')).toBeNull()`; se enmienda la expectativa, no el fixture.

  Anclas, desde `mobile-pet-tracker/` (base → nuevo):
  - `grep -cF "(enmendado por #213 R16)" src/screens/reminders/index.test.tsx` → 0 + 7 = 7;
  - `grep -cF "// #213 R16" src/screens/reminders/index.test.tsx` → 0 + 5 = 5 (constante + 4 `toBeNull` de los puntos 1–3);
  - `grep -cF "todayCanvasReminders" src/screens/reminders/index.test.tsx` → 0 + 4 = 4 (declaración + puntos 4–6; el `it` nuevo de R16 lleva sus propios fixtures con `makeReminder` y no la usa);
  - `grep -cF "¡Próximo!" src/screens/reminders/index.test.tsx` → 2 − 2 = 0 y `grep -cF "¡Próximo!" src/i18n/catalog.ts` → 1 − 1 = 0.

  Medido con la semilla: los siete `it` en verde. Si cae otro `it` solo por el umbral, parar y anotarlo en `progress/impl_mobile-reminders-recurrence.md` con su nombre y la línea que cae; la lista es cerrada.

## R17 — hoja «Cancelar serie»

- [ ] (1) Tests rojos `#213 R17: …` (mascotas: «Rocky» para el cuerpo con nombre; `listPets` sin la mascota para la variante sin nombre).
- [ ] (2) `cancelCandidate`, hoja hermana dentro del único `BottomSheetView`, `index` y `onClose` compartidos.
- [ ] (3) Refactor. Ancla: `grep -cE "<BottomSheet([^A-Za-z]|$)" src/screens/reminders/index.tsx` = 1 (no cuenta `<BottomSheetView>`; `grep -cF "<BottomSheet"` daría 2 en la base y no es el ancla).

## R18 — confirmar y errores

- [ ] (1) Tests rojos `#213 R18: …`; el it.each de errores lleva cinco filas, con `throws` (`mockCancelReminderSeries.mockRejectedValue(new Error('x'))` → valor es-MX de `common.somethingWentWrong`). Esperas sobre el árbol (`requirements.md` R18).
- [ ] (2) `handleCancelSeries` con `useQueryClient().invalidateQueries`, calcado de `handleDelete`: `try` + `switch` + `catch`. Anclas, desde `mobile-pet-tracker/` (base → nuevo): `grep -cF "t('common.cannotReachServer'" src/screens/reminders/index.tsx` → 1 + 1 = 2; `grep -cF "t('common.somethingWentWrong'" src/screens/reminders/index.tsx` → 3 + 2 = 5; `grep -cF "signOut(" src/screens/reminders/index.tsx` → 1 + 1 = 2.
- [ ] (3) Refactor.

## R19 — fondo heredado de #218

- [ ] (1) Test rojo `#213 R19: la hoja Cancelar serie hereda el fondo surface de #218` (misma consulta del `community-bottom-sheet` que usa `#218 R1`). Solo si el Paso 0 dio `1`.
- [ ] (2) Ninguna implementación extra si R17 comparte el `BottomSheet`; si el test nace verde, anotarlo en el impl como «verde por R17 + #218».
- [ ] (3) Refactor.

## R20 — `notificationHref` de recordatorios

- [ ] (1) Test rojo `#213 R20: …` en `src/hooks/use-push-registration.test.tsx`, un `describe` nuevo que copia el cuerpo del it.each de `#100 R7` (la tabla de `#100 R7` no se toca).
- [ ] (2) Rama `kind === 'reminder'` en `notificationHref`.
- [ ] (3) Refactor.

## R21 — parámetro `petId`

- [ ] (1) Tests rojos `#213 R21: …`. El doble de `expo-router` del fichero gana `useLocalSearchParams: () => mockSearchParams` con `let mockSearchParams: Record<string, unknown> = {}` reiniciado en `beforeEach`.
- [ ] (2) `useLocalSearchParams` + efecto con `selectPet`.
- [ ] (3) Refactor.

## R22 — catálogo y guardas

- [ ] (1) Test rojo `#213 R22: claves de recurrencia en ambos idiomas` en `src/providers/__tests__/language-provider.test.tsx` (it.each de las 55 filas de `design.md` §Copy con su valor es-MX y en-US).
- [ ] (2) Claves en `src/i18n/catalog.ts` (es-MX y en-US).
- [ ] (3) Enmiendas de guardas. **Lista cerrada**: cada `it` enmendado gana « (enmendado por #213 R22)» al final de su nombre, salvo los `it.each` que solo ganan casos porque crece la tabla que recorren (`#177 R4.1`, `#177 R4.2`, `#62 R14 %s importa y aplica sus %i esquinas`), que no se renombran. Cada literal «base» de abajo aparece una sola vez en su fichero en la base `8b4cb1bd` (`grep -cF` = 1), salvo donde se dice otra cifra. Rutas desde `mobile-pet-tracker/`.

  **Catálogo y copy**
  1. `src/__tests__/ui-copy-table.ts`, `R8_REMINDERS`: +57 filas, cada una con comentario `// #213 R22`:
     - 32 `{ file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.…' }`;
     - 22 `{ file: 'src/screens/reminders/index.tsx', key: 'reminders.…' }`;
     - 1 `{ file: 'src/screens/reminders/index.tsx', key: 'common.cannotReachServer' }`;
     - 2 `{ file: 'src/screens/reminders/index.tsx', key: 'common.somethingWentWrong' }` (el handler de R18 tiene dos llamadas nuevas: la rama `default` del `switch` y el `catch`).

     Ancla: `grep -cF "// #213 R22" src/__tests__/ui-copy-table.ts` → 0 + 57 = 57. `ALL_USES` y su test de suma no cambian (suma estructural).
  2. `src/__tests__/ui-language.test.ts`, `#186 R5: resuelve las 56 ocurrencias normativas`: el nombre pasa a `#186 R5: resuelve las 113 ocurrencias normativas (enmendado por #213 R22)` (56 + 57), y la expresión `50 + 1 - 2 + 1 - 1 + 1 + 1 + 1 + 1 + 3 + 3 - 3` gana `+ 57 // #213 R22`.
  3. `src/__tests__/ui-language.test.ts`, `#65 R18` `resuelve cada ocurrencia de la tabla contra la clave exacta` (`checkUses(ALL_USES)`): no lleva cifra y no se toca; pasa a verde con las 57 filas del punto 1. Si cae, falta o sobra una fila del punto 1: corregir la tabla, no el `it`.
  4. `src/providers/__tests__/language-provider.test.tsx`, `#194 R1: mantiene la base más las claves de #68 …`: la línea `        + 5 - 2, // #220 R16` pasa a `        + 5 - 2 // #220 R16` y debajo `        + 54, // #213 R22` (54 claves nuevas; la fila 55 de `design.md` §Copy, `reminders.upcoming`, cambia de valor y no es clave nueva).

  **design-drift** (`src/__tests__/design-drift.test.ts`)
  5. `importa exactamente los iconos prescritos desde un único import de reicon (enmendado por #220 R15)`: `'screens/reminders/index.tsx': ['Plus', 'Trash'],` → `['Plus', 'Repeat', 'Trash'],`; `'screens/add-reminder/index.tsx': ['Bell'], // #220 R15` → `['Bell', 'Minus', 'Plus', 'Repeat'], // #220 R15; #213 R22`.
  6. `reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto …`: `[/\brounded-16\b/g, 5]` → `[/\brounded-16\b/g, 5 + 2]` (confirm y keep de la hoja de R17); `rounded-14` sigue 2 y `rounded-22` sigue 1. En el mapa `rounded16` (fuera de Recordatorios) `      'screens/add-reminder/index.tsx': 1,` → `      'screens/add-reminder/index.tsx': 1 + 1, // #213 R6` (fila del stepper).
  7. `preserves every mutation sign-out with zero delta (enmendado por #200 R1)`, mapa `screenSignOutCalls` del `describe` `#87 R19`: `    'screens/reminders/index.tsx': 1,` → `    'screens/reminders/index.tsx': 1 + 1, // #213 R18` (rama `unauthorized` del handler de R18).
  8. `limita text-22 a Horario y text-17 al inventario de E1.2 (enmendado por #177 R10) (enmendado por #200 R5) (enmendado por #198 R15)`, lista de `text-22`: después de `      'components/empty-state.tsx', // #198 R15` se inserta `      join('screens', 'add-reminder', 'index.tsx'), // #213 R6` (valor del stepper).

  **alerts-canvas-fidelity** (`src/__tests__/alerts-canvas-fidelity.test.ts`)
  9. `declara el secundario compacto y el reintento sin labio (enmendado por #180 R12) (enmendado por #197 R21)`, lista de `text-15` (`#174 R12`): después de `        'screens/add-pet/index.tsx', // #191 R11` se inserta `        'screens/add-reminder/index.tsx', // #213 R6` («Cada» del stepper).

  **consistency-classnames** (`src/__tests__/consistency-classnames.test.ts`)
  10. `directUses` del `describe` `#62 R14`: `[join('screens', 'add-reminder', 'index.tsx'), 3 + 1 - 2], // #178 R12; #220 R15` → `[join('screens', 'add-reminder', 'index.tsx'), 3 + 1 - 2 + 1], // #178 R12; #220 R15; #213 R6` (2 → 3; el `it.each` `%s importa y aplica sus %i esquinas` cambia solo de caso).
  11. `fusiona la esquina una vez y la entrega a las dos ramas de Card …` (55 → 56) y `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban …` (53 → 54): el literal `      + 1 - 1 - 2 // #220 R4; #220 R14; #220 R15` aparece **dos** veces en la base (`grep -cF` = 2), una por `it`; debajo de cada una se inserta `      + 1 // #213 R6`.
  12. `inventaría los cinco secundarios neutros de toda la app …`: después de `      'pairing-unpair-cancel', // #203 R7` se inserta `      'reminders-cancel-series-keep', // #213 R17`; y `expect(count(/border-lip-gray/g)).toBe(4 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1);` → `….toBe(4 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 2 + 1); // #213 R6 (+2); #213 R17 (+1)` (12 → 15).

  **chunky-cta-canvas-fidelity** (`src/__tests__/chunky-cta-canvas-fidelity.test.ts`)
  13. `NEUTRAL_ROWS` (nivel de fichero): después de la fila `literalId('reminders-delete-cancel')` se inserta
      `  ['screens/reminders/index.tsx', literalId('reminders-cancel-series-keep'), 'w-full h-14 rounded-16 border-2 border-lip-gray bg-surface', 'outline', 'Text', 'text-17 font-extrabold text-foreground', []], // #213 R17`.
      Alimenta sin más cambios `#177 R4.1`, `#177 R4.2` (un caso nuevo cada uno) y el caso `neutral` de `#177 R8.1: solo la tabla recibe chunkyLip.%s` (lee `neutralIds`).
  14. `neutralInventory` (nivel de fichero), que lee `#177 R4.3: conserva los nueve secundarios neutros …`: `'pairing-unpair-cancel', 'reminders-delete-cancel',` → `'pairing-unpair-cancel', 'reminders-cancel-series-keep', 'reminders-delete-cancel',`.
  15. `#177 R6.2: recuentos de etiquetas …`: `expect(count(/text-17/g)).toBe(8 + 15 + 1 + 1 + 1 + 1 + 1 + 1 + 1);` → `… + 1 + 2); // #213 R17` (30 → 32); `expect(count(/text-17 font-extrabold text-foreground/g)).toBe(3 + 3 + 1 + 1);` → `… + 1 + 1); // #213 R17` (8 → 9). Los demás `expect` del `it` no cambian (medido con la semilla).
  16. `#177 R7.1: inventarios de los labios de borde restantes …`: `expect(count(/border-lip-gray/g)).toBe(10 + 1 + 1);` → `….toBe(10 + 1 + 1 + 2 + 1); // #213 R6 (+2); #213 R17 (+1)` (12 → 15).
  17. `#177 R7.3: inventario de los veintisiete radios de dieciséis …`, mapa `radii` (nivel de fichero): `  'screens/add-reminder/index.tsx': 1,` → `  'screens/add-reminder/index.tsx': 1 + 1, // #213 R6`; `  'screens/reminders/index.tsx': 5, // #204 R9` → `  'screens/reminders/index.tsx': 5 + 2, // #204 R9; #213 R17`; y la suma que acaba en `+ 2 + 1 + 1 + 1 + 1); // #204 R9 (+1)` gana `+ 3` antes del paréntesis, con comentario `// #213 R6 (+1); #213 R17 (+2)` (42 → 45).
  18. `#177 R7.5: inventario de los tres estilos y el tile …`: `[...NEUTRAL_ROWS.map(([path]) => [path, 1]), ['screens/meal-schedule/index.tsx', 1]]` → `[...NEUTRAL_ROWS.map(([path]) => [path, path === 'screens/reminders/index.tsx' ? 2 : 1]), ['screens/meal-schedule/index.tsx', 1]]` (reminders 1 → 2: delete-cancel y keep).

  `SCREEN_FILES` no cambia. Medido con la semilla: las 18 enmiendas en verde y ninguna otra guarda cae. **Si cae otra guarda, parar y anotarla** en `progress/impl_mobile-reminders-recurrence.md` con su nombre, la cifra base y la que da; no se enmienda fuera de esta lista.

## `it` que nacen verdes

Estos `it` no tienen rojo en jest al escribirse; el commit `test(mobile): … (R<n>)` los lleva igual y el impl los anota en `progress/impl_mobile-reminders-recurrence.md` con la frase «nace verde: <motivo>». Lista cerrada:

1. `#213 R1: listReminders conserva recurrence y recurrenceUntil del backend`: su rojo es `bunx tsc --noEmit` (§R1), no jest.
2. `#213 R14: sin línea de repetición si no hay recurrencia o la serie no está programada`: hoy no hay línea.
3. `#213 R15: una serie cancelada o enviada conserva Eliminar` (filas `cancelled` y `sent`): hoy toda fila tiene Eliminar.
4. `#213 R19: la hoja Cancelar serie hereda el fondo surface de #218`: verde por R17 + #218 (§R19).
5. `#213 R21: un petId desconocido deja la primera mascota`: hoy siempre se selecciona la primera.

No cuentan las filas verdes dentro de un `it.each` que ya cae por otras filas (R2 fila 1, R7 `once`, R8 y R10 «Una vez»).

## Verificación final (Codex, sin `./init.sh`)

- [ ] `cd /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker && bunx tsc --noEmit`
- [ ] `cd /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker && bunx jest src/api src/app/__tests__ src/screens/add-reminder src/screens/reminders src/screens/home src/hooks src/providers src/__tests__` (`src/app/__tests__` monta add-reminder y reminders con el `RootLayout` real y su `listPets` sin mockear, `reminders-alerts-stack.navigation`).
- [ ] `cd /home/claude/sites/Pet-Tracker-wt-213/mobile-pet-tracker && bunx expo lint --no-cache > /tmp/lint-213.log 2>&1; echo $?` y revisar el log entero.
- [ ] Rellenar `traceability.md` con el hash de cada commit (sin rebase después).
